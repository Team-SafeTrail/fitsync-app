# Recording shot list

Source: [primary Vietnamese script](../VIDEO_WALKTHROUGH_SCRIPT_VI.md). Frame: 1920×1080, 100% zoom. All account sessions are prepared off-camera. Every application action runs against the real server; no response interception or fixture replacement.

Delivered 2026-10-25: **03:55 working-flow visual preview**. Use [the current timing/narration map](voiceover-timeline-current.md). Original planned shots below remain the final-submission reference; current section 07 shows actual PT check-in review/session update for 25 s, and section 08 shows actual ordinary-PT denial/logout for 15 s. Admin portal and aged-warning footage were not obtained. Three input segments use their actual original raw take plus separately recorded/persistence-verified results to cut long waiting; their automated error counters remain explicitly unknown, so they cannot pass strict final mode.

| Scene | Route / role | Starting state | Action | Expected result | Duration | Automation / manual |
| --- | --- | --- | --- | --- | ---: | --- |
| 01-landing | `/`, anonymous | Clean fresh context; hero loaded | Read hero, controlled scroll to `#workflow`, linger on product proof | Real landing and verified workflow remain readable | 25 s | Playwright; manual final visual review |
| 02-team | `/`, anonymous | Team section loaded | Scroll five authors, then support/Android section; never click download | Five authors, contact heading and experimental Android direction; limitation label retained | 20 s | Playwright; manual assess copy and privacy masks |
| 03-workspace | `/login` → `/workspace`, PT | Dedicated PT state already prepared | Show empty login page; cut to authenticated context; inspect roster/status/sessions | PT workspace loads with assigned synthetic records | 30 s | Playwright; authentication occurs without recording |
| 04-trainee | `/workspace/trainees/:id`, PT | Linked seeded trainee visible in roster | Click roster record; show connection state and session balance | Real selected trainee opens; no raw invitation token | 27 s | Playwright; seeded opening is allowed by script |
| 05-checkin | `/workspace`, trainee | Linked trainee has no check-in today; locally attested synthetic meal file ready | Type note, choose image via file API, submit, inspect history, reload | Success and meal image persist after reload | 28 s | Playwright; synthetic-only write guard required |
| 06-inbody | `/workspace/trainees/:id`, PT | Same trainee linked; history exists | Show history, enter 72 kg / 32 kg muscle / 14.4 kg fat / 20% / 42 L water; review and explicitly confirm; reload | Manual verified record remains in real history; OCR remains visibly experimental | 33 s | Playwright; no test OCR adapter; synthetic-only write guard required |
| 07-warning | `/workspace` → inactive trainee, PT | Separate seeded trainee has at least 3 full intervening local days without check-in | Open warning; copy prepared message; point at intentional Zalo shortcut | Real warning and copy feedback; no external contact page opened | 17 s | Playwright; no automatic message or Zalo network action |
| 08-admin | `/workspace` → `/login` → `/admin`, PT/admin/PT | Prepared dedicated admin + ordinary PT contexts | Log out recorded PT context; off-camera account cut; show disclosures, KPI/cards/users/transactions; separately open `/admin` as PT | Admin loads; ordinary PT actually redirects to `/workspace` | 43 s | Playwright; inspect role transition and small sample-data labels manually |
| 09-erd-outro | Reviewed local ERD asset, then `/`, anonymous | Toàn PNG ≥2560 px and reviewed view-only source supplied | Full diagram then readable detail crop; end on actual landing | Eight public tables, separate Auth identity and two private buckets; simple close | 32 s | FFmpeg asset insert and real landing capture; manual ERD approval |

## Retakes and preparation

- Use a different run directory for a retake. Preserve raw takes; export only successful manifests.
- Opening a linked seeded trainee is the default, so no invitation needs to be generated during filming. If pending invitation creation must be shown, record separately with the token input redacted before the first frame, and do not click `Mở thử`.
- A check-in can be created only once per Vietnam application date. After a successful take, use its recording; do not clear production records to retake. Select another dedicated synthetic trainee or wait until another application day. The script fails if today is already completed.
- Keep an additional inactive synthetic trainee for scene 07; checking in with it would remove the warning.
- Only seeded, synthetic role accounts may be loaded. Record login without entering credentials, then cut to a prepared state; do not film credential preparation.
- Meal preview stays inline. No new tab, file dialog, signed URL, raw token, local file path, or clipboard contents is shown.
- Do not claim an APK installation or support response promise. The current landing text exceeds verified implementation; retain the limitation callout during this scene.
- Admin data mode must be read from the visible UI. Live counts do not establish live customers or revenue.
