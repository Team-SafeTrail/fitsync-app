# FitSync — Agent handoff and EXE201 evidence

Read [AGENTS.md](../../AGENTS.md), the [team playbook](../TEAM_PLAYBOOK.md), and the applicable project skills before editing. Use the [Vietnamese handoff](TEAM_HANDOFF_2026-11-25_VI.md) for the human-facing summary. Check the issue and candidate revision before relying on the dated evidence below.

## Ownership and delivery order

- **Huy (`huydqse180459-art`) owns frontend.** He reviews the current web UI, coordinates preview and approved UI deployment, and handles the Android client side of U-01.
- **Khai (`DiepKhai`) owns backend.** He prepares local Supabase and a linked synthetic PT/trainee pair, checks the check-in RPC and access, and reviews environment, migrations, RLS and release flags. Huy and Khai jointly verify Android submission and PT web readback.
- **Việt (`Am2uocVi3t`) starts the slide update after Huy and Khai finish engineering handoff and post evidence and release status.** The owner decides whether any remaining open item can appear with a pending label.
- GitHub issues and linked PRs track owners, scope, dependencies, acceptance and evidence. Reuse matching issues and respect blockers. Post the links in Discord once routing is ready. Keep environment values and demo credentials local.
- An independent Claude preflight can check ownership, source links, pricing claims and deployment versus test status. Human owners confirm issue acceptance and release.

## Facts to preserve

| ID | Claim and status | Evidence |
| --- | --- | --- |
| E01 | FitSync consolidates the PT workflow currently fragmented across spreadsheets, paper and personal chat. The target buyer is a PT or independent coach. The trainee is also a user. | [Product decisions](../PRODUCT_DECISIONS.md), [customer insights](../../reports/CUSTOMER_INSIGHTS.md) |
| E02 | Web candidate supports PT signup and invites, trainee home, check-in, measurements and progress, private notes/chat, shared scheduling, membership dates and a separate session ledger. Booking and check-in never consume sessions automatically. | [PR #48](https://github.com/Team-SafeTrail/fitsync-app/pull/48), [demo workflow](../DEMO_WORKFLOW.md) |
| E03 | On 25 November, PR #48 was open and draft at `4257334`, with successful web quality, synthetic database/coaching and legacy upgrade checks. Its tested design is the latest confirmed candidate for this handoff. Production rollout of that UI is unverified. Use the old Vercel URL only if visibly labelled legacy. | [PR #48](https://github.com/Team-SafeTrail/fitsync-app/pull/48), [test evidence](../TEST_EVIDENCE.md) |
| E04 | At web revision `0ba9821`, evidence records 114 domain tests, 363 SQL/RLS assertions each for fresh and upgrade runs, 28 core browser flows and 4 demo browser flows. On 22 November Windows local demo passed 4/4. U-00 independently exercised six local web stages at `4257334`, including saved check-in/manual intake and access denial for an unrelated PT. Scope each count to its test layer and revision. | [Test evidence](../TEST_EVIDENCE.md), [local verdict](../evidence/exe201-2026-11-22/local-demo-verification.json) |
| E05 | Android U-01 prototype is local at `feat/android-u01-local` / `9ad9e64`. Mobile typecheck and 27 tests passed. The x86_64 debug APK installed and reached the configuration screen on an Android 35 emulator. An ARM64 debug APK was built and signature-verified. Emulator sign-in, check-in submission and PT web readback remain pending local client configuration. The owner recorded that the full web product is accepted for the submission's platform requirement. | [Android ADR](../architecture/adr-003-android-packaging-path.md), [mobile runbook](../../mobile/README.md), [product decisions](../PRODUCT_DECISIONS.md) |
| E06 | Approved course offer dated 17 November. PT is the payer and trainees participate at no separate charge. Free allows three unarchived records, including pending invites. Pro is VND 199,000 per PT per month and has no roster cap while active. Both share coaching features. Pro expiry preserves history and applies Free limits to new/restored records. Manual transfer reconciliation is planned, with upgrade requests only until receiving details are supplied. | [Product decisions](../PRODUCT_DECISIONS.md), [financial report](../../reports/FINANCIAL_REPORT.md) |
| E07 | Reported actuals are **0 paying customers out of 20 required and VND 0 real revenue**. Synthetic scenario only: VND 3,980,000 receipts, VND 3,339,800 costs and VND 640,200 difference. The scenario contains 20 TEST receipts, two TEST expenses and 29 synthetic accounts across roles. | [Financial report](../../reports/FINANCIAL_REPORT.md), [final readiness](../../reports/FINAL_REPORT_READINESS.md) |
| E08 | Manual measurements with PT confirmation have runtime evidence. Multi-brand full-report OCR, segment-level muscle/fat intake, voice-to-form, meal-photo calorie estimates, richer engagement, and trainee retention after the PT relationship are future work. Tiered plans and VND 299,000 are research options. The owner recorded a course-focused delivery and a stop to business activity after the course. | [Product decisions](../PRODUCT_DECISIONS.md), [business model review](../plans/BUSINESS_MODEL_REVIEW.md), [team handoff](TEAM_HANDOFF_2026-11-25_VI.md) |

## Slide order

1. **Title and target user.** Give one sentence on whom FitSync serves and the academic context.
2. **Problem and mentor input.** Describe the manual workflow and fragmented follow-up. Label interview feedback as qualitative.
3. **Product flow.** PT creates trainee and invites them. Trainee accepts, checks in and sees progress. PT reviews and confirms measurements. Show where schedule and session ledger fit.
4. **Actual interface.** Use one PT dossier and one trainee screen from the candidate evidence. Use the screenshots’ real labels and scope.
5. **Engineering verification.** Cite web candidate SHA and the dated CI/local evidence. Optionally add a single Android prototype line with the pending check.
6. **Offer and controls.** State Free 3 and Pro VND 199,000 with payer, record scope and expiry behavior. Keep study alternatives in the roadmap or speaker notes.
7. **Actuals and financial scenario.** Put actuals and scenario in separate columns with explicit labels. Avoid extrapolating synthetic accounts, signup counts, demo ledger or WTP interviews into traction.
8. **EXE201 status and delivery.** Cite the existing W8/W9 and final documents. Leave submission receipt, mentor attendance, customer evidence and other gaps at their observed status. End with the current local demo source and pending production URL confirmation.

## Source pack

- [Existing slide outline](../../presentations/SLIDE_OUTLINE.md), [script](../../presentations/WEEK_08_09_SCRIPT.md), [Canva delivery and PDF source](../../presentations/CANVA_DELIVERY.md), [PDF](../../presentations/FitSync_Week_08_09.pdf).
- [Submission index](../../reports/SUBMISSION_READY_2026-11-22.md), [delivery index](../../project-management/FINAL_DELIVERY.md), [gap analysis](../../project-management/EXE201_GAP_ANALYSIS.md), [mentor evidence](../../reports/MENTORING_EVIDENCE.md).
- [Final report PDF](../../reports/FINAL_REPORT_SUBMISSION.pdf), [W8/W9 progress report](../../reports/WEEK_08_09_PROGRESS_REPORT.md), [financial report](../../reports/FINANCIAL_REPORT.md), [financial workbook](https://drive.google.com/file/d/18SJXm70350xOMlOvkuLelAmP6xPavRRd/view?usp=drivesdk).
- [Product review](../../reports/LOCAL_PRODUCT_REVIEW.html), [database review](../../reports/DATABASE_REVIEW.html), [video index](../../presentations/demo-videos/README.md), [receipt for local demo](../evidence/exe201-2026-11-22/local-demo-verification.json).

## Slide-generation instruction for Việt's agent

After Việt confirms engineering evidence is ready, return a Vietnamese storyline, slide titles, up to three short bullets per slide, speaker notes with IDs E01–E08, and an asset pointer per screenshot. Keep the earlier W8/W9 sections where required by the class template. Label unknown dates, financial figures, and production URL as pending when applicable. Use synthetic screenshots approved for the report and keep local environment values, account passwords, and private files out of the slides. Ask Việt to review the draft against the submission index before sharing.
