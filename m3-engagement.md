# M3 Engagement

## Goal

Ship the authenticated trainee check-in, private meal photo, PT activity/session controls, and deterministic inactivity-warning workflow without expanding beyond M3.

## Tasks

- [x] Add versioned check-in, meal-log, private storage, session update, and warning-date schema with RLS. Verify with database reset and pgTAP isolation tests.
- [x] Add `Asia/Ho_Chi_Minh` calendar-domain rules and server-side form/media validation. Verify timezone, full-day, note, file, and balance boundaries with Vitest.
- [x] Add authenticated server actions and data queries for check-ins, media signing, and session balance. Verify unauthorized writes remain blocked by RLS.
- [x] Add mobile-first trainee check-in/history UI and PT activity, warning, follow-up, and balance UI in the existing Carbon workspace.
- [x] Regenerate Supabase TypeScript types and fix all resulting type errors.
- [x] Add one Playwright M3 journey covering persistence, role visibility, photo privacy, isolation, warnings, messaging boundaries, and responsive layouts.
- [x] Run database, unit, lint, typecheck, build, and full browser suites; fix M3 regressions without weakening M2.
- [x] Update the active plan/handoff with verified results, commit the completed milestone, and leave the branch unpushed.

## Done When

- [x] Every M3 acceptance criterion in `docs/MVP_EXECUTION_PLAN.md` is demonstrated by passing executable checks and a real Chromium workflow.

## Notes

- Application timezone: `Asia/Ho_Chi_Minh` (UTC+07:00, no DST).
- A check-in/reference date of Monday enters the warning queue at Friday 00:00 application time, after Tuesday, Wednesday, and Thursday have fully elapsed without another check-in.
- Meal media stays in a private `meal-media` bucket and is rendered through short-lived signed URLs created only after RLS-authorized reads.
