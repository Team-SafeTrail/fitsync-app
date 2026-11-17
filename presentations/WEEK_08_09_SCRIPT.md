# FitSync — kịch bản báo cáo Week 8–9

Bản 10 slide, khoảng 8–10 phút. Đối soát 17/11/2026. Dùng deck “Final verified deck” trong CANVA_DELIVERY.md hoặc PDF đi kèm. Các nguồn đọc sau tuần học được giới thiệu là cập nhật hồi cứu. Không dùng bản Canva AI draft bị loại vì có giao diện dựng giả.

## Slide 1 — FitSync

**Key Message:** Nhóm báo cáo tiến độ theo bằng chứng và ưu tiên hoàn thành học phần.

**Speaking Script:** Em chào thầy và các bạn. Nhóm SafeTrail xin báo cáo FitSync theo yêu cầu Week 8 và Week 9. Nội dung hôm nay được đối soát lại ngày 17 tháng 11, nên nhóm sẽ phân biệt rõ kết quả đã kiểm tra, dữ liệu còn thiếu và kế hoạch. Nhóm cũng đã quyết định dừng kinh doanh sau học phần, vì vậy trọng tâm hiện tại là hoàn thiện bài nộp, demo và bàn giao có trách nhiệm.

**Visual Explanation:** Trang bìa chỉ có tên dự án, kỳ báo cáo và ngày đối soát. Không có số người dùng hoặc kết quả kinh doanh chưa được kiểm chứng.

**Transition:** Trước tiên, nhóm nhắc lại công việc mà FitSync muốn hỗ trợ.

**Evidence:** Yêu cầu Week 8/9 và quyết định trực tiếp của người dùng trong phiên 17/11.

## Slide 2 — Hồ sơ coaching có ngữ cảnh

**Key Message:** FitSync giữ thông tin và thao tác coaching trong bối cảnh của từng học viên.

**Speaking Script:** Vấn đề nhóm tập trung là PT phải tìm lại thông tin qua nhiều nơi, từ tin nhắn đến bảng tính và phiếu đo. FitSync tổ chức quy trình từ tiếp nhận học viên, nhập số đo có bước PT xác nhận, đến xem tiến trình và check-in. Giá trị nhóm muốn tạo ra là giảm việc nhập và tìm dữ liệu. Hiện chưa có phép đo đủ để nói đã tiết kiệm bao nhiêu giờ hoặc tăng doanh thu, nên nhóm giữ đây là giá trị cần kiểm chứng.

**Visual Explanation:** Ba bước là sơ đồ luồng minh họa. Sơ đồ mô tả quy trình, không phải dữ liệu chuyển đổi thực tế.

**Transition:** Đây là hai giao diện thật trong bộ nghiệm thu tổng hợp của sản phẩm.

**Evidence:** PRODUCT_DECISIONS.md, ARCHITECTURE.md và source main `3c816e9`.

## Slide 3 — Giao diện sản phẩm đã nghiệm thu

**Key Message:** Screenshot thật của ứng dụng được phân biệt với tour và dữ liệu khách hàng.

**Speaking Script:** Bên trái là hồ sơ PT, bên phải là web học viên trên màn hình điện thoại. Hai ảnh này lấy từ bài nghiệm thu trên stack Supabase tạm, dùng tài khoản và số liệu synthetic ngày 30 tháng 10. Chúng chứng minh giao diện đã có trong bản nghiệm thu đó, không phải hình khách hàng đang dùng production. Luồng có tài khoản nằm ở workspace; phần app công khai là tour dùng dữ liệu mẫu. OCR provider thật, Android và thanh toán vẫn chưa được nhóm nghiệm thu đầy đủ.

**Visual Explanation:** Hai ảnh nguyên bản được đặt trên slide, không dựng lại UI hoặc thêm số lượng học viên giả vào ảnh.

**Transition:** Với ranh giới đó, nhóm trình bày số liệu người dùng đã đọc lại.

**Evidence:** `docs/handoff/screenshots/README.md`, backend run 41092400099, hai PNG nguyên bản được nhúng trong HTML/PDF.

## Slide 4 — Week 8: kết quả so với KPI

**Key Message:** Có 10 tài khoản ngoài seed, tương đương 16,7% mốc 60 theo cách tính tài khoản.

**Speaking Script:** Cloud hiện có 27 tài khoản Auth. Nhóm loại 17 tài khoản được gắn cờ synthetic, còn 10 tài khoản ngoài seed, gồm 5 PT và 5 học viên. Nếu mốc 60 tính cả hai vai trò thì tiến độ là 16,7%, còn thiếu 50. Tuy nhiên, bộ lọc kỹ thuật chưa xác nhận toàn bộ 10 tài khoản là khách độc lập ngoài team hoặc test. Vì vậy nhóm dùng đúng tên “tài khoản ngoài seed”, đồng thời không lấy tổng 27 làm số khách hàng thật.

**Visual Explanation:** Ba số 27, 17 và 10 thể hiện phép lọc cohort. Tỷ lệ 16,7% được tính từ 10 chia 60, không phải tỷ lệ thanh toán.

**Transition:** Kế hoạch tiếp cận được đặt cạnh quyết định dừng kinh doanh sau môn.

**Evidence:** Cloud snapshot 17/11 trong `docs/evidence/exe201-2026-11-17/cloud-metrics.json`.

## Slide 5 — Week 8: kênh và quyết định

**Key Message:** Kênh và mốc 60 là kế hoạch thử trong học phần; nhóm chọn dừng sau môn.

**Speaking Script:** Nhóm đề xuất thử Facebook cộng đồng PT và referral hoặc tiếp cận PT trực tiếp; Zalo hỗ trợ nhận invite và onboarding. Chưa có export analytics cùng kỳ để gọi hai kênh này là hiệu quả nhất. Kế hoạch tham chiếu 60 tài khoản gồm 20 PT và 40 học viên, cần bổ sung ròng 15 PT và 35 học viên nếu baseline hợp lệ. Đây là mục tiêu thử, chưa phải kết quả. Có 60 tài khoản cũng chưa bảo đảm 20 người trả phí. Nhóm sẽ kết thúc kinh doanh sau môn theo quyết định đã xác nhận.

**Visual Explanation:** Hai cột tách kênh đề xuất và quyết định của nhóm. Các số cộng thêm chỉ là khoảng cách kế hoạch.

**Transition:** Week 9 cần nhìn sâu hơn việc đăng ký, đặc biệt là sử dụng và thanh toán.

**Evidence:** CAP_AND_ANALYTICS.md, Week 8 Step 3–5 và quyết định người dùng.

## Slide 6 — Week 9: customer analytics

**Key Message:** Đăng ký và plan Pro chưa chứng minh activation hay trả tiền.

**Speaking Script:** Cả 10 tài khoản ngoài seed đã xác nhận email và từng đăng nhập. Tuy nhiên, tại snapshot này không có tài khoản trong nhóm có last sign-in trong 7 ngày gần nhất, và chưa có InBody hoặc check-in thuộc cohort. Do đó chưa có cặp đạt định nghĩa activation đề xuất của nhóm. Last sign-in cũng không phải WAU coaching, nên nhóm chưa suy ra churn từ con số này. Trong 5 PT có 4 plan Pro, nhưng chưa có chứng từ để nói đó là 4 khách trả tiền.

**Visual Explanation:** Các số 0 có mẫu số và phạm vi cohort rõ ràng. Không sử dụng record/check-in của seed làm hoạt động khách.

**Transition:** Vì chưa đối soát thanh toán, phần tài chính được trình bày thành actual chưa rõ và kịch bản riêng.

**Evidence:** Cloud snapshot 17/11, metric definitions và limitations trong CAP_AND_ANALYTICS.md.

## Slide 7 — Week 9: tài chính

**Key Message:** Có thể phân tích logic hòa vốn, chưa thể kết luận lợi nhuận thực.

**Speaking Script:** Giá 199 nghìn đồng mỗi PT mỗi tháng là mức tham chiếu hiện hành, còn cần làm rõ offer và hạn mức. Doanh thu và paid users chưa đối soát bằng ledger hoặc biên lai. Hai số hòa vốn trên slide là kịch bản học thuật: fixed cash 3 triệu với contribution 182.010 đồng cần 17 PT; khi tính công nhóm và support, fixed 7,8 triệu với contribution 167.010 đồng cần 47 PT. Đây không phải FitSync đã đạt hòa vốn. Báo cáo online giữ rõ các giả định và những phần chưa đủ chứng từ.

**Visual Explanation:** Hai phép tính dùng cùng giá tham chiếu nhưng khác phạm vi chi phí. Contribution margin không phải net margin.

**Transition:** Về kỹ thuật, nhóm có các kết quả kiểm lại cụ thể nhưng cũng giữ giới hạn môi trường.

**Evidence:** FINANCIAL_REPORT.md, link Drive trong DELIVERY_LINKS.md, phép tính được kiểm bằng script.

## Slide 8 — Kiểm tra kỹ thuật ngày 17/11

**Key Message:** Public demo và quality gates đã qua; full authenticated demo mới có CI lịch sử.

**Speaking Script:** Lần kiểm local này qua 103 domain tests, 4 bài kiểm guard cô lập và 16 public browser tests. Lint, typecheck và production build cũng thành công. Các browser tests kiểm landing, tour, legal và auth guard, không ghi dữ liệu lên cloud. Full authenticated end-to-end có bằng chứng CI synthetic lịch sử, nhưng chưa chạy lại local vì máy thiếu Docker. PR 47 về auth còn mở; bốn bảng coaching mới chưa truy cập được qua REST cloud. Nhóm không đồng nhất code đã merge với tính năng đã rollout.

**Visual Explanation:** Các số test là kết quả thật, không phải ảnh terminal dựng. Phần giới hạn nằm ngay trên slide.

**Transition:** Vì vậy, nhóm đối chiếu những khoảng thiếu với yêu cầu final thay vì tự tuyên bố market-ready.

**Evidence:** TEST_EVIDENCE.md, logs 17/11, GitHub snapshot và database probe PGRST205.

## Slide 9 — Khoảng thiếu trước khi nộp final

**Key Message:** Final còn thiếu evidence kinh doanh, truy cập và xác nhận đóng góp.

**Speaking Script:** Guideline yêu cầu CAP có ít nhất hai kênh, số liệu theo tuần và toàn kỳ, bảng doanh thu–chi phí, phân tích tài chính và phản hồi khách hàng. Với mô hình PT cá nhân trả thuê bao, điều kiện kết quả là ít nhất 20 khách trả phí; hiện nhóm chưa đủ bằng chứng đáp ứng. Ngoài ra cần kiểm truy cập database cho giảng viên, phiên bản video/demo, bảng contribution và lịch hẹn mentor. Nhóm đã tìm thấy file walkthrough ngày 25 tháng 10, nhưng metadata chưa thay việc xem lại nội dung và receipt nộp.

**Visual Explanation:** Danh sách là những khoảng thiếu thực tế. “Ít nhất” được giữ đúng, không đổi thành “trên” 2 kênh hoặc 20 khách.

**Transition:** Phần cuối là thứ tự hoàn tất học phần và kết thúc dự án.

**Evidence:** Final Guidelines, FINAL_REPORT_READINESS.md và Drive metadata video.

## Slide 10 — Hoàn tất học phần và bàn giao

**Key Message:** Hoàn tất bài nộp bằng chứng đúng, rồi bàn giao và kết thúc theo quyết định nhóm.

**Speaking Script:** Trong thời gian còn lại, nhóm ưu tiên kiểm lại form, demo và evidence theo đúng phiên bản; nộp theo hướng dẫn LMS và lưu receipt. Source, tài liệu, cách chạy và phần còn thiếu cần được bàn giao rõ ràng. Sau học phần, owner rà tài khoản, dữ liệu, chi phí và những nghĩa vụ đã cam kết nếu có. Lượt này chưa tự tắt cloud hoặc xóa dữ liệu. Nhóm không trình bày roadmap mở rộng như cam kết kinh doanh sau môn. Em cảm ơn thầy và sẵn sàng giải thích các nguồn đối soát.

**Visual Explanation:** Bốn bước thể hiện thứ tự cần thực hiện, không phải các bước đã hoàn thành.

**Transition:** Chuyển sang demo public có nhãn hoặc phần hỏi đáp. Nếu được yêu cầu demo backend, nêu rõ giới hạn và dùng evidence synthetic có nguồn.

**Evidence:** Quyết định người dùng, DEMO_WORKFLOW.md và FINAL_DELIVERY.md.
