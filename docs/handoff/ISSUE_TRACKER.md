# Nhận việc qua GitHub Issues

Cập nhật31/10/2026 theo yêu cầu chủ sản phẩm. Đã tạo và xác minh assignment của15 issues dưới đây. GitHub issue là nguồn trạng thái thực thi; repo giữ scope/reference để đọc cùng code. Chưa sửa Trello, gửi Discord, đóng issue cũ hoặc merge/deploy.

Bắt đầu bằng [#32: REVIEW-BASELINE](https://github.com/Team-SafeTrail/fitsync-app/issues/32). Huy review DB/security/ops, Khai review web/interactions. Có thể review PR31 trước merge. Sau khi nhận baseline, mỗi người chọn một issue không còn dependency, thống nhất scope rồi mở nhánh riêng.

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

## Huy nhận gì

Huy (`huydqse180459-art`) nhận DB/server/RLS, transaction/idempotency, storage, ops và rollout. Review đầu tiên gồm schema12 bảng, migration upgrade, legacy identity gaps và cách giữ flags off tới khi môi trường sẵn sàng. Trong task đồng sở hữu, Huy làm contract/migration/API và Khai làm UI/device; nêu phần việc mỗi người trong issue trước khi cùng sửa.

## Khai nhận gì

Khai (`DiepKhai`) nhận web UX/responsive/keyboard và Android. Giữ DESIGN.md; không tạo theme hoặc prototype độc lập để thay workspace thật. Android spike42 đi trước core43; đối chiếu issue24 và ADR003 trước chọn setup. Không gọi browser width390 là bằng chứng Android đã chạy.

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
