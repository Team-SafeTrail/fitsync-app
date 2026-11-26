# FitSync — kịch bản sản phẩm và Week8–9

10 slide, khoảng8–10 phút. Đối soát22/11/2026. Dùng deck hiện hành trongCANVA_DELIVERY.md. Số liệu có nguồn; không trình bày synthetic như khách hoặc paid actual.

## Slide 1 — FitSync

**Key Message:** Báo cáo gắn sản phẩm với bằng chứng, không chỉ hoàn thiện form.

**Speaking Script:** Em chào thầy và các bạn. Nhóm SafeTrail xin trình bày FitSync, đồng thời cập nhật nội dung Week8 và Week9 trong bản cập nhật để nộp bổ sung. Lần này nhóm tập trung vào sản phẩm web có database, các luồng hai vai trò và bộ minh chứng. Số liệu mới được đối soát ngày22 tháng11, nên nhóm không trình bày như đã có ở đúng tuần học. Nhóm đã quyết định dừng kinh doanh sau môn. Phần nào chưa đủ bằng chứng hoặc chưa đạt điều kiện, nhóm sẽ nêu rõ để thầy đánh giá.

**Visual Explanation:** Bìa ghi sản phẩm, phạm vi báo cáo và mốc đối soát, không đưa traction giả.

**Transition:** Trước hết, đây là quy trình mà sản phẩm muốn hỗ trợ.

**Evidence:** Bản hồi cứu theo W8/W9/Final Guidelines và quyết định owner. Chưa xác nhận đã nộp hoặc đạt học phần.

## Slide 2 — Một hồ sơ cho quá trình coaching

**Key Message:** Giữ ngữ cảnh coaching từ tiếp nhận đến theo dõi.

**Speaking Script:** PT thường phải tìm thông tin trong nhiều nơi như tin nhắn, bảng tính và phiếu đo. FitSync tổ chức thành ba giai đoạn: tiếp nhận hồ sơ và mời học viên; nhập số đo có validation và PT xác nhận; sau đó đồng hành bằng check-in, chat, lịch và ghi chú. Membership theo ngày và số buổi PT là hai thứ khác nhau. Nhóm muốn giảm việc nhập và tìm thông tin, nhưng chưa có nghiên cứu tác vụ đủ để khẳng định đã tiết kiệm bao nhiêu giờ. Đây là mục tiêu giá trị, không phải kết quả đã đo.

**Visual Explanation:** Ba cột là sơ đồ quy trình minh họa. Các số01–03 là thứ tự tác vụ, không phải tỷ lệ chuyển đổi.

**Transition:** Hai giao diện tiếp theo cho thấy quy trình này trong bản nghiệm thu.

**Evidence:** Kiến trúc source PR48. Sơ đồ quy trình minh họa, không phải funnel hoặc mức hiệu quả đã đo.

## Slide 3 — Giao diện thật của bản nghiệm thu

**Key Message:** Ảnh lấy từ ứng dụng chạy thật trên DB synthetic.

**Speaking Script:** Bên trái là hồ sơ PT và bên phải là giao diện học viên trên điện thoại. Đây là ảnh gốc từ CI chạy ứng dụng với Supabase tạm, không phải hình UI do công cụ thiết kế tự dựng. Các tài khoản và số đo đều synthetic. Những bài kiểm liên quan kiểm việc lưu dữ liệu, đọc lại ở hai vai trò và chặn người ngoài. Ảnh chứng minh bản nghiệm thu tương ứng, không tự chứng minh website hiện có của Huy đã rollout. Khi demo, nhóm phân biệt workspace có tài khoản với public tour dùng fixture.

**Visual Explanation:** Giữ nguyên bytes của hai PNG, đặt trong bố cục slide; caption ghi run và phạm vi synthetic.

**Transition:** Từ sản phẩm, nhóm chuyển sang số liệu so với KPI của Week8.

**Evidence:** Nguồn PNG nguyên bản: docs/evidence/exe201-2026-11-18/demo/handoff-pt-dossier.png và handoff-trainee-home.png. CI44155536123/artifact14360972525. Hai vai trò có dữ liệu persist; /app là tour riêng. Không dựng lại UI.

## Slide 4 — Week 8: kết quả so với KPI

**Key Message:** 10 tài khoản ngoài seed vẫn cần xác minh độc lập.

**Speaking Script:** Snapshot cloud đọc lại ngày22 tháng11 có27 tài khoản Auth. Nhóm loại17 tài khoản synthetic, còn10 candidate, gồm5 PT và5 học viên. Nếu mốc60 tính cả hai vai trò thì tiến độ theo tài khoản là16,7 phần trăm. Nhóm chưa xác minh toàn bộ10 tài khoản là khách độc lập ngoài team hoặc test, nên chưa gọi đây là10 khách hàng đã được chứng minh. Nếu giảng viên chỉ tính PT, nhóm cần đối chiếu lại mẫu số. Tài khoản đăng ký và khách trả phí được theo dõi riêng.

**Visual Explanation:** Ba số27,17,10 đối soát được; tỷ lệ10/60 có điều kiện về cách tính.

**Transition:** Vậy nhóm đã có kế hoạch kênh và quyết định sau môn như thế nào?

**Evidence:** Cloud-metrics snapshot. Mốc60 chưa định nghĩa PT-only; không dùng tổng kỹ thuật làm khách thật. Candidate không phải paying.

## Slide 5 — Week 8: kênh và quyết định

**Key Message:** Kế hoạch kênh chưa phải kết quả chiến dịch; nhóm chọnNo.

**Speaking Script:** Trello có nhiều kế hoạch kênh, nhưng chưa có export cùng kỳ đủ để nói kênh nào hiệu quả nhất. Nhóm đề xuất Facebook cộng đồng PT và referral hoặc direct PT là hai nguồn acquisition; Zalo hỗ trợ onboarding. Kế hoạch60 tài khoản là20 PT và40 học viên. Nếu baseline hợp lệ, cần thêm50 tài khoản. Tuy nhiên, kế hoạch14 ngày không thể bắt đầu ngày18 để đạt trước19 tháng11, nên nhóm không cam kết sai mốc. Nhóm chọnNo cho việc tiếp tục kinh doanh sau môn, tập trung bàn giao và xử lý nghĩa vụ còn lại.

**Visual Explanation:** Hai cột tách lựa chọn kênh và quyết định của nhóm. Target20+40 không được thể hiện như actual.

**Transition:** Week9 yêu cầu nhìn sâu hơn vào hoạt động của cohort này.

**Evidence:** W8 Step2–5, owner chọnNo. CAP là kế hoạch, chưa chạy outreach/ads hoặc có export đủ2 kênh.

## Slide 6 — Week 9: analytics chưa thành traction

**Key Message:** Chưa có bằng chứng activation hoặc giao dịch thật.

**Speaking Script:** Cả10 candidate đã xác nhận email và từng đăng nhập, nhưng cohort này chưa có bản ghi InBody hoặc check-in trong snapshot. Tổng số đo và check-in toàn database thuộc bộ thử, không tính thành hoạt động khách. Chủ dự án xác nhận chưa có giao dịch thật, nên actual paying PT bằng0. Bốn nhãn Pro không thay chứng từ thanh toán. Ứng viên mới đã có event tối thiểu và tổng hợp theo tuần, nhưng chưa rollout và không thể suy lại reach, click hoặc retention quá khứ. Nhóm cũng không dùng last-sign-in như WAU coaching.

**Visual Explanation:** Ba chỉ tiêu10,0,0 có nhãn và mẫu số rõ; không gắn health values hoặc danh tính.

**Transition:** Vì vậy phần tài chính cần tách actual với kịch bản.

**Evidence:** W9 Step1/3. Candidate last-sign-in7 ngày0 không bằng WAU coaching hoặc churn. Synthetic demo không vào KPI.

## Slide 7 — Week 9: tài chính và offer đã chốt

**Key Message:** Offer đã chốt, hòa vốn vẫn là dự toán.

**Speaking Script:** Giá đã được owner chốt199 nghìn đồng mỗi PT mỗi tháng. Free tối đa3 hồ sơ chưa lưu trữ, gồm hồ sơ chờ nhận lời mời; Pro còn hạn không giới hạn học viên và cùng chức năng coaching. Actual hiện chưa có tiền thu từ khách, chi phí chưa đối soát. Trong kịch bản cash, fixed3 triệu và variable16.990 đồng mỗi PT dẫn đến hòa vốn17 PT. Nếu tính thêm công thì cần47 PT. Với20 PT giả định, thu3,98 triệu và cash result640.200 đồng; kết quả tính công vẫn âm. Đây là dự toán, không là doanh thu thật. PDF và giao dịch TEST chỉ kiểm phần mềm.

**Visual Explanation:** Hai mứcBEP dùng cùng giá199k nhưng cấu trúc chi phí khác nhau. Bảng actual trong báo cáo không lấy số scenario thay thế.

**Transition:** Tiếp theo là phần kỹ thuật nhóm có thể chỉ ra bằng kiểm thử thực tế.

**Evidence:** Hai gói cùng chức năng coaching. FINANCIAL_REPORT và link Drive18SJXm70350xOMlOvkuLelAmP6xPavRRd. BEP là dự toán, không actual. TEST ledger không cấpPro/không doanh thu; chưa bank receiver.

## Slide 8 — Kỹ thuật: có bằng chứng thực thi

**Key Message:** Kiểm thử có revision và môi trường; source khác production.

**Speaking Script:** Bản ứng viên có114 domain tests,363 assertions SQL vàRLS chạy cả DB mới và rehearsal nâng cấp. Bộ browser core có28 luồng và4 bài demo qua ngay lần đầu ở revision0ba9821. Các lần thất bại trước đó được giữ trong lịch sử kiểm thử. Seed demo được chạy hai lần để kiểm không ghi trùng, tổng22 TEST entries và KPI tài chính thật không đổi. Source hiện20 bảng và14 migrations, cloud vẫn8 bảng nên nhóm chưa nói đã triển khai lên website. Docker vàWSL2 đã được cài theo chấp thuận, không reboot. Ngày22 tháng11, local production build đã chạy, cùng4 bài demo qua trên máyWindows với Auth, database vàstorage riêng. Đây là kết quả local thực tế, tách với các bộ SQL vàcore trên CI.

**Visual Explanation:** Các số thuộc từng loại kiểm, không cộng363 của hai lần chạy thành số tình huống độc lập mới. Không hiển thị credential.

**Transition:** Kiểm thử kỹ thuật vẫn khác việc đáp ứng mọi điều kiện final.

**Evidence:** Quality và backend CI qua checkpoint; core28 bài qua ngay lần đầu ở0ba9821. Demo UI4 tests và seed idempotence qua. Lint/type/build và audit production0 đã kiểm ở checkpoint. Docker/WSL2 đã cài, không reboot. Local22/11 production build/start và4/4 demo PASS; xem local-demo-verification.json. Source không đồng nghĩa siteHuy đãrollout.

## Slide 9 — Khoảng thiếu của Final Guidelines

**Key Message:** 0/20 paying là khoảng thiếu thật, không lấp bằng seed.

**Speaking Script:** Final Guidelines yêu cầu tối thiểu20 paying customers khi khách mục tiêu là cá nhân. FitSync hiện0 trên20 theo xác nhận owner, nên nhóm chưa đáp ứng điều kiện này. Web đầy đủ được chấp nhận thay APK không tự miễn điều kiện kinh doanh. Nhóm cũng còn thiếu analytics hai kênh cùng kỳ, cost actual và review có nguồn. Database cần owner xem trước rồi mới cấp quyền giảng viên. Phần contribution và mentoring cần xác nhận attendance; booking email không tự chứng minh đã tham dự. Bộ mô phỏng có nhãn giúp demo kỹ thuật, không làm bằng chứng khách đã chuyển tiền.

**Visual Explanation:** Danh sách ưu tiên là khoảng thiếu để thầy đánh giá, không phải checklist đã hoàn thành.

**Transition:** Nhóm kết thúc bằng cách mở và kiểm bộ bàn giao.

**Evidence:** Final5parts, individuals>=20paid. Web đầy đủ được giảng viên chấp nhận theo owner nênAPK không làblocker. Booking Calendly khácattendance và2mentorofficialsessions.

## Slide 10 — Hoàn tất bản bàn giao có thể kiểm

**Key Message:** Bản bàn giao có đường dẫn, trạng thái và phần cần owner xử lý.

**Speaking Script:** Nhóm đã gom một product review để mở ảnh giao diện, các video thao tác, database review và runbook. Source được lưu trên branch riêng và PR để review, không tự merge vào main hoặc đổi production. Bước còn lại là duyệt ứng viên, mở bản local đã kiểm và duyệt database, nộp đúng form hoặcLMS và lưu receipt. Nhóm dừng kinh doanh sau học phần nên cần bàn giao source, quyền và nghĩa vụ rõ ràng. Phần chưa đạt được ghi thẳng trong final report. Nhóm xin trình diễn sản phẩm và tiếp nhận đánh giá của thầy.

**Visual Explanation:** Bốn bước là luồng bàn giao và nộp; không ngụ ý đã có receipt hoặc quyền lecturer.

**Transition:** Chuyển sang demo local đã kiểm, hoặc mở video có provenance trong product review.

**Evidence:** reports/LOCAL_PRODUCT_REVIEW.html, docs/DEMO_WORKFLOW.md, project-management/FINAL_DELIVERY.md. Owner kiểmDB trướcGmaillecturer. Chưa tự submit/merge/deploy/chia sẻ quyền.
