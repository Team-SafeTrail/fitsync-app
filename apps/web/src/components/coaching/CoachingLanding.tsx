"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  MessageSquareText,
  UsersRound,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Flame,
  Lock,
} from "lucide-react";
import { BrandMark } from "@/components/brand/Brand";
import WeightPlot from "./WeightPlot";
import { IntakeJourney, PricingSection } from "./LandingContext";

export default function CoachingLanding() {
  const [role, setRole] = useState<"pt" | "trainee">("pt");

  return (
    <div className="coaching-site">
      <main id="main-content">
        {/* Hero Section */}
        <section className="hero fs-hero modern-hero" aria-labelledby="hero-title">
          <Image
            className="hero-photo"
            src="/images/coaching-afternoon.webp"
            alt="Minh họa AI: PT và học viên trò chuyện giữa buổi tập trong một phòng gym Việt Nam"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-shade"></div>

          {/* Navigation Bar */}
          <header className="navigation">
            <Link className="brand" href="/" prefetch={true} aria-label="FitSync, về trang chủ">
              <BrandMark />
              <span>fitsync</span>
            </Link>
            <nav aria-label="Điều hướng chính">
              <Link href="#tinh-nang">Tính năng</Link>
              <Link href="#quy-trinh">Quy trình</Link>
              <Link href="#ho-so">Trải nghiệm</Link>
              <Link href="#bang-gia">Bảng giá</Link>
              <Link href="#faq">Hỏi đáp</Link>
            </nav>
            <div className="nav-actions-group">
              <Link className="nav-action is-register" href="/register" prefetch={true}>
                Đăng ký
              </Link>
              <Link className="nav-action is-login" href="/login" prefetch={true}>
                Đăng nhập
              </Link>
            </div>
          </header>

          {/* Hero Copy */}
          <div className="hero-copy modern-hero-copy">
            <span className="hero-pill-badge">
              <Sparkles size={14} /> Nền tảng đồng hành Huấn luyện viên &amp; Học viên
            </span>
            <h1 id="hero-title">
              Cùng tập.<br />Cùng tiến xa.
            </h1>
            <p className="hero-description">
              Không gian làm việc tinh gọn cho PT: Quản lý học viên, xác thực InBody, xếp lịch tập tuần và theo dõi check-in dinh dưỡng mỗi ngày.
            </p>
            <div className="hero-cta-group">
              <Link className="button sun hero-primary-btn" href="/register" prefetch={true}>
                Bắt đầu miễn phí <ArrowRight size={16} />
              </Link>
              <Link className="hero-ghost-btn" href="/login" prefetch={true}>
                Đăng nhập workspace
              </Link>
            </div>
          </div>

          {/* Highlights Metrics Bar */}
          <div className="hero-highlights-bar">
            <div className="highlight-item">
              <ShieldCheck size={18} />
              <span>100% Phân quyền bảo mật</span>
            </div>
            <div className="highlight-item">
              <TrendingUp size={18} />
              <span>Đối chiếu InBody minh bạch</span>
            </div>
            <div className="highlight-item">
              <CalendarDays size={18} />
              <span>Lịch tuần Google Calendar</span>
            </div>
            <div className="highlight-item">
              <CheckCircle2 size={18} />
              <span>Check-in dinh dưỡng riêng tư</span>
            </div>
          </div>
        </section>

        {/* 5 Core Feature Pillars (Bento Grid) */}
        <section className="wrap modern-features-section" id="tinh-nang" aria-labelledby="features-heading">
          <div className="section-heading text-center">
            <span className="landing-kicker">Chức năng cốt lõi</span>
            <h2 id="features-heading">Mọi công cụ PT cần để quản lý hiệu quả.</h2>
            <p className="section-subtitle">Loại bỏ ghi chép Zalo và sổ tay rời rạc. Toàn bộ hành trình huấn luyện nằm gọn trong một màn hình.</p>
          </div>

          <div className="features-bento-grid">
            {/* Feature 1 */}
            <article className="bento-card">
              <div className="bento-icon-box">
                <UsersRound size={22} />
              </div>
              <h3>Hồ sơ &amp; Quản lý gói tập</h3>
              <p>Mời học viên qua liên kết 1 lần bảo mật. Theo dõi chính xác số buổi đã tập và còn lại (VD: 8/12 buổi), minh bạch cả hai bên.</p>
              <div className="bento-chip">Không lo nhầm lẫn số buổi</div>
            </article>

            {/* Feature 2 */}
            <article className="bento-card">
              <div className="bento-icon-box">
                <CalendarDays size={22} />
              </div>
              <h3>Lịch tuần &amp; Hẹn buổi thông minh</h3>
              <p>Lưới lịch tuần trực quan dạng Google Calendar. Xếp lịch nhanh chỉ với 1 cú nhấp chuột; đặt lịch không tự trừ buổi PT khi chưa hoàn thành.</p>
              <div className="bento-chip">Đồng bộ lịch 2 chiều</div>
            </article>

            {/* Feature 3 */}
            <article className="bento-card">
              <div className="bento-icon-box">
                <TrendingUp size={22} />
              </div>
              <h3>Đối chiếu chỉ số InBody</h3>
              <p>PT đối chiếu và xác nhận trực tiếp 5 chỉ số nền (cân nặng, cơ, mỡ) từ ảnh phiếu đo trước khi đưa vào biểu đồ tiến trình chính thức.</p>
              <div className="bento-chip">Dữ liệu có nguồn kiểm chứng</div>
            </article>

            {/* Feature 4 */}
            <article className="bento-card">
              <div className="bento-icon-box">
                <CheckCircle2 size={22} />
              </div>
              <h3>Check-in bữa ăn &amp; Cảnh báo</h3>
              <p>Học viên tải ảnh bữa ăn trong 30 giây. Hệ thống tự động cảnh báo khi học viên vắng mặt quá 3 ngày để PT kịp thời can thiệp, động viên.</p>
              <div className="bento-chip">Giữ nhịp tập đều đặn</div>
            </article>

            {/* Feature 5 */}
            <article className="bento-card is-wide">
              <div className="bento-icon-box">
                <MessageSquareText size={22} />
              </div>
              <div className="bento-wide-content">
                <div>
                  <h3>Trao đổi 1-1 &amp; Sổ tay ghi chú riêng tư</h3>
                  <p>Kênh trò chuyện tập trung cho từng cặp PT - học viên. Tách riêng ghi chú chiến thuật nội bộ của PT và lời dặn chia sẻ công khai.</p>
                </div>
                <div className="bento-subchips">
                  <span><Lock size={14} /> Ghi chú nội bộ chỉ PT xem</span>
                  <span><Clock size={14} /> Trao đổi tức thì không trôi tin</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* 3-Step Journey */}
        <IntakeJourney />

        {/* Interactive Workspace Preview */}
        <section className="profile-section compact-profile wrap" id="ho-so" aria-labelledby="profile-heading">
          <div className="section-heading">
            <div>
              <span className="landing-kicker">Trải nghiệm thực tế</span>
              <h2 id="profile-heading">Một người. Đủ ngữ cảnh.</h2>
              <p className="profile-subtitle">Chọn góc nhìn để xem cách PT và học viên cùng đồng hành trên FitSync.</p>
            </div>
            <div className="role-control" role="group" aria-label="Chọn góc nhìn">
              <button data-role="pt" aria-pressed={role === "pt"} onClick={() => setRole("pt")}>
                Huấn luyện viên (PT)
              </button>
              <button data-role="trainee" aria-pressed={role === "trainee"} onClick={() => setRole("trainee")}>
                Học viên
              </button>
            </div>
          </div>

          <div className={role === "pt" ? "profile-surface" : "profile-surface learner-surface"} data-ui>
            <aside className="profile-rail" hidden={role !== "pt"}>
              <span className="rail-title">Danh sách học viên</span>
              <span className="rail-person selected">
                <span className="avatar">KL</span>
                <span>Khánh Linh<small>Hôm nay · 16:00</small></span>
              </span>
              <span className="rail-person">
                <span className="avatar">MK</span>
                <span>Minh Khoa<small>Buổi PT · 09:00</small></span>
              </span>
              <span className="rail-person">
                <span className="avatar">HN</span>
                <span>Hoàng Nam<small>Tư vấn · 17:30</small></span>
              </span>
            </aside>

            <article className="dossier">
              <header className="person-heading">
                <div className="person-name">
                  <span className="large-avatar">KL</span>
                  <div>
                    <p data-role-label>{role === "pt" ? "Không gian PT" : "Không gian học viên"}</p>
                    <h3>Khánh Linh</h3>
                    <span>Giảm mỡ · Giữ nhịp tập đều</span>
                  </div>
                </div>
              </header>

              <div className="profile-body">
                <div className="history">
                  <section className="history-entry current">
                    <div className="entry-mark"><span className="linked-dot" aria-hidden="true"></span></div>
                    <div className="entry-content">
                      <p className="entry-date">Buổi hẹn tiếp theo · Hôm nay</p>
                      <div className="session-row">
                        <span><strong>16:00</strong><small>60 phút</small></span>
                        <span><strong>Buổi tập cùng PT Anh Nam</strong><small>Đã xác nhận</small></span>
                      </div>
                    </div>
                  </section>

                  <section className="history-entry">
                    <div className="entry-mark"><span className="history-dot" aria-hidden="true"></span></div>
                    <div className="entry-content">
                      <div className="entry-date"><span>Lần đo gần nhất</span><span className="verified">PT đã xác nhận</span></div>
                      <dl className="measurement-row">
                        <div><dt>Cân nặng</dt><dd>70,4 <span>kg</span></dd></div>
                        <div><dt>Cơ xương</dt><dd>30,2 <span>kg</span></dd></div>
                        <div><dt>Tỷ lệ mỡ</dt><dd>29,0 <span>%</span></dd></div>
                      </dl>
                      <div className="progress-plot">
                        <div className="plot-heading"><h4>Biểu đồ cân nặng</h4><span>Tháng này · kg</span></div>
                        <WeightPlot />
                      </div>
                    </div>
                  </section>
                </div>

                <aside className="context">
                  <section className="context-note" data-pt-only hidden={role !== "pt"}>
                    <div className="note-caption">
                      <Lock size={14} />
                      <span>Nội bộ PT</span>
                    </div>
                    <h4>Lưu ý buổi tập</h4>
                    <p>Học viên mới khỏi đau lưng dưới, ưu tiên bài tập bổ trợ core nhẹ nhàng.</p>
                  </section>

                  <section className="context-note shared" data-trainee-only hidden={role !== "trainee"}>
                    <div className="note-caption"><span>Dặn dò từ PT Nam</span></div>
                    <h4>Mục tiêu tuần này</h4>
                    <p>Nhớ bổ sung đủ nước và check-in bữa trưa trước 13h nhé!</p>
                  </section>

                  <section className="package">
                    <div><p>Gói tập PT</p><strong>8 <span>/ 12 buổi</span></strong></div>
                    <div className="session-ticks" role="img" aria-label="4 buổi đã dùng, 8 buổi còn lại">
                      <i className="used"></i><i className="used"></i><i className="used"></i><i className="used"></i>
                      <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                    </div>
                    <p>Hạn membership: 31/12/2026</p>
                  </section>

                  <div className="conversation">
                    <span className="tiny-avatar">AN</span>
                    <p>“Chiều nay gặp lúc 16:00 nhé Linh.”</p>
                  </div>
                </aside>
              </div>
            </article>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection />

        {/* FAQ Section */}
        <section className="landing-readiness compact-faq wrap" id="faq" aria-labelledby="readiness-heading">
          <div className="readiness-layout">
            <div>
              <span className="landing-kicker">Hỏi &amp; Đáp</span>
              <h2 id="readiness-heading">Giải đáp thắc mắc thường gặp.</h2>
              <p className="faq-subhead">Những thông tin cần thiết nhất trước khi bạn bắt đầu tạo workspace.</p>
            </div>
            <div className="faq-accordion">
              <details open>
                <summary>FitSync hỗ trợ gì cho công việc của PT?</summary>
                <p>FitSync gom toàn bộ công việc huấn luyện vào một nơi: Quản lý học viên, theo dõi số buổi, xếp lịch tập tuần không trừ buổi ảo, đối chiếu InBody và theo dõi ảnh bữa ăn hàng ngày.</p>
              </details>
              <details>
                <summary>Học viên của tôi có cần trả phí để sử dụng không?</summary>
                <p>Không. Học viên luôn được sử dụng miễn phí 100% qua liên kết mời trực tiếp từ PT. Học viên có thể dùng trên điện thoại hoặc máy tính mà không cần cài đặt phức tạp.</p>
              </details>
              <details>
                <summary>Quy trình xác thực chỉ số InBody hoạt động ra sao?</summary>
                <p>Để đảm bảo số liệu chính xác, chỉ số luôn được PT đối chiếu với phiếu đo gốc trước khi xác nhận. Học viên chỉ nhìn thấy biểu đồ tiến trình khi số đo đã được PT duyệt.</p>
              </details>
              <details>
                <summary>Gói Free và Pro khác nhau thế nào?</summary>
                <p>Gói Free miễn phí trọn đời cho tối đa 3 học viên đang hoạt động với đầy đủ mọi tính năng. Khi bạn kèm từ 4 học viên trở lên, chỉ 199.000đ/tháng để mở khóa không giới hạn số lượng học viên.</p>
              </details>
            </div>
          </div>
        </section>

        {/* Closing Banner */}
        <section className="closing compact-closing wrap">
          <div className="closing-banner">
            <div>
              <h2>Sẵn sàng chuyên nghiệp hóa quy trình huấn luyện?</h2>
              <p>Khởi tạo workspace PT miễn phí chỉ trong 30 giây.</p>
            </div>
            <div className="closing-actions">
              <Link className="button sun" href="/register" prefetch={true}>
                Đăng ký ngay <ArrowRight size={16} />
              </Link>
              <Link className="hero-sample" href="/login" prefetch={true}>
                Đăng nhập
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Compact Footer */}
      <footer className="wrap compact-footer">
        <Link className="brand" href="/" prefetch={true}>fitsync</Link>
        <p>© 2026 FitSync · Nền tảng đồng hành Huấn luyện viên &amp; Học viên.</p>
        <div className="footer-links">
          <Link href="/privacy" prefetch={true}>Quyền riêng tư</Link>
          <Link href="/terms" prefetch={true}>Điều khoản</Link>
        </div>
      </footer>

      <p className="sr-only" id="page-status" role="status">
        {role === "pt" ? "Góc nhìn PT." : "Góc nhìn học viên."}
      </p>
    </div>
  );
}
