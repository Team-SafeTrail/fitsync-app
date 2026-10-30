import Link from "next/link";

export function IntakeJourney() {
  return <section className="landing-context wrap" id="bat-dau" aria-labelledby="intake-heading">
    <div className="context-heading"><h2 id="intake-heading">Từ buổi đầu.<br />Đến lần tập tiếp theo.</h2><p>Hồ sơ thay cho những lần tìm lại bảng tính, sổ ghi chép và tin nhắn. PT có đủ ngữ cảnh để tiếp tục đồng hành.</p></div>
    <ol className="intake-steps">
      <li><span>01</span><div><h3>Tạo hồ sơ, kết nối học viên</h3><p>Ghi mục tiêu và thông tin cần theo dõi. Gửi lời mời để học viên tạo tài khoản và kết nối với PT.</p></div></li>
      <li><span>02</span><div><h3>Đối chiếu và xác nhận số đo</h3><p>PT nhập hoặc xem lại bản nháp trước khi lưu. Chỉ số đã xác nhận và dữ liệu đang chờ duyệt được phân biệt rõ.</p></div></li>
      <li><span>03</span><div><h3>Theo dõi giữa các buổi tập</h3><p>Học viên gửi check-in, ghi chú và ảnh bữa ăn. PT xem cập nhật, lịch sử số đo và số buổi còn lại trong workspace.</p></div></li>
    </ol>
    <div className="context-note-line"><p>Luồng có trong code workspace; đăng nhập và lưu dữ liệu cần dịch vụ được cấu hình. Bản mẫu công khai dùng dữ liệu giả.</p><Link href="/app/dashboard" className="landing-secondary">Khám phá bản mẫu PT</Link></div>
  </section>;
}

const capabilities = [
  ["Có trong workspace", "Hồ sơ và kết nối", "Tạo, sửa, tra cứu học viên; lời mời kết nối tài khoản và lịch sử chỉ số đã xác nhận."],
  ["Có trong workspace", "Cập nhật và số buổi", "Check-in, ghi chú, ảnh bữa ăn riêng tư và PT cập nhật số buổi còn lại. Chưa phải sổ ghi nhận từng buổi PT."],
  ["Cần kết nối provider", "Đọc phiếu InBody", "Có upload ảnh và bước PT kiểm duyệt. Provider mặc định chưa đọc phiếu; PDF và chỉ số theo vùng chưa được hỗ trợ đầy đủ."],
  ["Đang lên kế hoạch", "Chat và lịch chung", "Trao đổi trực tiếp, cùng xem cuộc hẹn và đề nghị đổi lịch. Chat và cuộc hẹn trên landing hiện là minh họa."],
  ["Đang lên kế hoạch", "Membership và buổi PT", "Thời hạn gói riêng với số buổi PT. Đặt lịch hoặc tự check-in không đồng nghĩa đã sử dụng một buổi PT."],
  ["Hướng phát triển", "Điện thoại và trợ lý nhập liệu", "Ưu tiên Android, iPhone về sau. Ghi âm tư vấn, AI bữa ăn và thư viện bài tập cần được kiểm chứng trước khi phát hành."]
];
export function CapabilityStatus() {
  return <section className="landing-context wrap" id="tinh-nang" aria-labelledby="capability-heading"><div className="context-heading"><h2 id="capability-heading">Công việc của bạn.<br />Trạng thái của FitSync.</h2><p>Hướng đi là gom việc quản lý đang nằm trên Excel, giấy và Zalo vào một không gian. Đây là phần đã có và phần còn đang xây dựng.</p></div><dl className="capability-list">{capabilities.map(([status,title,description]) => <div key={title}><dt><span>{status}</span><strong>{title}</strong></dt><dd>{description}</dd></div>)}</dl><p className="context-caption">Chưa công bố ngày phát hành các phần đang lên kế hoạch. Giao diện mẫu không chứng minh một chức năng đã vận hành với dữ liệu thật.</p></section>;
}
export function ResearchSnapshot() {
  return <section className="research-snapshot" aria-labelledby="research-heading"><div className="wrap research-layout"><div><h2 id="research-heading">Bắt đầu từ việc<br />lắng nghe PT.</h2><p>104 phiếu khảo sát trong nghiên cứu EXE101 của FitSync.</p></div><div><dl className="research-counts"><div><dt>Dành hơn 3 giờ mỗi tuần cho hành chính</dt><dd>84 <span>/ 104</span></dd></div><div><dt>Dùng Zalo hoặc Messenger trong bộ công cụ</dt><dd>101 <span>/ 104</span></dd></div><div><dt>Đang theo dõi ít nhất 5 học viên</dt><dd>73 <span>/ 104</span></dd></div></dl><details><summary>Nguồn và giới hạn khảo sát</summary><p>Số đếm tổng hợp từ khảo sát FitSync, rà soát ngày 27/09/2026. Trong 104 phiếu, 93 người tự nhận là PT, coach, chủ hoặc quản lý gym hay vai trò liên quan. Mẫu không đại diện cho toàn bộ PT Việt Nam; một số câu trả lời mở bị lặp. Không công khai danh tính hoặc trích dẫn cá nhân vì biểu mẫu không có mục đồng ý công bố.</p><p>Các số liệu thể hiện vấn đề người trả lời cho biết họ gặp phải. Chúng không phải số khách hàng, bằng chứng tiết kiệm thời gian hay tăng doanh thu của FitSync.</p></details></div></div></section>;
}
export function TeamDetails() {
  return <details id="team"><summary>Về đội ngũ SafeTrail và EXE201</summary><p>FitSync được phát triển bởi Team SafeTrail. Phân công theo tài liệu dự án:</p><dl className="team-roles"><div><dt>Huỳnh Quốc Việt</dt><dd>Điều phối sản phẩm và hướng OCR</dd></div><div><dt>Lê Nguyễn Gia Hưng</dt><dd>Dữ liệu và đánh giá OCR</dd></div><div><dt>Diệp Khai</dt><dd>Giao diện web và mobile</dd></div><div><dt>Dương Quang Huy</dt><dd>Backend, phân quyền và vận hành</dd></div><div><dt>Lê Văn Toàn</dt><dd>UI/UX và nội dung giới thiệu sản phẩm</dd></div></dl><p>Yêu cầu môn EXE201 được theo dõi riêng. Điểm số và màn demo không thay thế việc kiểm chứng giá trị với PT. Phần minh họa không đại diện cho khách hàng, doanh thu hoặc tính năng đã phát hành.</p></details>;
}
