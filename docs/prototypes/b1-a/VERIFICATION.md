# B1-A — kiểm tra thực hiện và giới hạn

Ngày: 2026-10-30. Phạm vi: prototype standalone trong thư mục này.

## Lượt chỉnh sau phản hồi thiết kế

Lead: `design-taste-frontend`, tách app mode và public-page mode. Đã chạy lại
13 nhóm chức năng cũ, 32 tổ hợp màn hình/vai/độ rộng và 9 trạng thái đối chiếu
báo cáo sau đổi theme: qua, không page overflow hoặc violation trong tập axe
đã chọn. Đây là lượt chạy mới, không dùng kết quả cũ để coi là vừa kiểm tra.

Thêm 8 nhóm kiểm tra qua ở 1440/390/320px: ba control chart, focus sau đổi,
giá trị/bảng số liệu tương ứng; ba preview landing và CTA; draft không vào trend;
xác nhận giữ lần đo cũ và cập nhật hai vai; empty state không dựng trend giả.
Lượt đầu phát hiện helper redraw ghi đè accessible label tiếng Việt; đã sửa để
label giữ nguyên qua redraw và chạy lại đủ 8 nhóm, qua. Không pageerror hoặc
external request trong tập chức năng này.

Taste inspector trước: hồ sơ 0 FAIL/1 WARN (h1 38px). Sau: h1 desktop 28px,
phone 24px, 0 FAIL/0 WARN ở 1440/768/390. Landing có exception được ghi rõ trong
[DESIGN_REVIEW.md](DESIGN_REVIEW.md); không coi đây là chứng nhận thẩm mỹ/WCAG.
Impeccable detector bên dưới thuộc lượt B1-A đầu, không chạy lại ở lượt này.

Evidence lượt mới: `.agents/audit/ui/2026-10-30-b1-a-refresh/` (ignored).
App Next.js, database và video không sửa; không chạy lại build hoặc DB tests.

## Kết quả lượt B1-A đầu (giữ để đối chiếu)

- `node --check` cho `app.js` và `serve.cjs`: qua.
- 8 nhóm kịch bản chính qua Playwright: note nội bộ/chat hai vai và escape HTML;
  đổi lịch giữ giờ cũ tới khi được chấp nhận; completion một lần và self-checkin
  không trừ gói; native dialog Tab/Escape; intake không email, thiếu số/giữ nháp/
  tiếp tục/xác nhận/kết nối; OCR lỗi→nhập tay; search empty và đề nghị buổi mới;
  deep link học viên không vào màn duyệt (chỉ UI guard).
- 5 kịch bản bổ sung qua: chặn chat với hồ sơ chưa kết nối; gắn bài tùy chọn; chặn
  lịch trùng; CTA landing chuyển đúng vai; mở `index.html` offline bằng file URL.
- 32 tổ hợp màn hình/vai/độ rộng (1440, 768, 390, 320px), cộng 9 trạng thái nhóm
  chỉ số report (toàn thân/vùng/mở rộng ở 1440, 390, 320): không page overflow và
  không confirmed violation trong axe-core 4.13.0 với tập rule A/AA được chọn.
- Luồng sửa trường thiếu và đề nghị/duyệt đổi giờ được thao tác thêm ở 390 và
  320px bằng Playwright tap với mobile/touch emulation. Không phải thiết bị thật.
- Các lần kiểm tra chức năng ghi nhận 0 JavaScript pageerror và 0 external request.
  Server phục vụ static file local; không có API/backend hoặc xử lý upload.
- Liên kết tài liệu nội bộ và `git diff --check`: qua.

Lượt kiểm tra đầu phát hiện select mất accessible name khi label bị ẩn ở màn nhỏ;
đã thêm aria-label. Vùng phiếu có scroll thiếu focus target đã thêm tabindex.
Quét lại tập liên quan sau sửa không còn các finding đó.

Impeccable detector cached 0.1.17 được đối chiếu checksum trước khi chạy. Source
scan một lần trả 35 cảnh báo: 31 màu, 2 radius và 2 font. Phần lớn là khác biệt
với DESIGN.md đang dùng cho app cũ; palette/contrast tạm và system fallback của
wireframe đã ghi trong spec. Không đổi brand chỉ để làm detector im lặng, không
coi những cảnh báo này là 35 lỗi sử dụng đã xác nhận.

## Evidence local

`.agents/audit/ui/2026-10-30-b1-a/` (ignored) có scripts, kết quả JSON và ảnh.
Các file chính: `functional-verification.json`, `additional-verification.json`,
`a11y-layout.json`, `review-mobile-verification.json`, `detector.json`.

Đã xem screenshot desktop/phone cho hôm nay/hồ sơ, đối chiếu theo vùng và hướng
landing. Full-page capture có thể đặt fixed mobile nav ở vị trí viewport hiện tại;
đó không tự là lỗi chồng nội dung. Ảnh cuối phục vụ xem mẫu được chụp ở đầu trang.

## Chưa được kiểm chứng

Không chạy app unit/lint/build/pgTAP/auth E2E, screen reader, Android/iPhone thật,
provider OCR, AI món ăn, email/push hoặc production performance. Không xác nhận
RLS, mã hóa dữ liệu, accuracy hay bảo mật sản phẩm dựa vào role switch của prototype.
Automated a11y sạch không phải chứng nhận WCAG toàn diện.

Tất cả dữ liệu và ghi nhận biến mất sau reload/reset. Native dialog dùng cơ chế
modal của browser; Tab có thể đi tới browser chrome/body ở ranh giới nhưng không
focus vào control nền. Bản mẫu chưa xử lý hủy/vắng có phí, lịch lặp hoặc offline sync.

Chỉ thêm thư mục prototype và evidence ignored; code app, migrations, DESIGN.md,
video và thay đổi chưa commit có sẵn được giữ nguyên. Server local 3101 được giữ
chạy để chủ sản phẩm xem mẫu; chưa publish hoặc deploy ra ngoài.
