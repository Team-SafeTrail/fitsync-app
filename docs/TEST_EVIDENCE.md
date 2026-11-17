# Kiểm thử thực tế — 17/11/2026

Source ứng dụng không đổi so với main `3c816e9` trong lượt này. Thêm automation thu thập số đếm và tài liệu. Windows: Node24.13.0, npm11.8.0; CI lịch sử dùng Node 20. Đây là giới hạn tương thích cần giữ khi so sánh.

| Check | Kết quả đã chạy | Phạm vi |
|---|---|---|
| npm ls --depth=0 |Exit 0, dependency giải quyết được | Có 2 optional/native package bị ghi extraneous, không tự nâng/xóa |
| npm run test |103/103,10 file, exit 0 | Domain/validation/action/SSR, không phải DB integration |
| node --test scripts/test/local-environment.test.mjs |4/4, exit 0 | Chặn cloud/misleading loopback/missing key |
| npm run lint |Exit 0, không warning/error | ESLint theo repo |
| npm run typecheck |Exit 0 | TypeScript |
| npm run build |Exit 0,19 static generation | Production build, không chứng nhận backend/emaildelivery |
| Chromium public tests, direct CLI |16/16,26,2 s, exit 0 | Landing/tour/authguard/legal/320–1440 px; không đăng ký hoặc ghi dữ liệu cloud |
| Website live readonly |Home 200, login 200, workspace 307→/login | HTTP smoke, chưa biết exact deployed SHA |
| Cloud aggregate collect or |Exit 0, đã đọc lại snapshot | ChỉGET/Auth Admin read, không lấy health metric values hoặc ghi DB |
| Full authenticated/RLS local |BLOCKED | Không Docker; không trỏ test mutating vào cloud |

Logs gốc ở `../../outputs/exe201-source-audit-2026-11-17/`; bản text/receipt được lưu trong evidence khi bàn giao. Lượt root npm ban đầu có warning nuốt`--project` và wrapperteardownchưaexit; đã chạy lại direct Playwright CLI với server external và nhận 16/16, exit 0. Không lấy lời “ok” rời rạc làm thành công toàn bộ. Dùng [DEMO_WORKFLOW](DEMO_WORKFLOW.md) để tái lập đúng lệnh.

## Bằng chứng backend lịch sử

[Backend run41092400099](https://github.com/Team-SafeTrail/fitsync-app/actions/runs/41092400099) trên application/testcheckpointb75b9d2,30/10: 202SQL/RLS, 23/23Chromium, types diff và upgrade rehearsal theo handoff. [Webrun41579119351](https://github.com/Team-SafeTrail/fitsync-app/actions/runs/41579119351) trên main `3c816e9` có success được connector đọc 17/11. Không gọi những run này là rerun trong phiên hoặc dùng CI củaPR 47 để chứng minh main có reset password.

## Kiểm tra môi trường và giới hạn

Không chạy npmci lại vì dependency hiện có đã build/test; cài mới theo lock được hướng dẫn, chưa kiểm sạch local trong lượt này. Không benchmark load, Android thiết bị thật, Firefox/Safari, email delivery, OCR provider hoặc payments. Chưa có kết quả penetration test hay coverage percentage. Không nâng dependency để chạy qua.

CLI credential Supabase không khả dụng dưới execution identity; dùng app server configuration chỉđọc đúng host FitSync qua collect or. HEAD metadata từng cho kết quảSDKmơhồ; đã sửa dùng GET limit 0 vàcode 404/PGRST205, ghi snapshot cuối. Chỉ snapshot cuối trong repo là nguồn báo cáo.
