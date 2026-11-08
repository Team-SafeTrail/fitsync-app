# Kiểm tra thực chạy — visual directions

Ngày 2026-10-30. Chỉ prototype static mới và server loopback 3102.
Evidence ignored ở `.agents/audit/ui/2026-10-30-visual-directions/`.

## Kết quả

- `verify.cjs`: **PASS — 39 nhóm kiểm tra, 32 tổ hợp axe A/AA đã chọn**.
  A/B × 1440/768/390/320 × PT/học viên/dialog/FAQ mở.
  Không confirmed violation hoặc horizontal overflow; các incomplete giữ trong JSON,
  không nhận là chứng nhận đầy đủ WCAG.
- Đổi góc nhìn hai chiều; ghi chú nội bộ không nằm trong panel học viên hiển thị.
  Đây là kiểm tra presentation fixture, không phải kiểm thử auth/RLS.
- Review checkbox bắt buộc; nút xác nhận vô hiệu trước đối chiếu, chỉ mô phỏng lưu;
  Tab/Escape và focus return trong dialog, action chuyển góc học viên đưa focus đúng nơi.
- Cả hai hướng vẫn đọc được khi tắt JS, FAQ native, link demo; query được server map
  từ hai tên cố định nên B không flash palette A và không phụ thuộc JS để lên đúng style.
- Reduced motion: không active animation khi đi qua trang; action học viên vẫn chạy.
- Trang trước `/story.html`, brand, demo B1-A còn mở được. Các link roster/profile/
  calendar/chat/học viên được kiểm bằng entry navigation mới vào đúng trang/role.
  Không kiểm chứng hash-only navigation bên trong B1-A hoặc sửa B1-A.
- 0 pageerror, 0 HTTP asset lỗi, 0 request ra ngoài server trong lượt suite.
- `node --check`: `design.js` và server `landing-v2/serve.cjs` qua.
- Source lint: HTML/page CSS/JS không finding; `ui.css` kiểm app-mode không finding.
  UI dividers là bảng/ledger/biên vùng dữ liệu; không dùng app-mode để bỏ kiểm toàn trang.
- Inspector: A 0 FAIL/3 WARN; B 0 FAIL/4 WARN tại 1440/768/390.
  Cảnh báo giữ có giải thích bên dưới, không tự thêm allow để che lỗi.
- Đã xem ảnh desktop/mobile cả hai hướng, tablet fold, và đoạn heading B sau sửa.
  8 viewport captures đo headline hai dòng, không overflow, font Be Vietnam Pro.
- Sau suite, chỉ sửa khoảng trắng của heading B khi bỏ br trên desktop. Chạy
  `final-check.cjs` lại cả tám tổ hợp: heading đúng, không overflow, headline hai dòng;
  kiểm thêm Shift+Tab ở dialog. Không nhận đã chạy lại toàn bộ axe sau sửa whitespace.
- `git diff --check` qua. `git diff --name-only -- apps supabase` rỗng.
  Không reset, commit, push, deploy, seed/migration hoặc đọc dữ liệu sức khỏe thật.

## Phát hiện và sửa

- B headline 3 dòng ở 1440 → display tối đa 100px, giữ leading cho dấu tiếng Việt.
- Caption/control quá nhỏ → tăng dưới 13px lên 13px, xem lại cả 320px.
- Khi bật nút xác nhận, transition màu tạo trạng thái contrast 3.35:1 → bỏ transition
  background; chạy lại suite đầy đủ, không chỉ đợi animation kết thúc trong test.
- Native Tab có thể focus body tại mép dialog → thêm vòng Tab/Shift+Tab có xét disabled.
- B ẩn br làm dính hai từ → thêm khoảng trắng, kiểm lại ở cả tám viewport.

## Cảnh báo và giới hạn

- A/B dùng paper/bone nên palette-cream có cảnh báo: đây là hai đề xuất màu chủ động
  để so sánh, vẫn kiểm tương phản. Không coi nó là màu đã duyệt hoặc màu tốt nhất.
- A không ảnh người; B chỉ một minh họa AI, scanner không phân biệt ảnh AI/ảnh thật.
  Cả hai không footage. Không dùng video riêng hoặc ảnh stock để đủ quota scanner.
- B có 10 cỡ chữ tính cả dữ liệu UI và mobile; marketing giữ hierarchy display/head/
  lead/body/small. Có thể thống nhất thêm sau khi chọn hướng, chưa chốt design system root.
- Browser là Chromium với viewport/touch giả lập. Chưa test Safari, máy Android/iPhone
  thật, screen reader thủ công hoặc PT thật. Không có chứng cứ tăng conversion.
- Tài nguyên hình/font/logo dùng lại file dự án có nguồn; không mang asset đối thủ vào.
- Chưa đổi website chính. Mọi hồ sơ, chỉ số, giờ, số buổi và lời trao đổi là fixture.
