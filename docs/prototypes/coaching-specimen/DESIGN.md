# FitSync — coaching specimen

Ngày 2026-10-30. Chủ sản phẩm yêu cầu thực hiện specimen sau nghiên cứu và cho biết
thích Gentler Stories. Đây là thử nghiệm ngôn ngữ thiết kế, chưa duyệt website chính.
Lead: frontend-design. Imagegen chỉ tạo ảnh minh họa; không thay quyết định về UI.

## Ý tưởng và tokens trước khi code

Cảm giác: một nơi làm việc bình tĩnh, có con người và đủ chuyên nghiệp để PT dùng.
Vật thể nhận diện: cùng một cuộc hẹn đi qua PT, học viên và hồ sơ; hai đầu kết nối
được biểu thị bằng một nét đôi và dấu buổi hẹn. Không heart, mascot hay health score.

- Forest `#143E38`: ink/brand; deep `#102E2A`: khu vực tương phản và scrim ảnh.
- Snow `#F5F8F6`: nền đọc; white `#FFFFFF`: sheet dữ liệu.
- Apricot `#FFD29C`: CTA trên ảnh; jade `#226C5D`: đường dữ liệu và tương tác.
- Type: Be Vietnam Pro tự host, headline 500 với tracking -0.045em, body 400,
  metadata 500; số tabular. Kiểm tra dấu tiếng Việt ở 320px, không ép leading.
- Layout: hero có ảnh riêng phủ nền; lời dẫn và appointment specimen chồng trong
  cùng bối cảnh, không title bên trái và ảnh screenshot desktop bên phải.
- Hồ sơ là một mặt phẳng với timeline và nhóm số đo; controls yên, dữ liệu nổi.
- Sheet giữ cấu trúc bảng/nguồn, desktop từ bên phải, phone từ dưới; mở theo ý người xem.
- Một loại dấu kết nối lặp trong logo, cuộc hẹn và timeline. Chữ/số không chuyển
  thành đồ trang trí, không dùng nét biểu đồ tùy hứng làm health claim.

```text
┌ nav trắng trên ảnh ─────────────────────────┐
│ lời dẫn         con người trong phòng tập   │
│ CTA              cuộc hẹn cùng PT/học viên  │
└────────── một buổi hẹn là điểm nối ──────────┘
        lời dẫn ngắn, chuyển sang nền đọc
┌ hồ sơ mở ────────── PT / học viên ───────────┐
│ tên / mục tiêu   | lịch sử / số đo / ghi chú │
└────────────────────┬───────────────────────┘
              mở sheet nguồn/chi tiết
```

## Review plan với phản hồi trước khi code

Bỏ thiết kế A/B một theme cho mỗi màu. Ảnh hero mới là bối cảnh kể bằng thị giác,
không dùng lại ảnh tablet của các lượt trước. Phần sản phẩm không lặp grid cards
cho mọi thông tin. Chỉ một tương tác nhận diện: buổi hẹn/hồ sơ mở chi tiết và giữ
cùng ngữ cảnh. Không rải slide-up lên toàn trang. Chiều sâu chỉ cho lớp đang mở.

Điều học từ Gentler là kết nối bối cảnh đời sống với sản phẩm và cảm giác gần gũi.
Hình ảnh, logo, layout chi tiết, palette và dữ liệu đều của FitSync; không lấy asset,
mascot, heart, copy, huy chương hoặc thuật toán sức khỏe của họ. Xem nguồn chính thức:
https://gentlerstories.com/gentlerstreak . Đã quan sát browser ở lượt nghiên cứu trước,
đọc lại nguồn web lượt này; không nhận vừa audit motion/UX toàn website họ.

## Phạm vi

Hero, một hồ sơ PT/học viên và một sheet chi tiết có thể tương tác. Hồ sơ Khánh Linh,
PT Anh Nam, 16:00, 8/12 buổi, số đo và trao đổi đều giả. Không persist, upload, OCR thật,
API hoặc auth. Không app store, pricing hay outcome claim. Root DESIGN.md và app/database
không đổi. Bản A/B và story trước được giữ đường dẫn riêng.
