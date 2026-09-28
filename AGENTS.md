<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## FitSync team task protocol

These project instructions apply to every coding agent working in this repository.

1. Read `docs/HANDOFF.md`, `docs/MVP_EXECUTION_PLAN.md`, and `docs/TEAM_PLAYBOOK.md` before proposing or implementing team work. Read `DESIGN.md` for UI changes.
2. Map a teammate only from an identity they explicitly state: Việt → `Am2uocVi3t`, Hưng → `hei1sme`, Khai → `DiepKhai`, Huy → `huydqse180459-art`, Toàn → GitHub account pending.
3. If the user provides only their name, perform read-only discovery of open issues assigned to that account with the `agent-ready` label. Exclude `blocked` work, inspect dependencies and overlapping pull requests, recommend one issue, and wait for explicit confirmation before editing or changing external state.
4. If GitHub access is unavailable or no ready issue exists, ask for an issue number or for the task to be scoped. Never invent a task from the teammate's role.
5. After confirmation, work only within that issue on a focused branch. Preserve dirty worktrees, never reset or discard unrelated changes, and never push directly to `main`.
6. The agent may implement, test, commit, push its feature branch, and open a linked pull request. It must not approve or merge its own pull request.
7. Use synthetic data by default. Never expose secrets or process real health data without the documented governance gate.
8. Report only checks actually executed. Do not weaken existing tests, RLS, server validation, or mandatory OCR review.

The full discovery, authority, review, and handoff rules are in `docs/TEAM_PLAYBOOK.md`.
