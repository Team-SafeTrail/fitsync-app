# FitSync MVP execution plan

**Status:** Active implementation baseline
**Version:** 2.0
**Updated:** 2026-10-11
**Owner:** SafeTrail
**Supersedes for implementation:** conflicting scope, status, price, platform, and outcome statements in earlier FitSync coursework documents

## 1. Product outcome

FitSync is a unified coaching workspace for independent Vietnamese personal trainers who manage approximately 5–20 active trainees. It replaces the fragmented combination of Zalo or Messenger, spreadsheets, notes, paper InBody reports, and separate workout trackers with one private PT–trainee relationship.

Each linked PT and trainee shares one **Unified Coaching Timeline**. Ordinary messages and structured coaching events appear together, while meals, daily check-ins, workouts, InBody records, nutrition targets, and session balances remain authoritative domain records rather than unstructured chat text.

The product is successful when a PT can onboard a trainee, communicate, assign work, review adherence, verify progress, and intervene without leaving FitSync for the core coaching loop. Trainees use a phone-first Expo application; PTs use both the full responsive web workspace and the mobile application. Data persists, synchronizes across clients, and remains isolated from every unrelated account.

## 2. Product and platform boundaries

| Surface | Responsibility | Delivery |
| --- | --- | --- |
| Public website | Product explanation, verified evidence, fixture-backed tour, legal pages, signup entry | `apps/web`, Next.js |
| PT web workspace | Full roster, trainee records, conversation history, workouts, InBody review, sessions, alerts, analytics-ready operations | `apps/web`, responsive Next.js |
| Transitional trainee web | Invitation, existing verified records, and browser fallback while mobile is built | `apps/web`, mobile-first Next.js |
| Mobile application | Primary trainee companion plus PT on-the-go inbox, camera actions, workouts, push notifications, and deep links | `apps/mobile`, Expo/React Native |
| Backend | Auth, PostgreSQL, RLS, private storage, realtime delivery, domain operations, notification dispatch | Supabase plus server-only application code |

Web and mobile share identities, database rules, storage policies, domain validation, and versioned contracts. Mobile must not depend on Next.js Server Components or browser cookies. Safe reads may use Supabase with RLS; privileged or multi-record writes use reviewed RPCs or server endpoints.

### Unified Coaching Timeline contract

- One private conversation exists for each active PT–trainee relationship in the first release.
- Human-authored text and media are messages. Meal logs, check-ins, workout assignments/completions, verified InBody records, nutrition updates, and session changes are structured records presented as timeline cards.
- Timeline cards reference their authoritative domain record; message payloads do not duplicate biometric or nutrition data.
- Realtime updates improve responsiveness but do not replace durable database writes.
- Push notifications contain only a generic prompt and pseudonymous routing identifier. They never contain biometric values, meal notes, private media URLs, tokens, or message bodies.
- Zalo sharing remains an optional fallback/export action, not the primary coaching workflow and never an automatic send.

### Public acquisition boundary

- `/workspace` is the real authenticated web product.
- `/app/*` is a fixture-backed tour and must stay labeled as sample data.
- The primary landing action leads to real PT activation through `/register`; the tour is secondary.
- Capabilities may be marketed as working only after they are verified or released. Chat, workouts, payments, analytics, OCR quality, and mobile-store availability must retain truthful status labels until their exit evidence exists.

## 3. Frozen first-release scope

### PT capabilities

- Register, sign in, sign out, reset a password, and manage a profile.
- Create, edit, archive, search, and filter trainees.
- Invite a trainee through a single-use link.
- Open one private conversation and unified history for each assigned trainee.
- Send text and private images; see delivery failure, unread state, and read state without presence surveillance.
- Review structured daily check-ins and multiple meal entries from the same timeline.
- Assign a basic workout with title, scheduled date, instructions, exercises, sets, reps, optional load, rest, and notes.
- Review workout completion and trainee feedback.
- Record total and remaining package sessions.
- Enter the five core biometric fields manually.
- Upload an InBody image, review untrusted extraction, correct every field, and explicitly confirm before saving.
- View biometric history and simple weight/body-fat trends.
- See a warning after at least three calendar days without meaningful trainee activity and message the trainee inside FitSync.

### Trainee capabilities

- Accept an invitation and create credentials.
- Use FitSync primarily from the Expo mobile application, with a browser fallback.
- Open the private conversation with the assigned PT and receive push notifications that deep-link to the relevant item.
- Send text or private images.
- Create a daily check-in and separate meal entries through structured actions in the conversation composer.
- View assigned workouts, record completion, and send feedback.
- View only their own profile, verified biometrics, coaching nutrition targets, session balance, check-in history, meal history, and workout history.
- Retry safe queued text/check-in submissions after a temporary network failure.

### Communication V1 boundary

- Private one-to-one PT–trainee conversations only.
- Durable paginated history, unread counts, read markers, retry, notification preferences, and deep links.
- Text, validated private images, and structured coaching cards.
- No group chat, voice/video calls, typing indicators, online-presence tracking, arbitrary files, message forwarding, or admin impersonation.
- Messages are not a medical channel or emergency service. Product copy must set that expectation clearly.

### Workout V1 boundary

- PT-created one-off workout assignments and reusable simple templates.
- Ordered exercises with sets, reps, optional load, rest, and coaching notes.
- Trainee completion status, actual load/reps when supplied, and a short feedback note.
- No exercise-video hosting, adaptive periodization, live timers, motion analysis, marketplace programming, or studio-wide program builder in V1.

### Commercial baseline

- Free hypothesis: up to 3 active trainees and 3 OCR attempts in total.
- Pro hypothesis: 199,000 VND per month.
- Early pilots may use manually verified VietQR payments.
- No public checkout, unlimited-use promise, trial promise, or final price until the related flow works and is tested.

## 4. Deferred scope

Deferred work includes group/studio chat, voice and video calling, App Store public release, automated VietQR webhooks, studio administration, voice transcription, wearables, meal recognition, prescribed meal plans, anonymous leaderboards, rewards marketplace, before/after photos, medical-risk alerts, complex multi-device offline conflict resolution, and automated workout-motion analysis.

Android internal distribution is the first store milestone. iOS development and physical-device testing are part of the Expo client, while public App Store release follows privacy, Apple Developer, TestFlight, and review readiness.

## 5. Core workflows and acceptance criteria

### A. PT onboarding and trainee creation

1. A visitor creates a PT account and reaches an empty roster.
2. The PT creates a trainee and generates a one-time invitation.
3. The trainee accepts, creates credentials, and becomes linked.
4. The system creates the private conversation for that relationship.

**Accepted when:** the roster and conversation survive reload; both authorized users see the relationship; unrelated users cannot discover either record.

### B. Conversation and structured timeline

1. Either participant sends a text or validated private image.
2. The durable write succeeds before realtime delivery is acknowledged.
3. The recipient sees the item on web or mobile and receives a generic push when permitted.
4. A deep link opens the correct conversation and item.

**Accepted when:** ordering is stable, retries are idempotent, unread/read state is user-specific, pagination does not duplicate entries, and no unrelated account can read, subscribe to, sign, or mutate conversation data.

### C. Meal and daily check-in through the conversation

1. The trainee selects a structured action from the composer.
2. A daily check-in records the application-local date and optional note; meal entries record meal type, optional note, capture time, and optional private photo.
3. The domain record and timeline card are created atomically or fail together.
4. The PT reviews and replies in context.

**Accepted when:** multiple meals can exist on one day, the daily check-in rule remains deterministic, media remains private, and analytics rely on domain records rather than parsing messages.

### D. Basic workout coaching

1. The PT creates or reuses a simple workout and assigns it to a trainee.
2. The assignment appears in the conversation and the trainee's current-workout view.
3. The trainee records completion and optional actual performance/feedback.
4. The PT sees the result and replies in context.

**Accepted when:** assignment and completion remain structured and auditable, edits do not rewrite completed history, and only the assigned pair can access the workout.

### E. Manual and OCR-assisted InBody

1. The PT enters five metrics manually or uploads a supported image.
2. OCR returns an untrusted draft or recoverable failure.
3. The PT reviews, corrects, and explicitly confirms; manual entry remains available.
4. A verified event appears in the shared timeline without exposing the private source image in a notification.

**Accepted when:** invalid or unconfirmed results cannot become verified records, authorization remains tenant-isolated, and benchmark evidence exists before OCR claims are published.

### F. Inactivity intervention

1. The application evaluates meaningful activity using the `Asia/Ho_Chi_Minh` calendar rule.
2. After three full inactive dates, the trainee enters the PT warning queue.
3. The PT opens the same FitSync conversation and sends a contextual follow-up.
4. Optional external sharing is deliberate and secondary.

**Accepted when:** no message is sent automatically, warning dates are deterministic, and intervention can be completed inside FitSync.

## 6. Data model direction

Existing migrations remain authoritative for implemented tables. Planned concepts require focused migrations and RLS tests before they become implementation claims.

| Domain | Essential model direction |
| --- | --- |
| Identity | `profiles`, `pt_profiles`, `trainee_profiles`, invitations, role and relationship state |
| Conversation | one `conversations` row per PT–trainee relationship; durable `messages`; user-specific read state |
| Timeline | append-only presentation events referencing messages or authoritative domain records; no sensitive duplicated payload |
| Engagement | one daily summary check-in plus independent multiple `meal_logs` with meal type and captured time |
| Workouts | reusable simple templates, assignments, ordered exercises, completion records, and trainee feedback |
| InBody | verified manual/OCR records plus private OCR attempts and source media |
| Notifications | device installations, preferences, delivery attempts, generic routing metadata, and revocation timestamps |
| Commercial | subscriptions and manually verified payment evidence before automated reconciliation |

## 7. Authorization, privacy, and safety

- Deny access by default and enable RLS on every user-data table.
- Conversation membership derives from the active assigned PT–trainee relationship; client-supplied participant IDs are never trusted.
- PTs access only assigned trainees. Trainees access only their own relationship and records.
- Realtime subscriptions must obey the same membership boundary as ordinary reads.
- Private message, meal, workout, and InBody media use isolated paths, validated signatures, and short-lived signed URLs.
- Service-role credentials and notification provider secrets never enter web or mobile bundles.
- Mobile session tokens use platform secure storage, not unencrypted general-purpose storage.
- Notification bodies and analytics exclude message text, notes, biometrics, nutrition values, filenames, signed URLs, and raw device tokens.
- Message/media retention, account deletion, device revocation, abuse handling, consent, incident response, and Vietnam Decree 13 responsibilities require named owners before real pilot data.
- There is no hidden admin access to private conversations; any future audited support access requires a separate decision and user-visible policy.

Required isolation tests include cross-PT denial, cross-trainee denial, conversation subscription denial, private-media denial, forged timeline-reference rejection, idempotent retry, revoked-device notification denial, expired invitation denial, and duplicate payment-callback denial.

## 8. Architecture decisions

- Keep a modular monolith around Supabase/PostgreSQL and server-only provider adapters; do not introduce microservices or a separate message broker for the initial scale.
- Use database commits as the source of truth and Supabase Realtime as delivery acceleration.
- Keep domain records separate from timeline presentation. Never calculate adherence, nutrition, workouts, or biometric progress by parsing chat text.
- Add `apps/mobile` only with its first working vertical slice. Extract shared validation/types only when web and mobile both consume them.
- Use Expo/React Native as the long-term iOS/Android client. Next.js remains the complete PT web client.
- Treat TWA as an optional short-term Android distribution experiment, not the product's long-term mobile architecture.
- Do not place `xtool` on the critical path. It currently targets SwiftPM-native applications; upstream React Native build and App Store upload workflows are not complete.
- Preserve manual biometric entry and explicit OCR confirmation.
- Start with manually verified VietQR evidence, then add signed webhook reconciliation.

See [ADR-004](architecture/adr-004-unified-coaching-timeline-and-mobile-client.md) for rationale and trade-offs.

## 9. Delivery milestones

| Milestone | Status | Deliverable | Exit evidence |
| --- | --- | --- | --- |
| M0 Foundation | Verified | Monorepo, active plan, staging conventions | Root checks pass; plan and ADR reviewed |
| M1 Identity | Verified | Auth, profiles, invitations, and RLS | Cross-role isolation tests pass |
| M2 First vertical slice | Verified | PT creates trainee and verified manual InBody record; trainee sees it | Desktop/mobile-browser E2E |
| M3 Engagement | Verified | Daily check-in, one optional meal image, sessions, three-day warning | E2E plus RLS/timezone tests |
| M4 OCR | In progress | InBody 270 extraction behind mandatory review | Approved benchmark and failure evidence |
| M5 Unified timeline | Planned | Private 1:1 messages, read state, structured timeline cards, web inbox | Realtime, pagination, retry, and RLS E2E |
| M6 Coaching actions | Planned | Multiple meal entries and basic workout assignment/completion | Atomic domain/timeline tests and PT–trainee E2E |
| M7 Mobile companion | Planned | Expo trainee app, PT mobile inbox, camera, secure session, push/deep links, bounded retry | Physical Android/iPhone evidence plus Play Internal Testing |
| M8 Pilot operations | Planned | Safe analytics, support, deletion, retention, and notification operations | Acquisition-to-activation evidence without sensitive properties |
| M9 Paid pilot | Planned | Manual VietQR evidence and entitlement | Reconciled consented transactions |

M4 safety gates remain mandatory. Planning M5–M7 does not claim those capabilities exist and does not permit real health/message data before governance is ready. Architecture and contract work may be prepared in parallel; release claims follow verified exit evidence only.

## 10. EXE201 evidence model

### Outcome 1

- Public production and staging URLs, release identifier, Play testing/public listing, working core workflow, test report, project board, and recorded demo.

### Outcome 2

- Two named acquisition channels with UTM links; source-level visits, signups, activations, and installs; funnel definitions; dated analytics and Play Console exports.

### Outcome 3

- Required count confirmed against the current rubric; unique paying PT accounts; reconciled transaction references and subscription rows; consented feedback; usage evidence; final report and demo.

Targets, fabricated contacts, draft scripts, and planned results are not evidence. Personal information, private messages, health records, and bank records must be redacted from academic deliverables.

## 11. Analytics events

Minimum safe events: `signup_started`, `signup_completed`, `trainee_created`, `invitation_accepted`, `conversation_opened`, `message_sent`, `meal_logged`, `checkin_submitted`, `workout_assigned`, `workout_completed`, `inbody_manual_started`, `ocr_attempted`, `inbody_verified`, `warning_viewed`, `notification_opened`, `upgrade_viewed`, and `payment_verified`.

Events use pseudonymous IDs and bounded enums. They never include message bodies, notes, health values, meal images, filenames, signed URLs, tokens, or raw notification identifiers.

## 12. Environments and quality gates

- **Local:** Supabase local services and synthetic users/content.
- **Staging:** production-like policies with synthetic or explicitly consented data and isolated notification credentials.
- **Production:** separate project, secrets, storage, analytics, backups, device revocation, monitoring, and access controls.

Every milestone requires lint, TypeScript, domain tests, RLS integration tests, and relevant E2E flows. Mobile releases additionally require physical low-end Android and supported iPhone testing, poor-network/retry checks, notification/deep-link evidence, accessibility checks, and store-track installation. Production releases require migration review, rollback notes, privacy-impact review, and post-deploy smoke tests.

## 13. Immediate implementation backlog

M4 OCR remains the active implementation milestone. Complete its provider benchmark, governance approval, production adapter decision, and measured failure/accuracy/latency evidence without weakening manual fallback or explicit PT confirmation.

After M4, create focused issues in this order: conversation/timeline data contract and RLS; web inbox vertical slice; structured meal evolution; basic workout vertical slice; Expo mobile vertical slice; push/deep links and bounded retry; pilot operations; paid pilot. Do not implement all milestones in one branch or one pull request.

## 14. Change control

New scope enters this document only when it supports a measured PT/trainee need or mandatory delivery outcome. Capability status must be `prototype`, `implemented`, `verified`, or `released`. Only `verified` or `released` capabilities may be described publicly as working.
