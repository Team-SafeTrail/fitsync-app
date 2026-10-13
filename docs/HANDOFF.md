# FitSync project handoff

**Updated:** 2026-10-10
**Target branch:** `main`
**Active verification branch:** `fix/m4-verification-docs`
**Current milestone:** M4 in progress — M3 engagement remains verified

This file is the compact starting point for a new development chat. It records the current state and the decisions that should survive conversation resets. Read it before changing the repository, then use `docs/MVP_EXECUTION_PLAN.md` for detailed product scope and acceptance criteria.

## Product in one paragraph

FitSync is a mobile-first coaching workspace for independent Vietnamese personal trainers who manage roughly 5–20 active trainees. PTs use a responsive web workspace on desktop, tablet, or phone. Trainees start with a focused mobile web experience; a shared-backend Expo app comes after the web workflow is validated. The verified web flow now covers secure trainee invitation and InBody confirmation plus one daily trainee check-in, optional private meal media, PT activity/session review, and a manual inactivity follow-up queue.

## Source-of-truth order

When documents disagree, use this order:

1. Executable migrations, tests, and application behavior.
2. `docs/MVP_EXECUTION_PLAN.md` for current scope and delivery order.
3. `docs/architecture/` for accepted architecture decisions.
4. `DESIGN.md` for visual tokens and interface direction.
5. `docs/research/` for retained claim evidence.
6. `docs/archive/` and the sibling `fitsync-docs` repository for historical context only.

Earlier coursework claims about features, pricing, platforms, or outcomes do not override the active MVP plan.

## Live delivery state

- `main` is currently at `21c55ce`, the merge commit for [PR #11](https://github.com/Team-SafeTrail/fitsync-app/pull/11). There are no open pull requests as of 2026-10-10.
- [PR #13](https://github.com/Team-SafeTrail/fitsync-app/pull/13) merged at `c863954` on 2026-10-03 and closed Issue #3 after restoring the M4 backend security and verification gates.
- PR #11 rebased onto that accepted backend, removed its overlapping contract, added the OCR review workflow, and merged at `21c55ce` on 2026-10-05, closing Issue #4.
- [Issue #2](https://github.com/Team-SafeTrail/fitsync-app/issues/2) is the next ready M4 task. It remains open and assigned to Hưng and Việt for the consented-or-synthetic InBody 270 provider benchmark.
- [Issue #5](https://github.com/Team-SafeTrail/fitsync-app/issues/5) remains open and blocked; truthful UI/evidence assets depend on the provider decision and current review evidence.
- The active local branch repairs stale M2/M4 Playwright expectations and aligns active documentation with the merged state. The unrelated untracked `.agents/` and `skills-lock.json` are local skill configuration and must not be included without an explicit decision.

## Repository map

```text
fitsync-app/
  apps/web/                 Next.js marketing site, public demo, and web product
  supabase/                 Local config, migrations, seed data, and pgTAP tests
  docs/                     Active plan, handoff, ADRs, milestone plans, and evidence
  DESIGN.md                 Design system and visual rationale
  CONTRIBUTING.md           Team workflow, ownership, and validation rules
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
- Recorded the research and claim alignment in the archived landing reports and retained aggregate evidence in `docs/research/survey-evidence.md`.
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
- Consolidated the completed landing checkpoint and verification evidence into this handoff; the original checklist remains available in Git history.

### M3 — engagement

- Added immutable, one-per-application-day `checkins` and optional `meal_logs`, with versioned migrations, constraints, indexes, grants, and RLS for only the linked trainee and assigned PT.
- Added the private `meal-media` storage bucket. Trainees upload only beneath their own trainee path; linked PTs and trainees receive 60-second signed URLs, while unrelated and anonymous users cannot read or sign the objects.
- Added server-side note, file-size, declared-MIME, and JPEG/PNG/WebP binary-signature validation. The database transaction also requires the private object to exist before linking it to a check-in.
- Fixed the application timezone at `Asia/Ho_Chi_Minh`. A Monday reference date enters the warning queue Friday at 00:00 local time, after Tuesday, Wednesday, and Thursday fully elapse. A linked trainee with no check-in uses the invitation-acceptance application date as the reference.
- Added trainee check-in/history UI, private meal-photo display, PT activity history, explicit remaining-session editing, and a warning queue on the real `/workspace` routes.
- Follow-up is intentionally manual: FitSync can copy prepared Vietnamese text or open the trainee's Zalo profile, but there is no send endpoint or automatic network action.
- Added M3 pgTAP/RLS, domain, and Chromium coverage for persistence, private media, cross-tenant isolation, session updates, calendar/timezone boundaries, no automatic messaging, and desktop/mobile rendering.
- Updated the landing capability-status copy only, without changing the verified CTA hierarchy or repeating the landing redesign.

### M4 — OCR review workflow in progress

- Added the private `inbody-media` bucket, persisted normalized OCR attempts, assigned-PT read isolation, generated types, and an atomic idempotent confirmation function. M4 is not verified or user-complete yet.
- Corrected the initial backend merge so ordinary authenticated clients cannot forge or rewrite provider output. Validated attempts are written only through the server-only service-role client after the Server Action repeats authentication, role, assignment, file-size, MIME, and binary-signature checks.
- Added bounded provider timing, best-effort source-image cleanup when attempt persistence fails, and a 12 MB Server Action envelope for the documented 10 MB image limit.
- The provider remains intentionally unselected. The production/default adapter returns a recoverable `provider_unavailable` result and preserves manual entry; deterministic synthetic results require explicit test-only adapter construction.
- Replaced the broken M4 pgTAP plan with executable privilege, RLS, storage, confirmation, and cross-tenant behavior checks.
- Added responsive upload, pending, recoverable-failure, private-image preview, normalized-draft review, correction, cancellation/manual fallback, and explicit confirmation states to the existing InBody form.
- Image preprocessing applies orientation correction and WebP conversion server-side. Browser-side MIME/size feedback supplements, but does not replace, the server-side content and signature checks.
- The synthetic Chromium flow verifies a private upload, a populated draft, a PT edit before confirmation, a persisted OCR-sourced record, signature rejection, and continued manual entry. It does not establish production provider quality.
- ADR-003 records TWA as the proposed smallest Android packaging candidate. It is not accepted until PWA, Digital Asset Links, physical camera/upload, signed build, and Play Internal Testing evidence exist.

## Last verified product state

The current M1–M4 implementation was rechecked locally on 2026-10-10 with Node `v20.20.2` and npm `10.8.2`:

```bash
npm ci
npm run db:reset
npm run db:test
npx supabase db lint --local
# Generate to a temporary stream and compare with apps/web/src/types/database.ts.
npm run test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Verification evidence for this checkpoint:

- Supabase reset and schema lint pass; all 111 pgTAP checks pass, including OCR privileges, RLS, private storage, confirmation idempotency, and cross-tenant denial.
- Generated database types match the local schema.
- All 33 Vitest domain checks pass.
- Lint, typecheck, and the production build pass; the build contains 13 routes.
- All four Chromium workflows pass: public activation/tour, M2 manual InBody and tenant isolation, M3 engagement/private media/timezone warnings, and the deterministic M4 OCR review flow.
- The M4 browser test uses a deterministic adapter that is enabled only by the E2E environment. The production/default adapter still returns a recoverable unavailable state.
- The full OCR browser path requires the server-only `SUPABASE_SERVICE_ROLE_KEY` in the local test process. Keep its value out of source control, browser bundles, logs, documentation, and chat.
- `npm audit` currently reports 13 findings: two moderate, ten high, and one critical. No blanket or forced dependency upgrade was applied during this checkpoint.

These checks verify the merged backend and the synthetic review workflow; they do not complete M4. Provider benchmarking, governance approval for any real reports, a production adapter, measured provider evidence, and Android/Play proof remain open.

Local Supabase endpoints when running:

- API: `http://127.0.0.1:54321`
- Studio: `http://127.0.0.1:54323`
- Mailpit: `http://127.0.0.1:54324`

The current shell may need `sg docker -c '<command>'` until it inherits the user's Docker group. A fresh login should make ordinary `npm run db:*` commands work. Never copy keys from `apps/web/.env.local` into documentation or chat.

## Active milestone: M4

M3 engagement is complete and verified. M4 OCR-assisted InBody entry is in progress behind mandatory PT review and a consented-or-synthetic benchmark. The corrected persistence/authorization foundation and review interface are implemented, and the deterministic synthetic browser flow is verified locally. Provider selection and production extraction remain deliberately unavailable. Do not infer that payments, analytics, or a mobile/store release have started.

The repository planning cycle is currently EXE201 Week 5, following the confirmed Week 4 checkpoint; official LMS dates remain authoritative. OC1 is assessed during Weeks 5–7, OC2 plus OC3 during Weeks 13–14, and Trello is required for course tracking. [`EXE201-delivery-plan.md`](../EXE201-delivery-plan.md) maps those deadlines to the verified product sequence, existing GitHub issues, the team's Discord channels, and evidence gates. [`trello-weekly-refresh-prompt.md`](../trello-weekly-refresh-prompt.md) contains the Week 1–14 owner cards and safe instructions for refreshing the existing board around weekly lecturer review. Course targets do not override active milestone dependencies or establish that planned capabilities already work.

M4 planning is captured in `docs/plans/m4-ocr-architecture-and-benchmark-plan.md`, `docs/plans/m4-ocr-benchmark-protocol.md`, and `docs/architecture/adr-002-ocr-drafts-behind-provider-adapter.md`. The accepted direction is a server-only provider adapter in the modular monolith, a dedicated private source-image bucket, persisted normalized drafts, and a separate atomic confirmation step that reuses the existing five-field validation. Provider selection is intentionally open until at least two candidates are measured on a locked, consented-or-synthetic InBody 270 benchmark.

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

The landing redesign, monorepo move, and verified M1/M2 slice are recorded before the post-M2 landing checkpoint `8c0ee7e`. M3 is committed at `82f9c1b`, M4 planning at `5dd2756`, the initial M4 backend merge at `6036053`, the accepted backend correction at `c863954`, and the OCR review UI merge at `21c55ce`. The shared private repository is `Team-SafeTrail/fitsync-app`; inspect `git status`, open pull requests, and the latest `main` before beginning work. This live-delivery snapshot was checked on 2026-10-10.

## Known debt and risks

- `npm audit` reports 13 dependency findings (two moderate, ten high, and one critical). Triage and upgrade them as a focused task; do not run `npm audit fix --force` inside an active feature milestone.
- Password reset remains listed in the broader frozen MVP scope but is not part of the completed M1–M3 slices.
- App Store and Play Store applications do not exist yet. The mobile app remains a later milestone using the same backend and identities.
- Public pricing remains a hypothesis until a payment flow and pilot evidence exist.
- The OCR provider remains unselected until the consented benchmark passes. Production therefore returns a recoverable unavailable state rather than synthetic metrics.
- The deterministic OCR browser flow covers the clean draft, a PT correction, explicit confirmation, invalid-signature rejection, and manual fallback. Additional benchmark-driven low-confidence, missing-field, timeout, and provider-failure evidence remains part of M4 exit work.

## Resume commands

```bash
cd /home/hei/everything/Code/Organization/SafeTrail/fitsync-app
node -v
git status --short
npm run db:start
npm run dev
```

If the current shell does not inherit the Docker group, use `sg docker -c 'npm run db:reset'` and the equivalent wrapper for other database commands. If Supabase is already running, `npm run db:start` will report the existing services. Before finishing a schema or application change, run the relevant database tests, unit tests, lint, typecheck, build, and critical browser flow.
