# FitSync: document and alignment scan

Date: 2026-10-30. Inspected local checkout `e1b03ad` and its existing uncommitted
video work. Read-only product review; this document does not replace the PRD.

## Owner correction

The owner says the application is far from the original development idea. He
asked to prioritize finding the documents and installing relevant project skills;
the vision interview is deferred. The current PT-centric MVP plan is an existing
decision record, not renewed owner approval. Do not reconstruct the intended
product from today's UI and then ask the owner to accept it.

## Documents to read

| File | What it establishes | Limit |
| --- | --- | --- |
| [MVP execution plan](MVP_EXECUTION_PLAN.md) | Existing persona, PT/trainee workflow, boundaries, milestones and acceptance criteria | Updated 2026-10-10; disputed as a representation of the owner's idea |
| [Handoff](HANDOFF.md) | Historical implementation and verification checkpoint | Updated 2026-10-10; its commit and PR status is older than local history |
| [Full docs-to-landing alignment](archive/landing/full-docs-to-landing-alignment.md) | Previous review of 14 original documents; identifies PRD, business and OCR sources | Archived assessment, not the original PRD or new product approval |
| [Landing redesign report](archive/landing/fitsync-landing-redesign-master-report.md) | Earlier architecture and visual proposals; preserves one quoted owner question about web/mobile | Superseded; do not turn its recommendation into owner preference |
| [ADRs](architecture/) | Monolith, OCR adapter and proposed Android packaging decisions | Separate accepted decisions from proposals and verified delivery |
| [EXE201 delivery plan](../EXE201-delivery-plan.md) | Coursework timetable, responsibilities and evidence expectations | Course deliverables do not determine customer value or validate a startup |
| [OC2 status](oc2/STATUS.md) | Older submission checkpoint and remaining evidence | Its PR status predates current local merge history |
| [Feature readiness](oc2/video/feature-readiness-check.md) | More recent 2026-10-24/25 recording assessment, real/synthetic boundaries and limitations | Local, untracked work; historical checks were not rerun in this scan |
| [Video pipeline](oc2/video/README-video.md) | Existing browser recording, FFmpeg edit, voice studio and 03:55 visual preview | Preview is not proof that final-submission gates or narration are complete |
| [Survey evidence](research/survey-evidence.md) | Retained aggregate counts and limitations of the 104-response workbook | No fresh workbook verification; no product-market-fit, customer or revenue proof |

## Original sources not found here

The archived alignment report refers to a separate `fitsync-docs` repository,
including:

- `docs/01-product/PRD.md`
- `docs/01-product/GAMIFICATION_AND_RETENTION.md`
- `docs/02-architecture/OCR_PIPELINE_SPEC.md`
- `docs/05-business/BUSINESS_MODEL_AND_GTM.md`
- `docs/02-architecture/SYSTEM_DESIGN.md`

The sibling `../fitsync-docs` is absent. Filename discovery in the current repo,
nearby workspace and local Git history did not locate the original PRD file.
History retains alignment reports, not a recovered original PRD. This does not
prove the documents do not exist on GitHub, Drive or another computer. No external
account was connected and no replacement PRD was invented.

A read-only check using existing GitHub access returned HTTP 404 for the candidate
paths `Team-SafeTrail/fitsync-docs` and `hei1sme/fitsync-docs`. This does not establish
deletion: the repository may have moved, have another name, or be inaccessible to
the current credentials. No new login or permission grant was attempted.

## Confirmed inconsistencies

1. **Android marketing exceeds local evidence.**
   `ContactAndAppSection.tsx:253-279` describes Expo EAS, Android 8+, approximate
   APK size, SecureStore and an APK download. No mobile workspace or APK was
   found in this checkout. The more recent readiness assessment also records a
   missing production APK. This scan checked source; it did not retest that URL.
2. **OCR remains unavailable by default.**
   `features/workspace/ocr-adapter.ts` returns `UnavailableOcrAdapter`. Review UI
   and deterministic tests are not a production OCR provider. Whether OCR should
   remain the next product priority is an owner decision, not resolved here.
3. **Admin presentation mixes real and sample information.**
   `features/admin/data.ts` attempts three live counts, with synthetic fallback;
   transactions, revenue and other figures remain fixtures. This does not prove
   a working commercial back office. Its contribution to the startup's first
   customer workflow has not been established.
4. **The documentation checkpoint is stale.**
   Local history includes merges #26 and #29 after the PR #11 checkpoint described
   in `HANDOFF.md`; newer limitations are scattered through untracked video docs.
   Do not repeat old CI/production claims as freshly verified facts.
5. **Delivery order is currently a technical dependency chain.**
   The plan puts OCR before the pilot funnel and paid pilot. This is an existing
   engineering decision; it does not establish that user discovery or a manual
   pilot must wait for OCR. Revisit it only after recovering the intended product.

## Changes deliberately not made

No redesign, feature removal, OCR provider selection, milestone rewrite, pricing
change, analytics installation, seed operation or deployment. Existing `.gitignore`,
`ERD.jpg`, `docs/oc2/video/` and `scripts/video/` changes were preserved. Added only
project skills, their safety/provenance records and document navigation.

## Next alignment step

Recover the original source if available, then compare: owner intent, previous
plans, implemented behavior and verified evidence. Record decisions to keep,
change, defer or remove in a short reviewed brief. Skills may help that process;
they cannot choose the product on the owner's behalf. The interview is deferred,
so no additional owner questions are required to finish this setup.
