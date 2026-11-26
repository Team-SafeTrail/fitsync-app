# Read-Only Integration Contract for `#39` (FULL-REPORT) & `#40` (OCR-PDF)

- **Status:** Prepared under issue `#2` (`agent-ready`). **Read-only contract only** — `#39` and `#40` remain `blocked` (pending `#32 REVIEW-BASELINE`, `#34 LEGACY-AUTH`, `#35 OPS-DATA`, and Gate B representative validation). No migrations, web routes, Android screens, or feature flags are enabled by this document.
- **Draft Schema Version:** `fitsync.ocr.body-composition-draft/1` (`benchmark/ocr/contract.py`)
- **Adapter Candidate Version:** `fitsync-local-cascade` `4.0.0` (Tesseract 5.3.4 + RapidOCR 1.4.4 ONNX CPU, synthetic-validated only; production default remains `UnavailableOcrAdapter`).

---

## 1. Boundary Architecture (Web + Android Parity)

- **Server-only extraction boundary:** Neither web browsers nor Android clients (`mobile/` at `6f7da06`) may invoke OCR engines directly, embed vendor/provider secrets, or insert `ocr_attempts` / `body_composition_reports` rows directly.
- **Transport decoupling from Next.js Server Actions:** Current web M4 (`apps/web/src/features/workspace/ocr-actions.ts`) uses Next.js Server Actions + `service_role` to persist `ocr_attempts`. When `#40` unblocks, expose extraction and confirmation behind an authenticated, versioned HTTP API (or Supabase Edge Function + RPC) so web and Android share one contract:
  - `POST /api/v1/body-reports/extract` — PT-authenticated multipart/storage-ref intake; validates MIME, byte limit, binary signature, and PT-to-trainee ownership; invokes the OCR adapter behind a bounded timeout; persists a draft attempt (`status = 'draft' | 'rejected' | 'failed'`) via `service_role`; returns the versioned draft envelope + short-lived (`60s`) signed source-image URL. **Never writes a verified report.**
  - `POST /api/v1/body-reports/confirm` (backing RPC `confirm_body_report(...)`) — PT-authenticated atomic confirmation with `attempt_id`, `expected_attempt_version`, `reviewed_payload`, `review_confirmed = true`, and `request_nonce`. Re-validates ownership, bounds, units, and metric identity server-side before creating a verified snapshot visible to the trainee.

## 2. Draft Envelope Contract (`fitsync.ocr.body-composition-draft/1`)

```json
{
  "schema": "fitsync.ocr.body-composition-draft/1",
  "adapter": { "name": "fitsync-local-cascade", "version": "4.0.0" },
  "engines_used": ["tesseract-5", "rapidocr-1.4.4"],
  "synthetic": true,
  "template_profile": "inbody_270_style | tanita_780_style | null",
  "status": "draft | rejected | failed",
  "failure_code": "unsupported_template | ambiguous_template | engine_conflict | unreadable_document | provider_timeout | provider_unavailable | invalid_input | null",
  "duration_ms": 950,
  "requires_pt_confirmation": true,
  "warnings": [
    { "code": "asymmetry_review_required | fat_percentage_consistency_warning | out_of_typical_bounds", "fields": ["..."], "detail": "..." }
  ],
  "summary": { "extracted_count": 10, "needs_review_count": 0, "conflict_count": 0, "warning_count": 0 },
  "fields": [
    {
      "metric": "weight | skeletal_muscle_mass | muscle_mass | lean_mass | fat_mass | fat_percentage | total_body_water",
      "region": "null | left_arm | right_arm | trunk | left_leg | right_leg",
      "source_label": "L arm / Lean mass",
      "source_unit": "kg | % | L",
      "value": 3.4,
      "state": "extracted | needs_review",
      "conflict_dropped": false,
      "confidence": null,
      "evidence": { "page": 1, "box_px": [48, 302, 493, 344] }
    }
  ]
}
```

### Mandatory Contract Invariants
1. **Metric identity & laterality preservation:** `skeletal_muscle_mass`, `muscle_mass`, and `lean_mass` are distinct keys and must never be conflated. `fat_mass` (`kg`), `fat_percentage` (`%`), and vendor-specific reference `%` (which can exceed 100%) are distinct keys. `left_arm`/`right_arm`/`left_leg`/`right_leg`/`trunk` come strictly from printed labels, never display side alone.
2. **Fail-closed semantics:** Unknown templates, crossed title/panel anchors, swapped labels, wrong units, wrong metric labels, or cross-engine value conflicts emit `value: null` (`state: "needs_review"`, `conflict_dropped: true`) or `status: "rejected"` — never a fabricated `0`, prior-report carry-forward, or silent guess.
3. **Partial drafts allowed through PT review:** Unlike legacy `20260928120000` (`confirm_ocr_inbody_record` rejecting `status <> 'success'`), `#39`/`#40` must allow a partial `draft` (some fields `extracted`, others `needs_review`) into the PT review UI so the PT can inspect crops, fill blanks manually, and confirm atomically.
4. **Uncalibrated confidence honesty:** `confidence` stays `null` (displayed as unknown) until calibrated against representative Gate B data; never present raw engine scores or LLM self-ratings as calibrated probabilities.
5. **Plausible-wrong-segment defense:** Soft warnings (`asymmetry_review_required`, `fat_percentage_consistency_warning`) never silently alter extracted values; the PT review UI must show the source crop (`evidence.box_px`) alongside each region/field and require explicit PT confirmation before any trainee visibility.

## 3. Schema & RLS Alignment Requirements for `#39` (FULL-REPORT)

- Preserve 1:1 backward compatibility for existing 5-field `inbody_records` (`core-five-v1` coverage, `recorded_at` kept distinct from `measured_at`/`date_precision`; do **not** synthesize segmental rows for historical records).
- Persist normalized report snapshots (`body_composition_reports`, `body_composition_totals`, `body_composition_segments`, `report_source_files`, `report_field_evidence`) with immutable post-confirm revisions (`supersedes_id` + reason) and `is_manually_edited` derived server-side by comparing `extracted` vs `confirmed` values.
- **Explicit `#34 LEGACY-AUTH` decision required before `#39` migration:** Existing `inbody_records` and `ocr_attempts` RLS (`20260927110000`, `20260928120000`) require `trainee.profile_id IS NOT NULL` (linked trainee). Decide whether pre-link PT assessment (`ONBOARD-01`/`U-10`) is enabled via an audited additive RLS update or deferred until trainee invite acceptance.
- Retain strict isolation: trainees read only their own **confirmed** reports (never `ocr_attempts` or private `inbody-media` source files unless a separate sharing policy is approved); unrelated PTs, trainees, and `anon` receive zero rows.

## 4. Integration Prerequisites for `#40` (OCR-PDF & Live Runtime)

- **PDF remains Phase 1b:** Current `inbody-media` bucket and `ocr_attempts` accept only `image/jpeg|png|webp`. Adding `application/pdf` requires separate byte, page-count, raster-pixel, CPU, and timeout caps, explicit `password_protected_pdf` / `malformed_pdf` / `page_limit_exceeded` codes, zero embedded script/attachment/URL execution, and separate text-layer vs scanned-page evaluation.
- **Runtime placement & latency budget:** Measure cold/warm p95 latency on the actual production host (not only WSL CPU). If host latency exceeds the synchronous budget (`ADR-002`: `≤ 8 s` p95), introduce a bounded async attempt/poll queue with per-attempt ownership checks and cleanup before enabling live OCR.
- **Enablement gate:** Keep production adapter `UnavailableOcrAdapter` and manual entry as the primary fallback until Gate B passes for a specific `(vendor, model, template, format)` tuple and `#32`/`#34`/`#35`/`#39`/`#40` are reviewed and approved.
