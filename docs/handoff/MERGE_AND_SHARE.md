# Gộp nhánh và gửi bàn giao qua Discord

Repo sau merge là nguồn bàn giao chính. ZIP là bản lưu ngoại tuyến của một checkpoint; không cần gửi nếu Huy/Khai truy cập được GitHub. Không dùng ZIP cũ để phát triển song song với main.

## Trước khi chủ sản phẩm merge PR31

1. Mở [PR31](https://github.com/Team-SafeTrail/fitsync-app/pull/31); kiểm base/head, diff và CI của commit mới nhất. Các con số ở UI_ACCEPTANCE thuộc checkpoint ứng dụng được ghi rõ, không tự coi CI của mọi commit sau đó đã qua.
2. Huy review schema/RLS/upgrade/ops; Khai review layout/interactions và ảnh synthetic. Theo dõi việc nhận baseline ở issue REVIEW-BASELINE trong [tracker](ISSUE_TRACKER.md). Review không đồng nghĩa chấp thuận phát hành thương mại.
3. Kiểm cấu hình Vercel/GitHub trước merge: nhánh main có thể kích hoạt auto-deploy. Agent chưa xác minh cấu hình deployment hiện hành. Không coi merge chỉ đổi Git mà chắc chắn không ảnh hưởng website.
4. Kiểm môi trường triển khai, migrations và ba rollout flags. Không bật flags hoặc chạy migration cloud chỉ vì merge code. Nếu rollout chưa sẵn sàng, giữ flags false và thống nhất cách xử lý deployment với Huy.
5. Chủ sản phẩm/human reviewer quyết định ready-for-review và merge sau các gate phù hợp. Agent không tự approve/merge PR này. Ghi merge SHA vào issue nhận baseline.

Những issue visual/product cũ như #16/#18/#20/#22/#24 và OC2 #27 vẫn có lịch sử riêng. Reviewer đối chiếu từng acceptance trước khi đóng hoặc đánh superseded; không đóng hàng loạt chỉ vì PR31 merge. #2 vẫn là benchmark OCR, #5 là asset/coursework review, không bị thay thế bằng screenshots v1.

## Sau merge

Huy/Khai bảo toàn thay đổi cá nhân, cập nhật main rồi tạo nhánh theo issue được nhận. Nếu chưa merge, review code ngay trên PR31 nhưng không giả tài liệu đã có trên main. Mỗi PR sau đó link một issue, nêu dependency, migration/API version và kết quả kiểm thật. Các issue target đang chờ dependency không phải hàng đợi triển khai ngay.

Khi gửi Discord, link repo/PR, handoff index và issues của từng người. Không đưa credentials, link invitation hoặc ảnh thật vào tin nhắn. Discord để điều phối; acceptance criteria nằm ở GitHub/repo. Trello coursework giữ luồng hiện hành; lượt này chưa cập nhật card hoặc gửi thông báo thay bạn.

## Tin nhắn gợi ý sau khi bạn đã merge

Thay merge SHA và link handoff bằng permalink của commit đã merge, rồi tự gửi:

```text
Huy / Khai ơi, mình đã gộp bản web FitSync và bộ bàn giao v1.
PR: https://github.com/Team-SafeTrail/fitsync-app/pull/31
Merge commit: điền SHA sau khi merge
Đọc docs/handoff/README.md trước, rồi ISSUE_TRACKER.md.
Huy: nhận backend/DB/RLS/ops theo các issue đã assign.
Khai: nhận review web/UX và Android theo các issue đã assign.
Android chưa được implement trong bản này.
Database là baseline v1; full InBody/PDF, lịch đổi/hủy và ledger còn việc riêng.
Các issue có dependency đang bị chặn: chưa bắt đầu khi gate chưa qua.
Review baseline trước; mỗi phần làm trên nhánh/PR riêng.
Không lấy ZIP cũ làm nguồn code, không reset DB/cloud hoặc dùng dữ liệu thật.
```

Nếu chưa merge, đổi câu mở thành “mình đã push bản bàn giao, nhờ review PR31” và dùng link nhánh PR. Không nói website đã deploy hoặc đã chạy trên Android nếu chưa kiểm chứng trực tiếp.
