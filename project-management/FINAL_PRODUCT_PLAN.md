# Hoàn thiện sản phẩm cuối — trước 19/11/2026

## Quyết định đã được chủ dự án xác nhận

- Web đầy đủ được giảng viên chấp nhận; APK không phải điều kiện nộp hiện tại.
- Chưa có giao dịch thật (17/11); không dựng chứng từ hoặc coi Pro là đã trả tiền.
- Giá được chốt 199.000đ/PT/tháng, đối soát chuyển khoản thủ công. Tài khoản nhận tiền đang chờ chủ dự án cung cấp.
- Free tối đa 3 hồ sơ chưa lưu trữ, gồm hồ sơ chờ kết nối. Pro còn hạn không giới hạn học viên, cùng chức năng coaching. Hồ sơ cũ không bị xóa khi hết hạn; tạo/khôi phục theo hạn mức Free. Chủ dự án xác nhận Free3/Pro không giới hạn trong phiên này.
- Dừng kinh doanh sau học phần. Ưu tiên sản phẩm dùng được, bài nộp và bàn giao.
- Chủ dự án xem database trước khi cung cấp email giảng viên. Chưa chia sẻ database ra ngoài.

## Các phần đang thực thi

| Thứ tự | Phạm vi | Điều kiện nghiệm thu |
| --- | --- | --- |
| P0 | Đối chiếu database thật và mã nguồn | Snapshot tổng hợp, bảng thiếu được chỉ rõ, chủ dự án có bản xem |
| P0 | Auth và vòng đời học viên; tích hợp PR47 trên branch riêng | Reset mật khẩu, cấp lại/thu hồi lời mời, sửa/lưu trữ/khôi phục hồ sơ; kiểm thử quyền và giao diện |
| P0 | Quản trị thật, sổ thu–chi và yêu cầu nâng cấp | Không lẫn fixture; giao dịch có nguồn chứng từ, xác nhận/đảo giao dịch có nhật ký; quyền admin ở DB |
| P0 | Kiểm thử DB fresh/upgrade và các luồng PT–học viên | CI chạy database tạm, không tác động cloud hiện tại |
| P0 | Hoàn thiện lịch, buổi tập và dinh dưỡng theo contract hiện có | Chức năng thực, dữ liệu lưu DB, kiểm thử quyền/retry/transaction |
| P0 | Release cloud và web | Migration/backup/checks cụ thể được review; không tự merge hoặc thay production trước approval |
| P0 | Bộ nộp cuối khớp sản phẩm | Video mới, ảnh thật, link web, database viewer, báo cáo và slide cập nhật theo kiểm thử mới |
| P1 | Full-report/OCR và vận hành | Nhập tay hoạt động; capability và phần phụ thuộc provider/consent được nêu đúng; không gọi fake adapter là OCR thật |

Không coi 20 khách trả phí là đạt khi chưa có khách thật. Chỉ xác minh lại mức đáp ứng học phần và chuẩn bị thông tin để chủ dự án trao đổi giảng viên nếu chỉ tiêu chưa đạt.
