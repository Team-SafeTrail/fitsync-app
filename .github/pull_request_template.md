## Summary

Describe the user-visible or engineering outcome and why it is needed.

## Ownership

- Human owner:
- Agent/operator:
- Related issue:
- Requested reviewer:
- Areas changed: web / mobile / database / OCR / design / documentation

- [ ] The issue was assigned and `agent-ready` before implementation began.
- [ ] The requested reviewer did not implement this change.

## Verification

List the commands and browser/database scenarios you actually ran.

- [ ] `npm run test`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Database and pgTAP checks, when schema, storage, or authorization changed
- [ ] Browser E2E, when a user workflow changed

## Safety and scope

- [ ] No secrets, `.env` files, real health reports, or personal data are committed.
- [ ] Server-side validation and RLS remain the authorization boundary.
- [ ] Generated database types were refreshed after schema changes.
- [ ] The change stays within the active milestone in `docs/MVP_EXECUTION_PLAN.md`.
- [ ] Documentation reflects any verified behavior or architectural decision.
- [ ] This pull request will not be approved or merged by its implementation agent.
