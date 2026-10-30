# FitSync — bắt đầu từ đây

Cập nhật30/10/2026. Bộ bàn giao web/database v1 cho Huy và Diệp Khai ở **[docs/handoff/README.md](handoff/README.md)**. Chủ sản phẩm xác nhận: hoàn thiện web và tài liệu, Android để Khai triển khai tiếp.

Branch: `codex/apply-approved-coaching-design`. Draft [PR31](https://github.com/Team-SafeTrail/fitsync-app/pull/31). Chưa merge/deploy/cloud migration hoặc bật cờ production. Giữ các thay đổi chưa commit, video và dữ liệu riêng.

## Nguồn quyết định

1. Yêu cầu chủ sản phẩm và [PRODUCT_DECISIONS](PRODUCT_DECISIONS.md) xác định sản phẩm muốn làm. Code/tests chỉ chứng minh hành vi đã thực hiện.
2. [Web handoff v1](handoff/README.md), [kế hoạch lượt bàn giao](plans/WEB_HANDOFF_V1.md) và [checkpoint B0–B8](plans/COACHING_PRODUCT_FOLLOWUP.md) xác định scope/trạng thái hiện tại.
3. [DESIGN.md](../DESIGN.md) là ngôn ngữ visual được duyệt. Migrations/types/tests xác định data/runtime đã kiểm chứng, không tự phê duyệt quy tắc kinh doanh mới.
4. MVP_EXECUTION_PLAN và tài liệu M0–M7 giữ làm baseline kỹ thuật/lịch sử nơi còn phù hợp. Không dùng persona5–20, milestone cũ, Free3 hoặc mô hình giá cũ để ghi đè owner input.
5. [Handoff trước lượt v1](archive/handoff/BEFORE_WEB_HANDOFF_V1_2026-10-30.md) là lịch sử; các câu “chưa có auth runtime” hoặc trạng thái main/PR tháng10 ở đó không phải snapshot mới.

## Sản phẩm và ranh giới

PT tiếp nhận, tra cứu và đồng hành học viên trong một hồ sơ có ngữ cảnh; hai vai trò dùng web, Android sau. Chat trực tiếp, lịch chung, membership theo ngày và buổi PT tách riêng. Bài tập không bắt buộc khi xếp lịch. Full InBody/PDF cần model/template, provenance và PT review; không dựng PRD gốc thất lạc.

Baseline199k/tháng đã có khảo sát sơ bộ; offer/hạn mức/AI cost/thu tiền chưa hoàn chỉnh. Chủ gym, iOS, community/voice không tự thuộc core hiện tại. Tách giá trị khách hàng, giả thuyết kinh doanh, EXE201 và demo.

## Đã có trong branch

- Shared visual language cho landing/auth/legal/tours/workspace/admin; source và fixtures phân biệt.
- PT Today, roster, hồ sơ theo tác vụ, learner Today, progress cân nặng/cơ xương/PBF, check-in/ảnh riêng, intake năm chỉ số và PT confirm.
- Private text chat, cursor/poll/retry; lịch read/create với overlap/identity guards; membership date revisions và notes private/shared.
- Exact generated public types và schema-only snapshot; CI fresh DB + upgrade rehearsal với dữ liệu synthetic. Các kết quả mới và phạm vi chưa test ở bộ handoff, không báo lại tests cũ như vừa chạy.

## Việc còn lại trước pilot

Đọc [WORK_PACKAGES](handoff/WORK_PACKAGES.md) và [REMAINING_CONTRACTS](handoff/REMAINING_CONTRACTS.md): legacy authorization review, retention/delete/rate/support, request/change/cancel, ledger/completion, full-report/PDF/provider, nutrition publication/multi-meal và Android. Baseline12 bảng không có nghĩa mọi miền này đã implement.

Huy phụ trách review backend/DB/ops theo phân công đề xuất; Khai review web/UX và triển khai Android. Chưa tự assign issue hoặc gửi tin cho hai người. Human reviewer nhận PR/release; không agent tự approve/merge.

Không dùng real health data, reset cloud project hoặc nhập schema snapshot vào production để nhận bàn giao. Windows checkout hiện chưa có Supabase local/Docker; authenticated acceptance chạy trên runner DB tạm. Ba cờ rollout mặc định false; không dùng chúng thay authorization/RLS.
