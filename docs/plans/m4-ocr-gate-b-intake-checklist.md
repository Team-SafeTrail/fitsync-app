# FitSync OCR Gate B Intake & Unblocking Checklist

- **Purpose:** Operational readiness and blocker tracker for advancing FitSync OCR beyond synthetic Gate A (`#2`) to representative real-sample validation (Gate B) and eventual `#39`/`#40` integration.
- **Current Status:** **Gate B BLOCKED** — zero permitted representative real reports or independent human annotations have been admitted. All current benchmark evidence is strictly synthetic.

---

## 1. Exact Open Blockers

| Blocker | Owner(s) | Why It Blocks | Unblock Evidence Required |
| --- | --- | --- | --- |
| **B1 — Data governance & Decree 13 sign-off** | Product owner / Việt + Huy (`#35 OPS-DATA`) | Real body-composition sheets are personal health data; processing or storing them without consent, retention, deletion, and incident-response ownership violates `AGENTS.md` and `m4-ocr-benchmark-protocol.md`. | Written data-owner designation, consent/usage permission record (`approval_ref`), retention/deletion window, and local-only vs provider processing boundary. |
| **B2 — Representative permitted dataset acquisition** | Việt + Hưng (`#2`) | Synthetic fixtures do not establish real-world accuracy for photographed gym printouts (glare, folds, thermal fade, regional Vietnamese/English headers, actual InBody 270 / 270S / Tanita MC-780MA-N print exports). | Permitted real samples (manufacturer-permitted research material or voluntarily contributed sheets with recorded `approval_ref`), pre-registered target floor (`n ≥ 25–30` distinct source sheets per target model/template across `≥ 3` phone/lighting conditions, kept private & Git-ignored). |
| **B3 — Independent two-person blind annotation** | Two distinct human reviewers | Prevents parser-coupled or self-confirming ground truth and validates real-sheet readability before opening holdout results. | `labels-a.json` and `labels-b.json` from two distinct reviewer IDs reconciled to 100% agreement via `gate_b_intake.py`. |
| **B4 — App integration dependencies (`#32`, `#34`, `#39`, `#40`)** | Huy + Khai + Human reviewer | `#39 FULL-REPORT` is blocked on `#32 REVIEW-BASELINE` and `#34 LEGACY-AUTH`; `#40 OCR-PDF` is blocked on `#39`. | `#32` and `#34` reviewed & closed → `#39` schema/RLS migration merged → `#40` versioned API/review integration implemented behind `default=false` flag. |

## 2. Gate B Admission Procedure (Private Local Workspace Only)

Never commit real images, raw OCR outputs, manifests containing personal identifiers, or ground-truth files to Git.

1. **Redaction before admission:** Crop or mask unneeded personal names, phone numbers, member IDs, timestamps, and QR/barcodes where feasible without obscuring measurement labels, units, or layout anchors.
2. **Private directory layout** (stored outside Git, e.g., `~/.local/state/fitsync-ai-lab/private-gate-b/<batch-id>/`):
   - `manifest.json`: must contain `approval_ref` and `captures[]` with `capture_id`, `source_id` (unique per physical sheet so multiple photos of one sheet stay in the same split), `split` (`development` | `holdout`), `file` (relative path inside folder), `vendor`, `model`, `layout`, `condition`, and `sha256`.
   - `labels-a.json` & `labels-b.json`: `{ "reviewer": "<unique-id>", "labels": { "<capture_id>": { ... } } }`, preserving printed labels, metric identity (`lean_mass` vs `skeletal_muscle_mass` vs `muscle_mass`), units (`kg`, `%`, `L`), and region laterality.
3. **Run automated intake verification before opening holdout:**
   ```bash
   cd benchmark/ocr
   ~/.local/state/fitsync-ai-lab/.venv/bin/python gate_b_intake.py /path/to/approved-private-folder
   ```
   Confirm exit code `0` and record the returned redacted receipt (`captures`, `sources`, `holdout_sources`, `manifest_sha256`).
4. **Pre-register thresholds & run locked holdout once:**
   - Freeze adapter/model versions, preprocessing config, manifest digest, and per-template thresholds before running inference.
   - Report redacted aggregates only: per-`(vendor, model, template, format)` complete-report rate + Wilson 95% CI, per-field exact/tolerance accuracy, missing rate, `wrong` / `laterality_swap` / `unit_error` / `metric_identity_confusion` / `false_fill` / `silent_plausible_error_rate`, unknown-template rejection rate, target-host `p50`/`p95` latency, estimated compute/API cost per usable report, and timed PT assisted review vs manual entry.
5. **Promotion rule:** Enable a `(vendor, model, template, format)` entry only after it clears Gate B and Gate C (integration/RLS/retry/fallback). Any unseen or failing layout stays `unsupported_template` with immediate manual fallback.
