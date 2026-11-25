# Nhận việc qua GitHub Issues

Cập nhật phân công 25/11/2026. Huy phụ trách frontend, Khai phụ trách backend. GitHub giữ trạng thái và assignee thực tế. Bảng dưới ghi assignment hiện có của 15 issues, đọc lại ngày 25/11 trước khi điều phối. Các mục dành cho BE còn gán Huy từ lượt 31/10. Phần phân công đã sửa trong tài liệu và chờ cập nhật trên GitHub.

Bắt đầu từ [bàn giao 25/11](TEAM_HANDOFF_2026-11-25_VI.md) và [#32: REVIEW-BASELINE](https://github.com/Team-SafeTrail/fitsync-app/issues/32). Dùng PR #48 làm candidate hiện hành. Huy review web/Android client, Khai review DB/security/ops. Ghi scope và bằng chứng theo SHA.

## Queue và readiness

Chỉ issue32 không mang label blocked. Các issue33–46 đều đang blocked vì dependency, business rules hoặc release gates; assignment không có nghĩa đã bắt đầu. Chưa thêm agent-ready/milestone tự động: lead kiểm active milestone, quyết định owner, dependency và overlap trước khi mở quyền triển khai theo TEAM_PLAYBOOK. Khi gate qua, cập nhật dependency checklist, gỡ blocked, thêm agent-ready sau khi lead xác nhận; không gỡ theo lịch cố định.

| Issue | Ưu tiên / gói | Assignees đã xác minh | Dependency chính |
| --- | --- | --- | --- |
| [#32](https://github.com/Team-SafeTrail/fitsync-app/issues/32) | P0 / REVIEW-BASELINE | `DiepKhai`, `huydqse180459-art` | Review PR31/checkpoint hiện có |
| [#33](https://github.com/Team-SafeTrail/fitsync-app/issues/33) | P0 / AUTH-DELIVERY | `DiepKhai`, `huydqse180459-art` | [REVIEW-BASELINE](https://github.com/Team-SafeTrail/fitsync-app/issues/32) |
| [#34](https://github.com/Team-SafeTrail/fitsync-app/issues/34) | P0 / LEGACY-AUTH | `huydqse180459-art` | [REVIEW-BASELINE](https://github.com/Team-SafeTrail/fitsync-app/issues/32) |
| [#35](https://github.com/Team-SafeTrail/fitsync-app/issues/35) | P0 / OPS-DATA | `huydqse180459-art` | [LEGACY-AUTH](https://github.com/Team-SafeTrail/fitsync-app/issues/34) |
| [#36](https://github.com/Team-SafeTrail/fitsync-app/issues/36) | P0 / ABUSE-ROLLOUT | `huydqse180459-art` | [OPS-DATA](https://github.com/Team-SafeTrail/fitsync-app/issues/35), [LEGACY-AUTH](https://github.com/Team-SafeTrail/fitsync-app/issues/34) |
| [#37](https://github.com/Team-SafeTrail/fitsync-app/issues/37) | P1 / CALENDAR-02 | `DiepKhai`, `huydqse180459-art` | [REVIEW-BASELINE](https://github.com/Team-SafeTrail/fitsync-app/issues/32) |
| [#38](https://github.com/Team-SafeTrail/fitsync-app/issues/38) | P1 / LEDGER-01 | `DiepKhai`, `huydqse180459-art` | [CALENDAR-02](https://github.com/Team-SafeTrail/fitsync-app/issues/37) |
| [#39](https://github.com/Team-SafeTrail/fitsync-app/issues/39) | P1 / FULL-REPORT | `DiepKhai`, `huydqse180459-art` | [REVIEW-BASELINE](https://github.com/Team-SafeTrail/fitsync-app/issues/32), [LEGACY-AUTH](https://github.com/Team-SafeTrail/fitsync-app/issues/34) |
| [#40](https://github.com/Team-SafeTrail/fitsync-app/issues/40) | P1 / OCR-PDF | `huydqse180459-art` | [FULL-REPORT](https://github.com/Team-SafeTrail/fitsync-app/issues/39) |
| [#41](https://github.com/Team-SafeTrail/fitsync-app/issues/41) | P1 / TARGETS-MEALS | `DiepKhai`, `huydqse180459-art` | [REVIEW-BASELINE](https://github.com/Team-SafeTrail/fitsync-app/issues/32), [LEGACY-AUTH](https://github.com/Team-SafeTrail/fitsync-app/issues/34) |
| [#42](https://github.com/Team-SafeTrail/fitsync-app/issues/42) | P1 / ANDROID-SPIKE | `DiepKhai`, `huydqse180459-art` | [REVIEW-BASELINE](https://github.com/Team-SafeTrail/fitsync-app/issues/32), [AUTH-DELIVERY](https://github.com/Team-SafeTrail/fitsync-app/issues/33) |
| [#43](https://github.com/Team-SafeTrail/fitsync-app/issues/43) | P2 / ANDROID-CORE | `DiepKhai` | [ANDROID-SPIKE](https://github.com/Team-SafeTrail/fitsync-app/issues/42), [CALENDAR-02](https://github.com/Team-SafeTrail/fitsync-app/issues/37), [FULL-REPORT](https://github.com/Team-SafeTrail/fitsync-app/issues/39) |
| [#44](https://github.com/Team-SafeTrail/fitsync-app/issues/44) | P2 / REALTIME-MEDIA | `DiepKhai`, `huydqse180459-art` | [OPS-DATA](https://github.com/Team-SafeTrail/fitsync-app/issues/35), [ABUSE-ROLLOUT](https://github.com/Team-SafeTrail/fitsync-app/issues/36) |
| [#45](https://github.com/Team-SafeTrail/fitsync-app/issues/45) | P2 / BILLING-OFFER | `huydqse180459-art` | [REVIEW-BASELINE](https://github.com/Team-SafeTrail/fitsync-app/issues/32) |
| [#46](https://github.com/Team-SafeTrail/fitsync-app/issues/46) | P2 / PILOT-RELEASE | `DiepKhai`, `huydqse180459-art` | [AUTH-DELIVERY](https://github.com/Team-SafeTrail/fitsync-app/issues/33), [LEGACY-AUTH](https://github.com/Team-SafeTrail/fitsync-app/issues/34), [OPS-DATA](https://github.com/Team-SafeTrail/fitsync-app/issues/35), [ABUSE-ROLLOUT](https://github.com/Team-SafeTrail/fitsync-app/issues/36) |

Xem [scope chi tiết offline](ISSUE_SCOPES.md) nếu cần đọc toàn bộ acceptance mà chưa mở GitHub.

## Đề xuất cập nhật khi giao việc

- **Huy (`huydqse180459-art`)** phụ trách FE, review UI và điều phối deploy candidate được duyệt. Dùng issue FE hiện có nếu scope còn khớp. Khi giao Android client, Huy ghi kết quả emulator và phía web tại issue đã chọn.
- **Khai (`DiepKhai`)** phụ trách BE, Supabase, RLS, CI dữ liệu, cấu hình synthetic và release readiness. #34–36, #40 và #45 vẫn mang assignee BE cũ. Rà lại scope và blockers trước khi thay assignee. #45 vẫn thuộc backlog chờ quyết định kinh doanh.
- **Android U-01.** #42 vẫn blocked và scope ghi thiết bị thật. Ghi kết quả emulator như bằng chứng cục bộ. Nếu team cần chạy ngay phần local, scope riêng lượt emulator với Huy client và Khai backend, link #42 và giữ nguyên điều kiện nghiệm thu issue gốc. Khi rà #43 sau này, cập nhật owner client và backend theo phần việc đã duyệt.
- **Việt (`Am2uocVi3t`)** bắt đầu slide khi Huy và Khai đã bàn giao URL/revision và bằng chứng nghiệm thu. Discord gửi thông báo kèm link issue/PR sau khi nhiệm vụ đã được ghi trên GitHub.

## Không trùng hoặc đóng nhầm backlog cũ

- #2 vẫn giữ benchmark OCR của Hưng/Việt; issue40 phụ thuộc bằng chứng benchmark và phối hợp, không giành ownership corpus.
- #5 vẫn là UI/asset coursework review cũ, không được tự assign lại sang Huy/Khai trong lượt này.
- #16/#18/#20/#22 là rollout visual trước; reviewer đối chiếu PR31 rồi mới quyết định đóng/superseded.
- #24 giữ lịch sử product timeline/mobile; không coi chat text hiện tại đã có structured cards.
- #27 là OC2/database/submission evidence; baseline12 bảng không tự hoàn thành video/cloud/submission.

## Mẫu nhận một issue

Ghi trong issue trước khi code: người đang làm, branch, scope nhỏ sẽ thực hiện, dependency đã qua, business rule còn mở và checks dự định chạy. Nếu scope cần đổi, cập nhật issue trước; không tự mở rộng sang task đồng đội. Không tự close issue/approve PR thay reviewer.

Mỗi issue đã có outcome, scope, acceptance checklist, điểm bắt đầu trong code, verification và ngoài phạm vi. Khi gửi PR, ghi SHA, migrations/API version, checks thật, ảnh synthetic đã rà, lỗi/giới hạn còn lại và reviewer cần đọc phần nào. Không chỉ link một screenshot rồi đánh Done.

## Thứ tự thực hiện và điều kiện chuyển bước

1. Hai người review32, ghi findings và chốt checkpoint nhận.
2. Đóng P0 auth/legacy authorization/retention/abuse/rollout theo dependency. Khắc phục findings ảnh hưởng quyền/dữ liệu trước pilot.
3. Calendar/report/targets có thể tách nhánh theo dependency; owner duyệt quy tắc còn mở trước migration. Ledger sau calendar và quyết định debit/reversal.
4. Android spike sau identity/API ổn định; core sau spike và các contract cần cho scope. Media/realtime có rate/lifecycle gate riêng.
5. Offer/billing cần owner chốt; pilot scope và release cần human signoff. Không bắt pilot phải có mọi P2 nếu owner đã thống nhất phạm vi hẹp hơn.

Theo dõi merge/Discord ở [MERGE_AND_SHARE](MERGE_AND_SHARE.md), setup ở [DEVELOPER_RUNBOOK](DEVELOPER_RUNBOOK.md), thao tác nghiệm thu ở [MANUAL_ACCEPTANCE](MANUAL_ACCEPTANCE.md). ZIP không phải nguồn code cập nhật.
