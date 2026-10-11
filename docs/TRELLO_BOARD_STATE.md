# FitSync — EXE201 Delivery: Trello Board State & Synchronization Log

> **Board Name:** `FitSync — EXE201 Delivery`  
> **Board URL:** [https://trello.com/b/nkyUhT5E/fitsync-exe201-delivery](https://trello.com/b/nkyUhT5E/fitsync-exe201-delivery)  
> **Repository:** [https://github.com/Team-SafeTrail/fitsync-app](https://github.com/Team-SafeTrail/fitsync-app)  
> **Current Cycle:** Entering Week 5 (W05 Active Sprint / Outcome OC1 Focus)  
> **Source of Truth:** Official Live Trello Board snapshot (83 active cards across 8 lists)  

---

## 1. Board Identity & Inventory Snapshot

Bảng quản trị tiến độ phân phối môn EXE201 của dự án FitSync hiện được tổ chức thành đúng 8 danh sách (Lists) theo thứ tự từ `00` đến `07`:

| Mã danh sách | Tên danh sách (List Name) | Số thẻ thực tế (Cards) | Mục đích quản trị & Trạng thái hiện tại |
| :--- | :--- | :---: | :--- |
| **`00`** | **`00 — GUIDE & MASTER LINKS`** | **5** | Quy chế phân quyền, liên kết chính thức, biểu mẫu thẻ công việc và báo cáo tuần. |
| **`01`** | **`01 — PRODUCT BACKLOG`** | **41** | Toàn bộ kế hoạch tương lai (W05–W14) theo 3 chuẩn đầu ra OC1, OC2, OC3. |
| **`02`** | **`02 — TO DO THIS WEEK`** | **0** | Hàng đợi đầu tuần (Hiện để trống có chủ đích; chỉ kéo thẻ khi vượt qua Activation Gate). |
| **`03`** | **`03 — DOING`** | **5** | Các nhiệm vụ đang triển khai trong tuần (W04 data/benchmark/backend/UX + Slide W05). |
| **`04`** | **`04 — REVIEW`** | **7** | Thẻ đang chờ Reviewer độc lập nghiệm thu (5 thẻ W01-W03 backfilled + 2 thẻ W04). |
| **`05`** | **`05 — DONE`** | **4** | Thẻ đã hoàn tất và được Reviewer độc lập phê duyệt kèm minh chứng xác thực. |
| **`06`** | **`06 — BLOCKED`** | **3** | Thẻ bị nghẽn phụ thuộc (Scope matrix, Android PR #11, Issue #5 UI review). |
| **`07`** | **`07 — WEEKLY REPORTS & EVIDENCE`** | **18** | 14 Báo cáo tuần Giảng viên (W01–W14) + 4 Thẻ chỉ mục minh chứng bất biến (OC1, OC2, OC3, FINAL). |
| **TỔNG CỘNG** | **8 DANH SÁCH HOẠT ĐỘNG** | **83** | **Snapshot chính thức của Trello Board (Không dùng số liệu cũ từ lịch sử migration)** |

---

## 2. Mô Hình Thẩm Quyền (Authority Model)

Trello không phải là nơi duy nhất chứa mọi loại sự thật. Mỗi công cụ trong dự án chịu trách nhiệm một phạm vi thẩm quyền riêng biệt:

- **Trello sở hữu (Trello owns):**
  - Cam kết tiến độ hàng tuần (Weekly commitments).
  - Phân công trách nhiệm và vai trò phụ trách (Responsibility / Ownership).
  - Trạng thái quy trình làm việc (Workflow status: Backlog ➔ To Do ➔ Doing ➔ Review ➔ Done).
  - Thời hạn nộp bài khi đã được xác nhận (Confirmed deadlines).
  - Chỉ mục minh chứng bàn giao (Evidence indexes) và Báo cáo tuần cho Giảng viên (Weekly reporting).
  - Theo dõi và điều phối các điểm nghẽn (Blocker tracking).
- **GitHub sở hữu (GitHub owns):**
  - Phạm vi kỹ thuật chi tiết (Engineering scope), Thiết kế kiến trúc và Mã nguồn.
  - Quản lý GitHub Issues, Pull Requests (PRs), Quy trình Code Review và Phản biện kỹ thuật.
  - Kiểm thử tự động (CI - Continuous Integration: Unit tests, Typecheck, Lint, E2E).
  - Lịch sử Git commits và bằng chứng kỹ thuật khách quan.
- **Discord sở hữu (Discord owns):**
  - Thông báo nội bộ (#announcement), Thảo luận giải đáp thắc mắc (#sprint-discuss).
  - Điều phối lịch họp, bình chọn khung giờ báo cáo Giảng viên.
  - Điểm danh và cập nhật trạng thái công việc hàng ngày (Daily standup).
  - *Lưu ý:* Discord KHÔNG phải là một backlog thứ hai; mọi task thảo luận trên Discord phải liên kết thẻ Trello tương ứng.
- **Mã nguồn, Kiến trúc & Kiểm thử sở hữu (Repository / Architecture / Tests own):**
  - Hành vi thực tế của sản phẩm (Actual product behavior).
  - Cơ sở dữ liệu và các bản migration PostgreSQL / Supabase RLS.
  - Bộ kiểm thử phần mềm (pgTAP tests, Vitest, Playwright E2E tests).
  - Kiến trúc hệ thống đang chạy thực tế.

---

## 3. Quy Tắc Vàng Trong Quản Trị & Luồng Bàn Giao (Core Workflow & Governance)

### Luồng Chuẩn Của Thẻ Công Việc
```text
PRODUCT BACKLOG ➔ TO DO THIS WEEK ➔ DOING ➔ REVIEW ➔ DONE
                                      ↕
                                   BLOCKED
```

### Các Quy Tắc Cốt Lõi:
1. **Không tự phê duyệt (Owner never self-approves):** Người chịu trách nhiệm (Owner) tuyệt đối không được tự chuyển thẻ của mình sang `DONE`.
2. **REVIEW phải diễn ra trước DONE:** Mọi thẻ công việc đều phải trải qua giai đoạn `04 — REVIEW` trước khi sang `05 — DONE`. Chỉ có Reviewer độc lập được chỉ định mới có quyền nghiệm thu và đưa thẻ vào `DONE`.
3. **Mục tiêu dự kiến không phải là minh chứng (Planned target $\neq$ Verified evidence):** Chỉ chuyển sang `DONE` khi đã đính kèm bằng chứng thực tế (Link PR đã merge, log chạy test pass, ảnh chụp màn hình, biên lai).
4. **Quy định đối với thẻ BLOCKED:** Thẻ đưa vào `06 — BLOCKED` bắt buộc phải ghi rõ:
   - Lý do nghẽn (Blocker reason).
   - Người chịu trách nhiệm tháo gỡ (Dependency owner).
   - Trạng thái trước khi bị nghẽn (Previous stage).
   - Điều kiện và thời điểm rà soát để gỡ nghẽn (Unblock condition & Next review).
5. **Cổng bảo vệ quyền riêng tư & Dữ liệu y tế (Privacy Gate):**
   - Tuyệt đối không đưa lên Trello: Mật khẩu, Tokens, Signed URLs bảo mật, Dữ liệu sức khỏe/InBody của người thật chưa xin phép, Danh tính chưa làm mờ, Thông tin tài khoản ngân hàng chi tiết.
   - Ưu tiên 100% sử dụng dữ liệu kiểm thử giả lập (Synthetic-first data) cho demos, benchmark và screenshots.

---

## 4. Phân Công Trách Nhiệm Nhóm (Team Responsibility Routing)

| Thành viên | Tên định danh | Vai trò chính | Discord handle | Reviewer độc lập mặc định |
| :--- | :--- | :--- | :--- | :--- |
| **Huỳnh Quốc Việt** | Việt, Am2uocVi3t | Điều phối sản phẩm, Quản trị Trello/Git, Bằng chứng & Hồ sơ môn học | `@2uoc_vi3t` | **Hưng** |
| **Lê Nguyễn Gia Hưng** | Hưng, hei1sme | AI/OCR data, Benchmark InBody, Đo lường chỉ số kỹ thuật | `@hei.isme` | **Việt** |
| **Dương Quang Huy** | Huy, huydqse180459 | Backend, Supabase PostgreSQL, Phân quyền RLS, Cloud & Thanh toán | `@_huymc` | **Hưng** |
| **Diệp Khai** | Khai, DiepKhai | Frontend Web Responsive, Luồng duyệt OCR, Đóng gói Android (TWA/APK) | `@nottooamaz1ng` | **Huy** |
| **Lê Văn Toàn** | Toàn, letoan8423 | UI/UX Design System, Slide báo cáo W05, Kênh Marketing & TVC | `@letoan8423` | **Khai** |

*Ghi chú về hạn chế hiện tại của Trello:* Một số thành viên chưa hoàn tất kết nối tài khoản Native Member trên bảng Trello (Việt, Toàn). Đồng thời các nhãn màu tùy chỉnh (custom labels) có thể chưa được hiển thị đầy đủ trên giao diện Trello, do đó việc phân công Owner và Reviewer luôn được quy định rõ trong phần Mô tả (Description) của từng thẻ.

---

## 5. Chi Tiết Trạng Thái 8 Danh Sách Hiện Tại

### List 00 — GUIDE & MASTER LINKS (5 cards)
1. `[MIGRATION LOG] Previous board inventory` — Lưu trữ lịch sử chuyển đổi từ Kanban cũ sang 8 danh sách chuẩn; ghi nhận các thẻ W01–W03 được backfill vào REVIEW (phân biệt rõ ràng lịch sử tái tạo và hoạt động gốc).
2. `[RULES] Trello / GitHub / Discord authority` — Thẻ quy chế xác định thẩm quyền của từng công cụ, nguyên tắc không tự duyệt và bảo mật dữ liệu y tế.
3. `[LINKS] Repository, deployed app, Figma, LMS, Discord, evidence folder` — Quản lý liên kết chính thức: Kho GitHub `https://github.com/Team-SafeTrail/fitsync-app` (đã xác thực). Các liên kết chưa có hoặc chưa công khai được ghi nhận trung thực là PENDING, không điền link giả.
4. `[TEMPLATE] Deliverable card` — Biểu mẫu chuẩn cho thẻ công việc: Tiêu đề `[W##][OC#] Động từ + Kết quả`, Owner, Contributor, Independent Reviewer, Checklist, Dependencies, GitHub Issue/PR, Done-when, Evidence links.
5. `[TEMPLATE] Weekly lecturer report` — Biểu mẫu báo cáo tuần cho Giảng viên (Cam kết đầu tuần, Thống kê thẻ, Minh chứng hoàn thành, Công việc dở dang, Blockers, Đóng góp của từng thành viên, Quyết định tuần tới).

---

### List 01 — PRODUCT BACKLOG (41 cards)
Toàn bộ các thẻ thuộc giai đoạn tương lai từ Tuần 5 đến Tuần 14:
- **W05 / OC1 Backlog (4 cards):**
  - `[W05][OC1] Select OCR provider or manual-only fallback` (Owner: Hưng, Contrib: Việt, Reviewer: Việt)
  - `[W05][OC1] Integrate secure server-only OCR draft lifecycle` (Owner: Huy, Contrib: Hưng, Reviewer: Hưng)
  - `[W05][OC1] Complete OCR correction and confirmation browser flow` (Owner: Khai, Contrib: Huy, Reviewer: Huy)
  - `[W05][OC1] Finalize truthful OCR copy and visuals` (Owner: Toàn, Contrib: Khai, Reviewer: Khai)
- **W06 / OC1 Backlog (4 cards):** Operations staging/prod (Huy), Android release candidate (Khai), Validate release OCR metrics (Hưng), Rehearse OC1 & store assets (Việt & Toàn).
- **W07 / OC1 Backlog (1 card):** Freeze and submit OC1 evidence package (Việt & All).
- **W08–W10 / OC2 Backlog (13 cards):** Pilot offer & consent (Việt), Password reset & account lifecycle (Huy), Roster & biometric trends (Khai), Measurement dictionary (Hưng), 2 Measured channel experiments (Toàn), Funnel & deletion ops (Huy), MVP UI & client events (Khai), KPI formulas (Hưng), Launch assets & UTM (Toàn), Direct gym acquisition (Việt), Online channel (Toàn), Android release maintenance (Huy), OCR demo monitoring (Hưng).
- **W11–W13 / OC3 Backlog (14 cards):** VietQR entitlement (Huy), Payment UX (Khai), Paid sales pipeline (Việt), OCR monitoring (Hưng), Conversion & feedback cycle (Việt), OCR report (Hưng), Transaction reconciliation (Huy), 3-5min Demo video (Khai), 60-90s TVC draft (Toàn), Install evidence & technical demo (Khai), Final channel report (Việt & Toàn), OCR analytics appendix (Hưng), Financial evidence & redaction (Huy).
- **W14 / ALL Final Backlog (5 cards):** Submit and defend final package (Việt), Verify frozen numbers (Hưng), Archive operational evidence (Huy), Demo & release fallback (Khai), Final media & presentation QA (Toàn).

---

### List 02 — TO DO THIS WEEK (0 cards)
- **Trạng thái:** Hiện đang có 0 thẻ. Đây là cấu trúc có chủ đích của bảng. Các công việc mới chỉ được kéo từ `PRODUCT BACKLOG` sang `TO DO THIS WEEK` khi đáp ứng đủ tiêu chuẩn Activation Gate (đã chỉ định Reviewer độc lập khác Owner, không bị vướng dependency).

---

### List 03 — DOING (5 cards)
Các công việc đang được triển khai thực tế trong sprint hiện tại:
1. `[W04][OC1] Seed test PT account with populated trainees for OCR testing` (Hưng & Việt)
   - Mục tiêu: Nạp tài khoản PT kiểm thử (`pt.test@fitsync.vn`) kèm 3–5 học viên mẫu vào Supabase để hỗ trợ Khai và Toàn test giao diện InBodyForm và luồng OCR mà không cần tạo thủ công.
   - Bảo mật: Thông tin tài khoản được bàn giao qua kênh Discord nội bộ; không công khai mật khẩu trong tài liệu.
2. `[W04][OC1] Prepare synthetic-first OCR benchmark` (Owner: Hưng, Contrib: Việt, Reviewer: Huy — Issue #2)
   - Mục tiêu: Chuẩn bị bộ dữ liệu InBody tổng hợp (synthetic-first), 5 chỉ số ground truth, phân chia dev/holdout, đo lường độ trễ và chi phí. Chưa dùng dữ liệu y tế thật.
3. `[W04][OC1] Build private OCR data foundation` (Owner: Huy, Reviewer: Hưng — Issue #3)
   - Mục tiêu: Migration bảng `ocr_attempts`, bucket riêng tư `inbody-media`, phân quyền RLS, kiểm thử bảo mật pgTAP ngăn chặn truy cập chéo giữa các PT. Quá trình trích xuất không được tự ý tạo bản ghi InBody đã xác minh.
4. `[W04][OC1] Review OCR UX and evidence assets` (Owner: Toàn, Reviewer: Khai — Issue #5)
   - Mục tiêu: Rà soát các trạng thái UI của OCR, ngôn ngữ tiếng Việt, bộ ảnh chụp màn hình, tách bạch giữa tính năng dự kiến và tính năng đã kiểm chứng. Phụ thuộc vào nguyên mẫu UI từ Issue #4.
5. `[W05][OC1] Thiết kế bộ 17 Slide trình chiếu Báo cáo Giảng viên Tuần 5 (Carbon Dark Theme)` (Owner: Toàn, Reviewer: Việt)
   - Mục tiêu: Hoàn thiện 17 slide 16:9 theo chủ đề Carbon Dark Athletic Theme phục vụ bài báo cáo 30 phút trước Giảng viên vào 16:00 Thứ Năm (08/10/2026). Tham chiếu trực tiếp `docs/W05_SLIDE_DESIGN_BRIEF_FOR_TOAN.md` và `docs/W05_PRESENTATION_SCRIPT_30MIN.md`.

---

### List 04 — REVIEW (7 cards)
Các công việc đã hoàn thành bước triển khai và đang được Reviewer độc lập nghiệm thu:
1. `[W01][OC1] Establish research and design baseline` — *Trạng thái: REVIEW — BACKFILLED*. Tái tạo lịch sử từ mã nguồn và tài liệu trong Tuần 4; không phải hoạt động Trello gốc ở Tuần 1.
2. `[W02][OC1] Verify identity, profiles, invitation, and tenant isolation` — *Trạng thái: REVIEW — BACKFILLED*. Bằng chứng RLS và xác thực tài khoản.
3. `[W02][OC1] Verify manual InBody workflow across PT and trainee views` — *Trạng thái: REVIEW — BACKFILLED*. Quy trình nhập số đo InBody thủ công.
4. `[W03][OC1] Verify daily check-in, private meal media, and PT visibility` — *Trạng thái: REVIEW — BACKFILLED*. Quy trình học viên check-in và tải ảnh bữa ăn (commit `82f9c1b`).
5. `[W03][OC1] Verify session balance and three-day warning rule` — *Trạng thái: REVIEW — BACKFILLED*. Quy tắc cảnh báo 3 ngày không check-in và quản lý buổi tập.
6. `[W04][OC1] Align M4 verification and project status` — *Trạng thái: REVIEW — APPROVED ✅*. PR #14 (Hưng / Reviewer: Việt & Khai & Huy). Đã được Tech Lead Việt phê duyệt vào 2026-10-11, sẵn sàng merge vào `main`.
7. `[W04–W05][OC1] Đợt đại tu giao diện Adaptive FitSync & Kế hoạch Unified Coaching` — *Trạng thái: REVIEW — APPROVED ✅*. Chuỗi PRs #17, #19, #21, #23 (UI Redesign) và PR #25 (ADR-004 Coaching Timeline). Đã được Tech Lead Việt phê duyệt toàn bộ trên GitHub vào 2026-10-11.

---

### List 05 — DONE (5 cards)
- **Số lượng cập nhật:** 5 thẻ.
- **Tiêu chuẩn quản trị:** Chỉ chuyển sang `DONE` khi có sự phê duyệt độc lập của Reviewer và đã gắn liên kết bằng chứng xác thực (PR đã merge, test results, biên bản).
- **Thẻ mới hoàn thành:**
  - `[W04][OC1] Prototype OCR review and decide packaging constraints` (Owner: Khai, Reviewer: Huy & Việt — Issue #4 / PR #11). PR #11 đã merge thành công vào `origin/main` ở commit `21c55ce`, hoàn tất luồng OCR Review UI, mock adapter, và Playwright E2E.

---

### List 06 — BLOCKED (1 card)
Các thẻ bị nghẽn phụ thuộc được rà soát và giải phóng:
1. `[W04][OC1] Freeze OC1 scope and evidence matrix`
   - Owner: Việt | Reviewer: Hưng
   - Điểm nghẽn: Việt hoàn tất kết nối vai trò Trello board và chốt ma trận minh chứng cho đợt báo cáo giữa kỳ W07.
   - Điều kiện gỡ nghẽn: Hoàn tất buổi thuyết trình W05 và đồng thuận ma trận rubric.
2. *(Đã gỡ nghẽn)* `[W04][OC1] Prototype OCR review and decide Android constraints`: **UNBLOCKED & DONE** nhờ PR #13 và PR #11 đã merge sạch vào `main`.
3. *(Đã gỡ nghẽn)* `[W04][OC1] Review truthful UI and evidence assets`: **UNBLOCKED** nhờ PR #11 có UI hoàn chỉnh và chuỗi PRs UI #17-#23 đã hoàn thiện bộ asset chụp màn hình đa nền tảng.

---

### List 07 — WEEKLY REPORTS & EVIDENCE (18 cards)
Danh sách này là tầng quản trị kiểm toán và lưu trữ minh chứng, không phải backlog thông thường:
- **Báo cáo tuần Giảng viên (14 thẻ):**
  - `[W01] Weekly lecturer report` ➔ `[W03] Weekly lecturer report`: *BACKFILLED — REVIEW* (Chỉ dựa trên minh chứng mã nguồn Git, không tự nhận là hoạt động Trello nguyên bản).
  - `[W04] Weekly lecturer report`: *WEEKLY REPORT — CURRENT* (Ghi nhận hiện trạng Tuần 4: PR #10, Issue #2 benchmark đang làm, Issue #3 / PR #13 review, Issue #4 / PR #11 blocked/review, Issue #5 blocked).
  - `[W05] Weekly lecturer report` ➔ `[W14] Weekly lecturer report`: *PLACEHOLDER* (Không điền trước kết quả tương lai).
- **Chỉ mục minh chứng bất biến (4 thẻ):**
  - `[OC1] Final evidence` (Chỉ mục minh chứng Chuẩn đầu ra OC1: CH Play, TWA/APK, Git history, Test reports, Demo video, Biên lai nộp bài).
  - `[OC2] Final evidence` (Chỉ mục minh chứng Chuẩn đầu ra OC2: 2 Kênh Marketing, Phễu AARRR, GA4, UTM).
  - `[OC3] Final evidence` (Chỉ mục minh chứng Chuẩn đầu ra OC3: >= 20 Paid Users, Sao kê VietQR/Napas247, TVC).
  - `[FINAL] Submission receipts and immutable links` (Biên lai nộp bài LMS, liên kết bất biến, hồ sơ hoàn chỉnh).

---

## 6. Chiến Lược Chuẩn Hóa Nhãn Dán Trello (Trello Tagging / Labeling Architecture)

Để đảm bảo Giảng viên và nhóm dễ dàng lọc, kiểm toán và theo dõi tiến độ theo chuẩn Agile, toàn bộ thẻ trên Trello được chuẩn hóa theo hệ thống 5 nhóm thẻ (Tags):

### 1. Nhóm Tag Chu kỳ Tuần (Sprint / Week Tags):
- `W01`, `W02`, `W03`, `W04`, `W05` (Sprint Hiện Tại), `W06`, ..., `W14`.
- *Quy tắc:* Mỗi thẻ bắt buộc mang đúng 1 tag tuần phản ánh thời điểm cam kết thực hiện.

### 2. Nhóm Tag Chuẩn Đầu Ra (Course Outcome Tags):
- `OC1` — Phục vụ Chuẩn đầu ra 1 (MVP Deployed CH Play / APK + Quản trị Trello/GitHub W01–W07).
- `OC2` — Phục vụ Chuẩn đầu ra 2 (Traction & 2 Kênh Marketing chủ lực W08–W10, W13).
- `OC3` — Phục vụ Chuẩn đầu ra 3 (Doanh thu >= 20 Paid Users + VietQR + TVC + Demo W11–W14).
- `ALL` — Thẻ kiểm toán chặng cuối (W14 Final Defense).

### 3. Nhóm Tag Phân Hệ Chức Năng (Domain / Area Tags):
- `Engineering` — Nhiệm vụ lập trình backend, frontend, database migration, RLS policies, CI/CD.
- `AI / OCR` — Dữ liệu InBody 270, benchmark thuật toán, tích hợp provider và adapter.
- `UI/UX / Design` — Thiết kế Figma, Design System Carbon Dark, bộ 17 slide thuyết trình, ảnh store CH Play.
- `Marketing / Growth` — Tiếp cận thực địa tại phòng gym, nội dung TikTok, gắn mã UTM, sản xuất TVC.
- `Governance / PM` — Điều phối Trello, phân công vai trò, biên bản họp, nộp biểu mẫu Google Form.

### 4. Nhóm Tag Trạng Thái & Kiểm Toán (Audit & Safety Tags):
- `EVIDENCE` — Thẻ chứa đường link hoặc file minh chứng kiểm thử/biên lai đã được xác thực.
- `BACKFILLED` — Thẻ được tái tạo lại từ lịch sử mã nguồn (dành riêng cho W01–W03), không ngụy tạo là hoạt động Trello nguyên bản.
- `PRIVACY` — Thẻ liên quan đến dữ liệu sức khỏe, tuân thủ nguyên tắc không để lộ thông tin nhạy cảm.
- `BLOCKED` — Thẻ đang bị nghẽn phụ thuộc bên ngoài hoặc kỹ thuật.

### 5. Quy Ước Đặt Tên Thẻ (Card Naming Convention):
```text
[W##][OC#] Động từ hành động + Kết quả bàn giao (Outcome)
Ví dụ:
[W04][OC1] Build private OCR data foundation
[W05][OC1] Thiết kế bộ 17 Slide trình chiếu Báo cáo Giảng viên Tuần 5 (Carbon Dark Theme)
```

---

## 7. Kế Hoạch Chuyển Tiếp Sang Tuần 5 (Week 5 Transition Plan)

Khi bước vào Tuần 5, nhóm thực hiện các bước điều phối sau:

1. **Tháo gỡ các điểm nghẽn của Tuần 4 (Unblock W04 Deliverables):**
   - Độc lập kiểm tra và merge PR #13 (M4 backend security gates) vào `main` để đóng dứt điểm Issue #3.
   - Sau khi `main` đã ổn định contract, phê duyệt và merge PR #11 (Issue #4 - Khai) để đưa thẻ nguyên mẫu OCR review từ `04 — REVIEW` sang `05 — DONE`.
   - Khi PR #11 đã có UI hoàn chỉnh, gỡ trạng thái BLOCKED cho Issue #5 (Toàn) để thực hiện rà soát UX và chụp ảnh màn hình.
   - Hưng và Việt hoàn thiện benchmark synthetic InBody (Issue #2).
2. **Kích hoạt Sprint Tuần 5 (W05 Activation):**
   - Đẩy mạnh hoàn thiện thẻ `[W05][OC1] Thiết kế bộ 17 Slide trình chiếu Báo cáo Giảng viên Tuần 5 (Carbon Dark Theme)` trong `03 — DOING` trước hạn chót 12:00 Thứ Tư (07/10) để kịp chuẩn bị cho buổi báo cáo 16:00 Thứ Năm (08/10).
   - Kiểm tra Activation Gate cho các thẻ W05 từ `01 — PRODUCT BACKLOG`:
     + `[W05][OC1] Select OCR provider or manual-only fallback` (Hưng)
     + `[W05][OC1] Integrate secure server-only OCR draft lifecycle` (Huy)
     + `[W05][OC1] Complete OCR correction and confirmation browser flow` (Khai)
     + `[W05][OC1] Finalize truthful OCR copy and visuals` (Toàn)
   - Khi thỏa mãn điều kiện (đã chỉ định Reviewer khác Owner, mã nguồn tầng trước đã merge), kéo lần lượt sang `02 — TO DO THIS WEEK` và `03 — DOING`.
3. **Báo cáo Tuần 4 & Tuần 5 (Reporting Layer):**
   - Đóng băng thẻ `[W04] Weekly lecturer report` với bộ minh chứng Tuần 4 (Form Week 4, PR #12, PR #13, PR #11).
   - Mở thẻ `[W05] Weekly lecturer report` ghi nhận các cam kết đầu tuần của Tuần 5 (Slide 17 trang, buổi thuyết trình 30 phút, tích hợp OCR provider).

---

## 8. Lịch Sử Đồng Bộ (Synchronization Log)

| Ngày (YYYY-MM-DD) | Hành động cập nhật | Người thực hiện | Trạng thái xác thực |
| :--- | :--- | :--- | :--- |
| **2026-09-29** | Khởi tạo snapshot Kanban 8 lists sau migration. Thiết lập 77 thẻ, 0 DONE, 8 REVIEW (BACKFILLED). | Việt / Antigravity | Verified ✅ |
| **2026-10-04** | Cập nhật tiến độ W04: PR #12 & PR #13 merged, PR #11 hoàn tất Round 3 polish, biểu quyết chốt slot thuyết trình W05 lúc 16:00 Thứ Năm 08/10. | Việt / Antigravity | Verified ✅ |
| **2026-10-06** | Đồng bộ chính thức theo Live Trello Board: Reconcile toàn diện 83 thẻ (5 Guide, 41 Backlog, 0 To Do, 5 Doing, 7 Review, 4 Done, 3 Blocked, 18 Reports/Evidence). Chuẩn hóa hệ thống nhãn dán Trello, tích hợp câu trả lời Form Week 4 (6 bước) và kích hoạt kế hoạch chuyển tiếp Sprint Tuần 5. | SafeTrail Lead & AI Assistant | Live Board Synced ✅ |
| **2026-10-11** | Hoàn thành Code Review toàn diện đợt 2: Tech Lead Việt phê duyệt (APPROVED) 6 PRs (#14, #25, #17, #19, #21, #23), gửi phản hồi kỹ thuật cho PR #15 (Draft). Xác nhận PR #11 đã merge vào `main` tại `21c55ce`, unblock thẻ Issue #4 và Issue #5. Cập nhật HANDOFF và tài liệu tiến trình W05. | Việt / Antigravity | GitHub & Review Synced ✅ |
