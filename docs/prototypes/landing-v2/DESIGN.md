# FitSync landing — một buổi tập, một câu chuyện

Ngày 2026-10-30. **Hướng thiết kế landing để duyệt**, theo yêu cầu chủ sản phẩm
kể chuyện rõ hơn và làm trang có điểm riêng. Không thay `DESIGN.md` ở root,
phạm vi PRD, định giá, auth, database hoặc xác nhận phát hành.

## Ý tưởng trung tâm

**Trước khi PT và học viên gặp nhau, những thông tin cần nhớ đã gặp nhau.**

Theo cùng học viên Khánh Linh và cùng buổi hẹn 16:00 qua cả trang. Khởi đầu từ
ghi chú rời rạc, chuyển sang hồ sơ PT đã chuẩn bị, rồi tới phần học viên được thấy.
Kết thúc bằng khoảnh khắc PT dành sự chú ý cho học viên. Không đổi tên/đối tượng
hoặc nhồi thêm dashboard giữa các đoạn.

Điều quan trọng: đây là cách tổ chức công việc, không minh họa tính năng tự kết nối
Zalo/Excel hoặc tự nhập dữ liệu từ mọi nguồn. Các chỉ số trong hồ sơ đã có xác nhận
giả lập; bước kiểm duyệt report vẫn được diễn giải riêng. Không có outcome sức khỏe,
con số tiết kiệm thời gian hoặc lời chứng thực được tự tạo.

## Câu chuyện và composition

| Nhịp | Câu hỏi của người xem | Hình thức |
| --- | --- | --- |
| Hero | Trước buổi tập, tôi đang tìm gì? | Tiêu đề ngắn + cảnh tương tác ba trạng thái; các mảnh công việc trở thành hồ sơ |
| Chuẩn bị | Mở hồ sơ thì nhớ được điều gì? | Mốc thời gian 5 phút trước buổi, ghi chú cụ thể; toàn bộ UI mở theo nhu cầu |
| Dữ liệu | Có thể tin số liệu này từ đâu? | Đối chiếu nguồn và draft trên nền tối, số theo vùng mở thêm thay vì nhét cả phiếu |
| Chốt lịch | Nếu học viên đổi giờ thì sao? | Agenda và thẻ chat cùng cập nhật sau xác nhận; có thao tác thử rõ ràng |
| Đồng hành | Học viên có bị thấy ghi chú nội bộ? | Phần học viên tách với phần nội bộ; lịch và số đo được chia sẻ có nguồn |
| Đi tập | Mọi thứ gom lại để làm gì? | Ảnh minh họa PT/học viên của dự án, lời mời tập trung vào buổi tập |

Không kéo dài một layout chia đôi qua mọi đoạn. Hero là cảnh chuyển trạng thái;
chuẩn bị là mốc giờ; report là bàn đối chiếu; lịch là đối thoại; kết là khung cảnh người.
Trên phone: một tình huống mỗi lần, chữ đọc được, mở chi tiết chủ động, không thu nhỏ desktop.

## Nhận diện

Giữ logo hai nét kết nối, cobalt `#2453E5`, ink `#182120`, paper `#F8F9F7`, mist
`#EDF0EE`, font Be Vietnam Pro tự host. Điểm riêng lần này đến từ sự liên tục của
thông tin và cách chuyển cảnh, không phải đổi thêm một bảng màu.

Mỗi nguồn có hình thức thực: tin nhắn, bảng chỉ số và ghi chú. Độ nghiêng/độ sâu
chỉ dùng cho các mảnh công việc, không thêm blob, lưới chấm, kính, glow hoặc 3D trang trí.
Nét kết nối của logo được hiểu thành việc cùng giữ một ngữ cảnh; không khẳng định
ý tưởng này độc quyền hoặc người dùng đã thích nó.

## Motion có công dụng

- Nhấn chuyển cảnh: mảnh dữ liệu gom về hồ sơ; chuyển góc PT sang học viên.
- Có thể tự chọn từng cảnh, chạy câu chuyện một lần, dừng và xem lại. Không loop,
  không chiếm scroll, không bắt người xem chờ mới đọc được headline/giá trị.
- Chuyển trạng thái dùng transform, giữ chữ có contrast đầy đủ. Tránh fade cả chữ
  hoặc panel khiến axe đọc được trạng thái thiếu tương phản như lượt trước.
- `prefers-reduced-motion`: đổi ngay sang cảnh được chọn, không phát tự động.
  Không JavaScript: có ảnh tĩnh hồ sơ PT và các phần nội dung vẫn đọc được.
- Bấm liên tục không để timer cũ phục hồi cảnh sai; dừng khi tab bị ẩn hoặc người
  dùng tự chọn cảnh. Không gọi nhà cung cấp hoặc lưu dữ liệu.

## Tham khảo và điều thực sự đã kiểm tra

Lead: design-taste-frontend, direction `product-performs`; giữ palette/type đã chọn.
Quy tắc là khung kiểm tra, không dùng điểm scanner làm chứng nhận thẩm mỹ.

- [Granola](https://www.granola.ai/): đọc nguồn chính thức và mở browser; học cách
  cho thấy thông tin thô trở thành đầu ra có ích. Không mang tính năng AI của họ sang FitSync.
- [Raycast](https://www.raycast.com/): đọc nguồn và mở browser; học cách một vật thể
  xuyên suốt tạo cá tính cho các phần. Không lấy hiệu ứng, phím tắt hay asset của họ.
- [Everfit](https://everfit.io/) và [Linear](https://linear.app/): đọc lại trang hiện
  tại; giữ ghi nhận browser trước đó riêng, không báo là vừa browser-review lần nữa.

Ảnh người duy nhất là `coaching-editorial.webp` sẵn có trong dự án: minh họa AI
ngày 2026-09-27, nhân vật giả định, không phải ảnh khách hàng. Không dùng video riêng.

## Tiêu chí back-check

1. Năm giây đầu có hiểu FitSync dành cho PT và giải quyết việc gì không?
2. Ba trạng thái kể cùng một buổi hẹn, không thay đổi/đánh mất dữ liệu hoặc quyền?
3. Người xem có thể chọn, dừng và xem lại bằng touch/keyboard không?
4. Chữ/controls rõ ở 320, 390, 768 và 1440px; không page overflow hoặc chồng chữ?
5. Lịch cũ còn nguyên khi có đề nghị; chỉ số chưa xác nhận không giả thành đã chia sẻ?
6. Ảnh, caption, CTA và trạng thái OCR/Android trung thực?
7. Duyệt hình sau sửa, ghi phần còn yếu; không tuyên bố đây là thiết kế tốt nhất.
