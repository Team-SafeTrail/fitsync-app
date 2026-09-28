# FitSync EXE202 delivery plan

## Goal

Finish the course with truthful, reviewable evidence while preserving the verified FitSync product sequence. The team is in Week 4. OC1 is assessed during Weeks 5–7, and OC2 plus OC3 are assessed during Weeks 13–14.

Calendar dates have not been supplied. Until the LMS dates are known, every task must use its course week in the title and must not invent a calendar deadline.

## One operating system

| Tool | Authority | Rule |
| --- | --- | --- |
| Trello | Course roadmap, weekly sprint, owner, deadline, and evidence checklist | Every course deliverable has one card and one owner |
| GitHub Issues | Engineering scope, acceptance criteria, dependencies, and code status | Every code branch and pull request links one issue |
| Discord | Announcements, questions, meetings, and daily status | Messages link the Trello card; Discord is not a second backlog |
| Repository docs | Product scope, architecture, security, and verified capability status | Course pressure cannot bypass these constraints |

## Coverage audit

The distribution now covers the work needed to turn the verified M3 baseline into a course-complete project. This means the **plan is fully assigned**; it does not mean the remaining product is already implemented.

| Remaining workstream | Accountable owner | Supporting owner | Scheduled |
| --- | --- | --- | --- |
| Weekly planning, scope, evidence, and submissions | Việt | All members | Weeks 4–14 |
| OCR corpus, ground truth, provider benchmark, and measured report | Hưng | Việt | Weeks 4–7, 10–13 monitoring |
| OCR schema, private media, provider adapter, RLS, and operations | Huy | Hưng | Weeks 4–7 |
| OCR review UX, responsive verification, Android packaging, and Play evidence | Khai | Huy | Weeks 4–7 |
| Product/UI review, store assets, and truthful product copy | Toàn | Khai | Weeks 4–7 |
| Remaining MVP gaps: password reset; roster edit/archive/search/filter; biometric trends | Huy and Khai | Việt | Weeks 8–9 |
| Consent, support, deletion, production readiness, and privacy-safe analytics | Việt and Huy | Hưng | Weeks 8–10 |
| Two measured acquisition channels and their creative assets | Toàn | Việt | Weeks 8–13 |
| Paid-pilot terms, payment evidence, entitlement, and reconciliation | Huy and Việt | Khai | Weeks 11–13 |
| Demo, TVC, final report, presentation, redaction, and evidence archive | Việt | Hưng, Khai, Huy, Toàn | Weeks 12–14 |

Detailed member cards and checklists are in [`trello-weekly-refresh-prompt.md`](trello-weekly-refresh-prompt.md). Each member owns at least one verifiable card every week. The weekly review card records planned work, completed work, carry-over, blockers, and evidence for the lecturer.

## Delivery roadmap

| Deadline | Outcome | Lead | Exit evidence |
| --- | --- | --- | --- |
| End of Week 4 | Create the Trello board, freeze the OC1 scope, and start M4 OCR lanes | Việt | Board screenshot; owners and checklists assigned; GitHub issues #2–#5 linked |
| End of Week 5 | Integrate OCR drafts behind mandatory PT review and choose the Android packaging path from measured constraints | Hưng, Huy, Khai | Reproducible benchmark; private storage/RLS checks; browser flow; written packaging decision |
| End of Week 6 | Produce the OC1 release candidate and evidence rehearsal | Khai, Huy | Deploy smoke test; signed Android candidate or documented APK fallback; test report; rehearsal recording |
| End of Week 7 | Freeze and submit OC1 | Việt | Deployment/install proof, working MVP demo, Trello history, Git history, final OC1 evidence index |
| End of Week 8 | Define the safe pilot and measurement model | Việt, Huy | Consent/support/deletion owners; event dictionary; two approved channel experiments |
| End of Week 9 | Implement only the approved M5 funnel measurements and prepare channel assets | Huy, Toàn | Tested events without health data; UTM links; approved copy and visual assets |
| End of Week 10 | Launch the two measured channels | Toàn, Việt | Dated direct-gym and online-channel activity; source-level visits, signups, activations, and installs |
| End of Week 11 | Open the paid pilot using the approved M6 reconciliation flow | Huy, Việt | Tested payment evidence workflow; unique account and transaction reconciliation; redaction procedure |
| End of Week 12 | Run pilots, resolve conversion blockers, and complete media drafts | All | Consented feedback; verified usage; draft 3–5 minute demo and 60–90 second TVC |
| End of Week 13 | Freeze OC2/OC3 data and rehearse the defense | Hưng, Việt, Toàn | Dated analytics exports; OCR report; paid-user count with valid evidence; complete report and slides |
| End of Week 14 | Submit OC2 and OC3 and archive the evidence | Việt | Final report, demo, TVC, presentation, redacted evidence archive, and board export |

## Current Week 4 sprint

| Trello card | Owner | GitHub link | Done this week when |
| --- | --- | --- | --- |
| `[W4][OC1] Freeze scope and operate the course board` | Việt | This plan | Each member owns a card; exact LMS dates are copied into Trello; OC1 evidence checklist and Week 5 review are scheduled |
| `[W4][OC1] Benchmark InBody 270 OCR candidates` | Hưng with Việt | [Issue #2](https://github.com/Team-SafeTrail/fitsync-app/issues/2) | Synthetic-first corpus and ground truth are ready; two candidates and safety gates are defined |
| `[W4][OC1] Add private OCR attempts, storage, and RLS` | Huy | [Issue #3](https://github.com/Team-SafeTrail/fitsync-app/issues/3) | Migration/server boundary is implemented with cross-tenant denial tests and generated types |
| `[W4][OC1] Build OCR review UI and decide Android packaging` | Khai | [Issue #4](https://github.com/Team-SafeTrail/fitsync-app/issues/4) | Review states work responsively; packaging recommendation covers auth, upload, Play policy, build, and release |
| `[W4][OC1] Review UI and prepare evidence assets` | Toàn | [Issue #5](https://github.com/Team-SafeTrail/fitsync-app/issues/5) | OCR states and screenshot checklist are reviewed using synthetic data; GitHub handoff waits for his account |
| `[W4][OC1] Close sprint and index evidence` | All; Việt accountable | Trello card links the relevant issues/PRs | Each card has evidence or a named blocker; unfinished work is rescheduled explicitly |

The lanes can begin in parallel, but the final OCR provider decision depends on Issue #2, integration depends on Issue #3, and the complete browser demonstration depends on Issues #3 and #4. Manual InBody entry remains the release fallback.

## Trello setup for weekly lecturer review

Refresh the existing board rather than deleting it. Preserve cards, comments, attachments, and history; archive obsolete empty lists only after useful cards have been migrated.

Use these lists:

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

Cards stay in their week list so the lecturer can inspect the original plan and final result together. Use status labels `NOT STARTED`, `IN PROGRESS`, `IN REVIEW`, `BLOCKED`, and `DONE`, plus `OC1`, `OC2`, `OC3`, `ENGINEERING`, `MARKETING`, `EVIDENCE`, and `PRIVACY`. Never represent status by moving a card into a different week.

Name member cards `[W##][OC#][NAME] Outcome`. Every card has one accountable member, course-week deadline, checklist, dependencies, GitHub issue when code is ready, reviewer, and evidence link. Add one `[W##][REVIEW] Lecturer progress report` card per week, owned by Việt, with planned/completed/carry-over/blockers/evidence fields. Add actual Trello due dates only after copying official LMS dates.

A card reaches `DONE` only when its checklist passes and its evidence is linked. A merged pull request alone does not prove a course outcome. Use the [paste-ready Trello prompt](trello-weekly-refresh-prompt.md) to perform the refresh through the user's Trello-connected ChatGPT.

## Discord routing

- `#announcement`: Việt posts deadline changes, sprint starts, and submission freezes.
- `#rules-policy`: pin the Trello/GitHub/Discord authority rules and data-safety policy.
- `#master-links`: pin the Trello board, GitHub repository, deployed environments, Figma, and LMS links.
- `#notes-resources`: research notes and non-sensitive course references.
- `#meeting-minutes`: decision, owner, deadline, and link to the changed Trello card after every meeting.
- `#sprint-discuss`: blockers, integration coordination, and daily status. Use the existing AI Laboratory channel for detailed OCR discussion; if it has no suitable channel, keep it here.
- `#market-research` and `#customer-survey`: consented research and aggregate findings only.
- `#pitchdeck-content`, `#branding-pitchdeck`, `#ui-ux-app`, `#moodboard-inspo`, and `#assets-export`: Toàn and Khai coordinate reviewed presentation and store assets.

Copy this single Vietnamese announcement into `#announcement` after the Trello cards exist. Select each teammate from Discord autocomplete so the `@name` text becomes a real mention. The message is verified below Discord's 2,000-character limit.

```text
## 📣 FITSYNC — KẾ HOẠCH TUẦN 4 → 14

@2uoc_vi3t @hei.isme @nottooamaz1ng @_huymc @letoan8423: từ hôm nay Trello là bảng tiến độ chính để giảng viên kiểm tra theo từng tuần; GitHub Issue/PR quản lý phần code; Discord dùng để trao đổi và báo cáo. Mỗi task phải có 1 người chịu trách nhiệm, deadline theo tuần, checklist, reviewer và link minh chứng. Chưa có minh chứng thì chưa được đánh dấu DONE.

**🎯 Mốc môn học:** OC1 trong tuần 5–7; OC2 + OC3 trong tuần 13–14.

**TUẦN 4 — Khởi động M4/OC1**
- @2uoc_vi3t **(Việt):** hoàn thiện board, ngày LMS, phạm vi OC1, checklist minh chứng; hỗ trợ quyết định OCR `#2`.
- @hei.isme **(Hưng):** corpus synthetic-first, ground truth, benchmark ≥2 OCR candidates và safety gates `#2`.
- @_huymc **(Huy):** schema OCR attempts, private storage, RLS, server boundary và tests `#3`.
- @nottooamaz1ng **(Khai):** UX upload/sửa/xác nhận/fallback + đánh giá hướng đóng gói Android/Play `#4`.
- @letoan8423 **(Toàn):** review UI/copy, checklist screenshot và store/marketing assets bằng dữ liệu giả `#5`.

**Các mốc tiếp theo**
- **Tuần 5:** tích hợp và kiểm thử M4.
- **Tuần 6:** release candidate, deploy, Android/Play hoặc APK fallback, rehearsal.
- **Tuần 7:** đóng băng và nộp OC1.
- **Tuần 8–9:** pilot an toàn, password reset, roster edit/archive/search/filter, biểu đồ tiến độ và analytics không chứa dữ liệu sức khỏe.
- **Tuần 10:** chạy 2 kênh có UTM và số liệu thật.
- **Tuần 11–12:** paid pilot, VietQR/evidence, đối soát, feedback, Demo 3–5 phút và TVC 60–90 giây.
- **Tuần 13–14:** khóa số liệu OC2/OC3, báo cáo, slide, bảo vệ và lưu evidence đã che dữ liệu nhạy cảm.

**Báo cáo mỗi ngày tại #sprint-discuss:** `[Tên] [link Trello] | Đã làm | Tiếp theo | Blocker`
Không tự nhận feature, user, traffic, accuracy hay doanh thu là **“đã đạt”** nếu chưa đo và kiểm chứng.
```

Use this daily update in `#sprint-discuss`:

```text
[Name] [Trello card link]
Done: verifiable result or evidence link
Next: one concrete action
Blocked: dependency and owner, or "None"
```

## Evidence and safety gates

- Mark every claim as `planned`, `implemented`, `verified`, or `released`; only the last two can be presented as working evidence.
- OCR accuracy, latency, conversion, installs, users, and revenue require dated measurements with denominators.
- Do not process real health reports until consent, access, retention, deletion, incident response, and provider-processing owners are recorded.
- Do not fabricate users, traffic, transactions, reviews, screenshots, or analytics. Redact personal and banking information in course submissions.
- Do not start analytics or payment implementation ahead of the relevant product milestone merely to make a Trello card look active. Android implementation begins only after the packaging decision is approved; do not commit an empty mobile scaffold.

## Done when

- OC1 has installation/deployment proof, an executable MVP demonstration, a test report, and Trello/GitHub history.
- OC2 has two real channels with source-level visits, signups, activations, and install evidence.
- OC3 has the rubric-required number of unique paid accounts, reconciled real transactions, consented product evidence, the final report, demo, and TVC.
- The final submission contains no unsupported product claim or exposed personal, health, credential, or banking data.
