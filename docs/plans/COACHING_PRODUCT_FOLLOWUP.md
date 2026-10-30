# FitSync — công việc sau thiết kế

2026-10-30. Kế hoạch theo yêu cầu chủ sản phẩm; không phải PRD gốc, không mặc định giá/persona/milestone cũ được duyệt.

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
