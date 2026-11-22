# Week 9 — nội dung điền Google Form

Bản cập nhật 22/11/2026 để chuẩn bị nộp bổ sung. Giữ đúng câu hỏi PDF; chỉ copy phần Trả lời. Email: dùng tài khoản đại diện nhóm, không dùng mật khẩu hoặc service key. Số liệu cloud đã đọc lại ngày22/11; không backdate về tuần học. Chưa gửi form hoặc có receipt.

## Step 1: How is your results to date? compare to KPIs

**Trả lời:**

Theo snapshot cloud đọc lại ngày 22/11, hệ thống có 27 tài khoản Auth; loại 17 tài khoản synthetic còn 10 tài khoản cần xác minh, gồm 5 PT và 5 học viên. Nếu tính cả hai vai trò, tiến độ tài khoản là 10/60 = 16,7%; chưa đủ bằng chứng gọi cả 10 là khách độc lập. Cohort này chưa có số đo/check-in. Tại lần xác nhận gần nhất, chủ dự án cho biết chưa có giao dịch thật: 0 khách trả phí; nhãn Pro không thay chứng từ. Về sản phẩm, revision 0ba9821 đã qua 114 domain tests, 363 kiểm tra SQL/RLS trên cả database mới và nâng cấp, 28 luồng browser và 4 bài demo trên CI. Các kiểm tra browser qua ngay lần đầu. Đây là kết quả kiểm lại sau tuần học; không backdate thành kết quả trong Week 8 hoặc Week 9. Bản cloud hiện hành chưa được cập nhật bằng branch này. Local ngày22/11 đã build/start và qua4/4 bài demo với Auth/DB/Storage cô lập.

## Step 2: Plans for improvements

**Trả lời:**

Nhóm ưu tiên ổn định demo web hai vai trò, kiểm quyền truy cập, quota Free/Pro, lưu số đo, chat, đổi/hủy lịch, ledger buổi và sổ tài chính. Các luồng đã được kiểm trên CI cô lập; ngày22/11 bản production build/start local qua4/4 bài demo trên Windows với Supabase riêng và dữ liệu synthetic. Giữ nhập tay và PT xác nhận khi OCR provider/full PDF chưa đủ bằng chứng. Hoàn thiện video, database review, form và final cùng một nguồn số liệu. Chưa có thông tin ngân hàng nhận tiền nên chưa bật thu tiền thật. Nhóm dừng kinh doanh sau môn và không cam kết roadmap mở rộng.

## Step 3: Customer analytics

**Trả lời:**

Snapshot 22/11 ghi nhận 10 tài khoản ngoài seed: 5 PT và 5 học viên; cả 10 xác nhận email và từng đăng nhập. Có 9 tài khoản tạo ngày 27/10 và 1 tài khoản ngày 29/10. Cohort này có 0 bản ghi InBody và 0 check-in; chưa có cặp đạt activation đề xuất. Tổng 15 InBody và 8 check-in toàn DB thuộc dữ liệu synthetic. Bốn nhãn Pro không chứng minh khách đã trả phí. Chưa có attribution/retention và analytics kênh lịch sử đủ để tính CAC, LTV hoặc churn. Bản mới có product_events và tổng hợp theo tuần, loại dữ liệu thử; không suy lại lịch sử trước khi đo. Bộ demo 20 PT, 8 học viên và 1 admin chỉ dùng kiểm phần mềm, không cộng vào khách thật.

## Step 4: Upload your financial report (link)

**Trả lời:**

https://drive.google.com/file/d/18SJXm70350xOMlOvkuLelAmP6xPavRRd/view?usp=drivesdk

## Step 5: What are your financial analysis of your business?

**Trả lời:**

PT là người trả thuê bao 199.000đ/tháng; học viên dùng cùng PT. Tại lần xác nhận gần nhất: 0 khách trả phí và 0đ tiền thu khách theo chủ dự án, chưa có sao kê độc lập; chi phí chưa đối soát nên chưa tính lợi nhuận thực. Cash scenario: fixed 3 triệu/tháng và variable 16.990đ/PT, hòa vốn 17 PT. Scenario tính thêm công: fixed 7,8 triệu, variable 31.990đ/PT, hòa vốn 47 PT. Với 20 PT giả định: thu 3.980.000đ, cash result 640.200đ; tính công âm 4.459.800đ. Đây là phân tích giả định. Bộ demo có 22 bút toán TEST/PDF ghi rõ mô phỏng; chúng không chứng minh chuyển khoản hoặc điều kiện 20 paying customers. Chưa có đủ dữ liệu tính CAC/LTV/churn.


Bằng chứng: docs/evidence/exe201-2026-11-22/cloud-metrics.json; docs/evidence/exe201-2026-11-22/local-demo-verification.json; docs/evidence/exe201-2026-11-18/engineering-checks.json; reports/FINANCIAL_REPORT.md; project-management/FINAL_DELIVERY.md.
