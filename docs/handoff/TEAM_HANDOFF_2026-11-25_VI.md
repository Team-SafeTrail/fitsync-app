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

1. **Huy — Web release và môi trường local.** Lấy head được người review duyệt từ PR #48, xác nhận project Vercel, migration và cờ cần thiết trên môi trường dự kiến. Deploy preview và cùng Khai kiểm trên desktop/điện thoại. Sau khi người có quyền duyệt release, deploy UI/UX mới lên URL chính và gửi Việt URL, commit SHA và kết quả smoke test. Kiểm landing, đăng nhập, hai vai trò và một luồng đọc lại check-in. Nếu DB production chưa tương thích, giữ preview cho review đến khi có kế hoạch migration và rollback được duyệt. Dùng [runbook](../DEMO_WORKFLOW.md) để dựng backend local và cấu hình publishable/anon key local cho Khai.
2. **Khai — Android U-01.** Nhận commit `9ad9e64` từ worktree Android và xác nhận quyền truy cập source trước khi nhận việc từ xa. Dùng APK x86_64 trên emulator và [mobile runbook](../../mobile/README.md). Cấu hình `mobile/.env.local` bằng đích `http://127.0.0.1:54321` và publishable/anon key của stack đó. Cấu hình ADB reverse cho cổng 54321 và 8081 rồi chạy Metro. Vào bằng học viên synthetic đã liên kết, gửi ghi chú mới, kiểm nội dung và ngày server trả về rồi mở lại hồ sơ bằng PT phụ trách trên web. Ghi SHA, ngày, môi trường và kết quả. Hỏi Huy về cấu hình nếu stack local chưa chạy. Android thử được trên laptop và không cần điện thoại.
3. **Việt — Slide và báo cáo.** Đọc [bản AI tiếng Anh](EXE201_SLIDE_BRIEF_EN.md), [outline hiện có](../../presentations/SLIDE_OUTLINE.md) và [bộ chuẩn bị nộp](../../reports/SUBMISSION_READY_2026-11-22.md). Dùng ảnh/video thật của candidate. Chỉ đổi link demo chính khi Huy gửi URL và xác nhận phiên bản. Có thể làm slide ngay bằng ảnh/video đã kiểm. Dùng một dòng “Android prototype” nếu cần, với trạng thái cross-platform check-in còn chờ nghiệm thu.

Repo có `apps/web/.env.example` và `mobile/.env.example`. Hưng chưa có cấu hình local đang dùng. File `.env.local` được tạo riêng trên máy chạy demo. Android chỉ cần URL loopback và key client local. Huy hướng dẫn qua kênh nội bộ đã được team duyệt. File môi trường, khóa cấp quyền server, và đăng nhập demo nằm ngoài bộ slide và tài liệu chia sẻ.

### Nhận nhánh Android qua Git bundle

Khai lấy `FitSync-U01-source.bundle` cùng bộ bàn giao. Từ clone của repo có mốc PR #48 (`4257334`), chạy:

```powershell
$bundle = 'C:/path/to/FitSync-U01-source.bundle'
git fetch origin refs/pull/48/head
git bundle verify $bundle
git fetch $bundle refs/heads/feat/android-u01-local:refs/heads/handoff/android-u01-local
git switch handoff/android-u01-local
```

Commit `9ad9e64` là mốc code Android đã build. Các commit tài liệu sau mốc đó ghi kết quả và việc còn lại. Bundle chỉ chứa Git objects sau mốc PR #48. Nếu phải build lại APK trên Windows, lượt build đã dùng đường dẫn ngắn cho source/Gradle cache, map SDK vào drive ngắn và đặt `-DCMAKE_OBJECT_PATH_MAX=220` trong CMake arguments của Gradle app được sinh ở bản build tạm. APK debug cần Metro và backend local.

## Mô hình kinh doanh và giá đã cập nhật

- PT là bên trả tiền. Học viên sử dụng kèm tài khoản PT. **Free tối đa 3 hồ sơ chưa lưu trữ**, kể cả lời mời chờ nhận. **Pro 199.000đ/PT/tháng**, không giới hạn học viên trong thời hạn và có cùng chức năng coaching. Hết hạn giữ lịch sử; việc tạo hoặc khôi phục hồ sơ theo quota Free. Không tự gia hạn.
- Quy trình dự kiến đối soát chuyển khoản thủ công. Hiện chỉ ghi nhận yêu cầu nâng cấp và còn thiếu tài khoản nhận tiền. **Actual 0/20 khách trả tiền và 0đ doanh thu thật** theo hồ sơ nộp. Kịch bản minh họa **3.980.000đ thu, 3.339.800đ chi, 640.200đ chênh lệch** có nhãn TEST.
- Chi phí AI, hỗ trợ và retention cần kiểm chứng nếu thương mại hóa sau này. Tier theo số học viên, 299.000đ, trial, hạn mức AI và Premium cho học viên là phương án nghiên cứu. Khi đánh giá lại, kiểm quota ở server khi tạo, gửi lời mời và khôi phục hồ sơ; đo rủi ro luân phiên lưu trữ, chi phí AI của roster lớn và ảnh hưởng lên quyền đọc lịch sử. Quyết định hiện hành ghi dự án dừng kinh doanh sau học phần.

## Bộ gửi trước và tài liệu tra cứu

**Gửi 2 Markdown trước** gồm tài liệu này và bản AI tiếng Anh. Hai file là điểm vào. Với team kỹ thuật, cấp quyền đọc đúng revision cho các tài liệu nguồn. Việt dùng bộ slide và báo cáo hiện có rồi cập nhật theo bằng chứng.

| Nhóm | Tài liệu và file cần giữ |
| --- | --- |
| Bàn giao sản phẩm | [Handoff tổng](../HANDOFF.md), [bộ web/database v1](README.md) với danh mục luồng người dùng, work packages, issue, runbook, UI và SQL, [MVP scope](../MVP_EXECUTION_PLAN.md), [quyết định chủ sản phẩm](../PRODUCT_DECISIONS.md), [team playbook](../TEAM_PLAYBOOK.md), [AGENTS](../../AGENTS.md) và [DESIGN](../../DESIGN.md). Bộ v1 ghi mốc PR #31; release candidate của lượt này là PR #48. |
| Chạy và kiểm | [Demo workflow](../DEMO_WORKFLOW.md), [test evidence](../TEST_EVIDENCE.md), [Android ADR](../architecture/adr-003-android-packaging-path.md), [mobile runbook](../../mobile/README.md), hai APK debug x86_64/ARM64 và biên bản U-00 trong thư mục artifact cùng worktree. |
| Mô hình và tài chính | [Financial report](../../reports/FINANCIAL_REPORT.md), [bảng tính Drive](https://drive.google.com/file/d/18SJXm70350xOMlOvkuLelAmP6xPavRRd/view?usp=drivesdk), [nghiên cứu giá](../plans/BUSINESS_MODEL_REVIEW.md), [customer insights](../../reports/CUSTOMER_INSIGHTS.md) và [mentor evidence](../../reports/MENTORING_EVIDENCE.md). |
| EXE201 | [Chỉ mục nộp bài](../../reports/SUBMISSION_READY_2026-11-22.md), [final delivery](../../project-management/FINAL_DELIVERY.md), [gap analysis](../../project-management/EXE201_GAP_ANALYSIS.md), [final PDF](../../reports/FINAL_REPORT_SUBMISSION.pdf), [bản thảo 5 phần](../../reports/FINAL_REPORT_DRAFT.md), [readiness](../../reports/FINAL_REPORT_READINESS.md), [W8/W9 progress](../../reports/WEEK_08_09_PROGRESS_REPORT.md), [W8 Form](../../reports/WEEK_08_FORM.md), [W9 Form](../../reports/WEEK_09_FORM.md) và [bản copy form](../../reports/GOOGLE_FORM_COPY_W8_W9.html). |
| Slide và demo | [Canva/edit & QA](../../presentations/CANVA_DELIVERY.md), [outline](../../presentations/SLIDE_OUTLINE.md), [script](../../presentations/WEEK_08_09_SCRIPT.md), [deck PDF](../../presentations/FitSync_Week_08_09.pdf), [product review](../../reports/LOCAL_PRODUCT_REVIEW.html), [database review](../../reports/DATABASE_REVIEW.html), [video index](../../presentations/demo-videos/README.md) và [delivery links](../../reports/DELIVERY_LINKS.md). |
