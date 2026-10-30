import Link from "next/link";

export function IntakeJourney() {
  return <section className="landing-context visual-journey wrap" id="bat-dau" aria-labelledby="intake-heading">
    <div className="context-heading"><h2 id="intake-heading">Từ buổi đầu.<br />Đến lần tập tiếp theo.</h2><p>Tiếp nhận một lần. Mở đúng hồ sơ để tiếp tục chăm học viên.</p></div>
    <ol className="intake-steps">
      <li><div className="journey-preview preview-person" aria-hidden="true"><span className="journey-avatar">KL</span><strong>Khánh Linh</strong><span>Muốn giữ nhịp tập đều</span><div className="preview-connection"><i /> Đã kết nối với PT</div></div><div><span className="journey-step">01</span><h3>Kết nối học viên</h3><p>Hồ sơ và mục tiêu ở cùng một nơi.</p></div></li>
      <li><div className="journey-preview preview-report" aria-hidden="true"><span>Phiếu đo → PT đối chiếu</span><div><strong>70,4 <small>kg</small></strong><span>Cân nặng</span></div><div className="preview-connection"><i /> PT đã xác nhận</div></div><div><span className="journey-step">02</span><h3>Xem lại trước khi lưu</h3><p>Giữ nguồn số đo. Phân biệt bản nháp và dữ liệu đã duyệt.</p></div></li>
      <li><div className="journey-preview preview-update" aria-hidden="true"><span className="preview-bubble">Hôm nay em đã tập rồi ạ.</span><div className="preview-update-line"><span>Check-in</span><strong>Đã ghi nhận</strong></div><div className="preview-update-line"><span>Gói PT</span><strong>8 / 12 buổi</strong></div></div><div><span className="journey-step">03</span><h3>Theo sát giữa các buổi</h3><p>Cập nhật, số đo và số buổi ngay trong hồ sơ.</p></div></li>
    </ol>
    <div className="context-note-line"><p>Giao diện minh họa, dữ liệu giả. Bản mẫu không lưu vào tài khoản.</p><Link href="/app/dashboard" className="landing-secondary">Khám phá bản mẫu PT</Link></div>
  </section>;
}

const capabilities = [
  ["Có trong workspace", "Hồ sơ và kết nối", "Tạo, sửa, tra cứu học viên; lời mời kết nối tài khoản và lịch sử chỉ số đã xác nhận."],
  ["Có trong workspace", "Cập nhật và số buổi", "Check-in, ghi chú, ảnh bữa ăn riêng tư và PT cập nhật số buổi còn lại. Chưa phải sổ ghi nhận từng buổi PT."],
  ["Chưa sẵn sàng đọc tự động", "Đọc phiếu InBody", "Có upload ảnh và bước PT kiểm duyệt. Đọc tự động cần dịch vụ được kết nối; PDF và chỉ số theo vùng chưa được hỗ trợ đầy đủ."],
  ["Đang lên kế hoạch", "Chat và lịch chung", "Trao đổi trực tiếp, cùng xem cuộc hẹn và đề nghị đổi lịch. Chat và cuộc hẹn trên landing hiện là minh họa."],
  ["Đang lên kế hoạch", "Membership và buổi PT", "Thời hạn gói riêng với số buổi PT. Đặt lịch hoặc tự check-in không đồng nghĩa đã sử dụng một buổi PT."],
  ["Hướng phát triển", "Điện thoại và trợ lý nhập liệu", "Ưu tiên Android, iPhone về sau. Ghi âm tư vấn, AI bữa ăn và thư viện bài tập cần được kiểm chứng trước khi phát hành."]
];
export function CapabilityStatus() {
  return <section className="landing-context wrap" id="tinh-nang" aria-labelledby="capability-heading"><div className="context-heading"><h2 id="capability-heading">Công việc của bạn.<br />Trạng thái của FitSync.</h2><p>Hướng đi là gom việc quản lý đang nằm trên Excel, giấy và Zalo vào một không gian. Đây là phần đã có và phần còn đang xây dựng.</p></div><details className="capability-disclosure"><summary>Xem tính năng đang có và hướng phát triển</summary><dl className="capability-list">{capabilities.map(([status,title,description]) => <div key={title}><dt><span>{status}</span><strong>{title}</strong></dt><dd>{description}</dd></div>)}</dl></details><p className="context-caption">Chưa công bố ngày phát hành các phần đang lên kế hoạch. Giao diện mẫu không chứng minh một chức năng đã vận hành với dữ liệu thật.</p></section>;
}
export function ResearchSnapshot() {
  return <section className="research-snapshot" aria-labelledby="research-heading"><div className="wrap research-layout"><div><h2 id="research-heading">Bắt đầu từ việc<br />lắng nghe PT.</h2><p>104 phiếu khảo sát trong nghiên cứu EXE101 của FitSync.</p></div><div><dl className="research-counts"><div><dt>Dành hơn 3 giờ mỗi tuần cho hành chính</dt><dd>84 <span>/ 104</span></dd></div><div><dt>Dùng Zalo hoặc Messenger trong bộ công cụ</dt><dd>101 <span>/ 104</span></dd></div><div><dt>Đang theo dõi ít nhất 5 học viên</dt><dd>73 <span>/ 104</span></dd></div></dl><details><summary>Nguồn và giới hạn khảo sát</summary><p>Số đếm tổng hợp từ khảo sát FitSync, rà soát ngày 27/09/2026. Trong 104 phiếu, 93 người tự nhận là PT, coach, chủ hoặc quản lý gym hay vai trò liên quan. Mẫu không đại diện cho toàn bộ PT Việt Nam; một số câu trả lời mở bị lặp. Không công khai danh tính hoặc trích dẫn cá nhân vì biểu mẫu không có mục đồng ý công bố.</p><p>Các số liệu thể hiện vấn đề người trả lời cho biết họ gặp phải. Chúng không phải số khách hàng, bằng chứng tiết kiệm thời gian hay tăng doanh thu của FitSync.</p></details></div></div></section>;
}
export function TeamDetails() {
  return <details id="team"><summary>Về đội ngũ SafeTrail và EXE201</summary><p>FitSync được phát triển bởi Team SafeTrail. Phân công theo tài liệu dự án:</p><dl className="team-roles"><div><dt>Huỳnh Quốc Việt</dt><dd>Điều phối sản phẩm và hướng OCR</dd></div><div><dt>Lê Nguyễn Gia Hưng</dt><dd>Dữ liệu và đánh giá OCR</dd></div><div><dt>Diệp Khai</dt><dd>Giao diện web và mobile</dd></div><div><dt>Dương Quang Huy</dt><dd>Backend, phân quyền và vận hành</dd></div><div><dt>Lê Văn Toàn</dt><dd>UI/UX và nội dung giới thiệu sản phẩm</dd></div></dl><p>Yêu cầu môn EXE201 được theo dõi riêng. Điểm số và màn demo không thay thế việc kiểm chứng giá trị với PT. Phần minh họa không đại diện cho khách hàng, doanh thu hoặc tính năng đã phát hành.</p></details>;
}

export function CoachingOffer() {
 return <section className="coaching-offer wrap" aria-labelledby="offer-heading"><div><h2 id="offer-heading">Một workspace cho PT.<br />Một lối vào cho học viên.</h2><p>Định hướng gói dịch vụ đang được xem xét: PT trả thuê bao; học viên được mời dùng kèm, không thu thêm phí nền tảng từ học viên.</p></div><div className="offer-relationship"><div><span className="offer-role">PT</span><strong>Quản lý và đồng hành</strong><span>Hồ sơ · Số đo · Cập nhật</span></div><span className="offer-link" aria-hidden="true">↔</span><div><span className="offer-role">Học viên</span><strong>Không gian của mình</strong><span>Theo dõi · Check-in · Phản hồi</span></div></div><div className="offer-status"><p>Giá và hạn mức đang được rà soát. Chưa mở thanh toán hoặc tự động gia hạn. Chat, lịch và các tính năng AI cần được hoàn thiện theo từng giai đoạn.</p><Link className="landing-secondary" href="/app/dashboard">Xem bản mẫu trước khi đăng ký</Link></div></section>;
}
