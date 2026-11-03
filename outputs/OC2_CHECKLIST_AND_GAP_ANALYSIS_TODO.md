# OC2 checklist and gap analysis — current snapshot

**Updated:** 2026-10-24

**Main:** `e1b03ad`

**Canonical checklist:** [`docs/oc2/STATUS.md`](../docs/oc2/STATUS.md)

## Verified

- [x] PR #26 merged before recovery PR #29.
- [x] Main quality gate passed.
- [x] TypeScript, 33/33 unit tests, production build, and 2/2 OC2 E2E passed on the recovered final tree.
- [x] Supabase production migrations, RLS, private buckets, and synthetic seed verified.
- [x] ERD Mermaid source and Data Dictionary match the five migrations.
- [x] Draft ERD SVG and 5610×8192 PNG are versioned under [`docs/oc2/assets/erd/`](../docs/oc2/assets/erd/README.md).

## P0 gaps

- [ ] Deploy `e1b03ad` to Vercel and capture HTTPS/HTTP 200 evidence.
- [ ] Verify admin access and non-admin denial in Incognito on production.
- [ ] Invite the official instructor email with least privilege; retain redacted evidence.
- [ ] Add the required title/footer/Auth/storage/security callouts to the ERD draft; export PDF, cross-review, and publish view-only.
- [ ] Record and upload the 03:00–05:00 final video; verify YouTube and Drive while signed out.
- [ ] Send the sanitized submission email and retain the Sent receipt.

## ERD export

Use [`docs/oc2/FITSYNC_OC2_ERD.mmd`](../docs/oc2/FITSYNC_OC2_ERD.mmd):

1. Quick: <https://mermaid.live/> → paste → export SVG/PNG.
2. Styled final: <https://app.diagrams.net/> → Arrange → Insert → Mermaid → Diagram → export PNG/PDF.
3. Show RLS boundary, hashed invitation, private storage, OCR-as-draft, and server-only service role.
4. Do not include credentials, secrets, private object paths, or real health records.

## Truth and security gates

- Admin/VietQR tables use synthetic demo data; they are not reconciled revenue evidence.
- OCR requires PT review and manual entry remains available.
- Zalo follow-up is intentional/manual; no automatic message is sent.
- Android/Google Play, production OCR, payment reconciliation, and Whisper are planned until direct evidence exists.
- Credentials must be shared through a separate secret channel, never committed or embedded in the submission email.
