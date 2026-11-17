# Week 9 — nội dung điền form EXE201

Nguồn: Week9_EXE201.pdf, 2 trang, đúng 5 Step và Email. Bản đối soát hồi cứu ngày 17/11/2026, chưa gửi form. Copy phần Trả lời vào từng ô. Không backdate số liệu mới về tuần học.

**Email:** dùng tài khoản đại diện nhóm khi nộp. Email hiển thị trong PDF chưa tự xác nhận tài khoản phải dùng.

## Step 1: How is your results to date? compare to KPIs

**Trả lời:**

Snapshot cloud ngày 17/11 ghi nhận 10 tài khoản ngoài seed gồm 5 PT và 5 học viên trên tổng 27 Auth, sau khi loại 17 synthetic. Theo cách tính cả hai vai trò, đây là 16,7% mốc 60, nhưng chưa xác nhận đầy đủ khách độc lập. Cả 10 đã xác nhận email và từng đăng nhập; cohort chưa có InBody/check-in, chưa có cặp đạt activation đề xuất và last-sign-in 7 ngày là 0. Paid users và doanh thu chưa có chứng từ đối soát nên nhóm chưa khẳng định đạt Outcome 3. Main 3c816e9 có baseline web; lần kiểm local ngày 17/11 qua 103 domain tests, 4 bài kiểm guard cô lập, lint/typecheck/build và 16 public browser tests. Bốn bảng coaching trong source chưa truy cập được qua REST cloud, mã 404/PGRST205; PR47 auth vẫn mở. Source và test không đồng nghĩa mọi tính năng đã rollout.

## Step 2: Plans for improvements

**Trả lời:**

Nhóm ưu tiên hoàn thành học phần: kiểm lại luồng PT tạo hồ sơ, mời học viên, nhập tay và xác nhận, học viên check-in, PT xem cập nhật trên stack synthetic cô lập. Giữ manual fallback thay vì chờ OCR provider. Rà auth và source–cloud drift theo quy trình nhóm, không tự áp migration production trong lượt báo cáo. Hoàn thiện cohort, event dictionary, CAP có ít nhất hai nguồn acquisition và evidence theo tuần; đối soát thu–chi/paid cùng phản hồi được phép trích. Sau đó kiểm form, slide, database access, video và lưu receipt khi nộp. Nhóm dừng kinh doanh sau môn; Android, full OCR và billing được ghi là phần còn thiếu, không cam kết phát triển sau học phần.

## Step 3: Customer analytics

**Trả lời:**

Lần đọc ngày 17/11 dùng Auth Admin và REST select chỉ đọc, không lấy giá trị sức khỏe. Có 27 Auth: 17 synthetic và 10 tài khoản ngoài seed, gồm 5 PT + 5 học viên. Cả 10 đã xác nhận email và từng đăng nhập; 9 được tạo ngày 27/10, một được tạo ngày 29/10. Đây là các tài khoản còn tồn tại tại snapshot, không phải lịch sử đăng ký đầy đủ nếu đã có xóa. Trong 7 ngày trước snapshot, không có tài khoản trong cohort có last-sign-in và không có học viên trong cohort check-in. Toàn cohort có 0 InBody và 0 check-in, chưa có cặp đạt activation đề xuất. Không dùng last-sign-in như WAU coaching hoặc suy churn từ số 0. Tổng 15 InBody và 8 check-in toàn DB không được báo thành hoạt động khách vì không thuộc cohort ngoài seed. Có 4 Pro/1 Free trong 5 PT, nhưng Pro chưa chứng minh trả tiền. Chưa có đủ attribution, event retention và ledger để tính CAC/LTV, paid conversion hoặc funnel đầy đủ. Cần xác minh team/test và khách độc lập trước khi gọi số này là traction thực.

## Step 4: Upload your financial report (link)

**Trả lời:**

https://drive.google.com/file/d/18SJXm70350xOMlOvkuLelAmP6xPavRRd/view?usp=drivesdk

Báo cáo mới ngày 17/11 đã upload theo chấp thuận cụ thể của người dùng và đọc lại thành công. Chưa thử quyền xem bằng tài khoản giảng viên. Báo cáo giữ rõ actual chưa đối soát và các giả định.

## Step 5: What are your financial analysis of your business?

**Trả lời:**

Mô hình phù hợp core là PT trả thuê bao FitSync, học viên sử dụng cùng PT. Giá 199.000đ/PT/tháng là tham chiếu, cần chốt phạm vi, hạn mức và offer. Tiền gói PT hoặc membership học viên trả cho PT không tự là doanh thu FitSync. Hiện thiếu biên lai/ledger để xác nhận paid users, doanh thu và lợi nhuận; 4 Pro trên DB không thay chứng từ. Leader từng báo cash 0đ ngày 06/11 do hạ tầng Free và chưa tích hợp AI, nhưng chưa audit billing ngày 17/11; công nhóm vẫn có chi phí kinh tế. Trong kịch bản học thuật, fixed cash 3 triệu/tháng, variable 16.990đ/PT và giá 199.000đ tạo contribution 182.010đ/PT, BEP 17 PT. Khi tính công, fixed 7,8 triệu và variable 31.990đ/PT tạo contribution 167.010đ/PT, BEP 47 PT. Contribution margin tương ứng 91,46% và 83,92%, không phải net margin. Ví dụ 20 PT trả đủ giá tạo 3,98 triệu/tháng, cash result 640.200đ nhưng result tính công âm 4.459.800đ. Đây là dự toán, chưa có 20 khách thực được chứng minh. Nhóm chưa tính CAC/LTV/churn khi thiếu dữ liệu và sẽ kết thúc kinh doanh sau môn, ưu tiên đối soát nghĩa vụ và bàn giao.

Nguồn: FINANCIAL_REPORT.md, DELIVERY_LINKS.md và docs/SOURCE_REGISTER.md.
