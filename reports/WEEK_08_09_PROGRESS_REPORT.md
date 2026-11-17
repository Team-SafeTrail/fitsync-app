# FitSync — báo cáo tiến độ Week 8/9

**Nhóm:** SafeTrail. **Ngày đối soát:** 17/11/2026. Đây là bản cập nhật hồi cứu, chưa phải xác nhận đã nộp hoặc đạt Outcome. Nhóm đã quyết định dừng kinh doanh sau học phần.

## Kết quả đã kiểm chứng

Source main 3c816e9 có baseline web hai vai trò, nhập tay và PT xác nhận, check-in, tiến trình và code chat/lịch/context. Lần kiểm local này qua 103 domain tests, 4 bài kiểm guard cô lập, lint, typecheck, production build và 16 public browser tests. Website home/login trả HTTP 200; workspace chưa đăng nhập chuyển về login. Không sửa ứng dụng khi chưa tái hiện lỗi cần sửa hoặc chồng việc PR47.

Cloud chỉ đọc ngày 17/11 ghi nhận 27 Auth, 17 synthetic và 10 tài khoản ngoài seed, gồm 5 PT và 5 học viên. Cả 10 đã xác nhận email và từng đăng nhập; cohort này chưa có InBody/check-in và không có last-sign-in trong 7 ngày trước snapshot. Bốn Pro chưa chứng minh trả tiền. Bốn bảng coaching mới trả 404/PGRST205 qua REST cloud; source đã có không đồng nghĩa đã rollout.

## Nội dung hai tuần

| Yêu cầu | Đã chuẩn bị | Còn thiếu |
|---|---|---|
| Week 8 KPI và kênh | Snapshot có định nghĩa, kế hoạch thử hai nguồn | Analytics kênh, khách độc lập và paid proof |
| Week 8 tiếp tục kinh doanh | Chọn No theo quyết định nhóm | Owner thực hiện bàn giao/kết thúc sau môn |
| Week 8 mốc 60 và tài chính | Plan 20 PT + 40 học viên, khoảng thiếu 15 PT + 35 học viên; báo cáo tài chính | Actual tăng trưởng và ledger; 60 tài khoản không bảo đảm 20 paid |
| Week 9 cải tiến và analytics | Ưu tiên core/manual, cohort cho thấy activation còn thiếu | Attribution, retention và nguyên nhân bỏ dở |
| Week 9 link tài chính và phân tích | Đã upload báo cáo mới theo xác nhận cụ thể, đọc lại thành công | Kiểm quyền xem của giảng viên; actual billing/payment |

## Sản phẩm bàn giao của lượt này

Hai form đúng câu hỏi nguồn; final draft đúng 5 phần; gap analysis Week 1–9; phân tích sản phẩm/kiến trúc; CAP và metric contract; audit 106 card Trello; audit Git/worktree; runbook demo; Canva mới 10 slide, PDF và kịch bản tiếng Việt. Liên kết và trạng thái cuối nằm trong FINAL_DELIVERY.md.

## Khó khăn và cách xử lý

Trello có card DONE chưa đủ nghiệm thu và 5 card trùng exact title. Audit giữ lịch sử, không xóa/archive hoặc tự gán thành viên. Claim 3 paid/1.500 reach/210 click/SUS trong mentor report chưa có nguồn gốc đủ nên không trình bày như actual. Giá 49k/99k là phương án cũ; 199k là mức tham chiếu hiện hành cần hoàn thiện offer.

Windows thiếu Docker nên chưa chạy lại full authenticated E2E; không trỏ các bài test có ghi dữ liệu vào cloud. Connector GitHub từ chối ghi HTTP 403 và Git local thiếu credential, nên chưa có remote branch/PR của lượt này. Canva AI draft đã bị loại vì dựng UI giả; bản cuối import từ nguồn cố định, có ảnh thật và đã kiểm lại chữ/preview.

## Đóng góp và bước tiếp

Vai trò/issue ownership lấy từ TEAM_PLAYBOOK và GitHub. Tài liệu/automation mới do agent chuẩn bị, chưa tự phân bổ thành đóng góp của từng thành viên. Nhóm cần xác nhận giờ làm, artefact, review và lịch hẹn trước khi nộp.

Trước nộp: rà nguồn, kiểm demo/video/database access, đối soát các chứng từ nếu có, điền form chính thức và lưu receipt. Sau môn: owner bàn giao source/tài liệu và xử lý tài khoản, dữ liệu, chi phí cùng các cam kết hiện có. Lượt này chưa tự gửi form/email, tắt cloud hoặc xóa dữ liệu.
