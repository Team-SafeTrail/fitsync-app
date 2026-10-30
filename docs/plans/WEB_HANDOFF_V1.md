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

Desktop: navigation → Today/roster → focused dossier sections; appointment and conversation remain contextual routes. Phone: Home, learners (PT), calendar and chat reachable without hidden sidebar; profile sections use anchor navigation and readable stacked content. Calendar uses agenda; charts offer units, dates and a table alternative. Intake entry never pushes recent context below a long form by default.

PT Today focuses on upcoming appointments, check-in attention and invitation status. Learner Today focuses on the next appointment, daily check-in, shared coaching targets and progress. No unread count without a read-state model; no invented streak or automatic exercise prescription.

## Meaning of a v1 freeze

“UI baseline ready for handoff” means implemented surfaces and states have rendered evidence and mapped contracts. It does not mean missing backend actions are simulated as success. “Database v1” means exact versioned migrations plus a domain contract and upgrade plan. It does not mean every future report template, cancellation fee or retention rule has been approved. Huy reviews database/security/operational gates; Khai reviews web interactions and Android parity before release.

Keep membership dates, appointment attendance and PT-session ledger separate. Existing remaining_sessions remains an explicit legacy balance until a transactional ledger transition is implemented. Unknown report fields stay absent, with original unit/provenance and PT review; no AI inference fills gaps.

## Current checkpoint

Inventory in progress. Historical baseline at28a9e9a:87 unit tests,169 SQL/RLS checks and4 authenticated browser scenarios passed in CI. Those are previous results, not new checks for this handoff delivery. See COACHING_PRODUCT_FOLLOWUP.md for their run IDs.
