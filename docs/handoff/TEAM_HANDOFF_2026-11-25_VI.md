# FitSync EXE201 — Bàn giao cho Việt, Huy và Khai

Cập nhật 25/11/2026. Web là sản phẩm trình bày cho EXE201. Theo quyết định đã ghi của Hưng, web đầy đủ đáp ứng yêu cầu về nền tảng của giảng viên. Android U-01 là phần kỹ thuật bàn giao tiếp. Điều kiện học phần về khách trả phí và các minh chứng thực tế vẫn phải báo đúng trạng thái.

## Hiện đã có gì

| Phần | Trạng thái có bằng chứng |
| --- | --- |
| Web UI/UX mới | Candidate [PR #48](https://github.com/Team-SafeTrail/fitsync-app/pull/48) ở `4257334`. Ngày 25/11 kiểm tra GitHub thấy PR còn draft, ba nhóm CI thành công. Link Vercel cũ có giao diện cũ. URL triển khai giao diện mới còn chờ Huy xác nhận. |
| PT và học viên | PT đăng ký, tạo hồ sơ và mời học viên. Học viên nhận lời mời, xem Hôm nay, nhập check-in và xem tiến trình. PT đọc check-in, nhập và xác nhận chỉ số đo. Hệ thống còn có chat riêng, lịch chung, membership theo ngày và sổ buổi PT. Đặt lịch hay check-in không tự trừ buổi. |
| Nghiệm thu web local U-00 | Trên web ở `4257334` đã chạy đăng ký và nhận lời mời bằng dữ liệu synthetic, xác nhận check-in và chỉ số nhập tay sau reload, kiểm đăng nhập lại và PT khác bị từ chối. Các số kiểm thử CI và local khác xem theo revision trong [TEST_EVIDENCE](../TEST_EVIDENCE.md). |
| Android U-01 | Nhánh local `feat/android-u01-local`, commit `9ad9e64`. 27/27 test mobile và typecheck qua. APK debug x86_64 cài và mở được trên emulator Android 35. APK ARM64 đã build và xác minh chữ ký. Còn kiểm đăng nhập học viên synthetic đã liên kết, gửi check-in văn bản và PT thấy cùng nội dung trên web sau reload. |
| Nhập liệu nâng cao | Nhập tay và PT xác nhận có bằng chứng trên web. OCR báo cáo đầy đủ đa hãng, xác nhận từng trường/đơn vị và dữ liệu phân đoạn cơ/mỡ, voice điền form và ước tính calorie từ ảnh là hướng phát triển. Demo PDF/provider OCR chưa có benchmark. Android onboarding, ảnh, voice và OCR ngoài lát U-01. |

## Ai xử lý phần còn lại

1. **Huy — Frontend (`huydqse180459-art`).** Review UI/UX web từ head được duyệt của PR #48. Deploy preview, kiểm landing, đăng nhập và hai vai trò trên desktop/điện thoại. Phối hợp Khai kiểm môi trường. Khi rollout được duyệt, deploy UI mới lên URL chính và ghi URL, SHA và kết quả smoke test. Huy nhận APK x86_64 để chạy Android client. Dùng Metro và ADB reverse cho 54321/8081 theo [mobile runbook](../../mobile/README.md). Gửi check-in bằng học viên synthetic rồi cùng Khai đối chiếu ghi chú và ngày trả về trên ứng dụng với dữ liệu PT đọc sau khi tải lại web.
2. **Khai — Backend (`DiepKhai`).** Dựng Supabase local theo [runbook](../DEMO_WORKFLOW.md), chuẩn bị cặp PT/học viên synthetic đã liên kết và hướng dẫn Huy cấu hình client local. Kiểm Auth, RPC check-in, quyền PT đọc lại, migration/RLS và rollout flags. Xác nhận backend tương thích trước khi Huy triển khai UI mới.
3. **Việt — Slide và báo cáo (`Am2uocVi3t`).** Đợi Huy và Khai hoàn thành phần kỹ thuật và gửi SHA, URL cùng bằng chứng nghiệm thu rồi mới làm slide. Khi có bộ bằng chứng, dùng [bản tiếng Anh cho agent](AGENT_HANDOFF_EN.md), [outline](../../presentations/SLIDE_OUTLINE.md) và [bộ chuẩn bị nộp](../../reports/SUBMISSION_READY_2026-11-22.md).

Repo có `apps/web/.env.example` và `mobile/.env.example`. Khai hướng dẫn Huy cấu hình `mobile/.env.local` với URL `http://127.0.0.1:54321` và key client local tại máy chạy demo. File môi trường, khóa server và đăng nhập demo nằm ngoài tài liệu chia sẻ.

## Cách giao việc

Review tài liệu và đối chiếu issue hiện có trước khi push nhánh tài liệu. Sau đó dùng GitHub để giao người, ghi dependency, tiêu chí nghiệm thu và link PR. Xem [tracker](ISSUE_TRACKER.md) để tránh giao trùng hoặc bỏ sót issue bị chặn. Discord dùng để báo link tài liệu, issue của từng người và thứ tự làm. Việt nhận thông báo khi Huy và Khai đã ghi kết quả lên GitHub.

### Nhận nhánh bàn giao trên GitHub

```powershell
git fetch origin feat/android-u01-local
git switch --track origin/feat/android-u01-local
```

Commit `9ad9e64` là mốc code Android đã build. Có thể lấy APK debug từ người điều phối hoặc làm theo [mobile runbook](../../mobile/README.md). U-01 đọc lại trên web local dùng cùng Supabase với Android. URL hosted dùng để kiểm deployment web riêng.

## Mô hình kinh doanh và giá đã cập nhật

- PT là bên trả tiền. Học viên sử dụng kèm tài khoản PT. **Free tối đa 3 hồ sơ chưa lưu trữ**, kể cả lời mời chờ nhận. **Pro 199.000đ/PT/tháng**, không giới hạn học viên trong thời hạn và có cùng chức năng coaching. Hết hạn giữ lịch sử; việc tạo hoặc khôi phục hồ sơ theo quota Free. Không tự gia hạn.
- Quy trình dự kiến đối soát chuyển khoản thủ công. Hiện chỉ ghi nhận yêu cầu nâng cấp và còn thiếu tài khoản nhận tiền. **Actual 0/20 khách trả tiền và 0đ doanh thu thật** theo hồ sơ nộp. Kịch bản minh họa **3.980.000đ thu, 3.339.800đ chi, 640.200đ chênh lệch** có nhãn TEST.
- Chi phí AI, hỗ trợ và retention cần kiểm chứng nếu thương mại hóa sau này. Tier theo số học viên, 299.000đ, trial, hạn mức AI và Premium cho học viên là phương án nghiên cứu. Khi đánh giá lại, kiểm quota ở server khi tạo, gửi lời mời và khôi phục hồ sơ; đo rủi ro luân phiên lưu trữ, chi phí AI của roster lớn và ảnh hưởng lên quyền đọc lịch sử. Quyết định hiện hành ghi dự án dừng kinh doanh sau học phần.

## Bộ gửi trước và tài liệu tra cứu

**Bộ chính gồm 7 tài liệu.** Bắt đầu từ bản tiếng Việt này hoặc [bản agent tiếng Anh](AGENT_HANDOFF_EN.md), rồi đọc [feature EN](product/FEATURES.md), [feature VI](product/FEATURES_VI.md), [luồng người dùng](product/USER_FLOWS.md), [thiết kế web và Android](product/DESIGN.md) và [hướng dẫn agent](product/AGENTS.md). Việt dùng bộ slide và báo cáo hiện có sau khi kỹ thuật bàn giao bằng chứng.

| Nhóm | Tài liệu và file cần giữ |
| --- | --- |
| Bàn giao sản phẩm | [Handoff tổng](../HANDOFF.md), [bộ web/database v1](README.md) với danh mục luồng người dùng, work packages, issue, runbook, UI và SQL, [MVP scope](../MVP_EXECUTION_PLAN.md), [quyết định chủ sản phẩm](../PRODUCT_DECISIONS.md), [team playbook](../TEAM_PLAYBOOK.md), [AGENTS](../../AGENTS.md) và [DESIGN](../../DESIGN.md). Bộ v1 ghi mốc PR #31; release candidate của lượt này là PR #48. |
| Chạy và kiểm | [Demo workflow](../DEMO_WORKFLOW.md), [test evidence](../TEST_EVIDENCE.md), [biên bản U-00](../evidence/U00_LOCAL_VERIFICATION.md), [Android ADR](../architecture/adr-003-android-packaging-path.md) và [mobile runbook](../../mobile/README.md). APK debug x86_64 và ARM64 có thể nhận từ người điều phối. |
| Mô hình và tài chính | [Financial report](../../reports/FINANCIAL_REPORT.md), [nghiên cứu giá](../plans/BUSINESS_MODEL_REVIEW.md), [customer insights](../../reports/CUSTOMER_INSIGHTS.md) và [mentor evidence](../../reports/MENTORING_EVIDENCE.md). |
| EXE201 | [Chỉ mục nộp bài](../../reports/SUBMISSION_READY_2026-11-22.md), [final delivery](../../project-management/FINAL_DELIVERY.md), [gap analysis](../../project-management/EXE201_GAP_ANALYSIS.md), [final PDF](../../reports/FINAL_REPORT_SUBMISSION.pdf), [bản thảo 5 phần](../../reports/FINAL_REPORT_DRAFT.md), [readiness](../../reports/FINAL_REPORT_READINESS.md), [W8/W9 progress](../../reports/WEEK_08_09_PROGRESS_REPORT.md), [W8 Form](../../reports/WEEK_08_FORM.md), [W9 Form](../../reports/WEEK_09_FORM.md) và [bản copy form](../../reports/GOOGLE_FORM_COPY_W8_W9.html). |
| Slide và demo | [Canva/edit & QA](../../presentations/CANVA_DELIVERY.md), [outline](../../presentations/SLIDE_OUTLINE.md), [script](../../presentations/WEEK_08_09_SCRIPT.md), [deck PDF](../../presentations/FitSync_Week_08_09.pdf), [product review](../../reports/LOCAL_PRODUCT_REVIEW.html), [database review](../../reports/DATABASE_REVIEW.html), [video index](../../presentations/demo-videos/README.md) và [delivery links](../../reports/DELIVERY_LINKS.md). |
