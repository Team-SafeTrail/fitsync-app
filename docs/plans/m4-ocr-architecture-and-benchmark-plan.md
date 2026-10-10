# M4 OCR architecture and benchmark plan

**Outcome:** A PT can upload an InBody 270 image, review a fallible five-field draft, correct it in the existing InBody form, and explicitly confirm it. Extraction never creates a verified record by itself, and manual entry remains available at every failure point.

**Scope:** OCR-assisted InBody 270 entry only. No generalized document OCR, automated health decisions, mobile capture flow, payments, analytics, or public accuracy claim.

## Work plan

1. **Approve the data gate.** Assign a data owner and record consent, retention, deletion, and incident-response handling before any real report is collected. Build the versioned synthetic/consented corpus described in `docs/plans/m4-ocr-benchmark-protocol.md`; keep source images out of Git.
2. **Benchmark behind one contract.** Implement a server-only provider adapter and deterministic fake. Evaluate at least two candidates on the same locked holdout, publish denominators and failure cases, and select a provider only if every release gate passes.
3. **Add persistence and private storage.** Create a versioned migration for `ocr_attempts`, a private InBody-source bucket, indexes, constraints, and RLS. Use PT/trainee/attempt-scoped paths, store normalized drafts and confidence metadata, and exclude raw provider payloads and extracted text. Regenerate database types.
4. **Implement the guarded extraction action.** Re-authenticate PT ownership; validate JPEG/PNG/WebP, 10 MB maximum, and binary signature server-side; create the attempt; call the adapter with a bounded timeout; persist a normalized draft or recoverable failure. Never insert `inbody_records` here.
5. **Reuse the existing review workflow.** Prefill the existing five-field InBody form, mark missing/low-confidence/inconsistent values, show the private image through a short-lived signed URL, and keep manual entry immediately reachable.
6. **Make confirmation atomic and idempotent.** Revalidate the corrected values and ownership server-side, create one immutable `source = 'ocr'` record, link it to its attempt, set the manual-edit flag from normalized differences, and prevent repeat confirmation.
7. **Prove isolation and failure behavior.** Add pgTAP/RLS coverage for attempts and media, domain tests for normalization/confidence/timeout states, and browser coverage for upload, correction, confirmation, reload, authorized visibility, cross-tenant denial, recoverable fallback, and desktop/mobile rendering.
8. **Verify and document.** Run database reset/lint/types, pgTAP, unit tests, lint, typecheck, production build, and Playwright. Record the chosen provider/version, benchmark result, limitations, and verified state in the handoff; do not turn internal thresholds into marketing claims.

## Completion evidence

- No extraction path can create a verified InBody record without an explicit PT confirmation.
- Invalid, missing, low-confidence, timed-out, or unavailable extraction always leaves manual entry usable.
- Source media, attempts, and resulting records are inaccessible across tenants.
- Benchmark artifacts are reproducible, pseudonymous, consented or synthetic, and evaluated on a locked holdout.
- All existing M1-M3 checks remain green, and the full OCR review flow passes in a real browser at desktop and mobile widths.

## Issue #2 benchmark outcome — 2026-10-10

The reproducible synthetic v1 harness and redacted aggregate report are implemented. Tesseract 5.5.3 failed the locked-holdout accuracy gates. EasyOCR 1.7.2 crossed the numeric thresholds on the 10-report synthetic holdout, but the mandatory independent two-person ground-truth reconciliation remains unsigned. No provider is selected; the production adapter stays unavailable and manual entry remains the supported path. See `docs/evidence/m4-ocr-benchmark-2026-10-10.md` for denominators, latency, failures, configuration, privacy handling, and limitations.
