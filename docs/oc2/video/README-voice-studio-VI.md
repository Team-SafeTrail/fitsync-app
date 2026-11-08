# Phòng thu thuyết minh FitSync

Mở **http://127.0.0.1:3117** bằng Chrome trên chính máy đang chạy dự án. Giao diện, kịch bản và thông báo đều bằng tiếng Việt. Không cần tài khoản hay dịch vụ ghi âm trực tuyến.

## Cách nhanh nhất

1. Chọn **Thu toàn bài · nhanh nhất**. Bấm **Bắt đầu thu toàn bài**, cho phép micro nếu trình duyệt hỏi.
2. Chờ đếm 3–2–1 rồi đọc theo chữ được tô sáng. Video hình chạy bên cạnh. Nên đeo tai nghe và ngồi ở nơi yên tĩnh.
3. Đọc hết câu cuối, bấm **Dừng & lưu**. Không cần dừng gấp theo đồng hồ; chương trình không cắt lời đang nói.
4. Bản gốc được lưu, âm thanh được lọc nhẹ và cân mức. Với bản thu đủ dài, tùy chọn **Tự xuất khi thu đủ** sẽ ghép giọng, nhạc nhỏ và video. Nếu chưa tự xuất, nghe lại rồi bấm **Xuất MP4**.
5. Bấm **Xem bản xuất**, xem hết video rồi **Tải MP4**. Công cụ không tự gửi bài hoặc đăng video.

Nhạc nền mặc định 4%, tự giảm dưới giọng đọc. Có thể tắt nhạc hoặc tắt lọc âm để nghe/ghép bản gốc. Nhạc là bản hòa âm nhẹ được tạo bằng chương trình cho công cụ này, không lấy từ bài hát thương mại. Không tạo giọng đọc nhân tạo.

## Nếu đọc vấp hoặc khó khớp hình

Chọn **Thu từng đoạn · dễ thu lại**. Bấm từng mục bên trái, thu và nghe lại; bản cũ vẫn được giữ. Sau khi đủ 9 đoạn, xuất MP4. Mỗi đoạn giọng được ghép đúng cảnh tương ứng. Nếu đọc dài hơn cảnh, hình ở trạng thái cuối được giữ thêm; giọng không bị tăng tốc hoặc đổi cao độ. Tổng video không vượt 5 phút; bản quá dài cần thu lại.

Trong chế độ toàn bài, nhịp chữ giữ ở mức tự nhiên để bám video 3:55. Trong chế độ từng đoạn, có thể chọn nhịp chậm hơn. Cỡ chữ chỉnh bằng thanh trượt. **Chạy thử chữ** không ghi âm. **Sửa lời** lưu thay đổi riêng trên máy; giữ nội dung đúng với hình và tính năng đã quay.

## Nội dung lời đọc

Kịch bản gồm 9 đoạn khớp bản dựng hiện tại: giới thiệu, đội ngũ, PT Workspace, hồ sơ/lời mời, check-in/ảnh, InBody, PT xem hoạt động, phân quyền và ERD/kết thúc. Lời đọc không lặp cụm “dữ liệu ảo”, không tuyên bố khách hàng/doanh thu thật, không nói OCR đã hoàn thiện. Một câu mở đầu nói rõ hồ sơ được chuẩn bị riêng cho phần trình diễn. Nhãn trạng thái trên video gốc được giữ.

Đoạn phân quyền chỉ mô tả PT bị chặn khỏi `/admin`; không mô tả các bảng admin chưa quay. Đoạn hoạt động nói rõ học viên mới chưa phát sinh cảnh báo không check-in. Đây vẫn là bản dựng có những giới hạn đã ghi trong feature-readiness-check.md, không tự trở thành bản nghiệm thu đủ mọi yêu cầu chỉ vì đã ghép giọng.

## Mở lại phòng thu

Từ thư mục dự án, chạy PowerShell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/video/studio/start-studio.ps1
```

Hoặc dùng Node 22+:

```powershell
node scripts/video/studio/server.mjs --port 3117
```

Công cụ dùng FFmpeg/FFprobe có sẵn trên PATH hoặc bộ portable hiện có trong `D:/CodexArtifacts/fitsync-video-tools`. Có thể chỉ định đường dẫn bằng biến `FFMPEG` và `FFPROBE`. Không thay đổi Next.js hay Supabase.

## Tệp được lưu

- Lời đọc mặc định: `scripts/video/studio/script-vi.json`.
- Bản thu gốc, WAV đã lọc, lựa chọn và lời chỉnh riêng: `outputs/video/production-draft-02/voice-studio/`.
- MP4 có giọng: `voice-studio/renders/<lần-xuất>/FitSync-Product-Walkthrough-voiceover.mp4`.
- Mỗi lần thu/xuất được giữ riêng. Tất cả bản thu và đầu ra nằm trong vùng đã được Git bỏ qua.

Ứng dụng chỉ lắng nghe trên loopback của máy này. Âm thanh không được gửi sang dịch vụ khác. Cấp quyền micro là thao tác của bạn trong Chrome. Kiểm thử tự động dùng thiết bị âm thanh giả trong thư mục riêng, không đưa âm thử vào bản thu của bạn và không tạo lời thuyết minh thay bạn.
