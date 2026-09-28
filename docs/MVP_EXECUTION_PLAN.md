# FitSync MVP execution plan

**Status:** Active implementation baseline
**Version:** 1.3
**Updated:** 2026-09-28
**Owner:** SafeTrail
**Supersedes for implementation:** conflicting scope, status, price, platform, and outcome statements in earlier FitSync coursework documents

## 1. Product outcome

FitSync is a mobile-first coaching workspace for independent Vietnamese personal trainers who manage approximately 5–20 active trainees. PTs use a responsive web workspace on laptops, tablets, and phones. Trainees use a focused phone experience in the web app first and a store-distributed mobile app later.

The MVP is working when a real PT can create a trainee, record and verify an InBody result, and have that trainee sign in and see the same record. A trainee can then submit a check-in that appears in the PT workspace. Data must persist and remain isolated from other PTs and trainees.

## 2. Platform boundaries

| Surface | MVP responsibility | Delivery |
| --- | --- | --- |
| Public website | Product explanation, verified M2 product evidence, secondary fixture-backed tour, pricing hypothesis, legal pages, signup entry | `apps/web`, Next.js |
| PT web workspace | Roster, trainee profiles, manual InBody entry, OCR review, sessions, alerts, check-ins | `apps/web`, responsive Next.js |
| Trainee web experience | Invitation, targets, check-ins, meals, progress | `apps/web`, mobile-first Next.js |
| Mobile app | Camera-first PT actions, trainee daily companion, push notifications | Expo/React Native after web vertical slice |
| Backend | Auth, PostgreSQL, RLS, private storage, server operations | Supabase plus server-only application code |

Web and mobile use the same identities, database, storage policies, domain rules, and API contracts. Marketing pages and the authenticated web app remain one deployment because they share signup, analytics, branding, and routing.

### Public acquisition boundary

- `/workspace` is the real authenticated product surface and is the destination after signup.
- `/app/*` is a public, fixture-backed product tour. It must remain clearly labeled as sample data and must never be presented as persisted user work.
- The landing page's primary action leads to real PT activation through `/register`; the public tour is a secondary evaluation path.
- Real, synthetic M2 screens should provide the main product proof. OCR, check-ins, payments, and mobile-app concepts must be labeled by their actual capability status.
- Do not advertise a free trial, pilot participation, support response time, or final price until the corresponding operational flow and evidence exist.

## 3. Frozen MVP scope

### PT capabilities

- Register, sign in, sign out, and reset a password.
- Create, edit, archive, search, and filter trainees.
- Invite a trainee through a single-use link.
- Record total and remaining package sessions.
- Enter the five core biometric fields manually.
- Upload an InBody image, review draft extraction, correct every field, and explicitly confirm before saving.
- View biometric history and simple weight/body-fat trends.
- See a warning after at least three calendar days without a trainee check-in.
- Review trainee check-ins and prepare a Zalo follow-up message.

### Trainee capabilities

- Accept an invitation and create credentials.
- View only their own profile, verified biometrics, draft nutrition targets, and session balance.
- Submit a daily check-in with optional note and meal photo.
- View their own check-in and biometric history.

### Commercial baseline

- Free hypothesis: up to 3 active trainees and 3 OCR attempts in total.
- Pro hypothesis: 199,000 VND per month.
- Early pilots may use manually verified VietQR payments.
- No public checkout, unlimited-use promise, trial promise, or final price until the related flow works and is tested.

## 4. Deferred scope

The following are not required for the MVP vertical slice: App Store release, automated VietQR webhooks, studio administration, voice transcription, wearables, meal recognition, prescribed meal plans, anonymous leaderboards, rewards marketplace, before/after photos, medical-risk alerts, complex offline mutation queues, and automated workout-motion analysis.

Android distribution is an EXE201 delivery milestone after the web MVP is stable. iOS follows after privacy, Apple developer, and review requirements are ready.

## 5. Core workflows and acceptance criteria

### A. PT onboarding and trainee creation

1. A visitor creates a PT account and reaches an empty roster.
2. The PT creates a trainee with name, goal, optional phone number, and session package.
3. The system generates a one-time invitation link.
4. The invited trainee creates credentials and becomes linked to that PT.

**Accepted when:** the data survives reload; the PT sees the trainee; the trainee sees their own home screen; unrelated authenticated users receive no record.

### B. Manual InBody record

1. The PT opens a trainee and chooses manual entry.
2. The PT enters weight, skeletal muscle mass, body fat mass, body-fat percentage, and optional total body water.
3. The system checks physiological bounds and highlights cross-field inconsistencies.
4. Nutrition values are presented as editable coaching drafts, not medical prescriptions.
5. The PT confirms and saves the record.

**Accepted when:** invalid values cannot be silently saved; the verified record appears in both authorized views; the audit record identifies the PT and timestamp.

### C. OCR-assisted entry

1. The PT uploads JPEG, PNG, or WebP up to 10 MB.
2. Server-side validation checks content type and file signature.
3. The OCR service returns draft fields or a recoverable failure.
4. Low-confidence or inconsistent fields are clearly marked.
5. The PT can correct and confirm or continue with manual entry.

**Accepted when:** no OCR result is automatically committed; failures never block manual entry; benchmark results exist before accuracy or latency is advertised.

### D. Trainee check-in and PT intervention

1. The trainee records a daily check-in and optional meal photo.
2. The PT can see the update in the trainee activity view.
3. After three full calendar days without check-in, the trainee enters the warning queue.
4. The PT can copy a prepared message or intentionally open Zalo.

**Accepted when:** no automatic message is sent; warning dates use the application timezone consistently; unauthorized users cannot fetch the check-in or media.

**Verified M3 calendar rule:** the application timezone is `Asia/Ho_Chi_Minh`. The reference is the latest local check-in date, or the local invitation-acceptance date when no check-in exists. A reference date of Monday becomes warning-eligible Friday at 00:00 application time, after Tuesday, Wednesday, and Thursday have fully elapsed.

## 6. Initial data model

| Table | Essential fields |
| --- | --- |
| `profiles` | auth user id, role (`pt`, `trainee`, `admin`), display name, phone, timestamps |
| `pt_profiles` | profile id, gym affiliation, plan, plan expiry |
| `trainee_profiles` | profile id, assigned PT id, goal, status, total sessions, remaining sessions, engagement start, last check-in |
| `trainee_invitations` | PT id, normalized invitee contact, token hash, expiry, accepted timestamp |
| `inbody_records` | trainee id, PT id, five metrics, draft nutrition fields, source, manual-edit flag, verified-by, recorded timestamp |
| `checkins` | trainee id, application-local check-in date, optional note, submitted timestamp |
| `meal_logs` | check-in id, trainee id, private photo path, validated MIME type and size, timestamp |
| `ocr_attempts` | PT id, trainee id, private source path, provider status, field confidences, error code, timestamp |
| `subscriptions` | PT id, plan, status, period dates, payment verification mode |
| `payment_records` | subscription id, amount, reference, evidence path, verification actor and timestamp |

Database migrations are authoritative. Generated TypeScript database types must be refreshed after every schema change.

## 7. Authorization and privacy rules

- Deny database access by default and enable RLS on every user-data table.
- A PT may access only trainees assigned to that PT and records belonging to those trainees.
- A trainee may access only their own profile and records; they cannot write verified biometrics or subscription state.
- Administrative access must be explicit, audited, and separated from ordinary support activity.
- InBody and meal images use private buckets and short-lived signed URLs.
- Service-role credentials never enter browser or mobile bundles.
- Validate file size, MIME type, and binary signature server-side.
- Do not accept real health data until consent, retention, deletion, incident response, and Vietnam Decree 13 responsibilities have been reviewed.
- Logs and analytics must exclude biometric values, meal images, tokens, passwords, and private signed URLs.

Required isolation tests: PT A cannot read or mutate PT B’s trainee; trainee A cannot read trainee B; unauthenticated requests cannot retrieve profiles or media; expired invitation tokens fail; repeated payment callbacks cannot create duplicate entitlement.

## 8. Architecture decisions

- Use an npm monorepo with `apps/web`, future `apps/mobile`, and only proven shared packages.
- Keep the MVP as a modular monolith: Next.js plus Supabase, with server-only adapters around OCR, storage, and payment providers.
- Use database migrations and RLS as the authorization foundation.
- Start with responsive web to validate the full workflow; add Expo mobile against the same backend.
- Start with manual biometric entry, then attach OCR to the same validation and confirmation form.
- Start with manually verified VietQR payment evidence, then add signed webhook reconciliation.

## 9. Delivery milestones

| Milestone | Status | Deliverable | Exit evidence |
| --- | --- | --- | --- |
| M0 Foundation | Verified | Monorepo, active plan, staging conventions | Root checks pass; plan and ADR reviewed |
| M1 Identity | Verified | Supabase local project, migrations, auth, profiles, RLS | Automated cross-role isolation tests pass |
| M2 First vertical slice | Verified | PT creates trainee and verified manual InBody record; trainee sees it | Desktop and mobile-browser E2E demonstration |
| M3 Engagement | Verified | Check-ins, meal upload, session balance, three-day warning | Desktop/mobile E2E plus RLS and timezone-boundary tests pass |
| M4 OCR | Next | InBody 270 extraction behind mandatory review | Consented benchmark and failure tests pass |
| M5 Pilot funnel | Planned | Real signup CTA, analytics, support and deletion flow | Acquisition-to-activation events visible |
| M6 Paid pilot | Planned | Manual VietQR evidence and entitlement | Reconciled real transactions with consent |
| M7 Android | Planned | Expo app or justified store-ready wrapper using production backend | Play testing-track listing and install evidence |

### EXE201 schedule overlay

The team confirmed that it is currently in Week 4, OC1 is assessed during Weeks 5–7, and OC2 plus OC3 are assessed during Weeks 13–14. Trello is required for course tracking. The week-by-week ownership, Trello contract, Discord routing, and evidence gates are in [`EXE201-delivery-plan.md`](../EXE201-delivery-plan.md).

This schedule does not change the dependency order above. M4 must retain mandatory PT review and its privacy gate; M5 must define safe measurement before analytics evidence; M6 must reconcile genuine payments before revenue is claimed; and the Android path must be chosen from the current application constraints before scaffolding a mobile client.

## 10. EXE201 evidence model

### Outcome 1

- Public production and staging URLs, release identifier, Play testing/public listing, working core workflow, test report, project board, and a recorded demo.

### Outcome 2

- Two named acquisition channels with UTM links; source-level visits, signups, activations, and installs; funnel definitions; dated exports from analytics and Play Console.

### Outcome 3

- Required count confirmed against the current course rubric; unique paying PT accounts; transaction references and reconciled subscription rows; consented feedback; usage evidence; final report and demo.

Targets, fabricated contacts, draft scripts, and planned channel results are not evidence. Personal information and bank records must be redacted in academic deliverables.

## 11. Analytics events

Minimum events: `signup_started`, `signup_completed`, `trainee_created`, `invitation_accepted`, `inbody_manual_started`, `ocr_attempted`, `inbody_verified`, `checkin_submitted`, `warning_viewed`, `zalo_message_copied`, `upgrade_viewed`, and `payment_verified`.

Each event needs a documented owner, trigger, allowed properties, and test. Use pseudonymous IDs; do not attach health values or user-entered notes.

## 12. Environments and quality gates

- **Local:** Supabase local services and seeded synthetic data.
- **Staging:** production-like policies with synthetic or explicitly consented test data.
- **Production:** separate project, secrets, storage, analytics, backup, and access controls.

Every milestone must pass lint, TypeScript, focused unit tests for domain rules, RLS integration tests, and E2E tests for the changed critical flow. Production releases require migration review, rollback notes, privacy-impact review for new data, and post-deploy smoke tests.

## 13. Immediate implementation backlog

M0 through M3 and the post-M2 landing conversion checkpoint are complete. Their verified outcomes are consolidated in `docs/HANDOFF.md`; the removed implementation checklists remain available in Git history.

M4 OCR is next. Follow `docs/plans/m4-ocr-architecture-and-benchmark-plan.md`; keep mandatory PT review, consented benchmark evidence, recoverable failure behavior, and the existing manual-entry path as its gates. Do not pull payment, analytics, or Expo work forward with OCR.

## 14. Change control

New scope enters this document only when it supports a measured pilot need or a mandatory course outcome. Capability status must be one of `prototype`, `implemented`, `verified`, or `released`. Only `verified` or `released` capabilities may be described publicly as working.
