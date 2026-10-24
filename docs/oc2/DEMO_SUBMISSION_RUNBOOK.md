# OC2 demo and submission runbook

**Owner:** Việt (`Am2uocVi3t`)

**Target duration:** 04:15

**Required format:** 1920×1080, 16:9, readable cursor and captions
**Truth rule:** say “synthetic demo data” whenever the admin dataset or VietQR scenario is shown.

## Start gate for the final recording

Do not record the final submission until all four conditions are true:

- [ ] PR #26 and PR #28 have completed the required independent review/merge flow.
- [ ] Huy provides a stable Vercel HTTPS URL returning HTTP 200 for the recorded commit.
- [ ] Admin and non-admin Incognito authorization tests pass against Supabase production.
- [ ] Toàn provides the reviewed ERD PNG/PDF link with view-only access.

The narration and a scratch recording may be rehearsed before these gates pass. As of the 2026-10-24 check, the expected Vercel URL returns HTTP 404 and the final ERD export is pending.

## Recording timeline

| Time | Screen actions | Voice-over boundary |
| --- | --- | --- |
| 00:00–00:30 | Landing hero and verified product proof | Explain fragmented PT administration without claiming an unverified “10 hours” figure. |
| 00:30–01:05 | PT registration/login and workspace | Identify `/workspace` as the real authenticated product. |
| 01:05–01:35 | Create trainee and invitation | Explain single-use hashed invitation; keep the token out of the recording. |
| 01:35–02:05 | Trainee mobile check-in and optional meal image | State that the image is synthetic and stored privately. |
| 02:05–02:35 | PT manual InBody entry/OCR draft review | State that OCR is experimental, requires PT review, and manual entry remains available. |
| 02:35–02:45 | Three-full-day warning and intentional Zalo handoff | Do not claim automatic messaging. |
| 02:45–03:45 | `/admin` KPI, user table, and VietQR example | Call out live counts versus synthetic tables using the on-screen disclosure. Do not call simulated transactions paid revenue. |
| 03:45–04:15 | Security and roadmap | Mention verified RLS/private media; describe Android, production OCR, and payment reconciliation as planned unless direct evidence exists. |

## Capture checklist

- [ ] Production commit SHA is recorded before capture.
- [ ] Browser zoom is 100%; no DevTools, secrets, tokenized URLs, inboxes, or personal tabs are visible.
- [ ] Landing, login, workspace, trainee mobile view, and admin screen load without console/server errors.
- [ ] Every health/meal image shown is synthetic.
- [ ] Captions match spoken capability status (`verified`, `implemented`, `prototype`, `planned`).
- [ ] Final duration is between 03:00 and 05:00.
- [ ] Export is watched once from beginning to end before upload.

## Link smoke test

Record reviewer initials, UTC timestamp, HTTP/result, and device for each item:

| Link | Desktop incognito | Android Chrome | iOS Safari | Reviewer |
| --- | --- | --- | --- | --- |
| Production landing | Pending | Pending | Pending | — |
| Admin login | Pending | Pending | Pending | — |
| ERD PNG/PDF | Pending | Pending | Pending | — |
| YouTube Unlisted | Pending | Pending | Pending | — |
| Drive backup | Pending | Pending | Pending | — |

Do not mark a cell passed from an editor preview or authenticated owner session.

## Sanitized submission email

```text
Subject: [EXE201] Outcome 2 - SafeTrail - [CLASS CODE]

Kính gửi Thầy [TÊN GIẢNG VIÊN],

Em là Huỳnh Quốc Việt, đại diện nhóm SafeTrail, gửi Thầy bộ nghiệm thu Outcome 2 của dự án FitSync:

1. Landing page: [PRODUCTION URL]
   - Release/commit: [SHA]
   - Responsive evidence: [LINK]

2. Admin portal: [ADMIN URL]
   - Thông tin đăng nhập được gửi qua kênh bí mật đã thống nhất, không đặt trong email hoặc tài liệu công khai.
   - Dashboard phân biệt rõ số liệu live và dữ liệu demo synthetic.

3. Database/ERD:
   - ERD PNG/PDF và Data Dictionary: [VIEW-ONLY LINK]
   - Supabase Dashboard invitation: [ACCEPTED/PENDING + REDACTED TIMESTAMP]

4. Video walkthrough (~04:15):
   - YouTube Unlisted: [URL]
   - Drive backup: [URL]

Các liên kết trên đã được [TÊN REVIEWER] kiểm tra ở chế độ ẩn danh lúc [TIMESTAMP]. Dữ liệu trình diễn là synthetic; nhóm không gửi khóa, mật khẩu, connection string, dữ liệu sức khỏe thật hoặc thông tin ngân hàng trong email này.

Trân trọng,
Huỳnh Quốc Việt — Team SafeTrail
```

## Evidence that must remain pending until performed

- Uploading/permissioning YouTube and Drive.
- Physical iOS/Android network tests.
- Supabase instructor invitation acceptance.
- Vercel production deployment and post-deploy smoke test.
- Sending the official email and capturing the Sent receipt.

## Closing sequence

1. Record the final production commit SHA and Vercel URL.
2. Complete the desktop Incognito admin/non-admin tests.
3. Complete Android Chrome and iOS Safari link checks where devices are available.
4. Review Toàn's ERD against the five migrations and attach its view-only link.
5. Record, edit, caption, export, and watch the entire video once.
6. Upload YouTube Unlisted and Drive backup; verify both while signed out.
7. Send the submission email only after every referenced link passes.
8. Capture the Sent receipt, update Trello, and archive the final evidence list in Issue #27.
