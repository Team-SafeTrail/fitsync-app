# FitSync — luồng người dùng / user flows

Bản nháp · 25/11/2026 · Dành cho người phát triển và coding agents
[Feature contracts](FEATURES.md) · [Checklist tiếng Việt](FEATURES_VI.md) · [Design guide](DESIGN.md)

Mỗi luồng có ID, trạng thái, vai trò, điều kiện trước, thao tác và kết quả. Agents use the IDs and acceptance bullets as the implementation contract. The English labels identify fields consistently. Acceptance changes require a corresponding feature update.

## U-00 · Luồng chính toàn hệ thống / Full coaching journey

- **Status:** Core web path passed locally on draft PR #48 at 4257334 with one synthetic PT–trainee pair, reload and a separate signed-in PT denied. Calendar, expired invitations, photo uploads, Android and staging were outside this run. U-01 is the Android slice of this journey.
- **Feature IDs:** AUTH-01, ROSTER-01, CHECKIN-01, BODY-01, CAL-01, CONTEXT-01, OPS-01.
- **Actors:** PT độc lập dùng web. Học viên mới dùng web trước; mở Android sau khi U-01 qua.
- **Happy path:** Khách xem ví dụ được dán nhãn ở landing → PT đăng ký và vào workspace → PT tạo hồ sơ và gửi lời mời → học viên nhận mời, đăng nhập và gửi check-in → PT mở đúng hồ sơ, đọc cập nhật rồi nhập/xác nhận số đo → học viên mở lại thấy tiến trình đã xác nhận → PT và học viên xem cuộc hẹn tiếp theo nếu lịch được bật.
- **Returning user:** Vào đúng workspace sau đăng nhập. Link lời mời hoặc đặt lại mật khẩu được xử lý theo mục đích riêng.
- **Failure branches:** Link hết hạn/sai email có hướng xử lý. Người có tài khoản PT dùng cùng email hoặc tài khoản đã gắn hồ sơ khác cần được hướng dẫn tới bước hỗ trợ. Gửi lại không tạo bản ghi trùng. Tài khoản ngoài cặp không xem hồ sơ, ảnh hoặc ghi chú riêng. Khi thiếu số đo hoặc cuộc hẹn, màn hình nói rõ dữ liệu nào còn thiếu.
- **Acceptance:** Cả hai vai trò hoàn thành trên web với account tổng hợp. Kiểm lưu bền sau reload và người ngoài cặp. Ghi commit, revision migration, cờ và môi trường. Chạy lại khi có App hoặc preview. Demo mẫu không thay bước này.

## U-01 · Check-in Android → PT xem trên web

- **Status:** Local Expo prototype at `9ad9e64`. Android 35 emulator install and launch verified. Trainee sign-in, save and PT readback are pending. Physical-device acceptance remains with blocked issue [#42](https://github.com/Team-SafeTrail/fitsync-app/issues/42).
- **Feature IDs:** APP-01, AUTH-01, CHECKIN-01.
- **Actors and surfaces:** Học viên trên Android. PT phụ trách trên web.
- **Preconditions:** Có APK x86_64 chạy trên emulator. Hai tài khoản synthetic đã liên kết trên cùng Supabase local. Học viên chưa check-in hôm nay theo giờ Việt Nam. Dùng [mobile runbook](../../../mobile/README.md) để cấu hình Metro và ADB reverse. PT đọc lại ở web local `http://127.0.0.1:3000` dùng chính stack đó. Hosted web kết nối database khác.
- **Happy path:**
  1. Học viên mở app, nhập email/mật khẩu và thấy màn **Hôm nay**.
  2. Học viên mở **Check-in hôm nay**, nhập ghi chú, rồi bấm **Gửi check-in**.
  3. App báo đã ghi nhận sau khi backend xác nhận. Màn Hôm nay hiển thị trạng thái đã check-in.
  4. PT mở hồ sơ học viên trên web và thấy đúng nội dung cùng ngày.
- **Branches:** Sai thông tin đăng nhập → lỗi tại form. Hết phiên → đăng nhập lại. Mất kết nối khi gửi → giữ nội dung và cho thử lại. Backend trả already_submitted → đọc lại và hiển thị bản ghi hiện có. Nếu ghi chú mới gửi lại khác nội dung đã lưu, báo rõ ghi chú mới chưa được lưu. Server tính ngày Việt Nam khi nhận lượt gửi. Sau nửa đêm, kiểm tra ngày trước khi gửi lại và hiển thị ngày đã lưu. Bản hiện tại chưa hỗ trợ check-in bù. Tài khoản ngoài cặp → từ chối truy cập.
- **Acceptance:** Có đúng một check-in theo học viên và ngày Việt Nam. PT phụ trách thấy cùng ghi chú trên web local sau khi tải lại. Kiểm retry và quyền ngoài cặp. Ghi kết quả emulator, build Android và revision web/backend. #42 có điều kiện nghiệm thu thiết bị thật riêng.

## U-02 · PT mời học viên → học viên liên kết tài khoản

- **Status:** Web merged. Reissue/revoke in draft PR #48. Android deep link proposed after U-01.
- **Feature IDs:** ROSTER-01, AUTH-01, APP-01.
- **Actors and surfaces:** PT trên web. Học viên trên web hiện tại, Android trong bản mở rộng.
- **Happy path:** PT tạo hồ sơ → sao chép link → học viên mở link và dùng email đúng → backend liên kết tài khoản với hồ sơ → học viên thấy workspace.
- **Branches:** Link hết hạn/thu hồi/đã dùng, email sai, email đã đăng ký vai trò PT hoặc tài khoản đã liên kết hồ sơ khác → báo rõ lý do và hướng dẫn liên hệ PT/hỗ trợ. Chức năng tự đăng ký dành cho PT, học viên vào bằng lời mời. Nếu môi trường yêu cầu xác nhận email, tiếp tục được sau xác nhận. Chốt hành vi khi chưa cài App trước khi gửi link cho người dùng thật.
- **Acceptance:** Lời mời chỉ dùng một lần và đúng email. Lỗi không tạo liên kết ngoài ý muốn.

## U-03 · PT xác nhận InBody → học viên xem tiến trình

- **Status:** Manual web merged. Android and live OCR/PDF deferred.
- **Feature IDs:** BODY-01, AI-03.
- **Happy path:** PT mở hồ sơ → nhập chỉ số và xem đơn vị → xác nhận → học viên xem kết quả đã xác nhận theo thời gian.
- **Branches:** Chỉ số sai → lỗi tại trường và giữ dữ liệu đang nhập. Chưa đủ dữ liệu biểu đồ → hiện số liệu thực và giải thích. Khi có OCR, số đọc chưa duyệt nằm ở bản nháp.
- **Acceptance:** Người khác không thấy hồ sơ. Học viên chỉ thấy số đã xác nhận. Đơn vị và ngày ghi nhận đi cùng số. Luồng hiện tại dùng ngày nhập/lưu. Chưa nhập được ngày đo cũ từ Excel.

## U-04 · Từ nhắc việc đến ghi nhận hoạt động

- **Status:** Proposed. Today and basic daily check-in already exist on web.
- **Feature IDs:** ACT-01, ACT-02, CHECKIN-01.
- **Happy path:** Học viên thấy một việc đến hạn → mở tác vụ → ghi nhận → Hôm nay và lịch sử tuần cập nhật.
- **Branches:** Chưa có việc → thông báo hữu ích. Nếu bật nhắc, cho hoãn hoặc tắt và tôn trọng giờ yên lặng. Nếu dữ liệu đã gửi, cập nhật lời nhắc và bỏ việc đã xong khỏi hàng chờ.
- **Acceptance:** Hoàn thành và thử lại không sinh bản ghi trùng. Nếu cho sửa hoạt động, quyền chỉnh sửa và lịch sử thay đổi phải được chốt trước.

## U-05 · Ảnh bữa ăn hoặc giọng nói → người dùng duyệt bản nháp

- **Status:** Proposed. Meal check-in photo exists on web. OCR is a separate deferred PT workflow.
- **Feature IDs:** AI-01, AI-02, NUT-01.
- **Meal branch:** Chọn ảnh và có thể nhập khẩu phần → xem món và calo ước tính → sửa món/khẩu phần → xác nhận theo luồng lưu bữa ăn đã duyệt.
- **Voice branch:** Ghi âm hoặc dán bản chép lời → trích các trường được phép trong một form → đối chiếu lời gốc và sửa → xác nhận lưu.
- **Failure branches:** Thiếu thông tin → giữ trống hoặc ghi rõ giả định và độ không chắc chắn. Provider lỗi → giữ đầu vào đang dùng và tiếp tục nhập tay. Hủy → không tạo bản ghi coaching đã xác nhận.
- **Acceptance:** Nội dung AI không tự chuyển thành dữ liệu chốt. Kiểm tiếng Việt, đơn vị, phủ định, giá trị thiếu, và không lộ ảnh hay bản chép lời cho người ngoài quyền.

## U-06 · Lịch, đổi lịch và hoàn thành buổi

- **Status:** Web create/view merged. Requests and ledger in draft PR #48. Android follows after U-01.
- **Feature IDs:** CAL-01, CONTEXT-01.
- **Happy path:** PT tạo lịch → học viên thấy lịch → nếu cần, học viên đề nghị đổi/hủy → PT xử lý → PT xác nhận hoàn thành và chọn có trừ buổi hay không.
- **Branches:** Trùng lịch → giữ lịch hiện tại và yêu cầu chọn giờ khác. Chờ duyệt → giữ lịch gốc. Hai client cập nhật cùng lúc → hiển thị phiên bản mới rồi cho thử lại.
- **Acceptance:** Đặt lịch và check-in giữ nguyên số buổi. Thao tác hoàn thành đúng quy tắc và có lịch sử. Hoàn buổi cùng bút toán chỉ thực hiện được một lần.


## U-07 · Học viên xem báo cáo theo kỳ

- **Status:** Proposed recap; web measurement history and charts exist. **Feature IDs:** REPORT-01, BODY-01, ACT-01.
- **Happy path:** Học viên chọn khoảng thời gian → xem lượt check-in, buổi đã hoàn thành nếu có và số đo đã được PT xác nhận → thấy một việc có thể làm tiếp. PT xem theo quyền.
- **Acceptance:** Ghi ngày, đơn vị, nguồn và dữ liệu thiếu. Phân biệt ngày ghi nhận và ngày đo khi có dữ liệu. Không dùng ngày nhập làm ngày đo lịch sử. Phân biệt buổi dự kiến với buổi hoàn thành và không suy ra chẩn đoán. Thử bản trên màn hình trước khi chốt bản in/xuất.

## U-08 · Học viên lưu ảnh tiến trình riêng

- **Status:** Proposed. **Feature ID:** BODY-DIARY-01.
- **Happy path:** Học viên tự chọn ảnh, xem trước ngày/ảnh/quyền hiển thị rồi lưu vào nhật ký cá nhân. Chia sẻ với PT chỉ khi có thao tác riêng và chính sách được duyệt.
- **Acceptance:** Kiểm tệp và quyền phía server. Có thể bỏ ảnh trước khi lưu. Người ngoài quyền không thấy ảnh. Chốt thu hồi chia sẻ, xóa và retention trước pilot. Ảnh nhật ký, ảnh bữa ăn và đăng nhập là các luồng riêng.

## U-09 · Học viên kết thúc coaching và xem lại lịch sử

- **Status:** Hypothesis. **Feature ID:** CONTINUITY-01.
- **Current behavior:** Lưu trữ hồ sơ không cắt quyền đọc đã có. Một tài khoản chỉ gắn với một hồ sơ học viên. Để hỗ trợ quyền sau khi kết thúc và đổi PT, cần chốt chính sách cùng thay đổi mô hình dữ liệu và RLS.
- **Happy path to validate:** Học viên được thông báo quyền nào thay đổi khi dừng coaching → đăng nhập lại và xem phần lịch sử được quyền giữ → chọn có muốn tiếp tục nhật ký cá nhân.
- **Acceptance:** Chốt danh mục được xem/xuất trước khi build. PT cũ mất quyền theo chính sách đã duyệt. Ghi chú riêng của PT không được chuyển sang học viên hay PT mới. Luồng trả phí là quyết định sau khi xác minh nhu cầu.

## U-10 · Onboarding và đánh giá đầu tiên

- **Status:** Partial on web. Guided intake, voice and multi-brand report scanning are proposed. **Feature IDs:** ONBOARD-01, ROSTER-01, BODY-01, AI-02, AI-03.
- **PT path:** Tạo hồ sơ tối thiểu và gửi lời mời → mở đánh giá đầu tiên nếu sẵn sàng → chọn nhập tay, ghi âm để điền nháp, hoặc quét phiếu đo được hỗ trợ → xem lại từng trường → PT xác nhận và lưu. Có thể làm đánh giá sau.
- **Trainee path:** Nhận lời mời → đăng nhập → vào Hôm nay và hoàn thành check-in đầu tiên. Báo cáo xuất hiện khi PT đã xác nhận và học viên có quyền xem.
- **Branches:** Phiếu ngoài danh sách hỗ trợ, giọng nói không rõ, lỗi OCR hoặc thiếu trường → giữ bản nháp và cho nhập tay. Đối chiếu ngày đo, đơn vị và vùng trái/phải. Giữ đúng khác biệt giữa khối nạc, khối cơ, khối mỡ và phần trăm mỡ. Khi chưa xác định được giá trị, để trống và giải thích.
- **Acceptance:** Cả hai vai trò vào được luồng chính khi chưa có phiếu đo. Nhập tay hoạt động độc lập. Voice và scan không tự tạo số đo đã xác nhận. Khi mở rộng sang Android, U-01 vẫn dùng học viên đã liên kết trước.

Open decisions include the official MAD submission format, the first activity type, the voice form, and whether OTP/MFA belongs in the release. See [FEATURES.md](FEATURES.md).
