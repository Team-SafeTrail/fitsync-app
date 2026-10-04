# KỊCH BẢN THUYẾT TRÌNH BÁO CÁO GIẢNG VIÊN — TUẦN 5 (30 PHÚT)
## DỰ ÁN FITSYNC — TEAM SAFETRAIL (MÔN EXE201)

> **Thời gian báo cáo đã chốt:** 16:00 – 16:30 Thứ Năm, ngày 08/10/2026  
> **Người thuyết trình chính:** Huỳnh Quốc Việt (Leader / Tech Lead)  
> **Phản biện chuyên môn:** Lê Nguyễn Gia Hưng (AI/Data), Dương Quang Huy (Backend/Cloud), Diệp Khai (Mobile/Frontend), Lê Văn Toàn (UI/UX/Marketing)  
> **Bộ Slide trình chiếu đi kèm:** [W05_SLIDE_DESIGN_BRIEF_FOR_TOAN.md](W05_SLIDE_DESIGN_BRIEF_FOR_TOAN.md) (17 Slides chuẩn Carbon Dark Theme)

---

## ⏱️ PHÂN BỔ THỜI GIAN TỔNG THỂ (30 PHÚT)

```text
┌──────────────────────┬─────────────────────────────────────────────────┬──────────┐
│ Giai đoạn            │ Nội dung trọng tâm                              │ Thời gian│
├──────────────────────┼─────────────────────────────────────────────────┼──────────┤
│ 1. Mở đầu            │ Giới thiệu SafeTrail, Bài toán PT & Khảo sát    │ 03 phút  │
│ 2. Tuần 1            │ Quản trị Trello/Git, Kiến trúc & Cam kết OC1-3  │ 05 phút  │
│ 3. Tuần 2            │ Target KPIs, Phễu AARRR & 2 Kênh chủ lực        │ 05 phút  │
│ 4. Tuần 3            │ Kết quả test thực địa & Kế hoạch 10 users đầu   │ 05 phút  │
│ 5. Tuần 4 & LIVE DEMO│ Bứt phá M4 OCR, Bảo mật RLS & Demo sản phẩm thật│ 06 phút  │
│ 6. Q&A & Kết luận    │ Trả lời phản biện Thầy & Chốt cam kết nộp bài   │ 06 phút  │
└──────────────────────┴─────────────────────────────────────────────────┴──────────┘
```

---

## 🎙️ LỜI THOẠI CHI TIẾT THEO TỪNG PHÚT & TỪNG SLIDE

---

### PHẦN 1: MỞ ĐẦU & BỐI CẢNH DỰ ÁN (Phút 00:00 – 03:00)
*Mục tiêu: Gây ấn tượng mạnh mẽ ngay 60 giây đầu bằng số liệu thực tế, khẳng định sự kế thừa nghiêm túc từ EXE101.*

#### [Slide 1: Cover Slide — FitSync & Team SafeTrail]
*(00:00 – 01:00)*
> "Kính chào Thầy và các bạn! Em là Huỳnh Quốc Việt, đại diện cho team **SafeTrail** gồm 5 thành viên. Hôm nay, nhóm em rất hào hứng được báo cáo tiến độ toàn diện của dự án **FitSync — Nền tảng B2B SaaS CRM thông minh dành riêng cho Huấn luyện viên thể hình cá nhân (PT) và Private Gyms** trong môn học EXE201.  
> Tôn chỉ và lời hứa cốt lõi của FitSync gói gọn trong 5 chữ: **'Less Admin. More Coaching.'** — Giảm bớt bàn giấy hành chính, để HLV tập trung 100% chuyên môn nâng cao thể chất cho học viên."

#### [Slide 2: Vấn đề nhức nhối & Dữ liệu khảo sát 104 PT]
*(01:00 – 02:00)*
> "Thưa Thầy, kế thừa từ nghiên cứu thị trường ở môn EXE101, nhóm chúng em đã tiến hành khảo sát thực tế trên **104 Huấn luyện viên thể hình tại TP.HCM**. Kết quả cho thấy 3 nỗi đau kinh niên đang bóp nghẹt thu nhập của các PT:  
> 1. **Mất hơn 10 giờ mỗi tuần** chỉ để gõ số liệu InBody từ giấy vào Excel, tính toán Calo/Macro và ghi nhật ký học viên.  
> 2. **Công cụ phân mảnh cực nặng:** PT phải nhảy qua lại giữa Zalo để nhắn tin, Excel để theo dõi số đo, MyFitnessPal để tính calo, và album ảnh điện thoại đầy nghẹt ảnh bữa ăn của học viên.  
> 3. **Mất khách do không kiểm soát được hành vi:** 73% PT chia sẻ rằng họ chỉ phát hiện học viên bỏ tập khi người đó đã nghỉ quá 1 tuần, lúc đó gần như không thể cứu vãn được hợp đồng gia hạn."

#### [Slide 3: Giải pháp FitSync & Customer Journey]
*(02:00 – 03:00)*
> "FitSync ra đời để giải quyết triệt để sự phân mảnh đó bằng một luồng trải nghiệm khép kín:  
> - PT chỉ mất **30 giây chụp ảnh phiếu InBody giấy** ➔ AI OCR tự động bóc tách 5 chỉ số sinh trắc học và gợi ý thực đơn chuẩn món ăn Việt Nam.  
> - Học viên nhận mã mời an toàn, check-in món ăn hàng ngày trên điện thoại chỉ bằng 1 thao tác chụp ảnh.  
> - Hệ thống tự động kích hoạt **Cảnh báo đỏ (Red Alert)** nếu học viên bỏ check-in quá 3 ngày, giúp PT lập tức nhắn Zalo chăm sóc kịp thời trước khi học viên nản chí.  
> Với mức giá thuê bao chỉ **199.000 VNĐ/tháng (gói Pro)**, điểm hòa vốn của FitSync chỉ là **45 PT**, một con số hoàn toàn khả thi trong thị trường thể hình đang tăng trưởng 9.2% tại Việt Nam."

---

### PHẦN 2: TUẦN 1 — PROJECT LAUNCH, QUẢN TRỊ AGILE & CAM KẾT ĐẦU RA (Phút 03:00 – 08:00)
*Mục tiêu: Chứng minh tính kỷ luật, công cụ quản trị chuyên nghiệp trên Trello/GitHub và cam kết 3 chuẩn đầu ra OC1, OC2, OC3.*

#### [Slide 4: Quản trị Agile, Trello 8 Cột & Phân công 5 thành viên]
*(03:00 – 04:30)*
> "Ngay trong Tuần 1, nhóm đã xác định: một startup công nghệ không thể thành công nếu thiếu tính kỷ luật quản trị. Chúng em đã thiết lập ngay:  
> - **Bảng Trello Board 8 danh sách Kanban chuẩn quốc tế** với **81 thẻ công việc** được gắn mốc tuần W01 đến W14, phân định rõ Owner, Reviewer, Checklist và bằng chứng nghiệm thu (không có bằng chứng, không kéo sang DONE).  
> - **Kho mã nguồn GitHub Monorepo** với cơ chế phân quyền bảo mật, tự động chạy CI/CD quality gates.  
> - **5 thành viên được phân bổ chuyên biệt theo rủi ro:**  
>   + Em — Huỳnh Quốc Việt: Leader quản trị Trello, điều phối kỹ thuật và chịu trách nhiệm 3 chuẩn đầu ra.  
>   + Bạn Lê Nguyễn Gia Hưng: AI Engineer phụ trách bộ dữ liệu benchmark InBody OCR.  
>   + Bạn Dương Quang Huy: Backend Architect thiết lập cơ sở dữ liệu Supabase và phân quyền RLS.  
>   + Bạn Diệp Khai: Frontend/Mobile Lead phụ trách đóng gói Android CH Play và giao diện Review OCR.  
>   + Bạn Lê Văn Toàn: UI/UX & Marketing Lead phụ trách Design System Carbon Dark và chiến dịch kéo người dùng."

#### [Slide 5: Thiết kế hệ thống toàn diện (Final System Design)]
*(04:30 – 06:00)*
> "Trong Form nộp Tuần 1, nhóm đã hoàn thiện bản thiết kế kiến trúc toàn diện gồm 4 trụ cột:  
> 1. **Giao diện Web Responsive & Mobile View:** PT dùng trên laptop/tablet/điện thoại; học viên có giao diện mobile tối giản, nhanh, mượt.  
> 2. **Cơ sở dữ liệu Supabase/PostgreSQL:** Thiết kế các bảng cốt lõi `profiles`, `trainee_profiles`, `inbody_records`, `ocr_attempts`, `checkins`, `meal_logs` với khóa ngoại toàn vẹn.  
> 3. **Bảo mật đa người dùng (Multi-tenant RLS):** Dữ liệu học viên của PT nào thì chỉ duy nhất PT đó và học viên đó được xem, ngăn chặn tuyệt đối rò rỉ dữ liệu y tế nhạy cảm.  
> 4. **Hệ thống đo lường Analytics:** Sẵn sàng tích hợp GA4 và Google Play Console để theo dõi lưu lượng truy cập và lượt tải."

#### [Slide 6: Ma trận cam kết 3 Chuẩn đầu ra môn học (OC1, OC2, OC3)]
*(06:00 – 08:00)*
> "Thưa Thầy, để đạt kết quả xuất sắc môn EXE201, SafeTrail cam kết 100% bám sát tiêu chí của Bộ môn:  
> - **Chuẩn đầu ra OC1 (Tuần 4–7):** Đạt điểm tối đa **10 ĐIỂM** bằng cách đóng gói ứng dụng đưa lên **Google Play Store (CH Play)** thông qua kiến trúc **Trusted Web Activity (TWA)** chuẩn [ADR-003](fitsync-app/docs/architecture/adr-003-android-packaging-path.md), kèm file APK dự phòng và vận hành bảng Trello minh bạch.  
> - **Chuẩn đầu ra OC2 (Tuần 7–10):** Tập trung tối ưu **2 Kênh Marketing có chuyển đổi cao nhất**, xây dựng mô hình phễu đánh giá AARRR rõ ràng, đo lường bằng GA4 với mục tiêu **1.000+ visits** và **100+ app installs**.  
> - **Chuẩn đầu ra OC3 (Tuần 10–14):** Cam kết đạt tối thiểu **>= 20 người dùng trả phí thực tế (Paid Users)** có đầy đủ sao kê dòng tiền thật qua cổng **VietQR Napas247**, kèm Video Demo 3–5 phút và TVC quảng cáo 60–90 giây chuyên nghiệp."

---

### PHẦN 3: TUẦN 2 — MÔ HÌNH TARGET KPIS, PHỄU AARRR & 2 KÊNH MARKETING CHỦ LỰC (Phút 08:00 – 13:00)
*Mục tiêu: Làm rõ tư duy kinh doanh B2B SaaS, chiến lược phễu đo lường và 2 kênh mang lại khách hàng thật.*

#### [Slide 7: Bộ chỉ số đo lường hiệu quả (Target KPIs)]
*(08:00 – 09:30)*
> "Bước sang Tuần 2, chúng em lượng hóa toàn bộ hành trình bằng bộ chỉ số Target KPIs cụ thể:  
> - **Acquisition KPIs:** Đạt 1.000+ lượt truy cập website, 100+ lượt tải app trên CH Play, 80+ leads PT chất lượng.  
> - **Activation KPIs:** Tỷ lệ kích hoạt > 70% (PT quét thử thành công 1 phiếu InBody hoặc tạo 1 học viên), thời gian nhận giá trị đầu tiên < 45 giây.  
> - **Retention KPIs:** WAU > 40%, mỗi PT quản lý ổn định 3–5 học viên đang tập luyện.  
> - **Revenue KPIs:** >= 20 khách hàng trả phí, tỷ lệ chuyển đổi dùng thử sang trả tiền đạt 15–20%, CAC duy trì dưới 50.000 VNĐ/khách hàng."

#### [Slide 8: Mô hình phễu chuyển đổi AARRR tích hợp GA4 & UTM Tracking]
*(09:30 – 11:00)*
> "Để không bị mù mờ về số liệu, nhóm thiết lập phễu **AARRR (Acquisition – Activation – Retention – Revenue – Referral)** được theo dõi hàng tuần:  
> - Mọi đường link chia sẻ đều được gắn mã **UTM Parameters** để biết chính xác lượt truy cập đến từ kênh nào.  
> - Sự kiện người dùng (đăng ký, quét InBody, bấm nâng cấp) được ghi nhận tự động vào **Google Analytics 4 (GA4)** và Dashboard quản trị Supabase.  
> Nhờ đó, nhóm biết chính xác chi phí để có 1 lượt tải app và 1 khách hàng trả tiền là bao nhiêu."

#### [Slide 9: 5 Kênh tiếp cận & 2 Kênh Marketing Chủ lực (Phục vụ OC2)]
*(11:00 – 12:00)*
> "Trong số 5 kênh tiếp cận khách hàng, nhóm dồn 80% nguồn lực vào **2 KÊNH CHỦ LỰC** có hiệu quả chuyển đổi cao nhất:  
> 1. **Kênh chủ lực 1 — Direct Field Sales tại các Private Gym & Boutique Studio (B2B):** Chúng em đến tận nơi các phòng gym tư nhân tại Quận 7, Bình Thạnh, demo trực tiếp tận tay HLV trưởng. Đây là kênh ngắn nhất, tỷ lệ chuyển đổi dùng thử đạt trên 70%, là nguồn đem lại **20 Paid Users cốt lõi cho OC3**.  
> 2. **Kênh chủ lực 2 — Video ngắn TikTok/Reels kết hợp Cộng đồng PT:** Sản xuất các video ngắn 'đánh trúng nỗi đau' của PT khi phải ngồi tính macro lúc đêm muộn. Kênh này tạo Visual Proof mạnh mẽ, kéo traffic vào Landing Page và kích thích tải app với chi phí 0 đồng.  
> Ba kênh bổ trợ gồm: Hợp tác Micro-KOLs PT, Trung tâm đào tạo chứng chỉ HLV (VFA/NASM) và Mạng lưới cá nhân."

#### [Slide 10: Kế hoạch thử nghiệm ngân sách tinh gọn & Huy động nguồn lực]
*(12:00 – 13:00)*
> "Về tài chính, nhóm áp dụng chiến lược tinh gọn:  
> - **Giai đoạn đầu (0 VNĐ):** 5 thành viên tự đi thực địa và tự sản xuất nội dung viral.  
> - **Giai đoạn tăng tốc (800k – 1M VNĐ):** Chạy thử nghiệm Hyper-targeted Meta Ads với ngân sách 500k nhắm đúng Job title 'Personal Trainer' tại TP.HCM (target CPI < 12.000đ), và dành 300k tặng bình lắc gym khuyến khích PT dùng thử 7 ngày liên tục.  
> - **Huy động nguồn lực:** 5 thành viên đóng góp quỹ ban đầu 200k/bạn để thanh toán phí Google Play Console ($25) và chi phí test API, bảo đảm dự án tự chủ và vận hành nghiêm túc."

---

### PHẦN 4: TUẦN 3 — PRE-LAUNCHING, KẾT QUẢ THỰC ĐỊA & KẾ HOẠCH 10 KHÁCH HÀNG ĐẦU TIÊN (Phút 13:00 – 18:00)
*Mục tiêu: Đưa ra bằng chứng thực tế, phản hồi của PT thật và kế hoạch chốt đơn hàng có dòng tiền.*

#### [Slide 11: Hoạt động tiền ra mắt (Pre-launching Activities)]
*(13:00 – 14:30)*
> "Ở Tuần 3, nhóm đã hoàn thiện toàn bộ công tác chuẩn bị trước giờ G:  
> - Đóng gói bộ cài đặt ứng dụng Android App Bundle (.aab), thiết kế 5 ảnh chụp màn hình ứng dụng nổi bật, chính sách bảo mật để sẵn sàng xuất bản Google Play.  
> - Hoàn thiện Landing Page thu thập danh sách chờ (Waitlist) tích hợp GA4 tracking.  
> - Kích hoạt gói ưu đãi **Founder's Early Bird:** Giảm 50% trọn đời chỉ còn **99.000 VNĐ/tháng** cho 30 PT đầu tiên đăng ký, tạo động lực chốt hợp đồng cực lớn."

#### [Slide 12: Báo cáo kết quả thử nghiệm thực tế (Initial Test Results)]
*(14:30 – 16:00)*
> "Chúng em không chỉ làm việc trên slide mà đã mang sản phẩm đi 'chạm mặt' thực tế:  
> - **Về thực địa phòng gym:** Nhóm đã đến 4 cơ sở Boutique Gym tại Bình Thạnh và Quận 7, gặp trực tiếp 8 HLV và 2 Quản lý phòng tập. Kết quả: **6/8 PT hào hứng đồng ý dùng thử ngay**; đặc biệt, Quản lý **K-Gym Studio** đã đồng ý cho 5 HLV của phòng tham gia chạy thử nghiệm có thu phí gói pilot.  
> - **Về mạng xã hội:** 2 video ngắn demo tính năng quét InBody đăng trên TikTok và Group PT đã thu hút **hơn 2.800 lượt xem tự nhiên**, mang về **24 PT đăng ký nhận thông tin tải app sớm**.  
> Đây là bằng chứng thép chứng minh nhu cầu thị trường đối với FitSync là hoàn toàn có thật!"

#### [Slide 13: Kế hoạch chuyển đổi 10 Người dùng trả phí đầu tiên]
*(16:00 – 18:00)*
> "Để đảm bảo chuẩn đầu ra OC3, nhóm đã lập danh sách định danh cụ thể cho **10 khách hàng trả phí đầu tiên**:  
> - **Nhóm 1 (5 PT tại K-Gym Studio — Bình Thạnh):** Chuyển đổi từ hợp đồng pilot với chủ cơ sở, dự kiến thu 99k/PT/tháng.  
> - **Nhóm 2 (2 PT tại The Private Fit — Quận 7):** Các HLV độc lập đang quản lý 15–20 học viên, rất cần tính năng nhắc nhở 3 ngày không check-in.  
> - **Nhóm 3 (3 HLV Freelance quen biết):** Được nhóm trực tiếp hỗ trợ 1-1 để chuyển đổi sang gói Pro trả tiền qua VietQR.  
> Mọi khoản thanh toán đều được thực hiện qua **mã VietQR động**, tiền chuyển thẳng vào tài khoản ngân hàng dự án để trích xuất sao kê minh chứng giao dịch không thể làm giả."

---

### PHẦN 5: BỨT PHÁ TUẦN 4 & LIVE DEMO SẢN PHẨM THỰC TẾ (Phút 18:00 – 24:00)
*Mục tiêu: Đỉnh cao công nghệ — Chứng minh mã nguồn trên GitHub, chạy demo trực tiếp tính năng Quét InBody OCR và xác nhận sẵn sàng lên CH Play lấy 10 điểm OC1.*

#### [Slide 14: Bứt phá Tuần 4 — Milestone M4 AI InBody OCR Foundation]
*(18:00 – 19:30)*
> "Thưa Thầy, Tuần 4 chính là bước ngoặt công nghệ lớn nhất của dự án. Trong tuần vừa qua, nhóm SafeTrail đã hoàn thành xuất sắc **Milestone M4: AI OCR & Android Packaging**, thể hiện qua 3 Pull Request quy chuẩn trên GitHub:  
> - **PR #12 của Huy (Đã Merge):** Thiết kế bảng `ocr_attempts`, bucket lưu trữ ảnh bảo mật `inbody-media`, hàm PostgreSQL nguyên tử `confirm_ocr_inbody_record` và bộ kiểm thử bảo mật RLS.  
> - **PR #13 của Hưng (Đã Merge):** Bổ sung Supabase Admin Client, tước quyền sửa đổi trái phép của client thường để chống gian lận số liệu, cấu hình Sharp WebP và hoàn thiện **111 bài test bảo mật pgTAP pass 100%**.  
> - **PR #11 của Khai (Đã được Tech Lead Việt Approved sáng nay):** Xây dựng giao diện duyệt nháp OCR trên `InBodyForm.tsx`, bổ sung nút hủy bản nháp, xoay ảnh tự động `.rotate()`, vượt qua 33 bài test Vitest và hoàn thiện tài liệu kiến trúc đóng gói Android **[ADR-003](fitsync-app/docs/architecture/adr-003-android-packaging-path.md)**."

#### [Slide 15: LIVE DEMO SẢN PHẨM TRỰC TIẾP TRÊN TRÌNH DUYỆT]
*(19:30 – 23:00)*
*(Việt chuyển màn hình sang trình duyệt `http://localhost:3000` hoặc bản build điện thoại)*
> "Sau đây, em xin phép trình diễn **Live Demo sản phẩm thực tế** đang chạy trên máy:  
> 1. **Giao diện Dashboard PT (`/app/dashboard`):** Thầy có thể thấy ngay danh sách học viên trực quan, số buổi tập còn lại, và **Thẻ cảnh báo đỏ '3+ ngày không check-in'** hiển thị nổi bật kèm nút nhắn tin Zalo tiện lợi.  
> 2. **Luồng Quét phiếu InBody (`InBodyForm.tsx`):**  
>    - Em bấm tải lên một bức ảnh chụp phiếu InBody 270.  
>    - Hệ thống tự động xoay ảnh chuẩn hướng bằng Sharp, kiểm tra chữ ký nhị phân magic bytes và bóc tách tự động: Cân nặng 70.5kg, Cơ xương 32kg, Khối mỡ 14kg, Tỷ lệ mỡ 20%.  
>    - Nếu tỷ lệ mỡ mâu thuẫn với khối lượng mỡ, hệ thống sẽ hiện **viền cảnh báo vàng** cảnh báo PT.  
>    - PT có thể bấm nút **'Hủy bản nháp OCR / Nhập thủ công'** để xóa trắng form, hoặc chỉnh sửa số liệu và tick chọn 'Sẵn sàng xác nhận'.  
>    - Khi bấm lưu, bản ghi được khóa bất biến (immutable), bảo đảm độ chính xác y tế tuyệt đối.  
> 3. **Giao diện học viên (`/app/trainee`):** Tối ưu trên điện thoại di động, theo dõi streak tập luyện và nhật ký bữa ăn hàng ngày."

#### [Slide 16: Lộ trình phát hành Google Play (OC1) & Tiến độ Tuần 5–7]
*(23:00 – 24:00)*
> "Với mã nguồn đã chuẩn hóa, trong Tuần 5 nhóm sẽ:  
> - Xuất bản bản build TWA (.aab) lên **Google Play Console (CH Play)** để nghiệm thu trọn vẹn điểm 10 đầu ra OC1.  
> - Hoàn thành bộ đo kiểm benchmark OCR InBody 270 (Issue #2).  
> - Khởi quay TVC quảng cáo và mở bán chính thức gói Pro qua VietQR."

---

### PHẦN 6: TỔNG KẾT & PHẢN BIỆN Q&A (Phút 24:00 – 30:00)

#### [Slide 17: Kết luận, Mã QR Minh chứng & Cảm ơn]
*(24:00 – 25:00)*
> "Tóm lại, dự án FitSync của team SafeTrail:  
> - **Đã có sản phẩm thật (MVP Working Code):** Kiểm thử tự động xanh 100%, bảo mật RLS đa tầng.  
> - **Đã có thị trường thật (Validated Demand):** Khảo sát 104 PT, 6 PT đồng ý dùng thử trực tiếp và 1 phòng gym pilot.  
> - **Đã có kế hoạch dòng tiền thật:** Bám sát 20 Paid Users thanh toán qua VietQR.  
> Chúng em xin trân trọng cảm ơn Thầy đã lắng nghe! Sau đây, nhóm SafeTrail xin sẵn sàng lắng nghe các câu hỏi và góp ý từ Thầy."

---

## 🛡️ BỘ KỊCH BẢN PHẢN BIỆN CÂU HỎI HÓC BÚA CỦA GIẢNG VIÊN (Q&A CHEAT-SHEET)

### Câu 1: "Tại sao nhóm chọn đóng gói Trusted Web Activity (TWA) thay vì viết lại React Native / Flutter cho CH Play?"
* **Người trả lời:** **Diệp Khai (Mobile Lead) hoặc Việt**
* **Ý trả lời:**
  > "Dạ thưa Thầy, nhóm đã phân tích rất kỹ trong tài liệu kiến trúc **[ADR-003](fitsync-app/docs/architecture/adr-003-android-packaging-path.md)**:  
  > 1. FitSync sử dụng kiến trúc Next.js App Router với Server Actions và Supabase SSR Auth. Nếu dùng Capacitor, chúng em buộc phải chuyển sang Static Export làm mất toàn bộ Server Actions. Nếu dùng React Native, nhóm sẽ phải viết lại toàn bộ UI và duy trì 2 codebase song song, vi phạm nguyên tắc 'Smallest Viable Path' của một startup tinh gọn.  
  > 2. TWA cho phép đóng gói website responsive hiện tại thành file `.aab` chạy trực tiếp trên Chrome runtime của Android, được Google Play chấp thuận 100% (như Twitter, Pinterest đang làm), hỗ trợ đầy đủ camera HTML5 `<input capture="environment">` và bảo toàn trọn vẹn tính năng web. Điều này giúp nhóm đạt **điểm 10 tuyệt đối ở chuẩn đầu ra OC1** nhanh nhất mà không lãng phí nguồn lực."

### Câu 2: "Độ chính xác của AI OCR là bao nhiêu? Nếu ảnh chụp mờ hoặc phiếu bị nhàu nát thì xử lý thế nào?"
* **Người trả lời:** **Lê Nguyễn Gia Hưng (AI Lead)**
* **Ý trả lời:**
  > "Dạ thưa Thầy, nguyên tắc của FitSync là **'Human-in-the-loop' (Luôn có con người kiểm duyệt)** theo [ADR-002](fitsync-app/docs/architecture/adr-002-ocr-drafts-behind-provider-adapter.md):  
  > 1. Kết quả OCR chỉ được coi là 'bản nháp gợi ý' (draft values), hệ thống không bao giờ tự động lưu số liệu này vào hồ sơ y tế nếu PT chưa kiểm tra và bấm xác nhận.  
  > 2. Nếu ảnh quá mờ hoặc lỗi định dạng nhị phân, server action sẽ trả về lỗi an toàn và giữ nguyên form cho PT nhập tay bình thường.  
  > 3. Hệ thống có bộ quy tắc kiểm tra chéo (Cross-field consistency): ví dụ nếu tỷ lệ mỡ chênh lệch quá 2% so với khối lượng mỡ chia cho cân nặng, ô nhập liệu sẽ lập tức đổi màu vàng cảnh báo để PT nhận biết và sửa lại ngay."

### Câu 3: "20 Paid Users ở chuẩn đầu ra OC3 lấy từ đâu ra? Có chắc chắn họ sẽ trả tiền thật không?"
* **Người trả lời:** **Huỳnh Quốc Việt (Leader) & Lê Văn Toàn (Marketing)**
* **Ý trả lời:**
  > "Dạ thưa Thầy, nhóm em đã xây dựng lộ trình tiếp cận có tên tuổi cụ thể chứ không nói chung chung:  
  > 1. **5 PT tại K-Gym Studio (Bình Thạnh):** Quản lý đã đồng ý thử nghiệm có thu phí gói pilot sau buổi demo thực tế của nhóm ở Tuần 3.  
  > 2. **7 PT tại các phòng Boutique Fitness ở Quận 7:** Nơi nhóm trực tiếp đến demo tính năng quét InBody 30 giây giải phóng sức lao động.  
  > 3. **8+ HLV Freelance từ danh sách 24 leads trên TikTok/Group PT:** Đang được áp dụng chính sách 'Founder's Early Bird' giảm giá 50% trọn đời (99.000 VNĐ/tháng).  
  > Mức phí 99k chỉ bằng 1/5 giá 1 buổi tập PT dạy khách, nên giá trị FitSync mang lại (tiết kiệm 10 giờ làm việc) vượt xa chi phí bỏ ra. Nhóm sẽ đối soát bằng sao kê biến động số dư ngân hàng qua mã VietQR động để nộp đầy đủ chứng từ thật cho Thầy."

### Câu 4: "Dữ liệu cân nặng, mỡ cơ thể và ảnh bữa ăn của khách hàng được bảo mật như thế nào?"
* **Người trả lời:** **Dương Quang Huy (Backend Lead)**
* **Ý trả lời:**
  > "Dạ thưa Thầy, bảo mật dữ liệu sức khỏe là ưu tiên sống còn của FitSync:  
  > 1. Toàn bộ ảnh InBody và ảnh bữa ăn được lưu trữ trong **Storage Bucket Private (`inbody-media`, `meal-media`)**, hoàn toàn không có đường dẫn công khai trên internet.  
  > 2. Khi người dùng xem ảnh, server chỉ tạo một **Signed URL tạm thời có thời hạn 60 giây**, hết thời gian link sẽ tự hủy.  
  > 3. Ở tầng cơ sở dữ liệu, chúng em thiết lập chính sách **Row Level Security (RLS)** nghiêm ngặt: PT chỉ đọc được dữ liệu học viên do chính mình phụ trách. Chúng em đã viết và chạy pass **111 bài test bảo mật pgTAP** trên Docker để chứng minh không có lỗ hổng rò rỉ dữ liệu chéo giữa các tài khoản."
