import {
  Check,
  CircleDashed,
  Clock3,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";

const stages = [
  {
    status: "CÓ THỂ KHÁM PHÁ",
    title: "Bản mẫu hiện tại",
    icon: Check,
    items: [
      "Dashboard coach với dữ liệu minh họa",
      "Không gian học viên trên trình duyệt",
      "Luồng đọc phiếu và chỉnh số mô phỏng",
    ],
  },
  {
    status: "PHẠM VI MVP",
    title: "Vòng lặp cốt lõi",
    icon: CircleDashed,
    items: [
      "OCR 5 chỉ số với bước coach xác nhận",
      "Cảnh báo sau 3 ngày không check-in",
      "Gói buổi tập, bữa ăn và biểu đồ tiến trình",
      "Phân quyền riêng cho PT và học viên",
    ],
  },
  {
    status: "SAU MVP",
    title: "Hướng phát triển",
    icon: Clock3,
    items: [
      "Bảng xếp hạng ẩn danh theo tính đều đặn",
      "So sánh ảnh tiến trình có kiểm soát riêng tư",
      "Thiết bị đeo, ghi chú giọng nói và marketplace",
    ],
  },
];

export default function ProductScope() {
  return (
    <section className="fs-section fs-scope fs-container" aria-labelledby="scope-title">
      <div className="fs-scope-heading">
        <p className="fs-eyebrow">LỘ TRÌNH SẢN PHẨM RÕ RÀNG</p>
        <h2 id="scope-title">
          Biết điều gì đang có.
          <br />
          <span>Biết điều gì đang được xây.</span>
        </h2>
        <p>
          FitSync bắt đầu với một vòng lặp hẹp: coach đọc và xác nhận dữ liệu,
          học viên check-in, coach can thiệp đúng lúc, cả hai cùng nhìn lại tiến
          trình.
        </p>
      </div>
      <div className="fs-scope-grid">
        {stages.map(({ status, title, icon: Icon, items }, index) => (
          <article key={status} className={index === 1 ? "is-core" : ""}>
            <div className="fs-scope-title">
              <Icon size={21} aria-hidden="true" />
              <span>{status}</span>
            </div>
            <h3>{title}</h3>
            <ul>
              {items.map((item) => (
                <li key={item}>
                  <Check size={14} aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="fs-scope-foundation" aria-label="Nền tảng kỹ thuật dự kiến">
        <span><ScanLine size={16} /> Coach xác nhận trước khi lưu</span>
        <span><ShieldCheck size={16} /> Dữ liệu tách theo vai trò</span>
        <span><Smartphone size={16} /> Web responsive, hướng tới PWA</span>
        <span><Users size={16} /> PT độc lập là người dùng chính</span>
      </div>
    </section>
  );
}
