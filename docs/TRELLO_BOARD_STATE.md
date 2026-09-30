# FitSync — EXE201 Delivery: Trello Board State & Synchronization Log

> **Board Name:** `FitSync — EXE201 Delivery`  
> **Board URL:** https://trello.com/b/nkyUhT5E/fitsync-exe201-delivery  
> **Last Synchronized:** 2026-09-30  
> **Source of Truth:** Live Trello Board state via SafeTrail PM & Git Sync  

---

## 1. Board Overview & Inventory Summary

| Metric | Value |
| :--- | :--- |
| **Total Active Cards** | 81 |
| **`00 — GUIDE & MASTER LINKS`** | 5 cards |
| **`01 — PRODUCT BACKLOG`** | 41 cards |
| **`02 — TO DO THIS WEEK`** | 4 cards |
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

---

### `03 — DOING` (0 cards)
*(Members pull cards from `02 — TO DO THIS WEEK` to `03 — DOING` upon starting work)*

---

### `04 — REVIEW` (10 cards)
*Status: In Review — awaiting independent reviewer verification before moving to DONE*

1. `[W04][OC1][KHAI] Prototype OCR review and decide packaging constraints` *(MOVED FROM TO DO)*
   * Owner: Khai | Reviewer: Huy & Việt
   * Pull Request: [PR #11](https://github.com/Team-SafeTrail/fitsync-app/pull/11)
   * Closes Issue: [Issue #4](https://github.com/Team-SafeTrail/fitsync-app/issues/4)
   * Scope:
     - Thêm WebP/EXIF compression & validation backend action (`uploadOCRImage`)
     - Tạo private storage bucket `inbody-scans` có RLS
     - Tích hợp UI duyệt bản nháp OCR trực tiếp vào `InBodyForm.tsx`
     - Hiển thị cảnh báo thiếu EXIF và trường độ tin cậy thấp
     - Giữ nguyên luồng nhập thủ công trước, trong và sau upload
     - Tạo ảnh xem trước qua signed URL ngắn hạn (1h)
     - Soạn thảo ADR 003 đề xuất giải pháp Trusted Web Activity (TWA) cho CH Play
     - Sửa lỗi trigger `handle_new_user` trong cơ sở dữ liệu
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

### `06 — BLOCKED` (3 cards)
*(Requires dependency resolution, owner invitation, or unblocking action before progression)*
* Focus areas: Teammate Trello invitation gaps, verified historical evidence collection, prerequisite GitHub issue links.

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
