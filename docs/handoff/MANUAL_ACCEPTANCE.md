# Nghiệm thu web theo từng vai trò

Huy/Khai dùng checklist này khi nhận baseline và sau mỗi PR. Đây là kịch bản cần thao tác, không phải tuyên bố tất cả trạng thái đã được xem bằng tay. Bằng chứng tự động và phần chưa kiểm nằm ở [UI_ACCEPTANCE](UI_ACCEPTANCE.md).

## Chuẩn bị một lần

Dùng stack synthetic riêng theo [runbook](DEVELOPER_RUNBOOK.md). Mở ba phiên riêng: PT A, học viên A và PT B ngoài quan hệ. Chưa dùng dữ liệu khách hàng. Kiểm 1440px desktop, 768px tablet, 390px và 320px phone; phone emulation không thay Android thật. Chạy từng người bằng session thông thường, không service-role.

Ghi commit, browser/width, flags, trạng thái migrations và các lỗi console. Không ghi key, token mời, signed URL hoặc dữ liệu sức khỏe lên issue. Khi lỗi, ghi bước tái hiện, expected/actual và ảnh đã rà; không chỉ ghi “không chạy”.

## Landing, auth và lời mời

- [ ] Landing CTA chính đưa đến đăng ký thật; tour được nhận biết là mẫu
- [ ] Nội dung không hứa APK, live OCR/full PDF, checkout hoặc tính năng còn target
- [ ] Đăng ký PT, đăng nhập, refresh và logout hoạt động; role không do form tự chọn
- [ ] PT tạo hồ sơ; hồ sơ chưa liên kết có trạng thái đúng và ghi chú chỉ private
- [ ] Học viên nhận mời trong browser riêng, đặt mật khẩu và liên kết đúng hồ sơ
- [ ] Link đã nhận không tạo người liên kết thứ hai; link sai/hết hạn không lộ hồ sơ
- [ ] Môi trường thiếu config/lỗi mạng có thông báo và không fake success

Email delivery, reset/reissue và các trạng thái production chưa hoàn tất được theo dõi ở AUTH-DELIVERY. Phân biệt ca SQL về expiry với thao tác thật qua email staging.

## PT: tra cứu và tiếp nhận

- [ ] Roster tìm/lọc được, empty state có hành động phù hợp, tên dài không phá layout
- [ ] Hôm nay chỉ hiện lịch/check-in/trạng thái có dữ liệu, không unread/streak giả
- [ ] Hồ sơ có năm tab, click và Left/Right/Home/End đổi đúng phần
- [ ] Deep link notes/intake/membership mở đúng pane; nút browser back không gây mất ngữ cảnh khó hiểu
- [ ] Draft chưa lưu vẫn còn khi chuyển tab; validation không xóa dữ liệu đang nhập
- [ ] Nhập tay, PT xác nhận và reload giữ record; nguồn OCR/manual hiển thị đúng
- [ ] Với hai record, chart đổi weight/SMM/PBF, có unit/ngày và bảng số liệu thay thế
- [ ] Không dữ liệu và một record không có đường xu hướng hoặc nhận xét bịa

## Học viên: chỉ xem phần của mình

- [ ] Home có ngày check-in, lịch sắp tới hoặc empty state, membership và ghi chú shared
- [ ] Home chỉ giữ bản đo gần nhất; Tiến trình mở đầy đủ history của chính mình
- [ ] Không nhận private note, roster hoặc form PT trong response, không chỉ ẩn CSS
- [ ] Check-in/ảnh bữa ăn xuất hiện với PT đúng; người ngoài không đọc media
- [ ] Check-in không tự giảm số buổi PT; upload fail không được báo đã lưu ảnh
- [ ] Thanh điều hướng phone mở Home/progress/calendar/chat, không che nút cuối trang

## Membership và ghi chú

- [ ] Membership có ngày bắt đầu/kết thúc, end tính bao gồm ngày đó, history revision
- [ ] Đổi ngày không sửa số buổi PT hoặc tạo giao dịch thanh toán
- [ ] Hai phiên PT sửa cùng revision: một lần lưu thành công, lần cũ báo conflict để review
- [ ] Note mặc định private; shared yêu cầu lựa chọn rõ, learner đã liên kết mới nhận
- [ ] Retry sau mất phản hồi không tạo note/member revision trùng
- [ ] Chuyển identity/archive/relink không cấp quyền theo quan hệ đã hết hiệu lực

Legacy health/media còn cần kiểm riêng theo LEGACY-AUTH. Không suy ra kết quả toàn schema từ một ca chat hoặc note.

## Chat và lịch dùng chung

- [ ] PT gửi, learner đọc/trả lời, reload hai bên giữ hội thoại
- [ ] Cuộn tin cũ không bị polling kéo xuống; gửi tin mới hiện đúng trong history mới nhất
- [ ] Mất phản hồi sau commit: giữ draft/retry, DB chỉ có một message
- [ ] Lịch PT tạo hiện cùng ID/thời gian cho learner; không bắt tạo bài tập
- [ ] Trùng giờ PT hoặc learner bị từ chối; khung kề nhau được phép
- [ ] Hai lần đặt đồng thời cùng range chỉ một thành công; lỗi giữ form/lịch cũ
- [ ] Booking không giảm số buổi; learner không có quyền ghi đè lịch
- [ ] PT B không đọc thread/dossier/lịch A bằng URL/direct API

Đổi/hủy lịch, completion, ledger, media chat và read receipt chưa có trong baseline. Không đánh fail một nút target chưa triển khai; ghi issue đúng phạm vi và không thêm mock để đánh dấu xong.

## Thiết kế, accessibility và trạng thái

- [ ] Brand, type, token, hình dạng controls và language nhất quán với DESIGN.md
- [ ] Không page overflow ở các widths; bảng/tab dài có scroll riêng dễ nhận biết
- [ ] Tab keyboard có focus rõ, form label/error liên kết được, submit pending tránh nhấn lặp
- [ ] Reduced motion được tôn trọng; zoom/text spacing/screen reader được ghi kết quả riêng
- [ ] Loading, empty, denied, validation, retry, stale conflict và server error có cách xử lý
- [ ] Admin ghi rõ sample OC2; không trộn với dashboard chủ gym/billing thực

Safari/Firefox, screen reader, native camera/keyboard, reconnect/background Android cần bằng chứng bổ sung. Không ghi PASS nếu chỉ suy ra từ CSS hoặc Chromium desktop.

## Biên bản reviewer

Ghi vào issue/PR: commit và môi trường, test đã chạy, các bước checked, defects còn lại và quyết định accept/request changes. Huy review grants/data migration; Khai review interactions/layout. Chủ sản phẩm xử lý business rules còn mở. Không đóng toàn roadmap khi chỉ nhận baseline.
