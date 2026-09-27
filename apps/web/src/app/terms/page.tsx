import type { Metadata } from "next";
import LegalPage from "@/components/landing/LegalPage";
import "../landing.css";

export const metadata: Metadata = {
  title: "Điều khoản bản mẫu | FitSync",
  description: "Giới hạn sử dụng bản mẫu FitSync.",
};

const sections = [
  {
    title: "Mục đích",
    paragraphs: [
      "FitSync hiện là bản mẫu dùng để nghiên cứu, trình diễn và thử nghiệm trải nghiệm người dùng. Các màn hình và dữ liệu không đại diện cho một dịch vụ đang vận hành.",
    ],
  },
  {
    title: "Không phải tư vấn sức khỏe",
    paragraphs: [
      "Chỉ số, mục tiêu năng lượng và macro trong bản mẫu là dữ liệu minh họa. Không dùng các kết quả này để chẩn đoán, điều trị hoặc thay thế đánh giá của chuyên gia đủ điều kiện.",
    ],
  },
  {
    title: "Tính năng và giá dự kiến",
    paragraphs: [
      "Tính năng, giới hạn và mức giá hiển thị là định hướng đang được kiểm chứng. Chúng có thể thay đổi trước khi FitSync ra mắt và không cấu thành lời chào bán.",
    ],
  },
  {
    title: "Sử dụng có trách nhiệm",
    paragraphs: [
      "Không tải lên hoặc nhập dữ liệu sức khỏe, thông tin nhận dạng hay nội dung bí mật của người thật vào bản mẫu. Không dựa vào trạng thái mô phỏng để đưa ra quyết định có ảnh hưởng đến học viên.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Điều khoản bản mẫu"
      updated="27/09/2026"
      summary="Các điều khoản này giúp người xem hiểu rõ bản mẫu làm được gì và chưa làm được gì. Điều khoản dịch vụ đầy đủ sẽ cần được soạn và rà soát trước khi ra mắt thương mại."
      sections={sections}
    />
  );
}
