import { ArrowRight, BadgeCheck, Send, ShieldCheck, UserPlus } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Tạo hồ sơ học viên",
    description:
      "PT thêm mục tiêu, số điện thoại tùy chọn và gói buổi tập vào roster riêng.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Mời bằng liên kết an toàn",
    description:
      "Học viên dùng liên kết có hạn, một lần duy nhất để tạo tài khoản và kết nối với PT.",
    icon: Send,
  },
  {
    number: "03",
    title: "Xác nhận chỉ số InBody",
    description:
      "PT nhập 5 chỉ số, sửa dữ liệu chưa hợp lý và xác nhận trước khi học viên được xem.",
    icon: BadgeCheck,
  },
];

export default function VerifiedWorkflowSection() {
  return (
    <section
      id="workflow"
      className="fs-section fs-workflow fs-container"
      aria-labelledby="workflow-title"
    >
      <div className="fs-workflow-heading">
        <p>LUỒNG ĐÃ ĐƯỢC KIỂM THỬ</p>
        <h2 id="workflow-title">
          Từ một lời mời.
          <br />
          <span>Đến cùng một bản ghi.</span>
        </h2>
        <div className="fs-workflow-proof">
          <ShieldCheck size={19} aria-hidden="true" />
          <span>
            Dữ liệu mẫu. Quyền truy cập PT và học viên được kiểm tra tách biệt.
          </span>
        </div>
      </div>
      <div className="fs-workflow-steps">
        {steps.map(({ number, title, description, icon: Icon }, index) => (
          <article key={number}>
            <div className="fs-workflow-step-top">
              <span>{number}</span>
              <Icon size={22} aria-hidden="true" />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            {index < steps.length - 1 && (
              <ArrowRight className="fs-workflow-arrow" size={18} aria-hidden="true" />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
