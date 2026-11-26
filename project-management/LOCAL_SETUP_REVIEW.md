# FitSync local — cài đặt và kiểm chứng22/11/2026

Owner đã cho phép cài Docker/WSL2, không tự reboot. Đã cài và chạy thành công; đề xuất chờ cài ở bản18/11 đã được thay thế bởi kết quả này.

| Thành phần | Kết quả |
|---|---|
|Docker Desktop|4.99.0.245822 per-user, chữ ký Valid/Docker Inc|
|Installer SHA256|a5e299131c9c53d60f3f752b162078945eb5faf6eedcf0be20a214c6e6cea444|
|WSL/kernel|3.0.5.0 /6.18.58.1-1|
|Docker Engine|29.9.3, containers Supabase khởi động|
|Reboot|Không thực hiện; một optional Windows feature còn pending restart|
|Local build/start|PASS22/11, npm.cmd run demo:start|
|Browser demo Windows|4/4 PASS,0 retry,exit0|

Receipts [Docker](../docs/evidence/exe201-2026-11-18/docker-install-receipt.json), [WSL](../docs/evidence/exe201-2026-11-18/wsl-install-receipt.json), [demo22/11](../docs/evidence/exe201-2026-11-22/local-demo-verification.json).

Web http://127.0.0.1:3000, Studio http://127.0.0.1:54323. Runtime riêng ../outputs/local-demo-runtime, credentials ngẫu nhiên riêng ../outputs/local-demo-private/LOCAL_DEMO_ACCESS.html ngoài Git. Chỉ seed synthetic, không ghi đè .env.local cloud hoặc migration production. Không gửi credential vào bài nộp.

Khi cần chạy lại, khởi động Docker rồi làm theo [runbook](../docs/DEMO_WORKFLOW.md). Launcher không cài Windows components hoặc tự reset/xóa DB. Local chấp nhận theo owner; website do Huy giữ vẫn chưa rollout. Quyền giảng viên chờ owner kiểm database.
