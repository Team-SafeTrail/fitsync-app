# FitSync — hướng dẫn demo sản phẩm

Cập nhật22/11/2026. Owner chấp nhận demo local; website production do Huy quản lý. Web đầy đủ được giảng viên chấp nhận, không yêu cầu APK. Kết quả kiểm thử theo revision nằm ở [TEST_EVIDENCE](TEST_EVIDENCE.md), Local production build/start và4/4 bài demo đã PASS22/11 trên máy Windows với Supabase cô lập.

## Chuẩn bị

Từ folder Git `fitsync-app`, cần Node >=20, npm, Docker Engine chạy Linux containers. CI dùng Node 20; máy hiện có Node 24.13. Docker/WSL2 đã cài theo chấp thuận; Engine29.9.3 hoạt động, không reboot. Xem [review cài đặt](../project-management/LOCAL_SETUP_REVIEW.md).

```powershell
npm.cmd ci --ignore-scripts --cache ../outputs/npm-cache
npm.cmd run demo:plan
npm.cmd run demo:prepare
npm.cmd run demo:start
```

`demo:plan` chỉ in kế hoạch; `demo:prepare` chỉ tạo config/migrations riêng. `demo:start` kiểm Docker/port, khởi động DB cô lập, seed, đối soát, build và chạy Next.js. Không ghi đè `.env.local`, không dùng secret cloud cho demo, không reset hoặc xóa volume. Nếu runtime cũ khác migration/config, launcher dừng để bảo toàn dữ liệu.

## Environment và dữ liệu

Launcher lấy khóa từ đúng Supabase loopback và truyền qua môi trường tiến trình; không in khóa. Nó đặt site URL `http://127.0.0.1:3000`, bật ba cờ coaching, `FITSYNC_DEMO_MODE=true`; để trống OCR API key và thông tin nhận tiền. Không copy khóa vào chat, slide hoặc Trello.

- Web: http://127.0.0.1:3000
- Database Studio local: http://127.0.0.1:54323
- File truy cập private: `../outputs/local-demo-private/LOCAL_DEMO_ACCESS.html`
- Receipt seed, chỉ xuất sau khi thực chạy: `../outputs/local-demo-private/seed-verification.json`

Demo tạo 20 PT, 8 học viên và 1 admin synthetic, tên có DEMO, email example.test. PT01 Pro có 5 hồ sơ; PT02 Free có 3. Có số đo, notes, membership, chat và lịch lưu thật trong DB local. Credential ngẫu nhiên nằm ngoài Git, không nhúng mật khẩu vào runbook.

20 khoản thu TEST × 199.000 đ =3.980.000 đ; chi TEST3.339.800 đ; chênh lệch 640.200 đ là kịch bản giảng dạy. PDF ghi rõ **SIMULATED DEMO ENTRY / NOT A REAL PAYMENT RECEIPT**. Không có tiền thật được chuyển. Admin phải tiếp tục hiển thị actual paid=0 và actual revenue=0. Bộ này không chứng minh điều kiện 20 paying customers.

## Kịch bản trình bày 6–8 phút

1. Mở landing, giải thích PT/học viên và vào account PT01. Cho thấy 5 hồ sơ lưu trong DB, mở học viên 01 và biểu đồ 3 lần đo synthetic.
2. Mở membership và ghi chú. Chỉ ra ngày membership tách số buổi; ghi chú private khác shared. Đăng nhập học viên 01 bằng browser profile khác, kiểm chỉ thấy shared và số đo của mình.
3. Tạo hồ sơ/invite bằng PT phù hợp, nhận bằng tài khoản mới synthetic; PT nhập tay số đo, sửa lỗi validation và xác nhận. Reload hai vai trò để kiểm persistence. Không trình bày OCR giả làm provider thật.
4. Học viên check-in; PT tải lại xem cập nhật. Mở chat, gửi tin hai chiều. Không quay màn hình credential/invitation token.
5. Mở lịch, tạo slot tương lai, learner đề nghị đổi, PT chấp nhận. Chứng minh slot cũ giữ đến lúc chấp nhận; overlap bị chặn. Hoàn thành chỉ dành cho cuộc hẹn đã qua, trừ buổi khi chọn rõ và có ledger; có thể đảo một lần.
6. Đăng nhập admin. Mở số liệu thật và panel mô phỏng riêng, tải PDF mô phỏng private và CSV. Nhấn mạnh actual 0 khác scenario 20. Không chuyển khoản hoặc tự chế biên lai ngân hàng.
7. Mở Studio local để kiểm cấu trúc 20 bảng, RLS và dữ liệu DEMO. Owner kiểm database trước; chưa chia sẻ cloud/admin cho giảng viên.

Expected: luồng được lưu DB, quyền hai bên đúng, không lộ private note/media, quota Free được kiểm DB, không tự trừ buổi khi tạo lịch, không đếm dữ liệu thử vào doanh thu.

## Kiểm thử tái lập

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
node --test scripts/test/local-environment.test.mjs scripts/local-demo/config.test.mjs
```

Backend CI tự dựng DB loopback tạm: migrations →363 SQL/RLS assertions →generated types →production build →28 browser flows →seed hai lần →3 bài demo. Không đổi URL guard để chạy các test có ghi dữ liệu vào cloud. Xem `.github/workflows/backend-acceptance.yml` và receipt của run tương ứng; số mục tiêu trong workflow chưa phải kết quả PASS.

## Xử lý lỗi và giới hạn

| Triệu chứng | Xử lý |
|---|---|
| Docker Engine không sẵn sàng | Khởi động Docker đã được cài; không tự cài/reboot từ launcher |
| Port3000/54321 đang dùng | Xác định dịch vụ; bảo toàn tiến trình đang chạy, không kill toàn bộ Node |
| Runtime migration/config khác | Review dữ liệu và file trước khi thay; launcher không tự reset |
| Cloud thiếu bảng | Không dùng cloud cũ cho demo mới hoặc tự rollout để né lỗi |
| OCR chưa cấu hình | Nhập tay và PT review, không claim accuracy/latency |
| Chưa có ngân hàng nhận tiền | Chỉ demo yêu cầu nâng cấp và TEST ledger; chưa bật thu tiền thật |
| Pro/số tài khoản tăng | Không coi nhãn gói hoặc synthetic là paying customers |

Ctrl+C dừng web con của launcher; DB volumes giữ lại. Không có chứng nhận Safari/thiết bị Android, market readiness với dữ liệu sức khỏe thật, thu tiền thật hoặc website production mới. Consent/retention/delete/support cần review trước pilot thật. Nhóm dừng kinh doanh sau môn; không tự tắt/xóa cloud.
