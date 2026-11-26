import Link from "next/link";
import { Check, Sparkles, Shield, Zap, Users, ArrowRight } from "lucide-react";

export function IntakeJourney() {
  return (
    <section className="landing-context visual-journey wrap" id="quy-trinh" aria-labelledby="intake-heading">
      <div className="context-heading compact-heading">
        <div>
          <span className="landing-kicker">Quy trình vận hành</span>
          <h2 id="intake-heading">3 bước đồng hành tinh gọn.</h2>
        </div>
        <p>Bắt đầu trong 30 giây. Kết nối đúng người, chuẩn dữ liệu ngay từ buổi đầu.</p>
      </div>
      <ol className="intake-steps">
        <li>
          <div className="journey-preview preview-person" aria-hidden="true">
            <span className="journey-avatar">KL</span>
            <strong>Khánh Linh</strong>
            <span>Mục tiêu: Giảm mỡ & Giữ nhịp</span>
            <div className="preview-connection"><i /> Đã liên kết PT</div>
          </div>
          <div>
            <span className="journey-step">Bước 01</span>
            <h3>Tạo hồ sơ &amp; Gửi link mời</h3>
            <p>Tạo mục tiêu, thiết lập số buổi gói tập và gửi link kích hoạt 1 lần bảo mật cho học viên.</p>
          </div>
        </li>
        <li>
          <div className="journey-preview preview-report" aria-hidden="true">
            <span>Phiếu InBody · PT duyệt</span>
            <div><strong>70,4 <small>kg</small></strong><span>Cân nặng</span></div>
            <div className="preview-connection"><i /> Đã xác nhận</div>
          </div>
          <div>
            <span className="journey-step">Bước 02</span>
            <h3>Xác thực InBody &amp; Lên lịch</h3>
            <p>PT đối chiếu và xác nhận 5 chỉ số đo trước khi lưu. Lên lịch hẹn tuần trực quan trên lưới.</p>
          </div>
        </li>
        <li>
          <div className="journey-preview preview-update" aria-hidden="true">
            <span className="preview-bubble">Hôm nay em đã hoàn thành bữa ăn & buổi tập!</span>
            <div className="preview-update-line"><span>Check-in</span><strong>Đã ghi nhận</strong></div>
            <div className="preview-update-line"><span>Gói PT</span><strong>8 / 12 buổi</strong></div>
          </div>
          <div>
            <span className="journey-step">Bước 03</span>
            <h3>Theo sát nhịp sinh hoạt</h3>
            <p>Học viên check-in ảnh bữa ăn hàng ngày, nhận tin nhắn động viên và xem tiến trình rõ ràng.</p>
          </div>
        </li>
      </ol>
    </section>
  );
}

export function PricingSection() {
  return (
    <section className="pricing-section wrap" id="bang-gia" aria-labelledby="pricing-heading">
      <div className="section-heading text-center">
        <span className="landing-kicker">Bảng giá minh bạch</span>
        <h2 id="pricing-heading">Chọn gói phù hợp với quy mô của bạn.</h2>
        <p className="pricing-subhead">Bắt đầu miễn phí hoàn toàn. Nâng cấp bất cứ khi nào bạn mở rộng tệp học viên.</p>
      </div>

      <div className="pricing-grid">
        {/* Free Plan */}
        <div className="pricing-card">
          <div className="pricing-badge">Khởi đầu</div>
          <h3>Gói Miễn Phí</h3>
          <p className="pricing-desc">Dành cho PT mới bắt đầu hoặc quản lý tệp học viên trọng tâm.</p>
          <div className="pricing-price">
            <strong>0đ</strong>
            <span>/ trọn đời</span>
          </div>
          <ul className="pricing-features">
            <li><Check size={16} /> Tối đa <strong>3 học viên</strong> đang hoạt động</li>
            <li><Check size={16} /> Đầy đủ 5 tính năng: Lịch, InBody, Check-in, Chat</li>
            <li><Check size={16} /> Link mời học viên 1 lần bảo mật</li>
            <li><Check size={16} /> Học viên luôn dùng miễn phí 100%</li>
          </ul>
          <Link href="/register" prefetch={true} className="button outline pricing-btn">
            Tạo tài khoản Free
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="pricing-card is-popular">
          <div className="pricing-badge popular-badge"><Sparkles size={14} /> Phổ biến nhất</div>
          <h3>Gói Chuyên Nghiệp</h3>
          <p className="pricing-desc">Dành cho Huấn luyện viên chuyên nghiệp kèm nhiều học viên cùng lúc.</p>
          <div className="pricing-price">
            <strong>199.000đ</strong>
            <span>/ tháng</span>
          </div>
          <ul className="pricing-features">
            <li><Check size={16} /> <strong>Không giới hạn</strong> số lượng học viên</li>
            <li><Check size={16} /> Lưu trữ toàn bộ lịch sử chỉ số & hình ảnh bữa ăn</li>
            <li><Check size={16} /> Cảnh báo học viên vắng mặt tự động</li>
            <li><Check size={16} /> Tách biệt ghi chú chiến thuật riêng tư</li>
            <li><Check size={16} /> Ưu tiên trải nghiệm tính năng OCR mở rộng</li>
          </ul>
          <Link href="/register" prefetch={true} className="button sun pricing-btn">
            Bắt đầu dùng Pro <ArrowRight size={16} />
          </Link>
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
