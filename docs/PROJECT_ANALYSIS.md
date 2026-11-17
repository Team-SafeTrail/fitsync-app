# FitSync — Project Analysis

Đối soát 17/11/2026, main `3c816e9`. Phân loại: **Verified** = có nguồn/test cụ thể; **Reported** = tài liệu nhóm báo, chưa tái xác minh gốc; **Hypothesis/Plan** = cần thử. Quyết định mới của nhóm: dừng kinh doanh sau khi hoàn thành EXE201.

## A. Product Overview

FitSync là không gian coaching cho PT và học viên tại Việt Nam, nhằm giảm việc nhập và tìm thông tin phân tán giữa bảng tính, tin nhắn cá nhân và phiếu đo. PT tiếp nhận học viên, lưu số đo đã xác nhận, xem tiến trình và đồng hành qua check-in; các miền chat/lịch/context mới còn cần rollout. Người dùng học viên xem dữ liệu của mình và tương tác với PT.

Giá trị đề xuất là giữ bối cảnh của một học viên trong cùng hồ sơ, có validation và quyền truy cập theo quan hệ. Chưa có phép đo chứng minh tiết kiệm 10 giờ/tuần, tăng doanh thu hoặc tăng retention. Khác biệt tiếng Việt/quy trình coaching địa phương là giả thuyết định vị cần thử, chưa chứng minh đối thủ không làm được.

Khách mục tiêu hiện hành là PT độc lập có học viên đang được coach; PT là người trả thuê bao đề xuất, học viên dùng cùng PT. Chủ gym nhiều PT, iOS, voice/community và wearable là mở rộng trước đây, không phải capability core đã nghiệm thu. Giữ cách phân biệt PT cá nhân với tổ chức khi áp điều kiện trả phí của guideline.

## B. Product Architecture

[ARCHITECTURE](ARCHITECTURE.md) mô tả npm monorepo, Next14/React18, Supabase Auth/PostgreSQL/RLS/private Storage, Server Actions và adapter OCR. Code chính ở `apps/web`; migrations ở `supabase/migrations`; CI ở `.github/workflows`.

Luồng cốt lõi: PT đăng ký → tạo hồ sơ/link mời → học viên nhận invite → PT nhập tay/đối chiếu/xác nhận → học viên xem/check-in → PT theo dõi. OCR chỉ hỗ trợ draft và không tự lưu; fake adapter không là provider thật. Tiền membership/gói buổi của PT tách thuê bao FitSync. Membership theo ngày khác số buổi PT, chưa có ledger completion/reversal.

## C. Product Status

| Miền | Source/test | Cloud/demo hiện tại |
|---|---|---|
| Landing/auth/legal/public tour | Local build và 16 browser checks qua17/11 | Website home/login200; workspace307/login. Tour dùng fixture |
| Identity/invite/nhập tay/check-in/quyền | Code main, 103 domain tests mới; authenticated synthetic acceptance lịch sử | Có DB 8 miền core; chưa chạy lại end-to-end hai vai trò trong phiên này |
| Progress Weight/SMM/PBF | Component và unit/SSR tests, ảnh synthetic có nguồn | Không suy ảnh là tính năng đang live trên đúng deploy SHA |
| Chat/lịch/membership/notes | Có 3 migration additive và acceptance CI lịch sử |4 bảng GET limit 0 trả 404/PGRST205 quaRESTcloud17/11; chưa có bằng chứng rollout |
| Password reset đầy đủ | PR 47 mở base dev | Chưa nhập main, chưa xác minh email production |
| Roster edit/archive | Source actions kiểm tra có create/record/check-in/session; chưa xác minh edit/archive theo cardW 8 | Không gọi cardW 8 đã xong |
| OCRprovider/fullPDF | Adapter draft/fallback có; provider thật và full report chưa hoàn tất | Chưa đủ benchmark/consent/provider; accuracy/latency unknown |
| Android/billing/GA4 | Có kế hoạch/issues; chưa thấy client analytics integration trong src | Chưa có bằng chứng release/payment/event delivery |

**Technical debt và bug/risk:** source–cloud drift; metadata/handoff cũ; auth delivery còn PR; legacy authorization/ops/retention/abuse chưa qua đầy đủ gate; mutable session balance; schema 5 field chưa đủ full InBody; telemetry chưa triển khai. Không coi risk là exploit đã tái hiện. Trong các check local đã chạy chưa tái hiện lỗi nghiêm trọng của public demo, nên không rewrite app hoặc sửa task đang trùng PR 47. Full demo market-ready chưa thể chứng nhận.

## D. Business & Marketing Analysis

### Business Model Canvas

| Ô | Nội dung và mức xác nhận |
|---|---|
| Customer segments | PT độc lập ởVN, học viên củaPT; chưa có cỡ thị trường đại diện |
| Value proposition | Hồ sơ có ngữ cảnh, nhập tay có kiểm tra, tiến trình và follow-up. Hiệu quả giảm nhập/tìm cần đo |
| Channels | Facebook/community, Zalo onboarding, referral/directPT, video; selection còn giả thuyết |
| Relationships | Assisted onboarding và hỗ trợ có giới hạn; chưa hứa SLA24/7 |
| Revenue | Thuê baoPT tham chiếu 199 k/tháng; chưa xác nhận paid actual |
| Key activities | Duy trì core, RLS/ops, demo, đo activation, đối soát học phần và bàn giao |
| Key resources | Code, schema, thời gian team, test synthetic, môi trường web/cloud |
| Key partners | Hạ tầng Vercel/Supabase là vendor, không tự gọi là đối tác thương mại đã ký; PT thử là nhóm cần xác nhận |
| Costs | Hạ tầng/AI/marketing/thu tiền/công/support; actual thiếu ledger, dự toán tách riêng |

### Persona và segmentation/STP

Persona giả thuyết chính: PT đang phải tra cứu thông tin học viên qua nhiều công cụ, thường dùng điện thoại trong ca tập và máy tính khi chuẩn bị coaching. Nhu cầu: mở nhanh đúng hồ sơ, tránh nhập nhầm, biết ai cần follow-up. Buyer/user/champion có thể cùng mộtPT; học viên là người dùng thứ hai, quan tâm xem kết quả và gửi cập nhật riêng tư. Không đặt tên, thu nhập hoặc độ tuổi giả như khách đã phỏng vấn.

Phân đoạn theo vai trò, cách coaching (online/hybrid/trực tiếp), số học viên và mức phân mảnh workflow. Chọn phân đoạn PT độc lập có cohort sẵn và đồng ý thử tác vụ; tránh multi-branch gym ở giai đoạn này. Định vị đề xuất: workspace coaching tiếng Việt có bước PT xác nhận, không chỉ máy quét/calorie tracker. Anti-persona hiện tại: tổ chức cần quản trị nhiều PT, medical decision/diagnosis, yêu cầu iOS/Android đã phát hành hoặc thanh toán tự động đầy đủ.

### Research và TAM/SAM/SOM

[Survey evidence](research/survey-evidence.md) ghi 104 responses, 84 chọn trên 3 giờ admin/tuần, 73 quản lý ít nhất 5 học viên, 101 dùng tool mix cóZalo/Messenger. Đây là tổng hợp nội bộ lịch sử, chưa tính lại raw trong phiên. Mẫu không xác suất, có open-text gần trùng; không suy ra đại diện cho toàn bộPTVN hoặc FitSync đã giải quyết vấn đề. README cũ ghi 92, nên giữ nguồn 104 có ngày và hạn chế, không trộn mẫu.

Không tínhTAM/SAM/SOM bằng cách lấy doanh thu fitness toàn cầu nhân thị phần tự đặt. Chưa có sốPT mục tiêu, khả năng tiếp cận và willingness-to-pay đại diện đủ tin cậy; ghi **not estimated**. Chi phí/người, funnel giả định không phải market size.

### SWOT

| Strengths | Weaknesses |
|---|---|
| Baseline source/test/RLS và luồng 2 vai trò; nhập tay/PT review | Drift cloud, chưa activation ngoài seed, auth/ops/provider/billing/mobile còn thiếu |
| Opportunities | Threats |
| Thử workflow PT địa phương, học từ cách users dùng tác vụ thật trong môn | Đối thủ mature/free tiers, thói quenExcel/Zalo, onboarding khó, chi phí health data/support |

### Competitor benchmarking

Đọc official pricing17/11: [Trainerize](https://www.trainerize.com/pricing/), [Everfit](https://everfit.io/pricing/), [TrueCoach](https://truecoach.co/pricing/). Cả ba quảng bá nhiều chức năng coaching/clientmanagement; không lặp lại bảng cũ “đối thủ không có” hoặc “phải VPN” khi chưa có trial/evidence. Trainerize trang có bảng vàFAQ số giá khác nhau, không chọn một giá để tuyên bố FitSync rẻ nhất. Everfit công bố Starter free 5 clients và Pro monthly từ 19 USD/5 clients; TrueCoach có billing toggle nên số hiển thị phải kèm kỳ/điều kiện, chưa chuẩn hóa bảngso sánhFX.

Hàm ý: chỉ có giá thấp hoặc gộp tool chưa đủ tạo lợi thế. Cần chứng minh PT hoàn thành intake/tra cứu/coaching nhanh hơn trong pilot. Profile nguồn ngắn nằm ở `../competitor-profiles/`. Chưa có SEOtraffic/marketshare/reviewscore được đo.

### Pricing, costs và GTM

Giữ 199.000 đ/PT/tháng là tham chiếu theo quyết định hiện hành, không tự thay giá hoặc hứa unlimited. Offer cần rõ active-roster cap, AI allow an ce, người trả, support và hủy/hoàn tiền. WTP49k/99k cũ chưa có raw 4 câu/đường giao để tái lậpOPP, không chứng minh revenueoptimal.

[FINANCIAL_REPORT](../reports/FINANCIAL_REPORT.md) tách actual unknown khỏiBEP 17 cash/47 tính công theo kịch bản. [CAP_AND_ANALYTICS](CAP_AND_ANALYTICS.md) có 5 kênh đề xuất, lịch 7 bài, kế hoạch 60 tài khoản, event dictionary 12 event và metric contract. Mốc 60 không đồng nghĩa 20 paying PT. Không gửi outreach/đăng bài/chạy ads trong lượt này.

### Risks & assumptions

-10 candidate có thể vẫn có team/test, cần owner xác minh độc lập; cohort phỏng vấn 4 PT+6 học viên không tự trùng 5 PT+5 học viên trên DB.
-4 Pro không chứng minh thanh toán; claim3paid/1500reach/210click/SUS cũ chưa đủ nguồn gốc.
-6weeks/14weeks/Trello không thay ngày LMS; báo cáo hiện là hồi cứu.
-Kịch bản tài chính không là chứng từ, giá trị time-saving chưađo.
-Quyết định dừng sau học phần thay kế hoạch mở rộng 5 năm; owner cần bàn giao và xử lý nghĩa vụ hiện có, chưa tự tắt dịch vụ/xóa dữ liệu.
