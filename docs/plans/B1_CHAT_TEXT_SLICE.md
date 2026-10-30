# B1 / CHAT-TEXT-01 — contract và luồng

2026-10-30. Chủ sản phẩm yêu cầu thực hiện lại kế hoạch theo giai đoạn, ưu tiên chức năng thật. Scope text chat dựa yêu cầu đã nêu. Các lựa chọn UX bảo thủ dưới đây là mặc định triển khai để review, không phải khẳng định owner từng duyệt mọi chi tiết. Ngôn ngữ visual vẫn theo DESIGN.md.

## Giá trị và ranh giới

PT trao đổi công việc trong hồ sơ học viên; học viên có kênh trao đổi với PT. Người dùng không phải tìm lại đoạn hội thoại trong Zalo cá nhân. Đo khả năng hoàn thành gửi/đọc/phản hồi và giữ ngữ cảnh, chưa có lời hứa tiết kiệm giờ. Giá199k tham chiếu không được tự đổi hoặc thêm paywall trong lát cắt này.

## Luồng và bố cục

PT: workspace / hồ sơ → Trao đổi → danh sách học viên đã kết nối → thread → gửi → xem lại sau reload → mở đúng hồ sơ. Học viên: workspace → Trao đổi → thread của mình. Không tạo thread hoặc cho gửi khi chưa nhận lời mời.

Desktop: sidebar hiện có + một vùng hội thoại đọc được, header chỉ người đối thoại và liên kết hồ sơ; phone: trang hội thoại riêng, nội dung vừa màn hình, khung soạn bên dưới, textarea16px, không bảng desktop thu nhỏ. Mỗi message có người gửi/ngày giờ; màu own/other hỗ trợ phân biệt nhưng không thay tên. Chưa tạo appointment/bài tập giả trong thread.

Gửi: nhập → pending → server xác minh session và quan hệ → insert dưới RLS → success sau DB xác nhận → refresh. Lỗi: giữ nội dung và retry cùng nonce. Nếu nonce đã gắn nội dung/thread khác, không thay tin cũ; người dùng chủ động bắt đầu lượt gửi mới sau khi kiểm lịch sử. Đổi thread tạo composer mới, không mang draft sang người khác. Draft hiện chỉ giữ trong bộ nhớ trang, không hứa còn sau reload/đóng tab.

Lịch sử:50 tin/page, sắp theo created_at/id; xem cũ bằng keyset hai cột, không làm tròn Postgres microseconds. Trang mới nhất refresh15s khi hiện; trang lịch sử không poll. Có refresh thủ công. Không gọi đây là push hoặc realtime delivery.

## Quyền và mô hình

| Đối tượng | Đọc/gửi |
| --- | --- |
| PT đang được gán, học viên đã liên kết | Đúng cặp trainee record + PT + learner auth ID |
| Học viên đang liên kết | Chỉ cùng cặp của mình |
| PT/học viên khác, anon | Từ chối |
| System admin thông thường | Không có override đọc chat |
| Archived/unlinked/đổi PT hoặc learner identity | Không truy cập thread cũ theo mặc định bảo thủ; không tự xóa record |

Table coaching_messages: id, trainee_id, pt_id, learner_id, sender_id, client_message_id, body, created_at. Body text1–4000, render plain text qua React, không HTML/Markdown hoặc external link preview. Foreign keys/indexes theo thread và actor. Sender lấy từ server session, PT/learner lấy từ quan hệ hiện tại. Gửi trực tiếp REST vẫn chịu RLS và grants. Không dùng service-role để gửi/đọc chat. Người dùng không được tự chọn ID/time, UPDATE hay DELETE lịch sử.

Cặp participants được lưu bất biến trên từng tin để một auth identity/PT mới không tự thừa kế hội thoại cũ. Quyền archive/relink và operational deletion/retention cần owner xác nhận trước mở rộng; không xây quyền chuyển lịch sử giữa người dùng ở slice này. Cờ server rollout không phải authorization: RLS vẫn là lớp bảo vệ dữ liệu.

Unique(sender_id,client_message_id) xử lý duplicate retry. App chỉ nhận lại success khi record cũ có cùng body, trainee, PT, learner. Không log body hoặc raw provider/DB errors.

## Phát hành và nghiệm thu

Feature flag FITSYNC_CHAT_ENABLED=false đến khi DB test và flow hai tài khoản qua. Migration additive chưa áp dụng. Types bổ sung thủ công cho draft schema, không gọi là generated-from-live-DB. Sau test phải regenerate/diff types. Không reset DB hiện dùng; nếu rollback app, tắt cờ và giữ bảng, không xóa message. Test DB dùng dữ liệu tổng hợp và transaction rollback.

Cần kiểm: PT và learner gửi/đọc/reload; đúng tác giả; người thứ ba/admin/anon không đọc/gửi; forged sender/PT/learner bị chặn; retry không trùng;50+ tin và cùng microsecond; archive/unlink/reassign đổi quyền; mất mạng/draft; routeback và mobile keyboard. 29 pgTAP cases đã viết, chưa chạy. Unit validation/server action kiểm các boundary nhưng không chứng minh SQL/RLS thực thi.

Chưa gồm media, read receipt, edit/delete, notification, voice, booking. Rate limit và retention/abuse handling cần hoàn tất trước pilot; không hứa sẵn sàng production. Tài liệu nền: [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [column grants](https://supabase.com/docs/guides/database/postgres/column-level-security), [OR filters](https://supabase.com/docs/reference/javascript/using-filters-or).
