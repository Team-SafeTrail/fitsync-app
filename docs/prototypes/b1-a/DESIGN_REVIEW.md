# B1-A — phản hồi thiết kế và hướng chỉnh

Ngày 2026-10-30. Chỉ bản mẫu; chưa thay ứng dụng thật, DESIGN.md hoặc database.

## Ý định và giới hạn

Chủ sản phẩm cho phép thử màu mới, nhận xét bản đầu bình thường, nhắc landing
và hỏi học viên còn thiếu chart/thông tin. Lượt này làm rõ hướng thiết kế trên
bản mẫu để duyệt. Không suy ra đã duyệt toàn bộ brand, native app hoặc tính năng AI.

Lead duy nhất: `design-taste-frontend`. App: **Editorial greeting**, seed
2089335350; landing: **The split stage**, seed 341514791. Không redraw.
Giữ stack HTML/CSS/JS. Dùng `--keep palette,type` để áp bảng màu vừa chọn và
font offline chung cho hai bề mặt; đây không phải tuyên bố đã có brand mới được duyệt.
Geometry của split stage ưu tiên hơn hero blueprint khác hướng theo thứ tự của skill.

Những thứ riêng của bài toán: PT làm việc qua Zalo/Excel/giấy; hồ sơ học viên;
ghi chú buổi trước; lịch chung; chat gắn buổi hẹn; phiếu đo cần PT duyệt; gói có
ngày hiệu lực; số buổi PT tách check-in tự tập; học viên chỉ xem phần chia sẻ;
Android trước và web hai vai trò. Không dùng gym owner/revenue/AI score làm tâm điểm.

Ý tưởng: **hồ sơ xuyên suốt buổi tập trở thành phần giao diện đứng cạnh câu chuyện
landing**, cho người xem chuyển hồ sơ/lịch/báo cáo rồi đi vào đúng luồng mẫu.
Ý này phục vụ FitSync nhưng chưa độc quyền so với các sản phẩm coaching khác.

App dùng frame trắng trên nền xanh xám nhẹ, teal trên dữ liệu/chỉ dẫn, primary
gần đen. Dấu nhịp của logo tạm giữ; không coi đó là logo đã nghiên cứu thương hiệu.
Segoe UI được browser inspector nhận diện trên Windows; có fallback offline.
Không tải font, ảnh hoặc video bên ngoài. Helper chart MIT có license kèm theo.

## Câu hỏi của từng màn

| Màn | Câu hỏi cần trả lời trước | Điều giữ/thay đổi |
| --- | --- | --- |
| PT Today | Hôm nay gặp ai, cần nhớ gì? | Giữ lịch làm chính; thêm số đếm tính từ lịch hôm nay và ghi chú cụ thể |
| Học viên Today | Buổi nào đã chốt, hôm nay cần làm gì? | Lịch, nhắn PT, check-in tự tập; tiến triển sau phần hành động |
| Hồ sơ | Tình hình và tiến triển qua các lần đo ra sao? | Thêm chart một chỉ số mỗi lần, số liệu theo ngày, giữ gói và ghi chú chia sẻ |
| Landing | FitSync giúp PT làm việc gì, có thể xem thử ở đâu? | Frame công khai riêng, ví dụ có ngữ cảnh, CTA đi vào bản mẫu |

Thông tin học viên còn cần thiết kế/kiểm chứng tiếp: mục tiêu được thống nhất có
mốc xem lại, lịch sử hoạt động phân biệt tự tập/buổi PT, nhật ký ảnh bữa ăn và
phản hồi của PT. Mức ưu tiên và AI meal analysis chưa tự chốt ở lượt này.
Không thêm điểm sức khỏe, dự đoán hoặc streak để làm dashboard đầy hơn.

## Kiểm tra và exception

- Chụp và xem desktop/tablet/phone; chạy Taste inspector cho hồ sơ và landing.
- Hồ sơ trước: 0 FAIL/1 WARN, tiêu đề 38px. Sau: 0 FAIL/0 WARN, 28px desktop,
  24px phone. Lượt đầu dùng Carbon/amber; lượt này nền sáng/teal.
- Landing lần đầu: 2 FAIL (ít hình, ít motion tự chạy). Không thêm ảnh và chuyển
  động chỉ để đủ quota. Lần cuối dùng explicit allow `few-pictures,still-page,no-footage`:
  một preview tương tác tập trung thay bốn hình lặp; motion phục vụ thao tác;
  chưa có footage phù hợp được duyệt. Đây là ngoại lệ có chủ ý của bản mẫu,
  không phải đạt toàn bộ tiêu chuẩn của skill.
- Giữ WARN `size-count`: inspector đếm cả typography của giao diện sản phẩm bên
  trong landing; thu gọn thành năm size sẽ làm mất phân cấp dữ liệu. Chữ nhỏ trên
  landing đã sửa về ít nhất 13px ở các đoạn được đọc.
  Inspector vẫn ghi 1 WARN `small-text` ở 390px; chưa coi landing đạt toàn bộ
  typographic gate, dù tập axe không báo violation. Các control của thanh review
  ngoài sản phẩm còn dùng size nhỏ; cần gỡ thanh này khi chuyển sang website thật.
- Source lint cho index/app/refresh CSS: 0 FAIL, 1 WARN `numbering`, là ngày 01
  trong lịch tuần chứ không phải số thứ tự trang trí. Không chạy lint này thay ESLint.
- Các kiểm tra hành vi, axe và giới hạn ở [VERIFICATION.md](VERIFICATION.md).

## Critique theo ảnh

ROUND 1 — bản đầu

Seen in one second: hồ sơ tối với các nhóm thông tin có cùng trọng lượng.
Idea (one sentence): mở hồ sơ để chuẩn bị buổi tập; chưa thấy rõ tiến triển.
Live thing: đi vào buổi hẹn/chat; landing chủ yếu là khung nội dung.
Layout words by section: profile=stack + rail / landing=split + list.
Scores: design 6 · usability 7.5 · creativity 5.5 · content 7 → overall 6.45.
Caps applied: ý tưởng còn thuộc nhóm sản phẩm coaching nói chung.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `before/desktop-fold.jpg`: h1 38px và khối cùng trọng lượng → h1 28px, frame/tonal hierarchy.
2. `before/mobile-fold.jpg`: chỉ có một lần đo → tiến triển theo ngày, bảng số liệu đi cùng.
3. Bản landing đầu nằm trong shell ứng dụng → frame public riêng, preview đổi trạng thái.

ROUND 2 — sau chỉnh

Seen in one second: hồ sơ học viên và đường tiến triển; landing là buổi làm việc của PT.
Idea (one sentence): hồ sơ giữ ngữ cảnh giữa buổi hẹn, báo cáo và trao đổi.
Live thing: đổi preview trên landing, mở đúng luồng; đổi chỉ số và đọc bảng lần đo.
Layout words by section: hero=split stage / story=reading column / close=full-width field.
Scores: design 6.5 · usability 8 · creativity 6 · content 8 → overall 7.0.
Caps applied: ít ảnh thật theo rubric của skill; ý tưởng vẫn có thể áp cho đối thủ.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. `final-landing/desktop-page-01.jpg`: một preview cho cả câu chuyện, richness còn hạn chế →
   sau khi chốt phạm vi, dùng màn hình/footage đã kiểm chứng của sản phẩm thật.
2. `final-profile/mobile-fold.jpg`: toolbar review chiếm chiều cao → loại khỏi UI triển khai;
   không đánh đồng toolbar này với navigation sản phẩm.
3. `final-landing/mobile-page-01.jpg`: câu chuyện vẫn dài trước CTA cuối → cần test PT đọc
   lần đầu để quyết định cắt đoạn nào, chưa tự gắn conversion claim.

Đây là đánh giá chủ quan phục vụ chọn hướng, không phải điểm người dùng hay bằng
chứng giao diện đã đạt mức thương mại. Không có ảnh/clip bên ngoài để ghi credit.
Toàn bộ tên, ngày, số đo và gói tập là fixture giả cần thay khi triển khai có dữ liệu hợp lệ.
