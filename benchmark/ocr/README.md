# FitSync OCR Benchmark & Versioned Adapter (Issue `#2`)

Synthetic-first, local-CPU OCR extraction adapter, draft contract, frozen multi-profile benchmark harness, and Gate B intake verifier for FitSync issue `#2`.

## Scope & Safety Boundaries

- **Synthetic only by default:** Generates local InBody 270-like and Tanita MC-780-like schematic fixtures. Never connects to Supabase, never writes verified `inbody_records`, and never processes real health reports without recorded permissions, data-owner approval, and Gate B admission.
- **No vendor support claim:** Synthetic performance establishes engineering readiness (Gate A) only; real-device/brand support requires permitted representative samples and independent two-person reconciliation (Gate B).
- **No raw outputs in Git:** Keep any private captures, raw OCR tokens, or Gate B files strictly outside Git (or inside `benchmark/ocr/private/`, which is ignored).

## Package Layout

- `contract.py` — Versioned draft envelope (`fitsync.ocr.body-composition-draft/1`), profile specs, explicit metric identity (`lean_mass` vs `skeletal_muscle_mass` vs `muscle_mass`; `fat_mass` vs `fat_percentage`), laterality mapping, bounded failure codes, and non-blocking plausibility warnings.
- `pipeline.py` — Adaptive preprocessing (chroma-normalized diagram stroke suppression + selective shadow/washout balancing), multi-anchor template classification with bounded alphanumeric series normalization, and fail-closed `Tesseract 5.3.4` → `RapidOCR 1.4.4` cascade.
- `fixtures.py` — Deterministic synthetic fixture renderer (6 standard capture modes + 2 combined stress modes + 5 negative/mutation challenge variants).
- `benchmark_v4.py` / `benchmark_v4.toml` — Lock-verified `hei-research` runner comparing `baseline` (v1) vs `v3` vs `v4` on an unseen frozen corpus.
- `gate_b_intake.py` — Manifest SHA-256, split-disjointness, approval-ref, and two-reviewer reconciliation verifier for future Gate B private folders.
- `tests/test_ocr_pipeline.py` — Reproducible unit and contract tests (15 checks).

## Reproduce Locally (WSL Ubuntu 24.04 CPU)

Requires Python 3.12 with `requirements-lock.txt`, `DejaVuSans.ttf`, isolated `tesseract` 5.3.4, and `hei-research` in `~/.local/state/fitsync-ai-lab`.

```bash
# 1. Run unit & contract tests (no network, no DB)
~/.local/state/fitsync-ai-lab/.venv/bin/python -m unittest -v benchmark/ocr/tests/test_ocr_pipeline.py

# 2. Verify Gate B intake validator against a private folder (when approved data exists)
~/.local/state/fitsync-ai-lab/.venv/bin/python benchmark/ocr/gate_b_intake.py /path/to/approved-private-folder

# 3. Reproduce the locked v4 benchmark via hei-research (from synced WSL lab dir)
hei-research --json run ~/.local/state/fitsync-ai-lab/vendor-preflight/benchmark_v4.toml --backend local
```
