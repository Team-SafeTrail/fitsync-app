# Web handoff v1 — Huy / Diệp Khai

2026-10-30. Owner scope: finish web and a reviewable handoff; Android is Khai's next implementation. This narrows the current delivery to a coherent web baseline and explicit data contracts, not completion of the entire B0–B8 roadmap or a production launch.

## Delivery sequence

1. Inventory every public/auth/PT/learner/admin route and its real data boundary. Preserve owner files and existing checks. Update the stale handoff entry point.
2. Finish web composition: PT Today, searchable roster, learner Today, contextual dossier, progress charts, intake/review, chat, calendar, membership/notes surfaces and empty/error/pending states. Use approved DESIGN.md; do not fabricate user data or working-looking future actions.
3. Review database by domain. Add tested membership/notes foundations where the UI needs them. Freeze a versioned schema/data dictionary and permission/API contract, clearly separating applied test migrations, existing legacy structures and later work. Full-report InBody fields/template differences need explicit mapping; five fields are not a complete report.
4. Verify typecheck/build/unit/browser/database with fresh evidence. Render desktop/mobile synthetic account flows, not just public samples. Record unsupported states and production gates.
5. Deliver one handoff index with route map, acceptance matrix, design/component rules, schema/ERD, known gaps, ordered backend/mobile tickets and review/release checklist. Commit/push feature branch and update draft PR; no merge/deploy, production DB writes or direct teammate messages.

## UI composition

Approved forest/jade/apricot, Be Vietnam Pro. Utility headings28–40px; plain reading surfaces and date rails, not marketing heroes in the app.

Desktop: navigation → Today/roster → focused dossier sections; appointment and conversation remain contextual routes. Phone: Home, learners (PT), calendar and chat reachable without hidden sidebar; PT profile sections use keyboard/hash task tabs with drafts retained; phone keeps readable focused panes. Calendar uses agenda; charts offer units, dates and a table alternative. Intake entry never pushes recent context below a long form by default.

PT Today focuses on upcoming appointments, check-in attention and invitation status. Learner Today focuses on the next appointment, daily check-in, shared coaching targets and progress. No unread count without a read-state model; no invented streak or automatic exercise prescription.

## Meaning of a v1 freeze

“UI baseline ready for handoff” means implemented surfaces and states have rendered evidence and mapped contracts. It does not mean missing backend actions are simulated as success. “Database v1” means exact versioned migrations plus a domain contract and upgrade plan. It does not mean every future report template, cancellation fee or retention rule has been approved. Huy reviews database/security/operational gates; Khai reviews web interactions and Android parity before release.

Keep membership dates, appointment attendance and PT-session ledger separate. Existing remaining_sessions remains an explicit legacy balance until a transactional ledger transition is implemented. Unknown report fields stay absent, with original unit/provenance and PT review; no AI inference fills gaps.

## Current checkpoint

Implemented: PT Today; contextual dossier with five keyboard/hash task tabs and retained drafts; learner Home plus separate full progress/history route; multi-metric charts; shared appointment summary; bounded chat history; membership revision and private/shared note forms; four-item phone navigation; aligned landing/legal capability statements; focusable admin sample-table regions. Schema now has eight migrations and twelve public tables, with generated types and a schema-only snapshot.

Web CI at b75b9d2: [41092400108](https://github.com/Team-SafeTrail/fitsync-app/actions/runs/41092400108) SUCCESS (103 unit tests, lint, typecheck, production build). Backend [41092400099](https://github.com/Team-SafeTrail/fitsync-app/actions/runs/41092400099) SUCCESS:202 SQL/RLS checks, strict types diff, production build,23 Chromium tests and baseline upgrade rehearsal with unchanged legacy row fingerprints. Final receipts are recorded in [UI_ACCEPTANCE](../handoff/UI_ACCEPTANCE.md); prior failed/cancelled runs are not presented as all-green checks. The last fixes included a real SVG title SSR/hydration bug and regression test, plus tab-aware navigation in existing browser assertions without removing domain assertions.

The delivery package is [docs/handoff/README.md](../handoff/README.md): current routes, database/ERD/permissions, generated field dictionary, future contracts, work packages and synthetic screenshot evidence. Android remains Khai's next implementation. Full-report/PDF, calendar requests, session ledger and operational gates remain explicit work; the entire B0–B8 plan is not complete.

31/10/2026 handoff follow-up: owner requested detailed onboarding and assigned GitHub issues. Added developer runbook, code/action contract map, manual acceptance, merge/Discord guide and detailed issue scopes. Issues32–46 are created and assigned to Huy/Khai;32 is the initial baseline review, dependent tasks remain blocked and are not automatically agent-ready. See [ISSUE_TRACKER](../handoff/ISSUE_TRACKER.md). No merge, deployment, Discord message, Trello update or closure of older issues was performed. These are documentation/coordination changes; no new application-test result is inferred.
