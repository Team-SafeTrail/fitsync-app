# Increment landing + core tra cứu/tiến trình

2026-10-30. Owner yêu cầu làm từng phần, landing ưu tiên visual, core PT/học viên gồm cả layout và chức năng. Lead frontend-design; React và security-review dùng có mục tiêu cho code/input.

## Đã thực hiện

- Landing: hero nói rõ hồ sơ/số đo/cập nhật, intake ba minh họa với mô tả ngắn; bảng capability qua native disclosure, giữ toàn bộ thông tin và nghiên cứu. Đổi thuật ngữ kỹ thuật trong phần giới thiệu thành trạng thái sử dụng. Fix focus trap sheet để bao gồm select.
- Workspace PT thật: GET search theo tên không dấu/số điện thoại; filter cần theo dõi check-in hoặc chưa kết nối; count và no-results/reset. Lọc tập dữ liệu từ getPtRoster hiện có sau viewer guard/RLS, không tạo endpoint, không đổi auth/query/db. Tìm kiếm nằm trong URL, không cài analytics hoặc logging; cần cân nhắc chuyển sang local-state khi remake điều hướng/riêng tư hoàn chỉnh.
- Workspace học viên và hồ sơ PT: ProgressHistory từ records hiện có; tám lần đo gần nhất theo thời gian; mới một lần không vẽ trend, chưa có thì không bịa số. Zero baseline, dates/units và bảng accessible có vùng cuộn riêng. Không gọi giảm cân là thành công, không tạo mục tiêu hay dữ liệu segmental chưa có.

## Bằng chứng lần này

- Explicit tsc PASS; Next14 production build PASS (gồm type/lint), không warnings lint. Installed Next14 thiếu node_modules/next/dist/docs, giữ API Next14 hiện có; không nâng dependency.
- Vitest 36 tests / 4 files PASS, gồm 3 tests mới về absent/one/latest-eight chronological/non-mutating progress data. Lần đầu thử component SSR bị cấu hình JSX-preserve của Vite chặn; chuyển test sang phần chuyển đổi dữ liệu thực, không đổi config để né lỗi ứng dụng.
- Targeted public Playwright 11/11 PASS, gồm report edit/review/reset và widths1440/768/390/320. Các test đã có không bị giảm assertion.
- Fresh axe selected WCAG A/AA tags: landing mở disclosure ở bốn widths đều không confirmed violations, không overflow. Không phải chứng nhận WCAG.
- Isolated real ProgressHistory component, render với synthetic records (không bypass login): bảng mở và không page overflow tại bốn widths. Viewed screenshots landing1440/390 và isolated chart390. Isolated chart không có next/font root class, không coi là ảnh toàn workspace thật.
- Diff check PASS. Evidence ignored: .agents/audit/ui/core-step-one. Production preview http://127.0.0.1:3000/.

## Giới hạn và tiếp theo

Supabase config chưa có: không chạy authenticated roster search/progress E2E hay DB/RLS suite. Chỉ xác nhận integration bằng build/source và component/data checks; không gọi là live customer validation. Landing public/tour tests đã chạy trên app production thật.

Chat, lịch dùng chung, membership ledger, OCR PDF/provider vẫn thuộc các increment sau trong ../plans/COACHING_PRODUCT_FOLLOWUP.md. Lượt này không triển khai hay giả lập chúng thành chức năng thật. Không thay giá; không merge main/deploy; unrelated dirty plans/skills/video được giữ nguyên. Muốn xác minh core authenticated tiếp theo cần môi trường Supabase synthetic được cấu hình, không gửi secret qua chat.
