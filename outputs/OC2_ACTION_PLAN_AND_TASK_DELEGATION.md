# OC2 action plan — current execution snapshot

**Updated:** 2026-10-24

**Canonical status:** [`docs/oc2/STATUS.md`](../docs/oc2/STATUS.md)

**Production revision:** `e1b03ad95b4fa5306ec7c2a4d9f5ca443e22cffd`

## Completed

- [x] PR #26 approved, CI passed, squash-merged at `094c5ee`.
- [x] Accidental PR #28 → #26 branch merge removed.
- [x] Original #28 incremental changes reapplied through PR #29 and squash-merged at `e1b03ad`.
- [x] Supabase production: 5 migrations, 8 RLS tables, 2 private buckets, synthetic seed.
- [x] Migration-derived ERD source and Data Dictionary prepared.

## Critical path

1. **Huy:** deploy `e1b03ad` to Vercel and return an HTTPS URL with HTTP 200 evidence.
2. **Việt + Huy:** test admin/non-admin authorization in Incognito and responsive behavior on production.
3. **Toàn + Hưng/Huy:** export [`docs/oc2/FITSYNC_OC2_ERD.mmd`](../docs/oc2/FITSYNC_OC2_ERD.mmd) as PNG ≥2560 px and PDF, review against migrations, publish view-only.
4. **Việt:** invite the official instructor email to Supabase using least privilege; retain a redacted receipt.
5. **Việt:** record the 03:00–05:00 final walkthrough, upload YouTube Unlisted + Drive, and run signed-out link QA.
6. **Việt + reviewer:** send the sanitized submission email and retain the Sent receipt.

## ERD web workflow

- Fast export: paste the `.mmd` source into <https://mermaid.live/> and export SVG/PNG.
- Final Carbon-style deliverable: use <https://app.diagrams.net/> → **Arrange → Insert → Mermaid → Diagram**, style editable shapes, then export PNG/PDF.
- Never add passwords, keys, tokens, connection strings, signed URLs, or real health data.

## Do not claim as complete yet

- Vercel production: expected URL still returned HTTP 404 at the latest 2026-10-24 check.
- Admin/non-admin production acceptance, instructor invitation, final ERD export, final video, link QA, and submission email remain pending.
- VietQR rows are synthetic UI examples; Android, production OCR, payment reconciliation, and Whisper remain planned unless separately evidenced.

See [`docs/oc2/DEMO_SUBMISSION_RUNBOOK.md`](../docs/oc2/DEMO_SUBMISSION_RUNBOOK.md) for the recording/email sequence and [`docs/oc2/DATA_DICTIONARY.md`](../docs/oc2/DATA_DICTIONARY.md) for schema details.
