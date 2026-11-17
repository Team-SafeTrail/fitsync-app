# FitSync — Final Report EXE201

**Nhóm:** SafeTrail. **Bản nháp đối soát:**17/11/2026. **Sản phẩm:** workspace coaching dành cho PT và học viên. **Trạng thái:** có baseline kỹ thuật và tài liệu, chưa đủ bằng chứng đáp ứng toàn bộ điều kiện kết quả kinh doanh. Nhóm quyết định dừng kinh doanh sau học phần.

Cấu trúc giữ đúng 5 phần của FINAL REPORT EXE201 GUIDELINES. Nội dung unknown được giữ rõ để giảng viên đánh giá. Chưa gửi báo cáo hoặc tự xác nhận điểm/Outcome.

## Part 1 / Outcome 1: Minimum Viable Product (MVP)

### Product và phạm vi

FitSync tập trung hồ sơ học viên, số đo đã được PT xác nhận và quá trình coaching. PT tạo hồ sơ/lời mời, nhập tay và review số đo; học viên nhận invite, xem dữ liệu của mình và check-in. Web dùng Next.js/Supabase với session, role và RLS; source có miền chat/lịch/context mới nhưng không được trình bày như đã rollout khi cloud chưa có evidence tương ứng.

| Deliverable guideline | Evidence | Trạng thái |
|---|---|---|
| Video demonstration + screenshots |[Walkthrough25/10](https://drive.google.com/file/d/1gjgn76IERkSat_4sFSLkezkrif2_m4Vu/view); [ảnh synthetic](../docs/handoff/screenshots/README.md) |Cófile/ảnh có provenance; chưa xem lại toàn video và receipt |
| Link sản phẩm để tải/sử dụng về sau |[Website](https://fitsync-app-one.vercel.app/), source GitHub |HTTP 200; chưa cóAPK/bản release tải được nghiệm thu. Web link chưa tự đáp ứng mọi cách hiểu “download” |
| Admin account to database |Cloud FitSync đã đọc số đếm; owner có cấu hình server |Chưa xác minh credential/viewer/admin access cho giảng viên. Không nhúng password/service-role vàoGit/form |
| Database thực tế theo ghi chú riêng FitSync |Project cloud ref`uqjqkvalzdrcvxayhtre`, 8 bảng core có data; 4 coaching relation REST 404 |ERD/schema không thay truy cập. Owner cần bàn giao truy cập theo quyền được duyệt |
| Runs well, market-ready |103 domain+4 guard+16 public browser, lint/typecheck/build17/11; backend historical CI |PARTIAL: chưa rerun 2 vai trò local/không Docker; auth/ops/provider/rollout còn gate |

Không dùng tour fixture để chứng minh persistence, không dùng fake OCR như OCR provider thật, không dùng ảnh mockup thay giao diện sản phẩm. [Demo runbook](../docs/DEMO_WORKFLOW.md), [test evidence](../docs/TEST_EVIDENCE.md) mô tả cách kiểm lại và giới hạn.

## Part 2: A customer acquisition plan (CAP)

[CAP_AND_ANALYTICS](../docs/CAP_AND_ANALYTICS.md) chứa phân khúc, 5 kênh có thể thử, kế hoạch theo ngày tương đối, lịch 7 bài và weekly metric contract. Hai nguồn đề xuất là Facebook/communityPT và referral/directPT; Zalo hỗ trợ onboarding, chỉ tính là acquisition riêng nếu chứng minh tạo lead mới. Chưa có bộ kết quả 2 kênh cùng kỳ.

| Kỳ/kênh | Awareness/reach | Clicks/downloads | Registrations | Trial/activation | Paid | Evidence |
|---|---|---|---|---|---|---|
| W8 – Facebook/community |Unknown|Unknown|Unknown nguồn|Unknown|Unknown|Thiếu export/bài đăng|
| W8 – referral/directPT |Unknown|Unknown|Unknown nguồn|Unknown|Unknown|Thiếu log ẩn danh|
| W9 – Facebook/community |Unknown|Unknown|Unknown nguồn|Unknown|Unknown|Thiếu export|
| W9 – referral/directPT |Unknown|Unknown|Unknown nguồn|Unknown|Unknown|Thiếu log|
| Snapshot toànDB 17/11 |Không có attribution|Không có download ledger|10 candidate ngoài seed|0 cặp đạt activation đề xuất|Unknown|Cloud chỉ đọc|

Overall funnel: awareness unknown, visits unknown, 10 candidate registrations, 10confirmed/ever signed-in, 0 cặp đủ activation, paid unknown. Không lấy reach1500/click210 trong tài liệu cũ khi chưa đối soát nguồn gốc. Không cộng những kênh trùng người thành unique audience.

## Part 3: Results

### User analytics

[Snapshot17/11](../docs/evidence/exe201-2026-11-17/cloud-metrics.json) có 27 Auth, 17 synthetic, 10 candidate=5 PT+5 học viên.9 candidate tạo 27/10 và 1 tạo 29/10; dữliệu phản ánh tài khoản còn tồn tại, không là đăng ký lịch sử đầyđủ sauxóa. Cả 10 confirmed/từng sign in; 0 last sign in 7 ngày, 0candidateInBody/check-in. Bốn Pro không là 4 paid. Không có retention event log đểtínhWAUcoaching/churn.

### Revenue/cost và financial analysis

[Báo cáo tài chính mới](https://drive.google.com/file/d/18SJXm70350xOMlOvkuLelAmP6xPavRRd/view?usp=drivesdk) có bảng tuần/lũykế, phân loại fixed/variable/cash/công, ledger template và kịch bản. Doanhthu/paid/chi phí actual chưa đối soát bằng chứng từ. Cash 0 đ là leaderreported06/11, không là billing audit 17/11. Mô hình giá PT 199 k là tham chiếu, không cam kết unlimited. BEP 17 cash/47 tính công là dựtoán, không kết quả thật.

### Customers' reviews

Trello cócard phỏngvấnW05 được HuyAPPROVED21/10, tài liệu ghi 10 người thử 4 PT+6 học viên. Chưa kiểm raw/consent/matching với 5 PT+5 học viên trên DB, chưa dùng SUS 83,25/taskcompletion96,5% hoặcquote cá nhân như đã xác minh. Cần đính kèm review được phép trích, cóngày, phiên bản và tác vụ. Không tạo testimonial.

### Paying-customer condition

Với mô hình PT cá nhân trả thuê bao hiện đề xuất, áp điều kiện ít nhất 20 paying customers. Chưa có đủproofđápứng. Hai phương án 2 tổchức/tổng 20 employees và 100 active users freemium có doanh thu nguồn khác chỉ áp dụng khi môhình thực sự tương ứng, không tựchọnđểlấp khoảng thiếu. Không lấy tài khoản học viên hoặc synthetic thay người trả phí. Mô hình không phải two-sidedpaidtransactionplatform đã nghiệm thu.

## Part 4: Conclusion

### Lessons learn ed

Nhóm học được cách tách kế hoạch khỏi kết quả, kiểm quyền theo quan hệ PT–học viên, giữ bước PT review số đo và dùng test tổng hợp để chứng minh hành vi. Bản đẹp/tour không thay kiểm persistence; trạng thái card/plan không thay evidence. Cần cùng định nghĩa cohort và cùng kỳ đo khi so sánh KPI.

### Limitations

Chưa xác minh khách độc lập, kênh acquisition/paid/cost và review gốc đầy đủ. Full authenticated test chỉ có CI lịch sử trong lượt đối soát; cloud còn drift, auth/ops/provider/billing/mobile chưa đủ release gate. Số liệu mẫu không đại diện thị trường và chưa chứng minh giá trị giảm thời gian.

### Suggestions for improving

Trong thời gian học phần còn lại, ưu tiên nghiệm thu core nhập tay trong môi trường cô lập, đối soát evidence thật, làm rõ database access và nộp đúng LMS. Nhóm quyết định dừng sau môn; đề xuất phát triển chỉ là bài học cho bên nhận bàn giao nếu có, không cam kết roadmap kinh doanh mới. Owner cần rà chi phí/cam kết hoàn tiền/hỗ trợ, xuất tài liệu và xử lý vòng đời dữ liệu. Không tự tắt cloud hoặc xóa dữ liệu trong lượt này.

## Part 5: Members' Contribution

Không tự gán phần trăm hoặc giờ làm. Bảng dưới là vai trò/artefact có nguồn, chưa là đánh giá đóng góp cuối. Cần từng người và nhóm xác nhận trước nộp.

| Thành viên | Vai trò/nguồn hiện có | Artefact có thể đối chiếu | Phần cần xác nhận |
|---|---|---|---|
| Huỳnh Quốc Việt |Product coordination, docs/review, Am 2 uocVi 3 t |Issue27/24, Trello report/docs, source history |Giờ/đóng góp thực, review, receipt nộp |
| Lê Nguyễn Gia Hưng |OCR/research/UI, hei 1 sme |Issue2/16/18/20/22, draft PR 15 và chuỗi UI |Phần thực hiện/đã merge, benchmark chưa đạt gate |
| Dương Quang Huy |Backend/DB/ops, huydqse180459-art |Issue 3 closed, issues 32–46 có dependency, TrelloapprovalW05 |Vận hành/payment actual và review |
| Diệp Khai |Web/Android, DiepKhai |Issue4closed/PR11merged, PR 47 open |Auth delivery/Android thực tế vàgiờ |
| Lê Văn Toàn |Design/marketing, GitHub account chưa chốt |Trelloassets/ERD/channelplans |URL nội dung/analytics, slide/media, giờ |

Tài liệu/automation mới trong phiên 17/11 do agent chuẩn bị theo yêu cầu, không tự phân bổ cho thành viên. Git commit auth or là cấu hình máy, không chứng minh mọi nội dung do bạn đó tự viết.

### Previous booked meetings, theo thời gian

| Thời điểm theo nguồn | Lecturer/mentor | Evidence | Trạng thái |
|---|---|---|---|
|29/10/2026 buổi tối, giờ cụthể chưa có |Nguyễn Thị Phương Loan theo mentor report |Report local + JPGtên 29/10 trong Drive |Reported, chưa receiptbooking/tham dự đầyđủ |
|06/11/2026, giờ cụthể chưa có |Chưa xác minh từ metadata ảnh |JPGtên 06/11 trong Mentor Evidence |Chưa xác minh loại meeting/người/booking |

Cần bổsung meetingID/linkbooking, giờICT, lecturer/mentor, attendees, feedback/action và receipt. Tên file/ngày created trên Drive không đủ chứng minh cuộc hẹn. Khôngtựtạolịchgặppast.
