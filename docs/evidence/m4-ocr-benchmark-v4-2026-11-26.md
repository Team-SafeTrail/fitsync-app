# FitSync M4 OCR Benchmark v4 — Redacted Synthetic Evidence (Issue `#2`)

- **Run ID:** `EXP-685C6752EE05` (local `hei-research`, CPU)
- **Date:** 2026-11-26
- **Fingerprint:** `d14b0824d3492107a72f74b4d34f3fface96c006bb5c6da23aeb18e493299c66`
- **Lock SHA-256 (`benchmark/ocr/vendor-v4-lock.json`):** `4a99bfd9e72e80a3ed4cb09732ec835540d404984ff004aab3bf0b4deeef98e2`
- **Prior v3 Pixel Overlap (`vendor-v3-lock.json`):** `0` (completely unseen synthetic corpus, `seed = 27112600`)
- **Runtime:** Ubuntu 24.04 WSL, Python 3.12.15, Tesseract 5.3.4 (isolated package, OEM 1, PSM 11), RapidOCR 1.4.4 (`rapidocr-onnxruntime`, CPU 2 threads), Pillow 11.3.0, NumPy 2.5.5
- **Data Class:** **Synthetic only** — zero real health files, zero Supabase access, `verified_record_writes = 0`, zero raw OCR payloads or images committed.
- **Historical Context:** Supersedes the legacy 5-field InBody 270 benchmark at `3804bc4` (synthetic `n = 10` holdout) and advances the prior `EXP-CF6C1C366C12` (`v3`, 725/740 fields exact, 25/30 complete per profile).

---

## Decision & Boundary

- **Synthetic Gate A status:** **PASS** on the standard 6-mode multi-profile synthetic holdout (`30/30` complete reports in both profiles, `740/740` fields exact, `0` wrong values/sides/units/metric-identity, `4/4` unknown/ambiguous templates rejected, `p95 ≤ 1.84 s`).
- **Production / Vendor support status:** **NO-PROVIDER ENABLEMENT (Gate B PENDING).** Synthetic layout performance does **not** establish real-world InBody 270 or Tanita MC-780MA-N support, camera/PDF readiness, or PT time savings. Production OCR remains `UnavailableOcrAdapter` and manual entry + explicit PT confirmation remain mandatory until Gate B (permitted representative real samples + two-person independent annotation) and `#32`/`#34`/`#35`/`#39`/`#40` clear review.

---

## Paired Comparison on Locked Unseen Corpus (`EXP-685C6752EE05`, 90 Cases)

Each profile evaluates:
- **Standard suite (`n = 30` valid):** 5 cases × 6 capture modes (`flat`, `tilt`, `shadow`, `jpeg`, `washout`, `crop`) — `295` expected readable fields for `inbody_270_style` (crop hides 1 row × 5 cases) and `445` for `tanita_780_style` (crop hides 1 row × 5 cases); `740` expected fields combined.
- **Combined-stress suite (`n = 10` valid):** 5 `shadow_jpeg` + 5 `tilt_washout` (`100` fields InBody, `150` fields Tanita).
- **Challenge / negative suite (`n = 5`):** `unknown` series (`930 SERIES`), `ambiguous_panel` (mismatched series/panel), `swapped_laterality` (`L arm` printed as `R arm`), `wrong_unit` (`%` instead of `kg`), `wrong_metric_identity` (`Lean mass` ↔ `Muscle mass`).

### 1. Standard 6-Mode Holdout (Paired Baseline vs v3 vs v4)

| Synthetic Profile | Pipeline | Complete Reports | Wilson 95% CI | Exact Fields | Missing | Wrong Values | Wrong Sides | Wrong Units | Wrong Metric ID | Unknown Rejected | p50 / p95 (ms) |
| --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `inbody_270_style` | Baseline (v1) | 10/30 | 19.2–51.2% | 230/295 | 65 | 0 | 0 | 0 | 0 | 2/2 | 1329 / 1395 |
| `inbody_270_style` | Prior v3 | 25/30 | 66.4–92.7% | 290/295 | 5 | 0 | 0 | 0 | 0 | 2/2 | 1322 / 1409 |
| `inbody_270_style` | **Candidate v4** | **30/30** | **88.7–100.0%** | **295/295** | **0** | **0** | **0** | **0** | **0** | **2/2** | **1373 / 1468** |
| `tanita_780_style` | Baseline (v1) | 5/30 | 7.3–33.6% | 330/445 | 115 | 0 | 0 | 0 | 0 | 2/2 | 1654 / 1763 |
| `tanita_780_style` | Prior v3 | 25/30 | 66.4–92.7% | 435/445 | 10 | 0 | 0 | 0 | 0 | 2/2 | 551 / 1717 |
| `tanita_780_style` | **Candidate v4** | **30/30** | **88.7–100.0%** | **445/445** | **0** | **0** | **0** | **0** | **0** | **2/2** | **1638 / 1840** |

### 2. Per-Mode Breakdown (Complete Reports / Exact Fields)

| Profile / Pipeline | `flat` | `tilt` | `shadow` | `jpeg` | `washout` | `crop` | `shadow_jpeg` *(stress)* | `tilt_washout` *(stress)* |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| InBody Baseline | 0/5 (45/50) | 5/5 (50/50) | 0/5 (0/50) | 0/5 (45/50) | 5/5 (50/50) | 0/5 (40/45) | 0/5 (0/50) | 5/5 (50/50) |
| InBody Prior v3 | 5/5 (50/50) | 5/5 (50/50) | 5/5 (50/50) | 0/5 (45/50) | 5/5 (50/50) | 5/5 (45/45) | 0/5 (45/50) | 5/5 (50/50) |
| **InBody v4** | **5/5 (50/50)** | **5/5 (50/50)** | **5/5 (50/50)** | **5/5 (50/50)** | **5/5 (50/50)** | **5/5 (45/45)** | **5/5 (50/50)** | **5/5 (50/50)** |
| Tanita Baseline | 0/5 (65/75) | 5/5 (75/75) | 0/5 (0/75) | 0/5 (65/75) | 0/5 (65/75) | 0/5 (60/70) | 0/5 (0/75) | 5/5 (75/75) |
| Tanita Prior v3 | 5/5 (75/75) | 5/5 (75/75) | 5/5 (75/75) | 5/5 (75/75) | 0/5 (65/75) | 5/5 (70/70) | 5/5 (75/75) | 5/5 (75/75) |
| **Tanita v4** | **5/5 (75/75)** | **5/5 (75/75)** | **5/5 (75/75)** | **5/5 (75/75)** | **5/5 (75/75)** | **5/5 (70/70)** | **5/5 (75/75)** | **0/5 (70/75)** |

---

## Root Causes Addressed in v4 & Honest Tradeoffs

1. **Resolved InBody JPEG (0/5 → 5/5) & Tanita Washout (0/5 → 5/5):**
   - Dev-seed root-cause diagnosis showed RapidOCR read `0` as `O` inside the top series anchor (`27OSERIES` / `78OSERIES`) under JPEG compression and low-contrast washout, causing `v1`/`v3` to discard RapidOCR's otherwise exact cell readings; meanwhile `v3`'s fixed `B - R >= 32` cyan threshold missed washed-out diagram strokes and JPEG ringing halos.
   - `v4` introduces dynamic-range-normalized chroma suppression (`suppress_colored_diagram_strokes`), selective low-contrast normalization (`_stretch_low_contrast`), and bounded `O → 0` normalization strictly adjacent to digits inside the series header anchor (numeric measurement values remain strictly digits).
2. **Transparent Stress Tradeoff (`tanita_780_style` `tilt_washout`: 0/5 complete, 70/75 exact, 0 wrong):**
   - On combined rotated + washed-out Tanita fixtures, the 1px halo cleanup slightly softened the `c` in `Trunk / Fat percentage` where the tilted diagram line crossed the text, causing `v4` to fail closed (`needs_review`, `0` wrong emitted) while recovering `5/5` on InBody `jpeg`, `5/5` on InBody `shadow_jpeg`, and `5/5` on Tanita `washout`.
   - This result is recorded honestly without post-hoc holdout tuning; real-capture preprocessing parameters must be revisited only on permitted Gate B development data.
3. **Runtime & Cost Caveats:**
   - Local WSL CPU `p95` is `1.47 s` (InBody) and `1.84 s` (Tanita), well below the `8 s` local sync ceiling, with `$0` incremental vendor API fee.
   - Timings exclude one-time model load, network upload, server queueing, PDF rasterization, and PT review time. Production hosting cost and cold/warm latency on the target deployment host remain unmeasured.

## Artifacts & Reproduction

- Redacted aggregate JSON: [`docs/evidence/m4-ocr-benchmark-v4-2026-11-26.json`](m4-ocr-benchmark-v4-2026-11-26.json)
- Freeze lock (hashes only): [`benchmark/ocr/vendor-v4-lock.json`](../../benchmark/ocr/vendor-v4-lock.json)
- Unit & contract tests: `15/15` passed via `benchmark/ocr/tests/test_ocr_pipeline.py` (covers both profiles, bounded series homoglyphs, unknown/ambiguous rejection, swapped side/unit/metric rejection, cross-engine conflict drop, plausibility warnings, preprocessing, and 6 Gate B intake checks).
- Integration contract & Gate B checklist: [`docs/plans/ocr-integration-contract-39-40.md`](../plans/ocr-integration-contract-39-40.md), [`docs/plans/m4-ocr-gate-b-intake-checklist.md`](../plans/m4-ocr-gate-b-intake-checklist.md).
