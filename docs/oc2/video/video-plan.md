# FitSync product walkthrough

Prepared 2026-10-24, updated 2026-10-25 (Asia/Bangkok). Coordination: OC2 Issue #27. Product source revision: `e1b03ad95b4fa5306ec7c2a4d9f5ca443e22cffd`; local `origin/main` matched after fetch. Work branch: `codex/27-product-walkthrough`. The deployed production SHA has not been independently mapped to this source revision.

**Delivered visual edit:** 03:55, real production PT/trainee workflow. Current narration map: [voiceover-timeline-current.md](voiceover-timeline-current.md). The original 04:15 final-submission plan below remains the reference for retaking the unavailable admin/aged-warning sections.

## Objective and audience

Show an instructor a coherent, working PT → trainee → PT → admin workflow. Use the actual application, persisted synthetic records, and deliberate interaction. The primary editorial source is [VIDEO_WALKTHROUGH_SCRIPT_VI.md](../VIDEO_WALKTHROUGH_SCRIPT_VI.md). Its nine sections and original Vietnamese narration govern this edit; the older timing table in DEMO_SUBMISSION_RUNBOOK.md differs and is not used.

## Format

- Target 255 seconds, 1920×1080, 16:9, 30 fps, browser viewport 1920×1080, device scale 1, zoom 100%.
- Page-only capture in a fresh Playwright context; no personal profile, browser chrome, address bar, DevTools, terminal, notifications, or autofill.
- Presenter records Vietnamese narration separately. No generated speech. Visual export has no audio track. Optional music is omitted to leave clean space for narration.
- Restrained cuts, visible mouse-event cursor, amber chapter label, readable pauses. No reconstructed interface, mocked API responses, simulated OCR success, or fixture-backed `/app/*` presented as authenticated product.
- 223 seconds (87.45%) actual product; 28 seconds architecture and 4 seconds real landing outro. Architecture occupies 10.98%, matching the requested approximate balance without adding a promotional intro.

## Story and scene files

| Scene | Timeline | Seconds | Visual |
| --- | --- | ---: | --- |
| 01-landing | 00:00–00:25 | 25 | Hero, problem and verified workflow |
| 02-team | 00:25–00:45 | 20 | Five SafeTrail authors; contact/support and Android direction |
| 03-workspace | 00:45–01:15 | 30 | Clean login page, cut across off-camera authentication, PT roster and sessions |
| 04-trainee | 01:15–01:42 | 27 | Open a seeded linked trainee; show connection/invitation state |
| 05-checkin | 01:42–02:10 | 28 | Trainee note, synthetic meal upload, submit and persisted history |
| 06-inbody | 02:10–02:43 | 33 | History, five manual metrics, explicit confirmation, persisted record |
| 07-warning | 02:43–03:00 | 17 | Separate inactive trainee; copy follow-up, explain intentional Zalo handoff |
| 08-admin | 03:00–03:43 | 43 | PT logout, off-camera admin login, counts/disclosures/tables, non-admin denial |
| 09-erd-outro | 03:43–04:15 | 32 | Reviewed ERD overview/detail, security boundaries, 4-second landing close |

Record independently. Rerun only a failed scene into a new run directory. Every take has a manifest; failed takes stay under private scratch and are not available to the renderer. Loading before the first stable frame is trimmed, and action timing is preserved. An overlong take is rejected rather than accelerated. Retake or explicitly edit a waiting interval.

## Current delivery boundary

The older documented candidate returned HTTP **404**. The user-supplied `https://fitsync-app-one.vercel.app` returned HTTP **200** in a fresh private browser context. Supplied pre-existing demo sign-ins were rejected, but normal registration of a fresh synthetic PT succeeded. One trainee was linked through the real invitation flow and another actual invitation remains pending. Check-in/meal, manual InBody, PT activity review and session updates were recorded against the real deployed application and their persistence checked. Ordinary PT access to `/admin` really redirects to the workspace. Positive admin access and an aged inactivity-warning example are unavailable.

Exported **235 seconds (03:55)** as `FitSync-Product-Walkthrough-visual.mp4`: actual landing/team, authenticated core workflow, PT review/session update, actual non-admin denial/logout, and architecture/outro. Section 07 is 25 seconds of real activity/session review; section 08 is 15 seconds of actual access denial/logout. These substitutions and their revised human narration are explicit in the current timeline. No unavailable admin UI or warning state is simulated. The original 77-second draft is preserved separately.

The supplied 1403×2048 `ERD.jpg` remains completely visible inside a 576×840 overview area, positioned at (120,160) in the 1920×1080 frame. Detail regions stay within a separate 1024×604 inset at (800,240), with stable headings/security notes and margins. No full-bleed diagram crop, enlargement beyond the frame, or replacement ERD. Original final-quality export/view-only evidence remains pending.

The explicit workflow-preview mode can export the working 03:55 visual while retaining `submissionReady: false`. Strict final mode still requires the original scenes, verified production evidence, reviewed ERD, synthetic attestation and full human privacy/visual review, and rejects these preview variants/recovered inputs. Human narration is a later input and is not generated.

## Claims requiring care

See [feature-readiness-check.md](feature-readiness-check.md). Default OCR is deliberately unavailable; use manual entry. Admin detail rows, financial totals, activity/OCR percentages, and VietQR transactions are synthetic even when three count cards use live queries. The APK link and contact promises in the landing are not verified operational capabilities. Public team names are intentional author attribution; account records and health data must be synthetic. Mask non-demo contact email/phone text in capture.

[Brag](https://github.com/latent-spaces/brag) was inspected as the supplied reference. Its short launch-video workflow is not invoked. Playwright and FFmpeg are sufficient for real footage and restrained editing, and require no additional model, voice, music, or rendering service.

New synthetic demo accounts/records were created only through normal production registration/invitation/forms. No existing account/password/role, policy, server validation or migration was changed. No video upload/publication/email/issue comment/deployment occurred. All credential/token preparation happened off-camera and remains in ignored private files.
