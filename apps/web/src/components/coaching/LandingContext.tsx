import Link from "next/link";

export function IntakeJourney() {
  return (
    <section className="landing-context visual-journey wrap" id="bat-dau" aria-labelledby="intake-heading">
      <div className="context-heading compact-heading">
        <div>
          <span className="landing-kicker">Quy trình 3 bước</span>
          <h2 id="intake-heading">Từ buổi đầu. Đến lần tập tiếp theo.</h2>
        </div>
        <p>Tiếp nhận nhanh một lần. Mở đúng hồ sơ để đồng hành xuyên suốt.</p>
      </div>
      <ol className="intake-steps">
        <li>
          <div className="journey-preview preview-person" aria-hidden="true">
            <span className="journey-avatar">KL</span>
            <strong>Khánh Linh</strong>
            <span>Mục tiêu: Giữ nhịp tập đều</span>
            <div className="preview-connection"><i /> Đã kết nối PT</div>
          </div>
          <div>
            <span className="journey-step">01 · Kết nối</span>
            <h3>Tạo hồ sơ &amp; mời học viên</h3>
            <p>Gửi liên kết mời một lần, tách biệt hoàn toàn dữ liệu theo cặp.</p>
          </div>
        </li>
        <li>
          <div className="journey-preview preview-report" aria-hidden="true">
            <span>Phiếu đo → PT duyệt</span>
            <div><strong>70,4 <small>kg</small></strong><span>Cân nặng</span></div>
            <div className="preview-connection"><i /> Đã xác nhận</div>
          </div>
          <div>
            <span className="journey-step">02 · Số đo</span>
            <h3>Đối chiếu chỉ số InBody</h3>
            <p>PT kiểm duyệt 5 chỉ số nền trước khi lưu vào biểu đồ tiến trình.</p>
          </div>
        </li>
        <li>
          <div className="journey-preview preview-update" aria-hidden="true">
            <span className="preview-bubble">Hôm nay em đã tập rồi ạ.</span>
            <div className="preview-update-line"><span>Check-in</span><strong>Đã ghi nhận</strong></div>
            <div className="preview-update-line"><span>Gói PT</span><strong>8 / 12 buổi</strong></div>
          </div>
          <div>
            <span className="journey-step">03 · Đồng hành</span>
            <h3>Theo sát mỗi ngày</h3>
            <p>Check-in, lịch tập chung, ghi chú và số buổi ngay trong một hồ sơ.</p>
          </div>
        </li>
      </ol>
    </section>
  );
}

const capabilities = [
  ["Có trong workspace", "Hồ sơ & Lời mời", "Tạo, sửa, lưu trữ học viên; link mời dùng một lần và lịch sử chỉ số."],
  ["Có trong workspace", "Check-in & Số buổi", "Check-in hằng ngày, ảnh riêng tư, membership và sổ buổi PT."],
  ["Có trong workspace", "Chat & Lịch chung", "Trao đổi riêng tư, xếp lịch chung, đề nghị đổi/hủy có kiểm soát."],
  ["Đang lên kế hoạch", "OCR đa hãng & App mở rộng", "Nhập tay và PT duyệt chạy độc lập; OCR tự động cần benchmark riêng."],
];

export function CapabilityStatus() {
  return (
    <section className="landing-context compact-band wrap" id="tinh-nang" aria-labelledby="capability-heading">
      <div className="compact-band-header">
        <div>
          <span className="landing-kicker">Phạm vi hệ thống</span>
          <h2 id="capability-heading">Rõ phần đã chạy. Minh bạch lộ trình.</h2>
        </div>
        <details className="capability-disclosure compact-disclosure">
          <summary>Xem chi tiết trạng thái tính năng</summary>
          <dl className="capability-list">
            {capabilities.map(([status, title, description]) => (
              <div key={title}>
                <dt><span>{status}</span><strong>{title}</strong></dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </section>
  );
}

export function ResearchSnapshot() {
  return (
    <section className="research-snapshot compact-research" aria-labelledby="research-heading">
      <div className="wrap research-layout">
        <div>
          <span className="landing-kicker">Bài toán thực tế</span>
          <h2 id="research-heading">Bắt đầu từ lắng nghe PT.</h2>
          <p>Khảo sát 104 PT &amp; quản lý phòng tập tại Việt Nam.</p>
        </div>
        <div>
          <dl className="research-counts compact-counts">
            <div><dt>Tốn &gt;3 giờ/tuần cho việc giấy tờ</dt><dd>84<span>/104</span></dd></div>
            <div><dt>Dùng Zalo/Messenger rời rạc</dt><dd>101<span>/104</span></dd></div>
            <div><dt>Đang kèm từ 5 học viên trở lên</dt><dd>73<span>/104</span></dd></div>
          </dl>
          <details className="compact-research-note">
            <summary>Nguồn và giới hạn khảo sát</summary>
            <p>Tổng hợp từ 104 phiếu khảo sát FitSync (27/09/2026), không đại diện toàn bộ thị trường PT Việt Nam và không dùng làm số khách hàng thực tế.</p>
          </details>
        </div>
      </div>
    </section>
  );
}

export function TeamDetails() {
  return (
    <details id="team">
      <summary>Đội ngũ phát triển — Team SafeTrail (EXE201)</summary>
      <dl className="team-roles compact-team-grid">
        <div><dt>Huỳnh Quốc Việt</dt><dd>Product &amp; OCR</dd></div>
        <div><dt>Lê Nguyễn Gia Hưng</dt><dd>Data &amp; Benchmark</dd></div>
        <div><dt>Dương Quang Huy</dt><dd>Web &amp; Mobile UI</dd></div>
        <div><dt>Diệp Khai</dt><dd>Backend, RLS &amp; Ops</dd></div>
        <div><dt>Lê Văn Toàn</dt><dd>UI/UX &amp; Nội dung</dd></div>
      </dl>
    </details>
  );
}

export function CoachingOffer() {
  return (
    <section className="coaching-offer compact-offer wrap" aria-labelledby="offer-heading">
      <div className="offer-split-card">
        <div className="offer-copy">
          <span className="landing-kicker">Gói sử dụng</span>
          <h2 id="offer-heading">Một workspace cho PT.<br />Miễn phí cho học viên.</h2>
          <p>Gói Free tối đa 3 học viên đang hoạt động. Gói Pro 199.000đ/tháng không giới hạn hồ sơ.</p>
        </div>
        <div className="offer-relationship compact-relationship">
          <div><span className="offer-role">Huấn luyện viên (PT)</span><strong>Quản lý &amp; Đồng hành</strong><span>Hồ sơ · InBody · Lịch · Ghi chú</span></div>
          <span className="offer-link" aria-hidden="true">↔</span>
          <div><span className="offer-role">Học viên</span><strong>Không gian cá nhân</strong><span>Check-in · Tiến trình · Lịch hẹn</span></div>
        </div>
      </div>
    </section>
  );
}
