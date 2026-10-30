---
version: 4.0.0
name: FitSync Coaching Interface
approved: 2026-10-30
---

# FitSync design language

Chủ sản phẩm duyệt `docs/prototypes/coaching-specimen/` ngày 2026-10-30 và yêu cầu
áp dụng vào các page chính. Tài liệu này là chuẩn thiết kế hiện tại, thay Carbon v3.1
được giữ ở `docs/archive/landing/DESIGN-carbon-v3.1.md`.
Phê duyệt này áp dụng ngôn ngữ thiết kế; không tự phê duyệt giá, persona 5–20,
B2B SaaS, database mới, app store hoặc milestone trong các tài liệu cũ.

## Tính cách và cấu trúc

Gần con người, bình tĩnh và chỉn chu. Cùng một dấu kết nối hiện ở brand, cuộc hẹn,
timeline và sheet. Landing dùng bối cảnh gym có người; app dùng một mặt phẳng hồ sơ
có thứ bậc, không phủ ảnh hoặc hero marketing vào dashboard. Dòng thời gian cho
lịch sử, hàng dữ liệu cho số đo, hội thoại cho trao đổi, sheet cho đối chiếu.
Không biến mọi nội dung thành các thẻ giống nhau hoặc làm mới chỉ bằng đổi màu.

## Tokens dùng chung

| Token | Giá trị | Vai trò |
| --- | --- | --- |
| canvas | `#F5F8F6` | Nền đọc / mặt phẳng làm việc |
| surface | `#FFFFFF` | Hồ sơ và sheet |
| surface muted | `#EAF0EB` | Khung app / navigation |
| surface elevated | `#EAF3ED` | Trạng thái hoặc vùng cần nhìn |
| text primary / forest | `#143E38` | Nội dung chính / nút trong app |
| deep | `#102E2A` | Nền ảnh và mảng tương phản marketing |
| text secondary | `#465E53` | Mô tả, metadata có contrast |
| text muted | `#52675C` | Thông tin phụ, không cho nhỏ/nhạt tới mức khó đọc |
| brand / jade | `#226C5D` | Điều khiển, dữ liệu, đường biểu đồ |
| sun | `#FFD29C` | CTA trên forest; không dùng chữ trắng trên sun |
| border | `#D4DFD7` | Biên bảng, ô nhập, phân vùng có nghĩa |
| success | `#1D6951` | Xác nhận, có nhãn chữ |
| warning | `#85520F` | Cần xem lại; nền `#FFF2DB` |
| destructive | `#AC3434` | Lỗi; nền `#FCEDED` |

Tokens CSS ở `apps/web/src/app/globals.css`; Tailwind trỏ vào CSS variables.
Không khai báo một bảng màu khác trong auth/admin/workspace. Foreground của brand
là trắng; nút trên hero dùng sun/deep. Bề mặt app trung tính, màu dành cho trạng thái.

## Chữ, nhịp và hình khối

Be Vietnam Pro 400/500/600/700 tự host qua next/font/local; giữ OFL và nguồn file.
Display 500, line-height ≥1.16, tracking -0.045em. H1 marketing clamp 40–82px;
h1 công việc 28–40px; body 15–18px; metadata đọc được 13px. Dữ liệu dùng tabular-nums,
không monospace cho toàn bộ app. Đơn vị và ngày/nguồn đi cùng con số.

Khung app 16–24px; sheet 20–24px; nút 44px trở lên, pill cho CTA; sheet là một lớp
riêng, bóng đổ dành cho overlay. Avatar có góc mềm để định danh người. Không thêm
glow, grain toàn trang hoặc shadow/scale cho tất cả cards. Khoảng cách theo 4/8px.

## Các surface chính

- `/`: hero ảnh approved, giải thích PT/trainee, hồ sơ minh họa và đối chiếu mẫu,
  CTA thật `/register`, link mẫu `/app/dashboard`, giới hạn khả năng rõ ràng.
- `/login`, `/register`, `/invite/*`: cùng brand và ảnh bối cảnh; form đọc tốt, lỗi
  cạnh dữ liệu. Giữ nguyên server actions, validation, redirect và token handling.
- `/workspace` và hồ sơ: roster/hồ sơ/check-in/OCR thực, một nguồn dữ liệu; nội dung
  do server kiểm quyền. Không đổi auth/RLS hoặc gate bắt buộc xác nhận OCR.
- `/app/dashboard`, `/app/trainee`: mẫu công khai có nhãn, đồng bộ app shell và type;
  không biến số mẫu thành khách hàng, doanh thu, thời gian tiết kiệm đã chứng minh.
- `/privacy`, `/terms`: nền đọc, heading/nhịp chữ chung, nội dung pháp lý được giữ.
- `/admin`: quản trị hệ thống hiện có, không phải dashboard chủ gym mới. Giữ guard admin.

## Mobile, motion và trạng thái

Không scale screenshot desktop. Phone giữ công việc chính, nhãn input đủ rõ,
đồ thị có trục/đơn vị và text đọc được. Bảng nhiều cột có vùng cuộn riêng có nhãn.
Tab/focus rõ; native dialog/sheet chứa focus, Escape đóng và trả về opener.
Một entrance nhẹ cho appointment, các motion còn lại phục vụ thao tác. Không ẩn
nội dung chờ reveal. Reduced motion tắt animation/transition và smooth scroll.

Trống, loading, lỗi, disabled, pending và đã xác nhận phải phân biệt bằng chữ.
Tính năng chưa kết nối thật trong sample phải ghi mô phỏng; không tạo PDF upload,
chat/đặt lịch thật hoặc health outcome bằng cách thay copy.

## Tài nguyên và tính trung thực

Hero `public/images/coaching-afternoon.webp` chuyển định dạng từ PNG AI đã duyệt,
không sửa nội dung hình. Caption/alt ghi minh họa AI, nhân vật giả định. Không dùng
ảnh/video riêng hoặc asset Gentler. Nguồn/prompt: `docs/prototypes/coaching-specimen/IMAGE_PROMPT.md`.
Không claim thời gian tiết kiệm, giá/trial, 24/7, APK hoặc khách hàng chưa có bằng chứng.
Tách câu chuyện khách hàng khỏi yêu cầu EXE201 và demo. Không tự public khảo sát/danh tính.

## Quy trình sửa về sau

Đọc tài liệu này, AGENTS.md và product alignment trước khi sửa UI. Lead frontend-design;
React/Next.js dùng guideline đúng version, giữ page/server boundary gọn. Xem render
ở desktop/tablet/phone, kiểm keyboard/contrast/overflow/reduced motion và các luồng
đã sửa. Build, typecheck, lint và test được báo theo kết quả thực chạy. Passing tests
không thay cho duyệt thẩm mỹ hoặc kiểm chứng giá trị với PT.

## Nội dung landing cần giữ

Giữ luồng tiếp nhận, hồ sơ hai vai trò, demo sửa/duyệt, khảo sát kèm giới hạn, trạng thái tính năng và đội ngũ khi đổi layout. Dùng timeline/hàng dữ liệu với tokens đã duyệt. Không đưa lại giá, ROI, APK chưa có căn cứ. Kế hoạch chức năng: docs/plans/COACHING_PRODUCT_FOLLOWUP.md.

## Increment core đầu tiên — 2026-10-30

Tiếp nhận trên landing dùng ba vật thể minh họa (hồ sơ, phiếu đối chiếu, cập nhật), chữ ngắn; khả năng chi tiết qua disclosure. Giữ nhãn dữ liệu giả và nguồn khảo sát. Workspace dùng search/filter theo công việc, tiến trình chỉ lấy records được server hiện có cấp quyền. Không thay authenticated data bằng fixture. Chart không bịa xu hướng khi chưa có hai lần đo, có trục zero-based, ngày/đơn vị và bảng giá trị đọc bằng keyboard. Không dùng chart để kết luận sức khỏe hoặc gán giảm cân luôn là tốt.
