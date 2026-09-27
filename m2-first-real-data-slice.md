# M2 first real-data slice

## Goal

Deliver the authenticated PT-to-trainee InBody workflow with persistent Supabase data, server validation, RLS isolation, and browser proof while preserving the public landing page and `/app` fixture demo.

## Tasks

- [x] Evolve the trainee and invitation schema, add atomic invitation RPCs, and tighten record constraints and RLS. Verify with a local database reset.
- [x] Expand pgTAP coverage for invitation expiry/reuse, invalid biometrics, trainee ownership, and PT cross-tenant read/write denial. Verify with `npm run db:test`.
- [x] Add domain validation and authenticated Server Actions for trainee creation, invitation acceptance, verified InBody creation, and nutrition-draft updates. Verify with focused unit tests.
- [x] Build role-aware `/workspace`, trainee detail, and public invitation acceptance routes using the existing Carbon tokens. Verify empty, success, validation-error, and unauthorized states.
- [x] Add a Playwright workflow covering PT registration, invitation acceptance, invalid and valid InBody entry, persistence after reload, trainee mobile view, and unrelated-PT denial.
- [x] Regenerate Supabase types and run lint, typecheck, production build, database tests, unit tests, and desktop/mobile browser checks.
- [x] Update `docs/HANDOFF.md` with only the state proven by the completed checks.
- [x] Harden the visible workspace experience after browser review: product navigation, guided empty state, invitation sharing feedback, form lifecycle, and desktop/mobile visual verification.

## Done when

- [x] The PT and linked trainee see the same verified record after reload, while unrelated users cannot read or mutate it.
- [x] Raw invitation tokens are returned only at creation, only hashes persist, and expiry plus one-time use are enforced in PostgreSQL.
- [x] Invalid or inconsistent biometric input is rejected by both server validation and database constraints.
- [x] The full workflow passes in a real browser at desktop and mobile viewport sizes.
- [x] The PT and trainee surfaces read as a coherent product rather than a test harness when reviewed in the browser.
