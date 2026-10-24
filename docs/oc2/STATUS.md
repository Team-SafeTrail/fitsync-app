# Trạng thái tổng hợp Outcome 2

- **Cập nhật:** 24/10/2026 (Asia/Ho_Chi_Minh)
- **Chủ sở hữu phần Việt + Hưng:** Huỳnh Quốc Việt (`Am2uocVi3t`)
- **Reviewer độc lập:** Dương Quang Huy (`huydqse180459-art`)
- **Issue điều phối:** [GitHub Issue #27](https://github.com/Team-SafeTrail/fitsync-app/issues/27)
- **PR frontend gốc:** [PR #26](https://github.com/Team-SafeTrail/fitsync-app/pull/26)
- **PR handoff Việt + Hưng:** [PR #28](https://github.com/Team-SafeTrail/fitsync-app/pull/28)

## Kết luận hiện tại

Outcome 2 **chưa hoàn thành nghiệm thu toàn bộ**. Phần mã nguồn, tài liệu và hạ tầng Supabase production đã sẵn sàng; các bước còn lại phụ thuộc review/merge, Vercel của Huy, bản ERD xuất bởi Toàn, kiểm thử trình duyệt thật và việc quay/nộp video của Việt.

Không đánh dấu Trello DONE hoặc tuyên bố production hoàn tất chỉ dựa trên local build, dữ liệu fixture, URL dự kiến hay file thiết kế chưa xuất bản.

## Ma trận tiến độ

| Hạng mục | Chủ trì | Trạng thái | Đã có | Còn thiếu để DONE |
| --- | --- | --- | --- | --- |
| Chuyển giao task Database từ Hưng sang Việt | Việt | Hoàn thành | Trello ghi rõ chủ sở hữu mới, lý do và reviewer | Không |
| Landing page và `/admin` | Khai + Việt | Code complete, chờ review/deploy | Landing, TeamSection, CTA/APK, dashboard admin, guard role và nhãn synthetic/live | Review/merge PR #26 và #28; deploy rồi smoke test |
| Quality gates repository | Việt | Hoàn thành ở commit hiện tại | Build 14 routes, TypeScript, ESLint, Vitest 33/33, Playwright OC2 2/2; GitHub `Web quality gates` xanh | Chạy lại trên commit merge cuối nếu có thay đổi |
| Supabase production | Việt | Hoàn thành kỹ thuật | Project Singapore healthy; 5/5 migrations; 8/8 bảng RLS; policies; 2 bucket private | pgTAP khi có Docker/Podman là bằng chứng bổ sung, không thay thế smoke test ứng dụng |
| Synthetic seed | Việt | Hoàn thành | 1 admin, 4 PT, 12 trainee, 2 warning, 15 InBody, 8 check-in/meal/object | Không seed payment vì schema không có `payment_records` |
| Quyền truy cập Database cho giảng viên | Việt | Đang chờ | Runbook và tài khoản admin đã chuẩn bị an toàn | Cần email chính thức, mời least privilege và lưu bằng chứng đã che thông tin |
| ERD và Data Dictionary | Việt → Toàn | Source hoàn thành, visual đang chờ | Source 8 bảng, cardinality, Data Dictionary, design brief Mermaid đã sửa | Toàn xuất PNG 4K/≥2560 px + PDF và Drive view-only; Việt/Huy review |
| Slide W4–W5 và 5+ kênh MXH | Toàn | Chưa có bằng chứng hoàn thành | Phạm vi đã ghi trên Trello | Cần 16–17 slide final và link các kênh TikTok, Facebook, Instagram, Zalo OA, YouTube Shorts |
| Vercel production | Huy | Đang chờ | Supabase URL và danh sách env đã bàn giao; secrets phải gửi riêng | Cấu hình env, deploy commit đã review, HTTPS/HTTP 200 và URL ổn định |
| Kiểm thử nghiệm thu | Huy + Việt | Bị chặn bởi Vercel | Checklist desktop/mobile/incognito đã có | Admin vào `/admin`; non-admin bị redirect; test landing/workspace trên thiết bị thật |
| Video walkthrough 3–5 phút | Việt | Script hoàn thành, video final đang chờ | Kịch bản/lời thoại 04:15, timeline, caption và checklist | Chờ Vercel HTTP 200 + ERD final; quay, dựng, xem lại, upload YouTube/Drive |
| Email nghiệm thu | Việt | Chưa thực hiện | Mẫu email đã được chuẩn bị | Cần production URL, ERD, video, reviewer smoke test, email giảng viên và Sent receipt |

## Bằng chứng đã xác minh

### Repository và bảo mật

- `/admin` yêu cầu phiên đăng nhập có profile role `admin`; non-admin được chuyển về `/workspace`.
- Bảng demo và VietQR được gắn nhãn synthetic; fixture không được mô tả là người dùng thật hoặc doanh thu đã đối soát.
- Service-role key chỉ dùng phía server và không được lưu trong GitHub, Trello hoặc tài liệu.
- PR #26 tại commit `7dbfd70`: mở, chưa merge, CI xanh, chưa có review phê duyệt và GitHub báo trạng thái merge `blocked` khi kiểm tra.
- PR #28 tại commit `567fc8d`: mở, chưa merge, CI xanh, chưa có review phê duyệt và merge state `clean` khi kiểm tra.

### Supabase production

- Project: `fitsync-prod` — ref `uqjqkvalzdrcvxayhtre` — Singapore `ap-southeast-1` — `ACTIVE_HEALTHY`.
- Năm migration local/remote khớp.
- RLS và policy đã được kiểm tra trên `profiles`, `pt_profiles`, `trainee_profiles`, `trainee_invitations`, `inbody_records`, `checkins`, `meal_logs`, `ocr_attempts` và `storage.objects`.
- `meal-media` và `inbody-media` là private bucket; seed chỉ dùng dữ liệu synthetic.
- Admin demo đã email-confirmed và có role `admin`; credential không nằm trong evidence pack.

Chi tiết nằm trong [`SUPABASE_PRODUCTION_EVIDENCE.md`](SUPABASE_PRODUCTION_EVIDENCE.md).

## Những việc đang phải đợi

1. **Huy:** review quy trình merge PR #26/#28, cấu hình Vercel secrets qua kênh riêng, deploy và gửi URL trả HTTP 200.
2. **Toàn:** hoàn thiện ERD Carbon Dark, xuất PNG/PDF và gửi link Drive view-only.
3. **Toàn:** bàn giao bản final slide W4–W5 và bằng chứng 5+ kênh MXH theo card Design.
4. **Giảng viên/nhóm:** cung cấp hoặc xác nhận email chính thức và mức quyền Supabase phù hợp.
5. **Sau khi Huy deploy:** Việt và Huy kiểm thử Incognito bằng admin và non-admin, sau đó test responsive/thiết bị thật.
6. **Sau khi Vercel + ERD pass:** Việt quay video final, upload YouTube Unlisted + Drive, kiểm tra link ẩn danh và gửi email nghiệm thu.

URL dự kiến `https://fitsync-safetrail.vercel.app` vẫn trả HTTP 404 tại lần kiểm tra ngày 24/10/2026; chưa được dùng làm production evidence.

## Thứ tự đóng Outcome 2

1. Review và merge đúng thứ tự PR #26, PR #28; ghi lại commit SHA cuối.
2. Huy deploy SHA đó lên Vercel với Supabase production env.
3. Việt/Huy smoke test landing, login, `/workspace`, `/admin`, admin và non-admin ở Incognito.
4. Việt mời email giảng viên theo least privilege và lưu bằng chứng đã redact.
5. Nhận ERD PNG/PDF của Toàn, review chéo với migrations rồi khóa bản final.
6. Quay và xuất video 03:00–05:00; xem lại từ đầu đến cuối.
7. Upload YouTube Unlisted và Drive, kiểm tra toàn bộ link bằng phiên không đăng nhập.
8. Gửi email nghiệm thu, lưu Sent receipt, cập nhật Trello sang DONE.

## Điều kiện được phép đánh dấu DONE

- PR cần thiết đã được reviewer độc lập phê duyệt và merge.
- Production URL HTTPS trả HTTP 200 và trỏ tới commit đã ghi nhận.
- Admin/non-admin authorization test đạt trên deployment thật.
- Supabase instructor invitation có trạng thái/bằng chứng đã che thông tin nhạy cảm.
- ERD PNG/PDF và Data Dictionary mở được bằng link view-only.
- Video 3–5 phút và Drive backup mở được ở Incognito.
- Email nghiệm thu đã gửi và có bằng chứng trong Sent.
