# FitSync — quyết định sản phẩm hiện hành

2026-10-30. Nguồn: chủ sản phẩm trao đổi trong chat. Không phải PRD gốc thất lạc.

## Điều phải bám

- PT quản lý/đồng hành học viên và giảm nhập/tìm dữ liệu rời rạc giữa Excel, giấy, Zalo cá nhân. Không biến FitSync thành máy quét hoặc calorie tracker đơn lẻ.
- Hai vai trò PT và học viên dùng được trên web và điện thoại; Android trước. Chủ gym nhiều PT để sau.
- Hồ sơ có ngữ cảnh, chat trực tiếp, lịch dùng chung; bài tập trong buổi là tùy chọn. Quản lý membership theo ngày khác số buổi PT; đặt lịch/tự check-in không tự trừ buổi PT.
- Intake bằng ảnh/PDF và đối chiếu số liệu đầy đủ từ phiếu; PT sửa/duyệt. Không bịa nhóm cơ yếu từ dữ liệu máy không đo. Food AI có detect đồ ăn/ước tính/disclaimer và quyền sửa; voice/workout là phần cần phát triển có điều kiện riêng.
- Chủ sản phẩm đã có khảo sát sơ bộ199.000đ/tháng. Cần làm rõ ai trả, scope, hạn mức, chi phí, willingness-to-pay thực tế; không nói mô hình chưa từng được chốt. Không thay bằng299k hoặc định vị B2B đã duyệt mà không có quyết định mới.
- Ngôn ngữ thiết kế approved ở DESIGN.md. Phải remake cả cấu trúc/layout/function từng luồng, không chỉ theme. Landing mô tả cùng sản phẩm mà hai vai trò thực sự dùng được.

## Phân biệt các bản

- /workspace: ứng dụng có tài khoản, server identity/RLS và dữ liệu lưu trữ. Có nền hồ sơ/lời mời/record/check-in/số buổi; chưa hoàn thành hướng mới.
- /app/*: tour công khai dùng fixtures. Là lối đánh giá phụ, không phải sản phẩm thật hoặc bằng chứng persistence.
- /: giới thiệu. Thành phần mô phỏng phải ghi ngay tại chỗ; không coi nội dung định hướng là capability đã ship.
- Git feature branch/local production preview khác website đã deploy. Chưa xác định URL deployed hiện hành; không tự gọi localhost là bản thương mại chính thức.

## Trạng thái sau phản hồi owner

Đã dành nhiều công cho visual/tour, chưa đủ tiến triển chức năng thật. Chủ sản phẩm yêu cầu chuyển trọng tâm sang implementation dùng được, không tiếp tục thêm demo để thay backend.

Chặn kiểm thử thực hiện tại: apps/web chỉ có .env.example, không có env Supabase trong process, không tìm thấy Docker/Supabase CLI tại môi trường local. Đã hỏi owner về website deployed hoặc Supabase test. Không xin key trong chat; không dùng sức khỏe thật hoặc bypass login. Dùng synthetic environment để chạy credential/invite/isolation/persistence checks trước khi báo hoạt động.

## Phạm vi199k cần chốt thành offer

Đề xuất để thảo luận, chưa phải tất cả đã duyệt: PT trả thuê bao tháng, học viên dùng kèm; core hồ sơ/chat/lịch/tiến trình/gói buổi không tính tiền từng tin nhắn/check-in. Active roster cap và AI allowances cần tính theo chi phí, không tự hứa unlimited. Chưa công bố Free plan mới/trial/payment. Doanh thu thuê bao FitSync khác gói PT/membership PT bán cho học viên.

## Implementation tiếp

Có môi trường test → chạy lại nền tài khoản/hồ sơ hiện có → làm một vertical slice chat có lưu và quyền hai bên → shared calendar/đổi lịch → membership/ledger → OCR schema/provider đầy đủ. Lần lượt kiểm desktop/phone, persistence, retry và người ngoài bị chặn. Landing cập nhật theo trạng thái đã chứng minh. Không thay tests/domain thật bằng screenshot hay fixture. Các chi tiết UX còn mở vẫn được ghi rõ như đề xuất.
