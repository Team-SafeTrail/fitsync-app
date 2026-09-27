import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ClipboardCheck,
  LineChart,
  MessageCircleHeart,
  ScanLine,
} from "lucide-react";

const moments = [
  {
    week: "Ngày 01",
    title: "Bắt đầu từ chỉ số",
    text: "Coach kiểm tra phiếu mẫu và xác nhận dữ liệu trước khi dùng.",
    icon: ScanLine,
  },
  {
    week: "Tuần 01",
    title: "Đặt một nhịp vừa sức",
    text: "Mục tiêu mẫu được đưa vào góc nhìn hằng ngày của học viên.",
    icon: ClipboardCheck,
  },
  {
    week: "Tuần 02",
    title: "Coach xuất hiện đúng lúc",
    text: "Một check-in bị bỏ lỡ trở thành gợi ý để hỏi thăm, không phải phán xét.",
    icon: MessageCircleHeart,
  },
  {
    week: "Tuần 04",
    title: "Cùng nhìn lại tiến trình",
    text: "Dữ liệu, thói quen và ghi chú được đặt cạnh nhau để chuẩn bị buổi review.",
    icon: LineChart,
  },
];

export default function ProgressJourney() {
  return (
    <section
      className="fs-journey fs-section fs-container"
      aria-labelledby="journey-title"
    >
      <div className="fs-journey-heading">
        <p className="fs-eyebrow">MỘT HÀNH TRÌNH, KHÔNG CHỈ MỘT LẦN QUÉT</p>
        <h2 id="journey-title">
          Tiến bộ được tạo nên
          <br />
          <span>giữa những buổi tập.</span>
        </h2>
        <p>
          Một hành trình minh họa trong 4 tuần cho thấy FitSync kết nối dữ liệu,
          thói quen và sự đồng hành của coach như thế nào.
        </p>
      </div>
      <div className="fs-journey-track">
        {moments.map(({ week, title, text, icon: Icon }, index) => (
          <article key={week}>
            <div className="fs-journey-marker">
              <span>{String(index + 1).padStart(2, "0")}</span>
              {index < moments.length - 1 && <i aria-hidden="true" />}
            </div>
            <div className="fs-journey-card">
              <Icon size={21} aria-hidden="true" />
              <small>{week}</small>
              <h3>{title}</h3>
              <p>{text}</p>
              {index === moments.length - 1 && (
                <span className="fs-journey-ready">
                  <Check size={13} aria-hidden="true" /> Sẵn sàng cho buổi
                  review
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="fs-journey-note">
        <span>Dữ liệu và hành trình đều là minh họa.</span>
        <Link href="/app/trainee" className="fs-text-link">
          Xem góc nhìn học viên <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}
