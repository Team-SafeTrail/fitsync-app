# FitSync video pipeline

Current delivered edit: **03:55 visual preview**, real production PT/trainee workflow, with the full ERD contained inside safe margins and detail insets. Output: `outputs/video/production-draft-02/FitSync-Product-Walkthrough-visual.mp4`. Use [voiceover-timeline-current.md](voiceover-timeline-current.md) with this file. Admin portal footage and an aged inactivity-warning fixture remain unavailable; actual ordinary-PT denial and activity/session review are shown instead. This does not satisfy the original final-submission gates. Generated meal asset/tool/prompt details are in [synthetic-asset-provenance.md](synthetic-asset-provenance.md).

For microphone recording with Vietnamese scrolling text, playback, gentle noise reduction and quiet background music, use the local [voice studio guide](README-voice-studio-VI.md). The complete spoken script is [VOICEOVER_READ_VI.md](VOICEOVER_READ_VI.md). Start `scripts/video/studio/start-studio.ps1`, then open `http://127.0.0.1:3117`. Presenter audio is captured only when the user presses Record and grants microphone permission; no narration is synthesized.

Read [video-plan.md](video-plan.md), [feature-readiness-check.md](feature-readiness-check.md), [recording-shot-list.md](recording-shot-list.md), [voiceover-timeline.md](voiceover-timeline.md) and the [primary script](../VIDEO_WALKTHROUGH_SCRIPT_VI.md) before filming. Actual checks and deliverables are in [execution-report.md](execution-report.md).

This is a real browser recording pipeline with independent scenes and a silent visual edit. It does not generate narration, invent product UI, bypass authentication, fake OCR, install Brag, or publish anything.

## Dependencies and private input

Use Node 22+, repository dependencies (`npm ci`), Playwright Chromium (`npx playwright install chromium`), and FFmpeg/FFprobe with H.264/drawtext support. `VIDEO_CHROME_PATH` can select an installed browser. FFmpeg and FFprobe can be on PATH, or use absolute executable paths in `FFMPEG` / `FFPROBE`. `VIDEO_FONT_FILE` optionally chooses a Unicode font; default is Arial on Windows, DejaVu Sans on Linux.

The existing portable runtime used in this workspace is under `D:/CodexArtifacts/fitsync-video-tools`. It is reused rather than installed into the app. In PowerShell:

```powershell
$videoTools = 'D:/CodexArtifacts/fitsync-video-tools'
$env:Path = "$videoTools/node-v22.22.0-win-x64;" + $env:Path
$env:FFMPEG = "$videoTools/runtime/node_modules/ffmpeg-static/ffmpeg.exe"
$env:FFPROBE = "$videoTools/runtime/node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe"
$env:VIDEO_BASE_URL = 'https://fitsync-app-one.vercel.app'
```

Store demo credentials **locally and ignored**, under `.video-private/.env.auth.local`. Required variable **names**: `VIDEO_PT_EMAIL`, `VIDEO_PT_PASSWORD`, `VIDEO_TRAINEE_EMAIL`, `VIDEO_TRAINEE_PASSWORD`, `VIDEO_ADMIN_EMAIL`, `VIDEO_ADMIN_PASSWORD`, and `VIDEO_SYNTHETIC_CONFIRM` (set the attestation to `synthetic-only` only for dedicated synthetic demo accounts). Never put actual credentials in this README, Git, terminal command arguments, shared screenshots, or chat. The locally prepared admin-only file is separate and is never a deliverable.

Additional scene input variable names:

- `VIDEO_TRAINEE_ID`: UUID of the linked synthetic trainee assigned to the dedicated PT.
- `VIDEO_WARNING_TRAINEE_ID`: a different inactive synthetic trainee assigned to the same PT.
- `VIDEO_MEAL_IMAGE`: local synthetic JPEG/PNG/WebP path, ≤5 MiB, content matching its MIME type. Do not reuse private health/customer imagery.
- `VIDEO_ALLOW_DEMO_WRITES`: `synthetic-only`, required only for real check-in/InBody writes. These writes persist. Nothing deletes or resets demo data.
- `VIDEO_ERD_IMAGE`: Toàn's actual local PNG/JPG asset; `VIDEO_ERD_CROP`: readable detail region in source pixels as `width,height,x,y`.
- `VIDEO_ERD_REVIEWED`: `true` only after review; final asset width ≥2560 px per Toàn's design brief. A lower-resolution supplied image can be used with `--asset-draft`, visibly as a draft.
- `VIDEO_PRIVATE_DIR`: optional private session directory; default `.video-private/`. Keep it outside deliverable shares and restrict access using workstation permissions.

Do not use any account or dataset whose synthetic status is uncertain. Prepare the seed using the existing guarded OC2 runbook only after its environment and authorization are clear; this tool never runs production seeding or resets passwords.

## Prepare authentication off-camera

```powershell
node --env-file=.video-private/.env.auth.local scripts/video/prepare-auth.mjs --role pt
node --env-file=.video-private/.env.auth.local scripts/video/prepare-auth.mjs --role trainee
node --env-file=.video-private/.env.auth.local scripts/video/prepare-auth.mjs --role admin
```

This uses a fresh browser without video, screenshots, HAR or traces; it verifies the role, writes ignored storage state, and prints no credential. Subsequent capture restores that dedicated state without password entry. Refresh expired sessions off-camera. Auth state is sensitive; never commit or share it, even if its filename ends in JSON. Browser automation errors are intentionally sanitized rather than dumping page URLs/provider values.

## Preflight and modular recording

Run commands from the repository root. Pick a new ignored run directory for retakes; successful scenes/takes are never silently overwritten.

```powershell
$env:VIDEO_RUN_DIR = 'outputs/video/production-draft-01'
node scripts/video/preflight.mjs
node scripts/video/capture.mjs --list
node scripts/video/capture.mjs --scene 01-landing
node scripts/video/capture.mjs --scene 02-team
node --env-file=.video-private/.env.auth.local scripts/video/capture.mjs --scene 03-workspace
node --env-file=.video-private/.env.auth.local scripts/video/capture.mjs --scene 04-trainee
node --env-file=.video-private/.env.auth.local scripts/video/capture.mjs --scene 05-checkin
node --env-file=.video-private/.env.auth.local scripts/video/capture.mjs --scene 06-inbody
node --env-file=.video-private/.env.auth.local scripts/video/capture.mjs --scene 07-warning
node --env-file=.video-private/.env.auth.local scripts/video/capture.mjs --scene 08-admin
node scripts/video/capture.mjs --scene 09-erd-outro
```

`--headed` opens a fresh, dedicated browser if you prefer observing a take. The page is recorded at native 1080p and zoom 100%; no personal browser profile is attached. The cursor follows actual mouse events. Privacy masks hide invitation token input and non-demo contact email/phone text before recorded interaction. Inspect the resulting footage: these masks are assistance, not proof that every possible secret is covered.

The 03-workspace scene cuts from an empty login page to a genuinely authenticated workspace. The full 08-admin scene records actual PT logout, then separately uses the prepared admin state, then an actual PT access-denied redirect. The clipboard and Zalo destination are never opened. Check-in rejects a trainee already completed today. InBody requires real server/database persistence and confirmation. Slow scenes fail rather than being sped up.

The off-camera magenta synchronization slate is removed by analyzing the actual encoded frames. Raw successful clips are in `raw/`, their trim/provenance/check results in `takes/`, and scene composition in `scenes/`. Failed/scratch captures stay in `.video-private/takes/` and are not renderable. No private scratch belongs in a handoff package.

## Draft render

Render only scenes actually captured, without filling missing sections:

```powershell
node scripts/video/render.mjs --draft --scenes 01-landing,02-team
```

Output: `outputs/video/<run>/FitSync-Product-Walkthrough-DRAFT.mp4`, with a small continuous draft/status label, an explicit count of included scenes, `render-report.json`, a poster and 1 fps overview sheets under `qa/`. It is not a 4:15 submission. Add `--check-only` to validate inputs without encoding.

If only the dedicated admin account is available, `capture.mjs --scene 08-admin --admin-only` captures a 30-second portal excerpt and records the missing PT logout/non-admin check. It cannot be passed off as the complete 43-second admin sequence. For the supplied smaller ERD use `capture.mjs --scene 09-erd-outro --asset-draft`; it cannot pass the complete-production gate. Include those IDs in the draft render only after their manifests exist.

## Complete visual export

For the current working-flow preview, after capturing all sections and the explicitly documented 07/08 variants, use `node scripts/video/render.mjs --workflow-preview`. It exports `FitSync-Product-Walkthrough-visual.mp4` with `kind: workflow-visual-preview` and `submissionReady: false`. It validates the complete preview timeline (225–285 seconds), provenance and real clips without asserting final-submission evidence. The original `--complete` mode below remains stricter and rejects the preview variants.

Current 07 uses `capture.mjs --scene 07-warning --workflow-preview`; current 08 uses `capture.mjs --scene 08-admin --workflow-preview`. The recording used a fresh synthetic PT registered through the real app, one trainee accepted through a real invitation, and one pending trainee. Existing accounts/roles/passwords were not changed. Three segments were recovered from their actual raw takes after upload/SSR waits exceeded automation slots; their browser counters remain `null`, and separate frame/decode/persistence receipts are required. Only preview modes accept those reviewed recoveries; complete-production mode still rejects them.

After all nine scenes pass on the same production origin/SHA, prepare an ignored `.video-private/recording-evidence.json` from **actual** receipts. It must contain `productionOrigin`, `productionCommit`, booleans `independentReviewVerified`, `pr28ReplacementAccepted`, `deployedCodeVerified`, `fiveMigrationsVerified`, `syntheticSeedVerified`, `dedicatedSessionsVerified`, `adminAndNonAdminVerified`, `rawTakesPrivacyReviewed`, `erdViewOnlyVerified`, and `erdViewOnlyUrl`. Each gate also needs a non-secret reference: `reviewReceipt`, `deploymentReceipt`, `migrationReceipt`, `seedReceipt`, `authorizationReceipt`, `rawReviewReceipt`. A boolean attestation is not substitute evidence; references should lead a reviewer to the checked receipt. Do not set a gate to true because older documentation reports it.

```powershell
node scripts/video/render.mjs --complete --evidence .video-private/recording-evidence.json
```

The renderer checks every take, rejects partial/local/mixed-revision footage, and rechecks production HTTP 200 in a fresh private context. Output: `FitSync-Product-Walkthrough-visual.mp4`, exactly 255 seconds, silent, H.264/yuv420p/30 fps with fast start. It preserves timing and adds small chapter labels. The architecture section uses the actual reviewed ERD with overview then a readable chosen crop; no conflicting ERD is generated.

Watch the **entire** video at normal speed. Check readability, cursor, role changes, claims, loading, data status, every privacy item in the primary script, and the ERD crop. Full FFmpeg decode plus sampled QA sheets is automated technical QA, not a replacement for this full viewing. `submissionReady` remains false until that external review is done. Never manually rename a partial draft to the complete visual filename.

`node scripts/video/review.mjs` performs a complete normal-speed Chromium playback from beginning to end and writes `qa/browser-playback.json`; it does not attest human acceptance. It serves only the chosen video on a temporary loopback port, then closes that server. For direct viewing, open the MP4 in your video player.

## Add presenter voice later

Record the nine original Vietnamese paragraphs with your own voice as WAV files named after scene IDs. Preserve breaths and natural speech. Put them in a private local directory. No voice file is needed for the visual-only export.

After watching the complete visual, create an ignored review JSON with `file` equal to the visual filename, `fullVideoWatched`, `privacyPassed`, `claimsPassed`, `humanVoiceRecorded` all true only when actually checked, plus `reviewer` and `reviewedAt`.

```powershell
node scripts/video/narrate.mjs --voiceover-dir .video-private/voiceover --review .video-private/visual-review.json
```

For the current 03:55 visual, use `--workflow-preview` as well. It follows the actual per-section durations in the render report and writes `FitSync-Product-Walkthrough-narrated-preview.mp4`, preserving the preview status. It cannot create a file named FINAL from this material. Use the two revised narration paragraphs and closing correction in voiceover-timeline-current.md.

Output: `FitSync-Product-Walkthrough-FINAL.mp4`. Human sections are padded with silence only, never sped up, pitch-shifted, compressed or truncated. Overlong speech fails with a timing message; revise the visual timing explicitly before continuing. No music is mixed. Watch the whole narrated result again before submission; the tool never uploads or marks acceptance complete.

## Verification and sharing

```powershell
node --test scripts/video/gates.test.mjs
npm run test
npm run lint
npm run typecheck
npm run build
```

Build/check execution details and limitations belong in execution-report.md. Do not run a production build into the same `.next` directory while an existing development server is using it; use an isolated copy or stop only a server you started.

Share the MP4, planning documents, scripts and redacted execution report only. Exclude `.video-private/`, environment files, authentication states, raw scratch and local evidence receipts containing private references. No GitHub push, deployment, upload, publication or message is automatically performed by this pipeline.
