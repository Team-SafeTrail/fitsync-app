# FitSync — demo workflow có thể tái lập

Đối soát 17/11/2026. Public demo được kiểm lại, 16/16browser tests qua. Full authenticated end-to-end **chưa chạy lại local** vì thiếu Docker; bằng chứng synthetic lịch sử có trong TEST_EVIDENCE.md. Không gọi tour là demo persistence hoặc market-ready.

## Prerequisites và cài đặt

Node>=20 (CI 20, máy kiểm 24.13), npm workspaces; Docker chỉ cần cho Supabase local. Từ repo `fitsync-app/`, đọc AGENTS/HANDOFF và kiểm `git status` trước. Giữ `.env.local` và worktree cá nhân.

```powershell
npm.cmd ci
npm.cmd run test
npm.cmd run lint
npm.cmd run build
npm.cmd run typecheck
```

Trong phiên đã dùng dependencies có sẵn, chưa chạy clean install `npm ci`. Nếu thiếu browser, cài Chromium từ package Playwright đã khóa: `node node_modules/@playwright/test/cli.js install chromium`. Không nâng dependency để thay test.

## A. Public demonstration đã kiểm tra

```powershell
npm.cmd run build
npm.cmd run start --workspace @fitsync/web -- --hostname 127.0.0.1
```

Mở `http://127.0.0.1: 3000/`. Trình bày hai vai trò, mở public sample, tìm học viên trong fixture, xem learner tour, rồi quay về form đăng ký. Chỉ xem form và auth guard; không gửi signup/reset/upload vào cloud trong smoke này. Expected: landing/tour có nhãn dữ liệu mẫu, không hứaAPK/OCRlive/paid; `/workspace` và`/admin` khi chưa đăng nhập chuyển login; viewport320/390/768/1440 không tràn ngang trong các luồng đã test.

Chạy public assertions trên server đang mở, từ `apps/web/`:

```powershell
$env:PLAYWRIGHT_EXTERNAL_SERVER='true'
node ../../node_modules/@playwright/test/cli.js test tests/e2e/public-journey.spec.ts tests/e2e/approved-design.spec.ts tests/e2e/oc2-admin-landing.spec.ts --project=chromium --reporter=line
```

Expected: 16 passed, exit 0. Direct CLI tránh root npm truyền`--project` thành npm config và tránh teardownwrapper trên Windows. Dừng server bằngCtrl+C trong terminal đã chạy; không kill toàn bộ process node của người dùng.

Website hiện hành [fitsync-app-one.vercel.app](https://fitsync-app-one.vercel.app/) đã HTTP smoke 200/login 200/workspace 307 ngày 17/11; chưa xác định deploy SHA và chưa đăng nhập hai vai trò trong phiên này.

## B. Full synthetic demo khi có local database cô lập

Chỉ dùng stack loopback dùng riêng cho synthetic. Không dùng cloud lịch sử làm sandbox. Không nhập schema snapshot thay migration và không chạy reset/delete như bước mặc định.

1. Khởi động Docker, đọc `supabase/config.toml` và 8 migration.
2. Từroot chạy `node node_modules/supabase/dist/supabase.js start`. Stack mới áp migrations; stack local cũ cần review và `migration up --local` khi phù hợp, không `db push --linked`.
3. Tạo file env riêng theo `.env.example` nếu chưa có; không ghi đè `.env.local` đang trỏ cloud. Dùng checkout/worktree riêng cho bài testDB. `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1: 54321`, publishable/service-role của chính stack local, site URL localhost. Không chụp/in credential. Bật 3 flag coaching chỉ khi migrations/tôi quyền và test tương ứng qua.
4. Chạy `node --test scripts/test/local-environment.test.mjs`, `supabase test db`, build và browser suite theo `.github/workflows/backend-acceptance.yml`. `FITSYNC_E2E_LOCAL_DB=true` chỉ cho loopback. CI helper trong repo có guard rõ ràng, không được bỏ guard để chạy cloud.
5. Dùng hai browser context riêng. PT synthetic tạo hồ sơ và single-uselink; learner nhận invite. PT nhập 70 kg, 30 kgSMM, 14 kgfat, 20%PBF (số **synthetic**), xác nhận rồi reload; learner phải thấy cùng record. Learner gửi check-in; PT thấy update sau reload. Kiểm outsider PT nhận 404/không thấy dữ liệu. Các test hiện có tự sinh identityexample.test để không dùng khách thật.
6. Nếu demo thêm chat/lịch/context, chạy đủ 3 migration mới và suitechat-private/calendar-private/web-handoff. Expected: tin nhắn lưu hai chiều, lịch có overlap guards, private note không lộ, số buổi không tự giảm do tạo lịch. Không demo đổi/hủy/ledger/full PDF như đã có.

Ảnh authenticated thật trên stack synthetic ngày 30/10: [hồ sơPT](handoff/screenshots/handoff-pt-dossier.png), [learner](handoff/screenshots/handoff-trainee-home.png); [provenance](handoff/screenshots/README.md). Chúng là evidence lịch sử, không chứng minh production hoặc khách thật.

## Test/demo data và video

Không dùng sức khỏe thật. Không đưa password/service-role/tokeninvitation vào slide/log/Trello. Existing [walkthrough25/10](https://drive.google.com/file/d/1gjgn76IERkSat_4sFSLkezkrif2_m4Vu/view) đã xác nhận metadata file, chưa xem lại toàn bộ; cần kiểm version, nội dung và quyền xem giảng viên trước khi coi là video nộp đã đạt.

## Troubleshooting và known limitations

| Triệu chứng | Xử lý |
|---|---|
| Dubiousownership | Sau xác định đúng repo, dùng `git -c safe.directory=<đường dẫn chính xác>` cho từng lệnh |
| Port 3000 bận | Kiểm server đã mở; dùng external server cho tests. Không tắt process không thuộc lượt này |
| Không Supabase/Docker | Demo public và dùng evidence historical có nhãn; fullE2EB LOCKED |
| PGRST205 coaching table cloud | Source có migration, REST cloud chưa phơi bày bảng; không tự rollout production |
| OCR provider unavailable | Nhập tay/PT review, không quảng cáo accuracy/latency |
| Reset password | Chức năng đầy đủ ởPR 47 chưa merge; chưa có mail delivery receipt |
|4Pro/27Auth trên admin | Đây không phải paid/customer độc lập, xem cohort filter |
| GitHub write403/Gitlogin thiếu | Giữ local commit/bundle/PRdrafttext, owner push khi có quyền |

Đọc [TEST_EVIDENCE](TEST_EVIDENCE.md), [FINAL_REPORT_READINESS](../reports/FINAL_REPORT_READINESS.md). Không có bằng chứng Android physical/PlayStore/Safari/livepayment/market ready trong phiên này.
