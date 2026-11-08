# Human Vietnamese voiceover timeline

Primary text: [VIDEO_WALKTHROUGH_SCRIPT_VI.md](../VIDEO_WALKTHROUGH_SCRIPT_VI.md). Record the nine existing quoted narration paragraphs in your own voice as `01-landing.wav` through `09-erd-outro.wav`. No speech generation. Do not type credentials or expose private account state while making any recording.

| Time | Narration section and cue | UI action | Duration | Edit notes |
| --- | --- | --- | ---: | --- |
| 00:00–00:08 | “Xin chào Thầy…” | Rest on real landing hero | 8 s | Calm opening; no promotional title sequence |
| 00:08–00:17 | FitSync manages trainees, InBody and check-ins | Scroll from hero toward verified workflow | 9 s | Readable, controlled movement |
| 00:17–00:25 | Outcome 2 workflow, permissions and evidence | Hold product proof | 8 s | Leave breath before chapter |
| 00:25–00:35 | Five SafeTrail team members | Team section | 10 s | Public author names are deliberate attribution |
| 00:35–00:45 | Contact, Android direction and experimental APK | Contact/Android headings | 10 s | Small “Android: chưa xác minh bản cài đặt” callout; no install claim |
| 00:45–00:50 | “Sau khi đăng nhập…” | Empty login page | 5 s | No credential entry captured |
| 00:50–01:04 | PT roster, sessions and history | Cut to genuine prepared PT session; inspect roster | 14 s | Honest cut across off-camera login, preserve actual session |
| 01:04–01:15 | Supabase RLS isolates coaches | Assigned trainee/status overview | 11 s | RLS narrative supported by migrations; browser observation alone is not RLS proof |
| 01:15–01:29 | Profile can exist before auth account | Open seeded trainee; show profile/session balance | 14 s | Seeded opening allowed; do not create token unnecessarily |
| 01:29–01:42 | One-time invitation and SHA-256 hash | Hold real linked/pending connection state | 13 s | Never show raw token or invite address |
| 01:42–01:51 | Daily trainee check-in | Trainee home; type optional note | 9 s | Separate role context; no credentials |
| 01:51–02:01 | Synthetic meal image | Select local image, submit | 10 s | Inline image only; privacy + actual result |
| 02:01–02:10 | Private bucket, validation, short-lived access | View persisted history/thumbnail; reload | 9 s | Remove dead loading time if necessary; never accelerate speech |
| 02:10–02:18 | Five InBody measurements | Existing history, then manual form | 8 s | OCR remains experimental |
| 02:18–02:33 | Database bounds and reviewed drafts | Enter values; pause to inspect all five | 15 s | No fake OCR upload/extraction; describe conditional architecture accurately |
| 02:33–02:43 | PT must confirm; manual fallback | Explicit confirmation, save and reload history | 10 s | If save is slow, extend within 3:45–4:45 after a documented edit |
| 02:43–02:52 | Three full calendar days | Separate inactive trainee warning | 9 s | Reference +4 local-date boundary |
| 02:52–03:00 | Intentional contact handoff only | Copy message; point to Zalo shortcut | 8 s | Do not open a real conversation |
| 03:00–03:05 | Authenticated admin-only portal | PT logout → login page, cut across off-camera admin login | 5 s | Never film passwords or auth cookies |
| 03:05–03:16 | Three Supabase counts when configured | Admin disclosure + KPI overview | 11 s | Use observed `live_counts` or synthetic fallback, no universal live claim |
| 03:16–03:27 | Synthetic detail users | Scroll user table, keep disclosure | 11 s | Synthetic labels retained |
| 03:27–03:35 | Sample VietQR; no reconciled revenue | Sample transactions and disclosure | 8 s | Preserve disclaimer even when values look realistic |
| 03:35–03:43 | Ordinary account cannot use `/admin` | Separate PT context attempts route, actually redirects | 8 s | Keep redirect in take; use small route-attempt label, no fake browser chrome |
| 03:43–03:51 | Eight public tables | Reviewed ERD overview | 8 s | `auth.users` is external identity, not ninth public table |
| 03:51–04:04 | Relationships, RLS and two private buckets | Readable ERD detail crop/pan | 13 s | Use Toàn asset; do not create a competing final diagram |
| 04:04–04:11 | Server-only service-role and access boundaries | ERD security detail | 7 s | Never show configuration values |
| 04:11–04:15 | Thanks and independent evidence links | Actual landing close | 4 s | Do not invent URLs or claim an email/upload was sent |

Read each original paragraph at a comfortable pace. If it exceeds its slot, record naturally, then adjust the edit; do not change pitch or speed up audio. `narrate.mjs` rejects overlong takes instead of cutting speech. Re-time the scene duration definitions in `scripts/video/common.mjs`, matching manifests and render/narration duration checks together, and retake/cut dead loading only after reviewing the new timing; preserve the preferred 225–285-second total and source meaning. The supplied unmodified pipeline uses 255 seconds, starts each section file at its scene boundary, mixes no music, normalizes only the output format, and leaves gain/pacing under presenter control.
