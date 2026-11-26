"""Frozen, paired synthetic benchmark v4 for FitSync issue #2.

Compares three pipelines on the exact same newly frozen, unseen synthetic corpus:
1. baseline : raw image + v1 parser/cascade (from vendor_preflight)
2. v3       : prior v3 shadow+cyan preprocessing + v1 parser/cascade (EXP-CF6C1C366C12 method)
3. v4       : adaptive shadow/washout + chroma-normalized diagram suppression + multi-anchor v4 cascade

Strictly synthetic, local CPU only, zero database writes, zero raw OCR payloads in committed outputs.
"""
from __future__ import annotations

import hashlib
import json
import math
import os
import re
import statistics
import sys
import time
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageOps
from rapidocr_onnxruntime import RapidOCR

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from contract import PROFILES, cells
from fixtures import CHALLENGE_VARIANTS, STANDARD_MODES, STRESS_MODES, render_fixture
from pipeline import balance_background, rapid_tokens, run_cascade_v4, tesseract_tokens

LOCK_PATH = ROOT / "vendor-v4-lock.json"
SEED_NAMESPACE = "fitsync-v4-holdout-2026-11-26"
BASE_SEED = 27112600


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def wilson_ci95(successes: int, total: int) -> list[float]:
    if total <= 0:
        return [0.0, 0.0]
    z = 1.959963985
    p = successes / total
    denom = 1.0 + z * z / total
    center = (p + z * z / (2.0 * total)) / denom
    margin = z * math.sqrt(p * (1.0 - p) / total + z * z / (4.0 * total * total)) / denom
    return [round(max(0.0, center - margin), 4), round(min(1.0, center + margin), 4)]


def percentile_ms(values: list[int], pct: float) -> int:
    if not values:
        return 0
    ordered = sorted(values)
    idx = max(0, math.ceil(pct * len(ordered)) - 1)
    return ordered[min(idx, len(ordered) - 1)]


# --- Prior v1/v3 reference implementations kept strictly intact for paired apples-to-apples comparison ---

def _v1_normalize(text: str) -> str:
    return re.sub(r"\W", "", text).casefold()


def _v1_parse(tokens: list[tuple[float, float, str]]) -> tuple[str | None, dict[str, float]]:
    top = _v1_normalize(" ".join(token[2] for token in sorted(tokens) if token[1] < 81))
    panel = _v1_normalize(" ".join(token[2] for token in sorted(tokens) if 81 <= token[1] < 154))
    matched = [
        key
        for key, (series, anchor, *_) in PROFILES.items()
        if _v1_normalize(series) in top and _v1_normalize(anchor) in panel
    ]
    if len(matched) != 1:
        return None, {}
    profile = matched[0]
    draft: dict[str, float] = {}
    for spec in cells(profile):
        line = " ".join(
            text
            for tx, ty, text in sorted(tokens)
            if spec.x - 28 <= tx <= spec.x + 417 and abs(ty - (spec.y + 13)) <= 15
        )
        expected = re.escape(spec.label).replace("/", r"\s*/\s*").replace(r"\ ", r"\s*").replace(" ", r"\s*")
        pattern = rf"{expected}\s*:\s*(\d{{1,3}}[.,]\d{{1,2}})\s*{re.escape(spec.unit)}"
        match = re.fullmatch(pattern, line.strip(), flags=re.IGNORECASE)
        if match:
            draft[spec.label] = float(match[1].replace(",", "."))
    return profile, draft


def _v1_cascade(engine: Any, image: Image.Image) -> tuple[str | None, dict[str, float], int]:
    started = time.perf_counter()
    first_profile, first = _v1_parse(tesseract_tokens(image))
    if first_profile and len(first) == len(cells(first_profile)):
        return first_profile, first, round((time.perf_counter() - started) * 1000)
    second_profile, second = _v1_parse(rapid_tokens(engine, image))
    elapsed = round((time.perf_counter() - started) * 1000)
    if first_profile and second_profile and first_profile != second_profile:
        return None, {}, elapsed
    if not first_profile:
        return second_profile, second, elapsed
    merged = {
        key: value
        for key, value in (first | second).items()
        if key not in first or key not in second or first[key] == second[key]
    }
    return first_profile, merged, elapsed


def _v3_correct_shadow(image: Image.Image) -> Image.Image:
    gray = np.asarray(ImageOps.grayscale(image))
    width = image.width // 12
    left = float(np.quantile(gray[:, :width], 0.80))
    right = float(np.quantile(gray[:, -width:], 0.80))
    return balance_background(image) if abs(left - right) >= 35 else image


def _v3_preprocess(image: Image.Image) -> Image.Image:
    original = image
    corrected = _v3_correct_shadow(image)
    rgb = np.asarray(original, dtype=np.int16)
    mask = (rgb[:, :, 0] >= 65) & (rgb[:, :, 1] >= 95) & (rgb[:, :, 2] >= 110) & (rgb[:, :, 2] - rgb[:, :, 0] >= 32)
    if not np.any(mask):
        return corrected
    cleaned = rgb.astype(np.uint8)
    cleaned[mask] = 250
    return _v3_correct_shadow(Image.fromarray(cleaned))


def _v3_run(engine: Any, image: Image.Image) -> tuple[str | None, dict[str, float], int]:
    started = time.perf_counter()
    pre = _v3_preprocess(image)
    pre_ms = round((time.perf_counter() - started) * 1000)
    profile, draft, ocr_ms = _v1_cascade(engine, pre)
    return profile, draft, pre_ms + ocr_ms


# --- Frozen v4 Corpus Specification ---

def fixture_cases() -> list[tuple[str, str, int, str, str]]:
    """Return (suite, family, source_id, mode, variant) tuples."""
    cases: list[tuple[str, str, int, str, str]] = []
    for f_idx, family in enumerate(PROFILES):
        offset = BASE_SEED + f_idx * 1000
        # 30 standard valid fixtures (5 per mode x 6 modes)
        for i in range(30):
            cases.append(("standard", family, offset + i, STANDARD_MODES[i % len(STANDARD_MODES)], "valid"))
        # 10 combined-degradation stress fixtures (5 shadow_jpeg + 5 tilt_washout)
        for i in range(10):
            cases.append(("stress", family, offset + 100 + i, STRESS_MODES[i % len(STRESS_MODES)], "valid"))
        # 5 negative & mutation challenge fixtures per profile
        for i, variant in enumerate(CHALLENGE_VARIANTS):
            cases.append(("challenge", family, offset + 200 + i, "flat", variant))
    return cases


def build_lock() -> dict[str, Any]:
    records = []
    pixel_hashes = set()
    for suite, family, source_id, mode, variant in fixture_cases():
        image, truth, meta = render_fixture(family, source_id, mode, variant, seed_namespace=SEED_NAMESPACE)
        pix_hash = sha256_bytes(image.tobytes())
        if pix_hash in pixel_hashes:
            raise RuntimeError(f"Duplicate fixture pixel hash for {family}/{source_id}")
        pixel_hashes.add(pix_hash)
        records.append(
            {
                "suite": suite,
                "family": family,
                "source_id": source_id,
                "mode": mode,
                "variant": variant,
                "mutated_field": meta["mutated_field"],
                "pixels_sha256": pix_hash,
                "expected_sha256": sha256_bytes(json.dumps(truth, sort_keys=True).encode()),
            }
        )
    # Optional disjointness check against prior vendor-v3-lock.json when present
    prior_overlap = None
    prior_lock = ROOT / "vendor-v3-lock.json"
    if prior_lock.exists():
        prior_data = json.loads(prior_lock.read_bytes())
        prior_hashes = {item["pixels"] for item in prior_data.get("fixtures", [])}
        prior_overlap = len(pixel_hashes & prior_hashes)
        if prior_overlap != 0:
            raise RuntimeError(f"New v4 freeze overlaps prior v3 lock by {prior_overlap} images!")

    script_names = ("benchmark_v4.py", "benchmark_v4.toml", "contract.py", "pipeline.py", "fixtures.py")
    return {
        "protocol": "fitsync-ocr-benchmark-v4",
        "seed_namespace": SEED_NAMESPACE,
        "base_seed": BASE_SEED,
        "prior_v3_pixel_overlap": prior_overlap,
        "inputs": {name: sha256_bytes((ROOT / name).read_bytes()) for name in script_names if (ROOT / name).exists()},
        "fixtures": records,
    }


def score_case(
    recognized: str | None,
    fields: dict[str, float],
    expected: dict[str, float],
    variant: str,
    mutated_field: str,
    ms: int,
    dropped_conflicts: int = 0,
) -> dict[str, Any]:
    is_negative_doc = variant in {"unknown", "ambiguous_panel"}
    exact = sum(fields.get(k) == v for k, v in expected.items())
    missing = sum(k not in fields for k in expected)
    wrong = sum(expected.get(k) != v for k, v in fields.items())
    wrong_side = int(variant == "swapped_laterality" and mutated_field in fields)
    wrong_unit = int(variant == "wrong_unit" and mutated_field in fields)
    wrong_metric = int(variant == "wrong_metric_identity" and mutated_field in fields)
    unsupported_accepted = int(is_negative_doc and (recognized is not None or bool(fields)))
    return {
        "expected": len(expected),
        "exact": exact,
        "missing": missing,
        "wrong": wrong,
        "wrong_side": wrong_side,
        "wrong_unit": wrong_unit,
        "wrong_metric_identity": wrong_metric,
        "unsupported_accepted": unsupported_accepted,
        "dropped_conflicts": dropped_conflicts,
        "ms": ms,
    }


def summarize(rows: list[dict[str, Any]]) -> tuple[dict[str, Any], dict[str, Any]]:
    summary: dict[str, Any] = {}
    flat_metrics: dict[str, Any] = {}
    for family in PROFILES:
        summary[family] = {}
        f_rows = [r for r in rows if r["family"] == family]
        for method in ("baseline", "v3", "v4"):
            std_rows = [r[method] for r in f_rows if r["suite"] == "standard"]
            stress_rows = [r[method] for r in f_rows if r["suite"] == "stress"]
            chal_rows = [r[method] for r in f_rows if r["suite"] == "challenge"]
            all_rows = [r[method] for r in f_rows]
            neg_rows = [r[method] for r in f_rows if r["variant"] in {"unknown", "ambiguous_panel"}]

            std_complete = sum(r["exact"] == r["expected"] and r["wrong"] == 0 for r in std_rows)
            stress_complete = sum(r["exact"] == r["expected"] and r["wrong"] == 0 for r in stress_rows)
            by_mode: dict[str, Any] = {}
            for mode in STANDARD_MODES + STRESS_MODES:
                m_rows = [r[method] for r in f_rows if r["mode"] == mode and r["variant"] == "valid"]
                by_mode[mode] = {
                    "complete": sum(r["exact"] == r["expected"] and r["wrong"] == 0 for r in m_rows),
                    "total": len(m_rows),
                    "exact_fields": sum(r["exact"] for r in m_rows),
                    "expected_fields": sum(r["expected"] for r in m_rows),
                    "missing_fields": sum(r["missing"] for r in m_rows),
                    "wrong_fields": sum(r["wrong"] for r in m_rows),
                }

            times = [r["ms"] for r in all_rows]
            stats = {
                "standard_valid": len(std_rows),
                "standard_complete_reports": std_complete,
                "standard_complete_ci95": wilson_ci95(std_complete, len(std_rows)),
                "standard_exact_fields": sum(r["exact"] for r in std_rows),
                "standard_expected_fields": sum(r["expected"] for r in std_rows),
                "standard_missing_fields": sum(r["missing"] for r in std_rows),
                "stress_valid": len(stress_rows),
                "stress_complete_reports": stress_complete,
                "stress_complete_ci95": wilson_ci95(stress_complete, len(stress_rows)),
                "stress_exact_fields": sum(r["exact"] for r in stress_rows),
                "stress_expected_fields": sum(r["expected"] for r in stress_rows),
                "stress_missing_fields": sum(r["missing"] for r in stress_rows),
                "wrong_values_total": sum(r["wrong"] for r in all_rows),
                "wrong_sides_total": sum(r["wrong_side"] for r in chal_rows),
                "wrong_units_total": sum(r["wrong_unit"] for r in chal_rows),
                "wrong_metric_identity_total": sum(r["wrong_metric_identity"] for r in chal_rows),
                "unknown_rejected": sum(1 - r["unsupported_accepted"] for r in neg_rows),
                "unknown_total": len(neg_rows),
                "unsupported_accepted": sum(r["unsupported_accepted"] for r in all_rows),
                "dropped_conflicts": sum(r["dropped_conflicts"] for r in all_rows),
                "p50_ms": int(round(statistics.median(times))),
                "p95_ms": percentile_ms(times, 0.95),
                "by_mode": by_mode,
            }
            summary[family][method] = stats
            prefix = f"{family}_{method}_"
            for key in (
                "standard_complete_reports",
                "standard_exact_fields",
                "standard_expected_fields",
                "standard_missing_fields",
                "stress_complete_reports",
                "stress_exact_fields",
                "stress_expected_fields",
                "wrong_values_total",
                "wrong_sides_total",
                "wrong_units_total",
                "wrong_metric_identity_total",
                "unknown_rejected",
                "unknown_total",
                "unsupported_accepted",
                "p50_ms",
                "p95_ms",
            ):
                flat_metrics[prefix + key] = stats[key]
    return summary, flat_metrics


def main() -> None:
    if sys.argv[1:] == ["lock"]:
        if LOCK_PATH.exists():
            raise RuntimeError(f"Lock file already exists: {LOCK_PATH}")
        LOCK_PATH.write_text(json.dumps(build_lock(), indent=2) + "\n")
        print(f"Wrote lock {LOCK_PATH} sha256={sha256_bytes(LOCK_PATH.read_bytes())}")
        return

    if not LOCK_PATH.exists():
        raise RuntimeError(f"Missing freeze lock {LOCK_PATH}; run 'benchmark_v4.py lock' first.")
    current_lock = build_lock()
    frozen_lock = json.loads(LOCK_PATH.read_bytes())
    if current_lock != frozen_lock:
        raise RuntimeError("Current code or synthetic fixtures differ from approved vendor-v4-lock.json!")

    engine = RapidOCR(intra_op_num_threads=2, inter_op_num_threads=2)
    rows: list[dict[str, Any]] = []
    for suite, family, source_id, mode, variant in fixture_cases():
        image, expected, meta = render_fixture(family, source_id, mode, variant, seed_namespace=SEED_NAMESPACE)
        mutated = meta["mutated_field"]

        b_prof, b_fields, b_ms = _v1_cascade(engine, image)
        v3_prof, v3_fields, v3_ms = _v3_run(engine, image)
        v4_draft = run_cascade_v4(engine, image)
        v4_prof = v4_draft["template_profile"]
        v4_fields = {f["source_label"]: f["value"] for f in v4_draft["fields"] if f["value"] is not None}

        rows.append(
            {
                "suite": suite,
                "family": family,
                "source_id": source_id,
                "mode": mode,
                "variant": variant,
                "baseline": score_case(b_prof, b_fields, expected, variant, mutated, b_ms),
                "v3": score_case(v3_prof, v3_fields, expected, variant, mutated, v3_ms),
                "v4": score_case(
                    v4_prof,
                    v4_fields,
                    expected,
                    variant,
                    mutated,
                    v4_draft["duration_ms"],
                    dropped_conflicts=v4_draft["summary"]["conflict_count"],
                ),
            }
        )

    summary, flat_metrics = summarize(rows)
    out = Path(os.environ.get("HEI_OUT", str(ROOT / "private")))
    out.mkdir(parents=True, exist_ok=True)
    artifact = out / "vendor-v4-aggregate.json"
    aggregate_doc = {
        "protocol": frozen_lock["protocol"],
        "seed_namespace": SEED_NAMESPACE,
        "lock_sha256": sha256_bytes(LOCK_PATH.read_bytes()),
        "prior_v3_pixel_overlap": frozen_lock["prior_v3_pixel_overlap"],
        "verified_record_writes": 0,
        "synthetic_only": True,
        "summary": summary,
        "metrics": flat_metrics,
        "rows": rows,
    }
    artifact.write_text(json.dumps(aggregate_doc, indent=2) + "\n")

    if "HEI_RUN_ID" in os.environ:
        result = {
            "schema": 1,
            "run_id": os.environ["HEI_RUN_ID"],
            "seed": int(os.environ["HEI_SEED"]),
            "dataset": os.environ["HEI_DATASET"],
            "compatibility": os.environ["HEI_COMPATIBILITY"],
            "runtime": {"hardware": os.uname().machine, "device": os.environ["HEI_DEVICE"]},
            "metrics": flat_metrics,
            "artifacts": {artifact.name: sha256_bytes(artifact.read_bytes())},
        }
        tmp = out / "result.tmp"
        tmp.write_text(json.dumps(result))
        tmp.replace(out / "result.json")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
