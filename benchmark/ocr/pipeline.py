"""FitSync OCR v4 local extraction pipeline (Tesseract 5.3.4 + RapidOCR 1.4.4 cascade).

Key v4 improvements over v3 (EXP-CF6C1C366C12):
1. Chroma-normalized light-tint diagram suppression (adapts to low-contrast washout & JPEG ringing
   without touching dark neutral ink).
2. Selective illumination + low-contrast normalization (triggers on uneven shadows OR compressed
   global luminance spread such as washout, staying zero-overhead on clean captures).
3. Bounded homoglyph normalization ('O' -> '0' strictly adjacent to digits inside series/header
   anchors only; numeric field values remain strictly digits so no letter is ever coerced to a value).
4. Fail-closed multi-anchor template classification and cross-engine conflict dropping.
"""
from __future__ import annotations

import io
import os
import re
import subprocess
import time
from pathlib import Path
from typing import Any, Callable

import numpy as np
from PIL import Image, ImageFilter, ImageOps

from contract import PROFILES, build_draft_envelope, cells

Token = tuple[float, float, str]


def _default_tesseract_root() -> Path:
    configured = os.environ.get("FITSYNC_TESSERACT_ROOT")
    if configured:
        return Path(configured)
    return Path.home() / ".local/state/fitsync-ai-lab/tesseract-root/usr"


def tesseract_tokens(image: Image.Image) -> list[Token]:
    """Extract word-level (x, center_y, text) tokens using isolated Tesseract 5."""
    root = _default_tesseract_root()
    tesseract_bin = root / "bin/tesseract"
    tessdata_dir = root / "share/tesseract-ocr/5/tessdata"
    env = dict(os.environ, OMP_THREAD_LIMIT="2")
    if tesseract_bin.exists():
        env["LD_LIBRARY_PATH"] = str(root / "lib/x86_64-linux-gnu")
        cmd = [
            str(tesseract_bin),
            "stdin",
            "stdout",
            "--tessdata-dir",
            str(tessdata_dir),
            "-l",
            "eng",
            "--oem",
            "1",
            "--psm",
            "11",
            "tsv",
        ]
    else:
        cmd = ["tesseract", "stdin", "stdout", "-l", "eng", "--oem", "1", "--psm", "11", "tsv"]

    stream = io.BytesIO()
    image.save(stream, format="PNG")
    result = subprocess.run(
        cmd,
        env=env,
        input=stream.getvalue(),
        capture_output=True,
        check=True,
        timeout=15,
    )
    boxes: list[Token] = []
    for line in result.stdout.decode(errors="replace").splitlines()[1:]:
        parts = line.split("\t", 11)
        if len(parts) == 12 and parts[0] == "5" and parts[11].strip():
            boxes.append((float(parts[6]), float(parts[7]) + float(parts[9]) / 2.0, parts[11]))
    return boxes


def rapid_tokens(engine: Any, image: Image.Image) -> list[Token]:
    """Extract line/box-level (left_x, center_y, text) tokens using RapidOCR."""
    hits, _ = engine(np.asarray(image))
    return [
        (float(min(point[0] for point in box)), float(sum(point[1] for point in box) / 4.0), str(text))
        for box, text, _ in hits or []
    ]


def balance_background(image: Image.Image) -> Image.Image:
    """Correct uneven shadow illumination via smooth background division."""
    gray = ImageOps.grayscale(image)
    background = np.maximum(np.asarray(gray.filter(ImageFilter.GaussianBlur(46)), dtype=np.float32), 1.0)
    corrected = np.clip(np.asarray(gray, dtype=np.float32) * 250.0 / background, 0.0, 255.0)
    return Image.fromarray(corrected.astype(np.uint8)).convert("RGB")


def _stretch_low_contrast(image: Image.Image) -> Image.Image:
    """Gently restore contrast when global luminance spread is compressed (washout/faded)."""
    gray = np.asarray(ImageOps.grayscale(image), dtype=np.float32)
    low = float(np.quantile(gray, 0.01))
    high = float(np.quantile(gray, 0.99))
    spread = high - low
    if spread >= 175.0 or spread < 8.0:
        return image
    stretched = np.clip((gray - low) * (235.0 / spread) + 15.0, 0.0, 255.0)
    return Image.fromarray(stretched.astype(np.uint8)).convert("RGB")


def suppress_colored_diagram_strokes(image: Image.Image) -> tuple[Image.Image, bool]:
    """Suppress light cool-tinted diagram lines while preserving dark neutral text.

    Adapts chroma threshold to the image's dynamic range so it still works under contrast washout,
    and expands by 1px only into light-to-mid non-ink halo pixels to clean JPEG ringing.
    """
    rgb = np.asarray(image.convert("RGB"), dtype=np.float32)
    lum = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    p02 = float(np.quantile(lum, 0.02))
    p98 = float(np.quantile(lum, 0.98))
    dyn = max(p98 - p02, 40.0)
    scale = dyn / 255.0

    # Light-to-mid pixels that are distinctly cooler/bluer than neutral ink/paper.
    b_minus_r = rgb[:, :, 2] - rgb[:, :, 0]
    g_minus_r = rgb[:, :, 1] - rgb[:, :, 0]
    min_lum = p02 + 0.30 * dyn
    core_mask = (
        (lum >= min_lum)
        & (b_minus_r >= max(10.0, 28.0 * scale))
        & (g_minus_r >= max(4.0, 12.0 * scale))
    )
    if not np.any(core_mask):
        return image, False

    # Dilate by 1px strictly into light halo pixels (never dark text ink) to clean JPEG ringing.
    padded = np.pad(core_mask, 1, mode="constant", constant_values=False)
    dilated = (
        padded[:-2, :-2]
        | padded[:-2, 1:-1]
        | padded[:-2, 2:]
        | padded[1:-1, :-2]
        | padded[1:-1, 1:-1]
        | padded[1:-1, 2:]
        | padded[2:, :-2]
        | padded[2:, 1:-1]
        | padded[2:, 2:]
    )
    halo_mask = dilated & (lum >= p02 + 0.42 * dyn)
    final_mask = core_mask | halo_mask

    paper_fill = int(round(min(252.0, max(230.0, p98))))
    cleaned = np.asarray(image.convert("RGB"), dtype=np.uint8).copy()
    cleaned[final_mask] = (paper_fill, paper_fill, paper_fill)
    return Image.fromarray(cleaned), True


def preprocess_document(image: Image.Image) -> tuple[Image.Image, bool]:
    """Selective, principled preprocessing for shadow, washout, and colored diagram overlays."""
    current, changed = suppress_colored_diagram_strokes(image)
    gray = np.asarray(ImageOps.grayscale(current), dtype=np.float32)
    width = max(1, current.width // 12)
    left = float(np.quantile(gray[:, :width], 0.80))
    right = float(np.quantile(gray[:, -width:], 0.80))
    p02 = float(np.quantile(gray, 0.02))
    p98 = float(np.quantile(gray, 0.98))

    has_shadow = abs(left - right) >= 28.0
    has_washout = (p98 - p02) < 165.0

    if has_shadow:
        current = balance_background(current)
        changed = True
    if has_washout:
        stretched = _stretch_low_contrast(current)
        if stretched is not current:
            current = stretched
            changed = True
    return current, changed


def normalize_anchor(text: str) -> str:
    """Normalize layout anchor text (strip punctuation/spaces, casefold)."""
    return re.sub(r"\W", "", text).casefold()


def normalize_series_anchor(text: str) -> str:
    """Normalize header series anchor, correcting OCR 'O'->'0' ONLY adjacent to digits.

    Examples: '27O SERIES' -> '270series', '78OSERIES' -> '780series',
    while 'UNKNOWN SERIES' -> 'unknownseries' and '93O SERIES' -> '930series' (still rejected).
    Never used for measurement values.
    """
    compact = normalize_anchor(text)
    # Apply twice to cover runs like '2OO' if adjacent to a digit, never pure letters.
    for _ in range(2):
        compact = re.sub(r"(?<=\d)o|o(?=\d)", "0", compact)
    return compact


def parse_tokens(tokens: list[Token]) -> tuple[str | None, dict[str, float], str | None]:
    """Identify template via multi-anchor agreement and parse strictly validated fields.

    Returns (profile, extracted_values, failure_code).
    """
    if not tokens:
        return None, {}, "unreadable_document"

    top = normalize_series_anchor(" ".join(token[2] for token in sorted(tokens) if token[1] < 81))
    panel = normalize_anchor(" ".join(token[2] for token in sorted(tokens) if 81 <= token[1] < 154))
    matched = [
        key
        for key, (series, anchor, *_) in PROFILES.items()
        if normalize_series_anchor(series) in top and normalize_anchor(anchor) in panel
    ]
    if len(matched) == 0:
        return None, {}, "unsupported_template"
    if len(matched) > 1:
        return None, {}, "ambiguous_template"

    profile = matched[0]
    draft: dict[str, float] = {}
    for spec in cells(profile):
        line = " ".join(
            text
            for tx, ty, text in sorted(tokens)
            if spec.x - 28 <= tx <= spec.x + 417 and abs(ty - (spec.y + 13)) <= 16
        )
        expected = re.escape(spec.label).replace("/", r"\s*/\s*").replace(r"\ ", r"\s*").replace(" ", r"\s*")
        # Strict digits only for values — never coerce letters into numbers.
        pattern = rf"{expected}\s*:\s*(\d{{1,3}}[.,]\d{{1,2}})\s*{re.escape(spec.unit)}"
        match = re.fullmatch(pattern, line.strip(), flags=re.IGNORECASE)
        if match:
            draft[spec.label] = float(match[1].replace(",", "."))
    return profile, draft, None


def run_cascade_v4(
    engine: Any,
    image: Image.Image,
    *,
    tesseract_reader: Callable[[Image.Image], list[Token]] = tesseract_tokens,
    rapid_reader: Callable[[Any, Image.Image], list[Token]] = rapid_tokens,
    synthetic: bool = True,
) -> dict[str, Any]:
    """Run v4 preprocessing + fail-closed Tesseract->RapidOCR cascade and return draft envelope."""
    started = time.perf_counter()
    processed, _ = preprocess_document(image)

    engines_used = ["tesseract-5"]
    first_profile, first_values, first_err = parse_tokens(tesseract_reader(processed))
    if first_profile is not None and len(first_values) == len(cells(first_profile)):
        duration_ms = round((time.perf_counter() - started) * 1000)
        return build_draft_envelope(
            first_profile,
            first_values,
            duration_ms=duration_ms,
            engines_used=engines_used,
            synthetic=synthetic,
            image_size=image.size,
        )

    engines_used.append("rapidocr-1.4.4")
    second_profile, second_values, second_err = parse_tokens(rapid_reader(engine, processed))
    duration_ms = round((time.perf_counter() - started) * 1000)

    if first_profile and second_profile and first_profile != second_profile:
        return build_draft_envelope(
            None,
            {},
            failure_code="ambiguous_template",
            duration_ms=duration_ms,
            engines_used=engines_used,
            synthetic=synthetic,
            image_size=image.size,
        )

    resolved_profile = first_profile or second_profile
    if resolved_profile is None:
        code = (
            "ambiguous_template"
            if "ambiguous_template" in (first_err, second_err)
            else "unsupported_template"
        )
        return build_draft_envelope(
            None,
            {},
            failure_code=code,
            duration_ms=duration_ms,
            engines_used=engines_used,
            synthetic=synthetic,
            image_size=image.size,
        )

    merged: dict[str, float] = {}
    dropped_conflicts: list[str] = []
    for key in first_values.keys() | second_values.keys():
        if key in first_values and key in second_values and first_values[key] != second_values[key]:
            dropped_conflicts.append(key)
            continue
        merged[key] = first_values[key] if key in first_values else second_values[key]

    return build_draft_envelope(
        resolved_profile,
        merged,
        dropped_conflicts=sorted(dropped_conflicts),
        duration_ms=duration_ms,
        engines_used=engines_used,
        synthetic=synthetic,
        image_size=image.size,
    )
