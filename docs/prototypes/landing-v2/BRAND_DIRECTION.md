# FitSync — hướng thương hiệu và landing V2

Ngày 2026-10-30. Đề xuất thiết kế mới theo yêu cầu redesign toàn bộ của chủ sản
phẩm. Không thay PRD gốc thất lạc, DESIGN.md, giá, phạm vi sản phẩm hoặc database.

## Thiết kế cho ai và để làm gì

PT tại các phòng tập nhỏ đang tra lại Zalo, Excel và giấy trước khi chăm học viên.
Trang cần khiến PT hiểu công việc FitSync gom lại, nhìn rõ trải nghiệm dự kiến và
có thể mở bản mẫu. Chưa có vận hành trial, APK, số khách hàng hoặc ROI để quảng cáo.

Tính cách: chuyên nghiệp, rõ ràng, gần người làm nghề; có năng lượng thể thao nhưng
không dùng ngôn ngữ thi đấu/cơ bắp hoặc mỹ thuật game. Giá trị trung tâm là thời gian
và sự chú ý PT dành cho học viên. Không định vị bằng sức mạnh AI.

Ý tưởng: hồ sơ vốn nằm rải rác trong Zalo, Excel và sổ tay trở thành **bàn làm việc
được sắp xếp như một bộ dụng cụ coaching chuyên nghiệp**. Mượn tính rõ ràng của
thiết kế thiết bị thể thao: chữ chắc, ít màu, mảng lớn, chi tiết có công dụng.
Đây là concept dành cho FitSync, chưa chứng minh khác biệt độc quyền so với đối thủ.

## Nghiên cứu hiện tại

Đọc website chính thức và mở browser desktop, lưu ảnh first/second viewport:

| Nguồn | Quan sát | Học cho FitSync | Không mang sang |
| --- | --- | --- | --- |
| [Trainerize](https://www.trainerize.com/) | Hero giải thích coaching cạnh điện thoại; CTA vào sản phẩm | Giải thích đối tượng/công việc và cho xem UI ngay | Trial, claim #1, thiết bị/khách hàng của họ |
| [Everfit](https://everfit.io/) | Chữ lớn, hình thể thao rõ, các nhóm coach/engage/manage | Thứ bậc mạnh và cảm giác có thương hiệu | Màu lime, ảnh, số khách hàng, mega-menu dày |
| [Linear](https://linear.app/) | UI có nội dung thật chiếm diện tích lớn, phân cấp tinh tế | Dùng chi tiết sản phẩm làm bằng chứng, tránh hình trang trí | Palette, glow, bố cục hoặc định vị developer |
| [Cal.com](https://cal.com/) | Lịch hẹn được minh họa ngay trong hero | Cho khách thao tác một tình huống thay vì đọc danh sách | Form đăng ký/ratings của họ |

[TrueCoach](https://truecoach.co/) và [Notion](https://www.notion.com/product) được
đọc bằng web tool để bổ sung cách nhóm công việc; không coi là đã browser-review.
Ảnh tham khảo chỉ lưu evidence local, không dùng làm tài nguyên của FitSync.

## Hệ nhận diện đề xuất

- Wordmark `fitsync` chữ thường; biểu tượng hai nét đối ứng liên kết, đơn sắc.
  Tạo bằng SVG, dùng được ở favicon, app icon và bản in; không dùng hình tạ hoặc ECG.
- Nền giấy trắng/cool gray, ink gần đen, cobalt làm action và dữ liệu; một field
  dark cho đoạn đối chiếu, một field xanh cho lời mời cuối. Không gradient/glass.
- Font Be Vietnam Pro tự host, phù hợp tiếng Việt; weight 400/500/600/700, số tabular.
  Tên và giấy phép font phải kèm bản giao. Không dùng system fallback như bản trước.
- Logo, màu và typography đều là đề xuất cần phản hồi, chưa phải brand đã duyệt.

Lead: design-taste-frontend. Draw `borrowed-category`, seed 2079754808. Đã redraw
palette một lần vì Bubblegum/lime mâu thuẫn phong cách doanh nghiệp; redraw type
một lần vì cặp condensed/serif không phù hợp UI tiếng Việt. Kết quả ngẫu nhiên tiếp
theo vẫn là thời trang/đa sắc; yêu cầu chủ sản phẩm được ưu tiên: giữ nguyên nguyên
tắc mảng lớn, tương phản và nhịp thể thao nhưng chọn hệ đơn sắc cobalt và Be Vietnam Pro.
Không tự nhận đã áp dụng nguyên xi mọi gợi ý ngẫu nhiên của skill.

## Lập luận trang và copy deck trước markup

| Đoạn | Điều cần hiểu | Bằng chứng sẽ dựng |
| --- | --- | --- |
| Hero | Tập trung vào học viên | Workspace lớn, chọn hồ sơ/lịch/tiến triển |
| Hồ sơ | Một hồ sơ giữ đủ ngữ cảnh | Báo cáo, ghi chú, gói cùng một học viên |
| Duyệt phiếu | PT kiểm tra trước khi chia sẻ | Phiếu tổng hợp giả cạnh draft, dấu trường đã đối chiếu |
| Lịch/chat | Lịch đã chốt và đề nghị mới phân biệt được | Lịch chung + thẻ cuộc hẹn có thể thử đề nghị/duyệt |
| Học viên | Chỉ thấy thông tin của mình được chia sẻ | Lịch sắp tới, mục tiêu, chart và gói, không ghi chú nội bộ |
| Hỏi đáp/close | Phạm vi hiện tại trung thực và có chỗ xem thử | FAQ về OCR, Android, giá và link bản mẫu thật đang chạy local |

Hero: **Tập trung / vào học viên.**

Supporting: FitSync gom hồ sơ, lịch tập và trao đổi vào một không gian làm việc cho PT.
Action: Khám phá FitSync. Secondary: Xem cách hoạt động.

Hồ sơ: **Một hồ sơ. Đủ ngữ cảnh.** Mục tiêu, lần đo, ghi chú và số buổi được đặt
cạnh nhau để PT chuẩn bị trước buổi tập.

Phiếu: **Bạn là người xác nhận.** Ảnh/PDF tạo draft trong hướng sản phẩm đề xuất;
PT đối chiếu, sửa, xác nhận. Đây không phải tuyên bố OCR production đang hoạt động.

Lịch: **Chốt lịch. Giữ kết nối.** Một buổi hẹn theo cả hai bên. Đề nghị đổi giờ
không thay lịch cũ cho đến khi được chấp nhận. Bài tập là đính kèm tùy chọn.

Học viên: **Đồng hành sau buổi tập.** Lịch, cập nhật được chia sẻ và tiến triển qua
các lần đo; không hiển thị ghi chú nội bộ của PT.

Close: **Thử một buổi làm việc.** Mở bản mẫu tương tác; không giả form nhận lead,
không công bố trial/giá hoặc nút tải ứng dụng chưa có.

## Giới hạn triển khai

Landing V2 là một trang thiết kế hoàn chỉnh riêng để duyệt brand, không phải đổi
màu B1-A. Dùng HTML/CSS/JS static để duyệt nhanh; giữ nguyên bản B1-A và Next.js
hiện tại. Không cài thư viện, không gửi dữ liệu, không deploy. Các screen proposal
dùng fixture giả có nhãn; hero preview và sample actions không phải auth/RLS/API.
