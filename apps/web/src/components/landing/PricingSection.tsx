import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Compass } from "lucide-react";

const launchFeatures = [
  "Không giới hạn học viên khi Pro còn hạn",
  "Cùng chức năng coaching như Free",
  "Nhập và xác nhận InBody thủ công",
  "Check-in, ảnh riêng tư và tiến trình",
];

export default function PricingSection() {
  return (
    <section id="pricing" className="fs-section fs-offer fs-container">
      <div className="fs-offer-heading">
        <p className="fs-eyebrow">GÓI FITSYNC</p>
        <h2>
          Bắt đầu với điều đã chạy.
          <br />
          <span>Kiểm chứng phần còn lại.</span>
        </h2>
        <p>
          Bắt đầu với ba học viên trong gói Free. Khi cần quản lý nhiều học viên
          hơn, yêu cầu Pro theo tháng ngay trong workspace.
        </p>
      </div>
      <div className="fs-offer-now">
        <span className="fs-offer-label">FREE</span>
        <div className="fs-offer-title">
          <Compass size={25} aria-hidden="true" />
          <div>
            <h3>Tối đa 3 học viên</h3>
            <p>Gồm hồ sơ đang theo dõi và chờ kết nối; hồ sơ lưu trữ không chiếm chỗ.</p>
          </div>
        </div>
        <ul>
          <li>
            <Check size={16} aria-hidden="true" /> Roster PT có dữ liệu lưu lại
          </li>
          <li>
            <Check size={16} aria-hidden="true" /> Tạo và mời học viên an toàn
          </li>
          <li>
            <Check size={16} aria-hidden="true" /> Xác nhận bản ghi InBody thủ công
          </li>
          <li>
            <Check size={16} aria-hidden="true" /> Check-in, ảnh riêng tư và cảnh báo thủ công
          </li>
        </ul>
        <Link href="/register" className="fs-button">
          Tạo workspace PT <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="fs-offer-later">
        <span className="fs-offer-label">PRO</span>
        <div>
          <span className="fs-offer-price">199.000 ₫</span>
          <small>mỗi PT / một tháng</small>
        </div>
        <p className="fs-offer-free">
          Không giới hạn học viên, cùng chức năng coaching. Hết hạn vẫn giữ
          hồ sơ cũ; tạo thêm hoặc khôi phục hồ sơ theo hạn mức Free.
        </p>
        <ul>
          {launchFeatures.map((feature) => (
            <li key={feature}>
              <Check size={15} aria-hidden="true" /> {feature}
            </li>
          ))}
        </ul>
        <Link href="/workspace/billing" className="fs-text-link">
          Xem gói và yêu cầu Pro <ArrowRight size={16} />
        </Link>
        <p className="fs-offer-disclaimer">
          Chuyển khoản được xác nhận thủ công sau khi đối chiếu chứng từ.
          Chờ thông tin nhận tiền chính thức trong workspace; không tự gia hạn.
        </p>
      </div>
    </section>
  );
}
