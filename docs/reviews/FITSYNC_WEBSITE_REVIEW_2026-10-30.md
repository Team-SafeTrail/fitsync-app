# FitSync — review website theo blueprint sản phẩm

Ngày: 2026-10-30. Checkout: `e1b03ad`, nhánh `codex/fitsync-startup-skills`.
Phương pháp: **Impeccable audit**, detector mã nguồn + Chromium/axe + đọc code.
Đây không phải workflow Impeccable critique hai đánh giá độc lập hoặc nghiên cứu
người dùng. Chưa sửa giao diện, tính năng hoặc database.

## 1. Kết luận và giới hạn

Website chưa sẵn sàng làm trải nghiệm thương mại theo blueprint vừa thống nhất.
Hai nguyên nhân khác nhau: có lỗi sử dụng/thông điệp ngay trong bản hiện tại; và
sản phẩm hiện chưa có những luồng chính của hướng mới. Cần xử lý cả hai, không chỉ
đổi màu hoặc làm landing đẹp hơn.

Kết luận mạnh nhất từ review: sản phẩm đang xoay quanh roster, lời mời và xác nhận
InBody, trong khi hướng chủ sản phẩm muốn xoay quanh hồ sơ có ngữ cảnh, lịch và
trao đổi liên tục với học viên. Đây là khoảng cách sản phẩm, không phải toàn bộ là
bug của milestone cũ.

| Phạm vi | Bằng chứng lần này | Giới hạn |
| --- | --- | --- |
| 10 routes × 4 widths | 40 lượt mở ở 1440, 768, 390, 320 CSS px | Chromium headless; không phải thiết bị Android thật |
| Landing, tour PT/học viên, đăng ký | 8 lần chạy axe ở desktop/phone; screenshots | Có kiểm tra incomplete cần đọc thủ công; không chứng nhận WCAG đầy đủ |
| Dialog và sidebar thu gọn | 4 lần axe dialog, 1 lần sidebar; Tab/Escape trực tiếp | Không chạy screen reader hoặc bàn phím mobile thật |
| Responsive | Layout, kích thước, ảnh; kéo bảng bằng CDP touch | Gesture được tổng hợp trên Chromium, không chứng minh native app |
| Funnel | CTA hero → register; trạng thái chưa cấu hình; link APK; link hỗ trợ | Không tạo tài khoản, không gửi email/tin nhắn |
| Protected workspace/admin | Xác minh redirect khi chưa đăng nhập; đọc source | Không mở được runtime có đăng nhập vì không có cấu hình Supabase |
| InBody/database | Đối chiếu code/contract đã khảo sát với blueprint | Không chạy migration/pgTAP hoặc đọc dữ liệu riêng |
| Hiệu năng | Đọc cấu trúc/assets/CSS trong audit | Dev server; chưa có production profile/CWV/bundle benchmark |

Các routes: `/`, `/app/dashboard`, `/app/trainee`, `/register`, `/login`,
`/workspace`, `/admin`, `/invite/invalid`, `/privacy`, `/terms`.

Không phát hiện JavaScript pageerror ở 40 lượt mở. Điều này không xác nhận các
luồng ghi dữ liệu. `SUPABASE_URL`, publishable key và service-role đều không có
trong môi trường được kiểm tra; chỉ ghi boolean, không in secret.

## 2. Đánh giá kỹ thuật theo skill

Chấm trên phần public thực sự xem được, mang tính định hướng review; không phải
điểm toàn sản phẩm. Không tính điểm tổng khi hiệu năng chưa có bằng chứng phù hợp.

| Chiều kiểm tra | Điểm /4 | Căn cứ |
| --- | --- | --- |
| Accessibility | 1 | Contrast thấp; dialog focus/Escape; tên điều khiển mất khi collapse; skip link sai |
| Performance | Chưa chấm | Không suy ra tốc độ production từ dev server hoặc chỉ từ detector |
| Theming | 2 | Có token nền, nhưng team/contact/admin và radius có drift đáng kể |
| Responsive | 2 | Có layout mobile; bảng kéo được; contact tràn ở 320; chữ và thao tác nhỏ |
| Implementation integrity | 1 | Claim APK/hỗ trợ/quyền riêng tư không nhất quán; tour và core chênh chức năng |

**Integrity verdict: chưa đạt cho việc giới thiệu như dịch vụ thương mại hoàn chỉnh.**
Điểm này không có nghĩa phải bỏ mọi code hoặc đổi toàn bộ palette.

## 3. Vấn đề hiện tại, có bằng chứng

Ký hiệu: **R** = quan sát runtime mới; **S** = đọc source, chưa tái hiện trong
workspace đăng nhập. P1 = nên xử lý trước phát hành; P2 = xử lý trong lượt UX/UI.
Không ghi nhận P0 toàn hệ thống; môi trường thiếu Supabase được ghi riêng.

### F01 — P1 — Quảng bá app Android nhưng link tải trả 404 [R+S]

- Vị trí: [ContactAndAppSection](../../apps/web/src/components/landing/ContactAndAppSection.tsx), dòng 252–295.
- Quan sát: mục Android mô tả Expo EAS, Android 8+, ~24 MB, SecureStore và đồng bộ;
  GET `/downloads/fitsync-v0.1.0-alpha.apk` trả 404.
- Ảnh hưởng: người dùng làm theo hành động nổi bật rồi không có kết quả; khó tin
  các tuyên bố còn lại. Lần kiểm tra chỉ kết luận local, không suy diễn URL production.
- Đề xuất: trình bày Android theo trạng thái thật; chỉ bật tải khi có build đã thử.
- Nghiệm thu: CTA đi đúng bản tải dùng được hoặc trạng thái chưa phát hành rõ ràng;
  không quảng cáo khả năng thiết bị chưa kiểm chứng.

### F02 — P1 — Kênh hỗ trợ không đúng nhãn và cam kết chưa có bằng chứng [R+S]

- Vị trí: cùng component, dòng 30, 86, 185.
- Nhãn “Zalo Official Account” dẫn tới `https://zalo.me`, không tới một account cụ
  thể. Trang hứa hỗ trợ 24/7, còn hotline ghi 08:00–22:00 và có cam kết 30 phút.
- Ảnh hưởng: không biết liên hệ đâu hoặc lúc nào được phục vụ. Không gọi điện/gửi
  tin hoặc kiểm tra hộp thư trong review; không kết luận số/email giả chỉ từ hình thức.
- Đề xuất: một kênh được xác nhận hoạt động, giờ hỗ trợ thống nhất; bỏ SLA chưa có
  bằng chứng vận hành. Nghiệm thu bằng đích liên hệ đúng, không chỉ href có tồn tại.

### F03 — P1 — Thông điệp quyền riêng tư không thống nhất với mô hình [R+S]

- [FeaturesSection](../../apps/web/src/components/landing/FeaturesSection.tsx):87
  nói “Chỉ mình bạn thấy”, trong khi PT phụ trách có quyền xem bản ghi học viên.
- [Privacy page](../../apps/web/src/app/privacy/page.tsx):28 mô tả bản mẫu chưa tạo
  tài khoản; summary chỉ giới hạn chính sách ở nguyên mẫu. Landing lại mời tạo
  workspace thật, code có signup và xử lý dữ liệu đã xác nhận.
- Ảnh hưởng: người dùng khó hiểu ai thấy dữ liệu và chính sách áp dụng phần nào.
  Đây là finding về nội dung/phạm vi, không phải phát hiện rò rỉ hoặc kết luận pháp lý.
- Đề xuất: nói đúng quyền của học viên và PT, tách tour khỏi tài khoản thật; chuẩn
  bị chính sách/consent/support theo governance gate trước dữ liệu thật.

### F04 — P1 — Chữ phụ có contrast thấp trên nhiều màn [R]

- axe-core 4.13.0: trên desktop, landing có 4 nodes lỗi contrast, PT tour 50,
  trainee tour 16, register 1. Phone 390 lần lượt 4, 35, 15, 1. Đây là số nodes
  theo từng lần quét, không cộng thành số lỗi độc lập hoặc toàn bộ website.
- Ví dụ: `#5c5a55` trên `#18181d` đạt khoảng 2.56:1 cho chữ 11px; contact
  `#64748b` trên `#151921` khoảng 3.69:1; axe yêu cầu 4.5:1 cho các mẫu này.
- Vị trí: [globals.css](../../apps/web/src/app/globals.css),
  [auth.css](../../apps/web/src/app/auth.css), contact và các class text-muted.
- Ảnh hưởng: nhãn, hướng dẫn và trạng thái khó đọc, nhất là trên điện thoại.
- Đề xuất: token chữ phụ đủ tương phản, kiểm tra trên nền thực; giữ semantic màu.
- Nghiệm thu: không còn confirmed contrast violation trong tập màn/state kiểm tra;
  các incomplete được rà thủ công, không coi 0 automated violation là đạt toàn bộ a11y.

### F05 — P1 — Dialog thiếu quản lý focus và Escape [R+S]

- [Scan modal](../../apps/web/src/app/app/dashboard/page.tsx):515 và
  [Meal modal](../../apps/web/src/app/app/trainee/page.tsx):386 đã có role/aria-modal.
  Tuy nhiên, mở dialog giữ focus ở nút ngoài; Tab đi ra nội dung nền. Escape từ
  ô nhập không đóng vì handler chỉ ở overlay.
- Ảnh hưởng: người dùng bàn phím đi vào vùng bị che và mất ngữ cảnh thao tác.
- Đề xuất: primitive dialog đúng chuẩn, focus vào lúc mở, giới hạn Tab, Escape ở
  cấp dialog và trả focus về trigger; giữ nút đóng có tên.
- Nghiệm thu: chuỗi open → nhập → Tab/Shift+Tab → Escape → focus return qua test;
  thêm kiểm tra bàn phím/scroll trên phone, không chỉ role attributes.

### F06 — P1 — Sidebar collapse làm mất tên truy cập [R+S]

- [AppSidebar](../../apps/web/src/components/app/AppSidebar.tsx):29–84.
- Collapse ẩn toàn bộ text của ba link và nút mở lại; không có aria-label/title
  tương ứng. axe xác nhận 3 link-name và 1 button-name violation ở trạng thái này.
- Đề xuất: giữ accessible name khi ẩn text, thêm trạng thái expanded và tooltip
  phù hợp. Nghiệm thu cả mở và thu gọn, không chỉ trạng thái mặc định.

### F07 — P1 — Skip link không có đích ở hai tour [R+S]

- [Root layout](../../apps/web/src/app/layout.tsx):55 liên kết `#main-content`;
  [Tour layout](../../apps/web/src/app/app/layout.tsx):38 có main nhưng thiếu id.
- Runtime xác nhận đích không tồn tại ở cả `/app/dashboard` và `/app/trainee`.
- Đề xuất: đích main đúng và nhận focus hợp lý; nghiệm thu skip link bằng bàn phím.

### F08 — P2 — Contact card tràn ở viewport 320 dù page không có scrollbar [R+S]

- Contact line 37: `minmax(320px, 1fr)` trong vùng chỉ rộng 272px.
- Đo thực: card bắt đầu x=24, kết thúc x=344 trong viewport 320. Screenshot thể
  hiện phần phải bị cắt. `document.scrollWidth <= innerWidth` vẫn true.
- Ảnh hưởng: kiểm tra chỉ “không overflow trang” bỏ sót clipping nội dung con.
- Đề xuất: min-width co được theo container; kiểm tra bounding box và CTA/text
  ở 320/360/390, zoom/reflow. Không chỉ thêm overflow hidden để làm test qua.

### F09 — P2 — Product proof trên mobile có nhiều chữ 7–10px [R+S]

- [ProductPreview](../../apps/web/src/components/landing/ProductPreview.tsx) và
  [landing.css](../../apps/web/src/app/landing.css).
- Runtime 390 đo “đã xác minh”, “trong roster” 7px, “Dữ liệu mẫu” 8px. Preview
  thể hiện cả dashboard thu nhỏ nên đủ chi tiết nhưng khó đọc làm bằng chứng.
- Đề xuất: chọn một tình huống và chỉ số quan trọng cho phone, có cách xem lớn;
  không thu nhỏ nguyên dashboard để vừa cột. Đây là finding usability, không
  tự gán mọi cỡ chữ dưới 12px thành lỗi WCAG.

### F10 — P2 — Các phần landing dùng ngôn ngữ thị giác khác nhau [R+S]

- Hero dùng amber/anthracite, phần team/contact chuyển orange `#FF6B00`, nền
  `#151921`, icon xanh, nhiều radius và inline style riêng.
- Detector hỗ trợ nhận diện drift, nhưng không có nghĩa màu ngoài DESIGN.md đều sai.
- Đề xuất: chọn hướng đã được duyệt rồi gom token/type/spacing; có hierarchy riêng
  cho marketing và workspace. Không đổi palette chỉ vì detector có cảnh báo.

### F11 — P2 — Ngôn ngữ và thao tác mobile chưa nhất quán [R+S]

- Tour trộn “Smart PT Hub”, “Client Roster”, “Prescribed by”, “Log Lunch” với tiếng
  Việt; đối tượng landing lại là PT Việt. Một số control cao 28–40px.
- Bảng trên phone rộng 791px trong vùng 356px, cần kéo ngang. CDP touch thực sự
  đổi scrollLeft 0→243: kéo **có hoạt động**, không phải lỗi mất cột không truy cập.
- Đề xuất: nhãn tiếng Việt thống nhất; ưu tiên danh sách gọn/hồ sơ cho tác vụ mobile,
  giữ bảng sâu khi cần. Tăng các target thao tác thường xuyên; dưới 44px không tự
  động đồng nghĩa vi phạm WCAG 2.5.8 vì còn kích thước tối thiểu và ngoại lệ spacing.

### F12 — P1 — Chưa có đường khôi phục mật khẩu [S]

- [AuthForm](../../apps/web/src/components/auth/AuthForm.tsx):18–21 chỉ có nhập và
  chuyển login/register; tìm trong auth/login không có flow recovery.
- Ảnh hưởng: tài khoản quên mật khẩu không có đường tự phục hồi trong sản phẩm.
- Đề xuất: recovery có hướng dẫn, expired/error state và return path. Chưa chạy
  mail/OTP hoặc xác nhận provider email trong review này.

### F13 — P1 — Chưa có đường khôi phục lời mời sau mất link/hết hạn [S]

- [Workspace actions](../../apps/web/src/features/workspace/actions.ts):69 chỉ
  hiển thị token một lần, đúng về mặt lưu hash. Form hiện không có reissue/revoke.
  Tạo trùng email có thông báo yêu cầu dùng/thu hồi lời mời, nhưng chưa thấy UI đó.
- Ảnh hưởng: PT reload trước khi gửi hoặc học viên nhận lời mời hết hạn phải tìm
  cách ngoài luồng. Không cần giải bằng lưu raw token lâu dài.
- Đề xuất: thu hồi và tạo link mới có giới hạn, audit và vô hiệu link cũ; test cả
  link bị dùng lại/hết hạn. Cần tái hiện với synthetic backend trước sửa.

### F14 — P2 — Nhãn nguồn bản ghi luôn là “Nhập thủ công” [S]

- [InBodyRecordCard](../../apps/web/src/components/workspace/InBodyRecordCard.tsx):32
  không đọc `record.source`, trong khi contract có manual/ocr.
- Ảnh hưởng: khi có bản ghi OCR đã duyệt, giao diện mô tả nguồn không đúng, khó
  phân biệt nguồn máy/nhập tay/chỉnh sửa PT.
- Đề xuất: mapping nguồn và trạng thái duyệt riêng, không tự đổi OCR thành manual
  chỉ vì PT sửa một trường; test card với từng source trước khi kết luận runtime.

**Tổng finding hiện tại: 14, gồm 9 P1 và 5 P2.** Một số P1 chỉ dựa source đã được
đánh dấu, cần backend test để xác nhận tác động cụ thể. Không có số lượng P0 giả.

## 4. Khoảng cách với ý tưởng mới, không gộp vào số bug

| Gap | Mong muốn đã nghe | Hiện trạng đọc từ code | Quyết định cần thiết kế |
| --- | --- | --- | --- |
| G01 | Lịch và chat nằm trong hồ sơ | Workspace nav chủ yếu roster và tour; không có lịch/chat | Navigation hai vai trò và hai luồng chính của B1-A |
| G02 | PT tiếp nhận và nhập báo cáo thuận tiện | Form cần email, hồ sơ chưa liên kết thì ẩn InBody; server cũng chặn | Cho phép intake trước kết nối nếu có quyền xử lý; không chỉ bỏ guard UI |
| G03 | Dữ liệu báo cáo đầy đủ, theo vùng | OcrMetrics chỉ năm trường, ảnh JPEG/PNG/WebP; default provider unavailable | Contract/schema + review từng vùng và PDF theo phụ lục blueprint |
| G04 | Membership theo ngày; buổi PT có lịch sử | Form chỉnh trực tiếp remaining_sessions; chưa có date range/ledger | Tách thời hạn, check-in tự tập, appointment và completion ledger |
| G05 | Học viên xem việc hôm nay và trao đổi | Trang thật ưu tiên check-in/history/records; nhật ký bữa ăn nhiều bữa ở tour | Hôm nay/lịch/chat/target phù hợp; không trình bày tour như khả năng đã phát hành |

Landing hiện kể luồng “tạo hồ sơ → mời → 5 chỉ số”. Không thay copy để hứa lịch,
chat và report đầy đủ trước khi xây xong. Thiết kế thông điệp mới cùng prototype;
public copy chỉ lên theo capability đã kiểm chứng. Phần team/MSSV/EXE201 có thể
được giữ như thông tin đội ngũ nhưng không nên đứng thay bằng chứng giá trị cho PT.

## 5. Những điểm nên giữ

- CTA hero đăng ký thật và tour phụ được tách rõ; đã click xác nhận đích `/register`.
- Có nhãn tour/dữ liệu mẫu và cảnh báo OCR mô phỏng. Không gọi tour có trạng thái
  trong bộ nhớ là mất dữ liệu thật khi reload.
- Landing vẫn có tiêu đề và link đăng ký khi tắt JavaScript. Reduced motion thử
  ở hero cho opacity 1, không che nội dung.
- Có token, semantic structure và nhiều label. Các lỗi a11y cụ thể có thể sửa
  tập trung, không cần xóa toàn bộ hệ thống UI.
- Source workspace kiểm tra danh tính, ownership và PT xác nhận; review không đề
  nghị nới RLS, bỏ validation hoặc tự ghi dữ liệu OCR.

## 6. Detector: điều gì đã và chưa được xác nhận

Đã hash binary cached 0.1.17 đối chiếu manifest: khớp. `impeccable context` chạy
được và đọc DESIGN.md; báo thiếu PRODUCT.md/surface brief. Không tạo tài liệu hoặc
sửa drift như tác dụng phụ. Brief/blueprint hiện có cung cấp ngữ cảnh review.

Source detector chạy một lần trên `apps/web/src`, exit 2 = có findings:

| Rule | Số cảnh báo |
| --- | ---: |
| design-system-color | 416 |
| design-system-radius | 32 |
| bounce-easing | 1 |
| side-tab | 1 |
| Tổng | 450 |

Đây là **450 tín hiệu máy, không phải 450 lỗi đã xác nhận**. Nhiều rgba/tonal màu
và radius chưa khai báo có thể là lựa chọn cố ý hoặc documentation drift. Chỉ
nhóm khác biệt team/contact được xác nhận qua rendered view thành F10. Vạch nhấn
scope “core” có ý nghĩa trạng thái, không coi riêng rule side-tab là lỗi. Bounce
toast chưa được đánh giá tác động đủ để nâng thành một finding độc lập.

Không có browser overlay Impeccable hoặc visible browser được trình cho người dùng.
Browser evidence được tạo bằng Playwright headless; axe được inject trong tab
test riêng. Không gọi đây là live overlay. Không chạy live-server/hook của skill.

False positives/giới hạn đã xử lý: scroller bảng là có chủ ý và kéo được; screenshot
dialog chụp giữa animation được chụp lại khi opacity=1, không kết luận dialog trong
suốt; các decorative overhang không được tính là clipping text; skip-link 1px khi
chưa focus không được tính là target quá nhỏ.

## 7. Thứ tự xử lý đề xuất, chưa thực thi

| Đợt | Phạm vi | Output và tiêu chí |
| --- | --- | --- |
| R-A — Độ tin cậy và a11y | F01–F07 | Claim/đích đúng, contrast, keyboard dialog/sidebar/skip-link qua lại trên screens đã kiểm tra |
| R-B — Luồng sản phẩm | G01–G05, F12–F14 | B1-A prototype + quyền + field mapping, gồm intake trước kết nối và recovery; duyệt trước schema/UI mới |
| R-C — Visual và mobile | F08–F11 | Hệ token/hierarchy thống nhất, proof đọc được, 320–tablet–desktop; không thu nhỏ dashboard để thay UX |
| R-D — Verification | Các phần được duyệt sửa | Rerun audit theo state, bổ sung authenticated/browser/db/device checks theo thay đổi |

Workflow skills tương ứng: `$impeccable clarify` cho nội dung; `$impeccable harden`
cho trạng thái/recovery và primitive; `$impeccable adapt` cho narrow layout;
`$impeccable typeset`/`colorize` cho chữ và token. Thiết kế luồng mới theo B1-A dùng
lead đã thống nhất trong skill map. `$impeccable polish` là lượt cuối sau khi core
đã đúng; chạy lại `$impeccable audit` để đối chiếu. Đây là đề xuất workflow, không
gọi lệnh sửa trong review này. Có thể chọn từng đợt hoặc đổi thứ tự theo ưu tiên.

Không khuyên đổi toàn bộ visual ngay trước khi thống nhất lịch/hồ sơ/chat. Những
claim sai/link chết và a11y cụ thể là nhóm sửa độc lập được khi có task cho phép.

## 8. Bằng chứng và kiểm tra đã thực hiện

Evidence local (ignored): `.agents/audit/ui/2026-10-30-website-review/`:
`detector.json`, `browser-audit.json`, `interaction-audit.json`,
`verification-audit.json`, `funnel-audit.json`, scripts và screenshots.

Ảnh quan trọng: landing-hero-desktop/mobile; 390-contact-app; 320-contact-app;
768-app-dashboard; scan/meal-dialog-settled-1440/390. Không capture token, mật khẩu,
signed URL hoặc dữ liệu thật; tour dùng fixture. Không chép ảnh video đang làm.

Thực chạy: 40 route/viewport checks; 8 axe baseline + 4 dialog + 1 collapsed state;
keyboard/focus/Escape; một gesture touch tổng hợp; no-JS/reduced-motion tại landing;
APK GET và CTA. Không chạy unit/lint/build, pgTAP, auth E2E, screen reader, Android
thật hoặc production performance trong lượt review này. Những kết quả cũ trong
handoff không được tính vào báo cáo mới.

Chỉ thêm báo cáo và evidence ignored. Không sửa source, database, skills, DESIGN.md
hoặc blueprint. Server local cổng 3100 chỉ phục vụ review; dừng trước bàn giao.
