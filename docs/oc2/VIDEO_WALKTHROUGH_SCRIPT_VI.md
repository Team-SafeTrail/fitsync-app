# Kịch bản video FitSync Outcome 2 — 04:15

## Điều kiện quay bản final

Có thể tập lời và quay bản nháp ngay. Chỉ quay/upload bản final khi đủ các điều kiện sau:

- URL Vercel production mở được ở tab ẩn danh và trả HTTP 200.
- PR #26 (`094c5ee`) và recovery PR #29 (`e1b03ad`) đã được review, merge đúng thứ tự; commit đang quay phải là `e1b03ad` hoặc một bản sửa mới đã được review.
- Supabase project FitSync đã chạy đủ năm migration, có seed synthetic và tài khoản demo dùng được.
- ERD PNG/PDF của Toàn đã có link view-only.
- Mọi ảnh sức khỏe, bữa ăn, tên, email và giao dịch xuất hiện trong video đều là synthetic.

Mục tiêu đọc tự nhiên, không cần đọc quá nhanh. Nếu thao tác chậm, cắt thời gian chờ tải trang thay vì tăng tốc lời thoại.

## 00:00–00:25 — Bối cảnh và landing page

**Màn hình:** Mở URL production bằng tab ẩn danh. Cuộn hero, vấn đề, giải pháp; không mở DevTools hoặc tab chứa bí mật.

**Lời nói:**

> Xin chào Thầy và các bạn. Nhóm SafeTrail xin trình bày FitSync, một nền tảng hỗ trợ huấn luyện viên cá nhân quản lý học viên, dữ liệu InBody và hoạt động check-in trên cùng một quy trình. Ở Outcome 2, nhóm tập trung hoàn thiện luồng sản phẩm có thể kiểm thử, cơ chế phân quyền dữ liệu và bộ hồ sơ nghiệm thu minh bạch.

## 00:25–00:45 — Team, liên hệ và trạng thái sản phẩm

**Màn hình:** Cuộn tới Team SafeTrail, khối liên hệ và CTA Android.

**Lời nói:**

> Landing page giới thiệu đầy đủ năm thành viên SafeTrail, kênh hỗ trợ và định hướng ứng dụng Android. Nút APK hiện là hạng mục thử nghiệm; nhóm chỉ mô tả đúng trạng thái đã kiểm chứng và không xem roadmap là tính năng production.

## 00:45–01:15 — Đăng nhập và PT Workspace

**Màn hình:** Mở `/login`, đăng nhập bằng tài khoản PT demo từ kênh bí mật, vào `/workspace`. Không để trình quản lý mật khẩu hoặc mật khẩu xuất hiện trong bản quay.

**Lời nói:**

> Sau khi đăng nhập, huấn luyện viên được đưa vào PT Workspace. Đây là khu vực làm việc chính để theo dõi danh sách học viên, trạng thái buổi tập, lịch sử InBody và cảnh báo tương tác. Dữ liệu giữa các PT được cách ly bằng Row Level Security trong Supabase, thay vì chỉ ẩn bằng giao diện.

## 01:15–01:42 — Tạo học viên và lời mời

**Màn hình:** Tạo một học viên synthetic hoặc mở học viên đã seed. Cho thấy trạng thái lời mời nhưng che raw invitation token khỏi video.

**Lời nói:**

> PT có thể tạo hồ sơ học viên trước khi học viên có tài khoản. Khi cần liên kết đăng nhập, hệ thống phát hành lời mời một lần. Cơ sở dữ liệu chỉ lưu hash SHA-256 của token; token thô không được ghi vào báo cáo hoặc ảnh minh chứng.

## 01:42–02:10 — Check-in và ảnh bữa ăn

**Màn hình:** Chuyển sang màn hình học viên, tạo check-in và chọn một ảnh synthetic. Sau khi lưu, mở lại lịch sử hoặc thumbnail bằng signed URL.

**Lời nói:**

> Ở phía học viên, người dùng có thể check-in mỗi ngày, thêm ghi chú và ảnh bữa ăn tùy chọn. Ảnh trong phần trình diễn là dữ liệu synthetic. File được lưu trong bucket private, giới hạn định dạng và dung lượng, còn quyền xem được cấp bằng URL ký có thời hạn ngắn.

## 02:10–02:43 — InBody và OCR có kiểm soát

**Màn hình:** Mở hồ sơ học viên, hiển thị lịch sử InBody. Nếu OCR chạy ổn định trên production thì upload ảnh synthetic, xem draft rồi xác nhận; nếu không, trình diễn nhập tay và nói OCR là prototype.

**Lời nói:**

> FitSync hỗ trợ lưu các chỉ số InBody như cân nặng, khối cơ xương, khối mỡ, phần trăm mỡ và lượng nước cơ thể. Các miền giá trị và quan hệ chéo được kiểm tra trong database. OCR, khi được bật, chỉ tạo bản nháp không đáng tin cậy. PT phải kiểm tra và xác nhận thì hệ thống mới tạo bản ghi InBody chính thức; nhập tay luôn là phương án dự phòng.

## 02:43–03:00 — Cảnh báo và Zalo handoff

**Màn hình:** Hiển thị học viên warning do đủ ba ngày không check-in và nút/shortcut liên hệ.

**Lời nói:**

> Khi học viên không check-in đủ ba ngày theo múi giờ Việt Nam, workspace hiển thị trạng thái cảnh báo để PT chủ động chăm sóc. FitSync chỉ hỗ trợ handoff sang kênh liên hệ; nhóm không tuyên bố hệ thống tự động gửi Zalo khi chưa có tích hợp production.

## 03:00–03:43 — Admin Portal

**Màn hình:** Đăng xuất PT, đăng nhập admin demo và mở `/admin`. Quay banner disclosure, KPI, bảng người dùng và khu vực VietQR. Sau đó thử mở `/admin` bằng tài khoản non-admin hoặc dùng clip test riêng để chứng minh bị chuyển về `/workspace`.

**Lời nói:**

> Admin Portal chỉ mở cho tài khoản có role admin đã xác thực. Tài khoản thường không thể sử dụng đường dẫn này. Ba KPI về PT, học viên và InBody được đọc từ Supabase khi production đã cấu hình service role ở phía server. Bảng chi tiết và các giao dịch VietQR đang là kịch bản synthetic, được gắn nhãn ngay trên màn hình; chúng không phải người dùng thật, thanh toán thật hoặc doanh thu đã đối soát.

## 03:43–04:15 — ERD, bảo mật và kết thúc

**Màn hình:** Chèn ERD final của Toàn, lướt qua tám bảng và hai bucket private. Kết thúc ở landing hoặc logo FitSync cùng các link nghiệm thu.

**Lời nói:**

> Kiến trúc Outcome 2 gồm tám bảng chính, liên kết danh tính, PT, học viên, lời mời, InBody, check-in, meal log và OCR attempt. Quyền truy cập dựa trên quan hệ PT–học viên, RLS và hai bucket private, còn service-role key chỉ tồn tại trong môi trường server. Nhóm SafeTrail xin cảm ơn Thầy đã theo dõi. Các đường dẫn production, ERD và video dự phòng được cung cấp trong email nghiệm thu để kiểm thử độc lập.

## Kiểm tra trước khi upload

- Thời lượng từ 03:45 đến 04:45; mục tiêu 04:15.
- 1920×1080, 16:9, browser zoom 100%, chữ và con trỏ nhìn rõ.
- Không lộ password, project key, service-role key, raw invitation token, signed URL, inbox hoặc tab cá nhân.
- Không nói “doanh thu thật”, “đã thanh toán” hoặc “OCR production” nếu chưa có bằng chứng tương ứng.
- Xem lại toàn bộ file xuất một lần, sau đó test YouTube Unlisted và Drive bằng tab ẩn danh.
