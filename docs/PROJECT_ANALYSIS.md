# FitSync — phân tích dự án

**Checkpoint22/11/2026:** localWindows đã cài Docker/WSL2 theo chấp thuận, không reboot; production build/start và4/4demo PASS. CI0ba9821:114domain/363SQL fresh+upgrade/28core+4demo khôngretry. Cloud đọc lại22/11 vẫn27Auth/17synthetic/10candidate;0/20paid theo xác nhận owner gần nhất. [Evidence hiện hành](TEST_EVIDENCE.md). Các snapshot lịch sử bên dưới giữ nguyên thời điểm.

Đối soát18/11/2026 trên ứng viên PR48, không phải trạng thái đã rollout của website. Verified chỉ dùng cho nguồn/kiểm thử nêu rõ; Owner-confirmed là quyết định trực tiếp; Reported là tài liệu nhóm chưa kiểm lại gốc; Scenario/Hypothesis không phải actual.

## A. Product Overview

FitSync là workspace coaching cho PT độc lập và học viên tại Việt Nam. Vấn đề giả thuyết là thông tin tiếp nhận, số đo, lịch và trao đổi phân tán giữa bảng tính/tin nhắn/phiếu đo. Giải pháp giữ một hồ sơ có ngữ cảnh, có bước PT kiểm và xác nhận, rồi đồng hành bằng check-in, chat, lịch và tiến trình. Chưa có phép đo chứng minh tiết kiệm giờ, tăng retention hoặc kết quả sức khỏe.

Buyer là PT cá nhân; học viên dùng cùng PT. Use cases chính: tiếp nhận/invite, nhập số đo, tra cứu tiến trình, nhận check-in, quản lý lịch và số buổi, chia sẻ hướng dẫn. Chủ gym nhiều PT, voice/wearable/community không tự thuộc core. Ngôn ngữ tiếng Việt và workflow địa phương là giả thuyết khác biệt, chưa chứng minh đối thủ không làm được.

## B. Product Architecture

Next.js15.5.29/React19.3.1, npm monorepo, Supabase Auth/PostgreSQL/RLS/private Storage, Server Actions và adapter OCR;20 bảng/14 migrations. [ARCHITECTURE](ARCHITECTURE.md) là mô tả hiện hành; migrations/types là nguồn cấu trúc. Không có backend REST tách riêng hoặc app Android bắt buộc cho bài nộp.

Luồng: PT đăng ký →tạo hồ sơ/link mời →học viên nhận →PT nhập/đối chiếu/xác nhận →học viên xem/check-in →PT theo dõi. Chat/notes/lịch cùng kiểm quan hệ. Membership theo ngày khác số buổi PT và thuê bao FitSync. Chỉ completion được xác nhận mới tiêu thụ buổi; ledger lưu lịch sử/đảo một lần. Sổ tài chính private/append-only khác dữ liệu coaching.

## C. Product Status

| Miền | Hiện trạng ứng viên | Giới hạn |
|---|---|---|
|Auth/roster|Reset PKCE, invite/reissue/revoke, edit/archive/restore, optimistic version|PR47 tích hợp trên branch riêng, chưa merge main|
|Số đo/progress/check-in|Manual5 chỉ số/PT confirm, trends, ảnh private, cảnh báo ngày Việt Nam|Không coi draft nutrition là chỉ định y tế|
|Chat/context|Tin nhắn persist hai chiều, notes private/shared, membership revisions|Chưa read receipts/realtime full hoặc SLA|
|Lịch/buổi|Đổi/hủy đề nghị/chấp nhận, overlap/version, completion/reversal ledger|Không tự trừ buổi khi tạo lịch/check-in; không tái tạo attendance cũ|
|Offer/admin/finance|Free 3/Pro, admin RPC DB thật, evidence private/hash, CSV, test exclusion|Bank receiver chưa có; chưa thu tiền thật|
|Analytics|9 event keys trong DB, nguồn tự khai báo, weekly aggregate loại synthetic|Chưa rollout; không phục dựng reach/click/attribution cũ|
|Local demo|Launcher isolated và seed 29 synthetic accounts/22 TEST entries; CI seed hai lần và 3 UI tests qua ởeec 05 d 2|Windows chưa Docker/WSL2 tại lần kiểm; không giả vờ đã chạy local DB|
|Cloud/production|8 bảng core, RLS,21 policies/2 private buckets qua catalog chỉ đọc|12 bảng ứng viên chưa rollout; Huy giữ website|

Lần kiểm local 114 domain tests/lint/typecheck/build qua. CIeec 05 d 2 fresh/upgrade363 SQL assertions qua,28 browser hoàn tất với 1 retry,3 bài demo qua. Bản sửa check-in tiếp theo đang kiểm; [TEST_EVIDENCE](TEST_EVIDENCE.md) ghi đúng revision. Không dùng bảng này làm chứng nhận production/market readiness.

Technical debt: full-report/PDF và provider benchmark, nutrition publication/multi-meal/workout mở rộng, retention/delete/support/abuse và vận hành dữ liệu sức khỏe thật. Production rollout cần review; không nhập schema snapshot thay migrations. Ngân hàng và nghĩa vụ kỳ dịch vụ khi dừng còn quyết định owner. Không gọi risk là exploit đã tái hiện.

## D. Business & Marketing Analysis

### Business Model Canvas

| Ô | Nội dung và mức bằng chứng |
|---|---|
|Segments|PT độc lập và học viên của PT; buyer PT, không tự mở sang gym tổ chức|
|Value|Hồ sơ/coaching có ngữ cảnh và PT confirm; hiệu quả cần đo|
|Channels|Facebook/community +referral/direct đề xuất; Zalo onboarding, YouTube demo|
|Relationships|Onboarding có hỗ trợ; không hứa24/7/SLA chưa vận hành|
|Revenue|Owner chốt 199.000đ/PT/tháng; actual 0 paying theo owner|
|Activities|Phát triển/kiểm quyền, hỗ trợ demo, đối soát học phần, bàn giao/kết thúc|
|Resources|Source/schema, thời gian nhóm, synthetic tests, web/cloud; local Docker đang chờ|
|Partners|Vercel/Supabase là vendor, chưa có partnership thương mại đã ký|
|Costs|Hạ tầng/AI/marketing/công/support; actual thiếu ledger, dự toán tách riêng|

### Persona, segmentation và positioning

Persona giả thuyết: PT phải tra thông tin qua nhiều công cụ, dùng phone trong ca tập và desktop khi chuẩn bị. Muốn mở đúng hồ sơ, tránh nhập nhầm và biết ai cần follow-up. Học viên quan tâm dữ liệu của mình, lịch và cập nhật riêng tư. Không tạo danh tính/phỏng vấn giả. Segment theo online/hybrid/trực tiếp, mức phân mảnh tác vụ và cohort sẵn để thử; chưa lấy số 5–20 học viên như ràng buộc owner. Anti-persona hiện tại là tổ chức cần nhiều PT/chi nhánh hoặc yêu cầu chẩn đoán y tế.

### Research / TAM / SAM / SOM

[Survey evidence](research/survey-evidence.md) ghi 104 responses,84 chọn trên 3 giờ admin/tuần,73 quản lý ít nhất 5 học viên,101 dùng tool mix có Zalo/Messenger. Đây là tổng hợp lịch sử, chưa tính lại raw lượt này; mẫu không xác suất/có open text gần trùng, không đại diện toàn PT Việt Nam. README92 cũ không thay nguồn 104 có ngày. Chưa đủ số PT mục tiêu/khả năng tiếp cận/WTP đại diện để ước lượng TAM/SAM/SOM; không nhân thị trường fitness toàn cầu với thị phần tự đặt.

### SWOT và cạnh tranh

| Strengths | Weaknesses |
|---|---|
|Workflow hai vai trò, manual/PT review, RLS và kiểm thử|Chưa activation ngoài seed/paid; drift cloud và vận hành còn gate|
| Opportunities | Threats |
|Thử workflow PT địa phương trong học phần và học từ tác vụ thật|Đối thủ mature/free, thói quen Excel/Zalo, onboarding và chi phí dữ liệu sức khỏe|

Nguồn chính thức đã đọc17/11: [Trainerize](https://www.trainerize.com/pricing/), [Everfit](https://everfit.io/pricing/), [TrueCoach](https://truecoach.co/pricing/); chi tiết ở `../competitor-profiles/`. Các nền tảng đều có coaching/client management; chưa trial đủ để tuyên bố thiếu tính năng hoặc cần VPN. Giá có billing/điều kiện khác nhau, chưa chuẩn hóa FX, không claim FitSync rẻ nhất. Cần chứng minh workflow giúp PT hoàn thành tác vụ, thay vì coi giá thấp là khác biệt đủ mạnh.

### Offer, cost và GTM

Owner chốt Free tối đa 3 hồ sơ chưa lưu trữ (pending giữ slot), Pro199.000đ/tháng không giới hạn khi còn hạn, cùng coaching. Hết hạn giữ hồ sơ cũ; tạo/restore theo cap Free. Manual transfer cần admin đối soát; chưa bank receiver. Chưa có giao dịch thật. [FINANCIAL_REPORT](../reports/FINANCIAL_REPORT.md) tính BEP 17 cash/47 tính công theo giả định; không là lợi nhuận thực.

[CAP](CAP_AND_ANALYTICS.md) có 5 kênh và 2 acquisition sources đề xuất. Chưa export thực cùng kỳ. Plan 14 ngày/60 users là học thuật, không còn thời gian thực hiện trước 19/11; synthetic bị loại KPI.0/20 paying PT chưa đáp ứng condition. Nhóm dừng sau môn; GTM dài hạn chỉ là bài học, không cam kết chạy ads/outreach hoặc mở rộng. Không gửi tin cho khách/đăng bài trong lượt này.

### Risks & Assumptions

10 candidate có thể còn team/test;4 Pro không là paid;10 interviewees 4 PT+6 học viên không tự trùng cohort 5+5. Claim cũ 3 paid/1.500 reach/210 clicks/SUS thiếu raw đã loại. Giá 49k/99k cũ bị thay bởi quyết định 199 k. Demo/financial scenarios không phải survey, traction hoặc chứng từ. Hạn/LMS/receipt không suy từ Trello. Trước dữ liệu thật cần consent/governance/retention review; kết thúc sau môn phải rà nghĩa vụ và quyền, không tự xóa dữ liệu.
