import { ArrowDownRight, MessagesSquare, UsersRound } from "lucide-react";

const findings = [
  {
    value: "84 / 104",
    label: "dành hơn 3 giờ mỗi tuần cho việc hành chính",
    detail: "80,8% số phiếu trả lời",
    icon: ArrowDownRight,
  },
  {
    value: "73 / 104",
    label: "đang theo dõi ít nhất 5 học viên",
    detail: "70,2% số phiếu trả lời",
    icon: UsersRound,
  },
  {
    value: "101 / 104",
    label: "dùng Zalo hoặc Messenger trong bộ công cụ hiện tại",
    detail: "97,1% số phiếu trả lời",
    icon: MessagesSquare,
  },
];

export default function SurveyEvidence() {
  return (
    <section
      className="fs-research fs-container"
      aria-labelledby="research-title"
    >
      <div className="fs-research-intro">
        <p className="fs-eyebrow">TÍN HIỆU TỪ NGƯỜI TRONG NGHỀ</p>
        <h2 id="research-title">
          Vấn đề không nằm
          <br />
          <span>trên một màn hình.</span>
        </h2>
        <p>
          Nó nằm giữa tin nhắn, bảng tính và những việc phải nhớ. Đây là ảnh
          chụp nhanh từ khảo sát FitSync, không phải số liệu khách hàng hay bằng
          chứng hiệu quả của sản phẩm.
        </p>
      </div>
      <div className="fs-research-findings">
        {findings.map(({ value, label, detail, icon: Icon }) => (
          <article key={label}>
            <Icon size={20} aria-hidden="true" />
            <strong>{value}</strong>
            <p>{label}</p>
            <small>{detail}</small>
          </article>
        ))}
      </div>
      <div className="fs-research-method">
        <strong>Về mẫu khảo sát</strong>
        <p>
          104 phiếu gửi trong nghiên cứu EXE101; 93 người tự nhận là PT, coach,
          chủ hoặc quản lý gym. Các câu trả lời mở có nhiều nội dung lặp lại và
          biểu mẫu không hỏi quyền công khai danh tính, nên FitSync chỉ sử dụng
          số đếm tổng hợp và không trích dẫn cá nhân.
        </p>
      </div>
    </section>
  );
}
