import Link from "next/link";
import { Activity, ArrowLeft, Check, ScanLine, ShieldCheck, Users } from "lucide-react";

export default function AuthShell({ eyebrow, title, description, children }: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" className="auth-page">
      <section className="auth-story" aria-label="Giới thiệu FitSync Workspace">
        <div className="auth-story-top">
          <Link href="/" className="auth-brand" aria-label="FitSync, về trang chủ">
            <Activity size={27} strokeWidth={2.4} />
            <span>fit<strong>sync</strong></span>
          </Link>
          <span className="auth-status"><i /> WORKSPACE SECURE</span>
        </div>
        <div className="auth-story-copy">
          <p>COACH &amp; CLIENT, IN SYNC.</p>
          <h2>Mỗi học viên.<br /><span>Một nhịp rõ ràng.</span></h2>
          <p className="auth-story-description">
            Từ chỉ số InBody đến lần check-in gần nhất. Quản lý công việc trên laptop và tiếp tục ngay trên điện thoại.
          </p>
        </div>
        <div className="auth-product-preview" aria-label="Dữ liệu sản phẩm minh họa">
          <div className="auth-preview-head"><span>TỔNG QUAN HÔM NAY</span><small>Dữ liệu minh họa</small></div>
          <div className="auth-preview-metrics">
            <div><Users size={17} /><strong>14</strong><span>học viên</span></div>
            <div><ScanLine size={17} /><strong>03</strong><span>cần chú ý</span></div>
          </div>
          <div className="auth-preview-row">
            <span className="auth-avatar">KL</span><div><strong>Khánh Linh</strong><small>3 ngày chưa check-in</small></div><span className="auth-warning">Cần hỏi thăm</span>
          </div>
          <div className="auth-preview-row">
            <span className="auth-avatar is-green">MK</span><div><strong>Minh Khoa</strong><small>Đã cập nhật hôm nay</small></div><Check size={16} className="auth-check" />
          </div>
        </div>
        <div className="auth-trust"><ShieldCheck size={16} /> Phiên đăng nhập được xác minh qua Supabase Auth</div>
      </section>
      <section className="auth-panel">
        <div className="auth-panel-inner">
          <Link href="/" className="auth-back"><ArrowLeft size={16} /> Trang giới thiệu</Link>
          <div className="auth-mobile-brand"><Activity size={23} /><span>fitsync</span></div>
          <header className="auth-heading"><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></header>
          {children}
          <p className="auth-privacy">Dữ liệu sức khỏe cần được coach xác nhận trước khi lưu và sử dụng.</p>
        </div>
      </section>
    </main>
  );
}
