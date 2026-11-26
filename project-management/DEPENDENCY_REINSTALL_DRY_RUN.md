# Kiểm tra trước khi cài lại dependency — 17/11/2026

Phạm vi: `fitsync-app/node_modules`, cấu hình package và lockfile của repository này. Không áp dụng cho worktree khác hoặc thư mục người dùng.

- Next 14.2.21 có cảnh báo critical; ứng viên 15.5.29 đã build qua với request APIs bất đồng bộ.
- PostCSS trực tiếp đã lên 8.5.33 và source-map-js lên 1.2.2; bản PostCSS lồng trong Next vẫn bị npm giữ ở 8.4.31 dù root đã khai báo override.
- Thay entry lock của dependency lồng bằng đúng metadata 8.5.33 đã được npm tải và kiểm tra integrity, rồi dùng `npm ci --dry-run --ignore-scripts` kiểm tra trước.
- Bản lock trước thay đổi lưu trong `../outputs/package-lock-before-postcss-override.json`; bản gốc của nhóm vẫn có trong Git.
- Chỉ sau khi dry-run hợp lệ và tiến trình build/test đang chạy kết thúc mới dùng `npm ci --ignore-scripts`. Thư mục node_modules là dependency tái tạo được; source, env, media, database và mọi worktree được giữ nguyên.
- Chạy lại audit, domain tests, lint, typecheck và build sau khi dependency ổn định; không dùng kết quả build trước thay thế.
