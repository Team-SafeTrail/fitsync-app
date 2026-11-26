"""Synthetic multi-profile body-composition fixture generator for issue #2 benchmarks.

Generates synthetic InBody 270-like and Tanita MC-780-like fixtures with zero real health data.
Supports standard 6 capture conditions (apples-to-apples with vendor-preflight v1-v3),
combined stress conditions (shadow_jpeg, tilt_washout), and negative/challenge mutations.
"""
from __future__ import annotations

import io
import random
from functools import lru_cache

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

from contract import PROFILES, cells

FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
STANDARD_MODES: tuple[str, ...] = ("flat", "tilt", "shadow", "jpeg", "washout", "crop")
STRESS_MODES: tuple[str, ...] = ("shadow_jpeg", "tilt_washout")
CHALLENGE_VARIANTS: tuple[str, ...] = (
    "unknown",
    "ambiguous_panel",
    "swapped_laterality",
    "wrong_unit",
    "wrong_metric_identity",
)


@lru_cache
def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_PATH, size)


def render_fixture(
    profile: str,
    sequence: int,
    mode: str,
    variant: str = "valid",
    *,
    seed_namespace: str = "fitsync-public-spec-v1",
) -> tuple[Image.Image, dict[str, float], dict[str, str]]:
    """Render one synthetic report image and its independent ground-truth map.

    Returns (image, expected_readable_truth, metadata).
    """
    image = Image.new("RGB", (1100, 960), "#f7f9fa")
    draw = ImageDraw.Draw(image)
    series, panel, muscle_label, _, _, _ = PROFILES[profile]
    if variant == "unknown":
        series = "930 SERIES"
    elif variant == "ambiguous_panel":
        other = "tanita_780_style" if profile == "inbody_270_style" else "inbody_270_style"
        panel = PROFILES[other][1]

    draw.text((45, 28), "SYNTHETIC SAMPLE  |  " + series, font=font(30), fill="#132436")
    draw.text((45, 108), panel, font=font(25), fill="#132436")
    draw.text((45, 611), "WHOLE BODY / SAMPLE METRICS", font=font(25), fill="#132436")
    draw.ellipse((500, 172, 565, 237), outline="#81a9b7", width=5)
    draw.line((532, 232, 532, 480), fill="#81a9b7", width=12)
    draw.line((483, 280, 582, 280), fill="#81a9b7", width=7)

    rng = random.Random(f"{seed_namespace}/{profile}/{sequence}")
    weight = round(rng.uniform(57, 95), 1)
    fat = round(rng.uniform(12, 31), 1)
    totals = (
        weight,
        round(weight * (0.40 if profile.startswith("inbody") else 0.66), 1),
        round(weight * fat / 100.0, 1),
        fat,
        round(weight * 0.51, 1),
    )

    truth: dict[str, float] = {}
    mutated_field: str | None = None
    for i, spec in enumerate(cells(profile)):
        value = (
            totals[i]
            if i < len(totals)
            else round(rng.uniform(12, 31) if spec.unit == "%" else rng.uniform(2.0, 9.9), 1)
        )
        shown_label = spec.label
        shown_unit = spec.unit
        is_mutated = False
        if i == 5 and variant == "swapped_laterality":
            shown_label = spec.label.replace("L arm", "R arm")
            is_mutated = True
            mutated_field = spec.label
        elif i == 5 and variant == "wrong_unit":
            shown_unit = "%"
            is_mutated = True
            mutated_field = spec.label
        elif i == 5 and variant == "wrong_metric_identity":
            wrong_metric = "Muscle mass" if muscle_label == "Lean mass" else "Lean mass"
            shown_label = spec.label.replace(muscle_label, wrong_metric)
            is_mutated = True
            mutated_field = spec.label

        draw.text((spec.x, spec.y), f"{shown_label}: {value:.1f} {shown_unit}", font=font(23), fill="#182b34")
        is_rejected_doc = variant in {"unknown", "ambiguous_panel"}
        is_cropped = mode == "crop" and spec.y >= 835
        if not is_rejected_doc and not is_mutated and not is_cropped:
            truth[spec.label] = value

    if mode in {"tilt", "tilt_washout"}:
        angle = 1.2 if sequence % 2 == 0 else -1.2
        image = image.rotate(angle, resample=Image.Resampling.BICUBIC, fillcolor="#f7f9fa")
    if mode in {"shadow", "shadow_jpeg"}:
        ramp = np.linspace(0.50, 1.0, image.width, dtype=np.float32)[None, :, None]
        image = Image.fromarray((np.asarray(image) * ramp).astype(np.uint8))
    if mode in {"washout", "tilt_washout"}:
        image = ImageEnhance.Contrast(image).enhance(0.45).filter(ImageFilter.GaussianBlur(0.85))
    if mode in {"jpeg", "shadow_jpeg"}:
        tmp = io.BytesIO()
        image.save(tmp, "JPEG", quality=36)
        tmp.seek(0)
        image = Image.open(tmp).convert("RGB")
    if mode == "crop":
        ImageDraw.Draw(image).rectangle((0, 835, 1099, 959), fill="#f7f9fa")

    meta = {"mutated_field": mutated_field or "", "seed_namespace": seed_namespace}
    return image, truth, meta
