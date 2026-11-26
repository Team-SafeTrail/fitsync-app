# FitSync — kế hoạch thực thi hiện hành

Cập nhật22/11/2026 để nộp bổ sung; hạn trước19/11 đã qua. Mục tiêu là sản phẩm web+database/demo cùng bộ EXE201, không dừng ở W8/W9. Branch `agent/fitsync-final-product`, PR48; base main 3 c 816 e 9. Yêu cầu tổng thể này đã scoped/authorized, quy trình nhận task chỉ bằng tên thành viên không áp dụng. Không tự merge/deploy production.

| Ưu tiên | Việc | Trạng thái và acceptance |
|---|---|---|
|P0|Đọc tài liệu W1–9/Final, audit Trello/Git/cloud|Đã làm; source register/gap106 cards, không mặc địnhDONE|
|P1|Auth/roster/Free 3/Pro/finance/admin/events|Đã implement/test checkpoint; current receipt ở TEST_EVIDENCE|
|P1|Đổi/hủy lịch và audited session ledger|SQL 363 fresh/upgrade qua; browser workflow có acceptance|
|P1|Sửa lỗi React 19 form/navigation|0ba9821PASS: native reset/hash navigation vàacknowledged save;28core+4demo CI khôngretry|
|P1|Local demo isolated/seed/idempotence|Seed2lần;CI4demo PASS;Docker/WSL2đã cài,Windowsbuild/start+4demo PASS22/11|
|P0|W8/W9/final/financial/product analysis|Đã đồng bộ current facts,0paid/scenario riêng;form có copy interface|
|P0|Video/screenshots/database owner review|Lấy từ run pass, không failed proof; owner duyệt trước lecturer sharing|
|P2|Canva 10 slides/script/PDF|Canva mớiDAHbpf2PM5U,10trang,text/preview/PDF/script đã QA|
|P0|Git/Trello/PR/package/receipt|Push branch riêng, evidence-linked comment, không tựDONE/merge|

Inspect → Plan → Implement → Test → Debug → Retest → Document → Review. Không giảm assertion/phân quyền để CI xanh; không chạy seed có ghi lên cloud. Cài dependency theo lock, không tải/chạy script lạ. PASS gắn revision/environment/receipt. Mọi sản phẩm mới phải phân biệt actual, owner-confirmed, reported và synthetic.

Dependencies chưa tự tạo được: giao dịch/khách thật (owner xác nhận 0), cost/channel/review gốc, lecturer Gmail sau owner duyệt DB, bank receiver/kỳ dịch vụ, mentoring attendance/contribution và LMS receipt. Nếu chưa có, giữ khoảng thiếu và làm các việc độc lập. Nhóm dừng sau học phần, không hứa vận hành thương mại sau môn.
