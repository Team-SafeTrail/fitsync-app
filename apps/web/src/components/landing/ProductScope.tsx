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
    status: "ĐÃ XÁC MINH CỤC BỘ",
    title: "Luồng M2 + M3 đang hoạt động",
    icon: Check,
    items: [
      "PT tạo roster và lời mời một lần có hạn",
      "Xác nhận InBody và theo dõi số buổi còn lại",
      "Check-in hằng ngày với ảnh bữa ăn riêng tư",
      "Cảnh báo và follow-up thủ công, không tự gửi",
    ],
  },
  {
    status: "TIẾP THEO: M4",
    title: "OCR sau bước kiểm chứng",
    icon: CircleDashed,
    items: [
      "Benchmark trên dữ liệu được đồng ý sử dụng",
      "Kiểm tra định dạng và chữ ký tệp phía server",
      "Mọi chỉ số vẫn cần PT duyệt trước khi lưu",
    ],
  },
  {
    status: "SAU M4",
    title: "Chỉ triển khai khi có bằng chứng",
    icon: Clock3,
    items: [
      "Pilot có analytics, hỗ trợ và xóa dữ liệu",
      "Thanh toán và ứng dụng mobile dùng chung backend",
      "Chỉ công bố giá khi luồng thương mại hoạt động",
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
          FitSync chỉ gọi một khả năng là đang hoạt động khi luồng đó đã được
          kiểm thử. Phần còn lại giữ đúng vị trí trong kế hoạch.
        </p>
      </div>
      <div className="fs-scope-grid">
        {stages.map(({ status, title, icon: Icon, items }, index) => (
          <article key={status} className={index === 0 ? "is-core" : ""}>
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
      <div className="fs-scope-foundation" aria-label="Nền tảng kỹ thuật đã xác minh cục bộ">
        <span><ScanLine size={16} /> Coach xác nhận trước khi lưu</span>
        <span><ShieldCheck size={16} /> RLS tách dữ liệu theo vai trò</span>
        <span><Smartphone size={16} /> Web responsive trên desktop và mobile</span>
        <span><Users size={16} /> PT độc lập là người dùng chính</span>
      </div>
    </section>
  );
}
