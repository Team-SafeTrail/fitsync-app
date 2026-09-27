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
    title: "Luồng M2 đang hoạt động",
    icon: Check,
    items: [
      "PT tạo roster và lời mời một lần có hạn",
      "Nhập tay 5 chỉ số với kiểm tra tính hợp lý",
      "PT xác nhận, học viên xem đúng bản ghi",
      "RLS ngăn truy cập chéo giữa các tài khoản",
    ],
  },
  {
    status: "TIẾP THEO: M3",
    title: "Nhịp đồng hành hằng ngày",
    icon: CircleDashed,
    items: [
      "Check-in hằng ngày và ảnh bữa ăn tùy chọn",
      "Cảnh báo sau 3 ngày không check-in",
      "Tương tác số buổi còn lại",
      "Chuẩn bị tin nhắn follow-up cho PT",
    ],
  },
  {
    status: "SAU M3",
    title: "Chỉ triển khai khi có bằng chứng",
    icon: Clock3,
    items: [
      "OCR InBody sau benchmark và bước PT duyệt",
      "Pilot có analytics, hỗ trợ và xóa dữ liệu",
      "Thanh toán và ứng dụng mobile dùng chung backend",
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
