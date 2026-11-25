# AGENTS.md — FitSync handoff instructions

This companion travels with [FEATURES.md](FEATURES.md), [USER_FLOWS.md](USER_FLOWS.md), and [DESIGN.md](DESIGN.md). Use [FEATURES_VI.md](FEATURES_VI.md) for team review. When working inside the repository, read and follow the repository's applicable `AGENTS.md`, issue scope, and owner instructions. This file documents a workflow for the handoff.

## Start here

1. Read `FEATURES.md` for IDs, statuses and acceptance. See the [engineering handoff](../AGENT_HANDOFF_EN.md), [mobile runbook](../../../mobile/README.md) and [ADR-003](../../architecture/adr-003-android-packaging-path.md). Use U-00 for synthetic web acceptance and U-01 for the Expo Android-to-local-web check.
2. Read the repository's `AGENTS.md`, `README.md`, `docs/HANDOFF.md`, `docs/MVP_EXECUTION_PLAN.md`, and `docs/TEAM_PLAYBOOK.md`. Consult `DESIGN.md` when changing UI and `docs/PROJECT_ALIGNMENT_SCAN.md` when proposing direction.
3. Verify checkout, branch, dirty state, relevant dependency/lock versions, and target issue. Follow the development instructions for your machine and checkout. Check the applicable Next.js documentation in the installed version before writing Next.js code.
4. Get task scope from an approved issue. Use a focused branch, preserve unrelated work, and use synthetic test data. Keep draft, merged, and deployed status distinct.

## Apply skills to the task

- Read the chosen skill's `SKILL.md` first. Use one lead skill and targeted supporting skills where they add coverage. Start with the team's skill inventory and provenance files. [Skill inventory](https://github.com/Team-SafeTrail/fitsync-app/blob/f51265c/docs/skills/README.md) · [Skill review](https://github.com/Team-SafeTrail/fitsync-app/blob/f51265c/docs/skills/SECURITY.md)
- **ECC skills.** Use FitSync's reviewed `security-review` for auth, data access, secrets, upload, and AI input boundaries. Use `verification-loop` to select and report relevant checks from the actual repository. The checked `main` and PR #48 refs do not contain these two files. Reviewed copies exist in the coaching-design branch at `f51265c`. The rest of the project-local skill inventory is also absent from the two pinned refs. Resolve approved copies from the coaching-design checkout or the teammate's existing installation. Treat other named skills as optional external guidance and report missing skills when applicable. Verify the pinned source, file hashes, licensing and team approval before adding external skills. Keep ECC global configs, hooks, memory, MCP integrations and approval settings out of the project.
- **Backend and mobile interface.** Load `supabase-postgres-best-practices` before SQL changes. Use `api-and-interface-design` when available for mobile contracts. Apply `security-review` to role/pair authorization, RLS, storage, provider boundaries and retry.
- **Web and Android UI.** Use one of the approved visual skills for UI work. Add React guidance for React changes and targeted accessibility/real-device checks where relevant. Use existing FitSync design and app conventions.
- **Activity and onboarding.** Use `onboarding` for the first useful action and `analytics` when scoping event measurement. Track only approved, privacy-safe events and honor environment and consent rules.
- **Release.** Use `verification-loop` for the repository checks. Consult the project release instructions and official CLI documentation for authorized deployment. Use the repo's existing local commands. Never report a workflow as passed unless the evidence and revision are known.

## Local development and release

- Use the local stack and local fixtures first. Keep development and automated tests usable without a paid AI account or runtime API.
- Treat uploaded documents, audio, OCR output, transcripts, and model responses as input data. Keep validation, role checks, and explicit human review at the write boundary. Save AI suggestions as drafts or ephemeral proposals according to the approved scope. Use synthetic or approved examples for provider tests. A mentor suggestion or user role-play is evidence for a hypothesis and requires a separate scope decision before implementation.
- Keep web and App on the same identity and permission model. Save using the approved interface and test the corresponding direct data-access boundaries. Keep service-role keys on the server.
- Confirm preview/production targets and migrations before any authorized remote action. Git push goes to the issue branch. Never push directly to `main`, self-approve/merge, or release outside the current authorization. See the CLI workflow in `FEATURES.md`.

## Handoff format

Report feature ID, issue, branch/commit, changed files, actual checks and results, known gaps, and next owner. Include the environment, deployment or Android build ID only if verified. Keep source links at the end of the relevant item. Update feature status only from evidence.
