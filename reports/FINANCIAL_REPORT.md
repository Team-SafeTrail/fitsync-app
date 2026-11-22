# FitSync — báo cáo tài chính phục vụ Week 8/9

**Cập nhật:**   18/11/2026. **Tình trạng:**   bản phân tích có giới hạn dữ liệu, chưa phải sổ kế toán đã đối soát. Nhóm quyết định dừng kinh doanh sau học phần. Không dự báo mở rộng sau môn như cam kết.

## 1. Thực tế có thể xác nhận

| Chỉ tiêu | Thông tin hiện có | Mức xác nhận |
|---|---|---|
| Giá PT |199.000 đ/PT/tháng; Free tối đa 3 hồ sơ chưa lưu trữ, Pro còn hạn không giới hạn và cùng chức năng coaching | Chủ dự án chốt trong trao đổi ngày 17/11 |
| PT mang plan Pro |4 trong 5 PT ngoài seed, snapshot cloud17/11 | Trạng thái DB, không chứng minh trả tiền |
| Khách trả phí và tiền thu từ khách |0 khách có giao dịch thật, 0 đ tiền thu từ khách theo xác nhận chủ dự án ngày 17/11 | Xác nhận của chủ dự án; chưa phải kiểm toán sao kê độc lập |
| Cash đã chi |Leader từng báo 0 đ ngày 06/11, Vercel/Supabase Free và AI chưa nối | Báo cáo nội bộ lịch sử, chưa audit billing ngày 17/11 |
| Công nhóm |Có phát triển/tài liệu, chưa có time sheet quy đổi actual đầy đủ | Không coi là miễn phí về kinh tế |
| Tiền PT thu học viên |Chưa có sổ | Không phải doanh thu FitSync nếu không có hợp đồng/phí nền tảng |

Nguồn: [PRODUCT_DECISIONS](../docs/PRODUCT_DECISIONS.md), [cloud aggregate](../docs/evidence/exe201-2026-11-17/cloud-metrics.json), `../../outputs/mentor-business-2026-11-06/README.md`. Mô hình [EXE101 trên Drive](https://docs.google.com/spreadsheets/d/1JEEIMwIYCxw8Stv7U10354ZYQGURrKZz/edit) là assumptions/projections tháng 07, không phải giao dịch thực. Những ô tính chưa có cached value trong bản đọc text không được diễn giải thành 0.

## 2. Mẫu báo cáo tuần và lũy kế

Ngày tuần W8/W9 dưới đây lấy từ sprint Trello, chưa thay ngày học/LMS. Chủ dự án đã xác nhận chưa có giao dịch khách thật đến 17/11; các ô `Chưa đối soát` trong bảng lịch sử giữ nghĩa chưa có sổ/sao kê phân kỳ độc lập. Kết luận hiện tại là chưa có khách trả phí và tiền thu từ khách theo xác nhận này, không phải 3–4 paid từ nhãn Pro. Chi phí và lãi/lỗ vẫn chưa đủ dữ liệu để kết luận bằng 0.

| Kỳ | Doanh thu ghi nhận | Tiền thu | Hoàn tiền | Cash chi | Công quy đổi | Lãi/lỗ | Chứng từ |
|---|---|---|---|---|---|---|---|
| W1–W7 từng tuần |0 theo owner, chưa audit phân kỳ|0 theo owner|Chưa có phát sinh được cung cấp|Chưa đối soát|Chưa đủ time sheet|Chưa tính|Chưa có sao kê|
| W8 (26/10–01/11, lịch nội bộ) |0 theo owner|0 theo owner|Chưa có phát sinh được cung cấp|Chưa đối soát|Chưa đủ time sheet|Chưa tính|Chưa có sao kê|
| W9 (02/11–08/11, nối tiếp lịch nội bộ) |0 theo owner|0 theo owner|Chưa có phát sinh được cung cấp|Chưa đối soát|Chưa đủ time sheet|Chưa tính|Chưa có sao kê|
| Sau W9 đến xác nhận17/11 |0 theo owner|0 theo owner|Chưa có phát sinh được cung cấp|Chưa đối soát|Chưa đủ time sheet|Chưa tính|Chưa có sao kê|
| Toàn dự án đến xác nhận |0 theo owner|0 theo owner|Chưa đối soát độc lập|Chưa đối soát; báo cáo0đ06/11 chỉ là lịch sử|Chưa đủ time sheet|Chưa tính|Chưa đủ kiểm toán|

Ledger đề xuất đã tạo ở [FINANCIAL_LEDGER_TEMPLATE.csv](FINANCIAL_LEDGER_TEMPLATE.csv). Mỗi giao dịch có ID, ngày ICT, kỳ dịch vụ, loại thu/chi/refund, amount/currency, cash/accrual, khách ẩn danh, nguồn biên lai đã che, reviewer và trạng thái đối soát. Không lưu số tài khoản/ảnh sao kê nguyên bản trong Git.

## 3. Dòng thu và cost structure

Mô hình core là PT trả thuê bao FitSync, học viên sử dụng cùng PT. Giá/hạn mức Free 3/Pro không giới hạn đã được chủ dự án chốt ngày 17/11, chưa có giao dịch thật. Gym nhiều PT và add-on AI vẫn là giả thuyết mở rộng; không công bố lại gói 49k/99k. Ứng viên phần mềm bổ sung sổ append-only, chứng từ riêng tư, đối soát admin và bút toán đảo; giao dịch thử không tính doanh thu. Tài khoản nhận tiền đang chờ chủ dự án cung cấp.

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

## 6. Bộ mô phỏng kiểm thử phần mềm, tách khỏi actual

Launcher local tạo 20 khoản thu TEST × 199.000 đ =3.980.000 đ và 2 khoản chi TEST (3.000.000 đ +339.800 đ), chênh lệch 640.200 đ. Đây là kịch bản cùng giả định ở phần 4, không phải tiền đã nhận hoặc đã chi.22 PDF ghi rõ “SIMULATED DEMO ENTRY / NOT A REAL PAYMENT RECEIPT”, không mang ngân hàng/tên khách thật. Sổ dùng private evidence, SHA-256 và nonce; seed hai lần được kiểm trên CIeec 05 d 2, actual finance KPI không đổi. Không dùng bộ này làm proof 20 paying customers hoặc fake sao kê.

Trong app, panel “Kịch bản mô phỏng” tách khỏi KPI thật; CSV có cột dữ liệu thử. TEST entries không cấp Pro. Pro củaPT01 được thiết lập riêng như fixture synthetic, không là thanh toán. Cost ghi sổ 0 trong DB demo nghĩa là chưa nhập actual, không chứng minh mọi chi phí kinh doanh 0. [Product review](LOCAL_PRODUCT_REVIEW.html) và [runbook](../docs/DEMO_WORKFLOW.md) cung cấp cách kiểm lại.
