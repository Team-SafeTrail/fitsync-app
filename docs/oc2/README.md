# Outcome 2 delivery pack

This folder is the repository-owned handoff for GitHub Issue #27 and the Trello ownership transfer from Hưng to Việt on 2026-10-24.

## Current outcome

Outcome 2 is **merged and implementation-ready, but not yet accepted as complete**. Repository quality gates and the Supabase production migration/seed are verified. The frontend sequence was repaired and merged as PR #26 (`094c5ee`) followed by recovery PR #29 (`e1b03ad`), which reapplied only the incremental changes from original PR #28.

The remaining critical path is:

1. Huy's Vercel production deployment of `e1b03ad` and browser authorization smoke test;
2. Toàn's final ERD PNG/PDF generated from the migration-derived Mermaid source;
3. Việt's instructor invitation, final recording, signed-out link QA, and submission email.

The canonical live checklist, ownership matrix, evidence, and closing order are in [`STATUS.md`](STATUS.md).

## Contents

- [`DATABASE_SCHEMA_HANDOFF.md`](DATABASE_SCHEMA_HANDOFF.md): migration-derived ERD source and relationship notes for Toàn.
- [`FITSYNC_OC2_ERD.mmd`](FITSYNC_OC2_ERD.mmd): standalone Mermaid source ready for Mermaid Live or draw.io.
- [`DATA_DICTIONARY.md`](DATA_DICTIONARY.md): field, key, constraint, and access dictionary for the eight OC2 tables.
- [`SUPABASE_CLOUD_RUNBOOK.md`](SUPABASE_CLOUD_RUNBOOK.md): safe Cloud creation, migration, synthetic seed, and evidence procedure.
- [`SUPABASE_PRODUCTION_EVIDENCE.md`](SUPABASE_PRODUCTION_EVIDENCE.md): redacted production verification results for migrations, RLS, buckets, and synthetic seed.
- [`DEMO_SUBMISSION_RUNBOOK.md`](DEMO_SUBMISSION_RUNBOOK.md): 04:15 recording plan, captions, link QA, and sanitized email template.
- [`VIDEO_WALKTHROUGH_SCRIPT_VI.md`](VIDEO_WALKTHROUGH_SCRIPT_VI.md): complete Vietnamese screen direction and narration for the 04:15 walkthrough.
- [`TOAN_ERD_DESIGN_BRIEF.md`](TOAN_ERD_DESIGN_BRIEF.md): exact diagram source, visual grouping, and export brief for Toàn.
- [`STATUS.md`](STATUS.md): canonical OC2 completion matrix, verified evidence, external blockers, owners, and closing order as of 2026-10-24.

## Evidence rule

Repository files prove only the implementation and reproducible procedure. Supabase Cloud, Vercel, ERD exports, YouTube/Drive visibility, and sent email require separate direct evidence. Never replace a missing external receipt with a target, fixture, screenshot mock, or planned URL.
