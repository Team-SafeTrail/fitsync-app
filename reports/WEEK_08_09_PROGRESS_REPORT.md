# FitSync — báo cáo tiến độ Week 8/9

**Cập nhật22/11/2026:** dùng [formW8](WEEK_08_FORM.md),[formW9](WEEK_09_FORM.md) và [bộ nộp](SUBMISSION_READY_2026-11-22.md) hiện hành. Local4/4demo PASS;CI0ba9821 core28+demo4 khôngretry;cloud đọc lại22/11 cùng tổng27/17/10. Không backdate hoặc thay0/20paying bằng synthetic.

SafeTrail · Đối soát18/11/2026 · Báo cáo hồi cứu, chưa phải receipt nộp. Nhóm ưu tiên hoàn thành học phần trước 19/11 và dừng kinh doanh sau môn.

Sản phẩm được phát triển trên branch riêng PR48: reset PKCE, invite/roster lifecycle, Free 3/Pro, admin và sổ thu–chi private, đổi/hủy lịch và ledger hoàn thành/đảo buổi.20 bảng public/14 migrations; cloud vẫn 8 bảng, chưa deploy. Local 114 domain tests/lint/typecheck/build qua; fresh/upgrade SQL 363 assertions qua checkpoint. Kết quả browser hiện hành theo [TEST_EVIDENCE](../docs/TEST_EVIDENCE.md), không trình bày code chưa nghiệm thu như hoàn thành.

Cloud17/11 có 27 Auth,17 synthetic,10 candidate=5 PT+5 học viên; chưa xác minh độc lập. Cohort có 0 InBody/check-in,0 last-sign-in 7 ngày. Owner xác nhận chưa có giao dịch thật: 0 paying PT/0đ customer receipts; cost actual chưa đối soát.4 nhãn Pro không chứng minh paid. Bộ demo mới có nhãn mô phỏng và bị loại khỏi KPI thật.

| Nội dung | Kết quả chuẩn bị | Giới hạn |
|---|---|---|
|W8 KPI/kênh|Snapshot, kế hoạch Facebook+referral/direct, Zalo onboarding|Thiếu channel analytics actual|
|W8 quyết định sau môn|ChọnNo, ifYes không áp dụng|Owner xử lý nghĩa vụ/data lifecycle khi kết thúc|
|W8 mốc 60|Plan 20 PT+40 học viên, gap 50 nếu baseline hợp lệ|14 ngày không còn đủ trước hạn; không claim đạt|
|W9 analytics|Cohort/denominator rõ, event tối thiểu có trong source|Không phục dựng attribution/retention cũ|
|W9 tài chính|Drive report đã upload/readback; model17/47 PT BEP|Scenario không thay actual0/20 paying|
|Demo|Launcher isolated, synthetic rõ, DB20 bảng|Windows Docker/WSL2 cần chấp thuận; website do Huy giữ|

Những phần đã chuẩn bị gồm form đúng câu hỏi, final 5 phần, gap Week 1–9, phân tích sản phẩm/kiến trúc, CAP, tài chính, Trello audit 106 cards, Git/cleanup report, deck/script và runbook. Trạng thái cuối theo [FINAL_DELIVERY](../project-management/FINAL_DELIVERY.md).

Khó khăn chính là source–cloud drift, thiếu evidence kinh doanh và môi trường local. Nhóm giữ manual entry/PT review khi OCR provider chưa đủ; dùng CI isolated để kiểm quyền/persistence; không tự migrate production, tạo biên lai hoặc xem synthetic là traction. Lỗi navigation/form đang được sửa và kiểm lại. Git đã push/PR48, không còn blocker login; auth PR47 tích hợp trên branch riêng, chưa merge main.

Tài liệu/code do agent chuẩn bị không tự chia thành công của từng thành viên. Nhóm cần xác nhận contribution, mentoring attendance, database access và receipt nộp. Bước tiếp là nghiệm thu ứng viên, đồng bộ video/slides/form cùng revision, owner kiểm DB và nộp theo LMS.
