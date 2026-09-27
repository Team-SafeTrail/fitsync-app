# Contributing to FitSync

FitSync is developed by the SafeTrail team. Start with `docs/README.md`: `docs/MVP_EXECUTION_PLAN.md` is the active product source of truth, and `docs/HANDOFF.md` records the latest verified state. Read both before starting a milestone task. Read `AGENTS.md` before changing Next.js code.

## Team workflow

The private organization plan does not currently provide branch protection. Treat the following rules as mandatory:

1. Do not push directly to `main`.
2. Create a focused branch from the latest `main`, such as `feat/m4-ocr-benchmark`, `feat/m4-ocr-storage`, or `fix/invitation-expiry`.
3. Link the branch and pull request to one GitHub issue with a named owner.
4. Keep each pull request small enough for another teammate to review.
5. Wait for CI and the relevant local checks to pass before merging.
6. Use a normal merge or squash through a pull request. Do not force-push shared branches or rewrite `main`.

## Local setup

- Use Node.js 20 or newer.
- Install dependencies from the repository root with `npm ci`.
- Keep local configuration in `apps/web/.env.local`; never commit or paste its values into issues, pull requests, logs, or documentation.
- Use local Supabase for database and browser workflows. If Docker group access is unavailable in the current shell, run the database command through `sg docker -c '<command>'`.

## Required checks

Run these for every application change:

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

For migrations, RLS, storage policies, or generated database types, also run:

```bash
npm run db:reset
npm run db:test
npm run db:types
npx supabase db lint --local
```

Run `npm run test:e2e` whenever a user workflow, route, authorization path, or responsive interface changes. Never remove or weaken an existing test only to make a new change pass.

## Data and security

- Use synthetic InBody reports, meal images, identities, and payment examples in source control and automated tests.
- Do not collect or process real health reports until consent, permitted use, access, retention, deletion, incident response, and provider processing have named owners.
- Do not log biometric values, user-entered notes, private object paths, signed URLs, tokens, passwords, or provider payloads.
- Treat OCR output as untrusted draft input. Only explicit PT confirmation may create a verified InBody record.
- Enforce tenant ownership with database RLS and server-side validation; client filtering is not authorization.

## Current ownership

| Area | Primary owners |
| --- | --- |
| Product coordination and OCR direction | Việt (`Am2uocVi3t`) |
| OCR dataset, preprocessing, and evaluation | Hưng (`hei1sme`) |
| Web/mobile UI and Play Store packaging | Khải (`DiepKhai`) |
| Supabase, server integration, and payments | Huy (`huydqse180459-art`) |
| UI/UX and growth evidence | Toàn (GitHub account pending) |

Ownership identifies the first reviewer and coordinator; it does not bypass review, validation, or the documented milestone boundaries.
