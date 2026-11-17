# Canva presentation — Week 8/9

## Thiết kế cuối

- **Chỉnh sửa:** https://www.canva.com/d/JP90mzolqoYNL2Z
- **Xem:** https://www.canva.com/d/eLtBfcHX6CeHm7-
- **Design ID:** `DAHbJ4OqVNk`.
- 10 trang,1920×1080,16:9. Tạo mới từ HTML đã chuẩn bị, không ghi đè deck cũ.
- [Kịch bản](WEEK_08_09_SCRIPT.md), [outline](SLIDE_OUTLINE.md), [PDF](FitSync_Week_08_09.pdf), [HTML nguồn tự chứa](WEEK_08_09_CANVA_SOURCE.html).

## Kiểm tra

Đã đọc lại toàn bộ text qua Canva `fetch`, kiểm10page và dimensions. Đã tải và xem preview từng trang dưới dạng contact sheet, đối chiếu local render. Hai screenshot sản phẩm là PNG nguyên bản của nghiệm thu synthetic30/10; không có UI do AI dựng. Actual/giả định, nguồn/ngày, điều kiện ít nhất2kênh/20paid và quyết định dừng sau môn được giữ trên slide/notes.

PDF10trang, aspect16:9, được render từ cùng HTML nguồn và xem lại. Không gọi đây là export byte-for-byte từ Canva. PPTXexport không có trong connector hiện tại; không tạo tệp giả định dạng. Người dùng có thể xuất từ Canva nếu tài khoản hỗ trợ.

## Bản không dùng

`DAHbJhWCPpA` là bản AI draft đã bị QA loại: tự dựng giao diện/tên/số người dùng trong hình, gắn provenance không đúng và đổi “ít nhất” thành dấu “>”. Không dùng bản đó để báo cáo sản phẩm. Bản import đầu `DAHbJ7HKq3M` được thay bởi bản cuối vì caption slide3 chồng ảnh. Không xóa deck cũ hoặc lịch sử của nhóm.

APIget-design/get-design-content/start-editing-transaction báo toolnotfound; dùng fetch và per-page previews thay thế. Browserhost không khả dụng và nativeapp approval timeout; không còn phụ thuộc UI đó để kiểm nội dung cuối. Không tạo quyền chia sẻ công khai mới trong lượt này.
