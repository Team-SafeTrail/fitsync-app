# Review hình render — hai hướng bố cục

Lead design-taste-frontend. Evidence `.agents/audit/ui/2026-10-30-visual-directions/`
ignored, không phải ảnh sản phẩm production. Điểm là tự đánh giá theo rubric skill,
không phải người dùng PT chấm hoặc kết luận tốt nhất.

ROUND 1
Seen in one second: A là workspace mở rộng; B là poster coaching.
Idea (one sentence): hồ sơ là tâm điểm A, hoạt động coaching là tâm điểm B.
Live thing: chuyển góc nhìn PT/học viên ở cùng dữ liệu, đối chiếu phiếu bằng dialog.
Layout words by section: hero=editorial title / workspace=wide master-detail /
report=colour field / connection=two fragments / faq=reading / close=type field.
Scores: design 6.5 · usability 7 · creativity 7 · content 8 → overall 6.9.
Caps applied: không có ảnh thật, ngôn ngữ vẫn dùng được cho sản phẩm coaching khác.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `field-1440-fold.png`: B ba dòng headline gây chữ việc đứng riêng → giảm display
   114 xuống 100px để hai dòng. Không ép giảm leading khiến dấu tiếng Việt va nhau.
2. `inspect-studio/mobile-page-01.jpg`: chú thích nhỏ → nâng chữ dưới 13px lên 13px,
   vẫn giữ cỡ dữ liệu chính lớn hơn, xem lại 320/390.
3. Lượt axe/dialog đầu: background transition khi bật nút làm contrast xuống 3.35:1;
   Tab có thể tới body → bỏ transition màu, chặn vòng Tab/Shift-Tab trong dialog.

ROUND 2
Seen in one second: A cho thấy một công cụ làm việc; B cho thấy một thương hiệu thể thao.
Idea (one sentence): cùng dữ liệu coaching được trình bày bằng hai hệ thống thị giác khác nhau.
Live thing: góc nhìn chia sẻ thực sự đổi, checkbox review bắt buộc trước xác nhận mẫu.
Layout words by section: A=title plus wide workspace / B=portrait poster plus full-bleed workspace /
report=source specimen / connection=chat and learner / faq=large reading / close=brand field.
Scores: design 6.5 · usability 8.5 · creativity 7 · content 8.5 → overall 7.4.
Caps applied: ảnh B vẫn AI, A không ảnh người; concept chưa độc quyền. Không tự tăng
điểm chỉ vì scanner hết FAIL hoặc đã dùng skill.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `final-studio/desktop-page-01.jpg`: A vẫn dùng type/workspace phổ biến trong SaaS →
   lựa chọn có chủ đích để công cụ dễ hiểu; cần phản hồi PT, chưa coi là bản sắc cuối.
2. `final-field/mobile-page-01.jpg`: cột copy B hẹp và CTA có thể hai dòng → vẫn đọc
   được ở 320px; nếu chọn B, nên tinh chỉnh riêng hero phone với ảnh thực được phép dùng.
3. `final-field/desktop-page-01.jpg`: khoảng giữa Cùng một và nhịp tập mất khi ẩn br →
   thêm whitespace trước br; kiểm riêng sau suite, không đổi nội dung hoặc chức năng.

Đã nhìn sheets desktop/mobile cả hai hướng và các fold desktop/phone lượt đầu.
Sau sửa khoảng trắng đã chụp lại desktop/tablet/phone, xem fold + tablet và đoạn heading B.
Các cảnh tương tác được kiểm browser, không suy ra quyền dữ liệu thật từ việc panel ẩn.
