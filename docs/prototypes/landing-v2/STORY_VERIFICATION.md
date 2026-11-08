# Landing story — kiểm tra thực chạy

Ngày 2026-10-30. Phạm vi trang static local `http://127.0.0.1:3102/`.
Không suy ra chất lượng app Next.js, backend, OCR, quyền dữ liệu thật hoặc giá trị thị trường.

## Bằng chứng lượt này

Evidence local ignored: `.agents/audit/ui/2026-10-30-story-redesign/`.

- `verify.cjs`: **PASS, 28 nhóm kiểm tra**, 32 tổ hợp axe A/AA đã chọn ở
  1440/768/390/320px. Không confirmed violation hoặc horizontal page overflow.
  Giữ các axe incomplete trong `verification.json`; không nhận là chứng nhận WCAG.
- Ba cảnh và ghi chú nội bộ không xuất hiện trong phần hiển thị học viên;
  bấm liên tục không phục hồi cảnh cũ. Đây là kiểm tra presentation, không phải RLS.
- Playback chạy một lần, dừng, xem lại; reduced motion không animation và đổi cảnh
  được; không JS vẫn thấy hồ sơ PT, native details mở được.
- Đề nghị đổi lịch giữ 16:00 tới khi xác nhận; sau duyệt mọi reference lịch cập nhật
  16:30, mốc chuẩn bị thành 16:25. Không có buổi thật bị sửa hoặc trừ.
- Chat escape HTML bằng textContent; dialog Tab/Escape; tin giữ trong memory.
  Checkbox đối chiếu bắt buộc trước xác nhận mẫu; menu phone/FAQ, logo SVG,
  trang brand, ảnh minh họa load được; B1-A mở qua cùng server.
- Lượt chức năng có 0 pageerror, 0 request ngoài server local, 0 HTTP asset lỗi.
- `node --check` chạy cho `story.js`, `site.js`, `serve.cjs`: qua.
- Taste source lint 5 file index/site/story: 0 FAIL, 1 WARN `padStart(2,'0')`
  dùng đúng cho đồng hồ, không phải số thứ tự trang trí.
- Taste inspector `inspect-2/report.json` ở 1440/768/390: **0 FAIL, 3 WARN**.
  14 kích thước chữ; chỉ một ảnh (scanner không phân biệt ảnh AI với ảnh thật);
  không video. Không kéo video riêng hoặc thêm ảnh stock chỉ để qua scanner.
- Đã nhìn ảnh hero ở desktop/390/320, sheets desktop/tablet/mobile, ảnh người
  trên phone. Sửa mảnh giấy bị chồng trên phone thành các nguồn xếp dọc;
  phần đối chiếu nguồn/chat mở theo nhu cầu, không giảm cỡ chữ để nhét.
- Sau toàn bộ suite, sửa duy nhất crop ảnh desktop để giữ mặt hai nhân vật.
  `human-check.cjs`: kiểm lại overflow + axe của section ảnh tại cả bốn độ rộng,
  0 violation/overflow. Đã nhìn `human-final-1440.png`. Không báo suite toàn trang
  là được chạy lại sau thay đổi crop này.
- `git diff --check` qua; `git diff --name-only -- apps supabase` rỗng.
  Không reset, push, deploy, migration hoặc dùng dữ liệu/video riêng.

## Hạn chế còn lại

- Chromium desktop và viewport giả lập touch; chưa kiểm tra thiết bị Android/iPhone thật,
  Safari, screen reader thủ công hoặc người dùng PT. Không tự nhận conversion tốt hơn.
- Chưa có ảnh/footage PT thật được phép dùng; ảnh AI chỉ minh họa, caption rõ.
- Hướng brand/logo chưa phải tài sản đã được chủ sản phẩm duyệt hoặc tra cứu nhãn hiệu.
- Landing kể hướng sản phẩm, các tương tác chỉ chạy trong memory. Không có tích hợp
  tự nhập Zalo/Excel, OCR thật, APK hoặc chương trình trial mới.
- Ảnh trước sửa và bản source snapshot ở `before/` giữ để so sánh. Bản B1-A không đổi.
