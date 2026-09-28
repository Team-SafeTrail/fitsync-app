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

## Trello setup

Create one board named `FitSync — EXE202 Delivery` with these lists:

1. `Course Backlog`
2. `Ready This Week`
3. `In Progress`
4. `Review / Verification`
5. `Blocked`
6. `Done`
7. `Evidence Index`

Use labels `OC1`, `OC2`, `OC3`, `Engineering`, `Product`, `Marketing`, `Evidence`, and `Privacy`. Name cards `[W#][OC#] Verb + outcome`. Every card must contain one accountable owner, course-week deadline, linked GitHub issue when code is involved, dependencies, acceptance criteria, evidence link, and reviewer. Add actual Trello due dates only after copying the official LMS calendar dates.

A card reaches `Done` only when its acceptance criteria pass and its evidence link is present. A merged pull request alone does not prove a course outcome; move the card to `Evidence Index` only after the corresponding screenshot, export, install proof, report, or transaction evidence is safely archived.

## Discord routing

- `#announcement`: Việt posts deadline changes, sprint starts, and submission freezes.
- `#rules-policy`: pin the Trello/GitHub/Discord authority rules and data-safety policy.
- `#master-links`: pin the Trello board, GitHub repository, deployed environments, Figma, and LMS links.
- `#notes-resources`: research notes and non-sensitive course references.
- `#meeting-minutes`: decision, owner, deadline, and link to the changed Trello card after every meeting.
- `#sprint-discuss`: blockers, integration coordination, and daily status. Use the existing AI Laboratory channel for detailed OCR discussion; if it has no suitable channel, keep it here.
- `#market-research` and `#customer-survey`: consented research and aggregate findings only.
- `#pitchdeck-content`, `#branding-pitchdeck`, `#ui-ux-app`, `#moodboard-inspo`, and `#assets-export`: Toàn and Khai coordinate reviewed presentation and store assets.

Copy this Week 4 announcement into `#announcement` after the Trello cards exist:

```text
FitSync — WEEK 4 SPRINT
Goal: prepare the verified M4/OC1 release path. OC1 window: Weeks 5–7. OC2/OC3 window: Weeks 13–14.

Việt: operate Trello, freeze OC1 evidence, support OCR decision — Issue #2
Hưng: synthetic-first OCR benchmark and ground truth — Issue #2
Huy: private OCR attempts, storage, RLS, server boundary — Issue #3
Khai: OCR review UI and Android packaging decision — Issue #4
Toàn: UI review and truthful evidence/store asset checklist — Issue #5

Trello is the course board. GitHub Issues define code. Discord is for coordination.
Post status in #sprint-discuss and always link the Trello card. Never report a target as a completed result.
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
