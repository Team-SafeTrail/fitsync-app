# Landing V2 — đánh giá theo hình render

Lead: design-taste-frontend. Direction `borrowed-category`, seed 2079754808,
hai redraw type/palette có lý do trong [BRAND_DIRECTION.md](BRAND_DIRECTION.md).
UI fragment: `framed-sheet`, seed 2038759148, cùng font/palette, không lấy theme
của đối thủ. Borrowed category là bộ dụng cụ coaching/thiết bị thể thao chuyên nghiệp.

ROUND 1

Seen in one second: headline lớn của PT và một không gian làm việc có nội dung.
Idea (one sentence): thông tin rời rạc được đặt vào bàn làm việc coaching có tổ chức.
Live thing: đổi hồ sơ/lịch/tiến triển; đề nghị/duyệt giờ; đối chiếu phiếu mẫu.
Layout words by section: hero=wide instrument / context=paired statement /
report=dark workbench / calendar=agenda and chat / trainee=focused mobile view /
faq=reading list / close=colour field.
Scores: design 6.5 · usability 7 · creativity 6.5 · content 8 → overall 6.8.
Caps applied: không có ảnh thật theo rubric; concept cũng phù hợp sản phẩm coaching khác.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `fold-390.png`: label/phiếu quá nhỏ → control 13px, báo cáo stack dọc, nhãn UI tối thiểu 11px.
2. Lượt axe đầu: opacity ở thời điểm xuất hiện làm contrast thấp → bỏ fade, giữ transform.
3. `first-1440.png`: tọa độ calendar mang tính trang trí → chuyển agenda chọn ngày, không
   dùng chiều cao/vị trí card để ngụ ý thời lượng hoặc ngày khác.

ROUND 2 — bản giao

Seen in one second: “Tập trung vào học viên”, sản phẩm là phần lớn bức hình.
Idea (one sentence): hồ sơ coaching trở thành dụng cụ làm việc xuyên suốt trang.
Live thing: preview chuyển góc xem và cùng một giờ hẹn được cập nhật ở lịch/chat/học viên.
Layout words by section: hero=wide workspace / context=statement / report=dark paired
document / schedule=selected-day agenda and conversation / trainee=single focused screen /
faq=list / close=blue invitation.
Scores: design 6.5 · usability 8.5 · creativity 7 · content 8.5 → overall 7.35.
Caps applied: design giữ 6.5 theo rubric ảnh thật của skill; không tăng điểm để coi
UI minh họa là ảnh/footage có bằng chứng. Đây là tự đánh giá, không phải điểm của PT.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `final-inspect/mobile-page-01.jpg`: hồ sơ/phiếu chiếm nhiều chiều dài → sau khi test PT,
   quyết định crop một phần proof hoặc cho mở chi tiết; không tự bỏ nội dung chủ chốt.
2. `final-inspect/desktop-page-02.jpg`: chưa có chân dung/quy trình PT thật để tăng cảm giác
   con người → cần ảnh/footage được phép dùng trong đợt sản phẩm thật, chưa lấy video riêng.
3. `brand-1440.png`: logo mới chỉ kiểm tra hình/size/contrast → cần phản hồi chủ sản phẩm;
   chưa nghiên cứu nhận diện/nhãn hiệu hoặc nhận là logo cuối.

Các screen đều là HTML/SVG mới, là proposal có nhãn; không phải ảnh chụp một chức
năng production đã có. Không có ảnh tìm ngoài, dealt photo, clip hoặc testimonial
để ghi credit. Font có OFL/SOURCES kèm theo; logo là vector gốc do lượt này tạo.

Nội dung cần thay trước phát hành: dữ liệu giả Khánh Linh/Anh Nam/Khoa/Nam, ngày
30/10, các số đo/gói; CTA mẫu khi có vận hành pilot thực; tình trạng OCR/Android
khi có bằng chứng mới. Không được thay nhãn bằng claim đã phát hành chỉ vì trang đẹp hơn.


## Story iteration — sau yêu cầu kể chuyện

Lead vẫn design-taste-frontend. Direction `product-performs`, seed 2138948077,
0 redraw, giữ palette/type. Hướng mới chi tiết ở [DESIGN.md](DESIGN.md).
Phần trên là lịch sử lượt brand; evidence mới riêng `2026-10-30-story-redesign`.

ROUND 1 — bố cục câu chuyện

Seen in one second: dành tâm trí cho học viên, ba mảnh công việc của cùng Linh.
Idea (one sentence): thông tin của cùng một buổi hẹn từ rời rạc trở thành hồ sơ, rồi phần chia sẻ.
Live thing: chuyển ba cảnh; tự chạy một lần hoặc dừng; giờ hẹn liên tục qua trang.
Layout words by section: hero=transformable sources / prep=clock and context /
report=dark comparison / schedule=agenda and chat / trainee=shared preview /
human=editorial image / faq=reading list / close=blue invitation.
Scores: design 6.5 · usability 7.5 · creativity 7 · content 8.5 → overall 7.1.
Caps applied: thiếu ảnh thật; ý tưởng vẫn có thể dùng cho đối thủ coaching.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `first-390.png`: mảnh giấy chồng làm phone khó đọc → xếp dọc trên phone, vẫn giữ chuyển cảnh.
2. `first-320.png`: report và chat dài → native details mở theo nhu cầu, bảo toàn nguồn.
3. `inspect-1/report.json`: scanner coi chữ trong native details đóng là bị phủ →
   đặt display:none cho content khi đóng; mở lại có nội dung đầy đủ, không ignore lỗi.

ROUND 2 — bản giao

Seen in one second: thông điệp PT và tình huống trước buổi tập của Linh.
Idea (one sentence): việc chuẩn bị thông tin kết thúc ở khoảnh khắc PT chú ý vào học viên.
Live thing: ba cảnh có điều khiển và cùng một lịch hẹn cập nhật xuyên suốt.
Layout words by section: hero=source scene / prep=time marker / report=workbench /
schedule=conversation / trainee=shared context / human=full-width scene /
faq=limits / close=try a workflow.
Scores: design 6.5 · usability 8.5 · creativity 7 · content 8.5 → overall 7.4.
Caps applied: vẫn thiếu ảnh thật, concept không độc quyền; tự đánh giá, chưa có PT đánh giá.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `inspect-2/mobile-page-01.jpg`: hero có ba nguồn nên còn dài → đã ẩn link phụ,
   giữ nội dung đọc được; cần kiểm chứng người xem có hiểu sau 5 giây hay bỏ qua.
2. `inspect-2/desktop-page-02.jpg`: crop ảnh cắt phần đầu nhân vật → tăng chiều cao,
   đưa crop lên; kiểm lại `human-final-1440.png` và section ở bốn độ rộng.
3. `human-phone.png`: ảnh vẫn là AI → caption trung thực; sau này thay ảnh PT thật
   có quyền dùng. Không tự lấy video riêng hoặc mượn testimonial.

Đã nhìn sheets desktop/tablet/mobile và kiểm tra mới ở [STORY_VERIFICATION.md](STORY_VERIFICATION.md).
Không nhận là “thiết kế tốt nhất”; điểm mạnh mới là tính liên tục của câu chuyện.
