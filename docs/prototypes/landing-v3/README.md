# FitSync visual directions — prototype để duyệt

Hai trang dùng chung nội dung để so sánh **bố cục và ngôn ngữ thiết kế**:

- [A · Studio](http://127.0.0.1:3102/directions/?direction=studio)
- [B · Thể thao](http://127.0.0.1:3102/directions/?direction=field)
- [Bản story trước](http://127.0.0.1:3102/story.html)
- [Bản mẫu luồng B1-A](http://127.0.0.1:3102/demo/#pt/today)

Chạy chung server local đã có:

```powershell
node docs/prototypes/landing-v2/serve.cjs
```

Root 3102 hiện phục vụ [coaching specimen](../coaching-specimen/README.md).
Bản V3 giữ tại `/directions/` và `/design/`. Route `/story.html` giữ nguyên
nội dung bản V2; `/brand.html` và `/demo/` vẫn hoạt động. Tài nguyên mới dưới `/design/`.
Server chỉ bind 127.0.0.1, không upload/API và không ghi dữ liệu người dùng.
Query `direction` chỉ chọn một trong hai tên cố định. Asset whitelist giữ nguyên
nguyên tắc; không phục vụ toàn bộ repo. Không deploy hoặc sửa app/database.

Thử: đổi hướng bằng thanh trên đầu; đổi góc nhìn PT/học viên; mở dialog đối chiếu,
chọn checkbox và xác nhận mẫu; mở FAQ hoặc đi tới B1-A. Mọi dữ liệu là fixture.

[Hướng thiết kế](DESIGN.md) · [Kiểm tra thực chạy](VERIFICATION.md) · [Đánh giá hình render](REVIEW.md).
Font và license dùng lại Be Vietnam Pro tự host từ `landing-v2/assets/fonts/`.
Logo SVG giữ bản đề xuất trước; ảnh AI dùng lại asset dự án, có nhãn.
