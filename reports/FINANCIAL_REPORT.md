# FitSync — báo cáo tài chính phục vụ Week 8/9

**Ngày lập:** 17/11/2026. **Tình trạng:** bản phân tích có giới hạn dữ liệu, chưa phải sổ kế toán đã đối soát. Nhóm quyết định dừng kinh doanh sau học phần. Không dự báo mở rộng sau môn như cam kết.

## 1. Thực tế có thể xác nhận

| Chỉ tiêu | Thông tin hiện có | Mức xác nhận |
|---|---|---|
| Giá tham chiếu PT |199.000 đ/PT/tháng, theo PRODUCT_DECISIONS và khảo sát sơ bộ đã được owner ghi nhận | Tham chiếu, offer/hạn mức chưa hoàn chỉnh |
| PT mang plan Pro |4 trong 5 PT ngoài seed, snapshot cloud17/11 | Trạng thái DB, không chứng minh trả tiền |
| Paying customers/doanh thu đã thu |Chưa có ledger và biên lai đối soát trong nguồn được truy cập | **Unknown**, không ghi 0 và không ghi3/4 paid |
| Cash đã chi |Leader từng báo 0 đ ngày 06/11, Vercel/Supabase Free và AI chưa nối | Báo cáo nội bộ lịch sử, chưa audit billing ngày17/11 |
| Công nhóm |Có phát triển/tài liệu, chưa có time sheet quy đổi actual đầy đủ | Không coi là miễn phí về kinh tế |
| Tiền PT thu học viên |Chưa có sổ | Không phải doanh thu FitSync nếu không có hợp đồng/phí nền tảng |

Nguồn: [PRODUCT_DECISIONS](../docs/PRODUCT_DECISIONS.md), [cloud aggregate](../docs/evidence/exe201-2026-11-17/cloud-metrics.json), `../../outputs/mentor-business-2026-11-06/README.md`. Mô hình [EXE101 trên Drive](https://docs.google.com/spreadsheets/d/1JEEIMwIYCxw8Stv7U10354ZYQGURrKZz/edit) là assumptions/projections tháng 07, không phải giao dịch thực. Những ô tính chưa có cached value trong bản đọc text không được diễn giải thành 0.

## 2. Mẫu báo cáo tuần và lũy kế

Ngày tuần W8/W9 dưới đây lấy từ sprint Trello để phân tích, chưa thay ngày học/LMS. Số tiền để `Chưa đối soát` cho đến khi có dữ liệu, không tự phân bổ khoản 0 đ lịch sử vào từng tuần.

| Kỳ | Doanh thu ghi nhận | Tiền thu | Hoàn tiền | Cash chi | Công quy đổi | Lãi/lỗ | Chứng từ |
|---|---|---|---|---|---|---|---|
| W1–W7 từng tuần |Chưa đối soát|Chưa đối soát|Chưa đối soát|Chưa đối soát|Chưa đủ time sheet|Chưa tính|Chưa có ledger|
| W8 (26/10–01/11, lịch nội bộ) |Chưa đối soát|Chưa đối soát|Chưa đối soát|Chưa đối soát|Chưa đủ time sheet|Chưa tính|Chưa có ledger|
| W9 (02/11–08/11, nối tiếp lịch nội bộ) |Chưa đối soát|Chưa đối soát|Chưa đối soát|Chưa đối soát|Chưa đủ time sheet|Chưa tính|Chưa có ledger|
| Sau W9 đến 17/11 |Chưa đối soát|Chưa đối soát|Chưa đối soát|Chưa đối soát|Chưa đủ time sheet|Chưa tính|Chưa có ledger|
| Toàn dự án |Chưa đối soát|Chưa đối soát|Chưa đối soát|Leader báo 0 đ đến 06/11, chưa đối soát|Chưa đủ time sheet|Chưa tính|Chưa đầy đủ|

Ledger đề xuất đã tạo ở [FINANCIAL_LEDGER_TEMPLATE.csv](FINANCIAL_LEDGER_TEMPLATE.csv). Mỗi giao dịch có ID, ngày ICT, kỳ dịch vụ, loại thu/chi/refund, amount/currency, cash/accrual, khách ẩn danh, nguồn biên lai đã che, reviewer và trạng thái đối soát. Không lưu số tài khoản/ảnh sao kê nguyên bản trong Git.

## 3. Dòng thu và cost structure

Mô hình phù hợp core là PT trả thuê bao FitSync, học viên sử dụng cùng PT. Gym nhiều PT và add-on AI là giả thuyết mở rộng trước đây, chưa triển khai/mở bán. Không công bố lại gói 49 k/99 k hoặc Free/unlimited khi chưa có quyết định cập nhật.

Theo dõi fixed cash (hosting, DB, domain, monitoring/email, marketing tối thiểu), variable cash (AI theo request/retry, storage/egress tăng thêm, phí thu tiền/hoàn tiền), công nhóm cố định và support theo PT. Phân biệt đầu tư một lần, chi định kỳ và khoản phải trả. Ngừng kinh doanh sau môn không làm mất nghĩa vụ đối soát/hoàn tiền/hỗ trợ đã cam kết nếu có.

## 4. Kịch bản học thuật, không phải actual

Kế thừa giả định được ghi rõ trong model06/11, tính lại bằng script. Không phải bảng giá vendor được xác nhận hay ngân sách đã chi.

| Đầu vào dự toán tháng | Cash | Tính thêm công |
|---|---:|---:|
| Giá PT |199.000 đ|199.000 đ|
| Fixed |3.000.000 đ|7.800.000 đ (gồm 4.800.000 đ công)|
| Variable/PT |16.990 đ|31.990 đ (gồm 15.000 đ support)|
| Contribution/PT |182.010 đ|167.010 đ|
| Contribution margin |91,46%|83,92%|
| Break-even, làm tròn lên |17 PT|47 PT|

`Contribution = price - variable`; `BEP = ceil(fixed/contribution)`. Đây là contribution margin, không phải net margin. Chưa tính đầy đủ thuế, discount, refund, D&A, churn/CAC hay nghĩa vụ pháp lý. Không dùng 20 tài khoản PT+học viên làm 20 thuê bao.

| Số PT trả phí giả định | Doanh thu tháng | Cash result | Result tính công |
|---|---:|---:|---:|
|20|3.980.000 đ|640.200 đ|-4.459.800 đ|
|50|9.950.000 đ|6.100.500 đ|550.500 đ|
|100|19.900.000 đ|15.201.000 đ|8.901.000 đ|

Phép tính giả định 20 PT theo giá 199 k cho doanh thu 3,98 m/tháng không chứng minh đã đạt Outcome 3. Kết quả tính được kiểm độc lập bằng `scripts/reporting/verify-delivery.mjs` và evidence JSON khi bàn giao.

## 5. Kết luận dùng để trình bày

Hiện có thể trình bày logic doanh thu, danh mục chi phí và độ nhạy hòa vốn, nhưng chưa thể kết luận FitSync có lãi, đã hòa vốn hoặc đã có số khách trả phí theo guideline. Trước nộp cần owner đối soát ledger, hóa đơn cloud và biên lai thực; nếu chưa có, nộp báo cáo với giới hạn này và trao đổi giảng viên về phần chưa đạt. Không có cơ sở tính CAC/LTV/churn từ dữ liệu hiện có.
