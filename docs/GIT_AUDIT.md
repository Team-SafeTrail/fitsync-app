# Git audit — 17/11/2026

## Repository và baseline

Repository thực: `fitsync-app/`, remote HTTPS `https://github.com/Team-SafeTrail/fitsync-app.git`; connector xác nhận repository public, default branch `main`. `.git` ở workspace ngoài không phải repository hoạt động. Ban đầu working tree `main` sạch; `main...origin/main` = `0 0` sau fetch. Base: `3c816e977d50f8a9bda1703cf4d6f3a417f86d0c`, PR #31 đã merge. `dev` và `Khai/dev-backend` cùng SHA tại snapshot.

Đã chạy status, remote -v, branch -a/-vv, fetch --all --prune, log --oneline --graph --decorate -20 và worktree list. Fetch chỉ cập nhật `origin/codex/apply-approved-coaching-design` từ d9a012a đến f51265c, không đổi main. Dùng `git -c safe.directory=<repo>` cho từng lệnh do sandbox chạy bằng SID khác owner; không thêm trust toàn cục.

Đã tạo branch `agent/exe201-fitsync-completion` từ đúng base. Không đổi source trên main. Commit đầu `8641fbc`: kế hoạch audit và cleanup. Danh sách commit cuối xem FINAL_DELIVERY.md.

## Branch và PR đang hoạt động

Snapshot connector có 8 PR mở: #47 auth (base dev); #30 OC2 checklist; #25 định hướng coaching; chuỗi #17/#19/#21/#23 UI; #15 OCR benchmark (draft). Không merge/cherry-pick/ghi đè các PR này. PR #47 có CI riêng trên `131dda2`, không thuộc base main và không được báo password reset đã ship. #15 chưa phải bằng chứng OCR provider được chọn.

Các branch local không tracking upstream hoặc tracking `gone` được giữ nguyên. Chưa push từ Viet và các commit của worktree cũ không bị sửa hoặc xóa. Chi tiết issue/PR/CI: [snapshot](evidence/exe201-2026-11-17/github-snapshot.json).

## Worktree safety

6 worktree khác được kiểm tra. `mentor-review-20261106`, `oc2-27`, `oc2-docs-update`, `pr-order-fix`, `pr28-after-pr26` sạch. `ui-before-sync-20261106` có thay đổi ở .gitignore, admin layout, auth actions, Supabase env và untracked docs/TRELLO_BOARD_STATE.md, scripts/. Tất cả được giữ nguyên. Không di chuyển thư mục .worktrees hoặc xóa branch.

## Remote write blocker

GitHub connector đọc được repository/issue/PR/Actions nhưng tạo issue và tạo remote branch trả HTTP403 `Resource not accessible by integration`. Git push qua local cũng thất bại: Credential Manager không lưu được credential, terminal prompts đã tắt. Vì vậy chưa có remote branch hoặc PR của lượt này. Đây là giới hạn quyền/đăng nhập hiện tại, không phải thay đổi đã publish.

Đã chuẩn bị patch/bundle và PR description để owner push khi có phiên Git có quyền. Không nhúng key/token vào file hoặc xin secret qua chat. Không thực hiện force push, reset hard, merge hay production deployment.

## Commit và kiểm tra cuối

- 8641fbc — docs: establish EXE201 evidence audit and safe cleanup plan.
- afa123f — feat: add read-only course metrics and delivery verification.
- 76a5dca — docs: reconcile EXE201 forms, final draft and project evidence.
- 294c4ca — docs: add verified Week 8 and 9 presentation package.

Sau đó bổ sung commit bàn giao cuối; exact HEAD và manifest nằm trong receipt ngoài repo. Dirty worktree ui-before-sync-20261106 được đọc lại và giữ nguyên cùng danh sách thay đổi; không thao tác các checkout khác. Source app không thay đổi so với base, chỉ thêm scripts/reporting và tài liệu/evidence.
