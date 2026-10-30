# B1 — shared calendar, membership and PT session ledger

2026-10-30. Next-domain contract while CHAT-TEXT-01 acceptance is running. This is an implementation proposal grounded in the owner interview, not a claim that the owner previously approved every cancellation/billing rule. No calendar/ledger migration is applied by writing this contract.

## User outcome

PT and learner see the same appointment and its current status. PT can arrange a session without writing an exercise plan. Membership dates, self check-in, attendance and paid PT sessions remain distinct. FitSync's199k/month subscription is a different business object from the packages a PT sells to learners.

## Navigation and composition

PT: Today → upcoming appointment / pending request → learner dossier → thread or calendar detail. Calendar also opens from a learner dossier. Learner: Today → next appointment → request change/cancellation → see PT decision. Both link to the same appointment ID, not copies stored per screen.

Desktop calendar uses a readable day/week schedule and detail region; phone starts with an agenda list and focused detail, not a scaled desktop grid. Empty/loading/error/offline/pending/conflict states are required. Exercise attachment is optional and may be added in B5. Do not display inert chat/calendar buttons as working features.

## Conservative defaults to implement and review

- PT creates and confirms appointments; learners request changes instead of overwriting the PT schedule. PT can change a future appointment directly, with history and a visible update for both people.
- Requests keep the original appointment unchanged until accepted. The learner can withdraw a pending request. Accept/reject/withdraw races compare appointment version and request state; stale requests cannot overwrite newer decisions.
- A cancellation request keeps the original slot until PT confirms cancellation. No automatic no-show fee, session deduction or penalty is invented.
- Creating, changing, cancelling or requesting an appointment does not debit PT sessions. Learner self check-in does not debit sessions.
- PT records completion; a session consumes a package only when PT explicitly classifies it as a package PT session. Consultation/non-package sessions remain possible. Do not silently infer that every appointment costs a session.
- Archive/unlink/reassignment must retire outstanding schedule claims consistently, not leave invisible appointments blocking a PT's calendar. Preserve history; do not silently transfer a previous learner/PT's private notes to a replacement identity.

Cancellation/no-show policy, archive history access and expiry overrides remain business decisions to confirm before opening the related operations. Start without automatic penalties.

## Data boundaries

| Domain | Required meaning | Keep separate from |
| --- | --- | --- |
| Appointment | PT, learner identity, trainee record, start/end timestamptz, kind, status, version | Check-in, payment or ledger entry |
| Change request | Proposed start/end or cancellation, requester, base version, state and decision actor/time | An already changed appointment |
| Membership | Explicit local start/end dates, source and state | FitSync platform subscription, PT session entitlement |
| Session package | Total entitlement and source, relationship, optional expiry rules | Membership access dates |
| Session ledger | Immutable opening/credit/debit/reversal/adjustment events with actor/reason/idempotency | Mutable counter pretending to be historical evidence |

Use date for membership dates and timestamptz for actual appointments. Display in Asia/Ho_Chi_Minh consistent with existing app dates. End date is inclusive for membership display; do not convert a date field through browser-local UTC offsets. Expiry policy for paid PT completion needs an explicit decision, not an accidental JavaScript date comparison.

Appointments and events bind the PT and learner identity at creation, alongside the trainee record. An ID/link alone grants no read rights. System-admin status does not grant access to private coaching content. Enforce participant role/relationship in SQL and server actions; do not use service-role clients for ordinary appointment or ledger writes.

## Concurrency and integrity

- Enforce overlapping active PT appointments at the database boundary, with half-open time ranges so adjacent sessions are permitted. Compare versions under transaction locks on changes. A frontend-only overlap warning is insufficient.
- A linked learner's conflicting appointments also need protection; define handling of consultations and blocked time explicitly. No workout is required for a valid appointment.
- Completion and debit occur in one database transaction. Lock the affected package before reading balance and inserting a debit; use a consistent lock order across completion/refund operations.
- One debit per appointment and one reversal per debit. A repeated completion request returns the original result; it must not charge twice. No negative balance and no client-written arbitrary ledger delta.
- Correct a mistake through a compensating event with reason, rather than modifying/deleting history. Public authenticated roles cannot directly mutate the ledger; any controlled RPC must verify identity/role/relationship and use a fixed search path.
- Accepting a change must either update the appointment and resolve its request together, or change neither. Overlap/conflict errors must preserve original state and have a useful recovery action.

## Existing data transition

Current total_sessions/remaining_sessions are a baseline, not evidence of each past session. Initialize an explicit opening balance from the recorded remainder; do not fabricate dated debits to explain the difference. Unknown membership dates stay unknown, not created_at backfills.

Introduce new structures first. When connecting the ledger, change the existing SessionBalanceForm/action and its database write boundary together; do not leave a legacy direct-update route bypassing the ledger. Plan compatibility for older clients and test upgrade from the five-migration baseline as well as a fresh install. Remove write grants only with the compatible action/trigger or controlled transition in place.

## Proposed slices and gates

1. CALENDAR-01: appointment read/create and actual two-account agenda, no fee deduction. Includes overlap, roles and archive interactions in DB tests.
2. CALENDAR-02: request/accept/reject/withdraw, versions, audit and references from chat/dossier. Concurrent accept/change test is mandatory.
3. PACKAGE-01: explicit membership dates and entitlement records, preserve unknown legacy fields, no payment-provider integration.
4. LEDGER-01: completed paid-session debit, opening balance, adjustments/reversal, legacy SessionBalanceForm transition and idempotency.

Only start the next database domain after chat's isolation/persistence gate is understood, rather than accumulating untested migrations. Keep each feature default-off until its isolated database and browser acceptance pass. The environment is synthetic, never the historical cloud production project by default.

Acceptance includes desktop/phone, DST/offset-safe boundaries, adjacent/overlapping sessions, request races, retries, expiry boundaries, package exhaustion, self-check-in without debit, two PTs/two learners/anon/admin denial, and back/reload consistency. This file does not mark B1/B2/B4 or the full plan complete.
