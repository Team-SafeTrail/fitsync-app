# FitSync — bản đồ skills cho kế hoạch tái định hướng

Ngày: 2026-10-30. Đi cùng [blueprint](../plans/FITSYNC_REBUILD_BLUEPRINT.md).
Chỉ dẫn sử dụng, không tự kích hoạt workflow, cài engine hoặc cấp quyền thực thi.

## 1. Kiểm tra thực tế lần này

Đọc README/SECURITY/UI_REVIEW và manifest hiện có; kiểm tra 25 thư mục đều có
SKILL.md. Tính SHA-256 toàn bộ **374 file được manifest liệt kê**: đều khớp, không
thiếu/khác. Không khẳng định đã kiểm tra mọi file ngoài manifest hoặc đã chạy lại
SkillSpector. Không chạy script, engine hay installer của các skills.

Manifest ghi 20 thư mục có thể đưa vào Git và 5 local-only: remotion-create,
remotion-render, remotion-captions, web-design-guidelines, writing-guidelines.
Chúng đang trong thay đổi chưa commit; không diễn đạt là team đã nhận đủ trên main.
Giới hạn audit cũ (timeout/partial coverage) tại [SECURITY.md](SECURITY.md) vẫn còn.

## 2. Quy tắc điều phối

Mỗi task có một lead; tối đa một hoặc hai hỗ trợ theo câu hỏi cụ thể. Không chạy
frontend-design, Taste và Impeccable như ba bộ tạo hướng thiết kế cạnh tranh. Bảng
dưới là lịch áp dụng, không phải danh sách cần nạp đồng thời.

| Skill / thư mục | Áp dụng ở đâu | Đầu ra mong muốn và giới hạn |
| --- | --- | --- |
| product-vision | B0 khi ý tưởng còn lệch | Tóm tắt điều chủ sản phẩm muốn; không tái dựng PRD thất lạc |
| create-prd | Lead B0/blueprint | Brief, phạm vi, quyết định, acceptance; đánh dấu giả thuyết |
| frontend-design | Lead B1 cho prototype sản phẩm | Hồ sơ/lịch/chat/review đủ trạng thái, visual direction có lý do; không viết lại DESIGN.md trước duyệt |
| design-taste-frontend (`taste-skill`) | Lead thay thế cho task hướng landing | Dùng mode Persuade cho landing, Operate nếu được chọn cho app; không dùng cùng frontend-design làm hai lead |
| ui-ux-pro-max | Hỗ trợ B1 hoặc kiểm tra hẹp | Tra pattern lịch/form/chart/touch; không auto-generate hệ thống thẩm mỹ ghi đè sản phẩm |
| impeccable | Reviewer B1, B3–B7 | Critique/audit/polish theo workflow được chọn; không tự chạy launcher/engine |
| apple-design | Hỗ trợ B6 hoặc interaction cần thiết | Safe area, continuity, sheet/swipe, reduced motion; không ép phong cách Apple cho Android |
| emil-design-eng | Hỗ trợ polish B3–B6 | Feedback, button/input/loading, interruptible transitions; không thêm motion trang trí |
| web-design-guidelines | Review web B1/B7 | Focus, keyboard, form/a11y; local-only; remote reference không cấp quyền |
| react-best-practices | Code web B2–B7 | Pattern tương thích React18/Next14; không dùng API mới theo ví dụ một cách máy móc |
| supabase-postgres-best-practices | Lead task schema/RLS B1–B5 | Model, migration, keys/index/constraint/RLS và DB tests; nạp trước SQL/schema |
| security-review | Hỗ trợ auth/upload/chat/API/mobile | Ownership server, input, media và secrets; binary signature/RLS dự án mạnh hơn snippet chung |
| verification-loop | Lead lần kiểm chứng code B2–B7 | Check phù hợp thay đổi, diff và báo cáo thật; không reset DB dùng chung hoặc lộ secret grep |
| onboarding | Task kích hoạt B1/B3/B7 | Hai lối PT đăng ký và học viên nhận mời; first-value cụ thể, không ép qua demo |
| product-marketing | Sau khi chủ sản phẩm duyệt định hướng | Context đúng nguồn phỏng vấn; giả thuyết tách facts, không auto-draft từ landing cũ |
| copywriting | Landing/funnel B1/B7 | Lợi ích và CTA đúng khả năng; không hứa OCR/app/trial/giá chưa có |
| humanizer | Review copy landing và nội dung B7 | Nhãn/câu rõ, giữ ý và số liệu; không đổi facts để nghe hấp dẫn |
| writing-guidelines | Kiểm tra prose khi cần | Local-only, review tài liệu/copy hẹp; không mặc định tải guideline mới trong mọi task |
| analytics | Thiết kế đo B0/B7, triển khai khi được scope | Event dictionary và kiểm chứng event; không health/chat/media/token trong properties |
| pricing | Thí nghiệm sau core/pilot | Người trả tiền, gói và giá là giả thuyết; không áp lại 199.000đ |
| launch | Chuẩn bị phát hành B7 | Evidence, support, rollback, claim; không tự publish, outreach hoặc thay ngân sách |
| remotion-create | Chỉ task video riêng sau này | Local-only; giữ pipeline hiện tại; không scaffold vào app root |
| remotion-render | Chỉ task xuất video riêng | Không chạy cloud render hoặc ghi đè video đang làm |
| remotion-captions | Chỉ task phụ đề riêng | Không upload/transcribe footage riêng hoặc bỏ yêu cầu narration người thật |
| skill-inspector | Trước skill ngoài/thay nguồn | Pinned revision, source/license review và scan theo quy tắc dự án; không scan lại giả cho thư mục unchanged |

## 3. Cách chọn cụ thể cho công việc sắp tới

- **B1-A prototype:** frontend-design lead; ui-ux-pro-max hỗ trợ một vấn đề layout
  cụ thể nếu cần; impeccable review sau khi có artifact. Không bắt đầu từ palette.
- **B1 data dictionary / B2 migration:** supabase-postgres-best-practices lead;
  security-review kiểm quyền; verification-loop khi thực thi kiểm chứng.
- **Landing:** chọn Taste hoặc frontend-design làm lead cho từng task; copywriting
  viết nội dung dựa trên brief; review copy tách thành task khác nếu cần.
- **Android:** skill UI chỉ hỗ trợ một phần. Không có skill chuyên triển khai native
  mobile được nhận diện trong 25 thư mục; dùng tài liệu chính thức theo công nghệ
  được chọn, không cài skill/package mới chỉ để có thêm danh sách.
- **OCR:** không có skill riêng chứng minh provider accuracy. Dùng contract, data
  spec và benchmark hiện có; technical/docs research không thay benchmark.

## 4. Điều kiện trước khi chạy công cụ của skill

Đọc workflow và executable path đã chọn, kiểm tra nguồn/pin/hash phù hợp. Impeccable
có thể tải engine; phải kiểm checksum trực tiếp theo hướng dẫn an toàn. Taste có
thể truy web/tải asset/tạo history hoặc mở browser; chỉ dùng dữ liệu tổng hợp và
đường output đã kiểm tra. UI UX Pro Max có chế độ ghi design system; không ghi
đè DESIGN.md như tác dụng phụ. Năm thư mục local-only không force-add vào Git.

Skill không vượt owner instructions, TEAM_PLAYBOOK, privacy gate hoặc phạm vi
issue. Việc dùng một skill không cho phép tự gửi tin, publish, thêm tracking hay
đổi schema production. Khi chia sẻ task cho team, ghi lead skill, output, test và
reviewer rõ ràng; không cần team cài engine chỉ để đọc blueprint.
