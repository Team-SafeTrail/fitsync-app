# Scope chi tiết của các issue bàn giao

Snapshot scope31/10/2026; trạng thái/assignment live xem [ISSUE_TRACKER](ISSUE_TRACKER.md) và GitHub. Không phải lịch hoàn thành hoặc cam kết mọi business rule đã được duyệt. Bản này để đọc offline cùng code; khi scope đổi, cập nhật cả issue và contract liên quan trong PR.

## REVIEW-BASELINE / #32

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/32). Lead: Huy + Khai. Nhận và review độc lập web/database v1 trước khi tiếp tục implementation.

Dependency: PR31 có thể review ngay.

Phạm vi:

- Đọc handoff index, runbook, code map, schema/permissions, manual acceptance và ảnh.
- Đối chiếu PR31 với các issue visual/product cũ #16/#18/#20/#22/#24 và OC2 #27; không đóng thay reviewer.
- Chạy synthetic stack hoặc CI; ghi merge SHA sau khi chủ sản phẩm merge.

Điều kiện nghiệm thu:

- [ ] Huy ghi nhận schema/grants/legacy auth findings; Khai ghi nhận UI/navigation/responsive findings.
- [ ] Liệt kê defects với expected/actual, mức ưu tiên và issue liên quan.
- [ ] Ghi trạng thái accept/request changes và cổng còn chặn pilot; không coi việc nhận baseline là production approval.

Điểm vào code: `docs/handoff/*; DESIGN.md; PR31; apps/web/tests/e2e/web-handoff.spec.ts`.

Kiểm chứng: DEVELOPER_RUNBOOK và MANUAL_ACCEPTANCE; kiểm CI của SHA nhận bàn giao, đối chiếu receipts b75b9d2; không báo tests cũ là vừa chạy.

## AUTH-DELIVERY / #33

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/33). Lead: Huy + Khai. Hoàn thiện delivery và UX vòng đời tài khoản để PT/học viên dùng qua email thật trên staging đã duyệt.

Dependency: #32 REVIEW-BASELINE.

Phạm vi:

- Email confirmation, password reset, invitation expired/consumed và reissue.
- Scoped coach display identity cho learner và account settings cần thiết; không mở đọc toàn profiles.
- Form/error/pending/retry và safe redirect/deep link có contract web/mobile.

Điều kiện nghiệm thu:

- [ ] Valid/expired/consumed/reissued invitation có kết quả xác định, token dùng một lần và không lộ PII.
- [ ] Reset/confirmation mail đi qua staging email được phép; không chỉ giả response.
- [ ] Không role escalation/open redirect; người ngoài/direct API bị chặn; UI keyboard/mobile và error states được thử.

Điểm vào code: `apps/web/src/features/workspace/actions.ts; features/invitations/token.ts; app/auth/callback/route.ts; auth UI; supabase migrations/tests`.

Kiểm chứng: Unit token/redirect/validation, SQL identity/isolation và browser hai vai trò; lưu evidence mail đã redacted, không link/token sống.

## LEGACY-AUTH / #34

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/34). Lead: Huy. Đóng khoảng trống quyền ở health/check-in/OCR/media legacy trước khi dùng dữ liệu khách hàng.

Dependency: #32 REVIEW-BASELINE.

Phạm vi:

- Lập matrix role promotion, archive/unlink/reassign, replacement learner identity.
- Kiểm SELECT/INSERT/UPDATE/DELETE/RPC và private storage/signing từng domain.
- Sửa policy/action dưới migration additive khi phát hiện lỗi; không giả quyền bằng UI.

Điều kiện nghiệm thu:

- [ ] Mỗi ô quyền được thử bằng ordinary authenticated/anon/direct API; có negative assertions.
- [ ] PT cũ/learner cũ/admin role không được hưởng quyền ngoài policy đã review.
- [ ] Migrations không làm mất dữ liệu; current invitation/record/check-in/chat vẫn qua regression.

Điểm vào code: `supabase/migrations/*; supabase/tests/*; workspace actions/data/ocr-actions; apps/web/src/lib/supabase`.

Kiểm chứng: pgTAP role/relationship/storage cases, exact generated types, fresh install+upgrade, M2/M3 và handoff browser.

## OPS-DATA / #35

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/35). Lead: Huy. Chốt và triển khai vòng đời dữ liệu, xóa tài khoản và quy trình phục hồi có thể diễn tập.

Dependency: #34 LEGACY-AUTH.

Phạm vi:

- Owner duyệt retention cho report source, attempts, chat/notes/media và account deletion.
- Thiết kế restrict/cascade/retire theo miền; cleanup source không phá verified history ngoài policy.
- Backup/restore rehearsal synthetic, audit tối thiểu, support/incident và privacy notices.

Điều kiện nghiệm thu:

- [ ] Có policy được owner duyệt và mapping FK/storage lifecycle.
- [ ] Delete/cleanup/retry idempotent, đúng tenant, không log body/provider payload.
- [ ] Khôi phục synthetic staging có counts/ownership checks; không dùng backup thật làm fixture.

Điểm vào code: `supabase schema/storage; server jobs được chọn; docs/handoff/DATABASE_V1.md; privacy/support docs`.

Kiểm chứng: Tests FK/cascade/cleanup/isolation; rehearsal logs redacted; human review policy trước rollout.

## ABUSE-ROLLOUT / #36

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/36). Lead: Huy. Bảo vệ abuse và đưa baseline lên staging đúng thứ tự, tách merge khỏi rollout.

Dependency: #35 OPS-DATA, #34 LEGACY-AUTH.

Phạm vi:

- Rate limits cho auth/invites/chat/calendar/upload/RPC kể cả direct API có thể bypass web.
- Environment/secrets/provider limits và log redaction; flags off mặc định.
- Review Vercel auto-deploy/main integration, migration order, rollback flags và support owner.

Điều kiện nghiệm thu:

- [ ] Burst/direct API tests chứng minh limit ở boundary được chọn, response retry rõ.
- [ ] Không client service/provider key, không secret/body logging.
- [ ] Staging checklist có backup/migration/app/flags/smoke/rollback; không tự chạy production trong issue.

Điểm vào code: `.github/workflows; app server boundaries; supabase RPC/policies; deployment settings; env docs`.

Kiểm chứng: Boundary/load smoke có scope, local guard tests, security review và staging smoke; không tuyên bố pentest toàn bộ.

## CALENDAR-02 / #37

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/37). Lead: Huy; Khai review states. Cho learner đề nghị đổi/hủy lịch và PT quyết định, giữ nguyên lịch gốc đến khi chấp nhận.

Dependency: #32 REVIEW-BASELINE.

Phạm vi:

- Version/request/audit model và RPC theo REMAINING_CONTRACTS mục1.
- Request/accept/reject/withdraw/stale UX ở web, giữ appointment ID dùng cho chat card.
- Quy tắc này là đề xuất cần owner xác nhận trước migration; không tự thêm no-show fee.

Điều kiện nghiệm thu:

- [ ] Accept request và update appointment nguyên tử; overlap fail giữ slot/request cũ.
- [ ] Hai quyết định đồng thời chỉ một thắng; stale yêu cầu reload/review; retry không duplicate.
- [ ] Hai vai trò chỉ thấy quan hệ hiện hành; booking/change/cancel không tự debit PT sessions.

Điểm vào code: `features/scheduling; app/workspace/calendar; AppointmentForm; supabase migrations/tests; chat domain references`.

Kiểm chứng: SQL transaction/RLS/race/overlap, unit action, browser PT+learner+outsider/lost ack, upgrade rehearsal.

## LEDGER-01 / #38

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/38). Lead: Huy; Khai nối states. Thay số dư mutable bằng ledger có completion/debit/reversal và giữ số dư chuyển đổi chính xác.

Dependency: #37 CALENDAR-02.

Phạm vi:

- Owner duyệt debit eligibility, expiry, override và reversal rules trước schema.
- Opening event từ remaining_sessions thực; không bịa attendance quá khứ.
- Thay SessionBalanceForm/action/grants legacy cùng release để tránh đường bypass.

Điều kiện nghiệm thu:

- [ ] Completion+debit cùng transaction, unique debit per appointment, reversal không trùng.
- [ ] Lock order xác định, retry idempotent, không balance âm; ordinary client không tự ghi delta.
- [ ] Counts/balances trước-sau migration khớp; booking/check-in/date membership không debit.

Điểm vào code: `workspace/actions.ts updateRemainingSessions; SessionBalanceForm; scheduling; target entitlement/ledger migrations`.

Kiểm chứng: SQL concurrency/double debit/reversal/isolation, balance reconciliation và legacy-write-denied tests, browser completion/correction.

## FULL-REPORT / #39

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/39). Lead: Huy; Khai review field groups. Mở model InBody từ năm trường sang report có totals/segments/source/unit/revision và PT review.

Dependency: #32 REVIEW-BASELINE, #34 LEGACY-AUTH.

Phạm vi:

- Áp BODY-REPORT-02 ở REMAINING_CONTRACTS; template/vendor/model matrix được owner review.
- Canonical core/composition/index/visceral/control/segments, null presence reasons và evidence.
- Verified snapshots/supersedes; migration legacy one-to-one; nutrition tách miền có strategy.

Điều kiện nghiệm thu:

- [ ] Unit/left-right/reference percent và fat fraction được phân biệt, missing không thành0.
- [ ] Không suy lean vùng thành SMM hoặc kết luận cơ ngực/lưng từ dữ liệu không đo.
- [ ] Confirm report/attempt nguyên tử và idempotent; learner chỉ thấy verified đúng identity.
- [ ] Legacy values/counts/ownership giữ nguyên; source private; generated types+dictionary cập nhật.

Điểm vào code: `supabase schema/types; workspace InBodyForm/RecordCard/ProgressHistory; ocr-actions; REMAINING_CONTRACTS mục3`.

Kiểm chứng: Template fixtures synthetic, conversion/null/review/revision tests, pgTAP+upgrade+browser đầy đủ và manual fallback.

## OCR-PDF / #40

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/40). Lead: Huy; benchmark phối hợp #2. Nối OCR/PDF thật sau benchmark và giữ PT là người xác nhận cuối.

Dependency: #39 FULL-REPORT.

Phạm vi:

- Reuse benchmark issue #2 của Hưng/Việt; không tạo kết quả hoặc corpus cạnh tranh.
- PDF text/scan/image, page evidence, size/signature/page/resource/timeout limits.
- Provider adapter/version/cost/retry/cleanup và trạng thái lỗi có manual fallback.

Điều kiện nghiệm thu:

- [ ] Threshold/holdout/template coverage được duyệt trước đo; báo denominator/error types/latency/cost.
- [ ] Password/malformed/oversize/no text có trạng thái rõ; không execute PDF attachment/script/embedded URL.
- [ ] Sai provider hoặc duplicate confirm không xuất bản report sai; learner chưa thấy unverified.
- [ ] Không gọi fake adapter là OCR thật; không xử lý report thật trước governance/consent gate.

Điểm vào code: `workspace/ocr-adapter.ts; ocr-actions.ts; ocr-validation.ts; provider integration; private storage; report domain`.

Kiểm chứng: Provider contract tests+bounded malformed fixtures, SQL attempt/report race, browser upload/review/failure/manual; #2 benchmark evidence riêng.

## TARGETS-MEALS / #41

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/41). Lead: Huy; Khai nối UI. Tách mục tiêu dinh dưỡng được PT publish và nhật ký nhiều bữa/ngày khỏi legacy record/check-in.

Dependency: #32 REVIEW-BASELINE, #34 LEGACY-AUTH.

Phạm vi:

- Target version/draft/published/retired và effective date; learner đọc published.
- Meal entries nhiều bữa/ngày, private media và PT feedback; migration legacy không duplicate.
- Food AI không thuộc core issue: chỉ nối sau detection/uncertainty/cost/consent scope riêng.

Điều kiện nghiệm thu:

- [ ] BMR máy in không tự thành calorie target; target nháp không lọt learner.
- [ ] Upload/gửi ảnh dùng được khi AI tắt/lỗi; feedback đúng actor/visibility.
- [ ] Ngày giờ/identity/history và media cleanup giữ nhất quán; diary không tự debit buổi.

Điểm vào code: `features/engagement; submitDailyCheckin/updateNutritionDraft; CheckinForm; InBodyRecordCard; nutrition/meal target schema`.

Kiểm chứng: SQL publication/identity/media, multi-meal/timezone/idempotency migration, browser PT/learner edit/publish/feedback/failure.

## ANDROID-SPIKE / #42

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/42). Lead: Khai; Huy hợp đồng. Chứng minh đường Android dùng chung backend qua một vertical slice trên máy thật.

Dependency: #32 REVIEW-BASELINE, #33 AUTH-DELIVERY.

Phạm vi:

- Đối chiếu #24 hướng Expo/React Native với ADR003 Proposed TWA; cập nhật ADR cùng owner trước scaffold.
- Auth→invitation/deep link→profile→camera/manual-review slice, session và versioned API/RPC.
- Không gọi Next Server Action endpoint bằng build ID; ghi boundary web/native và offline rules.

Điều kiện nghiệm thu:

- [ ] Có ADR cập nhật và spike cài/chạy Android thật, model/OS/build ghi trong evidence.
- [ ] Secure session storage, permissions, keyboard/safe area, reconnect/retry không mất hoặc nhân dữ liệu.
- [ ] RLS participant semantics giữ nguyên; không nhúng service/provider key; chưa hứa Play release.

Điểm vào code: `docs/architecture/adr-003-android-packaging-path.md; issue #24; shared domain contracts; future Android client`.

Kiểm chứng: Physical device script+redacted evidence, API/RLS contract checks; định nghĩa follow-up CORE rõ trước mở rộng.

## ANDROID-CORE / #43

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/43). Lead: Khai. Triển khai Android hai vai trò theo domain contract đã ổn định, phù hợp tương tác điện thoại.

Dependency: #42 ANDROID-SPIKE, #37 CALENDAR-02, #39 FULL-REPORT.

Phạm vi:

- PT/learner nav, hồ sơ/progress, intake/camera/review, chat/lịch/membership/check-in.
- Target/meal UI theo contract đã release; không copy widget web rồi gọi native hoàn tất.
- Background/reconnect/deep link và internal distribution có phạm vi/account được duyệt.

Điều kiện nghiệm thu:

- [ ] Parity matrix ghi supported/deferred; không fake success cho domain chưa có.
- [ ] Máy Android thật qua auth/profile/camera/chat/calendar/private-note isolation.
- [ ] Retry/session expiry/offline rõ; package cài nội bộ và version backend được ghi; store release là gate riêng.

Điểm vào code: `Android client sau spike; DESIGN.md; stable APIs/RPC; auth/storage configuration`.

Kiểm chứng: Device acceptance, contract/RLS regression và accessibility/keyboard/background matrix; không chỉ Chrome width390.

## REALTIME-MEDIA / #44

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/44). Lead: Huy + Khai. Thêm media/read state/realtime/notification có quyền và lifecycle rõ.

Dependency: #35 OPS-DATA, #36 ABUSE-ROLLOUT.

Phạm vi:

- Per-user read state/unread semantics; không suy unread từ message count.
- Media upload/private links/limits/cleanup và reconnect/event ordering.
- Notification opt-in/delivery/lock-screen privacy cho web/native theo capability.

Điều kiện nghiệm thu:

- [ ] Revoked relation không đọc file/event; notification không chứa health/message body nhạy cảm.
- [ ] Duplicate/out-of-order/reconnect không duplicate message/unread; polling fallback xác định.
- [ ] File limits/signature/cleanup và rate caps được kiểm; không gọi polling15s là realtime.

Điểm vào code: `features/chat; ChatComposer/HistoryViewport; storage/RLS/realtime config; native notifications`.

Kiểm chứng: Two-role+outsider API/browser/device tests, expired links, duplicate/reconnect/background checks; scoped load smoke.

## BILLING-OFFER / #45

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/45). Lead: Huy; owner chốt thương mại. Làm rõ offer199k đã khảo sát và economics trước khi nối thanh toán thật.

Dependency: #32 REVIEW-BASELINE.

Phạm vi:

- Owner quyết định người trả, active cap, allowances/overage/support/trial nếu có.
- Tính chi phí OCR/media/message/provider và VAT/receipt/payment obligations cần chuyên môn review.
- Tách thuê bao FitSync khỏi membership/gói PT bán cho học viên; landing cùng capability thật.

Điều kiện nghiệm thu:

- [ ] Có decision record nguồn khảo sát, assumptions/cost scenarios và điều còn chưa kiểm chứng.
- [ ] Không tự thay199k, dựng Free/unlimited/ROI hoặc dùng sample VietQR làm payment proof.
- [ ] Payment implementation chỉ sau provider/offer/authority được duyệt, webhook idempotency/reconciliation có issue con rõ.

Điểm vào code: `docs/PRODUCT_DECISIONS.md; pricing research; landing offer; future billing domain; admin sample labels`.

Kiểm chứng: Review decision/cost model + copy consistency; sandbox payment tests chỉ sau scope implementation duyệt.

## PILOT-RELEASE / #46

[Mở issue](https://github.com/Team-SafeTrail/fitsync-app/issues/46). Lead: Huy + Khai; owner/reviewer duyệt. Chạy pilot có điều kiện phát hành và đo giá trị giảm nhập/tìm thông tin của PT.

Dependency: #33 AUTH-DELIVERY, #34 LEGACY-AUTH, #35 OPS-DATA, #36 ABUSE-ROLLOUT.

Phạm vi:

- Owner chốt pilot scope/domain phải có, cohort/consent/support và metrics trước launch.
- Landing/legal/capabilities phản ánh đúng môi trường; rollout/rollback theo checklist.
- Đo thời gian PT tiếp nhận/tra cứu/correction và duy trì sử dụng; không lấy test counts làm value proof.

Điều kiện nghiệm thu:

- [ ] P0 gates qua; mỗi P1 nằm trong pilot scope có acceptance riêng, phần deferred được nói rõ.
- [ ] Human reviewer phê duyệt release; production credentials/data/deploy được cấp authority riêng.
- [ ] Pilot report có mẫu/thời gian/giới hạn, feedback và quyết định continue/change; không tự bịa traction.

Điểm vào code: `docs/handoff/MERGE_AND_SHARE.md; WORK_PACKAGES; landing/legal/support; deployment/runbook; pilot evidence`.

Kiểm chứng: Staging smoke+scope acceptance, backup/rollback drill, owner signoff; metrics tối thiểu không thu health/chat body.
