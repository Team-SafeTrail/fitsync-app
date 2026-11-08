# FitSync landing V2 — brand và redesign hoàn chỉnh để duyệt

> Root 3102 hiện phục vụ [coaching specimen](../coaching-specimen/README.md).
> [Hai hướng V3](../landing-v3/README.md) giữ tại `/directions/`.
> Bản story V2 giữ tại [story.html](http://127.0.0.1:3102/story.html).

Ngày 2026-10-30. Được dựng mới sau khi chủ sản phẩm yêu cầu redesign toàn bộ,
tham khảo đối thủ và sản phẩm SaaS, chọn style brand trước và tạo logo tối giản.

Không phải bản đổi màu B1-A. Không thay app Next.js, database, DESIGN.md, video,
giá hoặc phạm vi sản phẩm. Không push/deploy. B1-A cũ được giữ nguyên.

```powershell
node docs/prototypes/landing-v2/serve.cjs
```

- [Landing V2](http://127.0.0.1:3102/story.html)
- [Hướng nhận diện và logo](http://127.0.0.1:3102/brand.html)
- Server chỉ bind 127.0.0.1, whitelist tài nguyên static. `/demo/` phục vụ bản
  B1-A cùng máy, không cần server 3101. Không có API hoặc endpoint nhận dữ liệu.
- Có thể mở `index.html` offline để xem landing; `/demo/` và link `/` cần server.

Bản hiện tại đã chuyển sang câu chuyện một buổi tập. Hướng thiết kế và tiêu chí
back-check: [DESIGN.md](DESIGN.md). Kết quả mới: [STORY_VERIFICATION.md](STORY_VERIFICATION.md).
`VERIFICATION.md` lưu lượt trước, không phải bằng chứng chạy lại cho bản story.

## Những gì có thể thử

1. Hero: chọn Rời rạc / Sẵn sàng / Đồng hành hoặc chạy/dừng câu chuyện một lần.
   Theo cùng buổi hẹn của Linh. Mở “Khám phá giao diện PT đầy đủ” để thử hồ sơ/lịch/tiến triển.
2. Lịch: gửi đề nghị 16:30, thấy giờ 16:00 giữ nguyên; PT chấp nhận thì lịch và
   thẻ chat trên trang cùng đổi. Đây là trạng thái minh họa, không sửa buổi hẹn thật.
3. Mở “Trao đổi với Linh”: gửi tin mẫu, chỉ giữ trong bộ nhớ trang, escape bằng textContent.
4. Phiếu mẫu: checkbox đối chiếu mới bật xác nhận; không có OCR/upload/provider.
5. Menu phone, FAQ, native dialog Escape/focus; tải các logo SVG ở trang brand.

## Tài nguyên và provenance

- Logo gốc: `assets/mark.svg`, phiên bản ink/trắng. SVG đơn sắc vẽ bằng path,
  không AI raster, không hình tạ/cơ bắp/ECG. Chưa phải logo đã duyệt hoặc tra cứu nhãn hiệu.
- Wordmark sống dùng Be Vietnam Pro. Logo download là biểu tượng SVG, không
  giả nhận wordmark đã chuyển thành vector outline.
- Font Be Vietnam Pro tải từ Google Fonts, tự host; giữ giấy phép SIL OFL,
  nguồn và SHA-256 trong `assets/fonts/`. Không có request font bên ngoài lúc xem.
- Ảnh `coaching-editorial.webp` sao chép từ asset minh họa AI sẵn có của dự án
  (2026-09-27), nhân vật giả định; caption ghi rõ, không phải ảnh khách hàng.
- Không dùng ảnh/screenshot/code của đối thủ trong thiết kế. Tất cả UI trong
  landing là HTML/SVG riêng, số liệu giả có cùng ngữ cảnh và có nhãn minh họa.
- Không có testimony, số khách hàng, ROI, giá/trial hay nút tải APK giả.

Lập luận brand, nghiên cứu và copy deck: [BRAND_DIRECTION.md](BRAND_DIRECTION.md).
Kiểm tra thực chạy và phần còn hạn chế: [VERIFICATION.md](VERIFICATION.md).
