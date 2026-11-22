# Product Marketing Context

**Document version:**   v 3. **Last updated:**18/11/2026. Phân biệt quyết định trực tiếp của owner, triển khai trên branch, rollout cloud và kết quả kinh doanh.

## Product Overview

FitSync là workspace coaching tiếng Việt cho PT và học viên, tập trung hồ sơ có ngữ cảnh, số đo được PT xác nhận và check-in. Branch sản phẩm có auth/invite lifecycle, roster, chat/lịch/context, đổi/hủy lịch, session ledger, quản trị dữ liệu thật, sổ thu–chi riêng tư và yêu cầu nâng cấp. Chưa deploy bản mới; cloud vẫn 8 bảng so với 20 bảng/14 migrations ứng viên. OCR provider thật/full PDF chưa nghiệm thu. Web đầy đủ được giảng viên chấp nhận; APK không phải điều kiện nộp hiện tại. Tour công khai là fixture, bộ demo isolated có nhãn và không vào KPI.

## Target Audience và Personas

PT độc lập có học viên đang coach là buyer/user đề xuất; học viên là người dùng cùng PT. Jobs: tiếp nhận đúng người, tìm nhanh thông tin, review số đo và theo dõi cập nhật. Multi-PT gym, iOS hoặc nhu cầu medical diagnosis không thuộc core đã nghiệm thu.

## Problems, Differentiation và Switching

Phân mảnh Excel/tin nhắn/phiếu đo là vấn đề được tài liệu nghiên cứu nội bộ báo lại. Hồ sơ có ngữ cảnh và bước PT review là hướng giải quyết; hiệu quả tiết kiệm thời gian/chọn mua chưa được đo. Thói quen công cụ hiện tại, công onboarding và lo ngại riêng tư là giả thuyết switching friction, chưa phải quote khách.

## Competition và Pricing

Trainerize, Everfit, TrueCoach là đối thủ coaching được quick scan official pricing17/11. Không claim thiếu tính năng/VPN hoặc FitSync rẻ nhất. Owner chốt 199.000đ/PT/tháng, Free tối đa 3 hồ sơ chưa lưu trữ (gồm hồ sơ chờ nhận invite), Pro còn hạn không giới hạn học viên, cùng chức năng coaching. Hết Pro giữ hồ sơ cũ; tạo/khôi phục theo hạn mức Free. Thu tiền bằng chuyển khoản đối soát thủ công, tài khoản nhận đang chờ cung cấp. Không quảng cáo OCR unlimited hoặc thời gian hỗ trợ/hoàn tiền chưa chốt. 49k/99k và Enterprise cũ không phải offer hiện hành.

## Customer Language và Brand Voice

Chưa có verbatim quote đủ consent để tái sử dụng trong lượt này. Viết tiếng Việt rõ, hướng vào tác vụ PT/học viên, tránh hứa tiết kiệm giờ hoặc accuracy chưa đo. Ảnh synthetic phải có nhãn và provenance; không dựng UI giả làm sản phẩm thật.

## Proof Points và Goals

Cloud17/11:10 candidate ngoài 17 synthetic, gồm 5PT+5 học viên; chưa có record/check-in trong cohort và chưa xác minh toàn bộ là khách độc lập. Owner xác nhận chưa có giao dịch thật: **0 khách trả phí**, 0 đ thu khách hàng theo lời xác nhận, chi phí chưa đối soát. Không dùng 4 plan Pro hay dữ liệu test thay doanh thu. Commit 74 a 7 ef 1 qua 112 domain tests, lint/typecheck/build local và quality CI; browser acceptance đang chạy, chưa market-ready hoặc đã deploy.

Mục tiêu ưu tiên là hoàn thành sản phẩm web và EXE201 trước 19/11/2026. Người dùng xác nhận dừng kinh doanh sau môn. Kế hoạch 60 tài khoản (20PT+40 học viên) là giả định, không phải actual hoặc bảo đảm 20 paid. Khoảng thiếu 0/20paid là điều kiện final chưa đạt và không thể sửa bằng lập chứng từ giả. Không tự tiếp cận khách, gửi email hoặc đăng bài khi chưa có chỉ dẫn cho hoạt động đó.

## Learnings và Changelog

-17/11: Tách code/test, cloud rollout, kế hoạch, khách độc lập và proof thanh toán.
-17/11: Loại Canva AI draft dựng UI giả; dùng source cố định và screenshot nguyên bản.
-17/11: Ghi quyết định dừng sau học phần; không đưa roadmap mở rộng như cam kết.
