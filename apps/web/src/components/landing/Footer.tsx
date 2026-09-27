import Link from "next/link";
import { ArrowUpRight, ArrowRight, Plus, Activity } from "lucide-react";
import { Brand } from "./LandingNav";

const faqs = [
  [
    "FitSync dành cho ai?",
    "FitSync được thiết kế cho huấn luyện viên cá nhân và studio nhỏ tại Việt Nam muốn tập trung hồ sơ, chỉ số và hoạt động của học viên vào cùng một nơi.",
  ],
  [
    "Tôi có thể thử gì trong bản mẫu?",
    "Bạn có thể mở bản mẫu không cần đăng nhập để xem dữ liệu minh họa, hoặc tạo workspace PT để thử luồng thật: mời học viên, xác nhận InBody và lưu dữ liệu qua Supabase.",
  ],
  [
    "Demo có đọc phiếu InBody thật không?",
    "Chưa. Demo dùng ba bộ dữ liệu có sẵn: InBody 270, InBody 370 và Xiaomi Smart Scale 2. Bạn có thể chỉnh cân nặng để xem phép tính thay đổi, nhưng không có ảnh nào được gửi đến dịch vụ OCR. InBody 570 và Eufy Smart Scale P2 nằm trong phạm vi MVP dự kiến.",
  ],
  [
    "FitSync sẽ đọc và theo dõi những chỉ số nào?",
    "Đặc tả MVP tập trung vào 5 chỉ số: cân nặng, khối lượng cơ xương, khối lượng mỡ, tỷ lệ mỡ và tổng lượng nước cơ thể. Coach phải kiểm tra và xác nhận dữ liệu trước khi lưu hoặc dùng để tạo mục tiêu mẫu.",
  ],
  [
    "Học viên có cần cài ứng dụng không?",
    "Không gian học viên mẫu mở trực tiếp trong trình duyệt trên điện thoại hoặc máy tính. Ứng dụng trên App Store, Google Play và khả năng cài đặt PWA chưa được cung cấp trong bản mẫu này.",
  ],
  [
    "Bảng giá đã áp dụng chưa?",
    "Chưa. Tài liệu kinh doanh đề xuất gói miễn phí cho tối đa 3 học viên và gói Pro 199.000 đồng mỗi tháng, nhưng đây vẫn là giả thuyết cần kiểm chứng. Hiện chưa mở thanh toán hay tự động gia hạn.",
  ],
  [
    "Dữ liệu trong bản mẫu được xử lý thế nào?",
    "Demo trên trang này chỉ dùng dữ liệu minh họa trong trình duyệt và không nhận tải lên hồ sơ cá nhân. Các điều chỉnh có thể mất khi tải lại trang. Không dùng bản mẫu để lưu dữ liệu sức khỏe thật.",
  ],
];

export function ClosingSections() {
  return (
    <>
      <section id="faq" className="fs-section fs-container fs-faq">
        <div>
          <p className="fs-eyebrow">TRƯỚC KHI BẠN BẮT ĐẦU</p>
          <h2>
            Một vài điều
            <br />
            <span>bạn muốn biết.</span>
          </h2>
          <p>Rõ ràng từ lần đầu khám phá.</p>
        </div>
        <div className="fs-faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <Plus size={19} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="fs-final-cta fs-container">
        <div className="fs-final-symbol" aria-hidden="true">
          <Activity size={100} strokeWidth={1} />
        </div>
        <p>CHO NHỮNG NGƯỜI GIÚP NGƯỜI KHÁC TIẾN BỘ.</p>
        <h2>
          Coaching là việc của bạn.
          <br />
          <span>Kết nối là việc của FitSync.</span>
        </h2>
        <Link href="/app/dashboard" className="fs-button">
          Khám phá bản mẫu <ArrowUpRight size={18} />
        </Link>
      </section>
    </>
  );
}

export default function Footer() {
  return (
    <footer className="fs-footer fs-container">
      <div className="fs-footer-top">
        <div>
          <Brand />
          <p>
            Ít việc quản lý hơn.
            <br />
            Nhiều thời gian đồng hành hơn.
          </p>
        </div>
        <div>
          <strong>Khám phá</strong>
          <a href="#product">Sản phẩm</a>
          <a href="#demo">Demo tương tác</a>
          <a href="#pricing">Gói dự kiến</a>
        </div>
        <div>
          <strong>Truy cập</strong>
          <Link href="/register">
            Tạo workspace PT <ArrowUpRight size={13} />
          </Link>
          <Link href="/login">
            Đăng nhập workspace <ArrowUpRight size={13} />
          </Link>
          <Link href="/app/dashboard">
            Bản mẫu PT <ArrowUpRight size={13} />
          </Link>
          <Link href="/app/trainee">
            Bản mẫu học viên <ArrowUpRight size={13} />
          </Link>
          <a href="#faq">
            Thông tin & dữ liệu <ArrowRight size={13} />
          </a>
          <Link href="/privacy">Quyền riêng tư</Link>
          <Link href="/terms">Điều khoản bản mẫu</Link>
        </div>
      </div>
      <div className="fs-footer-bottom">
        <span>© 2026 FitSync. Một sản phẩm của SafeTrail.</span>
        <span>Được xây dựng cho nhịp huấn luyện Việt Nam.</span>
      </div>
    </footer>
  );
}
