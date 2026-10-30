# Contract cho phần còn lại — review trước implementation

Tài liệu này chốt tên/ý nghĩa dữ liệu để hai bên triển khai cùng hướng. Các miền đánh dấu **target** chưa có migration/API chạy trong baseline. Không đưa target fields vào generated database types bằng tay hoặc trình bày một control chưa nối như chức năng đã hoạt động. Mọi thay đổi ngoài ranh giới đã thống nhất phải được chủ sản phẩm xem lại.

## 1. CALENDAR-02: yêu cầu đổi/hủy

Baseline có scheduled/retired và read/create; chưa có version/audit/request. Target:

| Thực thể / trường | Ý nghĩa |
| --- | --- |
| appointment.version | Integer tăng dưới lock, không do client tự đặt |
| appointment_change_requests | appointment_id, immutable participants, requested_by, base_version, kind reschedule/cancel, proposed_starts_at/ends_at, state pending/accepted/rejected/withdrawn/stale, nonce, timestamps |
| appointment_events | appointment/version, event kind, actor, before/after thời gian tối thiểu, reason, timestamp; append-only, không chép chat/health data vào event |

Learner đề nghị; PT chấp nhận/từ chối; learner có thể rút request pending. Slot gốc giữ nguyên tới khi PT chấp nhận. Accept phải cập nhật appointment và request trong cùng transaction; overlap lỗi thì cả hai giữ nguyên. Hai quyết định đồng thời chỉ một thành công; expected_version và state đều kiểm dưới lock. Không tự phạt vắng, tự trừ buổi hoặc âm thầm cancel khi có request.

RPC target: request_appointment_change(appointment_id,base_version,kind,proposed_range,nonce), resolve_appointment_change(request_id,decision,base_version,nonce), withdraw_appointment_change(request_id,nonce). Identity/pair lấy server/DB, không nhận quyền từ payload. Stale trả conflict để reload/review, không retry ghi đè tự động. Thẻ appointment trong chat phải tham chiếu cùng appointment ID dưới quyền đọc, không lưu một bản lịch độc lập trong message JSON.

## 2. PACKAGE-01/LEDGER-01: entitlement, attendance và số dư

Membership date revisions đã có. Session balance hiện là legacy counter, không phải ledger. Target gồm session_entitlements, session_ledger và completion events. Không thêm cơ chế thu tiền/checkout chỉ vì có package.

- Mở ledger từ remaining_sessions đang có bằng opening event, giữ nguồn legacy và ngày chuyển. Không dựng những buổi đã xảy ra để giải thích total−remaining.
- Hoàn thành buổi và debit phải cùng transaction; PT chủ động chọn buổi tiêu package. Consultation/tự tập có thể không tiêu buổi. Booking, learner check-in, membership hết hạn không tự debit.
- Lock package/appointment theo thứ tự nhất quán, kiểm version/quyền/balance, unique debit per appointment và unique reversal per debit. Retry trả cùng event; không balance âm.
- Sửa sai bằng adjustment/reversal có actor/reason, không UPDATE/DELETE event cũ. Ordinary user không ghi delta tùy ý. Chuyển SessionBalanceForm/action/RPC/grants cùng một release để đường legacy không bypass ledger.
- Expiry/override/no-show/refund là quyết định kinh doanh còn mở. Không tự chọn một chính sách tính phí.

## 3. BODY-REPORT-02: báo cáo đầy đủ, không giới hạn năm trường

Baseline hiện lưu năm chỉ số nền; default OCR adapter chưa cấu hình. Chưa có provider benchmark hay PDF pipeline được nghiệm thu. Nguồn thiết kế là owner interview và body-composition scan đã lưu trong checkout của chủ sản phẩm; phần contract dưới đây tự đủ để bàn giao, không phụ thuộc một tệp chưa commit. Đây là yêu cầu sản phẩm, không phải PRD gốc hoặc tuyên bố mọi máy đều hỗ trợ các trường dưới đây.

### Envelope và provenance target

body_composition_reports: id, trainee_id, pt_id, learner_identity_at_confirmation, schema_version, vendor, model, template_version, source_kind, measured_at hoặc measured_on, date_precision, recorded_at, review_status, verified_by/verified_at, supersedes_id, source_file_refs. Phân biệt ngày đo và ngày nhập; không backfill measured_at bằng created_at rồi gọi là ngày đo đã biết.

report_source_files: private bucket/path, hash, MIME, bytes, page count, lifecycle/retention metadata. Không lưu public URL. report_extraction_attempts giữ provider/version, template/schema version, status và normalized draft đã tối thiểu hóa; không log/lưu raw provider payload vô thời hạn.

### Danh mục trường canonical target

| Nhóm | Keys / đơn vị canonical |
| --- | --- |
| Nền | weight_kg, skeletal_muscle_mass_kg, body_fat_mass_kg, percent_body_fat (%), total_body_water_liters |
| Thành phần | fat_free_mass_kg, soft_lean_mass_kg, protein_kg, minerals_kg, intracellular_water_liters, extracellular_water_liters |
| Context | height_cm, age_at_measurement khi có lý do cần; vendor/model/template; thời gian và precision |
| Chỉ số | bmi (kg/m²), bmr_kcal_day, inbody_score, waist_hip_ratio, smi_kg_m2, ecw_tbw_ratio, phase_angle_deg |
| Mỡ nội tạng | visceral_fat_level và visceral_fat_area_cm2 là hai metric riêng; không chuyển đổi tương đương |
| Mục tiêu in trên máy | target_weight_kg, weight_control_kg, fat_control_kg, muscle_control_kg; giữ dấu +/−, không tự trở thành coaching target |
| Segments | left_arm/right_arm/trunk/left_leg/right_leg; lean_mass_kg, fat_mass_kg, lean_reference_percent, fat_reference_percent, fat_fraction_percent, printed_assessment nếu có |
| Mở rộng có registry | Impedance theo region/frequency, circumference, máy/template khác; metric key+unit+definition được version hóa, không EAV text tự do |
| Lịch sử in kèm | Printed historical observations với source/provenance; không tự tạo lại thành những verified reports độc lập |

Lean mass của vùng không đồng nghĩa SMM. Reference percent có thể>100; khác fat fraction0–100. Không cộng lean của năm vùng rồi ép bằng SMM toàn thân. Trunk không cho phép suy ra riêng cơ ngực/lưng/vai đang thiếu. Nhận xét coaching phải có tác giả và visibility riêng, không chèn inference vào số máy đo.

### Trạng thái trường và validation

Mỗi field cần value hoặc null, canonical unit, presence measured/not_on_report/unreadable/unsupported/not_reviewed; raw_value/raw_unit tối thiểu nếu cần conversion; page/region evidence nếu provider có. Confidence không có là unknown, không phải0 hoặc một xác suất LLM tự chấm. Unsupported/missing không thành số0 hoặc bản đo cũ.

Registry template quyết định required/optional, precision, bounds và supported/extraction-test/unsupported theo từng mẫu/ngôn ngữ/version. Không tự đặt bounds y khoa cho mọi model bằng một ví dụ SQL. File/JSON đầu vào không tin cậy; không cho nội dung báo cáo điều khiển tool hoặc query. Nhập tay luôn hoạt động khi provider không đọc được.

### Xác nhận và migration

RPC target confirm_body_report(trainee_id,attempt_id,expected_attempt_version,reviewed_payload,review_confirmed,nonce). Transaction xác minh actor/pair/template, validate giá trị/unit/cross-field, tạo snapshot+totals+segments+evidence và liên kết attempt nguyên tử. Chưa có PT confirm thì learner không thấy verified report. Retry cùng nonce/payload/pair trả cùng report; khác nội dung conflict. Sửa bản verified tạo revision có reason/supersedes, không ghi đè lặng lẽ.

Map mỗi legacy inbody_records.id một-một sang report với coverage core-five-v1; chỉ backfill giá trị thật có và verified actor/time. Nutrition draft chuyển miền riêng theo chiến lược version; không dual-write ngoài transaction và không xóa bảng/cột cũ trước khi đọc/rollback đã chuyển an toàn. Test counts, ownership, null reasons, units, revision và legacy clients trước cloud migration.

PDF cần binary-signature/size/page/resource/timeout limits, không chạy script/attachment hay tải URL nhúng. Phân biệt PDF text/scan, giữ page mapping, lỗi password/malformed rõ. Chọn dependency/provider bằng review riêng; không quảng cáo OCR thật vì fake adapter qua tests. Benchmark theo từng template/field với holdout, tolerance/threshold duyệt trước, false-fill/unit/left-right errors, thời gian PT sửa, latency và chi phí.

## 4. Dinh dưỡng, ảnh bữa ăn và bài tập

Target nutrition_targets: trainee/pair, version, effective_from, kcal/protein/carb/fat, author, state draft/published/retired, published actor/time. Learner chỉ nhận bản published; machine BMR không phải calorie target. Legacy targets trong inbody_records còn mang nhãn nháp và cần chuyển miền, không gọi là target history hoàn chỉnh.

Target meal_entries cho nhiều bữa/ngày: occurred_at/local_date, learner identity, note, private media refs; PT feedback riêng có actor/time. Giữ gửi ảnh hoạt động khi AI tắt/lỗi. Food analysis là thao tác tùy chọn sau food detection; kết quả macro là ước tính có uncertainty/disclaimer/quyền sửa, không tự overwrite target hoặc bữa ăn thật.

Workout/assignment là tùy chọn trong appointment hoặc chat. Không bắt PT soạn giáo án mới đặt lịch. OpenGym là nguồn đang cân nhắc; kiểm repository/license/content mapping trước import, chưa được chọn mặc định. Voice cần consent/retention/provider/confirmation riêng.

## 5. Vận hành, identity và Android

- Read-state/unread counts chỉ hiển thị sau khi có model per-user và delivery semantics. Polling15s không gọi là realtime/push. Nội dung thông báo khóa màn hình phải được thiết kế riêng.
- Rate/abuse protection cần ở boundary có thể kiểm soát cả direct API/RPC; cờ UI và button pending không phải rate limit hay security policy.
- Review legacy role/archive/relink/replacement identity trên health/check-in/media, tương tự nhưng không suy ra từ chat tests. Cần scoped coach-display identity cho learner; không mở đọc toàn bảng profiles để lấy một tên.
- Retention, xóa tài khoản, source cleanup, backups, incident/support contact và provider data handling phải chốt trước pilot. Đánh giá FKs restrict/cascade; không tự xóa health history bằng script cleanup.
- Android dùng cùng identity, participant IDs, schema/API version, RLS và idempotency. Không nhúng service-role hoặc provider key vào app. Deep link invitation, secure session storage, camera/media permission, keyboard/safe area, reconnect/background và retry đều cần máy Android thật. Issue24 ghi hướng Expo/React Native dài hạn; ADR003 Proposed TWA cũ cần được đối chiếu/cập nhật trước scaffold. Bản handoff web không tự đổi quyết định đó hoặc chứng minh app-store availability. Xem CODE_AND_CONTRACT_MAP.
