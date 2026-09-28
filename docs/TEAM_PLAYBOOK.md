# FitSync team and agent playbook

This playbook defines how SafeTrail teammates and coding agents select, implement, review, and hand off work. A role identifies the relevant work queue; a confirmed GitHub issue defines the authorized scope.

The course schedule and cross-tool workflow are defined in [`EXE201-delivery-plan.md`](../EXE201-delivery-plan.md). The team is currently in Week 4; OC1 is assessed during Weeks 5–7, and OC2 plus OC3 during Weeks 13–14.

## Team ownership

| Teammate | Accepted identity names | GitHub | Primary responsibility |
| --- | --- | --- | --- |
| Huỳnh Quốc Việt | Việt, Viet, Huỳnh Quốc Việt | `Am2uocVi3t` | Product coordination, OCR direction, milestone and evidence alignment |
| Lê Nguyễn Gia Hưng | Hưng, Hung, Lê Nguyễn Gia Hưng | `hei1sme` | OCR datasets, preprocessing, evaluation, benchmark evidence |
| Diệp Khai | Khai, Diệp Khai | `DiepKhai` | Web/mobile UI, OCR correction experience, Android and Play delivery |
| Dương Quang Huy | Huy, Dương Quang Huy | `huydqse180459-art` | Supabase, server integration, RLS, cloud operations, payments |
| Lê Văn Toàn | Toàn, Toan, Lê Văn Toàn | Account pending | UI/UX review, Play/marketing assets, channel and growth evidence |

Ownership determines the first coordinator and reviewer. It does not give permission to bypass an issue, validation, privacy rules, or review.

## Trello, GitHub, and Discord

- Trello is the course-facing roadmap and weekly sprint board. It owns course-week deadlines, accountable owners, and evidence checklists.
- GitHub Issues own engineering scope, dependencies, acceptance criteria, and implementation status. Every branch and pull request links one issue.
- Discord carries announcements, meetings, questions, and daily status. Every task message links its Trello card; Discord is not a separate backlog.
- Repository plans, architecture decisions, migrations, and tests remain authoritative for product behavior and data safety.

An engineering task therefore has one Trello card for course tracking and one linked GitHub issue for code. Update both at meaningful state changes; do not copy competing acceptance criteria into Discord.

## Task readiness contract

An agent may recommend a task only when the GitHub issue:

- is open and assigned to the teammate;
- has the `agent-ready` label;
- is not labeled `blocked`;
- belongs to the active milestone or an explicitly approved course requirement;
- states its outcome, scope, acceptance criteria, dependencies, and verification.

The `team-task` label identifies work created through the team task form. A team lead or relevant owner adds `agent-ready` only after the task is scoped and dependencies are clear. Remove `agent-ready` and add `blocked` whenever work cannot proceed safely.

## Name-only agent workflow

When a teammate says only their name, such as:

```text
I am Hưng.
```

the agent must:

1. Map the explicit name to the GitHub account in this playbook. Never infer an identity that the user did not state.
2. Read `AGENTS.md`, `docs/HANDOFF.md`, `docs/MVP_EXECUTION_PLAN.md`, this playbook, and the candidate issue before proposing work.
3. Inspect the branch, recent commits, working tree, open pull requests, and assigned ready issues without modifying anything.
4. Query ready work when GitHub CLI access is available:

   ```bash
   TEAMMATE_HANDLE=hei1sme
   gh issue list --repo Team-SafeTrail/fitsync-app --assignee "$TEAMMATE_HANDLE" --state open --label agent-ready
   ```

5. Exclude blocked tasks and identify unresolved dependencies or overlapping pull requests.
6. Recommend one issue from the active milestone and report its issue number, intended outcome, likely files, branch name, dependencies, and acceptance checks.
7. Stop and wait for explicit confirmation before editing, branching, assigning, commenting, or changing external state.

If GitHub access is unavailable, ask for an issue number or link. If no ready issue exists, report that clearly and ask the teammate or leader to scope one with the task form. Do not invent work from the role description.

### Required recommendation format

```text
Identity: Hưng (@hei1sme)
Recommended task: #2 — Benchmark InBody 270 OCR candidates
Branch: feat/m4-ocr-benchmark
Scope: <short boundary>
Dependencies: <ready or blocked reason>
Done when: <acceptance summary>

Proceed with issue #2?
```

## Authority after confirmation

After the teammate confirms one issue, the agent may:

- create a focused branch from the latest safe `main`;
- implement only the confirmed issue and normal supporting changes;
- run proportionate tests and security checks;
- update documentation required by verified behavior;
- commit, push the feature branch, and open a pull request linked with `Closes #<issue>`;
- respond to review feedback within the same issue scope.

The agent must not:

- push directly to `main`, force-push shared branches, or rewrite shared history;
- merge its own pull request or mark an issue complete before review and CI;
- expand into another teammate's task without explicit coordination;
- discard, reset, overwrite, or silently include unrelated working-tree changes;
- expose `.env` values, credentials, tokens, private URLs, or provider payloads;
- commit real health reports or personal data;
- process real health data before the documented consent and governance gate;
- weaken tests, RLS, server validation, or manual OCR confirmation to make checks pass.

## Branch, commit, and pull-request rules

1. Fetch the remote and inspect the worktree before branching. Preserve existing changes and stop for direction if they overlap the issue.
2. Use one issue per branch. Preferred names are `feat/<milestone>-<outcome>`, `fix/<problem>`, `docs/<topic>`, and `chore/<topic>`.
3. Keep commits focused and use an outcome-oriented message such as `feat: add private OCR attempt storage`.
4. Fill in the pull-request template with the human owner, agent/operator, related issue, actual verification, and data-safety checks.
5. Request review from an owner who did not implement the change. The implementation agent never approves or merges its own pull request.
6. Merge only after CI and every relevant local database/browser check passes.

## Review routing

| Changed area | First reviewers |
| --- | --- |
| OCR benchmark, prompts, normalized extraction contract | Hưng and Việt |
| `supabase/`, RLS, storage, server authorization | Huy and Hưng |
| `apps/web/` interaction and responsive UI | Khai and Huy |
| Architecture, milestone scope, team automation | Hưng and Việt |
| Design system and visual evidence | Khai until Toàn joins GitHub; then Toàn and Khai |

`.github/CODEOWNERS` records this map, but the current private repository is on GitHub Free, where automatic CODEOWNERS review requests are unavailable. Until the plan changes, pull-request authors must request the listed reviewer manually.

## Verification by change type

| Change | Minimum evidence |
| --- | --- |
| Documentation or repository configuration | YAML/link validation, `npm run test`, lint, typecheck, build, hosted CI |
| Application or domain behavior | Unit tests, lint, typecheck, build, relevant browser flow |
| Migration, RLS, or storage | Database reset, pgTAP, generated types, Supabase lint, unit tests |
| User workflow or responsive UI | Relevant database checks plus Playwright desktop/mobile flow |
| OCR benchmark | Versioned corpus manifest, locked holdout, reproducible metrics, redacted aggregate report |

Never claim a check passed unless it was executed for the reported revision.

## Starter prompts

The shortest supported prompt is simply:

```text
I am Việt.
```

The same protocol applies to `I am Hưng`, `I am Khai`, `I am Huy`, or `I am Toàn`. A more explicit fallback is:

```text
I am Hưng. Follow docs/TEAM_PLAYBOOK.md, find my assigned agent-ready issues, recommend one, and wait for confirmation before editing.
```

To start a known issue:

```text
I am Hưng. Work on issue #2 using docs/TEAM_PLAYBOOK.md. Verify its assignment, readiness, dependencies, and scope, then show me the execution boundary before editing.
```
