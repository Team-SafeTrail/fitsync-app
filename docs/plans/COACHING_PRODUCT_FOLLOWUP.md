# FitSync — công việc sau thiết kế

2026-10-30. Kế hoạch theo yêu cầu chủ sản phẩm; không phải PRD gốc, không mặc định persona/milestone cũ. Chủ sản phẩm xác nhận đã có mô hình kinh doanh trước đó và ngày 2026-10-30 yêu cầu cùng xem xét lại, không coi như chưa từng có quyết định. Giá cụ thể mới chưa được duyệt.

## Phạm vi hiện tại

Khôi phục nội dung landing trong ngôn ngữ thiết kế đã duyệt: tiếp nhận → kết nối → xác nhận số đo → theo dõi; khảo sát tổng hợp kèm giới hạn; trạng thái chức năng; vai trò đội ngũ. Demo chọn ba phiếu giả, sửa cân nặng, invalid/review/confirm/reset. Không tự tạo mục tiêu dinh dưỡng: công cụ cũ có công thức giả định, không phải tư vấn cá nhân. Không đưa lại giá, ROI, APK hoặc cam kết hỗ trợ chưa có bằng chứng. Dữ liệu khảo sát theo ../research/survey-evidence.md.

## Đối chiếu ý muốn với hiện trạng đọc từ code

| Ý muốn đã nêu | Hiện trạng | Giữ/sửa/bổ sung | Còn chưa rõ |
| --- | --- | --- | --- |
| Hồ sơ gom thông tin, giảm nhập liệu | Roster, lời mời, InBody, check-in, ảnh bữa ăn | Giữ nền auth/RLS; gom ngữ cảnh tư vấn | Intake tối thiểu, ghi chú nội bộ/chia sẻ |
| Chat trong app | Hội thoại landing là mẫu | Bổ sung chat thật | Read receipt, sửa/xóa, retention |
| Lịch chung, bài tập tùy chọn | Appointment mẫu | Bổ sung booking dùng cùng ID từ chat | Ai duyệt đổi, xử lý trùng lịch/hủy/vắng |
| Membership và buổi PT | Có số buổi tổng/còn lại | Tách thời hạn, attendance và ledger | Gói chồng nhau, hoàn buổi, nhập lịch sử |
| OCR ảnh/PDF đầy đủ | Có review, ảnh; default adapter unavailable | Mở rộng report model và provider có benchmark | Template đầu, unit, missing/segmental |
| AI đồ ăn, voice, bài tập | Chưa có luồng thật | Để sau core, kiểm chứng riêng | Provider, chi phí, consent, license OpenGym |
| Android trước, web hai vai trò | Responsive web, chưa có native | Spike Android, iPhone/chủ gym sau | Offline, push, shared/native architecture |

Đây là đọc code; chưa xác minh authenticated runtime sau chuyển ổ. Giá trị khách hàng là bớt nhập/tìm và phối hợp dễ hơn. Giá/người trả tiền là giả thuyết kinh doanh; EXE201 và demo có bằng chứng riêng, không thay việc kiểm chứng với PT.

## Các gói triển khai đề xuất

1. **Hồ sơ và quyền:** chốt intake, private/shared/draft, quan hệ PT–học viên. Luồng tạo → mời → nhận → xem cùng bản ghi. Nghiệm thu bằng hai PT/hai học viên synthetic: lưu/reload, đúng quyền cả khi gọi trực tiếp API, trạng thái trống/lỗi/hết phiên. Cần Supabase test; không bypass auth để chụp demo.
2. **Chat:** thread theo quan hệ; history có phân trang; pending/sent/failed, retry không nhân đôi; kiểm quyền đọc/ghi/realtime. Text trước, attachment sau quyết định retention. Hai phiên thật gửi/nhận/reload, mất mạng, người thứ ba đoán ID vẫn bị chặn. Không log nội dung. Chốt quyền khi hủy kết nối trước schema.
3. **Lịch:** đề xuất PT tạo/xác nhận, học viên đề nghị đổi; đây là lựa chọn UX để thử, chưa phải chủ sản phẩm đã chốt. Appointment có time zone, người tham gia và trạng thái, chat tham chiếu cùng ID; bài tập không bắt buộc. Nghiệm thu đổi/hủy đồng bộ, concurrency, trùng lịch, qua ngày. Đặt lịch không trừ buổi.
4. **Membership/sổ buổi:** ngày bắt đầu/kết thúc tách số buổi. Self check-in khác attendance khác PT ledger. Đề xuất PT xác nhận completed mới debit idempotent; sửa sai bằng entry bù có lý do. Nghiệm thu không âm/trừ đôi, không trừ khi tự check-in, lịch sử giải thích được. Chốt hủy/vắng/hoàn buổi trước code.
5. **OCR:** khảo sát báo cáo synthetic, chốt template; đọc body composition spec hiện có như đề xuất. Giữ provenance, model, source, units, missing và segmental lean/fat đúng nghĩa; không suy ra nhóm cơ yếu từ khối nạc theo vùng. PDF phải kiểm signature/pages/size, storage riêng, PT duyệt. Benchmark provider trước quảng bá. Nghiệm thu file hỏng/giả đuôi/lớn, draft không lộ thành confirmed, migration tương thích record cũ, RLS/storage tests.
6. **Android/bổ sung:** kiểm thiết bị thật camera/deep link/background/keyboard. OpenGym cần kiểm license trước import. Food AI phải detect food, có khẩu phần/độ bất định và cho sửa. Voice cần consent, processing/retention/deletion. Chưa scaffold mobile, cài provider hoặc thêm dashboard chủ gym.

Thứ tự trên là đề xuất theo phụ thuộc. Lượt hiện tại thực hiện landing và kế hoạch; các gói chức năng cần scope issue và quyết định UX trước code/migration. Không đổi roadmap active bằng tài liệu này. Dùng Postgres skill trước SQL, security-review cho input/auth/API, frontend-design theo DESIGN.md, React guideline đúng version. Không reset dữ liệu, push main hoặc deploy.

## Kiểm chứng giá trị

Sau governance gate và sự đồng ý: so thời gian intake gồm sửa OCR, tìm ghi chú, đặt/đổi lịch, đối chiếu gói; đo lỗi và số lần chuyển công cụ so với cách PT đang dùng. Không coi số màn hình hay tests pass là giá trị đã chứng minh. Không cài tracking hoặc ấn định giá trong lượt này.

## Remake toàn bộ trải nghiệm hai vai trò — cập nhật theo chủ sản phẩm

Phạm vi đích bao gồm bố cục, điều hướng, tương tác, nghiệp vụ và dữ liệu; đổi theme chỉ là phần đã hoàn thành. Tài liệu này không gọi việc thêm section landing là remake sản phẩm.

### Cấu trúc màn hình đề xuất

| Vai trò | Điều hướng chính | Công việc của màn hình |
| --- | --- | --- |
| PT | Hôm nay | Lịch sắp tới, yêu cầu đổi lịch, tin chưa đọc, check-in cần xem; mở đúng hồ sơ từ từng việc |
| PT | Học viên | Tìm/lọc → hồ sơ; tổng quan, chỉ số/tiến trình, dinh dưỡng, lịch, gói/buổi và ghi chú có quyền riêng |
| PT | Lịch | Ngày/tuần, tạo buổi không bắt buộc giáo án, đổi/hủy có trạng thái; xem cùng appointment trong chat |
| PT | Tin nhắn | Danh sách hội thoại → thread gắn học viên; từ cuộc trò chuyện mở hồ sơ/lịch và trở về giữ vị trí |
| Học viên | Hôm nay | Buổi tiếp theo, việc cần xác nhận, mục tiêu đã được chia sẻ, thao tác check-in/ảnh bữa ăn |
| Học viên | Lịch | Cuộc hẹn của mình, đề nghị đổi và xem kết quả; không đọc roster của PT |
| Học viên | Trao đổi | Chat với PT, cùng thông tin cuộc hẹn; không thấy ghi chú nội bộ |
| Học viên | Tiến trình / Hồ sơ | Lịch sử chỉ số, chart có nguồn/ngày/đơn vị, membership và buổi PT; không biến số mẫu thành thành tích thật |

Tên tab và ranh giới bốn/năm mục cần thử trên phone, chưa khóa navigation chỉ vì bảng này. Desktop dùng sidebar/master-detail khi giúp thao tác; phone là màn công việc riêng, không thu nhỏ cả bảng desktop. Cùng backend/domain, chưa quyết định có tách app package hay không.

### Luồng đi xuyên nhiều màn hình

- Tiếp nhận: tạo hồ sơ → ghi mục tiêu → nhập ảnh/PDF hoặc thủ công → đối chiếu/sửa → xác nhận → mời/kết nối → học viên thấy đúng phần đã chia sẻ. Mời có thể trước/sau bản đo, không chặn hồ sơ khi chưa có máy đo.
- Trước buổi: Hôm nay → cuộc hẹn → hồ sơ gần nhất → ghi chú riêng → chat nếu cần. Back trở lại đúng ngày/vị trí; không bắt PT soạn bài tập.
- Đổi lịch: học viên đề nghị → PT xử lý → hai bên cùng thấy trạng thái → thread giữ tham chiếu; đề nghị không ghi đè appointment đã xác nhận.
- Sau buổi: PT ghi hoàn thành → xử lý ledger theo quy tắc được duyệt → cập nhật tiến trình. Tự check-in, membership còn hạn và số buổi có phí là ba thông tin khác nhau.
- Bữa ăn: học viên chụp/gửi → PT xem và phản hồi; AI là lựa chọn thêm, chỉ khi có food detection, ước tính bất định và quyền sửa. Gửi ảnh vẫn dùng được khi AI lỗi.

### Trình tự thực hiện và review

1. Sơ đồ trên → wireframe hai vai trò cho năm luồng; gồm empty/loading/error/offline/pending/permission. Review bằng tình huống thực, không chỉ screenshot đẹp.
2. Hoàn thiện một vertical slice hồ sơ/kết nối/record có lưu, cùng ma trận quyền; kiểm dữ liệu cũ và Supabase test.
3. Chat thật và lịch thật theo shared appointment; desktop và phone có cùng kết quả, trạng thái thất bại có cách xử lý.
4. Membership/ledger và mở rộng báo cáo; test đồng thời, retry, isolation, migration, mandatory review.
5. Android spike và bổ sung AI/workout theo điều kiện riêng. Landing cập nhật theo capability thực sau mỗi phần, không đợi tất cả xong mới nói rõ sản phẩm.

Không thêm commerce gate vào chat/đọc hồ sơ trong lúc chưa có quyết định giá. Chủ gym, community/gamification vẫn không tự nhảy vào phạm vi đầu. Mỗi phần chỉ hoàn thành khi chức năng, layout, quyền và các trạng thái được kiểm tra cùng nhau.

### Rà soát ngôn ngữ landing

Đã có forest/jade/apricot, Be Vietnam Pro và hierarchy được duyệt. Section tiếp nhận dùng trình tự, hồ sơ dùng dossier, số đo dùng source/review sheet; không quay về một grid card cho mọi nội dung. Tuy nhiên tokens đồng bộ chưa đủ chứng minh tổng thể tốt. Cần kiểm lại mạch: hiểu giá trị → hiểu công việc → xem hai vai trò → thử đối chiếu → biết khả năng → hành động. Bảng trạng thái và khảo sát nên hỗ trợ đánh giá, không lấn át phần người dùng làm gì. Không biến landing thành log kỹ thuật: đổi thuật ngữ code/provider thành khả năng sử dụng dễ hiểu. Đây là tiêu chí audit, không tuyên bố đã có nghiên cứu usability mới.

## Mô hình kinh doanh

Chủ sản phẩm yêu cầu cùng xem xét lại baseline đã có. Xem [phân tích mô hình và kiểm chứng](BUSINESS_MODEL_REVIEW.md). Đề xuất chưa thay thế mô hình cũ hoặc tự kích hoạt giá trên landing.
