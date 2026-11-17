# FitSync EXE201 — kế hoạch thực thi

Ngày đối soát: 17/11/2026 (Asia/Saigon). Đây là lượt hoàn thiện hồi cứu, không backdate kết quả vào Week 8/9.

## Phạm vi đã được yêu cầu

Hoàn thiện báo cáo, audit và kiểm thử trong branch `agent/exe201-fitsync-completion`, base `origin/main` = `3c816e977d50f8a9bda1703cf4d6f3a417f86d0c`. Không merge, force-push hoặc rollout production. Yêu cầu tổng thể của người dùng cho phép thực thi các hạng mục liên quan; quy trình nhận task bằng tên thành viên trong TEAM_PLAYBOOK không áp dụng cho yêu cầu tổng thể này. Không nhận thay các issue đang được thành viên thực hiện.

## Thứ tự công việc

1. **P0:** Đọc đầy đủ form Week 1–9 và Final Guidelines, lập ma trận yêu cầu và nguồn.
2. **P0:** Đối chiếu Trello, GitHub, dữ liệu kinh doanh đã có; tách actual, nguồn lịch sử, giả định và kế hoạch.
3. **P1:** Kiểm tra dependency, unit/lint/type/build, smoke public và acceptance backend trên môi trường tổng hợp được cô lập nếu khả dụng. Chỉ sửa lỗi được tái hiện và trong phạm vi demo.
4. **P0:** Viết đúng 6 mục Week 8 và 5 mục Week 9; tạo financial report có dữ liệu thiếu được ghi rõ, CAP/funnel và bản nháp final đúng 5 phần.
5. **P2:** Tạo Canva mới, khoảng 10 slide 16: 9, dùng screenshot tổng hợp có provenance và kịch bản tiếng Việt.
6. **P2:** Đối soát các card phù hợp, giữ lịch sử và trách nhiệm; chuẩn bị commit/PR, xác minh và bàn giao.

## Điều kiện hoàn tất

Mỗi deliverable có đường dẫn và bằng chứng. PASS chỉ cho phần đã thực sự kiểm chứng. Không lấy plan Pro làm bằng chứng thanh toán, tài khoản synthetic làm traction, tour làm persistence, CI của PR khác làm test cho branch này. Form chưa gửi và báo cáo chưa được giảng viên nhận không được ghi là đã nộp.

## Dependency không thể tự tạo bằng chứng

- Quyết định tiếp tục kinh doanh sau môn học là quyết định của nhóm.
- Khách trả phí, phản hồi khách, hóa đơn/sao kê và analytics kênh cần nguồn thật.
- Ngày học/LMS và cách tính 60 users cần xác nhận nếu tài liệu không định nghĩa.
- Production rollout, quyền truy cập database cho giảng viên và phát hành Android cần người có trách nhiệm thực hiện theo quy trình của nhóm.

Trạng thái cuối và các kết quả chạy thật được ghi trong FINAL_DELIVERY.md; tài liệu này là kế hoạch, không phải chứng nhận hoàn thành.
