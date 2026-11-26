"""Versioned OCR body-composition draft contract for FitSync issue #2.

Synthetic-first, read-only draft schema aligned with #39 (FULL-REPORT) and #40 (OCR-PDF).
Never writes to Supabase or produces a verified coaching record without explicit PT confirmation.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

SCHEMA_VERSION = "fitsync.ocr.body-composition-draft/1"
ADAPTER_NAME = "fitsync-local-cascade"
ADAPTER_VERSION = "4.0.0"

FAILURE_CODES = (
    "unsupported_template",
    "ambiguous_template",
    "engine_conflict",
    "unreadable_document",
    "provider_timeout",
    "provider_unavailable",
    "invalid_input",
)

# Each profile preserves vendor-specific metric identity and units.
# Region codes remain display-side independent (left/right come strictly from printed labels).
PROFILES: dict[str, tuple[str, str, str, str, str | None, str | None]] = {
    "inbody_270_style": ("270 SERIES", "SEGMENTAL LEAN", "Lean mass", "kg", None, None),
    "tanita_780_style": ("780 SERIES", "SEGMENTAL MUSCLE", "Muscle mass", "kg", "Fat percentage", "%"),
}

TOTALS: dict[str, tuple[tuple[str, str], ...]] = {
    "inbody_270_style": (
        ("Weight", "kg"),
        ("Skeletal muscle", "kg"),
        ("Body fat mass", "kg"),
        ("Body fat", "%"),
        ("Total body water", "L"),
    ),
    "tanita_780_style": (
        ("Weight", "kg"),
        ("Muscle mass", "kg"),
        ("Body fat mass", "kg"),
        ("Body fat", "%"),
        ("Total body water", "kg"),
    ),
}

REGIONS: tuple[str, ...] = ("L arm", "R arm", "Trunk", "L leg", "R leg")

METRIC_IDS: dict[str, str] = {
    "Weight": "weight",
    "Skeletal muscle": "skeletal_muscle_mass",
    "Muscle mass": "muscle_mass",
    "Lean mass": "lean_mass",
    "Body fat mass": "fat_mass",
    "Body fat": "fat_percentage",
    "Fat percentage": "fat_percentage",
    "Total body water": "total_body_water",
}

REGION_IDS: dict[str, str] = {
    "L arm": "left_arm",
    "R arm": "right_arm",
    "Trunk": "trunk",
    "L leg": "left_leg",
    "R leg": "right_leg",
}


@dataclass(frozen=True)
class CellSpec:
    label: str
    unit: str
    x: int
    y: int
    metric: str
    region: str | None


def cells(profile: str) -> list[CellSpec]:
    if profile not in PROFILES:
        raise ValueError(f"Unsupported profile: {profile}")
    _, _, muscle, muscle_unit, fat, fat_unit = PROFILES[profile]
    slots: list[CellSpec] = [
        CellSpec(
            label=label,
            unit=unit,
            x=45,
            y=658 + 48 * i,
            metric=METRIC_IDS[label],
            region=None,
        )
        for i, (label, unit) in enumerate(TOTALS[profile])
    ]
    if profile == "inbody_270_style":
        positions = ((76, 310), (627, 310), (360, 416), (76, 523), (627, 523))
    else:
        positions = ((627, 300), (76, 300), (360, 400), (627, 503), (76, 503))
    for region, (x, y) in zip(REGIONS, positions):
        slots.append(
            CellSpec(
                label=f"{region} / {muscle}",
                unit=muscle_unit,
                x=x,
                y=y,
                metric=METRIC_IDS[muscle],
                region=REGION_IDS[region],
            )
        )
        if fat and fat_unit:
            slots.append(
                CellSpec(
                    label=f"{region} / {fat}",
                    unit=fat_unit,
                    x=x,
                    y=y + 36,
                    metric=METRIC_IDS[fat],
                    region=REGION_IDS[region],
                )
            )
    return slots


def evaluate_plausibility_warnings(profile: str, values: dict[str, float]) -> list[dict[str, Any]]:
    """Compute non-blocking PT review warnings for plausible-but-suspicious values.

    Never auto-edits or drops valid values; surfaces flags for side-by-side PT inspection.
    """
    warnings: list[dict[str, Any]] = []
    weight = values.get("Weight")
    fat_mass = values.get("Body fat mass")
    fat_pct = values.get("Body fat")
    if weight and weight > 0 and fat_mass is not None and fat_pct is not None:
        implied_pct = (fat_mass / weight) * 100.0
        if abs(implied_pct - fat_pct) > 2.0:
            warnings.append(
                {
                    "code": "fat_percentage_consistency_warning",
                    "fields": ["Body fat mass", "Body fat", "Weight"],
                    "detail": f"Implied body fat {implied_pct:.1f}% differs from printed {fat_pct:.1f}%.",
                }
            )
    if weight is not None and (weight < 30.0 or weight > 220.0):
        warnings.append(
            {
                "code": "out_of_typical_bounds",
                "fields": ["Weight"],
                "detail": "Weight is outside typical adult bounds (30-220 kg); verify printed sheet.",
            }
        )
    _, _, muscle_label, _, _, _ = PROFILES[profile]
    for left_region, right_region in (("L arm", "R arm"), ("L leg", "R leg")):
        left_key = f"{left_region} / {muscle_label}"
        right_key = f"{right_region} / {muscle_label}"
        left_val = values.get(left_key)
        right_val = values.get(right_key)
        if left_val is not None and right_val is not None and max(left_val, right_val) > 0:
            diff_ratio = abs(left_val - right_val) / max(left_val, right_val)
            if diff_ratio > 0.15:
                warnings.append(
                    {
                        "code": "asymmetry_review_required",
                        "fields": [left_key, right_key],
                        "detail": (
                            f"Bilateral difference {diff_ratio * 100:.1f}% exceeds 15%; "
                            "verify left/right labels against source crop."
                        ),
                    }
                )
    return warnings


def build_draft_envelope(
    profile: str | None,
    values: dict[str, float],
    *,
    failure_code: str | None = None,
    dropped_conflicts: list[str] | None = None,
    duration_ms: int = 0,
    engines_used: list[str] | None = None,
    synthetic: bool = True,
    image_size: tuple[int, int] = (1100, 960),
) -> dict[str, Any]:
    """Build a versioned, read-only PT review draft envelope."""
    if failure_code is not None and failure_code not in FAILURE_CODES:
        raise ValueError(f"Unknown failure code: {failure_code}")
    conflicts = set(dropped_conflicts or [])
    if profile is None:
        return {
            "schema": SCHEMA_VERSION,
            "adapter": {"name": ADAPTER_NAME, "version": ADAPTER_VERSION},
            "engines_used": list(engines_used or []),
            "synthetic": synthetic,
            "template_profile": None,
            "status": "rejected" if failure_code in {"unsupported_template", "ambiguous_template"} else "failed",
            "failure_code": failure_code or "unsupported_template",
            "duration_ms": duration_ms,
            "requires_pt_confirmation": True,
            "warnings": [],
            "summary": {
                "extracted_count": 0,
                "needs_review_count": 0,
                "conflict_count": len(conflicts),
                "warning_count": 0,
            },
            "fields": [],
        }

    spec = cells(profile)
    valid_labels = {item.label for item in spec}
    unexpected = values.keys() - valid_labels
    if unexpected:
        raise ValueError(f"Unexpected measurement labels for {profile}: {sorted(unexpected)}")

    width, height = image_size
    fields: list[dict[str, Any]] = []
    extracted_count = 0
    needs_review_count = 0
    for item in spec:
        value = values.get(item.label)
        is_conflict = item.label in conflicts
        if value is not None:
            extracted_count += 1
            state = "extracted"
        else:
            needs_review_count += 1
            state = "needs_review"
        fields.append(
            {
                "metric": item.metric,
                "region": item.region,
                "source_label": item.label,
                "source_unit": item.unit,
                "value": value,
                "state": state,
                "conflict_dropped": is_conflict,
                "confidence": None,  # Engine token confidence is uncalibrated; never present as probability.
                "evidence": {
                    "page": 1,
                    "box_px": [
                        max(0, item.x - 28),
                        max(0, item.y - 8),
                        min(width, item.x + 417),
                        min(height, item.y + 34),
                    ],
                },
            }
        )

    warnings = evaluate_plausibility_warnings(profile, values)
    return {
        "schema": SCHEMA_VERSION,
        "adapter": {"name": ADAPTER_NAME, "version": ADAPTER_VERSION},
        "engines_used": list(engines_used or []),
        "synthetic": synthetic,
        "template_profile": profile,
        "status": "draft",
        "failure_code": failure_code,
        "duration_ms": duration_ms,
        "requires_pt_confirmation": True,
        "warnings": warnings,
        "summary": {
            "extracted_count": extracted_count,
            "needs_review_count": needs_review_count,
            "conflict_count": len(conflicts),
            "warning_count": len(warnings),
        },
        "fields": fields,
    }
