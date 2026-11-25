# FitSync web and Android feature handoff

Date: 2026-11-25
Audience: FitSync teammates and their coding agents
Use with: [AGENTS.md](AGENTS.md) · [User flows](USER_FLOWS.md) · [Design](DESIGN.md) · [Vietnamese feature checklist](FEATURES_VI.md)

## 1. Product direction

- **Goal.** Reduce the time personal trainers (PTs) and trainees spend entering, repeating, and finding coaching data. Help trainees follow through on activity and see their progress.
- **Target.** A responsive website and an installable Android app using the same backend, identities, and coaching records. Android is the working assumption for MAD. Confirm packaging, submission requirements, and device coverage.
- **Development.** Run the working stack, synthetic fixtures, checks, and AI fallback locally. Prefer free tools and zero paid runtime dependencies for the core experience. Hosted previews and releases are explicit CLI workflows.
- **Input design.** Manual entry is always available. AI proposes editable drafts for meal estimates, voice-to-form, and later InBody OCR. The user reviews a draft before it changes a record. Imported InBody results always require PT confirmation.
- **Engagement design.** Give users one clear next action, a quick way to log it, and an understandable progress history. Reminders should be optional and configurable.
- **Initial customer and user.** The proposed buyer is an independent PT or a small studio using the PT workflow. The trainee is a separate daily user with included access under the coaching relationship. Multi-PT gym administration, other sectors and direct consumer subscriptions are expansion hypotheses.
- **Proposed order.** Items below describe a candidate delivery sequence. The team still scopes implementation through GitHub issues.

## 2. Verified baseline

- **Merged web baseline.** `main` at `3c816e9`, from PR #31.
- **Latest candidate checked.** `agent/fitsync-final-product` at `4257334`, draft PR #48. All three checks reported success at that head.
- **Website.** Next.js/React frontend with Next.js Server Actions and Supabase Auth, Postgres, row-level security (RLS), private Storage, and database RPCs. The public tour uses fixtures. The authenticated workspace persists coaching records. Current deployed revision was not verified.
- **Android.** Expo/React Native U-01 prototype at `9ad9e64`, with an isolated `mobile/` lockfile. The x86_64 debug APK installed and launched on an Android 35 emulator. Synthetic sign-in, check-in and local PT web readback are pending. See [mobile runbook](../../../mobile/README.md).
- **Scope note.** The EXE201 web submission decision does not establish the MAD rubric.
- **Evidence.** [PR #31](https://github.com/Team-SafeTrail/fitsync-app/pull/31) · [PR #48 checks](https://github.com/Team-SafeTrail/fitsync-app/pull/48/checks) · [Code and contract map](https://github.com/Team-SafeTrail/fitsync-app/blob/3c816e9/docs/handoff/CODE_AND_CONTRACT_MAP.md) · [Historical test evidence and revisions](https://github.com/Team-SafeTrail/fitsync-app/blob/4257334/docs/TEST_EVIDENCE.md)

Status values for agents: **MERGED**, **DRAFT_PR**, **PARTIAL**, **PROPOSED**, **DEFERRED**, **UNVERIFIED**. A status applies to the pinned Git revisions. Release status requires environment evidence.

## 3. Existing product behavior

- **AUTH-01 — Account access | MERGED + DRAFT_PR**
  - PT signs up with email and password. PT and trainee sign in. Workspace and admin access are role-scoped.
  - The existing web callback exchanges a PKCE code for a session. PR #48 adds the password-recovery flow by email link and extends callback routing. Signup email confirmation is supported by code and disabled in the local sample configuration.
  - No user-facing email/SMS OTP entry, passwordless sign-in, social login, or MFA flow was found. Hosted email delivery and redirect settings are unverified. OTP and MFA remain separate product decisions.
  - Check: register a PT, sign in as both roles, reject protected access without a session, then test reset using the isolated mail inbox.
- **ROSTER-01 — Trainee profiles and invitations | MERGED + DRAFT_PR**
  - A PT creates a profile and a single-use, email-bound invitation. The web link expires after seven days. The server generates the token and stores its hash.
  - PR #48 adds invitation reissue/revoke, profile edits, archive/restore, and change history. The trainee business profile and auth identity have separate IDs.
  - Check: accept with the correct email. Verify that expired, reused, revoked, or wrong-email links do not attach an account.
- **BODY-01 — Manual InBody and progress | MERGED**
  - PT enters and confirms weight, skeletal muscle mass, body fat mass, percentage body fat, and optional total body water.
  - The trainee can view confirmed history. Manual entry records the save timestamp. Historical measurement dates and Excel import are unsupported in the checked revisions. Progress charts cover weight, skeletal muscle mass, and percentage body fat.
  - Check: save a valid record, open the learner view, then try an account outside the pair. Measurements must stay private across pairs.
- **CHECKIN-01 — Daily check-in and meal photo | MERGED**
  - The trainee submits one check-in per Vietnam local day. Optional note up to 500 characters and one private JPEG, PNG, or WebP photo up to 5 MB. File content is validated.
  - The PT can review recent activity and see an inactivity queue. The photo is an attachment to the check-in.
  - Check: submit with and without a photo, retry, attempt a second check-in for the same day, and confirm the PT sees the authorized result.
- **CHAT-01 — Coaching conversation | MERGED**
  - Private text chat with cursor history, periodic refresh, and a client-generated ID to avoid duplicate sends on retry. Maximum 4,000 characters.
  - No verified read receipts, chat attachments, push delivery, or realtime chat.
- **CAL-01 — Appointments | MERGED + DRAFT_PR**
  - PT creates appointments, scheduling rules reject overlap, and the trainee views the shared calendar. A workout plan is optional.
  - PR #48 adds PT changes or cancellation, trainee requests and withdrawal, PT decisions, and event history. The original appointment remains active while a request is pending.
- **CONTEXT-01 — Membership, notes, and PT sessions | MERGED + DRAFT_PR**
  - Date-based membership revisions and PT-only/shared notes are implemented separately from the PT session balance.
  - PR #48 adds explicit completion, optional session debit, and a one-time reversal in an append-only session ledger. A booking or check-in does not automatically debit a session.
  - Chat, calendar, and coaching-context features require their feature flags on the target environment. The checked sample configuration sets them off.
- **BILL-01 — FitSync subscription and administration | DRAFT_PR**
  - Approved on 17 November: Free allows three unarchived learner records including pending invitations. Pro costs VND 199,000 per PT per month, unlimited while active, without automatic renewal. Trainees participate at no separate charge. Alternate prices, tiers and trials are research.
  - Free allows up to three nonarchived trainee profiles, including pending invitations. Pro with current entitlement allows more. The backend enforces the cap.
  - Upgrade request, restricted admin overview, and private finance evidence exist in the candidate. TEST entries are excluded from actual KPIs. Real payment collection and settlement are unverified.

## 4. Whole-system delivery plan

- **Phase 1 · Verify and share the coaching loop.** Pin the local web/database revisions. A new PT understands the public landing, registers, creates a trainee, and shares an invite. The trainee accepts, checks in, views confirmed measurements, and can return directly to their workspace after sign-in. The PT finds the update, sees relevant history and can coordinate the next session. Run U-00 with synthetic data, access-isolation and retry checks. Verify a candidate preview on a matching non-production backend before asking the mentor to review.
- **Phase 2 · Add Android and progress reporting.** Put the first trainee journey on a real device against the same local backend. Then validate a simple monthly recap from recorded activity and verified measurements. Test other coaching functions as required by the agreed release scope. MAD submission format, parity, and any print/export deliverable need explicit decisions.
- **Phase 3 · Test differentiation and retention.** Evaluate BODY-DIARY-01, solo-history continuity, opt-in reminders and editable AI intake in small slices. Hưng owns the OCR dataset and benchmark. Integration follows its approved issue. Gamification, AI-generated commentary, paid consumer plans and additional markets depend on observed value and scope approval.
- **Commercial evidence alongside the product.** Have a PT perform two comparable tasks using their usual method and FitSync, such as recording a measurement and finding a trainee update. Record elapsed time, edits and confusion with consent. Use newly taken measurements and up to three synthetic trainees on candidate Free, or a clearly labeled synthetic Pro entitlement for a larger roster. Test willingness to pay separately if the owner reopens commercial validation. One conversation is an early signal. Keep market sizing, claims, and revenue tied to verified evidence. Evaluate direct PT/small-studio demos before paid acquisition.
- **Release scope.** Prioritize PT workflows and verifiable progress. History continuity remains proposed. The approved coursework offer and the decision to stop commercial operation after the course are in [product decisions](../../PRODUCT_DECISIONS.md).

## 4.1 Local Android baseline

Build one coaching workflow before expanding the Android backlog. The owner delegated the engineering choice and the local ADR-003 decision selects Expo with React Native and an installable debug APK. U-01 uses the isolated backend at PR #48 revision 4257334. Issue #42 still needs its smaller scope and dependencies confirmed. The official MAD submission format remains unverified.

1. **Design the first three screens.** Sign in, trainee Today, and daily check-in. Use the existing FitSync design language. Include loading, empty, error, and success states. Produce only the design needed to build and test this flow.
2. **Use the installed debug build.** The x86_64 build launched on an emulator. Follow the mobile runbook to connect it to the isolated stack. Physical-device acceptance remains under blocked issue [#42](https://github.com/Team-SafeTrail/fitsync-app/issues/42).
3. **Connect one real workflow using synthetic accounts.** Sign into the existing local backend as an already invited trainee. Read only the trainee's own Today data and submit a text check-in. Confirm the assigned PT sees it on local web at `http://127.0.0.1:3000` after reload. Both clients use the same local backend. Test a second account outside the pair and a retry that does not create a second check-in.
4. **Extend the same workflow.** Add private photos after a server-side upload boundary validates file contents as well as size, type and access. Cover invalid files and unauthorized access. Then add verified Android App Links for invitations. Verify denied camera permissions, an expired session, an upload failure, and retry on the device.
5. **Review before increasing scope.** Use the observed friction to decide the next flow. Calendar, chat, reminders, OCR, meal estimates, and voice-to-form stay documented as later work. Keep the existing web capabilities in the inventory until their Android equivalents are verified.

Use one local backend for both clients and record the app-to-backend interface. The early screen build can use fixtures. Record local emulator acceptance once the synthetic write and local web readback pass. Track #42 physical-device acceptance separately.

## 5. Proposed feature list and acceptance

- **APP-01 — Installable Android client | PARTIAL — local prototype**
  - Use Expo with React Native for the local U-01 baseline. Review the recorded ADR-003 decision and check official MAD artifact requirements independently.
  - Define a versioned mobile interface and accepted schema revision. Native calls reviewed endpoints or authenticated RPCs; Next.js Server Actions remain a web implementation detail. For text check-in, verify the selected contract against submit_daily_checkin. A created result displays the saved record. An already_submitted result reads back the existing record, preserves the one-per-day invariant, and tells the trainee if a revised note on retry was not applied. Include identifiers, roles, conflicts, pagination, and timezone. For native Android, use platform-backed secure session storage and verify refresh and sign-out on a device. Keep privileged keys server-side and preserve RLS.
  - Local U-01 acceptance is an already-linked synthetic trainee signing in on the emulator, submitting one text check-in, and the assigned PT reading the same note on local web after reload. Record retry and authorization outcomes. Physical hardware, new invites, photos and appointments are separate scope.
- **ACT-01 — Today, quick logging, and progress feedback | PARTIAL**
  - Existing foundation: PT and trainee Today screens, check-ins, history, and an inactivity queue.
  - Proposed: show the next assigned action, such as a scheduled session or daily check-in. Add quick completion with edit or correction, a weekly target chosen by the user or agreed with the PT, and a progress view showing completed actions and measurement trends. Start with one activity type and manual logging. Confirm whether workouts, steps, or other activity types are in scope before adding integrations.
  - Acceptance: the trainee can see, log, and correct today's action, then find it in the weekly history. A retry does not create a duplicate. Decide the visibility rules for each activity before exposing it to the PT.
- **ACT-02 — Reminders and re-engagement | PROPOSED**
  - Start with in-app prompts for due check-ins and upcoming appointments. Add Android notifications only after the app and preference flow work.
  - Support opt-in, quiet hours, local time, dismissal or snooze, and a settings surface to disable prompts. Keep notification previews free of private health details. Avoid duplicate reminders across devices.
  - Acceptance: a due action appears at the configured time, disappears or updates after completion, and respects opt-out and quiet hours.
- **AI-01 — Meal photo to editable calorie estimate | PROPOSED**
  - Input: a meal photo and optional portion, ingredients, or notes. Output: suggested food items, portion assumptions, approximate calories or range, and optional macros if supported.
  - Show the assumptions and uncertainty. Let the user add, remove, or correct items and confirm. Keep a manual meal-entry path. Test providers with synthetic or explicitly approved images. A real meal photo requires an approved provider, consent and retention decision before external processing. One meal photo currently exists inside a daily check-in. Add a meal record and stable sharing rules before promising multiple meals per day.
  - Acceptance: a clear meal can produce an editable estimate. Unclear portions stay explicitly uncertain. Failure preserves the photo and manual entry. No estimate is stored as confirmed or published as a PT target without the relevant confirmation.
- **AI-02 — Voice transcript to structured form draft | PROPOSED**
  - Start with one form, proposed as a trainee check-in or PT note. Flow: record or paste transcript → transcribe if needed → extract only allowed fields → validate → show the source text and editable draft → confirm.
  - Prefer Vietnamese support. Preserve units and negation. Leave missing or ambiguous fields blank. Apply existing form rules and save through its authorized backend operation. Use synthetic or explicitly approved inputs. Real meal photos or audio require an approved provider, consent and retention decision before external processing. The transcript is input data. It grants no instructions, permissions, or tool access.
  - Acceptance: review a Vietnamese transcript with omitted, corrected, and ambiguous fields. Verify correction before save, manual fallback, and cancellation with no coaching record created. Decide whether audio or transcript needs to be retained before storing either.
- **ONBOARD-01 — Role-based onboarding and first assessment | PARTIAL**
  - Web already supports PT signup, trainee profile creation and invite acceptance, and a separate manual assessment flow. A guided intake with three input options is proposed.
  - PT activation: create a minimal profile and share an invite, then open the first assessment with Manual, Voice draft, or Scan report. Allow assessment later. Trainee activation: accept the invite, open Today and complete a first check-in. An assessment is not required to access Today.
  - Manual entry stays available as the primary fallback. Voice drafts and scanned values open the same editable review with missing fields left blank, sources and measurement dates visible when known, and explicit PT confirmation before sharing.
  - Android U-01 begins with an already-linked trainee. It verifies sign-in, Today and text check-in. Guided onboarding and assessment entry follow that baseline. See U-10.
- **AI-03 — Multi-brand body-composition report intake | DEFERRED**
  - Existing foundation: image intake, file validation, private storage, draft/review, and manual confirmation. The default adapter has no live provider. The current manual form covers five fields.
  - Hưng owns the dataset and benchmark under #2. Integration follows the issue owner. Compare providers or local models against an approved representative dataset. Record error by field, unit and left/right mix-ups, time spent correcting, latency, and cost. Full reports require a support matrix by brand/device, report template and format (photo/PDF). Preserve report date when known, source page or region, original labels, units, and draft corrections. Include device-reported segmental lean or muscle and fat metrics (e.g., left/right arms, trunk and legs) only where a supported template provides them. Preserve the exact metric meaning, units and laterality. Distinguish mass from percentage and lean mass from muscle mass. Unsupported or ambiguous fields stay blank. Manual entry and PT approval use the same review rules.
  - Acceptance: manual entry remains usable. Extraction stays a draft. Only PT-confirmed values become visible as verified results. Unreadable or unsupported values remain blank and labeled.
- **NUT-01 — Published nutrition targets and multi-meal history | PROPOSED**
  - Separate a PT's draft from published targets visible to the trainee. Define meal timestamps, private photo access, corrections, and feedback.
  - Acceptance: the trainee sees the latest published target and their meal history. Draft targets stay private. A meal estimate does not overwrite a target.
- **REPORT-01 — Learner progress recap | PARTIAL**
  - Existing charts and confirmed measurement history are the starting point. Propose a monthly recap based on recorded check-ins, completed sessions when available, and confirmed measurements. Show time range, source, missing periods, and an actionable next step. Label the current timestamp as the recording date. Before reporting historical measurements by measurement date, decide how to capture that date separately and handle existing records with unknown dates. Add print or export once the on-screen recap is useful. Defer AI commentary and health reference interpretation until reviewed sources and evaluation exist.
- **BODY-DIARY-01 — Private progress photo journal | PROPOSED**
  - Optional dated photos for personal comparison, distinct from meal check-in photos and account authentication. Default to private. Define sharing, revocation, deletion, retention, and upload validation before implementation.
- **CONTINUITY-01 — Trainee history after coaching ends | PROPOSED**
  - Current archive behavior leaves existing authorized reads in place. An account can link to only one trainee profile. First define access after coaching ends, relinking, and data retention. Ending the former PT's access requires a reviewed policy and data model change. Never transfer private PT notes to the trainee or a future coach. Validate willingness to return to personal history before adding self-service tracking, premium or billing. Include history visibility and export as open policy decisions.
- **OPS-01 — Web and App release readiness | PROPOSED**
  - Record web commit, App build, backend environment, migration revision, and feature flags. Verify email delivery, auth callbacks, access isolation, and backup/restore with synthetic data as applicable.
  - Resolve consent, retention/removal, support, and abuse limits before any pilot with real data. Confirm whether payment, OTP/MFA, Play Store, or offline writes are in release scope.

## 6. Local-first and CLI workflows

- **Local workflow.** Use the repository lockfile and existing scripts on the selected checkout. The candidate documents Node 20+, npm 10+, Docker, and a local Supabase stack.
  - From the repo root, candidate demo sequence: `npm.cmd ci --ignore-scripts --cache ../outputs/npm-cache`, `npm.cmd run demo:plan`, `npm.cmd run demo:prepare`, `npm.cmd run demo:start`. Review the plan before preparing. Use isolated synthetic fixtures and preserve existing environment files.
  - Relevant gates: `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run build`, `npm.cmd run db:test` against local Supabase, and the relevant browser suite with the documented fixture setup. Check the current revision's scripts before execution. On POSIX, use npm in place of npm.cmd.
  - Keep AI adapters replaceable. CI and the local core flow use deterministic fixtures or manual input. Benchmark an actual offline model only when that task is scoped, with synthetic or approved public examples. Local development does not imply that every future production model will run on-device.
- **Preview by Git push.** Push the authorized feature branch with `git push -u origin HEAD` after confirming the branch and remote. If the Vercel Git integration is connected and configured for previews, verify the preview URL and Git revision from the resulting deployment.
- **Backend gate.** Use a separate non-production Supabase project or an isolated local stack for preview checks. The candidate handoff recorded 20 public tables and the historical cloud check recorded eight. Counts alone do not prove compatibility. Huy is documented as managing the production site. Verify the current schema, rehearse the required migrations and have the authorized owner coordinate rollout before promoting the candidate. [Historical test evidence and revisions](https://github.com/Team-SafeTrail/fitsync-app/blob/4257334/docs/TEST_EVIDENCE.md)
- **Preview by Vercel CLI.** Link the correct existing project and scope only when authorized. From the configured local project directory, run `vercel deploy`. Verify the preview URL, source revision, environment, and signed-in flows using synthetic accounts. Check the project root and preview environment before deployment.
- **Production by CLI.** For an approved release, use the team's chosen Git or CLI route. `vercel deploy --prod` targets production. Handle Supabase changes separately with reviewed migrations, a rehearsal, and the authorized target. A web push or deployment does not publish an Android build or establish database rollout.
- **Android build and release.** ADR-003 selects Expo/React Native for local U-01. Use the pinned tooling and commands in the [mobile runbook](../../../mobile/README.md). A signed release, Play distribution and MAD acceptance remain unverified.
- **References.** [FitSync demo workflow](https://github.com/Team-SafeTrail/fitsync-app/blob/4257334/docs/DEMO_WORKFLOW.md) · [Supabase local workflow](https://supabase.com/docs/guides/local-development/cli-workflows) · [Vercel CLI deployment](https://vercel.com/docs/projects/deploy-from-cli) · [Vercel Git integration](https://vercel.com/docs/git)

## 7. Decisions to confirm

- Official MAD submission requirements, including whether a debug APK, signed AAB, or Play Store track is required.
- Which PT and trainee actions must be present on the first Android release.
- The first activity type, what the PT may see, and whether reminders are needed in v1.
- Which form voice should fill first and whether meal estimates are in the first release.
- Whether OTP, MFA, offline writes, and payment belong in the release scope.
- The release baseline and environment. Confirm which PR #48 flows are accepted before using them as a team dependency.
