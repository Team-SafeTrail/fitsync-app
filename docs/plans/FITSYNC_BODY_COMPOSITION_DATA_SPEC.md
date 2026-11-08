# FitSync — đặc tả dữ liệu body composition và OCR đề xuất

Ngày: 2026-10-30. **Draft thiết kế; chưa có SQL/migration được thực thi.**
Phụ lục của [blueprint](FITSYNC_REBUILD_BLUEPRINT.md), dùng cho B1–B3.
Lead hướng dẫn dữ liệu: supabase-postgres-best-practices; server/upload: security-review.

## 1. Vấn đề hiện tại

`inbody_records` và `OcrMetrics` đang chứa weight, skeletal muscle mass, body fat
mass, percent body fat và total body water. Không có mô hình vùng, model/template,
ngày đo tách ngày nhập hoặc evidence từng trường. OCR upload hiện nhận JPEG/PNG/
WebP, không có PDF. Không sửa các ràng buộc năm trường cũ khi chưa có migration
tương thích và test; không coi mở rộng là cho phép lưu số liệu không kiểm tra.

## 2. Kết quả nghiên cứu và giới hạn

- Tài liệu InBody mô tả phân tích khối nạc theo năm vùng và phân tích mỡ theo vùng.
  Khối nạc không đồng nghĩa riêng cơ xương hoặc từng cơ. Hai đại lượng phải có tên
  trường khác nhau. [Giải thích kết quả của hãng](https://au.inbody.com/result-sheet-interpretation/)
- Hướng dẫn hãng lưu ý kết quả ở từng model khác nhau và không thể giải thích mọi
  thay đổi khối nạc bằng tăng cơ. [Professional Guide](https://uk.inbody.com/wp-content/uploads/2018/08/The_Professional_s_Guide_to_the_InBody_Result_Sheet.pdf)
- Brochure 570 mô tả nước nội/ngoại bào, khối nạc và mỡ theo vùng; có mục đầu ra
  và phiếu mẫu để xây checklist. Tài liệu này là tham khảo model, không bảo đảm
  mọi máy ở mọi thị trường in cùng template. [Brochure 570](https://uk.inbody.com/wp-content/uploads/2018/08/Product-Brochure-570-UK.pdf)
- TANITA có dòng phân tích từng vùng với tên chỉ số cơ/mỡ riêng. Đây là lý do cần
  mapping theo vendor/model, không map mọi chữ “muscle” sang SMM của InBody.
  [TANITA segmental](https://tanita.eu/consumer-scales/segmental-body-composition)
- Trang sản phẩm 270 cũ trên InBody USA chuyển tới 270S. Không lấy thông số bản S
  điền vào model cũ. [270S hiện tại](https://inbodyusa.com/products/inbody-270s/),
  [so sánh model](https://inbodyusa.com/products/comparison-guide/).

Nghiên cứu này đọc nội dung tài liệu, chưa kiểm chứng OCR trên phiếu thật, chưa
hoàn tất đối chiếu trực quan toàn bộ mẫu báo cáo. Không công bố số trường/model
đã hỗ trợ hoặc độ chính xác. Chưa có kết luận tương thích mọi máy tương tự.

**Cách thể hiện mong muốn “nhóm cơ đang thiếu”:** hiển thị vùng tay/chân/thân cùng
chỉ số và reference đúng từ phiếu khi có. Không suy ra cơ ngực, vai, lưng hay cơ
đùi cụ thể thiếu khối lượng từ các vùng đó. Nhận xét PT là coaching assessment có
tác giả; inference AI phải có nguồn, giới hạn và PT duyệt, không chèn vào số đo.

## 3. Hợp đồng “đầy đủ”

Mỗi vendor/model/template có danh mục trường, đơn vị, nhãn gốc và trạng thái:
supported/extraction-test/unsupported. Ngôn ngữ và phiên bản mẫu được ghi nhận.
Không coi tên model là đủ để đoán mọi trường trên phiếu.

Mỗi trường phân biệt: có giá trị; không có trên phiếu; không đọc được; chưa duyệt;
không được model hỗ trợ. Không thay phần thiếu bằng 0, trung bình, giá trị lần cũ
hay giá trị “hợp lý” do LLM đoán. Trường lạ hiện cảnh báo và chờ mapping có version.

Nhận phiếu chưa biết template: giữ source riêng, báo giới hạn, cho chọn model và
nhập tay; không trình bày một draft năm trường là “đã đọc đầy đủ báo cáo”.

## 4. Danh mục trường dự kiến

Đây là phạm vi thiết kế, không khẳng định mọi trường xuất hiện trên mọi máy.

| Nhóm | Trường/ý nghĩa cần hỗ trợ | Lưu ý mapping |
| --- | --- | --- |
| Ngữ cảnh | Vendor, model, template, ngày/giờ đo, timezone nếu biết, chiều cao, tuổi tại lần đo và thông tin tham chiếu máy dùng nếu có | Tách tuổi lúc đo khỏi tuổi hiện tại; tối thiểu hóa định danh trên phiếu |
| Tổng thể | Weight, SMM, body fat mass, PBF, fat-free mass, soft lean mass nếu có | Không gộp SMM, FFM và lean mass |
| Thành phần | Total body water, protein, minerals/dry lean mass; ICW/ECW theo model | Đơn vị gốc có thể khác; không cộng nhầm các thành phần lồng nhau |
| Chỉ số | BMI, BMR, InBody score nếu có | BMR máy không phải calorie target của PT |
| Từng vùng | Lean mass, fat mass, chỉ số muscle đúng theo vendor; reference % và nhãn nếu có | Năm vùng: left/right arm, trunk, left/right leg |
| Mỡ nội tạng | Visceral fat level hoặc visceral fat area | Level khác cm², không đổi qua lại |
| Mục tiêu máy | Target weight, weight/fat/muscle control; nhãn và dấu +/- | Là gợi ý máy trên phiếu, không tự trở thành mục tiêu coaching |
| Mở rộng | WHR, SMI, ECW/TBW, phase angle, impedance theo vùng/tần số, chu vi nếu có trên template | Registry có đơn vị/dimension rõ; không bắt tất cả trước khi intake dùng được |
| Lịch sử in trên phiếu | Các điểm lịch sử được in kèm | Là historical points có provenance, không tự tạo các lần đo verified trùng |

Reference % có thể là phần trăm so với mức tham chiếu, có thể lớn hơn 100. Nó
không đồng nghĩa tỷ lệ mỡ 0–100%. Dùng các trường riêng như `fat_reference_percent`
và `fat_fraction_percent`; chỉ map nếu xác định đúng ý nghĩa từ template.

## 5. Mô hình dữ liệu đề xuất

Tên sau là tên ứng viên; quyết định schema cuối tại B2. Tránh cả bảng quá rộng
cho mọi model lẫn EAV tự do không có validation.

| Thực thể | Nội dung chính | Quan hệ/quy tắc |
| --- | --- | --- |
| `body_composition_reports` | Trainee/PT, measured_at, thời gian/độ chính xác ngày đo, vendor/model/template, source kind, schema version, verified actor/time, supersedes id | Một snapshot được PT xác nhận; ownership từ trainee; sửa tạo revision mới |
| `body_composition_totals` | Cột numeric cho các chỉ số chuẩn có unit cố định; trường không có để null | Một-một report; không lưu lại số liệu tương tự trong bảng khác làm hai nguồn chuẩn |
| `body_composition_segments` | Segment enum, lean mass, fat mass, muscle metric có định nghĩa, reference %, category được in | Unique report+segment; hỗ trợ tối đa năm vùng của template đã chọn |
| `body_composition_observations` | Metric key từ registry, value/unit, region/frequency nếu cần | Chỉ cho chỉ số mở rộng; không text tùy ý thay type/constraint |
| `report_source_files` | Private path, hash, MIME, bytes, page count, processing/retention metadata | Tách vòng đời source; quyền upload/view/delete riêng; không public URL |
| `report_extraction_attempts` hoặc mở rộng `ocr_attempts` | Provider/version, template/schema version, trạng thái, thời gian, normalized draft | Server-only persistence; không ghi raw payload/provider text mặc định |
| `report_field_evidence` | Field key/segment/page, vị trí nếu provider có, extracted value, corrected value, confidence loại nào, reviewer | Evidence tối thiểu cần audit; không bịa bbox/confidence khi provider không trả |
| Coaching notes/targets | Nhận xét, mục tiêu và người duyệt, thời điểm hiệu lực, visibility | Thuộc miền coaching riêng, không viết vào số đo hoặc nhãn máy |

Core numeric precision chọn theo miền và mẫu thật, không dùng float cho số đo cần
đối chiếu chính xác. Không migrate UUID sang bigint chỉ vì ví dụ skill dùng bigint.
FK có index theo truy vấn; unique/index phục vụ lịch sử report và RLS trainee/PT.
Không bắt buộc DOB/giới tính hoặc thông tin nhạy cảm mới chỉ để import nếu model
không cần và sản phẩm không có lý do đã duyệt.

Draft có thể thiếu chỉ số chuẩn. Bản lưu hoàn chỉnh chỉ yêu cầu trường bắt buộc
theo template/quy tắc đã duyệt. Nếu chỉ đọc được một phần, cho lưu bản nháp/chưa
hoàn chỉnh với nhãn rõ; không giả đầy đủ để vượt gate. Bản nhập tay năm trường
cũ tiếp tục hợp lệ với schema_version/coverage cũ.

## 6. Pipeline ảnh và PDF

1. Xác thực PT và quyền trainee; chọn hồ sơ đích trước khi xử lý. ID/tên trên phiếu
   chỉ là gợi ý đối chiếu, không tự gán học viên hoặc tạo tài khoản.
2. Kiểm tra size, MIME và binary signature ở server. PDF có cổng riêng: giới hạn
   trang, kích thước raster, tài nguyên và timeout; không tải URL nhúng hay chạy
   script/attachment. PDF khóa/malformed có lỗi rõ. Duyệt dependency trước khi thêm.
3. Với PDF có text, thử trích text và cấu trúc; với bản scan dùng ảnh. Không mất
   dấu trang. Nội dung phiếu là dữ liệu không tin cậy, không phải lệnh cho AI/tool.
4. Nhận diện template/vendor có uncertainty; cho PT sửa. Chuẩn hóa đơn vị/dấu phẩy
   thập phân, xác định vùng bên trái/phải theo nhãn, không theo vị trí hiển thị.
5. Provider trả draft vào schema có version; validate cấu trúc và domain. Confidence
   không có phải để unknown; không dùng một số LLM tự chấm làm xác suất đúng đã đo.
6. Review so phiếu gốc với draft, theo nhóm toàn thân/vùng/mở rộng. Đánh dấu thiếu,
   nghi sai đơn vị và không nhất quán. Giữ một lần xác nhận tổng thể có trách nhiệm;
   không bắt nhập lại mọi trường đã đọc đúng.
7. Xác nhận ở server trong transaction: kiểm tra ownership, values, attempt version,
   tạo snapshot và liên kết attempt nguyên tử. Idempotency chống double-submit;
   draft cũ hơn revision hiện tại không ghi đè im lặng.
8. Học viên chỉ thấy bản được xác nhận và chia sẻ. Hình/source không public, ký URL
   ngắn hạn theo quyền; giữ file lâu bao nhiêu do retention policy quyết định.

Đơn vị canonical và giá trị gốc tối thiểu được giữ để giải thích conversion. Không
lưu toàn văn OCR/debug raw JSON vô thời hạn. Hủy/failed job và ảnh tạm có cleanup
được kiểm thử. Có retry giới hạn, chi phí tối đa/job và kill switch provider.

## 7. Validation và so sánh theo thời gian

- Giữ kiểm tra và quy tắc cũ cho bản cũ. Bounds mới được review theo trường, model,
  đối tượng được phục vụ và đơn vị; không coi dải hiện tại là chuẩn cho mọi máy.
- Chặn kiểu dữ liệu sai, NaN, âm không hợp lệ, đơn vị sai; cross-field có tolerance
  được giải thích theo precision làm tròn. Dấu +/- của weight control là hợp lệ.
- PBF khác reference %; ECW/TBW ratio khác percent; visceral level khác area.
- Không cộng khối nạc của năm vùng rồi ép bằng SMM toàn thân; đây là metric khác.
- Dữ liệu mới thêm không được vô tình biến nutrition target thành số máy đã xác nhận.
- Biểu đồ hiển thị model/unit/ngày đo, không tự nối các metric khác định nghĩa.
  Chênh lệch là mô tả thay đổi, không tự kết luận nguyên nhân hay chẩn đoán.
- Sửa bản đã xác nhận tạo revision có lý do và liên kết; audit tránh nhân bản dữ
  liệu nhạy cảm không cần thiết. Quyền xóa vẫn theo retention/governance.

## 8. Migration và tương thích

1. Inventory local/staging qua schema/metadata được phép; không đọc real health data.
2. Tạo bảng/cột mở rộng cùng RLS, constraints và types; test trên DB dùng một lần.
3. Mapping mỗi `inbody_records.id` sang report mới một-một; giữ source và verified
   actor/time, mapping ngày recorded không rõ measured phải ghi độ chắc chắn.
4. Backfill chỉ năm trường thực có, nutrition draft sang miền riêng nếu được duyệt.
   Phần theo vùng null/not_present; không chạy AI trên dữ liệu cũ như setup effect.
5. Dry-run đối chiếu counts/uniqueness/ownership trên synthetic fixtures, rồi mới
   migration môi trường đã cho phép. Có checkpoint và rollback được diễn tập.
6. Chuyển read/write có chiến lược version/compatibility; tránh dual-write ngoài
   transaction. Chưa xóa cột/bảng cũ cho tới khi client cũ và đường rollback hết cần.

## 9. Benchmark và tiêu chí nghiệm thu

Corpus synthetic trước, version theo template/model/ngôn ngữ/chất lượng ảnh/PDF.
Không dùng tên liên hệ thật; có manifest, ground truth độc lập, holdout khóa và
quyền sử dụng tài liệu. Nguồn công khai không tự đồng nghĩa được tái phân phối.

So ít nhất hai ứng viên theo kế hoạch benchmark hiện có; giữ giới hạn provider và
governance. Mở rộng benchmark từ năm trường sang từng nhóm/vùng. Ngưỡng số cụ thể
phải được duyệt trước holdout; không chọn lại ngưỡng sau khi xem kết quả.

Đo field coverage với denominator các trường thực trên template; numeric accuracy
trong tolerance từng metric; lỗi đơn vị, hoán đổi trái/phải; false-fill trường không
có; tỷ lệ reject; thời gian sửa+tổng thời gian PT; latency p50/p95 và chi phí.
Tách kết quả model/template thay vì một “accuracy” chung che lỗi phần theo vùng.

Bắt buộc test: thiếu vùng, reference >100, unit lb/kg, dấu phẩy thập phân, ảnh xoay,
PDF text/scan/nhiều trang/malformed, báo cáo trùng, chọn sai học viên, timeout,
confidence unknown, xác nhận hai lần, sửa revision và cross-tenant media. Không có
verified record trước PT confirm. Manual fallback luôn dùng được khi provider lỗi.

“Đạt” cần: template matrix khớp UI/schema, toàn bộ trường hỗ trợ có đường lưu và
evidence, RLS/transaction qua test, upgrade giữ bản cũ, benchmark được review và
PT hoàn thành luồng. Chưa benchmark thì trạng thái implemented/prototype, không
verified live OCR và không marketing phần trăm chính xác.
