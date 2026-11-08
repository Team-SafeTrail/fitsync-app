# Coaching specimen — kiểm tra và review thực chạy

Ngày 2026-10-30. Scope prototype riêng, không kiểm thử app Next.js/backend.
Evidence ignored: `.agents/audit/ui/2026-10-30-coaching-specimen/`.
Lead frontend-design; không áp bộ quota ảnh/animation của taste-skill vào lượt này.

## Kết quả browser

- `verify.cjs`: **PASS — 34 nhóm kiểm tra, 30 tổ hợp axe A/AA đã chọn**.
  Năm độ rộng: 1440, 1024, 768, 390, 320px. Sáu trạng thái: PT, học viên,
  sheet buổi hẹn, chat, bản nháp đã tick review, disclosure giới hạn mở.
- Không confirmed violation/overflow; giữ các axe incomplete trong verification.json,
  không nhận là đạt toàn bộ WCAG. Text trên ảnh được nhìn trực tiếp, không suy ra từ axe.
- Ảnh tải được, headline hai dòng, thẻ hẹn không che headline ở phone. Font có dấu
  Be Vietnam Pro tự host. Không API/request ngoài server hoặc asset HTTP lỗi.
- Chart theo vùng vẽ thực, nhãn ít nhất 12px trong test (render 13px), nhãn ngày
  cách nhau ít nhất 6px; phiếu ghi ngày/nguồn/đơn vị, số liệu tổng hợp giả nhất quán.
- PT/học viên đổi qua lại được; nội bộ ẩn khỏi phần trình bày học viên. Đây là UI fixture,
  không phải kiểm chứng auth hoặc RLS thật.
- Buổi hẹn 16:00 cùng xuất hiện trong hero, hồ sơ, chat và sheet. Chat mở chi tiết
  trong cùng sheet; Đóng/Escape trở lại đúng opener ban đầu.
- Tab và Shift+Tab ở trong dialog, checkbox bắt buộc trước xác nhận; xác nhận chỉ
  đổi thông báo minh họa, không thay lần đo đã xác nhận ngày 23/10 hoặc số buổi PT.
- Reduced motion không active animation kể cả mở sheet. Tắt JS vẫn có hero, hồ sơ PT,
  disclosure native và link demo; nút tương tác chưa khởi tạo được disabled.
- Các đường dẫn A/B, story, brand và B1-A cũ còn mở được. A/B chỉ sửa href lưu trữ
  sang `/directions/`, không ghi đè giao diện cũ.
- `node --check` chạy cho specimen.js và server: qua. `git diff --check` qua;
  `git diff --name-only -- apps supabase` rỗng.

## Vòng review hình render

Quan sát trước khi sửa: hero khác A/B nhờ ảnh và không khí riêng; hồ sơ có timeline,
nhưng chữ nhỏ và nhãn biểu đồ phone dính nhau. Thẻ hẹn sát headline phone. Metadata
ở dòng roster chọn có contrast 4.26:1. Đã sửa:

- Tăng chữ metadata; chừa khoảng thật giữa thẻ hẹn và h1.
- Responsive SVG dùng tọa độ pixel thực và 13px label. Ở vùng hẹp chỉ in ngày,
  chú thích nói rõ tháng; không giảm chữ hoặc cắt biểu đồ để giấu lỗi.
- Màu chữ roster chọn thành forest, kiểm lại toàn suite. Không sửa test để bỏ contrast.
- Favicon đồng bộ specimen; toàn bộ ảnh và font self-host.

Đã xem hero desktop/390/320, hồ sơ desktop/390/320, sheet phone, full page desktop.
Sau sửa nhãn biểu đồ lần cuối đã chạy lại toàn suite và nhìn final-profile-320.png
và final-sheet-320.png. Đây là tự review và browser automation, chưa có PT chấm.

Nhận định: hero có sức sống rõ hơn A/B; nét kết nối đi qua cuộc hẹn và hồ sơ, UI
bình tĩnh hơn phần marketing. Phần nhận diện mới vẫn ở mức thử nghiệm; một ảnh AI
không đủ tạo bằng chứng thương mại. Hồ sơ phone còn dài khi đọc cả history/context,
cần thử tác vụ với PT trước khi quyết định thông tin nên gập/mở. Không tự bỏ chart,
nhãn nguồn hoặc gate review chỉ để trang ngắn hơn.

## Giới hạn

Chromium với viewport/touch giả lập; chưa kiểm Safari, screen reader thủ công hoặc
thiết bị Android/iPhone thật. Bản mẫu không có persistence, OCR, upload hoặc backend.
Ảnh PNG 2.2 MB chưa tối ưu cho production. Logo/visual language chưa được chủ sản phẩm
duyệt và chưa tra cứu nhãn hiệu. Không khẳng định tăng conversion hay tốt nhất.
Không reset, push/deploy, sửa app/schema hoặc dùng ảnh/video/dữ liệu riêng.
