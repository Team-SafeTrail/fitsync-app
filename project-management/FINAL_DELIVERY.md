# FitSync EXE201 — bàn giao ngày 17/11/2026

## A. Executive Summary

Đã chuẩn bị bộ Week 8/9 và final theo tài liệu thực tế, kiểm lại public demo, audit 106 card Trello, đọc số đếm cloud chỉ bằng truy vấn không ghi và tạo Canva mới với screenshot sản phẩm thật. Nhóm đã xác nhận **dừng kinh doanh sau học phần**.

**Chưa thể xác nhận đã hoàn thành học phần hoặc toàn bộ dự án.** Còn thiếu bằng chứng khách trả phí, ledger và analytics kênh, review gốc, quyền database cho giảng viên, xác nhận đóng góp/lịch hẹn và nghiệm thu full authenticated hiện tại. Form chưa gửi và chưa có receipt nộp. Những phần này giữ trạng thái PARTIAL, BLOCKED hoặc NOT VERIFIED.

## B. Completed Tasks

- Xác minh văn bản Week 1–9 và Final Guidelines, tạo source register/manifest và ma trận gap.
- Đối chiếu scope, giá và claim giữa tài liệu cũ, Trello, GitHub và cloud; không kế thừa số paid/reach/click/SUS thiếu bằng chứng gốc.
- Audit Git, tạo branch riêng từ đúng main, giữ dirty worktree của nhóm.
- Lập dry-run trước cleanup; dọn cache tái tạo, archive 3 file test cũ và build lại.
- Đọc 8 list/106 card, 17 checklist/82 items, 25 comments, 0 attachments trả về và 102 activity entries. Phân loại 7 nhóm, phát hiện 5 card trùng exact title. Không xóa/archive/move/mark DONE hoặc đổi assignee.
- Chuẩn bị đúng 6 Step Week 8, 5 Step Week 9, final draft 5 phần, tài chính/ledger template, CAP/analytics/customer insights, kiến trúc và demo runbook.
- Tạo Canva cuối 10 trang 16:9 từ nguồn cố định và 2 screenshot nguyên bản; đọc lại chữ, xem toàn bộ preview, tạo PDF 10 trang và script 10 slide.
- Upload financial report vào thư mục EXE201 sau chấp thuận cụ thể của người dùng; đọc lại thành công. Không đổi quyền chia sẻ.
- Ghi chú trạng thái chờ review trên 2 weekly cards Trello và đọc lại comments; không tự nghiệm thu hoặc xác nhận đã nộp.

## C. Engineering Changes

**Branch:** agent/exe201-fitsync-completion. **Base:** 3c816e977d50f8a9bda1703cf4d6f3a417f86d0c.

Các commit đã lưu: 8641fbc (audit/cleanup plan), afa123f (collector/verifier), 76a5dca (forms/final/audits/evidence), 294c4ca (presentation). Commit bàn giao cuối được xác định bằng HEAD trong receipt đóng gói. Xem [GIT_AUDIT](../docs/GIT_AUDIT.md). Chưa có remote branch hoặc PR mới do connector ghi trả HTTP 403 và Git local thiếu credential. [PR description đã chuẩn bị](PR_DESCRIPTION.md).

Gói chuyển giao được lưu ngoài repo tại outputs/exe201-delivery-2026-11-17: ZIP artefacts, incremental Git bundle, patches và receipt có SHA256/danh sách file. Không chứa .env, credential, node_modules hoặc raw dữ liệu cá nhân.

Thay đổi code gồm collector chỉ đọc và verifier trong scripts/reporting. Collector giới hạn đúng HTTPS host FitSync, GET/HEAD, timeout, pagination và đối soát cohort; chỉ xuất số đếm tổng hợp. Verifier kiểm file, trường form, số slide, bytes ảnh gốc, phép tính tài chính, link local và PDF/hash. Không sửa architecture/app source hoặc chồng PR47 khi chưa tái hiện lỗi cần sửa.

| Check ngày 17/11 | Kết quả | Phạm vi |
|---|---|---|
| Domain tests |103/103 PASS |Không phải DB integration |
| Local environment guard |4/4 PASS |Kiểm điều kiện môi trường cô lập |
| Lint/typecheck/build |PASS, exit 0 |Dependencies có sẵn; chưa clean install local |
| Chromium public |16/16 PASS, exit 0 |Landing/tour/legal/auth guard, không ghi cloud |
| Cloud collector |PASS |Aggregate mới; không xác nhận khách độc lập/paid; nhiều query không là một transaction snapshot |
| Full authenticated/RLS local |BLOCKED |Thiếu Docker; CI lịch sử được ghi ngày/run riêng |
| Gói tài liệu |PASS ở lần kiểm cuối |76 check, không có lỗi; receipt bên dưới |

[Evidence và logs](../docs/evidence/exe201-2026-11-17/), [test report](../docs/TEST_EVIDENCE.md). Không dùng CI của PR47 để chứng minh main có password reset hoặc dùng screenshot làm bằng chứng rollout.

## D. EXE201 Deliverables

| Tệp | Tình trạng |
|---|---|
| [Week 8 form](../reports/WEEK_08_FORM.md) |PASS bản chuẩn bị; chưa gửi |
| [Week 9 form](../reports/WEEK_09_FORM.md) |PASS bản chuẩn bị; chưa gửi |
| [Báo cáo hai tuần](../reports/WEEK_08_09_PROGRESS_REPORT.md) |PASS, có giới hạn actual rõ |
| [Final draft](../reports/FINAL_REPORT_DRAFT.md) |PASS cấu trúc; PARTIAL kết quả thực tế |
| [Final readiness](../reports/FINAL_REPORT_READINESS.md) |PASS ma trận đối chiếu; không chứng nhận đạt |
| [Financial report](../reports/FINANCIAL_REPORT.md) |PARTIAL actual; có phân tích/kịch bản |
| [Financial report trên Drive](https://drive.google.com/file/d/18SJXm70350xOMlOvkuLelAmP6xPavRRd/view?usp=drivesdk) |PASS upload/readback; quyền xem của giảng viên NOT VERIFIED |
| [Gap Week 1–9](EXE201_GAP_ANALYSIS.md) |PASS đối chiếu; các mục thiếu giữ trạng thái |
| [Product analysis](../docs/PROJECT_ANALYSIS.md) |PASS trong phạm vi nguồn và giả thuyết đã ghi |
| [Trello audit](TRELLO_AUDIT.md) |PASS 106 card; lịch sử còn nguyên |
| [Demo workflow](../docs/DEMO_WORKFLOW.md) |PASS runbook/public; PARTIAL full backend |

## E. Canva Presentation

**[Mở Canva cuối để chỉnh sửa](https://www.canva.com/d/JP90mzolqoYNL2Z)**. Design ID: DAHbJ4OqVNk, 10 trang 1920×1080.

[PDF 10 trang](../presentations/FitSync_Week_08_09.pdf), [kịch bản](../presentations/WEEK_08_09_SCRIPT.md), [outline](../presentations/SLIDE_OUTLINE.md), [HTML nguồn](../presentations/WEEK_08_09_CANVA_SOURCE.html), [QA/provenance](../presentations/CANVA_DELIVERY.md).

PDF được render từ cùng HTML, không phải export byte-for-byte từ Canva. Connector hiện không có PPTX export. AI draft trước bị loại vì dựng UI giả; không dùng bản đó để trình bày.

## F. Remaining Issues

1. **Kinh doanh:** chưa có ledger/biên lai và analytics kênh cùng kỳ. 4 Pro không phải 4 paid; 10 tài khoản ngoài seed chưa được xác nhận là khách độc lập. Cohort này có 0 InBody/check-in.
2. **Nộp học phần:** cần form/LMS chính thức, deadline/receipt, contribution và booking receipts. Chưa tự nộp hoặc xác nhận điểm.
3. **Database/demo:** owner cần bàn giao quyền được duyệt cho giảng viên. Full auth/RLS rerun cần Docker hoặc CI có quyền. Bốn bảng coaching REST trả 404; PR47 auth chưa merge; OCR provider, Android, billing và ops còn dependency.
4. **Remote Git:** cần phiên Git có quyền hoặc connector có quyền ghi. Có local commits và gói patch/bundle; chưa push/PR, không merge/force push.
5. **Kết thúc sau môn:** owner rà cam kết với người tham gia, hoàn tiền nếu có, chi phí và vòng đời dữ liệu. Lượt này không đổi quyền hoặc tắt/xóa dịch vụ.

## G. Readiness Assessment

| Hạng mục | Đánh giá |
|---|---|
| Week 8 Submission Readiness |PARTIAL: nội dung đầy đủ, actual và receipt còn thiếu |
| Week 9 Submission Readiness |PARTIAL: có link tài chính mới, actual và receipt còn thiếu |
| Final Report Readiness |PARTIAL: đúng 5 phần, thiếu proof kinh doanh/access |
| Technical Demo Readiness |PASS public tour/guard; PARTIAL authenticated/release |
| Git/Workspace Health |PASS local và giữ dữ liệu; BLOCKED remote publication |

## H. Final Verification

[Receipt tự động](../docs/evidence/exe201-2026-11-17/delivery-verification.json) kiểm file, số trường, số slide, ảnh nguyên bản, tài chính, link local và PDF/hash. [Trello readback](../docs/evidence/exe201-2026-11-17/trello-sync-readback.json) xác nhận hai ghi chú mới tồn tại. [Dry-run](CLEANUP_DRY_RUN.md) và [kết quả cleanup](CLEANUP_RESULT.md) ghi rõ phạm vi dọn.

PASS chỉ áp dụng cho phần đã chạy, xem hoặc đọc lại. Đây là kiểm tra gói bàn giao, không phải chứng nhận market-ready, thanh toán hoặc đạt EXE201.
