# M4 InBody 270 OCR benchmark — redacted aggregate

- **Run date:** 2026-10-10
- **Corpus:** 30 synthetic source reports; development 20, locked holdout 10
- **Holdout strata:** 3 clean, 3 typical handheld, 4 degraded but human-readable
- **Preprocessing:** orientation-grayscale-autocontrast-1200-v2
- **Region:** local-only; no report left the machine
- **Runtime:** Node 20.20.2; Python 3.12.12; CPU-only on AMD Ryzen 9 6900HS Creator Edition
- **Ground truth:** synthetic render-source truth only; independent two-person reconciliation pending

This report contains aggregate counts only. Source images, manifests, per-sample output, ground-truth values, model files, and raw OCR text are Git-ignored and are not included.

## Decision

No-provider decision: production OCR remains unavailable and manual entry remains the supported path.

Reasons:
- Two-person independent ground-truth reconciliation is not yet signed off.

## Candidates

### tesseract-lstm

- Provider/version: Tesseract OCR 5.5.3
- Model/configuration: eng.traineddata SHA-256 7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2; OEM 1; PSM 11
- Confidence availability: engine token confidence available; not calibrated
- Holdout denominator: 10 synthetic reports
- All required fields exact: 6/10 (60.0%); 95% CI 31.3–83.2%
- Optional field exact: 8/10 (80.0%); 95% CI 49.0–94.3%
- Flagged-error recall: 15/15 (100.0%; 95% CI 79.6–100.0%)
- Unflagged invalid values: 0
- Recoverable failures: 4/4
- Failure codes: missing_fields: 4
- Latency: p50 425 ms; p95 561 ms
- Estimated provider fee: US$0 per attempt; deployment infrastructure cost is not yet selected or estimated
- Estimated provider fee per all-required-exact report: US$0.00
- Verified record writes during benchmark: 0
- Quality thresholds: fail

| Field | Coverage | Exact accuracy |
| --- | ---: | ---: |
| Weight | 7/10 (70.0%) | 7/10 (70.0%; 95% CI 39.7–89.2%) |
| Skeletal muscle mass | 7/10 (70.0%) | 6/10 (60.0%; 95% CI 31.3–83.2%) |
| Body fat mass | 7/10 (70.0%) | 7/10 (70.0%; 95% CI 39.7–89.2%) |
| Body-fat percentage | 7/10 (70.0%) | 7/10 (70.0%; 95% CI 39.7–89.2%) |
| Total body water | 8/10 (80.0%) | 8/10 (80.0%; 95% CI 49.0–94.3%) |

### easyocr-english-g2

- Provider/version: EasyOCR 1.7.2/english_g2+craft
- Model/configuration: CRAFT SHA-256 4a5efbfb48b4081100544e75e1e2b57f8de3d84f213004b14b85fd4b3748db17; english_g2 SHA-256 e2272681d9d67a04e2dff396b6e95077bc19001f8f6d3593c307b9852e1c29e8; CPU; paragraph=false
- Confidence availability: engine token confidence available; not calibrated
- Holdout denominator: 10 synthetic reports
- All required fields exact: 10/10 (100.0%); 95% CI 72.2–100.0%
- Optional field exact: 10/10 (100.0%); 95% CI 72.2–100.0%
- Flagged-error recall: N/A (0 field errors observed)
- Unflagged invalid values: 0
- Recoverable failures: 0/0
- Failure codes: none
- Latency: p50 13217 ms; p95 13904 ms
- Estimated provider fee: US$0 per attempt; deployment infrastructure cost is not yet selected or estimated
- Estimated provider fee per all-required-exact report: US$0.00
- Verified record writes during benchmark: 0
- Quality thresholds: pass

| Field | Coverage | Exact accuracy |
| --- | ---: | ---: |
| Weight | 10/10 (100.0%) | 10/10 (100.0%; 95% CI 72.2–100.0%) |
| Skeletal muscle mass | 10/10 (100.0%) | 10/10 (100.0%; 95% CI 72.2–100.0%) |
| Body fat mass | 10/10 (100.0%) | 10/10 (100.0%; 95% CI 72.2–100.0%) |
| Body-fat percentage | 10/10 (100.0%) | 10/10 (100.0%; 95% CI 72.2–100.0%) |
| Total body water | 10/10 (100.0%) | 10/10 (100.0%; 95% CI 72.2–100.0%) |

## Safety and limitations

- The corpus is synthetic and specific to the InBody 270-style layout; it does not support a public accuracy claim.
- Candidate confidence is engine-reported token confidence, not a calibrated probability.
- Local timings include shared preprocessing and OCR inference on the recorded workstation, but exclude one-time model download and initialization.
- Both engines have zero incremental vendor/API fee; production hosting, maintenance, and compute cost remain unestimated.
- The harness calls the application's existing normalized OCR validation and never connects to Supabase or writes an `inbody_records` row.
- Manual entry and explicit PT confirmation remain mandatory.
