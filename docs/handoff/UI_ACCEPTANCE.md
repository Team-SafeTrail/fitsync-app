# Web UI acceptance — phạm vi và bằng chứng

Đánh giá theo ngôn ngữ thiết kế đã duyệt, hierarchy theo công việc, thao tác thật, accessibility, responsive và trạng thái thất bại. Không dùng từ “đẹp nhất” hoặc tests PASS như một chứng nhận usability. Trạng thái baseline: v1 candidate để Huy/Khai review; không phải production release.

## Ma trận giao diện

| Surface | Bố cục / hành vi trong web v1 | Bằng chứng / giới hạn |
| --- | --- | --- |
| Landing | Visual approved; intake minh họa, hai vai trò, sample review, offer/capability/source limits, CTA đăng ký | Public journey và approved-design; các width320/390/768/1440. Không phải phép đo chuyển đổi hoặc xác nhận khách hàng |
| Register/login | Cùng brand, form một cột, lỗi và trạng thái môi trường; auth thật trong test stack | Signup PT/login/invite của synthetic accounts. Chưa kiểm email production/forgot-password delivery |
| Invitation | Link một lần, đặt mật khẩu, liên kết learner đúng profile | Valid flow + SQL token/expiry/role boundaries; không gọi SQL expiry là ảnh UI expired đã xem |
| PT Today | Upcoming appointments, attention queue, connected/pending context; không unread giả | Protected route, desktop/phone; evidence hiện có có empty upcoming, populated calendar ở suite khác |
| Roster | Search/filter, người/chỉ số trạng thái, tạo hồ sơ và copy invitation | Real M2/M3/handoff flows, mobile overflow checks; data/query pagination ở quy mô lớn còn review |
| PT dossier |5 tab: overview, progress, membership/sessions, notes, intake; keyboard/hash; draft giữ khi đổi tab | Handoff browser thêm keyboard và unsaved draft checks. Các pane private chỉ nằm sau server role/relationship guard |
| Learner Today | Next appointment, daily check-in, own progress, membership, shared guidance, verified records | Learner390px, không thấy private note/roster/PT form. Không gamification/streak giả |
| Learner history `/workspace/progress` | Toàn bộ record của chính learner; Home chỉ render bản gần nhất | Handoff thêm điều hướng và đối chiếu2 records; không query roster người khác |
| Progress | Weight/SMM/PBF switch, actual time spacing, unit, change in selected range, table alternative | Unit cases uneven/same timestamps, metric scale; handoff thêm hai verified records. Không chứng minh so sánh mọi máy/template |
| InBody | Mandatory PT review, current five core fields, manual fallback, upload image states | M2 validation/save/reload, source labels. Full report/PDF/provider chưa hoàn tất; fake adapter không phải live OCR evidence |
| Membership/notes | Dates inclusive, history/revision, stale conflict; private default/shared explicit, pre-link private note | New33 SQL checks + handoff user/RPC-race scenario. Không payment, entitlement ledger hoặc editing/deleting notes |
| Chat | Own/other/date,50-page history, bounded scrolling, composer, polling, retry/error | Authenticated exchange/reload/lost-ack/pagination/outsider404. Physical keyboard/background/realtime/media/read receipt chưa kiểm/triển khai |
| Calendar | Weekly agenda, PT entry beside/under list, conflict/adjacent/race/retry states | Two-account test, direct DB commit proof, one concurrent winner, balance unchanged. Request/change/cancel/completion chưa có |
| Privacy/terms | Reading layout cùng brand; phân biệt sample/workspace và thông tin trước thử nghiệm | Content đối chiếu source; public desktop/phone snapshot. Không phải legal/privacy compliance approval |
| Admin | Guard admin, aggregate counts + demo OC2 được ghi nhãn, tables cuộn riêng | Handoff thêm synthetic admin setup trong local guard. Không phải dashboard chủ gym, live user table hay billing thực |

## Contrast và input visibility

Đã tính từ sRGB tokens trong globals.css; chưa phải kiểm mọi computed style/pixel. Chuẩn tham chiếu: [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) và [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html). Mốc cho normal text4.5:1 và meaningful control cues3:1; contrast không thay keyboard/focus/semantics.

| Cặp | Ratio tính được |
| --- | --- |
| Forest143E38 / white |11.82:1 |
| Secondary465E53 / white |7.03:1 |
| Muted52675C / surface-mutedEAF0EB |5.26:1 |
| White / jade226C5D |6.23:1 |
| Forest / sunFFD29C |8.42:1 |
| Strong border6F8879 / white |3.84:1 |
| Strong border6F8879 / surface-muted |3.32:1 |

Border strong cũA4BAAC trên white chỉ2.06:1, đã đổi sang6F8879 cho biên ô nhập. Divider trang trí vẫn dùng border default. Focus/global reduced-motion rules được giữ; keyboard/tab/hash/scroll behavior cần review cùng thao tác, không chỉ nhìn màu.

## Verification receipts

- Historical pre-handoff: code28a9e9a,87 units/169 SQL/4 browser scenarios. Không dùng như checks mới cho v1.
- First handoff composition at479500f: web CI41085658397 PASS; backend41085658354 PASS với202 SQL/RLS, schema/types diff, production build và22 browser checks. Upgrade job cùng run PASS, seed/legacy row fingerprints không đổi. Đã xem ảnh và phát hiện dossier quá dài; sửa tiếp thành tabs.
- Final application/test checkpoint **b75b9d2**: [Web CI41092400108](https://github.com/Team-SafeTrail/fitsync-app/actions/runs/41092400108) SUCCESS:103 unit tests, lint, typecheck và production build. [Backend CI41092400099](https://github.com/Team-SafeTrail/fitsync-app/actions/runs/41092400099) SUCCESS:202 SQL/RLS checks, exact generated types diff, production build và **23/23 Chromium browser tests**, không retry. Upgrade job cùng run PASS: áp ba migration additive lên năm migration nền; fingerprints toàn bộ rows của tám bảng legacy không đổi;202 SQL checks và types diff sau upgrade PASS.
- Đây là kết quả chạy ngày30/10/2026; bộ bàn giao được chốt ngày31/10/2026. Không gọi chúng là lần chạy mới khi chỉ mở lại tài liệu.
- Hai lượt41089494502 và41091393181 trước đó FAIL đã được điều tra: sửa lỗi SVG title SSR/hydration thật (có unit regression), cùng locator/navigation của test sau khi chia dossier thành tabs. Không bỏ assertions dữ liệu/quyền để làm test qua.
- [Ảnh và manifest](screenshots/README.md) lưu từ run cuối, không phụ thuộc artifact CI hết hạn sau một ngày. Desktop capture full-page; phone/tablet trong suite handoff capture viewport sau scroll-to-top. Đã trực tiếp xem dossier desktop/320px, learner Home/history390px và admin390px ở lượt trước có cùng app code; xem lại membership từ run cuối. Không tuyên bố đã thao tác mọi trạng thái bằng tay hoặc chạy trên thiết bị thật.

## Các giới hạn còn lại

Chưa chạy Android/iPhone thật, Safari/Firefox, screen reader, zoom/text-spacing toàn bộ, load/security penetration, provider benchmark hoặc pilot value study. Không có coverage percentage/Lighthouse score được đo trong lượt này. Thử phone width là browser emulation, không chứng minh native readiness. Windows localhost không có Supabase local; authenticated screenshots đến từ CI build+DB tạm.

Bản bàn giao giữ tách biệt: web UI baseline dùng được, full-product target contracts, operational release gates và coursework/demo. Xem WORK_PACKAGES trước khi đóng giai đoạn hoặc marketing capability.
