# FitSync — product brief nháp để thảo luận

Ngày: 2026-10-30. **Chủ sản phẩm đã đồng ý luồng kiểm chứng đầu tiên và ưu tiên
Android. Các đề xuất UX, phạm vi AI bữa ăn và chi tiết còn mở chưa được duyệt toàn bộ.**

Nguồn: phỏng vấn chủ sản phẩm trong chat hiện tại và khảo sát checkout `e1b03ad`.
Đây là brief mới, không phải PRD gốc thất lạc trong `fitsync-docs`. Tài liệu không
thay thế kế hoạch, DESIGN.md hay quyết định cũ. Được lập đề xuất kế hoạch theo phạm
vi đã đồng ý; chưa cho phép sửa sản phẩm hoặc deploy.

Chủ sản phẩm tiếp tục yêu cầu kế hoạch xem xét lại toàn bộ landing, funnel, quyền,
web/app và database, gồm các chỉ số chi tiết theo vùng thực có trên phiếu máy.
[Blueprint chi tiết](plans/FITSYNC_REBUILD_BLUEPRINT.md),
[đặc tả body composition/OCR](plans/FITSYNC_BODY_COMPOSITION_DATA_SPEC.md) và
[bản đồ skills](skills/FITSYNC_SKILL_EXECUTION_MAP.md) là các đề xuất triển khai
tiếp theo; chưa được duyệt toàn bộ và chưa có thay đổi sản phẩm.

## 1. Tóm tắt

FitSync giúp PT quản lý và đồng hành với học viên trên máy tính và điện thoại.
Hồ sơ học viên tập trung dữ liệu, trao đổi, lịch, gói tập và tiến trình để PT giảm
nhập lại thông tin, tìm kiếm trong nhiều công cụ và dùng Zalo cá nhân cho công việc.

## 2. Bối cảnh và bằng chứng

Chủ sản phẩm từng quan sát PT tại phòng gym tư nhân nhỏ quản lý bằng Excel, giấy
và Zalo. Đây là nguồn mô tả vấn đề từ chủ sản phẩm; chưa phải nghiên cứu mới với PT.

Code hiện có workspace PT–học viên, nhập InBody thủ công, lời mời, check-in và số
buổi còn lại. Chưa có chat và lịch chung. OCR mặc định chưa có nhà cung cấp. Demo
có nhiều chức năng minh họa hơn workspace. Khảo sát này chạy lại 33 unit tests và
duyệt trang desktop/mobile giả lập; chưa chạy lại database/RLS hoặc E2E đăng nhập
vì môi trường thiếu cấu hình Supabase. Các kết quả cũ là bằng chứng lịch sử.

## 3. Mục tiêu và cách kiểm chứng

Mục tiêu được chủ sản phẩm xác nhận: PT có thêm thời gian chăm học viên và nghỉ
ngơi nhờ giảm nhập liệu và tra cứu. Chưa có mức tiết kiệm thời gian được chứng minh.

Đề xuất kiểm chứng bằng các việc giống nhau trên cách làm hiện tại và FitSync:

- Tiếp nhận học viên, nhập báo cáo và xác nhận: đo tổng thời gian, gồm sửa lỗi.
- Chuẩn bị buổi hẹn: đo thời gian tìm lịch, ghi chú gần nhất và thông tin cần dùng.
- Đổi lịch và ghi nhận buổi PT: quan sát hoàn thành, nhầm lẫn và số lần cần nhắn ngoài app.

Chưa chốt số người thử, thời lượng hay ngưỡng đạt. Dùng dữ liệu tổng hợp trước;
dữ liệu thật tuân theo governance gate hiện có. Không coi điểm EXE201, video demo,
độ chính xác OCR giả lập hoặc lượt đăng ký là bằng chứng tiết kiệm thời gian.

## 4. Người dùng

- **Đã xác nhận:** PT đang quản lý học viên bằng nhiều công cụ; học viên của PT đó.
- **Đã xác nhận để sau:** chủ phòng gym quản lý nhiều PT.
- **Chưa chốt:** người trả tiền, giá, quy mô roster và mô hình thương mại.

PT quản lý thông tin thuộc phạm vi học viên mình phụ trách. Học viên chỉ xem dữ
liệu của mình và thông tin PT chia sẻ. Quyền mở rộng cho chủ gym chưa được thiết kế.

## 5. Giá trị dự kiến

**PT:** cần chuẩn bị, theo dõi và trao đổi với học viên; hiện phải nhập và tìm dữ
liệu ở Excel, giấy, Zalo. Hồ sơ tập trung cùng lịch và chat dự kiến giúp giảm việc
lặp lại. Các công cụ cũ và ứng dụng coaching khác là lựa chọn thay thế. Lý do họ
chọn FitSync vẫn là giả thuyết cần kiểm chứng.

**Học viên:** cần biết lịch, mục tiêu, thông tin PT gửi và nơi phản hồi. Trải nghiệm
riêng trong cùng sản phẩm dự kiến giúp tìm và thực hiện các việc đó dễ hơn. Chưa có
phỏng vấn học viên mới để xác nhận mức độ cần thiết và khả năng chuyển từ Zalo.

Điểm khác biệt dự kiến để kiểm chứng: tiếp nhận dữ liệu thuận tiện và tra cứu đúng
ngữ cảnh cho PT tại Việt Nam. Không coi việc gom nhiều công cụ hay thêm AI tự nó
là lợi thế cạnh tranh đã được chứng minh.

## 6. Trải nghiệm và phạm vi đề xuất

### Những yêu cầu đã nghe từ chủ sản phẩm

- Hồ sơ tập trung, chat trực tiếp, lịch chung; dùng được cho cả hai vai trò trên web và mobile.
- Ảnh/PDF InBody được nhập vào hồ sơ, PT sửa và xác nhận trước khi lưu chính thức.
- Lưu đầy đủ chỉ số thực trên template được hỗ trợ, gồm khối nạc/mỡ theo vùng nếu
  có; tách số đo, kết quả máy và nhận xét PT/AI. Không suy ra từng nhóm cơ từ số đo vùng.
- Membership có ngày bắt đầu/kết thúc; theo dõi hoạt động tập và buổi có PT riêng.
- Có thể gắn bài tập vào buổi hẹn; tạo lịch không bắt buộc soạn giáo án.
- Hướng phân tích ảnh bữa ăn: kiểm tra ảnh thức ăn, ước tính macro, ghi rõ tính ước tính.

### Quyết định UX do agent đề xuất, chờ duyệt

- Màn hình đầu của PT ưu tiên lịch hôm nay và việc cần xử lý. Hồ sơ mở bằng buổi
  hẹn sắp tới, ghi chú gần nhất và các thay đổi cần chú ý; chi tiết có thể mở thêm.
- PT tạo buổi đã thống nhất trực tiếp. Học viên có thể xác nhận hoặc gửi yêu cầu
  đặt/đổi/hủy; lịch đã xác nhận không bị học viên sửa trực tiếp. Khi PT đổi giờ,
  học viên được báo và lịch mới chờ xác nhận; giờ cũ không âm thầm mất đi.
- Yêu cầu đổi lịch giữ nguyên buổi cũ cho tới khi chốt; ghi nhận người thay đổi,
  kiểm tra trùng lịch và báo rõ trạng thái. Học viên không thấy lịch của người khác.
- Lịch hẹn và bài tập gửi trong chat là cùng một nội dung liên kết, không phải hai
  bản độc lập. Một buổi hẹn chỉ cần học viên, thời gian và loại buổi.
- Bài tập có thể ghi hiệp, lần, tạ, thời gian nghỉ và ghi chú; các trường tùy chọn.
  Học viên có thể ghi kết quả nếu PT giao bài. Không buộc PT nhập chi tiết để đặt lịch.
- Check-in tự tập không trừ gói PT. Đặt lịch không tự trừ buổi; PT xác nhận buổi
  hoàn thành mới ghi nhận sử dụng. Chính sách hủy/vắng và điều chỉnh còn cần chốt.

### Phạm vi lần kiểm chứng đầu tiên, đã được đồng ý

Chủ sản phẩm đồng ý nối trọn luồng tiếp nhận → hồ sơ đã xác nhận → chat/lịch chung
→ ghi nhận buổi PT. Bài tập là phần gắn thêm vào lịch. Có thể đề xuất kế hoạch từng
phần nhỏ; chỉ triển khai phần được cho phép. Phân tích ảnh bữa ăn thuộc hướng sản
phẩm; đoạn trả lời bằng giọng nói về thời điểm đưa vào chưa rõ, cần xác nhận riêng.

## 7. Giới hạn, phụ thuộc và quyết định còn mở

Dashboard chủ gym để sau theo lời chủ sản phẩm. Agent đề xuất để sau: ghi âm tư
vấn/sửa bằng giọng nói, cộng đồng, gamification, checkout và tự động hóa phức tạp.
Không triển khai tự động gửi Zalo hoặc tự động xác nhận dữ liệu AI.

Web phục vụ cả PT và học viên. Mobile hướng tới Android và iPhone, ưu tiên Android
trước theo xác nhận của chủ sản phẩm. Web/mobile phải có thiết kế theo công việc
và dùng chung dữ liệu phù hợp. Chưa chọn native, PWA hay wrapper hoặc tỷ lệ dùng
chung code. Responsive qua DevTools chưa đủ chứng minh trải nghiệm app.

[OpenGym](https://github.com/alexpcosta/opengym) là nguồn tham khảo cho thư viện,
routine và log tập. Mới đọc README/NOTICE, chưa chạy hay audit code. Chưa chọn tích
hợp. [NOTICE](https://github.com/alexpcosta/opengym/blob/main/NOTICE.md) ghi code
dùng AGPL-3.0, dữ liệu/media thuộc điều khoản upstream riêng; phải đánh giá phần
định dùng trước khi tái sử dụng. Không import tài khoản hay hạ tầng từ repo này.

Cần chốt tiếp: AI bữa ăn trong lần thử đầu, chính sách hủy/vắng, phạm vi ghi kết
quả bài tập và tiêu chí đạt cho pilot. Thiết kế UI, công nghệ mobile, kế hoạch
triển khai chi tiết (đã có blueprint đề xuất), timeline và kế hoạch kinh doanh
chưa được phê duyệt.
