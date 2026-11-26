# U-00 local web verification

Draft PR #48 at `42573348bfe73ce2ee088b3cb2b7e97b8b31d1f1`, tested on 25 November 2026. The isolated Windows run used Node 26.13.1, npm 11.20.0, Next.js 15.5.29, Supabase CLI 2.118.0, 14 migrations, and Edge via Playwright. The trainee viewport was 390 px. The production-mode local build, lint and type checks passed. The local environment/config guard tests passed 7/7.

Six synthetic web stages passed:

1. Open the public landing and register a PT.
2. Create a trainee and accept the invitation.
3. Save a text check-in and verify it after reload as trainee and assigned PT.
4. Save a PT-confirmed manual measurement and verify it after reload.
5. Sign back in as the returning trainee.
6. Verify a separate authenticated PT receives 404 without the trainee record.

This run covered the synthetic local web path. Expired invitations, direct RLS assertions, Android, photos, calendar, billing expiry and hosted deployment were outside this run. Separate evidence records the other test layers. [Web test evidence](../TEST_EVIDENCE.md)
