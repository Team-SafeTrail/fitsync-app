# FitSync — blueprint tái định hướng và phát triển web + Android

Ngày: 2026-10-30. Trạng thái: **kế hoạch đề xuất để chủ sản phẩm duyệt**.

Chủ sản phẩm đã đồng ý luồng kiểm chứng đầu và Android trước, đồng thời yêu cầu
lập kế hoạch xem xét lại toàn bộ sản phẩm, gồm landing, funnel, quyền và database.
Việc lập tài liệu không đồng nghĩa đã duyệt mọi quyết định UX, schema hay công nghệ.
Chưa thực hiện migration, thay đổi app, push hoặc deploy.

## 1. Tóm tắt và mục tiêu

FitSync là nơi PT tiếp nhận, quản lý và đồng hành với học viên, dùng trên web và
điện thoại. Hồ sơ học viên kết nối dữ liệu, ghi chú, InBody, dinh dưỡng, chat, lịch
và gói tập. PT giảm nhập lại và tìm thông tin trong Excel, giấy và Zalo cá nhân.

Đánh giá lại toàn bộ trải nghiệm; chỉ thay hoặc viết lại phần cần thiết sau khi
đối chiếu. Giữ các kiểm soát đúng: danh tính server, RLS, storage riêng, kiểm tra
file, PT duyệt OCR và dữ liệu đã xác nhận. Không đồng nhất “làm lại” với xóa code
hay tạo database trắng.

Kết quả mong muốn: một luồng có thể dùng thật từ landing → PT đăng ký → kết nối
học viên → nhập báo cáo đầy đủ → PT xác nhận → hai bên trao đổi, xem lịch và theo
dõi buổi tập, trên web và Android. iPhone là hướng tiếp theo.

## 2. Căn cứ, người dùng và giá trị

### 2.1 Điều chủ sản phẩm đã xác nhận

- PT là người dùng chính; học viên có trải nghiệm riêng trên cả web và mobile.
- Dữ liệu công việc tập trung trong hồ sơ; chat trực tiếp trong FitSync.
- Lịch chung bắt buộc. Tạo buổi hẹn không bắt buộc soạn bài tập.
- PT có thể gắn bài, ghi chi tiết và giao từ chat/lịch nếu muốn.
- Nhập InBody bằng ảnh/PDF, PT kiểm tra và sửa trước khi xác nhận. Không giới hạn
  tầm nhìn ở năm chỉ số; cần giữ được chi tiết theo vùng nếu báo cáo cung cấp.
- Membership theo ngày bắt đầu/kết thúc; hoạt động tập khác với buổi PT có phí.
- Android trước; web cho cả PT và học viên; iPhone sau. Chủ gym để sau.
- AI bữa ăn thuộc hướng sản phẩm, nhưng thời điểm đưa vào lần thử đầu chưa rõ.

### 2.2 Phân khúc và công việc cần giải quyết

| Người dùng | Công việc | Cách làm hiện tại theo chủ sản phẩm | Giá trị FitSync dự kiến | Điều cần kiểm chứng |
| --- | --- | --- | --- | --- |
| PT quản lý dữ liệu rời rạc | Tiếp nhận, tra cứu, theo dõi và trao đổi | Excel, giấy, Zalo | Một hồ sơ có ngữ cảnh, giảm nhập và tìm lại | Tổng thời gian có giảm sau cả bước sửa OCR không? |
| Học viên của PT đó | Biết lịch, mục tiêu, gửi cập nhật và nhận phản hồi | Tin nhắn và thông tin nằm nhiều nơi | Một nơi xem việc của mình và trao đổi với PT | Có sử dụng thường xuyên và chuyển trao đổi vào app không? |

Đề xuất giá trị: PT mở đúng hồ sơ là tìm được thông tin cần để chăm học viên;
học viên xem được lịch, mục tiêu và phản hồi liên quan tới mình. Các công cụ cũ
và ứng dụng coaching khác vẫn là lựa chọn thay thế. Tiện nhập dữ liệu và phù hợp
công việc PT Việt là giả thuyết khác biệt, chưa phải lợi thế đã được chứng minh.

### 2.3 Tách bốn lớp quyết định

| Lớp | Vai trò | Không được suy diễn |
| --- | --- | --- |
| Giá trị khách hàng | Giảm nhập/tra cứu, phối hợp dễ hơn | Có nhiều tính năng không chứng minh có giá trị |
| Kinh doanh | Thử người trả tiền, giá, chi phí phục vụ | Không mặc định 5–20 học viên, 199.000đ hay mô hình cũ |
| EXE201 | Theo dõi yêu cầu và bằng chứng riêng | Không ép thứ tự sản phẩm chỉ để đủ màn demo |
| Demo | Giải thích khả năng bằng dữ liệu tổng hợp | Không gọi fixture, giao dịch mẫu, OCR fake là vận hành thật |

## 3. Hiện trạng và hướng giữ/sửa

| Hạng mục | Bằng chứng ở checkout `e1b03ad` | Đề xuất |
| --- | --- | --- |
| Landing `/` | CTA đăng ký, tour, OCR mẫu; có quảng bá APK | Thiết kế/copy lại cùng funnel; gỡ tuyên bố vượt khả năng khi triển khai |
| `/app/*` | Dữ liệu fixture, thay đổi trong bộ nhớ | Giữ làm tour riêng hoặc thay bằng walkthrough; không nhập vào dữ liệu thật |
| Workspace | Lời mời, InBody thủ công, check-in, số buổi | Giữ logic an toàn; thiết kế lại cấu trúc và trải nghiệm |
| OCR | Hợp đồng năm trường, review UI; default unavailable | Mở rộng theo báo cáo/model; benchmark và thay provider có kiểm chứng |
| Schema | Tám bảng nghiệp vụ public được tạo trong migrations | Mở rộng có migration, tương thích bản ghi cũ; không reset dữ liệu |
| Membership/lịch/chat | Số buổi hiện tại chưa thay thế các nghiệp vụ này | Bổ sung miền dữ liệu và trạng thái, tránh ghi chép trùng |
| Admin `/admin` | Ba counts có thể live; người dùng/doanh thu/giao dịch mẫu | Tách khỏi sản phẩm PT; không dùng như dashboard chủ gym hoặc doanh thu thật |
| Android/iOS | Chưa có app mobile trong checkout | Spike lựa chọn kiến trúc, kiểm thử thiết bị, Android trước |

Nguồn: [brief](../PRD-FitSync.md), [alignment scan](../PROJECT_ALIGNMENT_SCAN.md),
migrations và code đã đọc. Lần khảo sát trước trong chat chạy 33 unit tests và
duyệt desktop/mobile giả lập. Database/RLS và E2E đăng nhập chưa chạy lại do thiếu
cấu hình Supabase. Lần viết blueprint này không chạy lại app tests.

## 4. Luồng và cấu trúc trải nghiệm đề xuất

### 4.1 Landing và funnel

Landing → xem lợi ích và bằng chứng đúng trạng thái → đăng ký PT → workspace có
hướng dẫn → tạo/kết nối học viên → bản báo cáo đầu được xác nhận → hoạt động chung.

Học viên từ link/QR mời → xác nhận PT → đăng nhập/tạo tài khoản → kết nối → trang
hôm nay. Không đưa học viên qua màn đăng ký PT. Quét QR không tự cấp quyền dữ liệu.

Landing kể một luồng cụ thể bằng màn hình thật đã kiểm chứng; giữ nhãn dữ liệu mẫu.
Giá, trial, APK, AI, độ chính xác và hiệu quả chỉ công bố khi có bằng chứng tương
ứng. Trong lúc chưa có bản tải, hiển thị đúng trạng thái thay vì nút 404. Thiết kế
landing ở B1, triển khai theo khả năng đã hoàn thành từ B3, rà soát cuối ở B7;
không bắt landing hoàn tất trước database hoặc ngược lại.

### 4.2 PT

- Trang hôm nay: lịch, yêu cầu cần xử lý, tin nhắn và cập nhật liên quan; không
  ưu tiên dashboard doanh thu hoặc số đo trang trí.
- Danh sách học viên: tìm/lọc, trạng thái kết nối, buổi gần nhất, gói còn hạn.
- Hồ sơ: tổng quan ngắn; đi sâu vào InBody/tiến trình, dinh dưỡng, lịch/bài tập,
  gói/buổi PT, ghi chú và chat. Nội dung hiển thị theo quyền chia sẻ.
- Ghi chú nội bộ riêng với tin nhắn và nhận xét chia sẻ cho học viên.
- Tạo hồ sơ trước khi học viên có tài khoản. Đề xuất cho phép PT lưu báo cáo cho
  hồ sơ chưa kết nối sau khi đã có quyền xử lý dữ liệu; học viên chỉ được xem sau
  khi liên kết. Đây là thay đổi so với ràng buộc code hiện tại, cần duyệt và test.

### 4.3 Học viên

Trang hôm nay: buổi sắp tới, việc PT giao, mục tiêu hiện hành và đường vào chat.
Có lịch của mình, hồ sơ/chỉ số đã chia sẻ, nhật ký ăn uống và kết quả tập nếu có.
Không có roster, ghi chú nội bộ, draft OCR hay lịch của học viên khác.

### 4.4 Lịch, chat và buổi PT

Đề xuất ban đầu: PT tạo buổi đã thống nhất; học viên gửi yêu cầu đặt/đổi/hủy.
Khi đổi, lịch cũ giữ tới lúc chốt; giờ mới của buổi đã xác nhận cần bên kia xác
nhận. Chặn trùng giờ đã chốt của cả hai bên, xử lý cạnh tranh đặt cùng slot ở server.
Từ chối/đề xuất giờ khác ngay trên thẻ yêu cầu; không cần nhắn lại toàn bộ thông tin.

Chat chứa thẻ liên kết tới cùng appointment/assignment, không tạo lịch thứ hai.
Gửi lại do mạng yếu không tạo hai tin hoặc hai buổi. Lịch lặp có sửa một lần/các
lần sau; trạng thái chờ, đã chốt, hoàn thành, hủy, vắng được phân biệt.

Membership thời hạn, check-in hoạt động và gói buổi PT là ba miền riêng. Đặt lịch
không tự trừ buổi. PT xác nhận hoàn thành tạo một bút toán sử dụng duy nhất; sửa
nhầm tạo bút toán đảo có lý do. Hủy/vắng và hạn báo trước là chính sách cần chốt,
không tự áp phí. Giữ quy tắc cảnh báo check-in hiện có cho tới khi có quyết định
thay thế và kiểm thử biên ngày. Thời gian nghiệp vụ tiếp tục dùng Asia/Ho_Chi_Minh.

### 4.5 Độ chi tiết bài tập

Buổi hẹn có thể trống bài tập. Nếu thêm, hỗ trợ chọn bài, hiệp, lần, tạ, thời gian
hoặc quãng đường khi phù hợp, nghỉ và ghi chú. Không ép tạ cho cardio hoặc ép số
lần cho plank. Mẫu dùng lại giúp giảm nhập; học viên ghi kết quả tùy việc được giao.
Thay mẫu không sửa ngược bài/buổi đã giao hoặc lịch sử hoàn thành.

## 5. InBody đầy đủ và giới hạn diễn giải

[Đặc tả dữ liệu chi tiết](FITSYNC_BODY_COMPOSITION_DATA_SPEC.md) là phụ lục bắt buộc
cho B1–B3. Không quảng cáo “mọi máy, mọi chỉ số” khi chưa có support matrix.

Nghiên cứu hãng xác nhận có các nhóm chỉ số toàn thân, khối nạc/mỡ theo vùng và
những đầu ra mở rộng theo model. Khối nạc theo vùng không phải bản đồ khối lượng
từng cơ. Không suy ra “cơ ngực thiếu” từ số đo thân người. Nguồn và giới hạn được
ghi tại phụ lục; nhận xét coaching của PT tách khỏi số đo và kết quả máy.

“Đầy đủ” nghĩa là các trường thực có trong template đã hỗ trợ đều có chỗ lưu,
duyệt và truy nguồn; không biến phần không đọc được thành 0 hoặc tự bịa cho đủ.
Ảnh/PDF gốc, draft chuẩn hóa và snapshot đã xác nhận có vòng đời riêng. Chi tiết
OCR chỉ được phát hành khi benchmark theo từng trường/model đạt ngưỡng đã duyệt.

## 6. Kiến trúc và dữ liệu

Giữ Next.js/Supabase làm nền khả dụng để đánh giá. Không tự nâng dependency hoặc
thay cơ chế auth. Next.js hiện là 14.2.21/React 18; trước code đọc tài liệu khớp
phiên bản. Đường docs Next.js nhúng trong AGENTS hiện không có ở package đã cài.

Đề xuất web và mobile có lớp trình bày riêng, dùng cùng danh tính, dữ liệu, quyền
và quy tắc server. Chỉ tách package dùng chung sau khi có hai nơi thực sự dùng.
Hợp đồng API cho mobile được xác định rõ; không gọi trực tiếp Next Server Actions
như một hợp đồng mobile ổn định hoặc để mỗi client tự tính nghiệp vụ khác nhau.

| Miền | Thiết kế dữ liệu cần xem xét | Quy tắc quan trọng |
| --- | --- | --- |
| Danh tính/kết nối | Giữ profiles, PT, trainee và invitation; bổ sung yêu cầu QR nếu cần | Link một lần; xác nhận đúng danh tính; QR không mang quyền đọc |
| Hồ sơ | Thông tin intake, mục tiêu có phiên bản, ghi chú phân mức chia sẻ | Không dùng một role admin toàn cục để làm chủ gym |
| Body composition | Report, totals, segments, field evidence, draft/attempt, source files | Review bắt buộc, snapshot bất biến, truy nguồn; xem phụ lục |
| Dinh dưỡng | Target theo giai đoạn, meal entry/media, estimate nếu bật | Tách target, BMR máy, dự đoán AI và lượng học viên báo cáo |
| Lịch | Appointment, participants, change request, event history | Server kiểm tra xung đột, xác nhận và múi giờ |
| Membership | Ngày bắt đầu/kết thúc, package và session ledger | Một completion không trừ hai lần; điều chỉnh có audit |
| Chat | Conversation, members, messages, attachments, read state | RLS cả lịch sử, realtime và media; phân trang, retry có idempotency |
| Bài tập | Catalog nguồn, template, assignment snapshot, log | Giữ giấy phép/nguồn; không đồng nhất catalog với giáo án |
| Hoạt động/audit | Giữ check-in phù hợp; thêm event audit cần thiết | Không đẩy nội dung chat/sức khỏe vào analytics/log |

Chỉ là mô hình đề xuất. B2 chọn tên bảng và hợp đồng sau khi rà schema thực tế;
không tạo toàn bộ bảng tương lai ngay từ đầu. Giữ UUID hiện có, số đo dùng numeric
phù hợp, thời điểm dùng timestamptz, thời hạn gói dùng date theo quy tắc rõ ràng.
Thiết kế khóa ngoại, uniqueness, index theo truy vấn và isolation tests cùng schema.

Migration theo expand → backfill có kiểm tra → chuyển đọc/ghi → loại tương thích
khi đủ điều kiện; có mapping một-một bản cũ, kiểm tra số lượng và rollback. Không
đổi dữ liệu năm trường cũ thành báo cáo đầy đủ giả. Không reset database đang dùng.

## 7. Ma trận quyền đề xuất

| Tài nguyên/thao tác | PT phụ trách | Học viên liên kết | Người khác |
| --- | --- | --- | --- |
| Hồ sơ cơ bản, báo cáo đã chia sẻ | Quản lý | Xem của mình; sửa thông tin được cho phép | Từ chối |
| Draft OCR, xác nhận báo cáo | Duyệt/xác nhận | Không tự xác nhận | Từ chối |
| Ghi chú nội bộ | Đọc/ghi | Không thấy | Từ chối |
| Target và bài đã giao | Quản lý | Xem và ghi kết quả được giao | Từ chối |
| Check-in/meal log | Xem, phản hồi | Tạo/xem của mình theo quy tắc | Từ chối |
| Chat và file | Thành viên cuộc trò chuyện | Thành viên cuộc trò chuyện | Từ chối |
| Lịch | Tạo, xử lý yêu cầu | Xem của mình, gửi/xác nhận yêu cầu | Từ chối |
| Session ledger | Xác nhận/điều chỉnh có audit | Xem phần của mình | Từ chối |

Admin vận hành không mặc nhiên được đọc sức khỏe/chat. Owner gym là phạm vi sau,
không mở rộng RLS trước. Khi ngắt liên kết, lưu giữ/xóa và quyền đọc lịch sử phải
được chốt; loại khỏi active relationship phải ngừng realtime/media mới theo chính
sách đó. Không có “quyền thấy mọi thứ” xuyên các PT không liên quan.

## 8. Giai đoạn và tiêu chí qua cổng

Ký hiệu B0–B8 là kế hoạch mới đề xuất, không đổi nhãn M0–M7 hay tự đóng issue cũ.
Không hứa ngày hoàn tất khi chưa đo effort và phụ thuộc provider/thiết bị. Các phần
độc lập có thể tiến triển mà không đợi benchmark OCR; không dùng dữ liệu thật để
né governance gate. Mỗi ticket chỉ là một lát cắt nhỏ có thể review và rollback.

| Giai đoạn | Công việc và đầu ra | Phụ thuộc | Tiêu chí hoàn thành |
| --- | --- | --- | --- |
| B0 — Chốt ranh giới | Brief cập nhật, bảng giữ/sửa/bỏ/để sau, số liệu baseline và log quyết định | Chủ sản phẩm duyệt phạm vi | Không còn mơ hồ vai trò/nền tảng; AI bữa ăn có quyết định hoặc đánh dấu riêng |
| B1 — Thiết kế trước khi code | Sơ đồ PT/học viên; prototype lịch→hồ sơ→chat và intake→review; hướng landing; data dictionary/model matrix; ADR mobile | B0 | Duyệt được luồng trên desktop và Android; schema draft/quyền đi cùng UI; không cần màu/ảnh thay thế quyết định nghiệp vụ |
| B2 — Nền dữ liệu và hợp đồng | Migration từng miền, mapping dữ liệu cũ, RLS/storage, validation, API mobile và audit | Phần B1 liên quan đã duyệt | Reset trên DB test dùng một lần và upgrade từ baseline đều qua; types khớp; isolation/rollback được kiểm tra |
| B3 — Tiếp nhận và InBody | Hồ sơ trước/sau kết nối; ảnh/PDF; draft đủ trường/model; đối chiếu từng vùng; sửa/xác nhận; history web | B2 body composition + B1 intake | Không tự lưu AI; reload đúng; không mất bản cũ; giữ manual fallback; benchmark có kết quả thật và nhãn phạm vi hỗ trợ |
| B4 — Chat, lịch và gói | Chat/media; lịch và yêu cầu; membership; completion/ledger; profile liên kết | B2 các miền tương ứng | Hai tài khoản đi trọn luồng; retry không nhân đôi; đổi/hủy/xung đột và phân quyền qua; tự tập không trừ buổi PT |
| B5 — Dinh dưỡng và giao bài | Target lịch sử, meal log nhiều bữa, phản hồi PT; assignment/log tùy chọn; quyết định nguồn bài tập | B3/B4 contract liên quan | Không bắt nhập giáo án; gói/bài cũ giữ lịch sử; nguồn nội dung được kiểm tra; AI bữa ăn chỉ bật nếu cổng riêng đạt |
| B6 — Android dùng thật | App hai vai trò, camera/PDF, deep link mời, auth, chat/lịch, thông báo phù hợp; gói cài thử | Spike B1; contract B2 và core B3/B4 | Cài và thử trên Android thật; session/reconnect/background không mất/nhân dữ liệu; trải nghiệm không chỉ chứng minh bằng DevTools |
| B7 — Landing/funnel và pilot | Landing đúng sản phẩm; proof synthetic; signup/join đúng vai trò; support/xóa; sự kiện đo tối thiểu; evidence release | Khả năng đã kiểm chứng B3–B6 | Không link chết/claim giả; acquisition→activation đi được; privacy gate và phê duyệt phát hành riêng |
| B8 — Sau pilot | iOS, chủ gym, cộng đồng/gamification, voice hoặc tự đặt lịch theo slots | Bằng chứng ưu tiên từ pilot | Mỗi phần có vấn đề, phạm vi, người duyệt và bằng chứng riêng |

Chi tiết nghiệm thu OCR nằm ở phụ lục. Không gọi B3 hoàn thành chỉ vì fake adapter
qua test. Không gọi B6 hoàn thành chỉ vì đã build APK; không gọi B7 hoàn thành chỉ
vì trang đẹp hoặc có banner trial.

### Các lát cắt triển khai nên tách

- B2: report schema/RLS và mapping cũ; appointment schema/RLS; ledger; chat là các
  ticket riêng, không gộp thành một migration khổng lồ.
- B3: nhập tay đầy đủ + review trước; parser PDF ảnh/text; adapter/benchmark và
  xác nhận nguyên tử là phần có thể review riêng. Luồng không phụ thuộc OCR vẫn dùng được.
- B4: lịch một lần; yêu cầu đổi; membership/ledger; chat và thẻ liên kết; lịch lặp.
- B6: spike một luồng auth→camera→review; shell/navigation; core parity; thiết bị và phân phối.

## 9. Lựa chọn mobile cần chứng minh

React Native/Expo là ứng viên đề xuất để đánh giá cho app có trải nghiệm riêng;
PWA/TWA và Capacitor là đối chứng theo công việc, không phải mặc định chọn cách
đóng gói nhanh nhất. Không scaffold app trong đợt lập kế hoạch.

Spike B1 kiểm tra: auth web/mobile cùng danh tính; session an toàn; ảnh/PDF; deep
link invitation; keyboard/safe area; chat realtime/reconnect; thông báo không lộ
nội dung sức khỏe; khả năng cài Android; chi phí bảo trì và đường lên iOS.

[Expo xác nhận](https://expo.dev/articles/testing-and-previewing/test-ios-app-without-mac)
có thể build iOS từ Windows qua macOS cloud. Đây là lựa chọn khả thi, không chứng
minh FitSync đã có app hay loại bỏ nhu cầu kiểm thử iPhone. Không chạy cloud build
hoặc cấp tài khoản trong đợt này.

ADR-003 cũ là đề xuất thiên về yêu cầu EXE201; giữ nguyên làm lịch sử. Nếu chọn
khác, viết ADR mới ghi căn cứ chủ sản phẩm đã đổi yêu cầu, không sửa lịch sử thành
“đã luôn chọn Expo”.

## 10. Thiết kế thương mại và dùng skills

Thiết kế theo việc thực: ít thao tác tạo lịch, hồ sơ dễ quét, báo cáo đủ chi tiết
khi mở sâu, trạng thái rõ và có xử lý lỗi. Không lấy landing trang trí làm mẫu cho
dashboard; không mặc định giữ hoặc bỏ Carbon trước khi có hướng được duyệt.

Prototype phải gồm empty/loading/error, invitation hết hạn, thiếu trường OCR,
provider lỗi, mạng yếu, đổi lịch đang chờ và không có dữ liệu vùng. Kiểm tra bàn
phím, focus, contrast, zoom, tiếng Việt, touch target và reduced motion.

[Bản đồ 25 skills](../skills/FITSYNC_SKILL_EXECUTION_MAP.md) quy định một lead cho
mỗi task, skill hỗ trợ có mục tiêu; không chạy nhiều bộ tạo design system cùng lúc.
Lead blueprint: create-prd. Phụ lục dữ liệu: supabase-postgres-best-practices; rà
ranh giới quyền và upload: security-review. Chưa chạy các engine thiết kế.

## 11. Cổng chất lượng, rủi ro và bằng chứng

- Schema: migration test mới + upgrade/backfill từ dữ liệu tổng hợp cũ; pgTAP,
  schema lint, types; PT A/B, trainee A/B, anonymous và service boundary.
- Core: unit cho quy tắc thực; lint/typecheck/build; Playwright desktop/tablet/phone;
  không hạ validation hay đổi test chỉ để qua.
- Race/retry: upload lại, xác nhận hai lần, slot trùng, session trừ hai lần, gửi chat
  offline/reconnect. Xác nhận quan trọng chạy trong transaction và có idempotency.
- Realtime/media: người ngoài không subscribe/fetch/sign file; ngắt liên kết xử lý
  theo chính sách; attachment không được coi là được phép chỉ vì biết URL.
- Mobile: camera/file picker thật, back/keyboard, nền→mở lại, hết phiên, deep link,
  mạng chậm và hai tài khoản. Web mobile giả lập chỉ là một phần bằng chứng.
- Privacy: synthetic mặc định; trước real data phải có owner, consent, provider
  processing, retention/deletion và incident handling theo gate dự án. Bản upload
  có thể chứa tên/ID; không đưa vào log, prompt debug, analytics hay video.
- Vận hành: phân môi trường, backup/restore rehearsal phù hợp dữ liệu test, migration
  rollback và kill switch provider; phát hành cần review và cho phép riêng.

Rủi ro lớn: scope rộng, provider không đọc tốt phần theo vùng, PT vẫn phải sửa quá
nhiều, học viên không chuyển khỏi Zalo, mobile tốn công bảo trì, nội dung bài tập
không có quyền sử dụng phù hợp. Giải bằng cổng nhỏ và bằng chứng, không bằng hứa
mọi tính năng sẽ có ngay. EXE201 và mục tiêu startup được theo dõi thành hai bảng.

## 12. Cách đo giá trị và điều còn mở

Đề xuất pilot nhỏ, ví dụ 3–5 PT có học viên tình nguyện sau governance gate; con số
và thời gian chưa chốt. So cùng việc trước/sau: intake+review, tìm ghi chú/bản đo,
đặt/đổi lịch, ghi nhận gói. Báo trung vị/phân bố thời gian, tỷ lệ lỗi, số lần chuyển
công cụ và phản hồi có ngữ cảnh; không chỉ đo OCR milliseconds hay lượt mở app.

Analytics chỉ metadata tối thiểu đã duyệt, không có chỉ số sức khỏe/nội dung chat.
Người trả tiền, giá và willingness-to-pay là thí nghiệm kinh doanh riêng.

| Cần chốt | Đề xuất mặc định để tiếp tục thiết kế | Trước khi nào cần quyết định |
| --- | --- | --- |
| AI bữa ăn trong lần thử đầu | Vẽ điểm mở rộng; gửi ảnh + phản hồi PT vẫn dùng được | Trước chốt phạm vi B5 |
| Máy/template đầu tiên | Bắt đầu khảo sát 270 hiện có và một mẫu có segmental fat; chọn theo nhu cầu pilot | B1 trước migration report cuối |
| Hủy/vắng/trừ buổi | Chỉ completed trừ; không tự phạt vắng | B1 lịch/ledger |
| Target và thông tin chia sẻ | PT nhập/duyệt; draft/ghi chú nội bộ không công khai | B1 quyền |
| Người dùng có nhiều PT | Giữ một PT phụ trách như baseline; đổi sang nhiều cần scope riêng | Trước relationship schema |
| iOS và chủ gym | Để sau Android/pilot | Sau bằng chứng B7 |

## 13. Gói công việc đầu tiên được đề xuất

**B1-A — thiết kế một vòng sử dụng hoàn chỉnh, chưa sửa app:** sơ đồ màn hình cho
hai vai trò; wireframe desktop/Android lịch→hồ sơ→chat và tiếp nhận→đối chiếu báo
cáo; ma trận quyền; danh mục trường và trạng thái lỗi; hướng landing liên quan.

Đầu ra review: người dùng thử đi được hai tình huống bằng prototype với dữ liệu
tổng hợp; thấy rõ trường nào cần nhập, ai xác nhận, dữ liệu nằm đâu và bước nào
chưa được hỗ trợ. B1-A không tạo migration, không tự chọn màu toàn sản phẩm,
không đăng ký provider, không scaffold mobile, không đổi docs kế hoạch đang active.

Sau khi duyệt blueprint, mỗi phần code được scope thành issue theo TEAM_PLAYBOOK,
nhánh tập trung và review độc lập. Không tự gán người từ tên thư mục máy; không
push main, không reset worktree hoặc động vào video đang làm.

## 14. Kiểm tra thực hiện cho bộ tài liệu này

Đã đọc brief, tài liệu alignment/skills và UI workflow, schema/validation/ADR liên
quan; đối chiếu tài liệu nhà sản xuất và mobile chính thức. Đã kiểm tra 25 SKILL.md
hiện diện và 374 file trong manifest đều khớp SHA-256, không thiếu/khác. Đây không
phải scan bảo mật mới. Chỉ thay đổi tài liệu được nêu trong lần bàn giao; không
chạy build/lint/unit/db/E2E trong lần viết blueprint. Kiểm tra 10 link nội bộ trong
bốn tài liệu đều trỏ tới file có thật; UTF-8 không có replacement character và
code fences cân bằng; `git diff --check` qua. Git status giữ các thay đổi có sẵn;
đợt này chỉ thêm ba tài liệu và cập nhật brief. Không coi kiểm tra link là kiểm
chứng tính năng hay xác nhận mọi URL ngoài sẽ luôn hoạt động.
