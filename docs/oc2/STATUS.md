# Trạng thái tổng hợp Outcome 2

- **Cập nhật:** 24/10/2026 (Asia/Ho_Chi_Minh)
- **Issue điều phối:** [GitHub Issue #27](https://github.com/Team-SafeTrail/fitsync-app/issues/27)
- **Frontend:** [PR #26](https://github.com/Team-SafeTrail/fitsync-app/pull/26) → `094c5ee`
- **Khôi phục thứ tự #28:** [PR #29](https://github.com/Team-SafeTrail/fitsync-app/pull/29) → `e1b03ad`
- **Production revision phải deploy:** `e1b03ad95b4fa5306ec7c2a4d9f5ca443e22cffd`

## Kết luận hiện tại

PR #26 và PR #29 đã được reviewer độc lập approve, CI xanh và squash-merge đúng thứ tự. Cây mã nguồn cuối của `main` khớp nội dung mong muốn của PR #28 gốc nhưng không còn merge nhầm #28 vào head #26.

Supabase production, migrations, RLS, private storage và synthetic seed đã có bằng chứng. Outcome 2 vẫn **chưa hoàn tất nghiệm thu** vì URL Vercel dự kiến còn trả HTTP 404 tại lần kiểm tra ngày 24/10/2026; browser smoke test, invitation giảng viên, ERD PNG/PDF, video và email vẫn đang chờ bằng chứng ngoài repository.

## Ma trận tiến độ

| Hạng mục | Trạng thái | Đã xác minh | Còn thiếu để DONE |
| --- | --- | --- | --- |
| GitHub integration | Hoàn thành | #26 → `094c5ee`; #29 → `e1b03ad`; CI xanh | Không |
| Landing và `/admin` | Implemented, đã merge | Team/contact/APK CTA, role guard, KPI và bảng synthetic | Deploy production và test trình duyệt thật |
| Supabase production | Hoàn thành kỹ thuật | 5/5 migrations; 8/8 bảng RLS; 2 private buckets | Invitation giảng viên và acceptance receipt đã redact |
| Synthetic seed | Hoàn thành | 1 admin, 4 PT, 12 trainee, 2 warning, 15 InBody, 8 meal/check-in | Admin/non-admin smoke test trên deployment |
| ERD/Data Dictionary | Source hoàn thành | Mermaid từ migrations và Data Dictionary | PNG ≥2560 px, PDF, review chéo, Drive view-only |
| Vercel production | P0 — bị chặn | Commit deploy đã khóa | HTTPS/HTTP 200 cho `e1b03ad`; URL ổn định |
| Video 3–5 phút | Chưa quay final | Script 04:15 và runbook | Chờ Vercel + ERD; quay, upload, signed-out QA |
| Email nghiệm thu | Chưa gửi | Template đã làm sạch | Link thật, reviewer QA, Sent receipt |

## Bằng chứng repository

- `/admin` yêu cầu session có `profiles.role = admin`; non-admin được chuyển về `/workspace`.
- Bảng demo và VietQR có nhãn synthetic; không được mô tả là user thật hoặc doanh thu đã đối soát.
- Main tại `e1b03ad`; GitHub `Web quality gates` hoàn thành với kết luận `success`.
- Recovery tree sau #29 khớp chính xác tree mong muốn của PR #28 gốc.
- Local recovery validation: TypeScript pass, Vitest 33/33, production build pass và OC2 E2E 2/2.

## Bằng chứng Supabase production

- Project `fitsync-prod`, Singapore `ap-southeast-1`, trạng thái `ACTIVE_HEALTHY`.
- Năm migrations local/remote khớp.
- RLS/policies đã kiểm tra trên tám bảng OC2 và `storage.objects`.
- `meal-media` và `inbody-media` là private bucket.
- Seed chỉ dùng dữ liệu synthetic; không có payment row vì schema chưa có payment table.

Chi tiết nằm trong [`SUPABASE_PRODUCTION_EVIDENCE.md`](SUPABASE_PRODUCTION_EVIDENCE.md).

## Việc còn lại theo đường găng

1. **Huy:** deploy `e1b03ad`, cấu hình secrets qua kênh riêng, gửi URL HTTPS/HTTP 200 và commit SHA.
2. **Việt + Huy:** test Incognito admin/non-admin, landing, `/workspace`, `/admin`; test desktop và thiết bị thật.
3. **Toàn + Hưng/Huy:** tạo ERD từ [`FITSYNC_OC2_ERD.mmd`](FITSYNC_OC2_ERD.mmd), xuất PNG/PDF và review với migrations.
4. **Việt:** mời email chính thức của giảng viên bằng least privilege; lưu receipt đã redact.
5. **Việt:** quay video final sau khi Vercel và ERD pass; upload YouTube Unlisted + Drive và kiểm tra khi signed out.
6. **Việt + reviewer:** kiểm tra toàn bộ link, gửi email và lưu Sent receipt.

## Điều kiện DONE

- [x] PR #26 và #29 được approve, CI xanh và merge đúng thứ tự.
- [x] Supabase production migration/RLS/storage/seed được xác minh.
- [ ] Vercel deploy `e1b03ad`, HTTPS trả HTTP 200.
- [ ] Admin vào `/admin`; non-admin bị redirect trên deployment thật.
- [ ] Invitation giảng viên có receipt đã redact.
- [ ] ERD PNG/PDF và Data Dictionary mở được qua link view-only.
- [ ] Video YouTube/Drive dài 03:00–05:00 mở được khi signed out.
- [ ] Email đã gửi và có Sent receipt.

Không lưu password, token, API key, connection string, signed URL hoặc dữ liệu sức khỏe thật trong evidence pack.
