# Chạy và kiểm tra bản bàn giao

Huy/Khai dùng hướng dẫn này để mở đúng web thật và tái lập kiểm thử bằng dữ liệu giả. Các lệnh là hướng dẫn cho máy nhận bàn giao; không phải báo cáo rằng mọi lệnh đã chạy trên Windows của chủ sản phẩm. Kết quả đã chạy nằm ở [UI_ACCEPTANCE](UI_ACCEPTANCE.md).

## 1. Nhận đúng checkpoint

Đọc [README](README.md), [DESIGN](../../DESIGN.md) và [issue được giao](ISSUE_TRACKER.md). Kiểm tra thay đổi cá nhân trước khi cập nhật Git:

```powershell
git status --short
git branch --show-current
git fetch origin
```

Nếu có thay đổi chưa commit, giữ chúng trên checkout hiện tại. Dùng worktree mới khi cần; không reset/clean để nhận bản bàn giao. Trước merge, lấy nhánh `codex/apply-approved-coaching-design`; sau merge, lấy commit đã merge vào `main`. Tạo branch riêng cho từng issue mới. Không tiếp tục phát triển trên nhánh PR31 đang review.

Checkpoint ứng dụng/test đã nghiệm thu là `b75b9d2`; `b2587c7` bổ sung bộ tài liệu/ảnh đầu tiên. Các commit tài liệu sau đó không chứng minh code đã được kiểm thử lại. Đọc run IDs, SHA và trạng thái CI của PR khi nhận việc.

## 2. Chuẩn bị công cụ

Repo dùng Node.js 20 trở lên, npm workspaces và lockfile gốc. CI dùng Node 20. Cài Docker cho Supabase local; kiểm dung lượng trống và các cổng 3000, 54321, 54322. Cài dependencies từ thư mục gốc:

```powershell
npm ci
```

Nếu npm không có trong PATH, sửa cài đặt Node/PATH trên máy của bạn. Không nâng Next, Supabase hoặc lockfile để giải quyết vấn đề môi trường. Phiên bản khóa hiện tại: Next 14.2.21 và Supabase CLI 2.118.0.

## 3. Mở giao diện công khai

Từ thư mục gốc, khởi chạy web:

```powershell
npm run dev
```

Mở `http://127.0.0.1:3000/`. Landing, legal và tour công khai không cần đăng nhập. Thiếu Supabase thì form tài khoản báo môi trường chưa sẵn sàng. Tour `/app/*` dùng fixture; mở được tour không chứng minh backend hoạt động.

## 4. Nối Supabase local riêng

Chỉ thao tác trên stack local dành cho dữ liệu giả. Kiểm `supabase/config.toml`, project local và môi trường shell trước khi chạy. Không dùng project cloud lịch sử như sandbox.

Khởi động Docker rồi từ repo root chạy:

```powershell
node node_modules/supabase/dist/supabase.js start
node node_modules/supabase/dist/supabase.js migration list --local
```

Stack mới áp migrations khi khởi tạo. Nếu stack local đã tồn tại và thiếu migration, đọc SQL rồi áp additive migrations:

```powershell
node node_modules/supabase/dist/supabase.js migration up --local
node node_modules/supabase/dist/supabase.js test db
```

Không dùng `db reset` như bước mặc định: lệnh đó xóa dữ liệu local. Không dùng `db push`, `--linked` hoặc URL cloud cho quy trình này. Không nhập `schema-v1.sql`; snapshot phục vụ tra cứu, migrations mới là lịch sử thực thi.

Tạo `apps/web/.env.local` từ [mẫu](../../apps/web/.env.example) nếu tệp chưa có. Giữ nguyên tệp cá nhân đã tồn tại. Lấy credentials của chính stack local từ CLI status trên máy bạn; không chụp/gửi output chứa key. Các trường cần cấu hình:

| Biến | Giá trị / phạm vi |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `http://127.0.0.1:54321` cho local |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable/anon key của cùng stack |
| `SUPABASE_SERVICE_ROLE_KEY` | Chỉ server hoặc synthetic fixture setup; tuyệt đối không đưa vào Android/client |
| `NEXT_PUBLIC_SITE_URL` | `http://127.0.0.1:3000` cho local |
| `FITSYNC_CHAT_ENABLED` | `true` chỉ khi đã có migration chat |
| `FITSYNC_CALENDAR_ENABLED` | `true` chỉ khi đã có migration lịch |
| `FITSYNC_COACHING_CONTEXT_ENABLED` | `true` chỉ khi đã có migration membership/notes |

Khởi động lại web sau khi đổi env. Production build phải được build lại với môi trường đúng. Cờ rollout không thay thế kiểm quyền hoặc migrations. Dùng hai browser profile/incognito riêng cho PT và học viên để tránh ghi đè session.

## 5. Chạy các cổng kiểm tra

Chạy từ root để kiểm code trước khi gửi PR:

```powershell
npm test
npm run lint
npm run typecheck
npm run build
node --test scripts/test/local-environment.test.mjs
```

So generated types trong tệp tạm trước khi sửa file đang dùng:

```powershell
node node_modules/supabase/dist/supabase.js gen types typescript --local --schema public
```

Output này không chứa rows nhưng có thể dài. Dùng redirection UTF-8 phù hợp shell nếu lưu tệp; PowerShell cũ có thể ghi UTF-16. CI dùng `diff` trực tiếp với generated types. Không sửa types bằng tay để làm diff qua.

Các đường Node trực tiếp khi npm script bị vướng PATH nằm dưới `node_modules`: `typescript/bin/tsc`, `next/dist/bin/next`, `vitest/vitest.mjs`. Luôn giữ working directory giống npm workspace tương ứng.

## 6. Nghiệm thu browser trên DB giả

Đóng server khác ở cổng 3000 nếu nó do bạn khởi chạy. Không để Playwright tái sử dụng server cũ với env khác. Cấu hình local ở bước 4; tại `apps/web`, bật guard E2E và production server rồi build:

```powershell
$env:FITSYNC_E2E_LOCAL_DB='true'
$env:PLAYWRIGHT_PRODUCTION_SERVER='true'
npm run build
npx --no-install playwright install chromium
```

Chạy cùng bộ tám spec của acceptance CI:

```powershell
npx --no-install playwright test tests/e2e/m2-vertical-slice.spec.ts tests/e2e/m3-engagement.spec.ts tests/e2e/chat-private.spec.ts tests/e2e/calendar-private.spec.ts tests/e2e/web-handoff.spec.ts tests/e2e/approved-design.spec.ts tests/e2e/public-journey.spec.ts tests/e2e/oc2-admin-landing.spec.ts
```

Lệnh dài được giữ trên một dòng để copy nguyên vào PowerShell. Bộ này tạo synthetic users/records; chỉ chạy trên local disposable stack. Guard yêu cầu loopback cổng 54321. Không bật `FITSYNC_E2E_LOCAL_DB` trên cloud, không giả `GITHUB_ACTIONS`, không dùng service key cho thao tác UI thông thường.

M4 fake-provider suite là bài kiểm tra riêng, không nằm trong tám spec trên. Nó không chứng minh live OCR/PDF hoặc benchmark. Playwright có thể tạo trace/video chứa session và input; giữ local, không đưa nguyên thư mục test-results lên issue. Chỉ chia sẻ ảnh đã rà và log đã loại credentials.

## 7. Khi chưa có Docker

Chạy code gates/public preview trên máy; dùng acceptance CI của PR cho authenticated flows và upgrade rehearsal. Không tạo cloud test project hay tắt auth để bù Docker thiếu. Hai helper `ci-local-supabase.mjs`, `ci-upgrade-rehearsal.mjs` chỉ dành cho GitHub runner tạm. Upgrade rehearsal được chạy bởi job thứ hai trong workflow, không dùng helper để di chuyển migrations trên checkout cá nhân.

## 8. Chẩn đoán theo triệu chứng

| Triệu chứng | Kiểm tra / cách xử lý |
| --- | --- |
| Đăng ký báo chưa cấu hình | Đúng `.env.local`, public URL/key cùng stack, restart/build lại |
| Chat/lịch/notes chưa mở | Flag tương ứng và migration; không bỏ guard trong code |
| Invitation lỗi hoặc hết hạn | Link còn hiệu lực, đúng site URL, session browser riêng; flow reissue/reset còn trong AUTH-DELIVERY |
| DB relation/function missing | Migration history của chính stack local; không tự tạo bảng tay |
| Generated types diff | Đúng migrations, public schema, CLI khóa trong lockfile, encoding của file |
| Test trả 404 | Kiểm viewer role, assigned PT, learner identity, archive; 404 người ngoài là kết quả bảo vệ mong muốn |
| Lịch báo trùng | Range PT và học viên; cuộc hẹn kế tiếp được bắt đầu đúng lúc cuộc trước kết thúc |
| Membership báo stale | Reload/review revision mới rồi sửa; không retry ghi đè tự động |
| OCR unavailable | Adapter production chưa cấu hình; nhập tay và PT xác nhận vẫn phải hoạt động |

## 9. Bằng chứng cần gửi khi hoàn thành issue

Ghi commit SHA, môi trường local/CI, lệnh đã chạy và kết quả thật. Đính ảnh desktop/phone synthetic, test negative/race liên quan, generated diff và migration review nếu có. Reviewer chấp nhận PR/issue; chủ task không tự đóng việc chỉ vì một ảnh đẹp. Checklist thao tác cụ thể ở [MANUAL_ACCEPTANCE](MANUAL_ACCEPTANCE.md).
