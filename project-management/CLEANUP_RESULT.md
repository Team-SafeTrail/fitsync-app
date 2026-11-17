# Kết quả cleanup — 17/11/2026

Đã thực thi đúng [dry-run](CLEANUP_DRY_RUN.md). Git không tracking cả ba đường dẫn cache/test đã chọn.

- Đã xóa `apps/web/.next` (163.852.725 byte) và `apps/web/tsconfig.tsbuildinfo` (122.608 byte), sau khi xác minh absolute path nằm trong repo.
- Đã move 3 file test cũ (2.900 byte) vào `../outputs/archive/exe201-cleanup-2026-11-17/test-results-before`.
- Đã build lại thành công, lint, typecheck và 103 domain tests qua. Cache được tạo lại phục vụ demo và tiếp tục được Git ignore.
- Giữ dependency, credentials, tài liệu, media, dataset, worktrees và toàn bộ thay đổi có sẵn của nhóm.

Dung lượng cache được dọn ban đầu: 163.975.333 byte (khoảng 156,38 MiB). Không báo đây là dung lượng tiết kiệm ròng vì build đã tái tạo output. Không có dữ liệu người dùng bị xóa hoặc ghi đè. Snapshot worktree trước/sau được đối chiếu trong GIT_AUDIT.md.
