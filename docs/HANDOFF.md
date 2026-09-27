# FitSync project handoff

**Updated:** 2026-09-28
**Branch:** `feature/landing-product-redesign`
**Current milestone:** M4 next — M3 engagement is verified

This file is the compact starting point for a new development chat. It records the current state and the decisions that should survive conversation resets. Read it before changing the repository, then use `docs/MVP_EXECUTION_PLAN.md` for detailed product scope and acceptance criteria.

## Product in one paragraph

FitSync is a mobile-first coaching workspace for independent Vietnamese personal trainers who manage roughly 5–20 active trainees. PTs use a responsive web workspace on desktop, tablet, or phone. Trainees start with a focused mobile web experience; a shared-backend Expo app comes after the web workflow is validated. The verified web flow now covers secure trainee invitation and InBody confirmation plus one daily trainee check-in, optional private meal media, PT activity/session review, and a manual inactivity follow-up queue.

## Source-of-truth order

When documents disagree, use this order:

1. Executable migrations, tests, and application behavior.
2. `docs/MVP_EXECUTION_PLAN.md` for current scope and delivery order.
3. `docs/architecture/adr-001-monorepo-and-modular-monolith.md` for architecture.
4. `DESIGN.md` for visual tokens and interface direction.
5. `docs/landing-page-research-and-improvement-report.md` for the current landing and competitor analysis.
6. `docs/full-docs-to-landing-alignment.md` for research-to-marketing claim boundaries.
7. The sibling `fitsync-docs` repository for historical research and coursework context.

Earlier coursework claims about features, pricing, platforms, or outcomes do not override the active MVP plan.

## Repository map

```text
fitsync-app/
  apps/web/                 Next.js marketing site, public demo, and web product
  packages/                 Reserved for code genuinely shared by two applications
  supabase/                 Local config, migrations, seed data, and pgTAP tests
  docs/                     Active plan, architecture, alignment, and this handoff
  DESIGN.md                 Design system and visual rationale
  landing-conversion-alignment.md Completed pre-M3 landing checkpoint
  identity-foundation.md    Completed M1 checklist
  mvp-monorepo-foundation.md Completed M0 checklist and M2 pointer
```

Key route boundaries:

- `/` is the redesigned public landing page.
- `/app/*` is an honest, fixture-backed public product tour and a secondary acquisition path.
- `/login` and `/register` use Supabase authentication.
- `/workspace` is the protected product surface backed by real authenticated data.
- Keep fixture data and authenticated user data separate.

## Verified completed work

### Product and design research

- Reviewed all 14 Markdown documents in the sibling `fitsync-docs` repository.
- Reviewed the raw PT survey workbook. It contains 104 responses; only aggregate findings are used because the open-text fields contain duplication and there is no publication-consent field.
- Recorded the research and claim alignment in `docs/full-docs-to-landing-alignment.md`.
- Redesigned the landing page and auth screens into a consistent dark athletic visual system.

Useful survey aggregates:

- 84 of 104 respondents reported more than three weekly hours of administration.
- 73 of 104 manage at least five learners.
- 101 of 104 use Zalo or Messenger.
- 93 of 104 identified as a PT, coach, gym owner or manager, or a related role.

### M0 — repository and architecture

- Converted the project to npm workspaces with the existing Next.js app in `apps/web`.
- Kept the public website and responsive product in one Next.js deployment.
- Chose a modular monolith using Next.js and Supabase/PostgreSQL with RLS.
- Deferred Expo/React Native until the responsive web vertical slice works.
- Deferred shared packages until two applications actually consume them.
- Chose manual InBody entry before OCR so the core workflow does not depend on extraction quality.

### M1 — identity and core data foundation

- Added local Supabase configuration and versioned schema migration.
- Added `profiles`, `pt_profiles`, `trainee_profiles`, `trainee_invitations`, and `inbody_records` with constraints, indexes, triggers, grants, and RLS.
- Prevented ordinary users from changing protected role and subscription fields through column-specific grants.
- Added typed browser/server Supabase clients, cookie refresh middleware, PT registration, login, callback, logout, and protected workspace routing.
- Fixed the `/workspace` null-user crash by guarding both the layout and page with the request-cached `getCurrentUser()` helper.
- Generated database types at `apps/web/src/types/database.ts`.

### M2 — first real-data vertical slice

- Replaced the protected placeholder with role-aware PT and trainee workspaces under `/workspace` while preserving `/` and the fixture-backed `/app` demo.
- Added pre-account trainee records so a PT can create a roster entry before the trainee has an auth identity.
- Added transactional database functions for trainee creation, invitation preview, and invitation acceptance.
- Invitation links use 32 random bytes. Only the SHA-256 token hash is stored, links expire after seven days, and acceptance is single-use and email-bound.
- Added manual entry for the five InBody metrics with matching server and PostgreSQL bounds plus cross-field consistency checks.
- Added explicit PT confirmation and immutable verified biometric values. Nutrition targets remain PT-editable and are labeled as coaching drafts rather than medical instructions.
- Added trainee-only read views of the linked profile and verified records. RLS prevents unrelated PTs and trainees from reading or mutating the data.
- Added Vitest domain tests and Playwright browser flows covering the public demo/activation boundary, registration, roster creation, invitation acceptance, invalid-data rejection, verified persistence, nutrition updates, responsive rendering, and cross-tenant route denial.
- Completed a post-verification product-hardening pass after the first workspace was correctly challenged as too close to a technical test harness.
- Added a responsive role-aware product shell, guided PT empty state, structured roster with connection and verified-record status, trainee profile summary, and focused trainee mobile presentation.
- Added explicit invitation copy feedback with a legacy fallback for restricted clipboard contexts, displayed expiry context, and cleared stale trainee/InBody form values after successful writes.
- Replaced implementation-facing copy with coach-facing workflow guidance while retaining the existing dark Carbon visual language.
- Corrected the public journey after review: the documented primary landing CTA opens the fixture demo, while the visually secondary activation path opens `/register`; both destinations are explicitly labeled.
- Re-themed `/app/dashboard` and `/app/trainee` into the same dark Carbon palette and added a persistent sample-data banner plus a route to the real PT workspace.

### Post-M2 landing conversion alignment

- A focused review of the official TrueCoach, ABC Trainerize, Everfit, and PT Distinction websites found a consistent acquisition pattern: visible product proof supports a primary path into the real product, usually a no-card trial. Their anonymous demonstrations, when present, are explanatory rather than the main conversion destination.
- FitSync must not copy the mature competitors' trial claims because it does not yet have a defined trial or pilot operation. The truthful activation available now is PT registration at `/register`.
- The landing primary action is now real PT activation through `/register`. `/app/*` remains available as a clearly labeled secondary tour for coursework demonstrations and visitors who are not ready to register.
- The hero and first product proof now show the verified M2 workflow: roster state, secure invitation, manual five-metric confirmation, and the trainee's read-only record.
- Simulated OCR, hypothetical ROI, and proposed pricing remain explicitly labeled and appear after verified product evidence.
- `landing-conversion-alignment.md` records the completed checklist and verification evidence.

### M3 — engagement

- Added immutable, one-per-application-day `checkins` and optional `meal_logs`, with versioned migrations, constraints, indexes, grants, and RLS for only the linked trainee and assigned PT.
- Added the private `meal-media` storage bucket. Trainees upload only beneath their own trainee path; linked PTs and trainees receive 60-second signed URLs, while unrelated and anonymous users cannot read or sign the objects.
- Added server-side note, file-size, declared-MIME, and JPEG/PNG/WebP binary-signature validation. The database transaction also requires the private object to exist before linking it to a check-in.
- Fixed the application timezone at `Asia/Ho_Chi_Minh`. A Monday reference date enters the warning queue Friday at 00:00 local time, after Tuesday, Wednesday, and Thursday fully elapse. A linked trainee with no check-in uses the invitation-acceptance application date as the reference.
- Added trainee check-in/history UI, private meal-photo display, PT activity history, explicit remaining-session editing, and a warning queue on the real `/workspace` routes.
- Follow-up is intentionally manual: FitSync can copy prepared Vietnamese text or open the trainee's Zalo profile, but there is no send endpoint or automatic network action.
- Added M3 pgTAP/RLS, domain, and Chromium coverage for persistence, private media, cross-tenant isolation, session updates, calendar/timezone boundaries, no automatic messaging, and desktop/mobile rendering.
- Updated the landing capability-status copy only, without changing the verified CTA hierarchy or repeating the landing redesign.

## Last verified product state

The following checks passed on 2026-09-28 with Node `v20.20.2` and npm `10.8.2`:

```bash
sg docker -c 'npm run db:reset && npm run db:test && npm run db:types && npx supabase db lint --local'
npm run test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

The database suite passed 82 of 82 pgTAP checks across M1–M3, and Supabase schema lint reported no errors. The domain suite passed 12 of 12 Vitest checks. Three Playwright flows passed in Chromium and demonstrated:

- the landing primary CTA opens `/register`, while “Xem bản mẫu” opens the explicitly labeled fixture tour;
- the first landing proof shows the verified M2 workflow with synthetic data rather than leading with M3 or OCR concepts;
- the landing actions remain visible at 1440px and 390px, expose an amber keyboard focus state, and render without horizontal overflow;
- `/app/dashboard` uses the Carbon palette on desktop and mobile without horizontal overflow;
- PT registration, empty roster, trainee creation, and a single-use invitation;
- trainee credential creation and account linking;
- server rejection of physiologically inconsistent metrics without creating a record;
- successful confirmation, persistence after reload, and PT editing of nutrition drafts;
- trainee access to the same verified record at 430px and 390px mobile widths with no horizontal overflow;
- PT roster access at both 1440px desktop and 390px mobile widths with no horizontal overflow;
- invitation copy feedback, including the browser fallback used when modern clipboard permission is unavailable;
- an unrelated PT receiving a 404 for the protected trainee route;
- an authorized trainee submitting a note and signature-valid meal photo, with both persisting after reload;
- the assigned PT seeing the same check-in and private image while an unrelated PT cannot read, mutate, download, or create a signed URL for them;
- PT remaining-session updates persisting and appearing in the trainee view;
- no warning after only two full intervening dates, then a warning on the fourth local date after three full dates have elapsed;
- prepared-message copy feedback and an intentional Zalo link without any automatic messaging request;
- the M3 trainee and PT activity surfaces rendering without horizontal overflow at 390px and at the 1440px desktop viewport;
- no captured browser runtime errors.

The landing component accessibility scan found no statically detectable issues across 13 files. The production build completes with the landing and fixture tour statically rendered and the invitation/workspace routes dynamically rendered. `npm audit --audit-level=high` still reports the previously documented five findings (four high and one critical); the automated fix requires a breaking Next.js major upgrade and was intentionally not run in this checkpoint.

Local Supabase endpoints when running:

- API: `http://127.0.0.1:54321`
- Studio: `http://127.0.0.1:54323`
- Mailpit: `http://127.0.0.1:54324`

The current shell may need `sg docker -c '<command>'` until it inherits the user's Docker group. A fresh login should make ordinary `npm run db:*` commands work. Never copy keys from `apps/web/.env.local` into documentation or chat.

## Active next milestone: M4

M3 engagement is complete and verified. The next planned product milestone is M4 OCR-assisted InBody entry behind mandatory PT review and a consented benchmark. Do not infer that OCR, payments, analytics, or Expo/mobile have started from the M3 implementation.

M4 planning is captured in `m4-ocr-architecture-and-benchmark-plan.md`, `docs/architecture/adr-002-ocr-drafts-behind-provider-adapter.md`, and `docs/m4-ocr-benchmark-protocol.md`. The accepted direction is a server-only provider adapter in the modular monolith, a dedicated private source-image bucket, persisted normalized drafts, and a separate atomic confirmation step that reuses the existing five-field validation. Provider selection is intentionally open until at least two candidates are measured on a locked, consented-or-synthetic InBody 270 benchmark.

Before implementation sends any real report to a provider, assign a data owner and record consent, provider-processing permission, retention, deletion, and incident-response handling. Manual entry remains the product fallback if no candidate passes. Internal benchmark thresholds are release gates, not public accuracy or latency claims.

The local database contains only synthetic accounts created by the final E2E run. Use `npm run db:reset` (or the Docker-group form below) when a clean local state is needed.

## Implementation constraints

- Read `AGENTS.md` before editing Next.js code. It requires consulting the installed Next.js documentation because project conventions may differ from remembered APIs.
- Preserve the public `/app` tour and its explicit sample-data labeling, but do not make it the primary landing conversion path.
- Use migrations as the schema authority and regenerate TypeScript database types after schema changes.
- Enforce ownership in RLS. UI filtering is not authorization.
- Keep service-role credentials out of browser code.
- Store invitation token hashes, set expirations, and prevent reuse.
- Use server-side validation for all writes; client validation is for feedback only.
- Use synthetic data until consent, retention, deletion, and incident-response responsibilities are ready.
- Follow the active milestone order: validate M4 OCR before payments or Expo/mobile work.

## Repository checkpoint

The landing redesign, monorepo move, and verified M1/M2 slice are recorded before the post-M2 landing checkpoint `8c0ee7e`. M3 is committed with its implementation, tests, generated types, and final handoff on the same branch.

No pull request has been created and nothing has been pushed from this session. Inspect `git status` before new work and preserve any changes made after this checkpoint.

The final M3 worktree is committed. Preserve future intentional changes and inspect `git status` before beginning M4.

## Known debt and risks

- `npm audit` previously reported five dependency findings (four high and one critical). The suggested blanket fix includes a breaking Next.js major upgrade. Handle this as a focused dependency-upgrade task rather than running `npm audit fix --force` during feature milestones.
- Password reset remains listed in the broader frozen MVP scope but is not part of the completed M1–M3 slices.
- App Store and Play Store applications do not exist yet. The mobile app remains a later milestone using the same backend and identities.
- Public pricing remains a hypothesis until a payment flow and pilot evidence exist.

## Resume commands

```bash
cd /home/hei/everything/Code/Organization/SafeTrail/fitsync-app
node -v
git status --short
npm run db:start
npm run dev
```

If the current shell does not inherit the Docker group, use `sg docker -c 'npm run db:reset'` and the equivalent wrapper for other database commands. If Supabase is already running, `npm run db:start` will report the existing services. Before finishing a schema or application change, run the relevant database tests, unit tests, lint, typecheck, build, and critical browser flow.
