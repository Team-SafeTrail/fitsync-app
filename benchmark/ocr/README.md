# InBody 270 OCR benchmark

This directory contains the reproducible, synthetic-only M4 benchmark harness. It generates 30 distinct pseudonymous reports, locks 20 development and 10 holdout sources before tuning, runs Tesseract and EasyOCR through the application's existing normalized OCR validation, and commits only redacted aggregate evidence. The frozen preprocessing version corrects orientation, converts to grayscale, normalizes contrast, and scales to 1200 pixels wide.

Private source images, manifests, ground truth, model files, per-sample normalized results, and raw OCR text stay under `benchmark/ocr/private/`, which Git ignores. The harness never connects to Supabase and cannot create an `inbody_records` row.

## Environment

Use Node 20 or newer. The recorded run used Python 3.12.12, Pillow 11.3.0, Tesseract 5.5.3 with OEM 1 and PSM 11, EasyOCR 1.7.2, CPU-only PyTorch 2.8.0, the EasyOCR CRAFT detector, and `english_g2` recognizer.

Create the local environment outside the repository:

```bash
conda create -p /tmp/fitsync-ocr-benchmark -c conda-forge \
  python=3.12.12 pillow=11.3.0 tesseract=5.5.3 pip -y
/tmp/fitsync-ocr-benchmark/bin/python -m pip install \
  torch==2.8.0 torchvision==0.23.0 \
  --index-url https://download.pytorch.org/whl/cpu
/tmp/fitsync-ocr-benchmark/bin/python -m pip install easyocr==1.7.2
export FITSYNC_OCR_PYTHON=/tmp/fitsync-ocr-benchmark/bin/python
export PATH=/tmp/fitsync-ocr-benchmark/bin:$PATH
```

## Workflow

```bash
npm run benchmark:ocr:test
npm run benchmark:ocr:typecheck
npm run benchmark:ocr:generate
npm run benchmark:ocr:validate
npm run benchmark:ocr:run
```

The default run uses only the development split. Before any locked holdout run, two different reviewers must visually transcribe the source images into copies of the generated private templates named `ground-truth-review-a.json` and `ground-truth-review-b.json`. `npm run benchmark:ocr:validate` rejects disagreement with either review or the rendered source values.

Run the holdout once after configuration is frozen:

```bash
npm run benchmark:ocr:run -- --locked-holdout
npm run benchmark:ocr:report
```

For engineering diagnostics only, `--accept-unreconciled-synthetic-truth` permits a holdout run before human reconciliation. The generated report is then non-selectable and must record a no-provider decision.

Never redirect candidate debug output into committed files, print private results, or add anything beneath `benchmark/ocr/private/` to Git.
