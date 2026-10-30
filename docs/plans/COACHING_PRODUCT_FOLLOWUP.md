# FitSync — công việc sau thiết kế

**Đọc tiến độ mới nhất ở mục “Checkpoint thực thi B0–B8” cuối file.** Các bảng hiện trạng ban đầu là snapshot trước CHAT-TEXT-01. Lát cắt chat đã có code/migration để review nhưng tắt mặc định, chưa nghiệm thu DB hoặc hai tài khoản.

2026-10-30. Kế hoạch theo yêu cầu chủ sản phẩm; không phải PRD gốc, không mặc định persona/milestone cũ. Chủ sản phẩm xác nhận đã có mô hình kinh doanh trước đó và ngày 2026-10-30 yêu cầu cùng xem xét lại, không coi như chưa từng có quyết định. Giá cụ thể mới chưa được duyệt.

## Phạm vi hiện tại

Khôi phục nội dung landing trong ngôn ngữ thiết kế đã duyệt: tiếp nhận → kết nối → xác nhận số đo → theo dõi; khảo sát tổng hợp kèm giới hạn; trạng thái chức năng; vai trò đội ngũ. Demo chọn ba phiếu giả, sửa cân nặng, invalid/review/confirm/reset. Không tự tạo mục tiêu dinh dưỡng: công cụ cũ có công thức giả định, không phải tư vấn cá nhân. Không đưa lại giá, ROI, APK hoặc cam kết hỗ trợ chưa có bằng chứng. Dữ liệu khảo sát theo ../research/survey-evidence.md.

## Đối chiếu ý muốn với hiện trạng đọc từ code

| Ý muốn đã nêu | Hiện trạng | Giữ/sửa/bổ sung | Còn chưa rõ |
| --- | --- | --- | --- |
| Hồ sơ gom thông tin, giảm nhập liệu | Roster, lời mời, InBody, check-in, ảnh bữa ăn | Giữ nền auth/RLS; gom ngữ cảnh tư vấn | Intake tối thiểu, ghi chú nội bộ/chia sẻ |
| Chat trong app | Hội thoại landing là mẫu | Bổ sung chat thật | Read receipt, sửa/xóa, retention |
| Lịch chung, bài tập tùy chọn | Appointment mẫu | Bổ sung booking dùng cùng ID từ chat | Ai duyệt đổi, xử lý trùng lịch/hủy/vắng |
| Membership và buổi PT | Có số buổi tổng/còn lại | Tách thời hạn, attendance và ledger | Gói chồng nhau, hoàn buổi, nhập lịch sử |
| OCR ảnh/PDF đầy đủ | Có review, ảnh; default adapter unavailable | Mở rộng report model và provider có benchmark | Template đầu, unit, missing/segmental |
| AI đồ ăn, voice, bài tập | Chưa có luồng thật | Để sau core, kiểm chứng riêng | Provider, chi phí, consent, license OpenGym |
| Android trước, web hai vai trò | Responsive web, chưa có native | Spike Android, iPhone/chủ gym sau | Offline, push, shared/native architecture |

Đây là đọc code; chưa xác minh authenticated runtime sau chuyển ổ. Giá trị khách hàng là bớt nhập/tìm và phối hợp dễ hơn. Giá/người trả tiền là giả thuyết kinh doanh; EXE201 và demo có bằng chứng riêng, không thay việc kiểm chứng với PT.

## Các gói triển khai đề xuất

1. **Hồ sơ và quyền:** chốt intake, private/shared/draft, quan hệ PT–học viên. Luồng tạo → mời → nhận → xem cùng bản ghi. Nghiệm thu bằng hai PT/hai học viên synthetic: lưu/reload, đúng quyền cả khi gọi trực tiếp API, trạng thái trống/lỗi/hết phiên. Cần Supabase test; không bypass auth để chụp demo.
2. **Chat:** thread theo quan hệ; history có phân trang; pending/sent/failed, retry không nhân đôi; kiểm quyền đọc/ghi/realtime. Text trước, attachment sau quyết định retention. Hai phiên thật gửi/nhận/reload, mất mạng, người thứ ba đoán ID vẫn bị chặn. Không log nội dung. Chốt quyền khi hủy kết nối trước schema.
3. **Lịch:** đề xuất PT tạo/xác nhận, học viên đề nghị đổi; đây là lựa chọn UX để thử, chưa phải chủ sản phẩm đã chốt. Appointment có time zone, người tham gia và trạng thái, chat tham chiếu cùng ID; bài tập không bắt buộc. Nghiệm thu đổi/hủy đồng bộ, concurrency, trùng lịch, qua ngày. Đặt lịch không trừ buổi.
4. **Membership/sổ buổi:** ngày bắt đầu/kết thúc tách số buổi. Self check-in khác attendance khác PT ledger. Đề xuất PT xác nhận completed mới debit idempotent; sửa sai bằng entry bù có lý do. Nghiệm thu không âm/trừ đôi, không trừ khi tự check-in, lịch sử giải thích được. Chốt hủy/vắng/hoàn buổi trước code.
5. **OCR:** khảo sát báo cáo synthetic, chốt template; đọc body composition spec hiện có như đề xuất. Giữ provenance, model, source, units, missing và segmental lean/fat đúng nghĩa; không suy ra nhóm cơ yếu từ khối nạc theo vùng. PDF phải kiểm signature/pages/size, storage riêng, PT duyệt. Benchmark provider trước quảng bá. Nghiệm thu file hỏng/giả đuôi/lớn, draft không lộ thành confirmed, migration tương thích record cũ, RLS/storage tests.
6. **Android/bổ sung:** kiểm thiết bị thật camera/deep link/background/keyboard. OpenGym cần kiểm license trước import. Food AI phải detect food, có khẩu phần/độ bất định và cho sửa. Voice cần consent, processing/retention/deletion. Chưa scaffold mobile, cài provider hoặc thêm dashboard chủ gym.

Thứ tự trên là đề xuất theo phụ thuộc. Lượt hiện tại thực hiện landing và kế hoạch; các gói chức năng cần scope issue và quyết định UX trước code/migration. Không đổi roadmap active bằng tài liệu này. Dùng Postgres skill trước SQL, security-review cho input/auth/API, frontend-design theo DESIGN.md, React guideline đúng version. Không reset dữ liệu, push main hoặc deploy.

## Kiểm chứng giá trị

Sau governance gate và sự đồng ý: so thời gian intake gồm sửa OCR, tìm ghi chú, đặt/đổi lịch, đối chiếu gói; đo lỗi và số lần chuyển công cụ so với cách PT đang dùng. Không coi số màn hình hay tests pass là giá trị đã chứng minh. Không cài tracking hoặc ấn định giá trong lượt này.

## Remake toàn bộ trải nghiệm hai vai trò — cập nhật theo chủ sản phẩm

Phạm vi đích bao gồm bố cục, điều hướng, tương tác, nghiệp vụ và dữ liệu; đổi theme chỉ là phần đã hoàn thành. Tài liệu này không gọi việc thêm section landing là remake sản phẩm.

### Cấu trúc màn hình đề xuất

| Vai trò | Điều hướng chính | Công việc của màn hình |
| --- | --- | --- |
| PT | Hôm nay | Lịch sắp tới, yêu cầu đổi lịch, tin chưa đọc, check-in cần xem; mở đúng hồ sơ từ từng việc |
| PT | Học viên | Tìm/lọc → hồ sơ; tổng quan, chỉ số/tiến trình, dinh dưỡng, lịch, gói/buổi và ghi chú có quyền riêng |
| PT | Lịch | Ngày/tuần, tạo buổi không bắt buộc giáo án, đổi/hủy có trạng thái; xem cùng appointment trong chat |
| PT | Tin nhắn | Danh sách hội thoại → thread gắn học viên; từ cuộc trò chuyện mở hồ sơ/lịch và trở về giữ vị trí |
| Học viên | Hôm nay | Buổi tiếp theo, việc cần xác nhận, mục tiêu đã được chia sẻ, thao tác check-in/ảnh bữa ăn |
| Học viên | Lịch | Cuộc hẹn của mình, đề nghị đổi và xem kết quả; không đọc roster của PT |
| Học viên | Trao đổi | Chat với PT, cùng thông tin cuộc hẹn; không thấy ghi chú nội bộ |
| Học viên | Tiến trình / Hồ sơ | Lịch sử chỉ số, chart có nguồn/ngày/đơn vị, membership và buổi PT; không biến số mẫu thành thành tích thật |

Tên tab và ranh giới bốn/năm mục cần thử trên phone, chưa khóa navigation chỉ vì bảng này. Desktop dùng sidebar/master-detail khi giúp thao tác; phone là màn công việc riêng, không thu nhỏ cả bảng desktop. Cùng backend/domain, chưa quyết định có tách app package hay không.

### Luồng đi xuyên nhiều màn hình

- Tiếp nhận: tạo hồ sơ → ghi mục tiêu → nhập ảnh/PDF hoặc thủ công → đối chiếu/sửa → xác nhận → mời/kết nối → học viên thấy đúng phần đã chia sẻ. Mời có thể trước/sau bản đo, không chặn hồ sơ khi chưa có máy đo.
- Trước buổi: Hôm nay → cuộc hẹn → hồ sơ gần nhất → ghi chú riêng → chat nếu cần. Back trở lại đúng ngày/vị trí; không bắt PT soạn bài tập.
- Đổi lịch: học viên đề nghị → PT xử lý → hai bên cùng thấy trạng thái → thread giữ tham chiếu; đề nghị không ghi đè appointment đã xác nhận.
- Sau buổi: PT ghi hoàn thành → xử lý ledger theo quy tắc được duyệt → cập nhật tiến trình. Tự check-in, membership còn hạn và số buổi có phí là ba thông tin khác nhau.
- Bữa ăn: học viên chụp/gửi → PT xem và phản hồi; AI là lựa chọn thêm, chỉ khi có food detection, ước tính bất định và quyền sửa. Gửi ảnh vẫn dùng được khi AI lỗi.

### Trình tự thực hiện và review

1. Sơ đồ trên → wireframe hai vai trò cho năm luồng; gồm empty/loading/error/offline/pending/permission. Review bằng tình huống thực, không chỉ screenshot đẹp.
2. Hoàn thiện một vertical slice hồ sơ/kết nối/record có lưu, cùng ma trận quyền; kiểm dữ liệu cũ và Supabase test.
3. Chat thật và lịch thật theo shared appointment; desktop và phone có cùng kết quả, trạng thái thất bại có cách xử lý.
4. Membership/ledger và mở rộng báo cáo; test đồng thời, retry, isolation, migration, mandatory review.
5. Android spike và bổ sung AI/workout theo điều kiện riêng. Landing cập nhật theo capability thực sau mỗi phần, không đợi tất cả xong mới nói rõ sản phẩm.

Không thêm commerce gate vào chat/đọc hồ sơ trong lúc chưa có quyết định giá. Chủ gym, community/gamification vẫn không tự nhảy vào phạm vi đầu. Mỗi phần chỉ hoàn thành khi chức năng, layout, quyền và các trạng thái được kiểm tra cùng nhau.

### Rà soát ngôn ngữ landing

Đã có forest/jade/apricot, Be Vietnam Pro và hierarchy được duyệt. Section tiếp nhận dùng trình tự, hồ sơ dùng dossier, số đo dùng source/review sheet; không quay về một grid card cho mọi nội dung. Tuy nhiên tokens đồng bộ chưa đủ chứng minh tổng thể tốt. Cần kiểm lại mạch: hiểu giá trị → hiểu công việc → xem hai vai trò → thử đối chiếu → biết khả năng → hành động. Bảng trạng thái và khảo sát nên hỗ trợ đánh giá, không lấn át phần người dùng làm gì. Không biến landing thành log kỹ thuật: đổi thuật ngữ code/provider thành khả năng sử dụng dễ hiểu. Đây là tiêu chí audit, không tuyên bố đã có nghiên cứu usability mới.

## Mô hình kinh doanh

Chủ sản phẩm yêu cầu cùng xem xét lại baseline đã có. Xem [phân tích mô hình và kiểm chứng](BUSINESS_MODEL_REVIEW.md). Đề xuất chưa thay thế mô hình cũ hoặc tự kích hoạt giá trên landing.

## Kiểm tra và đồng bộ các trang — 2026-10-30

Đã làm các increment giao diện: landing minh họa/offer có trạng thái; public PT mở hồ sơ mẫu, danh sách mobile, nhãn tiếng Việt, clipboard có báo lỗi; public trainee đúng vai trò/ngữ cảnh PT; brand/navigation đồng bộ; workspace navigation riêng theo vai trò; admin dùng tokens chung, trang pháp lý phân biệt sample/account. Có tìm kiếm/tiến trình workspace từ increment trước, nhưng chưa có authenticated runtime evidence. Báo cáo chi tiết: ../reviews/ALL_PAGES_ALIGNMENT_REVIEW.md.

Chưa hoàn thành các gói chat/calendar/membership/PDF/native; không tick done bằng các màn mẫu. Môi trường hiện thiếu cấu hình Supabase và không tìm thấy Docker/Supabase CLI trong PATH. Bước backend tiếp cần môi trường synthetic test có thể chạy, không gửi secret qua chat; không tự cài cloud/provider hay chạy migration production. Mô hình PT subscription đang được cân nhắc theo yêu cầu owner, chưa thay giá chính thức.

## Checkpoint owner mới nhất

Xem ../PRODUCT_DECISIONS.md: mức199k/tháng đã có khảo sát sơ bộ; ưu tiên implementation workspace thật, tour chỉ là phụ. Chưa xác định URL deployed hay có Supabase test; không tiếp tục xem đổi giao diện mẫu là hoàn thành remake core.

## Checkpoint thực thi B0–B8 — 2026-10-30

Bảng này theo các nhãn của blueprint, là điểm đọc tiến độ hiện hành; các mục ghi lịch sử phía trên không có nghĩa mọi giai đoạn đã xong.

| Giai đoạn | Trạng thái thật | Phần còn lại / cổng tiếp theo |
| --- | --- | --- |
| B0 Ranh giới | Đã ghi nhận hướng PT/học viên, Android trước,199k khảo sát sơ bộ | Các chi tiết nghiệp vụ còn mở giữ thành quyết định riêng |
| B1 Luồng/quyền/thiết kế | Visual approved; chat-text contract đã viết và đang có code để review | Review toàn bộ intake/OCR/lịch/gói; không gọi visual approval là duyệt mọi UX |
| B2 Dữ liệu/hợp đồng | Nền cũ có sẵn; migration chat đã chạy trên DB tạm của CI;140 SQL/RLS checks qua, chưa áp production | Chạy DB test/upgrade/isolation; sinh lại types từ DB và đối chiếu với bản types viết tay |
| B3 Intake/InBody | Có baseline năm chỉ số và review | Báo cáo đầy đủ/PDF/segmental/provider chưa đạt |
| B4 Chat/lịch/gói | Đang triển khai lát cắt text chat thật; mặc định tắt, chưa nghiệm thu | Hai tài khoản test, retry/pagination/archive; sau đó shared calendar và ledger |
| B5 Dinh dưỡng/bài tập | Có baseline check-in/ảnh; chưa remake đủ | Target/history, phản hồi PT, assignment; AI gate riêng |
| B6 Android | Chưa triển khai | Core contracts và test thiết bị thật |
| B7 Landing/pilot | Landing đã cập nhật một phần | Không hoàn thành trước activation/support/privacy/payment/pilot evidence |
| B8 Sau pilot | Để sau | iOS/chủ gym/community/voice theo nhu cầu đã kiểm chứng |

### Công việc đang thực hiện: CHAT-TEXT-01

[B1 contract và tiêu chí](B1_CHAT_TEXT_SLICE.md) → migration `20261030190000_coaching_text_messages.sql` → server action/page `/workspace/chat/*`. Đây là một miền xuyên B1/B2/B4 được tách trong blueprint, không đổi thứ tự hoặc tự đóng B3.

Đã viết: private text messages gắn đúng PT, learner auth identity và trainee record; RLS và column grants; idempotency nonce; keyset pagination giữ microseconds; disabled/loading/error/empty; draft giữ trong form khi lỗi; chuyển thread không mang draft sang người khác; refresh15s khi trang hiện, không gọi realtime/push.

Cập nhật CI: migration đã áp trên DB tạm độc lập và140 kiểm tra SQL/RLS (gồm29 chat) qua. E2E M2/M3 qua; chat hai tài khoản chưa qua ở lượt đầu, đang sửa và chạy lại. `FITSYNC_CHAT_ENABLED=false` mặc định. Không thêm fixture vào workspace, không giả chat thành công, không chạm production. Chưa mở attachment, sửa/xóa tin, read receipt hoặc notifications; rate limiting/operational retention còn là cổng trước pilot.

Bước kế tiếp chính xác: có môi trường Supabase synthetic chạy được → apply migration trên DB test có dữ liệu baseline → chạy pgTAP và authenticated chat E2E → đối chiếu generated types → review → bật cờ tại test. Không chuyển sang một lượt sửa landing khác để thay bước này. Các phần B1 lịch/OCR có thể tiếp tục thiết kế độc lập trong lúc môi trường test được chuẩn bị.

### CI-RUNNER-01 — gỡ chặn test backend

Draft PR31: https://github.com/Team-SafeTrail/fitsync-app/pull/31. Workflow backend-acceptance dùng Docker trên runner tạm, chỉ loopback, không cloud credentials/deploy. Bốn environment-guard tests qua. Run41059690048: DB start/5 pgTAP files140 checks PASS; browser M2/M3 PASS; chat E2E timeout, chưa nghiệm thu. Đã sửa cleanup test để không che lỗi và đặt streaming fallback sau kiểm quyền, giữ nguyên yêu cầu HTTP404/người ngoài không đọc được. Đang chạy lại; không đổi assertion thành chấp nhận quyền sai.

Workflow bổ sung schema types từ DB và ảnh chat synthetic để review đúng code chạy thật; không upload private footage/auth traces. Contract lịch/gói tiếp theo ở B1_CALENDAR_LEDGER_SLICE.md là đề xuất, chưa có migration mới. Không khởi tạo thêm miền DB chưa test trong lúc chat đang được kiểm chứng.

CI lượt2 (41061261782):140 DB/RLS PASS, M2/M3 browser PASS, schema types đã sinh từ DB; chat test dừng ở locator nút tạo học viên do dùng nhãn thiếu phần “& link mời”. Đã đối chiếu source/ảnh thật, sửa locator exact theo nhãn đầy đủ; các assertions không bị bỏ. Types hiện được lấy từ artifact schema public của DB test, không còn phần chat types viết tay. Thêm CI diff để giữ types khớp schema. Chat E2E đang chạy lại, chưa được gọi là đã qua.

CI lượt3 (41074069082):140 DB/RLS và schema diff PASS; M2/M3 PASS. Chat đã gửi từ PT nhưng test lưu URL trước khi client navigation hoàn tất, nên so URL learner với đường dẫn inbox. Sửa bằng chờ đúng URL thread trước khi đọc; đây là lỗi đồng bộ của test, chưa phải bằng chứng lỗi quyền hay gửi tin. Bổ sung acceptance cho polling, mất phản hồi sau commit rồi retry không trùng tin, phân trang các tin cùng timestamp và gửi từ trang lịch sử. Composer chuyển về trang mới nhất sau khi gửi từ lịch sử để người dùng thấy tin vừa gửi. Typecheck và diff check tại máy qua; kết quả browser mới còn chờ CI.

CI lượt4 (41075370536): SQL140/schema diff/M2/M3 vẫn PASS. Chat PT→learner→reply, polling và reload đã đi qua; mô phỏng mất phản hồi hiển thị đúng lỗi/giữ nội dung. Test dừng do locator alert chung trùng với route announcer của Next. Đã scope vào composer, giữ nguyên yêu cầu lỗi và retry. Từ lượt kế tiếp backend E2E build/start production với chính DB tạm để nghiệm thu bản build thay vì dev server; chưa tự gọi chat đã PASS.
