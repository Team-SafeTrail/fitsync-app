# CHAT-TEXT-01 — implementation checkpoint

2026-10-30. Progress is recorded in `docs/plans/COACHING_PRODUCT_FOLLOWUP.md`, checkpoint B0–B8. This implements the first text-chat slice through B1 contract, B2 draft migration and B4 application code; it does not complete those entire phases.

## Changes

- B1 contract: `docs/plans/B1_CHAT_TEXT_SLICE.md`, flows, participants, conservative archive/relink handling, UI states and acceptance criteria.
- Additive migration: `supabase/migrations/20261030190000_coaching_text_messages.sql`. Private participant-bound messages, indexes, column-level INSERT grants, no ordinary update/delete or admin override. Includes immutable learner identity to prevent a replacement account inheriting prior history.
- Server data/action and validation: `apps/web/src/features/chat/`. Actor and participants come from authenticated server context, not form identity fields. Same nonce/content/pair retries return success without duplicate; mismatches return conflict. Plain text, bounded input, strict pagination tokens with Postgres microseconds preserved.
- Routes: `/workspace/chat` and `/workspace/chat/[traineeId]`, forced dynamic. Shared frame, inbox, history pagination, composer, polling every15 seconds on visible latest-page view, manual refresh. Draft stays in memory on reported send/network failure; pending fields cannot be edited then accidentally cleared. A thread-keyed composer prevents draft spill across people. Reload/closing the tab does not preserve draft.
- Navigation and linked PT dossier entry point. No fixture data was inserted into workspace or substituted for database reads.
- Server-only rollout flag `FITSYNC_CHAT_ENABLED`, default false in example configuration; disabled/loading/error/empty states. The flag is not a security boundary: SQL policies enforce direct database/API access independently.
- Database types manually extended for proposed table, not regenerated from a running database. Regenerate/compare after applying to isolated test DB.

## Initial local checks — historical checkpoint

The table and local-environment limitations below describe the initial implementation before the isolated CI runner was added. They are not the latest backend result; see the CI checkpoint at the end of this file.

| Check | Result |
| --- | --- |
| Explicit TypeScript | PASS |
| Next14 production build including lint/typecheck | PASS; both chat routes dynamic |
| Vitest |58/58 PASS across6 files; includes input/cursor and server-action authorization/idempotency boundaries |
| Public/guard Playwright |16/16 PASS against final production build; includes both chat URLs requiring login |
| New two-account chat E2E | Attempted; exit1 in beforeAll environment guard. No test accounts created and no authenticated chat scenario ran |
| Supabase test db | Attempted; exit1 connecting to unavailable local database; no SQL cases executed |
| New pgTAP suite |29 assertions written; declaration count checked, NOT executed and not reported as passing |
| Diff review |PASS; existing auth, OCR review, old tests and policies not weakened |

The first build and unit run were repeated after cursor/pending/identity fixes. No coverage measurement. No new authenticated UI screenshot, screen-reader claim, physical-device result or live persistence proof: the required backend is unavailable. Existing public browser tests are not evidence the new conversation works end to end.

## Before enabling

1. Use an isolated synthetic local test stack with container runtime; no implicit production target. Review this migration and existing baseline upgrade together, apply there, run all pgTAP suites including29 chat checks, regenerate types.
2. Configure local application credentials privately; start/build the app with that same local target and `FITSYNC_CHAT_ENABLED=true`. Keep production flag off.
3. Set `FITSYNC_E2E_LOCAL_DB=true` only for this explicit local test run, then execute `tests/e2e/chat-private.spec.ts`. The suite refuses non-loopback targets. Verify supplied app server is actually configured to this same test database, not a previously running cloud-connected process.
4. Verify more-than50 messages, equal timestamps, retry/lost acknowledgment, changed body under same nonce, archive/unlink/reassignment, two-account reload, outsider/anon/admin denial and mobile keyboard. Unit mocks do not certify SQL correctness.
5. Operational retention/deletion, abuse/rate limiting and support still need implementation/decision before pilot. Profile/message foreign-key delete restrictions must be reviewed with the future account-deletion flow; no deletion policy is invented here.

Rollback application rollout by disabling the flag; do not drop the table or delete message history. No migration, seed, reset, production write, account creation or deployment was performed in this task. No database test requirement is waived because the environment is blocked.

## Isolated CI checkpoint — 2026-10-30

The backend environment blocker is resolved for CI, not for this Windows host: GitHub Actions starts a disposable loopback Supabase stack, creates only synthetic accounts, runs migrations and all pgTAP suites, generates public schema types, and runs real authenticated browser scenarios. No historical cloud project, production user data or deployment is involved. The schema artifact has replaced the initial manually extended types; CI now checks an exact schema/types diff.

- Runs41059690048,41061261782 and41074069082 each passed140 SQL/RLS assertions across5 suites, including29 chat assertions. M2 and M3 authenticated browser scenarios also passed.
- Chat browser acceptance has not yet passed at this checkpoint. The latter two failures were test synchronization errors: the exact create button label omitted “& link mời”; the thread URL was captured before client navigation finished. Both are corrected without relaxing denial or persistence assertions.
- Run41075370536 is testing head751262c with lost-ack retry, visible-page polling, same-timestamp history pagination, send-from-history, and outsider HTTP404/no-content checks. Do not infer its result from the older passing SQL runs.
- Local rerun at head751262c: TypeScript PASS,58 unit tests PASS, lint PASS with telemetry disabled. The initial lint attempt failed on a Windows cross-device telemetry config rename; the disabled-telemetry rerun completed without warnings.

Chat remains default-off. Operational rate limiting, retention/account deletion, physical-device/keyboard review and human PR review are still separate gates before a real pilot.
