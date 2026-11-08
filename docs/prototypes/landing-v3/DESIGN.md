# FitSync — hai hướng ngôn ngữ thiết kế

Ngày 2026-10-30. Prototype độc lập để chủ sản phẩm so sánh thẩm mỹ trước khi sửa
website chính. Không thay `DESIGN.md` root, PRD, giá, app, schema hoặc milestone.

## Vấn đề cần giải quyết

Lượt trước thay cách kể chuyện nhiều hơn thay bố cục. Yêu cầu hiện tại là so sánh
một cách trình bày sản phẩm có chủ đích: type, tỷ lệ, khoảng trắng, hình ảnh,
nhịp bố cục và tương tác. Giữ nội dung, dữ liệu giả và chức năng giống nhau để
việc chọn hướng không bị đánh lạc bởi một bộ copy hoặc tính năng khác.

## Hai hướng có thể xem trực tiếp

| | A · Studio | B · Thể thao |
| --- | --- | --- |
| URL | `http://127.0.0.1:3102/?direction=studio` | `http://127.0.0.1:3102/?direction=field` |
| Ý tưởng thị giác | Hồ sơ học viên là hình ảnh chính của sản phẩm | Công việc coaching là một tấm poster thể thao |
| Hero | Tiêu đề lớn, đoạn dẫn ngắn cạnh bên, workspace ngang phía dưới | Type đậm, ảnh đứng cạnh tiêu đề và đoạn dẫn, workspace trong dải màu toàn chiều ngang |
| Typography | Be Vietnam Pro 500, hero 90px desktop | Be Vietnam Pro 700, hero 100px desktop |
| Màu | Paper `#F5F5F1`, ink `#202629`, cobalt `#234EE8` | Bone `#F4EDDF`, ink `#351D18`, vermilion `#B52F23` |
| Hình khối | Góc 6–8px; bề mặt phẳng, UI có cấu trúc | CTA vuông; mảng màu liền, ảnh hard crop; fragment app giữ yên |
| Nhịp trang | Workspace rộng → khoảng đọc → trường xanh → trao đổi hai khối | Poster → trường đỏ → type lớn → nguồn trên nền bone → chat và học viên ghép liền |
| Điểm mạnh dự kiến | Dễ đánh giá công cụ, có thể phát triển thành hệ thống UI nhất quán | Cá tính thể thao và cảm giác con người rõ hơn |
| Đánh đổi | Còn thiên về ngôn ngữ trang phần mềm phổ biến | Cần ảnh thật có quyền dùng; màu mạnh cần tiết chế khi đưa vào app |

Đánh giá của agent: nghiêng A cho nền tảng ứng dụng quản lý; B là hướng đáng thử
nếu chủ sản phẩm muốn thương hiệu thể thao mạnh hơn. Đây là đề xuất, chưa phải
quyết định hoặc sở thích đã được người dùng xác nhận. Không nhận là “đẹp nhất”.

## Điều giữ nhất quán

- Headline, mô tả, hồ sơ Khánh Linh, số đo, lịch 16:00, gói 8/12, FAQ và CTA giống nhau.
- Một workspace thực bằng HTML, có PT/học viên chọn được; không chụp ảnh fake bars.
- Trên phone: bỏ roster phụ, sắp xếp hồ sơ trước buổi hẹn; chữ dữ liệu ít nhất 13px.
  Không scale desktop thành một tấm ảnh nhỏ hoặc bắt kéo ngang.
- Ghi chú nội bộ chỉ ở panel PT. Đây là presentation của fixture, không mô phỏng RLS thật.
- Phiếu đo cần kiểm duyệt chủ động. Dialog không thực hiện OCR/upload hoặc lưu dữ liệu.
- Không giá/trial giả, logo khách hàng, testimonial, con số tăng trưởng hoặc APK.
- Motion dùng transform phản hồi/đưa khối vào trang, không thay đổi độ tương phản
  chữ. Reduced motion tắt animation; nội dung không JS vẫn đọc được.
- Chưa chốt logo mới; dùng lại biểu tượng vector đề xuất để hạn chế biến số so sánh.

## Skill và tham khảo

Lead duy nhất: `.agents/skills/taste-skill/SKILL.md` — design-taste-frontend.
Page options draw: loud-flat-poster, type-only-statement, editorial-report.
A dùng editorial-report (seed 801552783); B dùng loud-flat-poster (seed 1212156767).
App fragment draw: achromatic ledger (seed 1615501021), đọc app-screen rules riêng.

Các điều chỉnh công khai so với sheet: giữ Be Vietnam Pro đã tự host để so sánh
nhất quán và đọc dấu tiếng Việt; map lại palette thành hai hướng brand cần duyệt.
A đưa masthead sản phẩm xuống dưới heading để đọc đủ hồ sơ, dùng lưới title/copy
thay vùng trống 42% của bản in. B dùng poster với leading 1.13 thay 0.85 để dấu
không đè nhau; không nghiêng ảnh người. Không lấy bộ ảnh kiến trúc ngẫu nhiên của
sheet vì không chứng minh công việc PT. App giữ chrome trung tính, màu cho lịch/series;
không mang mảng màu marketing phủ vào mọi panel. Không nhận đã áp dụng sheet nguyên xi.

Đã đọc nguồn chính thức và mở browser desktop ngày này:

- [Linear](https://linear.app/): quan sát hierarchy và workspace như hình ảnh sản phẩm.
  Screenshot ban đầu còn blur trong entrance; không dùng nó làm bằng chứng về chữ rõ
  hoặc trải nghiệm toàn trang.
- [Everfit](https://everfit.io/): hero thiên về type đậm, màu mạnh và nhiều ảnh thể thao.
  Lấy nguyên tắc tương phản/tỷ lệ, không lấy claim, gradient, ảnh hoặc bố cục y hệt.
- [Trainerize](https://www.trainerize.com/): hero đi cùng thiết bị/người tập, phân chia
  nội dung rõ. Cookie banner che phần dưới trong screenshot; chưa nhận đã audit toàn trang.
- [Raycast](https://www.raycast.com/): đọc lại trang qua web; browser reference thuộc
  lượt trước, không báo là browser-review mới trong lượt này.

Nguồn tham khảo không chứng minh “chuẩn thời nay”, hiệu quả chuyển đổi hoặc ý thích PT.
Tất cả UI và SVG trong prototype là code tự dựng. Không đưa asset của đối thủ vào trang.
Ảnh B dùng `coaching-editorial.webp` AI sẵn có của dự án (2026-09-27), có caption,
nhân vật giả định. A chủ động không dùng ảnh này. Không dùng video riêng.

## Cách quyết định trước khi sửa trang chính

So sánh desktop/mobile cùng nội dung: hướng nào khiến PT hiểu đây là công cụ làm
việc, tạo cảm giác tin cậy và đủ cá tính để nhớ? Sau lựa chọn, hoàn thiện hướng đó,
chốt token/component, rồi mới lập phạm vi đưa vào website chính. Chưa có bằng chứng
để coi preference của agent là conversion hoặc product-market-fit.
