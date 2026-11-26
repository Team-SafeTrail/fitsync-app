# FitSync — danh sách chức năng để nhóm duyệt

Bản nháp · 25/11/2026 · Dành cho Khai, Huy và nhóm FitSync
[Tài liệu kỹ thuật EN](FEATURES.md) · [Luồng người dùng](USER_FLOWS.md) · [Thiết kế](DESIGN.md)

## Mục tiêu

- Giảm thời gian PT và học viên nhập lại, đối chiếu và tìm dữ liệu.
- Giúp học viên biết việc cần làm hôm nay, ghi nhận hoạt động nhanh và xem tiến trình.
- Website và ứng dụng Android dùng cùng tài khoản, dữ liệu và quyền. Bản Android cài được và luồng hai client vẫn là mục tiêu cần nghiệm thu.

## Ưu tiên sản phẩm

- Chốt luồng chính cho PT độc lập và học viên. Nghiệm thu theo revision và thao tác lưu/đọc lại. Dùng chuẩn thiết kế forest/jade ở web và Android.
- Sau luồng chính, cân nhắc báo cáo tiến trình, nhật ký ảnh có kiểm soát quyền và giữ lịch sử sau coaching. Voice, dự đoán calo, gamification và Consumer Premium là hướng nghiên cứu.
- Offer đã duyệt 17/11: Free tối đa ba hồ sơ chưa lưu trữ kể cả lời mời chờ. Pro 199.000đ/PT/tháng, không giới hạn khi còn hạn, không tự gia hạn. 299.000đ, tier và trial là nghiên cứu. Hồ sơ ghi nhận 0 khách trả tiền và 0đ doanh thu thật. [Quyết định sản phẩm](../../PRODUCT_DECISIONS.md)
- Hưng phụ trách bộ dữ liệu và benchmark OCR. Tích hợp theo issue được giao.

## Nghiệm thu theo giai đoạn

1. **Hệ thống web.** Trang giới thiệu → PT tạo hồ sơ và mời → học viên tham gia và check-in → PT xem và xác nhận số đo → học viên xem tiến trình. Kiểm phân quyền, reload, retry và vào thẳng workspace khi quay lại. Sau khi đạt, kiểm preview phiên bản mới trên backend riêng. [U-00](USER_FLOWS.md)
2. **Android và báo cáo.** APK Android đã cài và mở trên emulator. Còn nghiệm thu text check-in và PT đọc lại trên web local. Thiết bị thật thuộc #42 đang blocked. Các bước ảnh, lời mời và báo cáo tháng là phần tiếp theo. [U-01 và U-07](USER_FLOWS.md)
3. **Thử giá trị bổ sung.** Nhật ký ảnh cơ thể, quyền giữ lịch sử sau khi kết thúc coaching, và AI giảm nhập tay được chốt từng phần. Gamification và B2C chưa chốt. [U-05, U-08 và U-09](USER_FLOWS.md)

## Điều cần nhóm xác nhận tiếp

- **Web local.** Phần lõi U-00 đã qua trên draft PR #48 tại 4257334 với cùng một cặp PT/học viên synthetic. Check-in và số đo đã xác nhận còn sau tải lại. PT ngoài cặp bị từ chối. Lần này chưa kiểm staging, email thật, lịch, ảnh hoặc Android.
- **Khai · Backend.** Dựng Supabase local, chuẩn bị cặp tài khoản synthetic, kiểm quyền check-in và đối chiếu migration, RLS và flags cho web preview.
- **Huy · Frontend.** Kiểm web candidate PR #48, preview và UI/UX trước khi rollout được duyệt. Chạy U-01 phía Android client bằng emulator và đối chiếu với Khai trên web local.

## Đã có trên web

- [ ] **AUTH-01 · Tài khoản.** PT đăng ký bằng email và mật khẩu. PT và học viên đăng nhập theo vai trò. Bản web dùng kiểm tra quyền phía máy chủ.
- [ ] **ROSTER-01 · Hồ sơ và lời mời.** PT tạo hồ sơ, chia sẻ link mời dùng một lần trong 7 ngày. Học viên nhận bằng email đúng với lời mời.
- [ ] **BODY-01 · InBody và tiến trình.** PT nhập và xác nhận tối đa năm chỉ số. Học viên xem lịch sử và diễn biến cân nặng, cơ xương và tỷ lệ mỡ. Bản hiện tại ghi ngày nhập, chưa hỗ trợ nhập lịch sử từ Excel với ngày đo gốc.
- [ ] **CHECKIN-01 · Check-in.** Một lượt mỗi ngày theo giờ Việt Nam. Có ghi chú và ảnh bữa ăn riêng tư tùy chọn. PT xem hoạt động và nhóm ít check-in.
- [ ] **CHAT-01, CAL-01 · Chat và lịch.** Có chat chữ riêng và lịch chung do PT tạo. Học viên xem lịch. Chat, lịch và membership/ghi chú cần bật các cờ tương ứng trên môi trường kiểm.
- [ ] **CONTEXT-01 · Membership, ghi chú, số buổi.** Có thời hạn membership, ghi chú riêng/chia sẻ và số buổi còn lại.

## Có trong draft PR #48

- [ ] **AUTH-01, ROSTER-01.** Khôi phục mật khẩu qua email, cấp lại/thu hồi lời mời, sửa và lưu trữ/khôi phục hồ sơ.
- [ ] **CAL-01, CONTEXT-01.** Đề nghị đổi/hủy lịch, PT quyết định, xác nhận hoàn thành và hoàn lại một lần trong sổ buổi.
- [ ] **BILL-01.** Free 3 hồ sơ chưa lưu trữ. Pro 199.000đ/PT/tháng. Đang ghi nhận yêu cầu nâng cấp, chưa xác minh thu tiền thật.
- Mốc web đã merge là [PR #31](https://github.com/Team-SafeTrail/fitsync-app/pull/31). Bản ứng viên vẫn là [draft PR #48](https://github.com/Team-SafeTrail/fitsync-app/pull/48). Phiên bản deploy chưa xác minh.

## Android và các đề xuất

- [ ] **APP-01 · Bản đầu.** Học viên đã liên kết đăng nhập trên emulator Android, thấy trang Hôm nay và gửi check-in chữ. PT mở hồ sơ trên web local và thấy bản ghi sau khi tải lại. Kiểm đủ quyền, retry và bản cài. [Luồng U-01](USER_FLOWS.md)
- [ ] **APP-01 mở rộng.** Sau khi bản đầu qua, thêm ảnh riêng tư, quyền camera/thư viện và luồng mở lời mời. Baseline nội bộ dùng Expo/React Native và APK debug. Vẫn cần xác minh định dạng nộp MAD.
- [ ] **ACT-01, ACT-02 · Duy trì hoạt động.** Một việc tiếp theo dễ thấy, ghi nhận nhanh, mục tiêu tuần và lịch sử. Bắt đầu bằng một loại hoạt động. Nhắc tùy chọn, có giờ yên lặng và quyền tắt.
- [ ] **AI-01 · Ước tính bữa ăn.** Ảnh và khẩu phần thành bản nháp món, calo ước tính và độ không chắc chắn. Học viên sửa và xác nhận. Luôn có nhập tay.
- [ ] **AI-02 · Điền form bằng giọng nói.** Từ bản chép lời tiếng Việt, điền nháp một form đã chọn. Hiện dữ liệu nguồn, giữ trống thông tin chưa rõ và cho sửa trước khi lưu.
- [ ] **ONBOARD-01 · Onboarding và đánh giá đầu tiên.** Web đã có tạo hồ sơ, lời mời và nhập tay. Đề xuất sau đó cho PT chọn **Nhập tay**, **Điền nháp bằng giọng nói** hoặc **Quét phiếu đo**. Có thể bỏ qua đánh giá để học viên vào Hôm nay và check-in. Mọi bản nháp cần đối chiếu trước khi PT chia sẻ. Xem U-10.
- [ ] **AI-03 · OCR phiếu thành phần cơ thể đa hãng.** Hưng làm sau. InBody là một nguồn trong số các hãng/model và mẫu phiếu sẽ được xác minh. Với phiếu hỗ trợ, lưu đúng chỉ số cơ/khối nạc và mỡ từng vùng, đơn vị và trái/phải. Trường thiếu hoặc chưa rõ để trống, không tự suy ra. PT luôn xác nhận trước khi học viên thấy số đo đã duyệt.
- [ ] **NUT-01 · Dinh dưỡng.** PT công bố mục tiêu và học viên xem. Nhật ký nhiều bữa và phản hồi từng bữa cần thiết kế riêng.
- [ ] **OPS-01 · Bàn giao.** Chốt mã nguồn web, bản cài App, cấu hình backend, xác thực email và dữ liệu. OTP, MFA, Play Store, push, thanh toán và chế độ offline cần quyết định phạm vi.

Ô trống dành cho nhóm xác nhận khi duyệt. Trạng thái triển khai và tiêu chí nghiệm thu theo ID trong [FEATURES.md](FEATURES.md).
