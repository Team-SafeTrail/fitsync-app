# CALENDAR-01 — shared appointment create/read

2026-10-30. Implemented after CHAT-TEXT-01 acceptance. Code checkpoint28a9e9a; progress lives in [COACHING_PRODUCT_FOLLOWUP](../plans/COACHING_PRODUCT_FOLLOWUP.md). This completes the synthetic acceptance of this slice, not all of B1/B2/B4 or production rollout.

## Behavior

PT selects a connected learner, names a training/consultation appointment and enters Vietnam start/end times. Both accounts read the same persisted appointment in a weekly agenda. No exercise plan, fee classification, check-in or session debit is required. New bookings are future-only and bounded to24 hours as a technical default for review. Pre-invitation booking is not implemented.

Desktop puts the form beside the agenda; phone uses a date/time agenda and stacked entry with an entry shortcut. Mobile navigation exposes Home/Roster, Calendar and Chat. Profile/chat links retain the learner context; an appointment reference inside chat is later CALENDAR-02 work. Colors/type/layout guidance are in DESIGN.md.

Empty, loading after identity checks, query error, pending, conflict and network failure states are distinct. Lost responses preserve the form and nonce. An identical committed retry returns the original confirmation, including after its start time; changed content under the same nonce reports conflict. No browser-side successful-looking fixture is substituted for a database result.

## Data and security

- Additive migration20261030200000: coaching_appointments, immutable PT/learner/trainee tuple, bounded timestamps/title, nonce uniqueness, participant RLS and insert-column grants. Ordinary authenticated users cannot UPDATE/DELETE or forge status/audit time. PT creates; learner reads; admin has no private override.
- Half-open exclusion constraints enforce PT/learner overlap at the database boundary, allowing adjacent slots. A private trigger locks the current relationship during creation. Archive/unlink/reassignment retires outstanding slot claims without deleting rows or transferring private history.
- Private trigger functions use a fixed empty search path, schema-qualified references and revoked direct execution. Ordinary reads/writes use user-scoped Supabase clients, never service-role.
- Types were generated from the disposable DB artifact; CI enforces an exact diff. FITSYNC_CALENDAR_ENABLED defaults false, separately from chat. The flag controls app rollout; SQL authorization is independent.

## Checks executed

| Check | Fresh result |
| --- | --- |
| [Backend run41078850281](https://github.com/Team-SafeTrail/fitsync-app/actions/runs/41078850281) | SUCCESS at28a9e9a |
| SQL/RLS |169/169 across6 suites:29 calendar,29 chat,111 existing |
| Generated schema/types diff | PASS |
| Production build against disposable Supabase | PASS |
| Authenticated browser suites |4/4 PASS on first attempt: calendar, chat, M2, M3 |
| Calendar browser cases | Linked desktop PT/mobile learner, create/read/reload, overlap/draft retention, adjacent slots, lost acknowledgment with direct DB proof before retry, concurrent inserts with one23P01, unchanged session balance, outsider isolation |
| [Web run41078850312](https://github.com/Team-SafeTrail/fitsync-app/actions/runs/41078850312) |87/87 unit tests, lint/typecheck/build PASS |
| Local checks |87 unit tests, explicit TypeScript, lint,4 local-environment guards and diff check PASS |
| Rendered review | Synthetic desktop1440px and learner390px images from the final run downloaded and inspected; mobile PT navigation/overflow checked in browser suite |

No coverage percentage was measured. The retry-after-start-time boundary is exercised by unit tests; E2E proves retry after a committed response is lost, not waiting days until an appointment passes. SQL tests exercise archive/unlink sequentially; concurrent relationship-change behavior is supported by the lock design but has not yet had a dedicated multi-transaction test. The CI stack is a fresh disposable installation, not a completed rehearsal of upgrading a live baseline.

## Boundaries and next work

Change/cancellation requests, versions/audit, attendance/completion, explicit membership dates and a PT-session ledger are not implemented by this slice. There is no penalty, no-show charge or automatic session deduction. Operational rate limiting, retention/account deletion, upgrade rehearsal, physical Android/keyboard tests and human review remain before a pilot. No cloud production migration, deployment, merge or production flag enablement occurred.

Next: CALENDAR-02 shared change-request lifecycle and race handling, then PACKAGE-01 and LEDGER-01. [Saved synthetic screenshots](../evidence/coaching-core-2026-10-30/README.md) document actual test execution, not customer validation or native app availability.
