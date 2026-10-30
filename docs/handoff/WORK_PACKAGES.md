# Gói việc sau bàn giao

Người phụ trách dưới đây là **đề xuất bàn giao theo chuyên môn**, chưa tự tạo/assign issue hoặc gửi tin cho ai. Huy: backend/Supabase/ops; Diệp Khai: web/mobile UI và Android. Chủ sản phẩm duyệt business rules còn mở; reviewer nhận DONE, không agent tự approve/merge.

| Ưu tiên / gói | Lead đề xuất | Dependency | Kết quả / điều kiện nghiệm thu |
| --- | --- | --- | --- |
| P0 / REVIEW-BASELINE | Huy + Khai | PR31/checkpoint chung | Đọc README, schema/types, route/state matrix; chạy lại synthetic stack, ghi review findings, không dùng video/health data riêng |
| P0 / AUTH-DELIVERY | Huy + Khai | REVIEW-BASELINE | Email confirmation/reset/invitation expiry/reissue, scoped coach identity và account settings; role không tự đổi; UI states và mail delivery được thử trên staging |
| P0 / LEGACY-AUTH | Huy | REVIEW-BASELINE | Test role promotion, archive/unlink/reassign và replacement identity cho legacy biometrics/check-in/OCR/media; sửa khoảng trống dưới RLS, không chỉ route guards |
| P0 / OPS-DATA | Huy + owner | LEGACY-AUTH | Retention/account deletion/backup-restore/source cleanup, scoped support/privacy notices; kiểm FK restrict/cascade và audit; không dùng dữ liệu thật trước gate |
| P0 / ABUSE-ROLLOUT | Huy | Baseline + OPS-DATA | Rate/abuse boundary cho app/direct API; env/secret separation; staging rollout ba flags, no body/provider-payload logging; rollback bằng flags giữ dữ liệu |
| P1 / CALENDAR-02 | Huy; Khai review states | Baseline calendar | Version/request/accept/reject/withdraw/audit, same appointment reference trong chat; stale/overlap/race/retry tests hai tài khoản, slot gốc không mất khi request fail |
| P1 / LEDGER-01 | Huy; Khai nối states | CALENDAR-02 + owner policy | Opening balance từ remaining thực, completion/debit/reversal nguyên tử, không âm/không double debit; thay action/grants legacy cùng release; no auto charge/check-in debit |
| P1 / FULL-REPORT | Huy; Khai review field groups | Template matrix + BODY-REPORT-02 contract | Core+totals+segments+source/evidence/revisions; migration giữ legacy; PT bắt buộc review; UI hiển thị missing/unit/model đúng, không suy luận nhóm cơ không được đo |
| P1 / OCR-PDF | Huy + owner benchmark | FULL-REPORT | Bounded PDF text/scan/image pipeline, provider/version/cost/timeout/cleanup; holdout có threshold duyệt trước; manual fallback và duplicate-confirm/isolation tests |
| P1 / TARGETS-MEALS | Huy; Khai nối UI | Target/meal contract | Target history+publication; nhiều bữa/ngày và phản hồi PT; migrate legacy không duplicate; ảnh gửi được khi AI lỗi |
| P1 / ANDROID-SPIKE | Khai; Huy hợp đồng | REVIEW-BASELINE + stable APIs | ADR chọn runtime; auth→invite→profile→camera/review trên Android thật; session/deep link/permissions/keyboard/reconnect không mất hoặc nhân dữ liệu |
| P2 / ANDROID-CORE | Khai | SPIKE + calendar/report APIs | Điều hướng hai vai trò, chat/lịch/membership/check-in/targets; native interaction phù hợp phone; dùng cùng DB/domain, no service key; gói cài nội bộ có bằng chứng máy thật |
| P2 / REALTIME-MEDIA | Huy + Khai | OPS-DATA + rate | Media chat/read-state/unread/notification, file quyền/cleanup, reconnect/background và thông báo không lộ dữ liệu trên lock screen |
| P2 / BILLING-OFFER | Owner + Huy | Pricing/limits decision | Giữ baseline199k; xác nhận ai trả/hạn mức/AI economics/receipt/renewal/support, không bật trial/unlimited/checkout từ fixture |
| P2 / PILOT-RELEASE | Owner + human reviewer | P0 gates + core acceptance | Landing/capability/legal/support đúng môi trường, onboarding/check-in/core flows chạy, tracking tối thiểu nếu được duyệt, đo giá trị PT thay vì chỉ tests |

## Checklist nhận việc của Khai

Giữ `DESIGN.md`, Be Vietnam Pro và token chung. Review ảnh desktop/phone rồi dùng chính route thật, không làm lại một theme độc lập. Kiểm widths320/390/768/1440, focus/tab, task-tab/hash navigation và draft khi đổi phần, textarea keyboard/safe area, long names/notes, no data/one record/query error/pending/network/conflict/role denied. Chưa có chứng nhận screen reader hoặc máy Android thật chỉ vì browser width390 qua.

Các future fields/screens phải nối contract ở REMAINING_CONTRACTS. Khi Huy thêm request/ledger/report endpoints, Khai bổ sung thao tác theo trạng thái thật; không thêm CTA không lưu hoặc fake success. PT Today chưa có unread/read-state; learner không có private note tab. Admin hiện là system/coursework surface, không biến thành dashboard chủ gym.

## Checklist nhận việc của Huy

Đối chiếu migrations và schema-only snapshot; generated types không thay SQL grants. Kiểm definer search_path/EXECUTE, actor role/relationship locks, nonce conflict, API direct writes, timestamp/date distinction và transaction boundaries. Rehearsal upgrade từ baseline và fresh DB đều phải qua sau mỗi schema change. Seed/test dùng synthetic; không reset project cloud hoặc backfill real data vì đọc handoff.

Trước đổi cấu trúc report/ledger, ghi ADR mapping/revision/rollback và giữ clients hiện hành hoạt động. Khóa từng miền cùng UI/action tests; không gộp một migration khổng lồ cho toàn bộ roadmap. Chạy lại acceptance có hành vi thật, không thay assertions để chấp nhận quyền sai.
