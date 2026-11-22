# Customer Acquisition Plan và analytics

**Checkpoint22/11/2026:** localWindows đã cài Docker/WSL2 theo chấp thuận, không reboot; production build/start và4/4demo PASS. CI0ba9821:114domain/363SQL fresh+upgrade/28core+4demo khôngretry. Cloud đọc lại22/11 vẫn27Auth/17synthetic/10candidate;0/20paid theo xác nhận owner gần nhất. [Evidence hiện hành](TEST_EVIDENCE.md). Các snapshot lịch sử bên dưới giữ nguyên thời điểm.

18/11/2026. Kế hoạch phục vụ hoàn thành học phần; nhóm sẽ dừng kinh doanh sau môn. Các target dưới đây chưa phải kết quả chiến dịch.

## Đối tượng và kênh

PT độc lập ở Việt Nam là người sử dụng/chủ thể trả phí đề xuất; học viên là người dùng cùng PT. Năm kênh có thể thử: cộng đồng Facebook PT, Zalo follow-up/onboarding, TikTok demo ngắn, YouTube walkthrough và giới thiệu qua PT/network. Instagram/LinkedIn là phương án phụ. Các handle cũ trên Trello chưa thay link bài đăng và số liệu thời gian cụ thể.

Đề xuất ưu tiên Facebook cộng đồng PT để tìm người phù hợp và Zalo để hỗ trợ demo/onboarding. Chưa có export channel metrics để gọi đây là hai kênh hiệu quả nhất. Với yêu cầu >=2 acquisition channels của final, Zalo hỗ trợ chưa chắc là một acquisition channel độc lập: cần log nguồn đầu vào và bổ sung referral/direct PT outreach thành kênh tuyển thứ hai nếu không chứng minh được Zalo tạo lead mới. Không cộng reach 5 nền tảng thành unique people.

## Kế hoạch đạt 60 tài khoản

Giả định tạm để lập kế hoạch: tính cả hai vai trò, mục tiêu 20 PT + 40 học viên. Baseline hiện có 10 tài khoản ngoài seed, gồm 5 PT + 5 học viên. Khoảng cách là 50, gồm 15 PT + 35 học viên nếu baseline hợp lệ và còn tham gia. Nếu giảng viên chỉ tính PT, kế hoạch phải đổi thành thêm 55 PT; không dùng tổng 60 hai vai trò để báo đạt 60 PT. Có 20 PT đăng ký chưa chứng minh 20 PT trả phí; cần đo conversion và điều chỉnh pipeline trong thời gian môn.

| Giai đoạn tương đối, chỉ bắt đầu khi bản dùng thử đủ điều kiện | Hành động/target thử | Bằng chứng cần |
|---|---|---|
| D 1–D 2 | Xác minh cohort, chốt offer có giới hạn và demo nhập tay; chuẩn bị hướng dẫn 2 vai trò | Danh sách ẩn danh loại team/test; version; checklist acceptance |
| D 3–D 7 | Tiếp cận 90 PT phù hợp ở 2 nguồn; mục tiêu thử 30 phản hồi, 22 demo và 15 PT đăng ký mới | Log outreach có đồng ý, channel/source, ngày, demo result |
| D 5–D 10 | 15 PT mới mời tổng cộng 35 học viên, ví dụ 10 PT mời 2 và 5 PT mời 3 | Auth ID ẩn danh, invitation accepted, loại trùng |
| D 8–D 14 | Hỗ trợ hoàn thành nhập tay/PT review/check-in và đo sử dụng lại | Event/DB receipt không chứa số đo; lý do bỏ dở |

Các tỷ lệ 30/90,22/30,15/22 và số học viên được mời là **giả định thử**, không dự báo chắc chắn. Thời hạn D 1–D 14 là lịch tương đối, không phải deadline LMS. Nếu thời gian môn không đủ, trình bày khoảng thiếu và ưu tiên minh chứng đã có. Không tự nhắn người khác, đăng bài hay chạy quảng cáo trong lượt này.

## Lịch nội dung 7 bài đề xuất

| Ngày | Kênh | Nội dung | CTA | Evidence khi thực hiện |
|---|---|---|---|---|
| D 1 | Facebook | Vấn đề tìm lại thông tin coaching và mời thử tác vụ | Đặt lịch demo có đồng ý | URL bài, reach/click theo ngày |
| D 2 | Zalo | Hướng dẫn nhận invite và đăng nhập | Hoàn thành invite | Log hỗ trợ ẩn danh |
| D 3 | Facebook | Video luồng nhập tay và PT xác nhận | Xem demo thật | Video/version và click |
| D 4 | YouTube | Walkthrough 3–5 phút, ghi rõ dữ liệu synthetic | Mở website | URL và nguồn traffic |
| D 5 | Facebook | Case thao tác theo hồ sơ, không hứa tiết kiệm giờ chưa đo | Đăng ký thử | UTM và registration |
| D 6 | Zalo | Hỗ trợ check-in, thu phản hồi tác vụ | Check-in/feedback tự nguyện | Event và review được phép trích |
| D 7 | Referral PT | Mời PT phù hợp qua người đang thử, chưa áp incentive chưa duyệt | Demo | Nguồn lead và chống đếm trùng |

Roster edit/archive có trong ứng viên PR48 và CI; production chưa rollout. OCR provider thật chưa đủ evidence để quảng cáo đã hoạt động. Video mới nên demo tạo hồ sơ/nhập tay/nhận invite trong stack synthetic được cô lập, hoặc gắn nhãn rõ public tour.

## Weekly metrics và funnel

Mỗi dòng báo cáo cần `week_start_ict`, `week_end_ict`, `channel`, `content_url`, `reach`, `clicks`, `registrations_pt`, `registrations_trainee`, `activated_pairs`, `paid_pt`, `cash_received_vnd`, `spend_vnd`, `evidence_url`. Dùng `unknown` khi thiếu, không điền 0. Tổng reach giữa kênh không thể de duplicate khi thiếu source identity.

Snapshot17/11: 27 Auth; 17 synthetic; 10 candidate gồm 5 PT+5 học viên; 10 email confirmed và từng sign-in; 0 candidate last-sign-in 7 ngày; 0 candidate record/check-in; 4Pro/1Free trong 5 PT. Có 9 candidate tạo 27/10 và 1 tạo 29/10. Đây là các tài khoản còn tồn tại tại snapshot, không phải hệ thống đăng ký lịch sử đầy đủ sau các lần xóa tài khoản. Cloud chưa có attribution/ledger mới. Ứng viên có ledger append-only và product_events, chưa rollout; không phục dựng lịch sử.

Funnel hiện tại: awareness **unknown** → clicks **unknown** →10 candidate registrations →10confirmed/ever signed-in →0 cặp đạt activation đề xuất →paid **0 theo owner**. Không tính click-to-signup, CAC hay trial-to-paid khi thiếu mẫu số và kỳ đo phù hợp.

Định nghĩa activation đề xuất: một cặp PT/học viên đã nhận invite, có record được PT xác nhận và có check-in trong 7 ngày của cohort onboarding. Không lấy last_sign_in_at làm WAU coaching. Retention cần cohort đủ thời gian và event log, chưa tính được.

## Đo lường hiện có trong ứng viên

PR48/migration finance_and_product_analytics có 9 event keys: registered, workspace_opened, trainee_created, invitation_accepted, inbody_confirmed, checkin_submitted, chat_sent, appointment_created, upgrade_requested. Server triggers/RPC ghi tác vụ và nguồn tự khai báo trong allow-list; workspace_opened dedupe theo ngày ICT, synthetic bị loại. Không ghi health/chat/ảnh/PII/URL. Admin tổng hợp tuần/kênh, chưa GA4 hoặc client-side reach/click tracking, chưa rollout cloud. Không coi nguồn tự khai báo là attribution đo đầy đủ. Kết quả actual đến xác nhận owner vẫn 0 paying PT; ngân hàng chưa có.

Kế hoạch 14 ngày dưới đây là thiết kế học thuật/hồi cứu. Đến 18/11 không còn 14 ngày trước hạn19/11, nên không cam kết 60 accounts hoặc 20 paid trước hạn. Không tự phát outreach/ads hoặc seed số để báo đạt.

## Event dictionary mở rộng đề xuất, chưa tích hợp GA4

Chưa thấy GA4/gtag/GTM/dataLayer trong source. Internal product_events ở trên đã có; bảng mở rộng dưới đây là kế hoạch, không gọi tất cả 12 event đã implement. Không báo card GA4 hoàn thành. Nếu triển khai sau review, chỉ page landing marketing nhận measurement có đồng ý; không gửi URL lời mời/token hoặc đường dẫn chứa ID hồ sơ tới analytics.

| Event nội bộ | Trigger | Allow list tối thiểu | Test bắt buộc |
|---|---|---|---|
| signup_started | Mở/bắt đầu form | surface, method |1 lần/session có đồng ý|
| signup_completed | Auth confirm thành công | method, role; GA4 map sign_up |Không fire khi lỗi|
| trainee_created | Server tạo hồ sơ thành công | role |Không ID/name/phone|
| invitation_accepted | RPC accept thành công | role |Không token/querystring|
| inbody_manual_started | Bắt đầu nhập tay | surface |Không giá trị số đo|
| ocr_attempted | Adapter bắt đầu hợp lệ | provider_mode |Không ảnh/path/payload|
| inbody_verified | PT xác nhận lưu thành công | source_mode |Không health values|
| checkin_submitted | Server lưu check-in | photo_present boolean |Không ảnh/note|
| warning_viewed | Mở queue cảnh báo | surface |Không health/account ID|
| zalo_message_copied | Copy chủ động | surface |Không nội dung/tel|
| upgrade_viewed | Mở offer được duyệt | plan_code |Không coi là paid|
| payment_verified | Đối soát người có quyền | plan_code, currency |Idempotency; không biên lai/PII|

Đây là thiết kế đo lường, chưa phải chứng nhận pháp lý hay triển khai consent. Chưa có owner/reviewer được tự gán trong lượt này. Consent/withdrawal/retention/deletion cần khớp policy và khả năng vận hành trước pilot. Không ghi credential hoặc dữ liệu sức khỏe vào Trello/GA4/log.
