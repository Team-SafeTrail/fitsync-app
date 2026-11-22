# FitSync — Final Report EXE201

**Cập nhật22/11/2026:** bản chuẩn bị nộp bổ sung. Cloud đã đọc lại22/11:27Auth,17synthetic,10candidate(5PT+5học viên),0InBody/check-in trong cohort; chưa xác minh toàn bộ là khách độc lập. CI0ba9821 qua114domain/363SQL fresh+upgrade/28core+4demo không retry. Windows đã cài Docker/WSL2 theo chấp thuận, không reboot; local production build/start và4/4demo PASS. Website cloud chưa rollout. [Evidence hiện hành](../docs/TEST_EVIDENCE.md), [readiness](FINAL_REPORT_READINESS.md), [bộ nộp](SUBMISSION_READY_2026-11-22.md). Phần0/20paying/cost/CAP/reviews/attendance vẫn thiếu thực tế; không thay bằng synthetic.

Nhóm SafeTrail · Bản cập nhật đối soát22/11/2026 để nộp bổ sung. Mốc trước19/11 theo owner đã qua. Nhóm dừng kinh doanh sau học phần. Cấu trúc đúng 5 phần Guidelines; bản này không xác nhận đã nộp hoặc đạt học phần. Web đầy đủ được giảng viên chấp nhận theo xác nhận owner, nên APK không là điều kiện bàn giao hiện tại.

## Part 1 / Outcome 1: Minimum Viable Product (MVP)

FitSync là workspace coaching cho PT độc lập và học viên tại Việt Nam. PT tiếp nhận hồ sơ, mời học viên, nhập/xác nhận số đo, xem tiến trình, theo dõi check-in, chat và quản lý lịch. Học viên chỉ thấy hồ sơ của mình, gửi cập nhật và đề nghị đổi/hủy lịch. Giải pháp tập trung ngữ cảnh coaching; chưa có phép đo chứng minh tiết kiệm giờ hoặc cải thiện sức khỏe.

Ứng viên bàn giao ở branch `agent/fitsync-final-product`, [draft PR48](https://github.com/Team-SafeTrail/fitsync-app/pull/48). Next.js15.5.29/React19.3.1 và Supabase Auth/PostgreSQL/private Storage.20 bảng public,14 migrations, session/role/quan hệ và RLS kiểm quyền. Không rewrite kiến trúc. Main và website của Huy chưa được cập nhật bằng PR này.

| Luồng | Hành vi ứng viên |
|---|---|
| Identity/roster | Đăng ký/đăng nhập/reset PKCE; invite một lần, cấp lại/thu hồi, sửa/lưu trữ/khôi phục hồ sơ |
| Tiến trình | Nhập tay 5 chỉ số, validation, PT xác nhận, biểu đồ và lịch sử; OCR chỉ draft khi có adapter |
| Coaching | Check-in/ảnh riêng, chat hai chiều, notes private/shared và membership theo ngày |
| Lịch/buổi | Đổi/hủy có đề nghị/chấp nhận, chặn overlap/version cũ; completion/đảo buổi có ledger append-only |
| Offer | Free tối đa 3 hồ sơ chưa lưu trữ; Pro còn hạn không giới hạn học viên, cùng coaching |
| Quản trị | Dashboard DB thật, sổ thu–chi/chứng từ private, đảo giao dịch, CSV, yêu cầu nâng cấp và event tổng hợp |

Tạo lịch/check-in không tự trừ buổi. Membership phòng tập và buổi PT khác thuê bao FitSync. Giao dịch TEST không cấp Pro hoặc tính doanh thu. Admin không dùng fixture thay dữ liệu thật. Dữ liệu demo có nhãn, không dùng sức khỏe khách thật.

| Deliverable | Evidence và giới hạn |
|---|---|
| Video/screenshots | [Product review ảnh/video](LOCAL_PRODUCT_REVIEW.html) chứa media gốc0ba9821, walkthrough36,36giây trên dữ liệu synthetic; [manifest](../docs/evidence/exe201-2026-11-18/media-manifest.json) ghi hash vàrun. Video25/10 là lịch sử |
| Sử dụng sản phẩm | [Runbook local](../docs/DEMO_WORKFLOW.md), source PR48; [website của Huy](https://fitsync-app-one.vercel.app/) là deployment cũ chưa xác định SHA |
| Database thực tế/admin access | [Owner review](DATABASE_REVIEW.html), Supabase cloud 8 bảng core/RLS; ứng viên 20 bảng trên stack isolated. Owner kiểm trước khi cung cấp Gmail giảng viên; chưa mở quyền |
| Runs well / market-ready | 114domain tests,lint/types/build;363SQL/RLS mỗiDB fresh/upgrade;28core+4demo CI khôngretry. Windowslocal production build/start và4/4demo PASS22/11; không tự chứng nhận market-ready |

Docker/WSL2 đã cài theo chấp thuận, không reboot. Web http://127.0.0.1:3000 vàStudio http://127.0.0.1:54323 đã chạy22/11. Local20bảng đều bậtRLS;4/4demo PASS, chưa chia sẻ giảng viên. CI dùng DB loopback tạm và dữ liệu synthetic để kiểm hành vi thật. Chưa migration/deploy production. OCR provider/full PDF và nutrition publication mở rộng, retention/delete/support/abuse còn giới hạn trước pilot dữ liệu thật.

## Part 2: A customer acquisition plan (CAP)

Khách mục tiêu là PT độc lập có học viên đang coach; PT là buyer, học viên dùng cùng PT. Persona là giả thuyết workflow, không giả tên/thu nhập hoặc số phỏng vấn. Định vị đề xuất: hồ sơ coaching tiếng Việt với bước PT xác nhận và hai vai trò. Chưa đủ dữ liệu tính TAM/SAM/SOM đáng tin cậy.

Hai nguồn acquisition đề xuất: Facebook cộng đồng PT và referral/direct PT. Zalo hỗ trợ nhận invite/onboarding, YouTube làm walkthrough. Chưa kết luận đây là hai kênh hiệu quả nhất. [CAP_AND_ANALYTICS](../docs/CAP_AND_ANALYTICS.md) có 5 kênh, lịch nội dung và metric contract.

| Kỳ/kênh | Awareness/click | Registrations | Activated pairs | Paid | Evidence |
|---|---|---|---|---|---|
| W8 Facebook/community |Chưa có export|Chưa attribution|Chưa đối soát theo kênh|0 toàn dự án theo owner|Thiếu URL/export gốc|
| W8 referral/direct |Chưa có log|Chưa attribution|Chưa đối soát theo kênh|Không phân bổ|Thiếu log ẩn danh|
| W9 Facebook/community |Chưa có export|Chưa attribution|Chưa đối soát theo kênh|0 toàn dự án theo owner|Thiếu export|
| W9 referral/direct |Chưa có log|Chưa attribution|Chưa đối soát theo kênh|Không phân bổ|Thiếu log|

Funnel hiện có: awareness/click unknown →10 candidate accounts →10 confirmed/ever signed-in →0 cặp đạt activation đề xuất →0 paying PT theo owner. Không gán nguồn cho 10 tài khoản nếu không có attribution. Mốc 60 trong form được lập kế hoạch 20 PT+40 học viên, còn 50 nếu baseline hợp lệ. Kế hoạch 14 ngày không còn khả thi trước 19/11; không tạo tài khoản giả để báo đạt. Mọi target/conversion trong kế hoạch là giả định cần kiểm chứng.

## Part 3: Results

### Users' analytics

[Cloud aggregate22/11](../docs/evidence/exe201-2026-11-22/cloud-metrics.json): 27 Auth,17 synthetic,10 candidate=5 PT+5 học viên. Cả 10 confirmed và từng đăng nhập;9 tạo 27/10,1 tạo 29/10. Chưa xác minh toàn bộ candidate độc lập với team/test. Cohort có 0 InBody/check-in và 0 last-sign-in 7 ngày; chưa có cặp đạt activation đề xuất. Tổng 15 InBody/8 check-in toàn DB thuộc synthetic. Không suy last-sign-in thành WAU coaching, số 0 thành churn hoặc lịch sử đầy đủ sau xóa.

| Kỳ đăng ký của candidate còn tồn tại | Số tài khoản | Giới hạn |
|---|---:|---|
|27/10/2026|9|Không là attribution hoặc lịch sử tài khoản đã xóa|
|29/10/2026|1|Cần xác minh độc lập|
|Snapshot22/11|10|5 PT+5 học viên; không là 20 paying customers|

Bản ứng viên có product_events tối thiểu và tổng hợp theo tuần/kênh tự khai báo, loại synthetic; chưa rollout cloud và không thể phục dựng event quá khứ. Bộ demo 20 PT/8 học viên mới phục vụ trình bày phần mềm, tách KPI thật.

### Revenue, costs và financial analysis

Giá owner chốt 199.000đ/PT/tháng, Free 3/Pro còn hạn unlimited cùng coaching. **Chưa có giao dịch thật: 0 paying PT,0 đ thu khách hàng theo owner.** Chưa có sao kê độc lập; không tạo biên lai giả.4 nhãn Pro trong cloud không thay chứng từ. Chi phí chưa đối soát, không mặc định 0; tiền học viên trả PT không tự là doanh thu FitSync.

| Kỳ | Tiền thu khách | Cash chi/công | Kết luận |
|---|---|---|---|
|W1–W7 từng tuần|0 theo owner đến snapshot, chưa audit phân kỳ|Chưa có ledger/timesheet đầy đủ|Chưa tính profit|
|W8 nội bộ26/10–01/11|0 theo xác nhận chưa có giao dịch|Chưa đối soát|Ngày nội bộ không thay LMS|
|W9 nội bộ02/11–08/11|0 theo xác nhận chưa có giao dịch|Chưa đối soát|Không suy cost 0|
|Đến xác nhận17/11|0|Chưa đối soát|0/20 paying PT|

[Financial report trên Drive](https://drive.google.com/file/d/18SJXm70350xOMlOvkuLelAmP6xPavRRd/view?usp=drivesdk) và [bản local](FINANCIAL_REPORT.md) tách actual với scenario. Kịch bản cash fixed 3 triệu, variable 16.990đ/PT, contribution 182.010 đ →BEP 17 PT. Tính thêm công fixed 7,8 triệu, variable 31.990đ/PT, contribution 167.010 đ →BEP 47 PT.20 PT giả định có thu 3.980.000 đ, cash result 640.200 đ, economic result−4.459.800 đ. Đây là dự toán, không phải FitSync đã hòa vốn. Chưa đủ dữ liệu CAC/LTV/churn.

### Customers' reviews và điều kiện trả phí

Trello W05 có approval tài liệu phỏng vấn 10 người (4 PT+6 học viên). Chưa đủ raw/consent/matching với cohort 5 PT+5 học viên; không trích testimonial/SUS/task completion chưa kiểm gốc. Không tạo review mới giả như người đã trải nghiệm.

Mô hình PT cá nhân áp điều kiện **ít nhất 20 paying customers** trong Guidelines. Thực tế hiện **0/20**, chưa đáp ứng. Không chuyển sang ngưỡng tổ chức hoặc freemium quảng cáo để né điều kiện khi mô hình không tương ứng. TEST ledger và PDF có nhãn mô phỏng chỉ chứng minh kỹ thuật; không là paid proof. Phần này cần trình bày thẳng với giảng viên, không tự xác nhận đạt Outcome 3.

## Part 4: Conclusion

Nhóm đã phát triển một workspace web có lưu DB và các kiểm soát quyền, tách membership/ngày, lịch và số buổi; thiết kế workflow có validation, idempotency và audit. Bài học là card DONE, UI đẹp, nhãn Pro và tài khoản seed không thay nghiệm thu hoặc bằng chứng khách hàng. Nâng cấp framework phải kiểm lại form reset, navigation và nhiều lần lưu liên tiếp.

Giới hạn: chưa đạt paid condition; thiếu analytics kênh/review gốc/cost actual, chưa rollout ứng viên lên site của Huy; local đã chạy với Docker, phải giữ Engine/dịch vụ mở khi demo. OCR/full-report và hợp đồng vận hành trước pilot thật chưa đủ. Không có cơ sở kết luận sản phẩm đã tạo hiệu quả kinh doanh hoặc đủ market readiness với dữ liệu sức khỏe thật.

Bộ ứng viên, video/screenshots/database review,form/final/slides đã chuẩn bị và kiểm. Trước gửi: owner duyệt database, nhóm xác nhận contribution/attendance và nội dung thiếu, sau đó nộp qua nguồn chính thức và lưu receipt. Nhóm dừng sau môn; owner cần rà nghĩa vụ, công nợ, quyền truy cập và vòng đời dữ liệu. Chưa tự đóng/xóa dịch vụ hoặc hứa tiếp tục kinh doanh. Các gợi ý cải tiến về sau là bài học bàn giao, không cam kết roadmap.

## Part 5: Members' Contribution

| Thành viên | Vai trò và artefact có thể đối chiếu | Cần nhóm xác nhận |
|---|---|---|
|Huỳnh Quốc Việt (`Am2uocVi3t`)|Điều phối, quyết định sản phẩm, tài liệu/review; Git/Trello|Đóng góp thực/giờ, review và receipt nộp|
|Lê Nguyễn Gia Hưng (`hei1sme`)|OCR/research/UI; issues/PR lịch sử|Benchmark và phần đã nghiệm thu|
|Dương Quang Huy (`huydqse180459-art`)|Backend/database/ops, quản lý site hiện có|Review migrations, vận hành và cost thực|
|Diệp Khai (`DiepKhai`)|Web/auth/Android theo issue; PR47 auth tích hợp trên branch ứng viên|Review web/auth, không cần APK cho nộp hiện tại|
|Lê Văn Toàn (GitHub chưa chốt)|Design/marketing theo Trello|URL nội dung/analytics, media và công thực|

Không tự gán phần trăm/giờ hoặc phân bổ công agent cho thành viên. Git author cấu hình máy không chứng minh mỗi người đã tự làm mọi thay đổi.

| Cuộc hẹn theo nguồn | Loại/người | Mức bằng chứng |
|---|---|---|
|08/10/2026 16:00 ICT|Lecturer Khiem Tran,30 phút|Email Calendly booking; chưa chứng minh attendance|
|29/10/2026, giờ chưa xác minh|Mentor Nguyễn Thị Phương Loan theo report nhóm|Report/ảnh lịch sử, thiếu booking/attendance đủ|
|03/11/2026 09:00 ICT|Lecturer Khiem Tran,30 phút|Email booking; chưa chứng minh attendance|
|06/11/2026, giờ/loại chưa xác minh|Ảnh trong Mentor Evidence|Metadata không tự xác nhận meeting|
|13/11/2026 09:00 ICT|Lecturer Khiem Tran,30 phút|Email booking; chưa chứng minh attendance|

[MENTORING_EVIDENCE](MENTORING_EVIDENCE.md) ghi nguồn tối thiểu, không lộ email private/credential. Booking giảng viên không thay 2 buổi mentor chính thức/F-Spark/FAP. Chưa có đủ receipt attendance; không tạo lịch hẹn quá khứ giả.
