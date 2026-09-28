# Paste-ready prompt: refresh the FitSync EXE202 Trello board

Paste everything inside the prompt block into the ChatGPT conversation that has access to your Trello account. This refreshes the existing board; it must not delete its history.

```text
You are operating my connected Trello account for the FitSync project. Refresh the existing FitSync EXE202 board so our lecturer can inspect progress week by week. Execute the changes, do not merely explain how to do them.

SAFETY AND DISCOVERY
1. Find the existing board whose name contains “FitSync”. If more than one board matches, show their names and ask me to select one before changing anything.
2. Inventory the current lists, open cards, completed cards, members, labels, attachments, and comments. Never delete a board, list, card, comment, checklist, attachment, or activity history.
3. If the official calendar date for the start of Week 4 is not already present, ask me exactly one question for that date. If I do not answer, continue using week labels without inventing calendar due dates.
4. Reuse cards when their outcome matches. Do not create duplicates. Preserve existing descriptions, comments, attachments, checklists, and links when renaming or moving a card.
5. Migrate useful cards before archiving obsolete or empty lists. Archive; never permanently delete. Create a card in the guide list named `[MIGRATION LOG] Previous board inventory` and record what was reused, moved, newly created, or archived.
6. Never mark a task DONE and never invent a GitHub link, evidence link, metric, user, install, transaction, accuracy result, or completion state. Derive current status only from existing evidence; otherwise use NOT STARTED.

BOARD STRUCTURE
Keep the existing board, but rename it to `FitSync — EXE202 Weekly Delivery` if needed. Use these lists in this exact order:
1. `00 — GUIDE & MASTER LINKS`
2. `W04 — M4 / OCR KICK-OFF`
3. `W05 — M4 INTEGRATION`
4. `W06 — OC1 RELEASE CANDIDATE`
5. `W07 — OC1 FREEZE & SUBMISSION`
6. `W08 — SAFE PILOT DESIGN`
7. `W09 — M5 ANALYTICS & ASSETS`
8. `W10 — TWO-CHANNEL LAUNCH`
9. `W11 — M6 PAID PILOT`
10. `W12 — PILOT & MEDIA PRODUCTION`
11. `W13 — OC2/OC3 EVIDENCE FREEZE`
12. `W14 — FINAL SUBMISSION`
13. `99 — EVIDENCE INDEX`

Cards must stay inside their assigned week so the lecturer can compare the plan with the outcome. Use labels instead of moving cards between weeks:
- Status: `NOT STARTED`, `IN PROGRESS`, `IN REVIEW`, `BLOCKED`, `DONE`
- Outcome: `OC1`, `OC2`, `OC3`
- Area: `ENGINEERING`, `PRODUCT`, `MARKETING`, `EVIDENCE`, `PRIVACY`

Create these guide cards in `00 — GUIDE & MASTER LINKS`:
- `[RULES] Trello / GitHub / Discord authority`
- `[LINKS] Repository, deployed app, Figma, LMS, evidence folder`
- `[TEMPLATE] Member task card`
- `[TEMPLATE] Weekly lecturer review`
- `[MIGRATION LOG] Previous board inventory`

The rules card must state: Trello owns course weeks, owners, deadlines, and evidence; GitHub Issues/PRs own engineering scope and code review; Discord owns discussion and daily updates; repository docs/tests own product truth and security. A target is not evidence.

MEMBERS AND REVIEWERS
Assign cards by matching these display names. If a member is absent, leave the card unassigned, add BLOCKED, and write `Invite this owner to Trello` instead of assigning the wrong person.
- Huỳnh Quốc Việt / Việt: product lead, weekly board, evidence, submissions. Reviewer: Hưng.
- Lê Nguyễn Gia Hưng / Hưng: OCR data, benchmarks, technical metrics. Reviewer: Việt.
- Dương Quang Huy / Huy: backend, Supabase, RLS, cloud, analytics, payments. Reviewer: Hưng.
- Diệp Khai / Khai: frontend, responsive UX, Android/Play, demo. Reviewer: Huy.
- Lê Văn Toàn / Toàn: UI/UX, marketing, channel evidence, TVC. Reviewer: Khai.

CARD CONTRACT
Use titles `[W##][OC#][NAME] Outcome`; use `[W##][ALL]` when more than one outcome applies. Every member card must contain:
- Accountable owner and reviewer
- Outcome and why it matters
- Checklist copied from the weekly specification below
- Dependencies
- GitHub issue/PR link when engineering becomes ready
- `Done when` acceptance statement
- Evidence section containing links only after evidence exists
- Course week and official due date when known

For engineering work, create or link a GitHub issue before code starts; do not invent an issue number. The only existing links that may be inserted now are:
- Issue #2: https://github.com/Team-SafeTrail/fitsync-app/issues/2
- Issue #3: https://github.com/Team-SafeTrail/fitsync-app/issues/3
- Issue #4: https://github.com/Team-SafeTrail/fitsync-app/issues/4
- Issue #5: https://github.com/Team-SafeTrail/fitsync-app/issues/5

At the top of every weekly list create `[W##][REVIEW] Lecturer progress report`, owned by Việt and reviewed by Hưng. Its checklist is:
- Record planned cards and owners
- Count DONE / IN REVIEW / IN PROGRESS / BLOCKED
- Link completed evidence
- Explain unfinished carry-over without rewriting the original week
- Record blockers, decisions, and next-week priorities
- Attach or link the lecturer-facing weekly summary
- Scope next week's engineering cards into GitHub Issues

DETAILED WEEKLY MEMBER CARDS

W04 — M4 / OCR KICK-OFF
1. `[W04][OC1][VIỆT] Freeze OC1 scope and weekly governance`
   Checklist: copy exact LMS dates; confirm Play Console/account readiness; create OC1 evidence matrix; name consent/retention/deletion/incident/provider owners; coordinate Issue #2; post Trello/Discord rules.
   Done when: every Week 4 card has owner, reviewer, dependencies, acceptance, and the OC1 risk list is visible.
2. `[W04][OC1][HƯNG] Prepare synthetic-first OCR benchmark` — link Issue #2.
   Checklist: version corpus manifest; define five-field ground truth; separate development and holdout sources; define at least two candidates; define accuracy, flagged-error, latency, and cost calculations; exclude real reports until governance passes.
   Done when: corpus/ground-truth format and reproducible benchmark procedure are reviewable.
3. `[W04][OC1][HUY] Build private OCR data foundation` — link Issue #3.
   Checklist: versioned `ocr_attempts` migration; private source-image bucket; status/error constraints; assigned-PT RLS; server-side file validation; generated types; pgTAP cross-tenant denial.
   Done when: extraction cannot create a verified InBody record and all database/security checks pass.
4. `[W04][OC1][KHAI] Prototype OCR review and decide packaging constraints` — link Issue #4.
   Checklist: upload/loading/success/low-confidence/failure states; correction and explicit confirmation; manual fallback; responsive layout; compare Android options for auth, upload/camera, server connectivity, Play policy, build, and release.
   Done when: reviewed UX states and a written packaging recommendation exist without an empty app scaffold.
5. `[W04][OC1][TOÀN] Review OCR UX and evidence assets` — link Issue #5.
   Checklist: review states against FitSync design; audit Vietnamese copy; prepare screenshot/store asset checklist; label planned versus verified claims; use synthetic data only; identify Trello/GitHub account blocker if present.
   Done when: reviewed asset/copy checklist exists and unsupported claims are removed.

W05 — M4 INTEGRATION
1. `[W05][OC1][VIỆT] Make OCR provider go/no-go decision`
   Checklist: review benchmark and risks; approve provider or manual-only fallback; freeze acceptance demo; update product capability status; ensure costs and consent responsibilities are recorded.
   Done when: dated decision links measured evidence and names the fallback.
2. `[W05][OC1][HƯNG] Execute and report locked OCR benchmark`
   Checklist: run candidates on same holdout; record denominators and failures; calculate per-field/exact-record accuracy, flagged errors, latency, and cost; redact output; recommend candidate or no-provider decision.
   Done when: another member can reproduce the aggregate result.
3. `[W05][OC1][HUY] Integrate server-only OCR adapter`
   Checklist: provider-neutral adapter; bounded failures/timeouts; private signed source access; persisted normalized draft; idempotent confirmation boundary; RLS/storage tests; no raw provider payload in logs.
   Done when: secure draft lifecycle passes database, unit, and failure tests.
4. `[W05][OC1][KHAI] Complete OCR correction browser flow`
   Checklist: connect upload to draft; highlight missing/low-confidence/inconsistent values; edit all fields; confirm explicitly; recover to manual entry; persistence after reload; desktop/mobile E2E.
   Done when: a real browser proves upload → review → correction → confirmation and failure fallback.
5. `[W05][OC1][TOÀN] Finalize truthful OCR copy and visuals`
   Checklist: review accessibility and responsive hierarchy; prepare verified screenshot frames; remove unmeasured accuracy/latency claims; update store/demo asset map.
   Done when: design review is approved and every capability label matches evidence.

W06 — OC1 RELEASE CANDIDATE
1. `[W06][OC1][VIỆT] Run release go/no-go and demo rehearsal`
   Checklist: freeze OC1 scope; map rubric to evidence; write demo script; schedule rehearsal; log release risks and owners; verify Trello/GitHub traceability.
   Done when: release checklist has no unnamed critical blocker.
2. `[W06][OC1][HƯNG] Validate OCR release metrics`
   Checklist: rerun locked holdout on release version; compare regressions; validate cost/latency denominators; prepare redacted technical appendix; define manual fallback statement.
   Done when: release metrics are dated, reproducible, and safe to present.
3. `[W06][OC1][HUY] Prepare production/staging operations`
   Checklist: separate environments; migration plan; secrets review; backup/restore note; privacy-safe logging; monitoring; rollback steps; production smoke test.
   Done when: deployment can be repeated and rolled back without exposing secrets or health data.
4. `[W06][OC1][KHAI] Produce approved Android release candidate`
   Checklist: implement only approved packaging path; test auth/upload/private media; generate signed candidate; configure Play internal/closed testing when available; retain APK fallback; test representative Android devices.
   Done when: install proof and device test matrix exist, or the blocker and fallback are documented truthfully.
5. `[W06][OC1][TOÀN] Produce OC1 presentation and store assets`
   Checklist: final icon/screenshots/copy; synthetic demo account; architecture/flow slide; asset sizes/export log; visual QA on presentation and install instructions.
   Done when: all OC1 visuals are linked, reviewed, and contain no private data.

W07 — OC1 FREEZE & SUBMISSION
1. `[W07][OC1][VIỆT] Submit OC1 evidence package`
   Checklist: confirm rubric; board export/screenshots; commit/PR history; deployment/install proof; test report; demo link; presentation; submission receipt.
   Done when: every OC1 rubric row links evidence and submission receipt is archived.
2. `[W07][OC1][HƯNG] Sign off OCR evidence`
   Checklist: reconcile presented metrics to raw aggregate report; verify denominators/version; prepare OCR Q&A; confirm no real reports or provider payloads are exposed.
   Done when: every OCR claim is traceable and defensible.
3. `[W07][OC1][HUY] Sign off production security and rollback`
   Checklist: final smoke test; RLS/storage verification; backup status; incident contacts; rollback command/process; redact operational screenshots.
   Done when: release evidence demonstrates operation and tenant isolation.
4. `[W07][OC1][KHAI] Sign off Android installation and demo`
   Checklist: clean-device install; login/upload/check-in smoke flow; capture Play testing/listing or APK proof; record version/build; prepare demo fallback.
   Done when: lecturer can install or inspect the exact submitted build.
5. `[W07][OC1][TOÀN] Finalize OC1 visual evidence`
   Checklist: final screenshots; consistent branding; caption planned/verified features; inspect QR/links; export presentation assets; remove personal data.
   Done when: final visual package is presentation-ready and truthful.

W08 — SAFE PILOT DESIGN
1. `[W08][OC2][VIỆT] Define pilot offer, consent, and support operations`
   Checklist: choose pilot scope and pricing hypothesis; define eligibility; assign consent/support/deletion/incident owners; create onboarding and feedback SOP; approve two-channel experiments.
   Done when: the team can onboard a pilot without promising unavailable features.
2. `[W08][OC2][HƯNG] Define product and OCR measurement dictionary`
   Checklist: define success/failure denominators; OCR quality/latency/cost metrics; allowed aggregate fields; review cadence; validation rules for exports.
   Done when: each technical metric has owner, trigger, formula, and privacy rule.
3. `[W08][OC2][HUY] Design account recovery, deletion, and support backend`
   Checklist: password-reset flow; deletion/export request lifecycle; authorization/audit boundaries; retention behavior; support runbook; database/test impact.
   Done when: implementation issues are scoped with security acceptance criteria.
4. `[W08][OC2][KHAI] Design remaining MVP management workflows`
   Checklist: trainee edit/archive/search/filter; biometric weight/body-fat trends; password-reset UI; deletion/support entry; responsive states and empty/error cases.
   Done when: reviewed UX maps directly to scoped engineering issues.
5. `[W08][OC2][TOÀN] Design two measured channel experiments`
   Checklist: define direct-gym and online channel; audience/message/CTA; consented interview script; asset list; UTM naming; success and stop criteria.
   Done when: both experiments have owners, dates, budgets if any, and measurable outcomes.

W09 — M5 ANALYTICS & ASSETS
1. `[W09][OC2][VIỆT] Approve pilot SOP and KPI review`
   Checklist: validate onboarding/support SLA claim or remove it; approve event dictionary; schedule weekly KPI review; prepare issue triage; approve channel launch gate.
   Done when: operating claims match actual team capacity and measured events.
2. `[W09][OC2][HƯNG] Verify analytics quality and OCR aggregates`
   Checklist: test metric formulas; detect duplicates/missing events; validate pseudonymous aggregation; compare OCR dashboard to benchmark; document data limitations.
   Done when: sample exports reconcile to known test actions without health values.
3. `[W09][OC2][HUY] Implement privacy-safe funnel and deletion operations`
   Checklist: instrument approved server events; exclude notes/biometrics/tokens/URLs; implement deletion/support backend; protect analytics access; add unit/integration tests.
   Done when: event and deletion tests pass and sensitive payloads are absent.
4. `[W09][OC2][KHAI] Implement remaining MVP UI and client instrumentation`
   Checklist: roster edit/archive/search/filter; biometric trends; password reset; deletion/support entry; approved client triggers; responsive E2E.
   Done when: workflows persist, remain tenant-isolated, and render on desktop/mobile.
5. `[W09][OC2][TOÀN] Produce launch assets and attributed links`
   Checklist: channel-specific copy/video; UTM links; content calendar; approved screenshots; lead/feedback form; brand and privacy review.
   Done when: each asset links one measurable CTA and contains no unsupported claim.

W10 — TWO-CHANNEL LAUNCH
1. `[W10][OC2][VIỆT] Operate direct-gym channel and weekly funnel`
   Checklist: conduct consented outreach; record source and stage; demo released product; log objections; review visits/signups/activations/installs; avoid fabricated leads.
   Done when: dated source-level evidence and lessons exist.
2. `[W10][OC2][HƯNG] Support technical demos and monitor OCR quality`
   Checklist: prepare synthetic demo reports; monitor failures/latency; classify incidents; verify manual fallback; update aggregate quality log.
   Done when: demo issues are reproducible and routed without exposing reports.
3. `[W10][OC2][HUY] Operate deployment and support triage`
   Checklist: monitor availability/errors; resolve authorized data issues; verify backups; process support/deletion requests; record incidents and fixes.
   Done when: weekly operations report links real incidents and resolutions.
4. `[W10][OC2][KHAI] Maintain Android/web release and install evidence`
   Checklist: triage UI/install blockers; test fixes; publish approved build; export Play install data when available; update device matrix.
   Done when: release status and install evidence are current and reproducible.
5. `[W10][OC2][TOÀN] Launch online channel and collect attributed evidence`
   Checklist: publish approved content; record post/video URLs and dates; monitor UTM traffic; capture comments/leads ethically; compare creative variants.
   Done when: traffic and conversion evidence is attributable to the online channel.

W11 — M6 PAID PILOT
1. `[W11][OC3][VIỆT] Open approved paid pilot`
   Checklist: finalize offer/terms/refund handling; approve eligible accounts; operate sales pipeline; verify payment reviewer separation; track paid users uniquely.
   Done when: every claimed paid user maps to a real account and reviewable transaction reference.
2. `[W11][OC3][HƯNG] Monitor OCR value, cost, and failure risk`
   Checklist: aggregate pilot OCR attempts; review manual edits/failures; calculate cost/latency; flag provider regressions; keep health data out of reports.
   Done when: weekly OCR report has denominators and actionable findings.
3. `[W11][OC3][HUY] Implement manual VietQR evidence and entitlement`
   Checklist: subscriptions/payment records migration; private evidence storage; server validation; reviewer/audit trail; idempotent entitlement; RLS; redacted export; tests.
   Done when: repeated verification cannot duplicate entitlement and cross-tenant access is denied.
4. `[W11][OC3][KHAI] Build transparent upgrade and payment-status UX`
   Checklist: show offer as approved; payment instructions; pending/verified/rejected states; receipt upload constraints; support path; responsive E2E.
   Done when: user sees accurate status and no client action can self-approve payment.
5. `[W11][OC3][TOÀN] Produce paid-pilot sales and onboarding assets`
   Checklist: truthful offer copy; onboarding guide; FAQ; direct/online conversion assets; feedback request; consent/privacy review.
   Done when: assets match implemented entitlement and approved pricing.

W12 — PILOT & MEDIA PRODUCTION
1. `[W12][OC3][VIỆT] Run conversion and consented feedback cycle`
   Checklist: onboard pilots; track unique funnel stages; conduct consented interviews; prioritize blockers; reconcile paid-user count with Huy; outline final report.
   Done when: pipeline, feedback, and paid claims link real evidence.
2. `[W12][OC3][HƯNG] Produce OCR performance and limitations draft`
   Checklist: consolidate benchmark/pilot aggregates; separate versions; explain failure modes; document manual fallback; prepare charts with denominators.
   Done when: report is technically reviewed and makes no unsupported claim.
3. `[W12][OC3][HUY] Reconcile transactions and production operations`
   Checklist: match payments to unique accounts; resolve duplicates; export redacted evidence; review uptime/incidents; verify backups and access log.
   Done when: finance totals reconcile and raw banking data remains private.
4. `[W12][OC3][KHAI] Record MVP demo and polish critical flows`
   Checklist: fix approved pilot blockers; final responsive smoke test; record 3–5 minute flow; include manual fallback; capture exact build/version.
   Done when: demo shows only released capabilities and has a tested backup file.
5. `[W12][OC3][TOÀN] Produce TVC draft and optimize channel creative`
   Checklist: edit 60–90 second TVC; use approved claims/assets; add captions/audio rights; compare channel results; prepare final revisions.
   Done when: reviewed TVC draft and channel-performance notes exist.

W13 — OC2/OC3 EVIDENCE FREEZE
1. `[W13][OC2][VIỆT] Freeze OC2 metrics and draft final report`
   Checklist: verify two channel datasets; reconcile funnel definitions; collect member sections; validate paid-user count; prepare defense script and rehearsal.
   Done when: every report claim links dated evidence and an owner.
2. `[W13][OC3][HƯNG] Finalize OCR and product analytics appendix`
   Checklist: lock report version; verify formulas/denominators; explain limitations; reconcile dashboard/export; prepare technical Q&A.
   Done when: appendix is reproducible and approved by Việt.
3. `[W13][OC3][HUY] Finalize redacted financial and system evidence`
   Checklist: unique account/transaction reconciliation; redact bank/personal data; export architecture/operations evidence; verify access; prepare backup copy.
   Done when: totals reconcile and evidence can be shared safely with the lecturer.
4. `[W13][OC1][KHAI] Finalize install evidence and technical demo`
   Checklist: final build smoke test; Play/install export; final demo edit; technical appendix; offline fallback; validate every QR/link.
   Done when: exact released version is installable or its approved fallback is demonstrable.
5. `[W13][OC2][TOÀN] Finalize channel report, TVC, and slides`
   Checklist: source-level channel charts; creative examples; final TVC; visual consistency; captions/credits; remove unsupported claims and personal data.
   Done when: OC2 and media assets are ready for final rehearsal.

W14 — FINAL SUBMISSION
1. `[W14][ALL][VIỆT] Submit and defend the final package`
   Checklist: final rubric audit; submit report/slides/demo/TVC/evidence links; archive receipt; lead rehearsal/presentation; record assessor feedback.
   Done when: submission receipt and immutable final index are stored.
2. `[W14][ALL][HƯNG] Verify technical numbers and answer OCR questions`
   Checklist: recheck every OCR/analytics number; confirm version/denominator; prepare limitations and fallback answers; retain reproducibility files.
   Done when: technical claims match the frozen appendix exactly.
3. `[W14][ALL][HUY] Secure and archive operational evidence`
   Checklist: final backup; access review; revoke temporary shares; verify redacted financial links; preserve audit records; support submission day.
   Done when: evidence remains available to authorized reviewers without exposing sensitive data.
4. `[W14][ALL][KHAI] Support final demo and release fallback`
   Checklist: final smoke test; prepare installed device/video/APK fallback; verify network and accounts; support technical Q&A; archive build identifiers.
   Done when: the team can demonstrate the submitted release despite a network/device failure.
5. `[W14][ALL][TOÀN] Perform final media and presentation QA`
   Checklist: validate TVC/demo playback; check fonts/audio/captions; verify slides and links; export backup formats; archive final assets.
   Done when: every media asset opens correctly from the final evidence index.

EVIDENCE INDEX
Create these cards in `99 — EVIDENCE INDEX`: `[OC1] Final evidence`, `[OC2] Final evidence`, `[OC3] Final evidence`, and `[FINAL] Submission receipts and immutable links`. Do not attach raw health reports, tokens, passwords, private signed URLs, unredacted identities, or full banking records.

FINAL VERIFICATION AND REPORT
After changes, verify that:
- W04 through W14 each contains exactly five member cards plus one lecturer-review card, excluding preserved legacy cards that are clearly labeled.
- Every planned card has one correct owner or an explicit invite blocker, one reviewer, one status label, one outcome label, checklist, dependency, done condition, and evidence section.
- Existing history was preserved and no duplicate exact-title cards exist.
- Current cards link Issues #2–#5 correctly; future engineering cards do not contain invented issue numbers.
- No future card is marked DONE without evidence.

Then report: selected board, lists created/reused, cards created/reused, cards migrated, lists archived, missing members, missing dates, blockers, and any action you could not complete. Do not send Discord messages or modify GitHub.
```
