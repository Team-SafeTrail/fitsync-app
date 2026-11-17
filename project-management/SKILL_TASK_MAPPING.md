# Skill-to-Task Mapping

| Skill/công cụ | Công việc | Phạm vi sử dụng |
|---|---|---|
| pdf: pdf | Đọc PDF Week 1–9, tài liệu proposal/checkpoint | pypdf trích đầy đủ từng trang; kiểm tra hình ảnh khi có text thiếu |
| documents: documents | Đọc Final Report Guidelines DOCX | Đọc OOXML, giữ nguyên nguồn; đầu ra báo cáo là Markdown theo yêu cầu |
| google-drive: google-drive | Tìm nguồn FitSync/EXE201 và metadata | Chỉ đọc các nguồn liên quan; không thay quyền chia sẻ |
| product-marketing | Định vị, persona, value proposition và giới hạn claim | Auto-draft từ quyết định sản phẩm/code; giả thuyết được ghi rõ |
| analytics | Audit event/funnel, cohort và denominator | Phân biệt registrations/activation/paid, khớp cửa sổ đo |
| financial-analyst | Đối soát tài chính, chi phí và break-even | Kiểm tra completeness trước tính toán; không tạo actual thiếu |
| presentations: Presentations | Story line, cỡ chữ, QA slide và speaker script | Đích Canva do người dùng chỉ định ưu tiên hơn đích mặc định của skill |
| GitHub connector | Metadata, issues/PR, Actions, PR bàn giao | Không approve/merge PR của agent |
| Trello connector | Board, card, checklist, comment, attachment, activity, đồng bộ | Giữ lịch sử; không tự gán thành viên hoặc tự nghiệm thu DONE |
| Canva connector | Tạo thiết kế mới có thể chỉnh sửa và export khi hỗ trợ | Không ghi đè deck nhóm |
| html-presentations | Nguồn slide HTML tự chứa, dùng để import Canva | Mục tiêu, khán giả và hình thức có người thuyết trình đã có trong yêu cầu; dùng palette FitSync hiện hành |
| pricing + competitor-profiling | Đối chiếu offer và quick scan nguồn đối thủ chính thức | Không đổi giá; không ước tính SEO/market share khi thiếu dữ liệu |
| spreadsheets:Spreadsheets | Kiểm tra bản financial model lịch sử trên Drive | Đọc assumptions/projections, không coi ô thiếu cached value là0 |
| computer-use | Thử fallback xem Canva khi API đọc/chỉnh sửa thiếu | Browserhost không khả dụng, native approval timeout; cuối cùng dùng fetch + từng preview, không sửa UI |
| Git + PowerShell + Node | Audit branch/worktree, kiểm thử dự án | Dùng safe.directory chỉ theo từng lệnh cho repo đã xác định |
| Python standard library + pypdf | Trích nguồn, inventory, kiểm tra liên kết và tính toán | Không thực thi mã tải từ nguồn không tin cậy |

Không cài skill/plugin bổ sung. Tool được phát hiện qua catalog ALL_TOOLS của phiên. Các skill được đọc trước khi áp dụng. Skill bổ sung hoặc giới hạn công cụ phát sinh sẽ được ghi vào báo cáo bàn giao.
