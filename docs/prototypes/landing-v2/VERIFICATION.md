# Landing V2 — kiểm tra thực chạy

> Lịch sử lượt brand trước. Bản story hiện tại xem [STORY_VERIFICATION.md](STORY_VERIFICATION.md).

Ngày 2026-10-30. Chỉ thư mục `docs/prototypes/landing-v2/`, trang static local.
Evidence ignored: `.agents/audit/ui/2026-10-30-brand-redesign/`.

## Kết quả

- `node --check site.js` và `serve.cjs`: qua.
- Playwright Chromium: 23 nhóm kiểm tra qua. Bao gồm đề nghị lịch giữ giờ cũ và
  duyệt cập nhật mọi chỗ; ba hero views; chat dùng textContent và không thực thi
  payload HTML; dialog Tab/Escape; checkbox trước xác nhận; menu phone; ba asset
  logo; mở B1-A qua cùng server; reduced motion; nội dung đọc được khi JS tắt;
  lề các frame đối xứng ở 1440px.
- 20 tổ hợp axe A/AA đã chọn: hồ sơ/lịch/tiến triển/FAQ mở/trang brand ở
  1440/768/390/320. Không confirmed violation, không page overflow. Các mục
  axe incomplete được giữ trong evidence; không nhận là đạt toàn bộ WCAG.
- Trong lượt chức năng: 0 pageerror, 0 request ngoài server local và 0 asset HTTP lỗi.
- Font Be Vietnam Pro được browser nhận diện là font đang render; không phải
  system fallback. Bốn file tự host tổng 492.164 byte, license SIL OFL đi kèm.
- Taste source lint index/site.css/site.js: 0 finding. Đây là scanner quy tắc
  thiết kế, không phải ESLint hoặc security review đầy đủ.
- Taste browser inspector tại 1440/768/390: 0 FAIL, 4 WARN giữ có giải thích dưới đây.
  Đã mở các ảnh fold và page sheets ở cả ba độ rộng, ảnh brand desktop/mobile.
- `git diff --check` qua; `git diff --name-only -- apps supabase` không có thay đổi.

## Những lỗi phát hiện và đã sửa

- Animation opacity gây chữ/nút giảm contrast lúc xuất hiện. Đổi thành transform
  nhẹ, giữ màu và độ rõ xuyên suốt, rồi chạy lại đầy đủ 23 nhóm/20 trạng thái.
  Không chỉ đợi animation xong để che lỗi trong test.
- Label preview quá nhỏ trên phone: rút ngắn tên control và nâng lên 13px.
- Phiếu/draft trên phone được xếp dọc thay vì giảm chữ để nhét hai cột.
- Calendar minh họa ban đầu đặt card theo tọa độ trang trí có thể hiểu sai ngày/giờ.
  Đổi sang agenda của ngày đang chọn, thời gian và loại buổi nằm ngay trong từng
  dòng. Kiểm tra lại toàn bộ reference đổi giờ và các độ rộng.
- Dấu tick được vẽ SVG, không dùng ký tự emoji làm icon.

## Bốn WARN còn lại của Taste

1. `size-count`: đếm cả size UI trong năm fragment. Giữ phân cấp marketing và
   interface riêng; không thu mọi số/nhãn UI về năm size của trang marketing.
2. `no-real-pictures`: không có ảnh người/phòng tập. Hình ảnh chủ đạo là năm
   fragment HTML/SVG do FitSync dựng mới, không dùng ảnh stock giả làm khách hàng.
3. `no-footage`: không có footage phù hợp đã duyệt. Không dùng video riêng đang
   làm trong repo hoặc dựng video giả để đủ quota; trang có chuyển động nhẹ và
   thao tác có công dụng.
4. `off-centre`: detector đo mép text trong CTA thành 80/108px. Browser kiểm tra
   bounding box của mọi `.wrap` có hai lề bằng nhau ở 1440px; phần chênh là padding
   bên trong nút, không phải frame lệch. Không dùng `--allow` để bỏ finding này.

Không có rule exception qua `--allow` ở lượt inspector cuối. WARN không phải
lỗi sử dụng đã được chứng minh; cũng không tuyên bố bộ máy đã chứng nhận thiết kế đẹp.

## Giới hạn

Không chạy build/typecheck/lint/test DB hoặc authenticated E2E của app Next.js,
vì không sửa app hoặc DB. Không thử thiết bị Android/iPhone thật, screen reader,
SEO index, production analytics/performance, nhãn hiệu, provider OCR hoặc pilot PT.
Đây là thiết kế mới để chủ sản phẩm duyệt, chưa phải phát hành tính năng.

Server local 3102 được để chạy để xem; không publish/deploy. Dừng đúng PID listener
3102 sau khi kiểm tra command line `docs/prototypes/landing-v2/serve.cjs`.
