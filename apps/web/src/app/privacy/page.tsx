import type { Metadata } from "next";
import LegalPage from "@/components/landing/LegalPage";
import "../landing.css";

export const metadata: Metadata = {
  title: "Quyền riêng tư bản mẫu | FitSync",
  description: "Thông tin về dữ liệu trong bản mẫu FitSync.",
};

const sections = [
  {
    title: "Dữ liệu trên trang mẫu",
    paragraphs: [
      "Trang landing, dashboard coach và không gian học viên hiện dùng dữ liệu minh họa được đóng gói cùng ứng dụng. Không nhập dữ liệu sức khỏe thật vào bản mẫu.",
      "Demo đọc phiếu không tải ảnh lên máy chủ và không chạy dịch vụ OCR trực tiếp. Các thay đổi trong giao diện có thể mất khi bạn tải lại trang.",
    ],
  },
  {
    title: "Khảo sát nghiên cứu",
    paragraphs: [
      "Trang landing chỉ công bố số đếm tổng hợp từ 104 phiếu khảo sát EXE101. Email, số điện thoại, họ tên và câu trả lời cá nhân không được hiển thị.",
      "Biểu mẫu khảo sát không có trường đồng ý công khai danh tính. Vì vậy FitSync không dùng tên, ảnh hoặc trích dẫn cá nhân làm chứng thực trên website.",
    ],
  },
  {
    title: "Thanh toán và tài khoản",
    paragraphs: [
      "Bản mẫu chưa tạo tài khoản, chưa nhận thanh toán và chưa tự động gia hạn. Website không yêu cầu thông tin thẻ để khám phá các màn hình mẫu.",
    ],
  },
  {
    title: "Khi sản phẩm chuyển sang thử nghiệm thật",
    paragraphs: [
      "Chính sách này phải được cập nhật trước khi FitSync thu thập thông tin liên hệ, dữ liệu sức khỏe, tệp tải lên hoặc dữ liệu phân tích nhận diện người dùng.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Quyền riêng tư"
      updated="27/09/2026"
      summary="Bản này mô tả đúng phạm vi của website nguyên mẫu hiện tại. Đây chưa phải chính sách cho một dịch vụ FitSync thương mại hoặc hệ thống xử lý dữ liệu sức khỏe thật."
      sections={sections}
    />
  );
}
