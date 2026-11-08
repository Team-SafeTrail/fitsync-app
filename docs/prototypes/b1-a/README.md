# FitSync B1-A — prototype để duyệt luồng

Ngày: 2026-10-30. **Bản mẫu tương tác, chưa phải tính năng đã triển khai.**

Mở `index.html` trực tiếp trong trình duyệt, hoặc chạy từ repository root:

```powershell
node docs/prototypes/b1-a/serve.cjs
```

Mở [bản mẫu local](http://127.0.0.1:3101). Server chỉ phục vụ các file trong thư
mục prototype, bind 127.0.0.1; Ctrl+C trong terminal để dừng. Nếu chạy qua Codex,
dùng PID của đúng listener 3101 sau khi kiểm tra command line để dừng.

Không cần npm install, tài khoản, Supabase hoặc provider. Không gọi network API,
không upload file và không lưu localStorage. Dữ liệu giả trong bộ nhớ mất khi reload;
nút “Đặt lại” đưa toàn bộ tình huống về ban đầu. Không nhập dữ liệu cá nhân/thật.

## Cách xem

1. **Lịch → hồ sơ → chat:** ở vai PT, mở Khánh Linh từ buổi 16:00, xem ghi chú và
   InBody, mở trao đổi; gửi tin rồi chuyển vai Học viên để xem cùng cuộc trò chuyện.
2. **Đổi lịch:** vai Học viên mở lịch, đề nghị giờ mới; chuyển về PT để chấp nhận.
   Trong lúc chờ, giờ cũ giữ nguyên. Buổi hẹn trong chat và lịch dùng cùng dữ liệu.
3. **Buổi PT:** vai PT mở buổi hẹn và ghi nhận hoàn thành. Xem gói tập: số buổi trừ
   một lần và có dòng lịch sử; thao tác lại không trừ thêm. Tự tập không trừ gói.
4. **Tiếp nhận → InBody:** vai PT chọn “Thêm học viên”, tạo hồ sơ giả không cần
   email; chọn ảnh/PDF mẫu, đối chiếu chỉ số toàn thân/từng vùng/mở rộng và xác nhận.
5. **Lỗi và phần thiếu:** ở ô “Tình huống” chọn thiếu trường hoặc OCR chưa sẵn sàng;
   thử lưu khi thiếu số và tiếp tục nhập tay. Đánh giá cách phục hồi, không đo OCR.
6. **Học viên nhận dữ liệu:** từ hồ sơ PT chọn “Mời học viên”, mô phỏng nhận lời mời;
   xem chỉ số đã xác nhận. Ghi chú nội bộ và draft không xuất hiện cho học viên.
7. **Hướng landing:** chọn “Hướng landing” trên thanh xem mẫu. Đây là concept nội
   dung và bố cục; CTA chỉ mở luồng giả lập, không phải đăng ký thật.

Thanh trên cùng là công cụ review (đổi vai/tình huống/reset), không nằm trong app
thương mại. Theo phản hồi tiếp theo, bản mẫu đã thử nền sáng/xanh teal qua
`refresh.css`; chưa đổi DESIGN.md hoặc ứng dụng thật. Font Segoe UI/system fallback
để mở offline; chưa chốt font hoặc visual direction cuối.

Hồ sơ và Today của học viên có chart tiến triển: chọn cân nặng/tỷ lệ mỡ/cơ xương,
mở “Xem số liệu từng lần đo” để đối chiếu. Chỉ dữ liệu giả đã xác nhận xuất hiện;
draft chưa chia sẻ. Landing có khung riêng, ba góc xem sản phẩm có thể chuyển.

Helper biểu đồ được chỉnh từ asset local của taste-skill, thêm trục thời gian và
accessible label giữ nguyên sau redraw; giấy phép MIT ở [CHARTS-LICENSE.txt](CHARTS-LICENSE.txt).

Đọc [đặc tả B1-A](B1_A_SPEC.md) cho sitemap, quyền, trường dữ liệu, trạng thái,
giả định và quyết định cần duyệt. Xem [blueprint](../../plans/FITSYNC_REBUILD_BLUEPRINT.md)
và [review website](../../reviews/FITSYNC_WEBSITE_REVIEW_2026-10-30.md) để đối chiếu.

Các kiểm tra đã chạy và giới hạn được ghi trong [VERIFICATION.md](VERIFICATION.md).
