# FitSync — coaching specimen

Ngày 2026-10-30. Owner yêu cầu thực hiện specimen và nói khá thích Gentler Stories.
Phạm vi: thử ngôn ngữ thiết kế qua hero, hồ sơ và sheet; không phải website đã phát hành.

- [Mở specimen](http://127.0.0.1:3102/coaching/), hoặc root `http://127.0.0.1:3102/`.
- [Bản A/B cũ](http://127.0.0.1:3102/directions/).
- [Bản story cũ](http://127.0.0.1:3102/story.html), [brand cũ](http://127.0.0.1:3102/brand.html).
- [B1-A](http://127.0.0.1:3102/demo/#pt/today) vẫn cùng server.

```powershell
node docs/prototypes/landing-v2/serve.cjs
```

Thử đổi góc PT/học viên, mở buổi hẹn ở hero hoặc hồ sơ; mở trao đổi rồi bấm cuộc hẹn;
nhấn “Thử mở bản nháp” để xem sheet và gate kiểm duyệt. Mọi trạng thái ở memory.
Nhấn Escape hoặc Đóng chi tiết để về đúng thao tác trước đó.

## Hướng thiết kế

[DESIGN.md](DESIGN.md) ghi plan trước code, giới hạn và phần học từ Gentler.
Ảnh người được tạo riêng; liên kết đôi và dấu buổi hẹn lặp lại ở các lớp giao diện.
Một entrance ở appointment; motion còn lại phục vụ mở sheet. Không slide-up mọi section.
Sheet sang từ phải desktop, từ dưới trên phone. Chart đo theo kích thước thực của vùng vẽ;
nhãn 13px, không scale chữ nhỏ theo SVG desktop. Phone hẹp chỉ in ngày, có ghi tháng rõ.

Font Be Vietnam Pro tự host và license dùng lại từ `landing-v2/assets/fonts/`.
Biểu tượng liên kết/fav SVG code gốc, chỉ là đề xuất nhận diện; không tra cứu nhãn hiệu.
`assets/mark.svg` đồng bộ màu với specimen, không thay logo website chính.

## Ảnh minh họa

Built-in imagegen; final prompt đầy đủ: [IMAGE_PROMPT.md](IMAGE_PROMPT.md).
Asset dự án: `assets/coaching-afternoon.png` (1774×887, 2.217.490 byte).
SHA-256: `E369E68D82F88EFF3B2C012B44100F45FBB79C93D2F477F21AA37A01A6C2CA85`.
Nguồn gốc được giữ nguyên tại Codex generated_images; bản sử dụng đã copy vào repo.
Ảnh là nhân vật AI giả định, caption và alt ghi rõ, không phải ảnh khách hàng hoặc
bằng chứng sản phẩm. Không dùng ảnh/video riêng hoặc asset của Gentler.
PNG chưa tối ưu AVIF/WebP cho production; không cài dependency mới để nén.

[Kiểm tra thực chạy và review](VERIFICATION.md). Website Next.js, database và root
DESIGN.md không đổi. Không push/deploy. Bản A/B chỉ sửa href để giữ hoạt động dưới
`/directions/` sau khi root chuyển sang specimen; không ghi đè thiết kế cũ.
