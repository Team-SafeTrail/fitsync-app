# Paste-ready prompt: refresh the FitSync EXE201 Trello board

Paste everything inside the prompt block into the ChatGPT conversation connected to Trello. It refreshes the existing board into a Kanban workflow while preserving its history.

```text
You are operating my connected Trello account for the FitSync EXE201 project. Refresh the existing FitSync board into a Kanban board that the team can operate daily and the lecturer can audit weekly. Execute the changes; do not only describe them.

SAFETY AND DISCOVERY
1. Find the existing board whose name contains “FitSync”. If multiple boards match, show their names and ask me to select one before changing anything.
2. Inventory all lists, cards, members, labels, checklists, dates, comments, attachments, and links. Create `[MIGRATION LOG] Previous board inventory` before migrating.
3. Never delete a board, list, card, comment, checklist, attachment, or activity history. Reuse matching cards. Migrate useful cards before archiving obsolete or empty lists; archive instead of permanently deleting.
4. Never invent a date, GitHub issue, pull request, evidence link, metric, user, install, transaction, accuracy result, or completion state.
5. If the official calendar start date of Week 1 or Week 4 is missing, ask me one concise question. If I do not provide it, retain week identifiers without creating calendar due dates.
6. Do not modify GitHub or send Discord messages.

BOARD STRUCTURE
Keep the existing board and rename it to `FitSync — EXE201 Delivery` if needed. Use these lists in this exact order:
1. `00 — GUIDE & MASTER LINKS`
2. `01 — PRODUCT BACKLOG`
3. `02 — TO DO THIS WEEK`
4. `03 — DOING`
5. `04 — REVIEW`
6. `05 — DONE`
7. `06 — BLOCKED`
8. `07 — WEEKLY REPORTS & EVIDENCE`

The workflow is:
`PRODUCT BACKLOG → TO DO THIS WEEK → DOING → REVIEW → DONE`

- Future deliverables stay in PRODUCT BACKLOG.
- At weekly planning, Việt moves only the accepted current-week scope into TO DO THIS WEEK.
- The accountable owner moves a started card to DOING.
- Finished work moves to REVIEW with evidence and actual checks.
- Only the named reviewer may accept it and move it to DONE. Owners never self-approve.
- A blocked card moves to BLOCKED and records the reason, dependency owner, previous stage, and next review date. When resolved, return it to the previous active stage.
- Do not use duplicate status labels because lists already represent status.

LABELS
Create/reuse labels `W01` through `W14`, `OC1`, `OC2`, `OC3`, `ENGINEERING`, `PRODUCT`, `MARKETING`, `EVIDENCE`, `PRIVACY`, and `BACKFILLED`. Apply one week label and the relevant outcome/area labels to each deliverable.

GUIDE CARDS
Create or update these cards in `00 — GUIDE & MASTER LINKS`:
- `[RULES] Trello / GitHub / Discord authority`
- `[LINKS] Repository, deployed app, Figma, LMS, Discord, evidence folder`
- `[TEMPLATE] Deliverable card`
- `[TEMPLATE] Weekly lecturer report`
- `[MIGRATION LOG] Previous board inventory`

The rules card must state:
- Trello owns weekly commitments, responsibility, workflow status, deadlines, and evidence indexes.
- GitHub Issues and pull requests own engineering scope, implementation acceptance, code review, and CI.
- Discord owns announcements, questions, meeting coordination, and daily status; it is not another backlog.
- Repository behavior, migrations, tests, active product plan, and architecture are the source of product truth.
- Planned targets are not verified evidence.

TEAM AND REVIEW ROUTING
Match members by name; do not assign the wrong account. If a member is missing, leave the card unassigned, move it to BLOCKED, and add `Invite this owner to Trello`.
- Việt: product coordination, board, evidence, submissions. Discord `@2uoc_vi3t`. Reviewer for Việt-owned work: Hưng.
- Hưng: OCR data, benchmark, technical metrics. Discord `@hei.isme`. Reviewer: Việt.
- Huy: backend, Supabase, RLS, cloud, analytics, payments. Discord `@_huymc`. Reviewer: Hưng.
- Khai: frontend, responsive UX, Android/Play, demo. Discord `@nottooamaz1ng`. Reviewer: Huy.
- Toàn: UI/UX, marketing, channel evidence, TVC. Discord `@letoan8423`. Reviewer: Khai.

CARD CONTRACT
Cards represent real deliverables, not one artificial card per person per week. Title cards `[W##][OC#] Verb + outcome`; use `[W##][ALL]` only for cross-outcome final work.

Every card description must contain:
- Accountable owner
- Contributors, if any
- Independent reviewer
- Goal and course outcome
- Checklist with observable actions
- Dependencies and blockers
- GitHub issue/PR when engineering is ready
- Course week and official due date when known
- `Done when` acceptance statement
- Evidence links and actual verification results

For code, create or link a GitHub issue before implementation begins. Never invent an issue number. These are the only known issues to link now:
- #2 OCR benchmark: https://github.com/Team-SafeTrail/fitsync-app/issues/2
- #3 private OCR attempts/storage/RLS: https://github.com/Team-SafeTrail/fitsync-app/issues/3
- #4 OCR review UI/Android investigation: https://github.com/Team-SafeTrail/fitsync-app/issues/4
- #5 UI and evidence assets: https://github.com/Team-SafeTrail/fitsync-app/issues/5

WEEK 1–3 BACKFILL
Week 1–3 must be visible, but reconstructed history must be honest. Create these candidate cards with BACKFILLED and the matching week label. Put a card in DONE only when an existing card, repository link, document, commit, PR, test result, or attachment supports it. Otherwise put it in REVIEW and write `Backfilled in Week 4; original completion date or contributor evidence requires confirmation`.

W01 candidates:
1. `[W01][OC1] Freeze product scope, team roles, and course outcomes`
   Evidence candidates: active product plan, course requirements, role allocation, meeting records.
   Evidence owner: Việt. Reviewer: Hưng.
2. `[W01][OC1] Establish research and design baseline`
   Evidence candidates: survey evidence, DESIGN.md, Figma/design references.
   Evidence owner: Toàn. Contributors: Việt, Hưng. Reviewer: Khai.

W02 candidates:
1. `[W02][OC1] Establish monorepo and modular-monolith architecture`
   Evidence candidates: ADR-001, repository structure, CI history.
   Evidence owner: Việt. Contributors: Hưng, Huy. Reviewer: Hưng.
2. `[W02][OC1] Verify identity, profiles, invitation, and tenant isolation`
   Evidence candidates: M1/M2 handoff, migrations, RLS tests, authenticated browser flow.
   Evidence owner: Huy. Contributors: Khai, Hưng. Reviewer: Hưng.
3. `[W02][OC1] Verify manual InBody workflow across PT and trainee views`
   Evidence candidates: M2 handoff, domain tests, browser evidence.
   Evidence owner: Khai. Contributors: Huy. Reviewer: Huy.

W03 candidates:
1. `[W03][OC1] Verify daily check-in, private meal media, and PT visibility`
   Evidence candidates: M3 commit `82f9c1b`, pgTAP/RLS, domain and browser checks.
   Evidence owner: Huy. Contributors: Khai, Hưng. Reviewer: Hưng.
2. `[W03][OC1] Verify session balance and three-day warning rule`
   Evidence candidates: M3 handoff, Asia/Ho_Chi_Minh boundary tests, browser flow.
   Evidence owner: Hưng. Contributors: Huy, Khai. Reviewer: Việt.
3. `[W03][OC1] Align landing activation and team delivery workflow`
   Evidence candidates: landing checkpoint `8c0ee7e`, pull requests #6–#8, README and team playbook.
   Evidence owner: Việt. Contributors: Khai, Toàn. Reviewer: Hưng.

CURRENT WEEK 4
Reuse matching existing cards and place ready work in TO DO THIS WEEK. Preserve actual in-progress/review status when evidence supports it.

1. `[W04][OC1] Freeze OC1 scope and evidence matrix`
   Owner: Việt. Contributors: all. Reviewer: Hưng.
   Checklist: copy official LMS dates; confirm Play Console/account readiness; map rubric to evidence; name privacy/consent/retention/deletion/incident/provider owners; record critical risks.
   Done when: every OC1 requirement has an owner, deadline, evidence type, dependency, and fallback.
2. `[W04][OC1] Prepare synthetic-first OCR benchmark`
   Owner: Hưng. Contributor: Việt. Reviewer: Việt. Link Issue #2.
   Checklist: corpus manifest; five-field ground truth; development/holdout separation; at least two candidates; accuracy/error/latency/cost definitions; no unapproved real health reports.
   Done when: benchmark protocol and inputs are independently reviewable.
3. `[W04][OC1] Build private OCR data foundation`
   Owner: Huy. Contributor: Hưng. Reviewer: Hưng. Link Issue #3.
   Checklist: versioned migration; private bucket; bounded statuses/errors; assigned-PT RLS; server file validation; generated types; cross-tenant pgTAP.
   Done when: extraction cannot create a verified InBody record and all security checks pass.
4. `[W04][OC1] Prototype OCR review and decide Android constraints`
   Owner: Khai. Contributor: Huy. Reviewer: Huy. Link Issue #4.
   Checklist: upload/loading/success/low-confidence/failure states; correction; explicit confirmation; manual fallback; responsive layouts; auth/upload/camera/server/Play/build comparison.
   Done when: reviewed UX states and a written packaging recommendation exist without an empty mobile scaffold.
5. `[W04][OC1] Review truthful UI and evidence assets`
   Owner: Toàn. Contributor: Khai. Reviewer: Khai. Link Issue #5.
   Checklist: design review; Vietnamese copy audit; screenshot/store asset checklist; planned/verified labels; synthetic data; account blocker recorded.
   Done when: reviewed assets contain no unsupported claim or private data.

FUTURE DELIVERABLE BACKLOG
Create the following cards in PRODUCT BACKLOG with NOT-YET-STARTED checklists. Do not mark them complete, create fictional evidence, or assign calendar dates until official dates are known.

W05 — M4 integration:
- `[W05][OC1] Select OCR provider or manual-only fallback` — Owner Hưng; contributor Việt; reviewer Việt. Benchmark, denominators, failures, latency, cost, go/no-go record.
- `[W05][OC1] Integrate secure server-only OCR draft lifecycle` — Owner Huy; contributor Hưng; reviewer Hưng. Adapter, bounded failure, private signed access, normalized draft, idempotent confirmation, RLS/storage tests.
- `[W05][OC1] Complete OCR correction and confirmation browser flow` — Owner Khai; contributor Huy; reviewer Huy. Upload, flags, edits, fallback, reload, desktop/mobile E2E.
- `[W05][OC1] Finalize truthful OCR copy and visuals` — Owner Toàn; contributor Khai; reviewer Khai. Accessibility, screenshots, capability labels, no unmeasured claims.

W06 — OC1 release candidate:
- `[W06][OC1] Prepare production and staging operations` — Owner Huy; contributor Hưng; reviewer Hưng. Environments, migration, secrets, backup, monitoring, rollback, smoke test.
- `[W06][OC1] Produce approved Android release candidate` — Owner Khai; contributor Huy; reviewer Huy. Approved packaging only, signed build, auth/upload/private-media tests, Play testing or truthful APK fallback, device matrix.
- `[W06][OC1] Validate release OCR metrics` — Owner Hưng; contributor Việt; reviewer Việt. Locked holdout rerun, regression check, redacted appendix, fallback statement.
- `[W06][OC1] Rehearse OC1 and finalize release assets` — Owner Việt; contributors Toàn and all; reviewer Hưng. Rubric matrix, demo script, store assets, architecture slide, risk log.

W07 — OC1 submission:
- `[W07][OC1] Freeze and submit OC1 evidence package` — Owner Việt; contributors all; reviewer Hưng. Deployment/install proof, board history, Git evidence, test report, demo, presentation, submission receipt, redaction.

W08 — safe pilot design:
- `[W08][OC2] Define pilot offer, consent, support, deletion, and incident operations` — Owner Việt; contributor Huy; reviewer Hưng.
- `[W08][OC2] Scope password reset and account lifecycle backend` — Owner Huy; contributor Hưng; reviewer Hưng.
- `[W08][OC2] Design roster management and biometric trend workflows` — Owner Khai; contributor Huy; reviewer Huy.
- `[W08][OC2] Define privacy-safe product/OCR measurement dictionary` — Owner Hưng; contributor Huy; reviewer Việt.
- `[W08][OC2] Design two measured channel experiments` — Owner Toàn; contributor Việt; reviewer Khai.

W09 — M5 analytics and assets:
- `[W09][OC2] Implement privacy-safe funnel, deletion, and support operations` — Owner Huy; contributor Hưng; reviewer Hưng.
- `[W09][OC2] Implement remaining MVP UI and approved client events` — Owner Khai; contributor Huy; reviewer Huy.
- `[W09][OC2] Verify KPI formulas and analytics quality` — Owner Hưng; contributor Việt; reviewer Việt.
- `[W09][OC2] Produce launch assets, UTM links, and content calendar` — Owner Toàn; contributor Việt; reviewer Khai.

W10 — two-channel launch:
- `[W10][OC2] Operate direct-gym acquisition channel` — Owner Việt; contributor Toàn; reviewer Hưng.
- `[W10][OC2] Launch attributed online channel` — Owner Toàn; contributor Việt; reviewer Khai.
- `[W10][OC2] Maintain production, Android release, and install evidence` — Owner Huy; contributor Khai; reviewer Hưng.
- `[W10][OC2] Monitor OCR demo quality and manual fallback` — Owner Hưng; contributor Khai; reviewer Việt.

W11 — M6 paid pilot:
- `[W11][OC3] Implement manual VietQR evidence and entitlement` — Owner Huy; contributor Hưng; reviewer Hưng. Private evidence, validation, audit trail, idempotency, RLS, redacted export.
- `[W11][OC3] Build transparent payment-status UX` — Owner Khai; contributor Huy; reviewer Huy. Pending/verified/rejected states; no client self-approval.
- `[W11][OC3] Open approved offer and paid sales pipeline` — Owner Việt; contributor Toàn; reviewer Hưng. Terms, refund handling, unique accounts, reviewer separation.
- `[W11][OC3] Monitor OCR value, cost, and failure risk` — Owner Hưng; contributor Việt; reviewer Việt.

W12 — pilot and media production:
- `[W12][OC3] Run conversion and consented feedback cycle` — Owner Việt; contributors Toàn and all; reviewer Hưng.
- `[W12][OC3] Draft OCR performance and limitations report` — Owner Hưng; contributor Việt; reviewer Việt.
- `[W12][OC3] Reconcile transactions and production operations` — Owner Huy; contributor Việt; reviewer Hưng.
- `[W12][OC3] Record 3–5 minute released-product demo` — Owner Khai; contributor Huy; reviewer Huy.
- `[W12][OC3] Produce 60–90 second TVC draft` — Owner Toàn; contributor Khai; reviewer Khai.

W13 — OC2/OC3 evidence freeze:
- `[W13][OC2] Freeze channel metrics and draft final report` — Owner Việt; contributors all; reviewer Hưng.
- `[W13][OC3] Finalize OCR and product analytics appendix` — Owner Hưng; contributor Việt; reviewer Việt.
- `[W13][OC3] Finalize redacted financial and system evidence` — Owner Huy; contributor Việt; reviewer Hưng.
- `[W13][OC1] Finalize install evidence and technical demo` — Owner Khai; contributor Huy; reviewer Huy.
- `[W13][OC2] Finalize channel report, TVC, and slides` — Owner Toàn; contributor Việt; reviewer Khai.

W14 — final submission:
- `[W14][ALL] Submit and defend final package` — Owner Việt; contributors all; reviewer Hưng.
- `[W14][ALL] Verify frozen technical numbers and limitations` — Owner Hưng; contributor Việt; reviewer Việt.
- `[W14][ALL] Secure and archive operational evidence` — Owner Huy; contributor Việt; reviewer Hưng.
- `[W14][ALL] Support final demo and release fallback` — Owner Khai; contributor Huy; reviewer Huy.
- `[W14][ALL] Perform final media and presentation QA` — Owner Toàn; contributor Khai; reviewer Khai.

WEEKLY REPORTS
Create `[W01] Weekly lecturer report` through `[W14] Weekly lecturer report` in `07 — WEEKLY REPORTS & EVIDENCE`. W01–W03 receive BACKFILLED and must state `Reconstructed in Week 4 from available evidence; this is not original Trello activity`. Do not pre-fill future results.

Each report contains:
- Commitments at start of week
- DONE / REVIEW / DOING / TO DO / BLOCKED totals
- Completed evidence links
- Unfinished carry-over and reason
- Blockers, dependency owner, and resolution plan
- Contribution summary by member based on cards/evidence
- GitHub issues and pull requests
- Demo, screenshot, test, analytics, or submission evidence
- Decisions and next-week priorities

Create evidence-index cards `[OC1] Final evidence`, `[OC2] Final evidence`, `[OC3] Final evidence`, and `[FINAL] Submission receipts and immutable links` in the same list. Never attach raw health reports, credentials, tokens, private signed URLs, unredacted identities, or full banking records.

FINAL VERIFICATION
Before finishing, verify:
- All eight lists exist once and in the specified order.
- Existing useful cards/history were preserved and exact-title duplicates do not exist.
- Every deliverable has exactly one accountable owner or an explicit invite blocker, a reviewer, week/outcome labels, checklist, dependencies, Done-when condition, and evidence section.
- W01–W03 are visibly BACKFILLED and never presented as original Trello history.
- W04 cards use Issues #2–#5 correctly; future cards contain no invented issue numbers.
- Current cards reflect available evidence; future cards are in PRODUCT BACKLOG and are not marked complete.
- REVIEW precedes DONE, and no owner self-approved a card.

Return a concise report listing the selected board, lists/cards reused, cards created, cards migrated, lists archived, missing members, missing calendar dates, blocked items, duplicates avoided, and anything you could not complete.
```
