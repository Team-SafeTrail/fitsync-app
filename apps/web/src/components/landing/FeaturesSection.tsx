import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  Droplets,
  Scale,
  Send,
  ShieldCheck,
  Activity,
  Users,
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="product" className="fs-section fs-features fs-container">
      <div className="fs-section-heading">
        <p className="fs-eyebrow">MỘT BẢN GHI, HAI GÓC NHÌN</p>
        <h2>
          PT xác nhận một lần.
          <br />
          <span>Học viên xem đúng dữ liệu.</span>
        </h2>
        <p>
          FitSync nối roster của PT với một trải nghiệm học viên tập trung,
          nhưng giữ quyền truy cập tách biệt.
        </p>
      </div>
      <div className="fs-feature-grid">
        <article className="fs-feature-coach">
          <div className="fs-feature-copy">
            <span className="fs-feature-icon">
              <Users size={22} />
            </span>
            <h3>
              Roster nói rõ
              <br />
              trạng thái tiếp theo.
            </h3>
            <p>
              Biết ai đang chờ lời mời, ai đã kết nối và ai đã có bản ghi
              InBody được xác nhận.
            </p>
            <Link href="/app/dashboard" className="fs-text-link">
              Xem bản mẫu PT <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="fs-followup-card">
            <div className="fs-followup-title">
              <span className="fs-person-avatar fs-person-0">KL</span>
              <div>
                <strong>Khánh Linh</strong>
                <span>Dữ liệu minh họa</span>
              </div>
              <span className="fs-attention-label">Đã xác minh</span>
            </div>
            <div className="fs-followup-metrics">
              <span>
                <Send size={16} />
                <strong>Đã kết nối</strong> tài khoản
              </span>
              <span>
                <BadgeCheck size={16} />
                <strong>1 bản ghi</strong> đã xác nhận
              </span>
            </div>
            <div className="fs-message-example">
              <Scale size={17} />
              <p>
                59,8 kg cân nặng · 22,1 kg cơ xương · 28,4% mỡ cơ thể
              </p>
            </div>
            <span className="fs-message-caption">
              PT xác nhận dữ liệu ngày 27/09/2026.
            </span>
          </div>
        </article>
        <article className="fs-feature-client">
          <div className="fs-feature-copy">
            <span className="fs-feature-icon">
              <ShieldCheck size={22} />
            </span>
            <h3>
              Bản ghi của bạn.
              <br />
              Chỉ mình bạn thấy.
            </h3>
            <p>
              Học viên xem chỉ số đã xác minh và mục tiêu dinh dưỡng đang ở
              trạng thái bản nháp coaching.
            </p>
            <Link href="/app/trainee" className="fs-text-link">
              Xem bản mẫu học viên <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="fs-phone">
            <div className="fs-phone-top">
              <span>9:41</span>
              <span className="fs-phone-island" />
              <Activity size={14} />
            </div>
            <div className="fs-phone-body">
              <span className="fs-phone-greeting">INBODY ĐÃ XÁC MINH</span>
              <h4>Chỉ số của Linh</h4>
              <div className="fs-phone-ring">
                <div>
                  <Scale size={18} />
                  <strong>59,8</strong>
                  <span>kg cân nặng</span>
                </div>
              </div>
              <div className="fs-phone-meal">
                <span>
                  <Activity size={16} />
                </span>
                <div>
                  <strong>22,1 kg cơ xương</strong>
                  <small>28,4% mỡ cơ thể</small>
                </div>
                <Check size={15} />
              </div>
              <div className="fs-phone-meal">
                <span>
                  <Droplets size={16} />
                </span>
                <div>
                  <strong>31,7 L nước cơ thể</strong>
                  <small>Xác nhận 27/09/2026</small>
                </div>
                <BadgeCheck size={15} />
              </div>
            </div>
          </div>
        </article>
      </div>
      <div className="fs-editorial">
        <figure>
          <Image
            src="/images/coaching-editorial.webp"
            alt="Minh họa một huấn luyện viên và học viên cùng xem máy tính bảng trong phòng tập"
            width={1536}
            height={1024}
            sizes="(max-width: 760px) 100vw, 55vw"
          />
          <figcaption>Hình ảnh minh họa bằng AI.</figcaption>
        </figure>
        <div className="fs-editorial-copy">
          <span className="fs-editorial-kicker">
            CÔNG NGHỆ Ở PHÍA SAU. CON NGƯỜI Ở TRUNG TÂM.
          </span>
          <h2>
            Thời gian của bạn
            <br />
            nên ở <span>đây.</span>
          </h2>
          <p>
            Không phải giữa những bảng tính và tin nhắn trôi mất. Mà là bên cạnh
            học viên, ở một lần nâng tạ tốt hơn, một thói quen mới, một bước
            tiến nhỏ.
          </p>
          <a href="#workflow" className="fs-text-link">
            Tìm lại nhịp huấn luyện của bạn <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
