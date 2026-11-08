# FitSync — nghiên cứu ngôn ngữ thiết kế sau phản hồi A/B

Ngày 2026-10-30. Chủ sản phẩm phản hồi cả hai hướng A/B vẫn chung chung và việc đổi
màu chưa đáp ứng yêu cầu. Hai bản là thử nghiệm chưa được duyệt; không tiếp tục
đưa vào website chính hoặc coi A là lựa chọn mặc định đã được chấp nhận.

Lead lượt nghiên cứu: `frontend-design`, đọc `.agents/skills/frontend-design/SKILL.md`.
Thay lead cũ cho công việc này, không kích hoạt nhiều brief thẩm mỹ đồng thời.

## Phát hiện ở bản hiện tại

Quan sát từ ảnh render V3 của lượt trước: A/B cùng dùng Be Vietnam Pro, headline
hai dòng, cùng workspace, nhiều block chữ nhật và nhiều đoạn chia đôi. B thêm ảnh
người và đổi tỷ trọng màu nhưng chưa có hệ đồ họa hoặc hình thức tương tác riêng.
Không nhận các tests cũ là vừa chạy lại. Việc đó giải thích vì sao hai bản vẫn đọc
như các biến thể template. Đây là chẩn đoán của agent, phù hợp phản hồi chủ sản phẩm.

Một design language cần quy tắc lặp được cho **bố cục, chữ, bề mặt, hình ảnh,
đồ họa dữ liệu, tương tác và motion** trên landing lẫn app. Bảng màu chỉ là một phần.
Bố cục mới phải đứng được khi bỏ màu, bỏ logo và dừng animation.

## Tham chiếu đã trực tiếp mở trong browser lượt này

Ảnh hero và một đoạn ở scroll y=1350, viewport 1440×1000. Không đăng nhập,
không submit form hoặc lấy asset đưa vào sản phẩm. Nội dung bên dưới phân biệt
quan sát với cách áp dụng do agent đề xuất.

| Nguồn | Quan sát từ hình | Nguyên tắc học được | Đề xuất áp dụng cho FitSync |
| --- | --- | --- | --- |
| [Craft](https://www.craft.do/) | Giấy xé/collage, bầu trời có texture, headline serif, wordmark riêng; phần chân dung vẫn dùng chất liệu giấy | Vật liệu và typography tạo bản sắc xuyên suốt, không chỉ hero | Chọn chất liệu từ công việc PT rồi xây hệ minh họa nhất quán; không lấy giấy xé/collage của Craft làm theme |
| [Attio](https://attio.com/) | Nền sáng, đường chia nhạt, UI tập trung dữ liệu; hệ lưới tiếp tục xuống phần nội dung; cookie panel che góc trái | Độ dày đường, khoảng cách và mật độ dữ liệu tạo độ tin cậy | Tổ chức roster/hồ sơ/chi tiết theo trật tự rõ, dùng ít sắc độ; không sao chép hero hoặc các agent AI |
| [Notion Calendar](https://www.notion.com/product/calendar) | Icon lịch ở tâm, hệ hình vẽ nét quanh hero, UI desktop/phone cùng xuất hiện; phần dưới crop một thao tác | Minh họa, sản phẩm và cách crop đều xoay quanh cùng một vật thể | Cùng một dấu hiệu buổi hẹn đi qua lịch và chat; cần vẽ bộ đồ họa FitSync riêng |
| [Gentler Streak](https://gentlerstories.com/gentlerstreak) | Cảnh vận động phủ hero, điện thoại/nhân vật minh họa/đồ thị cùng mang cá tính; phần sau có các phát biểu lớn | Có cảm xúc con người và đồ họa dữ liệu dễ nhận diện | Học phần gần gũi của trải nghiệm học viên; không đưa mascot, health score, giải thưởng hoặc claim sức khỏe của họ vào |
| [Hevy Coach](https://hevycoach.com/) | Hero chia đôi, screenshot dashboard; phần dưới crop thao tác bài tập và hoạt động theo người | Cho thấy việc cụ thể PT làm rõ hơn ảnh dashboard tổng quát | Tham khảo cách chọn chi tiết sản phẩm; không chọn làm art direction chính vì cấu trúc vẫn khá quen thuộc |

[Practice](https://practice.do/) không lấy được qua web (404); không dùng làm chứng cứ.
`www.gentler.app` chuyển hướng sang Gentler Stories trong lượt hiện tại.
Các ảnh là snapshot, không chứng minh conversion hay tính cập nhật của mọi trang con.

## Hướng đề xuất để đánh giá tiếp: lấy hồ sơ học viên làm trục thị giác

Đây là đề xuất chưa duyệt, không tự nhận là ý tưởng gốc hoặc đã độc quyền.
Mục tiêu là tạo cảm giác **công cụ coaching chỉn chu, gần con người, có ngữ cảnh**.
Không trộn nguyên theme của các website trên vào một trang.

| Thành phần | Quy tắc cần thử | Tiêu chí khác bản A/B |
| --- | --- | --- |
| Composition | Một hồ sơ mở làm tâm điểm, vùng nội dung được crop có chủ đích; heading và caption đi theo trục hồ sơ | Không đặt toàn bộ dashboard trong hero rồi lặp nhiều section chia đôi |
| Cấu trúc | Dòng thời gian cho lịch sử; hàng dữ liệu cho số đo; hội thoại cho trao đổi; sheet cho đối chiếu | Các loại nội dung có hình thức riêng, không tất cả thành card bo cùng kiểu |
| Typography | Sans có dấu tiếng Việt rõ; vai trò display/body/data khác nhờ tỷ lệ và nhịp, bớt tracking âm quá mức | Chọn cách đặt chữ bằng specimen nội dung thật; không chỉ tăng font-size/weight |
| Bề mặt | Một nền làm việc, một sheet dữ liệu, lớp phủ chỉ xuất hiện khi mở chi tiết | Phân cấp có nghĩa, không thêm shadow/blur cho mọi khối |
| Đồ họa riêng | Thiết kế dấu buổi hẹn dùng lại trong lịch/chat; report có cùng ngôn ngữ source/draft/confirmed | Nhìn một chi tiết vẫn nhận ra sản phẩm, không cần dựa vào màu nền cả section |
| Dữ liệu | Ngày đo, nguồn, đơn vị, độ chắc chắn cùng hệ căn lề; biểu đồ có thang đo và ý nghĩa | Số liệu trở thành nội dung được thiết kế, không làm KPI trang trí |
| Chuyển động | Mở hồ sơ, tách sheet, giữ vị trí khi đi từ lịch sang chat; dừng được và reduced motion | Một vật thể liên tục giữa các trạng thái, bỏ việc tất cả block đều slide-up |
| Hình ảnh | Ưu tiên chi tiết công việc và người thật được phép dùng; AI phải ghi nhãn | Không dùng một ảnh gym AI như bằng chứng thương hiệu hoàn chỉnh |
| Mobile | Giữ đối tượng hồ sơ và thao tác chính, thay bố cục theo công việc | Không chỉ ẩn sidebar rồi stack tất cả xuống dưới |

Chưa khóa một palette mới ở đây: cần xem form/structure trước, sau đó thử màu lên
cùng specimen. Không xem mọi giải pháp khác là sai; chọn theo cảm nhận FitSync cần có.

## Phác bố cục để tránh quay lại template

```text
Desktop — sketch hình thức, không phải trang hoàn chỉnh
┌ logo nhỏ ───────── điều hướng ───── mở mẫu ┐
│ lời dẫn ngắn    ┌ hồ sơ học viên đang mở ──│
│                │ tên / hẹn tiếp / mục tiêu│
│ thao tác chính │ lịch sử ─── sheet chi tiết│
│                └─────────────────────────│
│ chi tiết đo được phóng lớn → đối chiếu nguồn│
└──────────────────────────────────────────┘

Phone — cùng vật thể, khác thao tác
┌ tên học viên ─ trạng thái kết nối ┐
│ hẹn tiếp theo / việc cần làm      │
│ lịch sử có thể mở chi tiết        │
│ sheet dữ liệu mở theo thao tác    │
└──────────────────────────────────┘
```

Đây chỉ là ý tưởng cấu trúc. Cần vẽ hình tĩnh để kiểm cách chia khoảng trống,
độ sâu và tỷ lệ, không biến sketch thành layout cuối mà bỏ qua nghiên cứu.

## Artifact và kiểm tra lượt này

- Evidence ignored: `.agents/audit/ui/2026-10-30-language-research/`.
- Có 10 ảnh desktop: hero + đoạn chi tiết của 5 website; đã xem trực tiếp cả 10.
- `board.html` ghép 4 nguồn với nhận xét thành `reference-board.png` để cùng xem.
- Không kiểm tra mobile, keyboard hoặc UX toàn bộ các website đối thủ. Browser capture
  không đo được spring/interaction; các gợi ý motion phía trên là đề xuất, chưa quan sát xác minh.
- Không sửa prototype hoặc website chính trong lượt này. Không chạy lại suite app/tests
  vì đây là nghiên cứu; giữ nguyên video, database và các thay đổi chưa commit.

Bước thiết kế tiếp nên là **một bảng specimen** gồm hero, một phần hồ sơ và một
sheet/transition của cùng ngôn ngữ. Chỉ khi các phần đó tạo được cá tính nhất quán
mới áp dụng lên landing đầy đủ; không tiếp tục sản xuất nhiều trang A/B đổi theme.
