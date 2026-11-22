# FitSync — kết quả kiểm thử theo revision

Cập nhật 22/11/2026, Asia/Saigon. Không backdate kết quả về tuần học. Revision ứng dụng **0ba9821e39e7cec559473e6aae3262e4294e33b7**, branch agent/fitsync-final-product, [PR48](https://github.com/Team-SafeTrail/fitsync-app/pull/48).

| Kiểm tra | Kết quả | Bằng chứng/phạm vi |
|---|---|---|
|Clean install/lint/types/unit/build CI|PASS|[Quality44155536467](https://github.com/Team-SafeTrail/fitsync-app/actions/runs/44155536467)|
|Domain local|114/114,13 files PASS|Revision0ba9821; không thay kiểm thử DB/browser|
|Fresh DB SQL/RLS|363/363,13 files PASS|[Backend44155536123](https://github.com/Team-SafeTrail/fitsync-app/actions/runs/44155536123), job134295151112|
|Upgrade rehearsal|363/363 PASS|Job134295150623; legacy fingerprints không đổi, exact generated public types khớp|
|Core browser CI|28/28 PASS ngay lần đầu,0 retry|Cùng backend run ở0ba9821|
|Demo browser/recording CI|4/4 PASS ngay lần đầu,0 retry|Cùng backend run,41,4s suite|
|Seed idempotency CI|PASS,2 lần|29 tài khoản synthetic,22 TEST entries; actual finance KPI không đổi|
|Windows local full demo|4/4 PASS,0 retry,exit0|22/11, production build/start rồi kiểm PT Pro/Free, học viên, admin và walkthrough|
|Media/PDF|PASS trong phạm vi đã kiểm|File gốc/hash, video decode/seek; PDF10 trang16:9, HTML không overflow|

[Receipt CI](evidence/exe201-2026-11-18/engineering-checks.json), [receipt local22/11](evidence/exe201-2026-11-22/local-demo-verification.json), [nguồn media](evidence/exe201-2026-11-18/media-manifest.json), [QA media](evidence/exe201-2026-11-18/review-media-qa.json), [PDF](evidence/exe201-2026-11-22/pdf-verification.json).

## Local đã chạy trên máy người dùng

Docker Desktop4.99.0.245822, WSL3.0.5.0/kernel6.18.58.1-1 và Engine29.9.3. Owner đã cho phép cài; không reboot. Stack riêng fitsync-exe201-demo có Auth/DB/Storage/Studio,20 public tables/14 migrations. Launcher giữ nguyên .env.local cloud, seed synthetic và build thành công. Web http://127.0.0.1:3000 và Studio http://127.0.0.1:54323. Chỉ truy cập loopback, chưa chia sẻ giảng viên.

Bốn bài local kiểm: admin actual thu khách vẫn0 và TEST riêng; PT Pro có5 hồ sơ persist/ghi chú chia sẻ; Free dành3slot và học viên chỉ xem dữ liệu được chia sẻ; walkthrough ghi/đọc coaching và tài chính tách môi trường. Không suy4bài này thành363SQL hoặc28core được chạy lại local; các bộ đó có nguồn CI riêng. Suite local có ghi note/chat synthetic. Không dùng tài khoản thật.

## Lỗi đã sửa và lịch sử

0ba9821 sửa navigation sau save thành công (nutrition/check-in), reload an toàn khi cùng path/hash, ID record lưu InBody được đọc lại theo phạm vi người xem; giữ input/file khi validation thất bại. Chưa gửi lại lượt lưu cũ sau success.

Checkpointc2aeeb2 có1retry là lịch sử. Run209f60e chờ kết thúc RSC stream gây treo; a38e917 chờ phần tử trong tab ẩn chưa qua. Các lần thất bại không phải nghiệm thu. Run0ba9821 qua toàn bộ lần đầu, không giảm assertions để che lỗi.

Production dependency audit ở lock hiện hành từng ghi0 vulnerabilities; all-dev10 (9moderate,1high). Đây là checkpoint audit, không phải cam kết supply chain hoàn toàn sạch.

## Phạm vi chưa kiểm hoặc chưa triển khai

Cloud đọc lại22/11 vẫn8 bảng, candidate cohort chưa có InBody/check-in;12bảng ứng viên chưa rollout. Website của Huy không đổi. Không dùng CI/local như bằng chứng triển khai production hoặc20khách trả phí.

Chưa benchmark provider OCR/full PDF, Safari/Firefox/thiết bị vật lý, tải lớn, real bank settlement hoặc pilot dữ liệu sức khỏe thật. Không có coverage%/pentest/market-ready certification. Nhập tay và PT confirm là luồng được kiểm; consent/retention/delete/support/abuse cần review trước pilot thật.

Tái lập theo [DEMO_WORKFLOW](DEMO_WORKFLOW.md) và workflows CI. Không đóng gói credential, raw contact hoặc health data thật.

## Kiểm tiếp bộ bàn giao22/11

DocsHEAD8311511:quality45027572575 PASS;backend45027572543 fresh/upgrade363SQL,28core vàseed2lần PASS nhưngdemo3/4. Walkthrough giả định cuộc hẹn nằm tuần hiện tại;seed đặt+2ngày nên Chủnhật22/11 rơi sang24/11. Assertion bị lỗi phạm vi ngày,không phải quyền hoặc mấtdata. Đã sửa testđọc ngàyfixture quaPTscopedquery vàmở đúngweek;giữ nguyênassert hiển thị,không tăngtimeout/retry. Kết quả run sau sửa được lưu trong receipt đóng gói ngoàiGit;chưa suy từ code rằng đãPASS.
