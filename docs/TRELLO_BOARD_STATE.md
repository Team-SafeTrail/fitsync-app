# FitSync — EXE201 Delivery: Trello Board State & Synchronization Log

> **Board Name:** `FitSync — EXE201 Delivery`  
> **Board URL:** https://trello.com/b/nkyUhT5E/fitsync-exe201-delivery  
> **Last Synchronized:** 2026-10-04  
> **Source of Truth:** Live Trello Board state via SafeTrail PM & Git Sync  

---

## 1. Board Overview & Inventory Summary

| Metric | Value |
| :--- | :--- |
| **Total Active Cards** | 82 |
| **`00 — GUIDE & MASTER LINKS`** | 5 cards |
| **`01 — PRODUCT BACKLOG`** | 41 cards |
| **`02 — TO DO THIS WEEK`** | 6 cards |
| **`03 — DOING`** | 0 cards |
| **`04 — REVIEW`** | 10 cards |
| **`05 — DONE`** | 0 cards |
| **`06 — BLOCKED`** | 3 cards |
| **`07 — WEEKLY REPORTS & EVIDENCE`** | 18 cards |

### Core Workflow Cycle
```text
PRODUCT BACKLOG ➔ TO DO THIS WEEK ➔ DOING ➔ REVIEW ➔ DONE
```

### Golden Governance Rules
1. **Owner never self-approves:** A task must be reviewed and moved to `DONE` by an independent reviewer.
2. **REVIEW must precede DONE:** No card jumps straight to `DONE`.
3. **No Fake Evidence:** A task reaches `DONE` only when verified evidence (PR link, test result, export, screenshot, receipt) is attached. Planned target $\neq$ verified result.
4. **BLOCKED Card Requirement:** Must state reason, dependency owner, previous stage, and next review date.
5. **Data Privacy Gate:** Never attach credentials, tokens, private signed URLs, raw health data, unredacted identities, or full banking records.

---

## 2. Detailed List Breakdown

### `00 — GUIDE & MASTER LINKS` (5 cards)
* `[MIGRATION LOG] Previous board inventory`
  * Logs migration from legacy board to 8-list Kanban.
  * Records 77 active cards, 54 deliverables with assigned owners/reviewers/checklists.
  * Retains historical archives without converting unverified items to DONE.
* `[RULES] Trello / GitHub / Discord authority`
  * **Trello:** Weekly commitments, responsibilities, status, deadlines, evidence indexes.
  * **GitHub Issues/PRs:** Engineering scope, implementation acceptance, code review, CI.
  * **Discord:** Announcements, questions, meetings, daily standup (`[Name] [Card Link] | Done | Next | Blocker`).
  * **Repository docs/tests:** Product truth, architecture, security rules.
* `[LINKS] Repository, deployed app, Figma, LMS, Discord, evidence folder`
  * Verified: GitHub repository `https://github.com/Team-SafeTrail/fitsync-app`.
  * Verified: Trello Board `https://trello.com/b/nkyUhT5E/fitsync-exe201-delivery`.
  * Verified: Financial Model Google Sheets `https://docs.google.com/spreadsheets/d/1JEEIMwIYCxw8Stv7U10354ZYQGURrKZz/edit?usp=sharing`.
  * Pending: Deployed app domain, Figma final link, LMS calendar dates.
* `[TEMPLATE] Deliverable card`
  * Template: `[W##][OC#] Verb + outcome` (Owner, Contributors, Reviewer, Checklist, Dependencies, GitHub Issue/PR, Done-when, Evidence links).
* `[TEMPLATE] Weekly lecturer report`
  * Template for weekly progress summaries (Commitments, Status totals, Evidence links, Carry-over, Blockers, Member contributions, Decisions, Next-week priorities).

---

### `01 — PRODUCT BACKLOG` (41 cards)
*Status: `NOT YET STARTED — PRODUCT BACKLOG`*

#### W04 — OC1
* `[W04][OC1] Prepare synthetic-first OCR benchmark`
  * Owner: Hưng | Contributor: Việt | Reviewer: Việt
  * Checklist: Corpus manifest, 5-field ground truth, dev/holdout separation, benchmark $\ge 2$ candidates, accuracy/latency/cost calculations, no unapproved real health reports.

#### W05 — OC1
* `[W05][OC1] Select OCR provider or manual-only fallback` (Hưng ➔ Việt)
* `[W05][OC1] Integrate secure server-only OCR draft lifecycle` (Huy ➔ Hưng)
* `[W05][OC1] Complete OCR correction and confirmation browser flow` (Khai ➔ Huy)
* `[W05][OC1] Finalize truthful OCR copy and visuals` (Toàn ➔ Khai)

#### W06 — OC1
* `[W06][OC1] Prepare production and staging operations` (Huy ➔ Hưng)
* `[W06][OC1] Produce approved Android release candidate` (Khai ➔ Huy)
* `[W06][OC1] Validate release OCR metrics` (Hưng ➔ Việt)
* `[W06][OC1] Rehearse OC1 and finalize release assets` (Việt ➔ Hưng, Contribs: Toàn + all)

#### W07 — OC1
* `[W07][OC1] Freeze and submit OC1 evidence package` (Việt ➔ Hưng)

#### W08 — OC2
* `[W08][OC2] Define pilot offer, consent, support, deletion, and incident operations` (Việt ➔ Hưng)
* `[W08][OC2] Scope password reset and account lifecycle backend` (Huy ➔ Hưng)
* `[W08][OC2] Design roster management and biometric trend workflows` (Khai ➔ Huy)
* `[W08][OC2] Define privacy-safe product/OCR measurement dictionary` (Hưng ➔ Việt)
* `[W08][OC2] Design two measured channel experiments` (Toàn ➔ Khai)

#### W09 — OC2
* `[W09][OC2] Implement privacy-safe funnel, deletion, and support operations` (Huy ➔ Hưng)
* `[W09][OC2] Implement remaining MVP UI and approved client events` (Khai ➔ Huy)
* `[W09][OC2] Verify KPI formulas and analytics quality` (Hưng ➔ Việt)
* `[W09][OC2] Produce launch assets, UTM links, and content calendar` (Toàn ➔ Khai)

#### W10 — OC2
* `[W10][OC2] Monitor OCR demo quality and manual fallback` (Hưng ➔ Việt)
* `[W10][OC2] Maintain production, Android release, and install evidence` (Huy ➔ Hưng)
* `[W10][OC2] Launch attributed online channel` (Toàn ➔ Khai)
* `[W10][OC2] Operate direct-gym acquisition channel` (Việt ➔ Hưng)

#### W11 — OC3
* `[W11][OC3] Implement manual VietQR evidence and entitlement` (Huy ➔ Hưng)
* `[W11][OC3] Build transparent payment-status UX` (Khai ➔ Huy)
* `[W11][OC3] Open approved offer and paid sales pipeline` (Việt ➔ Hưng)
* `[W11][OC3] Monitor OCR value, cost, and failure risk` (Hưng ➔ Việt)

#### W12 — OC3
* `[W12][OC3] Run conversion and consented feedback cycle` (Việt ➔ Hưng)
* `[W12][OC3] Draft OCR performance and limitations report` (Hưng ➔ Việt)
* `[W12][OC3] Reconcile transactions and production operations` (Huy ➔ Hưng)
* `[W12][OC3] Record 3–5 minute released-product demo` (Khai ➔ Huy)
* `[W12][OC3] Produce 60–90 second TVC draft` (Toàn ➔ Khai)

#### W13 — OC1 / OC2 / OC3
* `[W13][OC1] Finalize install evidence and technical demo` (Khai ➔ Huy)
* `[W13][OC2] Freeze channel metrics and draft final report` (Việt ➔ Hưng)
* `[W13][OC2] Finalize channel report, TVC, and slides` (Toàn ➔ Khai)
* `[W13][OC3] Finalize OCR and product analytics appendix` (Hưng ➔ Việt)
* `[W13][OC3] Finalize redacted financial and system evidence` (Huy ➔ Hưng)

#### W14 — FINAL SUBMISSION
* `[W14][ALL] Submit and defend final package` (Việt ➔ Hưng)
* `[W14][ALL] Verify frozen technical numbers and limitations` (Hưng ➔ Việt)
* `[W14][ALL] Secure and archive operational evidence` (Huy ➔ Hưng)
* `[W14][ALL] Support final demo and release fallback` (Khai ➔ Huy)
* `[W14][ALL] Perform final media and presentation QA` (Toàn ➔ Khai)

---

### `02 — TO DO THIS WEEK` (4 cards)

1. `[W04][OC1] Prepare synthetic-first OCR benchmark`
   * Owner: Hưng | Contributor: Việt | Reviewer: Việt
   * GitHub Issue: https://github.com/Team-SafeTrail/fitsync-app/issues/2
   * Scope: Benchmark protocol, 5-field ground truth, holdout dataset.

2. `[W04][OC1][HUY] Build private OCR data foundation`
   * Owner: Huy | Reviewer: Hưng
   * GitHub Issue: https://github.com/Team-SafeTrail/fitsync-app/issues/3
   * Scope: Versioned `ocr_attempts` migration, private storage bucket, RLS policies, pgTAP denial tests.

3. `[W04][OC1][TOÀN] Review OCR UX and evidence assets`
   * Owner: Toàn | Reviewer: Khai
   * GitHub Issue: https://github.com/Team-SafeTrail/fitsync-app/issues/5
   * Scope: Design system audit, Vietnamese copy review, store/demo screenshot asset checklist.

4. `[W04][OC1][DATA] Seed test PT account with populated trainees for OCR testing` *(NEW)*
   * Owner: Hưng & Việt | Reviewer: Việt
   * Labels: `OC1`, `Engineering`, `Product`, `Evidence`
   * Description: Thiết lập tài khoản PT kiểm thử (có sẵn mật khẩu) và nạp sẵn 3–5 học viên mẫu (trainees) với hồ sơ hoàn chỉnh vào cơ sở dữ liệu Supabase để hỗ trợ Khai, Toàn và nhóm kiểm thử trực tiếp giao diện InBodyForm và luồng OCR mà không cần tạo mới thủ công.
   * Checklist:
     - [ ] Khởi tạo tài khoản PT kiểm thử trong Supabase: email `pt.test@fitsync.vn` (mật khẩu quy ước nội bộ)
     - [ ] Nạp sẵn 3–5 học viên mẫu (trainees) được gán trực tiếp cho PT này
     - [ ] Kiểm tra tài khoản PT có thể truy cập ngay `/workspace/trainees/[id]`
     - [ ] Gửi thông tin tài khoản đăng nhập kiểm thử vào kênh Discord `#sprint-discuss` cho Khai
     - [ ] Cập nhật hướng dẫn vào `docs/HANDOFF.md`

5. `[W05][OC1][VIỆT] Khảo sát chốt slot thuyết trình 30p Tuần 5 và chuẩn bị Slide & Kịch bản báo cáo GV` *(SLOT CHỐT: 16:00 THỨ NĂM 08/10)*
   * Owner: Việt | Reviewer: Hưng | Contributors: Cả 5 thành viên (Hưng, Huy, Khai, Toàn, Việt)
   * Labels: `OC1`, `Sprint W05`, `Presentation`, `Governance`, `High Priority`
   * Due Date: **2026-10-03 23:59:00** (Đã hoàn thành khảo sát; tập trung ngày 04/10 làm Slide & Kịch bản)
   * Description: Khảo sát biểu quyết 28 slot thời gian của Giảng viên (Thứ 2 đến Thứ 5, 05/10 - 08/10), chọn slot có số lượng thành viên tham gia đông nhất (bắt buộc Trưởng nhóm Việt có mặt làm thuyết trình chính). Đã chốt slot chính thức: 16:00 – 16:30 Thứ 5 (08/10/2026) theo biểu quyết đa số thành viên, để ngày Chủ nhật 04/10 nhóm tập trung 100% làm bộ Slide Google Slides 30 phút và kịch bản thuyết trình bám sát Form Week 1, 2, 3 và kết quả Milestone M4.
   * Checklist:
     - [x] Đăng thông báo 28 slot lên kênh `#announcement`; yêu cầu thành viên comment lịch rảnh vào `#general-chat` (tag Leader) do giới hạn số lựa chọn của Discord Poll
     - [x] 5/5 thành viên hoàn thành comment trước 23h59 tối Thứ 7 (03/10)
     - [x] Trưởng nhóm Việt tổng hợp, chọn slot đông nhất (16:00 – 16:30 Thứ 5 ngày 08/10/2026), đăng ký với Giảng viên và công bố kết quả vào `#announcement`
     - [ ] Dành ngày Chủ nhật (04/10) khởi tạo Google Slides chuẩn Dark/Carbon theme cho bài 30 phút
      - [x] Hoàn thành nội dung Slide Brief & Kịch bản 30p (`docs/W05_PRESENTATION_SCRIPT_30MIN.md`, `docs/W05_SLIDE_DESIGN_BRIEF_FOR_TOAN.md`)
     - [ ] Phân công thuyết trình (Việt thuyết trình chính về Tech/Product/OC1; Toàn/Hưng hỗ trợ Q&A)
     - [ ] Tổ chức buổi tổng duyệt (Dry-run) nội bộ nhóm trước buổi báo cáo chính thức

6. `[W05][OC1][TOÀN] Thiết kế bộ 17 Slide trình chiếu Báo cáo Giảng viên Tuần 5 (Carbon Dark Theme)` *(NEW)*
   * Owner: Toàn | Reviewer: Việt | Contributors: Việt (Script & Brief)
   * Labels: `OC1`, `Design`, `Sprint W05`, `Presentation`, `High Priority`
   * Due Date: **2026-10-07 12:00:00** (Bản thảo hoàn chỉnh trước buổi báo cáo 28 tiếng)
   * Description: Thiết kế bộ Slide 17 trang chuẩn 16:9 Widescreen (Figma hoặc Google Slides) theo phong cách Carbon Dark Athletic Theme phục vụ bài báo cáo tiến độ 30 phút trước Giảng viên môn EXE201 vào 16:00 Thứ Năm (08/10/2026). Tuân thủ nguyên tắc "Show, Don't Tell", ưu tiên hình ảnh/mockup/biểu đồ, số liệu to nổi bật và tối giản chữ theo đúng bản đặc tả chi tiết `docs/W05_SLIDE_DESIGN_BRIEF_FOR_TOAN.md` và kịch bản `docs/W05_PRESENTATION_SCRIPT_30MIN.md`.
   * Checklist:
     - [ ] Thiết lập Master Slide Template chuẩn tỉ lệ 16:9, bảng màu Carbon Dark (`#0B0E14`, `#151921`, `#FF6B00`, `#10B981`) và Typography thể thao
     - [ ] Hoàn thành Slide 1 – 3: Cover Brand, Nỗi đau 104 PTs (3 thẻ kính số liệu to), Giải pháp & Luồng 3 bước FitSync
     - [ ] Hoàn thành Slide 4 – 6 (Tuần 1): Bảng Trello 8 cột & 5 thành viên SafeTrail, Sơ đồ Final System Design 4 khối, Ma trận cam kết OC1 (10 ĐIỂM) - OC2 - OC3
     - [ ] Hoàn thành Slide 7 – 10 (Tuần 2): Grid 4 ô Target KPIs, Phễu AARRR tích hợp GA4/UTM, 2 Kênh Marketing chủ lực (Gym B2B & TikTok), Ngân sách tinh gọn & Vốn tự có
     - [ ] Hoàn thành Slide 11 – 13 (Tuần 3): 5 Screenshots Android Store & Early Bird Ticket 99k, Kết quả test thực địa tại 4 gym & Zalo feedback, Danh sách 10 Paid Users & Mockup VietQR động
     - [ ] Hoàn thành Slide 14 – 16 (Tuần 4 & Lộ trình): 3 Thẻ GitHub PR #11/#12/#13 merged, Slide đệm Live Demo hệ thống, Timeline phát hành Google Play Tuần 5–7
     - [ ] Hoàn thành Slide 17: Tổng kết 3 giá trị thật (Sản phẩm thật, Thị trường thật, Dòng tiền thật) & 2 Mã QR Code tương phản cao
     - [ ] Xuất bản link Figma / Google Slides (quyền Comment) và file PDF High Quality Print dự phòng
     - [ ] Gửi Tech Lead Việt review và duyệt nghiệm thu trước 12:00 Thứ Tư (07/10)

---

### `03 — DOING` (0 cards)
*(Members pull cards from `02 — TO DO THIS WEEK` to `03 — DOING` upon starting work)*

---

### `04 — REVIEW` (10 cards)
*Status: In Review — awaiting independent reviewer verification before moving to DONE*

1. `[W04][OC1][KHAI] Prototype OCR review and decide packaging constraints` *(IN REVIEW — APPROVED BY TECH LEAD, AWAITING FINAL SIGN-OFF)*
   * Owner: Khai | Reviewer: Huy, Hưng & Việt
   * Pull Request: [PR #11](https://github.com/Team-SafeTrail/fitsync-app/pull/11)
   * Closes Issue: [Issue #4](https://github.com/Team-SafeTrail/fitsync-app/issues/4)
   * Current Review State (2026-10-04):
     - Revision `9866324` addressed initial feedback (role admin default, 10MB limit, unique attempt constraint, state key reset).
     - Revisions `1fa221d` & `bd197fd` integrated Huy's PR #12 and Hưng's PR #13, restored cross-platform package-lock bindings, Sharp `.rotate()`, and ADR-003.
     - Revisions `962f2d0` & `7eba8ab` resolved `defaultValue` TS2322 type error and cleaned up obsolete DB tests.
     - **Final Polish Revision `f41187c` (Approved):**
       * Kết nối kịch bản `mockScenario` trong `ocr-actions.ts` với `DeterministicFakeOcrAdapter` khi chạy test.
       * Sửa khớp câu assertion trong `apps/web/tests/e2e/m4-ocr.spec.ts` với thông báo thành công `"Bản ghi InBody đã được xác minh và lưu"`.
       * Bổ sung `NEXT_PUBLIC_E2E_TEST: "true"` vào cấu hình dev server trong `playwright.config.ts`.
       * Khử sạch kiểu `any` trong `getOcrAttemptSignedUrl`, định kiểu chuẩn `OcrNormalizedDraft | null`.
       * Đã xác minh 4 cổng kiểm thử đều đạt 100%: Unit test 33/33 pass, Typecheck 0 errors, Lint 0 warnings, Build 13/13 routes.
     - Đã được Trưởng nhóm Việt phê duyệt (**APPROVED**). Thẻ giữ tại `04 — REVIEW` đợi Hưng duyệt xác nhận lần cuối để merge vào `main` và chuyển sang `05 — DONE`.
2. `[W04][OC1][VIỆT] Freeze OC1 scope and weekly governance` (Việt ➔ Hưng) — *PR #10 merged, LMS dates & risk matrix ready*
3. `[W01][OC1] Freeze product scope, team roles, and course outcomes` (Việt ➔ Hưng) — *BACKFILLED*
4. `[W01][OC1] Establish research and design baseline` (Toàn ➔ Khai) — *BACKFILLED*
5. `[W02][OC1] Establish monorepo and modular-monolith architecture` (Việt ➔ Hưng) — *BACKFILLED*
6. `[W02][OC1] Verify identity, profiles, invitation, and tenant isolation` (Huy ➔ Hưng) — *BACKFILLED*
7. `[W02][OC1] Verify manual InBody workflow across PT and trainee views` (Khai ➔ Huy) — *BACKFILLED*
8. `[W03][OC1] Verify daily check-in, private meal media, and PT visibility` (Huy ➔ Hưng) — *BACKFILLED*
9. `[W03][OC1] Verify session balance and three-day warning rule` (Hưng ➔ Việt) — *BACKFILLED*
10. `[W03][OC1] Align landing activation and team delivery workflow` (Việt ➔ Hưng) — *BACKFILLED*

---

### `05 — DONE` (0 cards)
*(Confirmed: 0 cards in DONE. No deliverable is marked complete until reviewed with linked evidence).*

---

### `06 — BLOCKED` (2 cards)
*(Requires dependency resolution, owner invitation, or unblocking action before progression)*
1. `[RESOLVED / UNBLOCKED 2026-10-03] Backend schema & RLS contract overlap between Issue #3 (Huy) and Issue #4 (Khai)`
   * Resolved: Huy đã merge PR #12 và Hưng hoàn thiện corrective PR #13 trên `main`. Khai đã rebase và tích hợp trực tiếp backend vào PR #11 (commit `1fa221d`). Không còn xung đột schema.
2. `[HISTORICAL] Backfilled deliverable evidence collection` (Pending verified PR links/receipts for W01–W03)
3. `[ACCESS] Teammate Trello invitation acceptance gaps` (Waiting for pending accounts to claim cards)

---

### `07 — WEEKLY REPORTS & EVIDENCE` (18 cards)
#### Weekly Lecturer Reports (14 cards):
* `[W01] Weekly progress report` ➔ `[W14] Weekly progress report`
* Each card tracks: Commitments, Status counts, Completed evidence, Carry-over, Blockers, Member contributions, Next priorities.
* Rules: Do not pre-fill future results; use only verified evidence.

#### Immutable Evidence Indexes (4 cards):
* `[OC1] Final evidence` (Rubric, install proof, PRs, OCR benchmark, demo, presentation, receipt)
* `[OC2] Final evidence` (Pilot ops, consent/deletion evidence, channel attribution, KPI evidence)
* `[OC3] Final evidence` (VietQR evidence, entitlement, transaction reconciliation, consented feedback)
* `[FINAL] Submission receipts and immutable links` (Final report, slides, demo, TVC, immutable archive)

---

## 3. Synchronization & Change Log

| Date (YYYY-MM-DD) | Action / Change Description | Updated By | Verified State |
| :--- | :--- | :--- | :--- |
| **2026-09-29** | Initial board inventory snapshot imported from live Trello state. Established 8 Kanban lists, 77 active cards, 0 in DONE, 8 in REVIEW (BACKFILLED). | Việt / AI Assistant | Verified ✅ |
| **2026-09-29** | Added 3 W04 member cards to `02 — TO DO THIS WEEK` (Huy #3, Khai #4, Toàn #5). Moved `[W04][OC1][VIỆT]` to `04 — REVIEW`. Active cards: 80 total. | Việt / AI Assistant | Verified ✅ |
| **2026-09-30** | Diệp Khai submitted PR #11 closing Issue #4. Moved `[W04][OC1][KHAI]` to `04 — REVIEW`. Added new card `[W04][OC1][VIỆT] Seed test PT account with populated trainees for OCR testing` to `02 — TO DO THIS WEEK`. Total active cards: 81. | Khai / Việt / Antigravity | Verified ✅ |
| **2026-10-02** | Round 2 technical review on PR #11 (revision 9866324) completed by Hưng & Việt. Status set to CHANGES REQUESTED (retained in 04 — REVIEW). Logged blocker for schema collision with Issue #3 (Huy) in 06 — BLOCKED. Dispatched coordination update to Discord #sprint-discuss. | Hưng / Việt / AI Assistant | Verified ✅ |
| **2026-10-03** | Merged PR #12 (Huy - Issue #3) and corrective PR #13 (Hưng - M4 gates recovery) to `main`. Unblocked Issue #3/#4 schema collision in 06 — BLOCKED. Khai submitted PR #11 Round 3 revisions: `1fa221d` (clean backend integration, Sharp rotation, dynamic Playwright E2E) and `bd197fd` (restored cross-platform package-lock bindings). Synchronized branch `Viet` and updated documentation. | Việt / AI Assistant | Verified ✅ |
| **2026-10-04** | PR #11 Round 3 review completed by Việt. Diệp Khai submitted final polish revisions (`962f2d0`, `7eba8ab`, `f41187c`) addressing mock adapter, E2E assertions, playwright config, and strict typing. All 4 quality gates verified green locally (33/33 tests pass). PR #11 marked APPROVED by Tech Lead Việt, retained in 04 — REVIEW awaiting Hưng's final approval for merge. Completed W05 presentation poll: frozen slot at 16:00 Thursday (08/10). Synchronized branch Viet. | Việt / Antigravity | Verified ✅ |
