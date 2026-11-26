# Kiểm kê và dry-run cleanup — 17/11/2026

Đã lập trước khi dọn. Workspace thực: `C:/LEARNING/FPT_NVH/FAL2026/EXE201/project`. Repository thực: `fitsync-app/`; `.git/` ở workspace ngoài rỗng và không phải repository hoạt động.

## Kiểm kê

| Thư mục | File | Dung lượng MiB | Phân loại/xử lý |
|---|---:|---:|---|
| docs | 29 | 58,05 | Tài liệu học phần, proposal, checkpoint, QR; giữ nguyên |
| fitsync-app | 25.508 | 890,18 | Source, dependency, build; dọn riêng cache dưới đây |
| .worktrees | 101.904 | 3.325,38 | 6 checkout cũ, có branch riêng; giữ nguyên |
| outputs | 9.270 | 402,37 | Báo cáo, media, lịch sử và evidence; giữ nguyên |
| .video-private | 2 | <0,01 | Dữ liệu riêng; giữ nguyên, không đọc/publish |

Số đếm là snapshot kiểm kê, có thể đổi khi thêm tài liệu hoặc chạy build. Không cộng `.git` vào source; không dùng dung lượng để kết luận dữ liệu dư thừa.

## Dry-run các đường dẫn được dọn

| Đường dẫn trong repo | File | Byte | Hành động dự kiến | Lý do |
|---|---:|---:|---|---|
| apps/web/.next | 102 | 163.852.725 | Xóa sau khi kiểm Git tracking, build lại | Next.js generated output/cache |
| apps/web/tsconfig.tsbuildinfo | 1 | 122.608 | Xóa sau khi kiểm Git tracking | TypeScript incremental cache |
| apps/web/test-results | 3 | 2.900 | Archive bên ngoài repo trước test mới | Giữ kết quả test cũ để đối chiếu |
| node_modules | 24.550 | 754.544.428 | Giữ | Cần cho kiểm thử, không coi là rác |
| apps/web/node_modules | 553 | 5.617.621 | Giữ | Workspace dependency |

Archive được đặt tại `../outputs/archive/exe201-cleanup-2026-11-17/test-results-before`. Trước mỗi delete/move, xác minh resolved absolute path nằm trong repo dự kiến; dùng PowerShell native với LiteralPath. Không dùng reset/clean hoặc xóa đệ quy qua shell khác.

## Thư mục chưa chắc chắn

Năm worktree sạch theo `git status --porcelain`. Worktree `ui-before-sync-20261106` có thay đổi ở .gitignore, admin/layout.tsx, auth/actions.ts, supabase/env.ts cùng untracked docs/TRELLO_BOARD_STATE.md và scripts/. Giữ nguyên toàn bộ. Không move worktree bằng thao tác file system vì sẽ làm sai đăng ký Git. Những bản giống nhau dưới docs/handoff/screenshots và docs/evidence được giữ vì đang được tài liệu tham chiếu; chưa coi là obsolete.

## Cấu trúc áp dụng

Giữ nguyên apps/, supabase/, scripts/ và docs/ hiện hành. Thêm reports/, presentations/, project-management/ trong repository; file tạm/nguồn trích giữ ở outputs ngoài repo. Không tái tổ chức source hàng loạt, không xóa tài liệu hoặc dữ liệu chưa backup.

Kết quả thực thi và xác minh sau dọn: CLEANUP_RESULT.md.
