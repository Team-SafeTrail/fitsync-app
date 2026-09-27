# FitSync MVP monorepo foundation

## Goal

Turn the existing prototype into a safe monorepo foundation and freeze one implementation-ready MVP specification without losing the landing page.

## Tasks

- [x] Move the existing Next.js product into `apps/web` → Verify: the landing page and prototype routes build from the workspace root.
- [x] Add root npm workspace commands → Verify: root lint, typecheck, and build delegate to `@fitsync/web`.
- [x] Write `docs/MVP_EXECUTION_PLAN.md` → Verify: scope, workflows, schema, security, outcomes, and done criteria are explicit.
- [x] Record the monorepo decision in an ADR → Verify: web/mobile boundaries and revisit triggers are documented.
- [x] Replace the starter README with repository and local-development instructions → Verify: a new contributor can locate the product and source of truth.
- [ ] Implement the first vertical slice: PT account → trainee → manual InBody record → trainee view.

## Done when

- [x] Existing prototype behavior is preserved.
- [x] One document controls MVP implementation decisions.
- [x] The repository has a clear location for web, future mobile, and genuinely shared packages.
- [x] Root validation commands pass.

## Notes

The mobile app and shared packages are added only when their first working feature is implemented. Empty scaffolds create maintenance cost without proving architecture.
