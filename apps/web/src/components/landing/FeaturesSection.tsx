import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  MessageCircle,
  CalendarDays,
  ArrowRight,
  Flame,
  Utensils,
  Dumbbell,
  Activity,
  Users,
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="product" className="fs-section fs-features fs-container">
      <div className="fs-section-heading">
        <p className="fs-eyebrow">MỘT NHỊP CHUNG CHO COACH VÀ HỌC VIÊN</p>
        <h2>
          Phần mềm lo sắp xếp.
          <br />
          <span>Bạn lo đồng hành.</span>
        </h2>
        <p>
          Mọi điểm chạm trong hành trình huấn luyện, được kết nối trong một
          không gian rõ ràng.
        </p>
      </div>
      <div className="fs-feature-grid">
        <article className="fs-feature-coach">
          <div className="fs-feature-copy">
            <span className="fs-feature-icon">
              <Users size={22} />
            </span>
            <h3>
              Không bỏ lỡ
              <br />
              người cần bạn.
            </h3>
            <p>
              Nhìn thấy học viên chưa check-in và số buổi còn lại. Biết nên bắt
              đầu cuộc trò chuyện với ai.
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
              <span className="fs-attention-label">Cần hỏi thăm</span>
            </div>
            <div className="fs-followup-metrics">
              <span>
                <CalendarDays size={16} />
                <strong>8 buổi</strong> còn lại
              </span>
              <span>
                <Activity size={16} />
                <strong>3 ngày</strong> chưa check-in
              </span>
            </div>
            <div className="fs-message-example">
              <MessageCircle size={17} />
              <p>
                “Linh ơi, tuần này tập luyện thế nào? Mình cùng điều chỉnh lịch
                nếu cần nhé.”
              </p>
            </div>
            <span className="fs-message-caption">
              Một gợi ý trò chuyện, không phải tin nhắn tự động.
            </span>
          </div>
        </article>
        <article className="fs-feature-client">
          <div className="fs-feature-copy">
            <span className="fs-feature-icon">
              <Flame size={22} />
            </span>
            <h3>
              Thói quen nhỏ.
              <br />
              Hành trình dài.
            </h3>
            <p>
              Mục tiêu, bữa ăn và buổi tập trong một góc nhìn dành riêng cho học
              viên.
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
              <span className="fs-phone-greeting">MỖI NGÀY MỘT CHÚT</span>
              <h4>Hôm nay của Linh</h4>
              <div className="fs-phone-ring">
                <div>
                  <Flame size={18} />
                  <strong>1.240</strong>
                  <span>/ 1.650 kcal mẫu</span>
                </div>
              </div>
              <div className="fs-phone-meal">
                <span>
                  <Utensils size={16} />
                </span>
                <div>
                  <strong>Bữa trưa</strong>
                  <small>Đã ghi nhận</small>
                </div>
                <Check size={15} />
              </div>
              <div className="fs-phone-meal">
                <span>
                  <Dumbbell size={16} />
                </span>
                <div>
                  <strong>Buổi tập tiếp theo</strong>
                  <small>Thứ 3 · 17:30</small>
                </div>
                <ArrowRight size={15} />
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
          <a href="#demo" className="fs-text-link">
            Tìm lại nhịp huấn luyện của bạn <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
