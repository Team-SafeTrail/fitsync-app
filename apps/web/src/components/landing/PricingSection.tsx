import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Compass } from "lucide-react";

const launchFeatures = [
  "Đọc phiếu và kiểm tra chỉ số",
  "Theo dõi check-in và gói tập",
  "Không gian riêng cho học viên",
  "Tổng quan tiến trình theo thời gian",
];

export default function PricingSection() {
  return (
    <section id="pricing" className="fs-section fs-offer fs-container">
      <div className="fs-offer-heading">
        <p className="fs-eyebrow">TRẠNG THÁI SẢN PHẨM</p>
        <h2>
          Khám phá trước.
          <br />
          <span>Quyết định sau.</span>
        </h2>
        <p>
          FitSync đang ở giai đoạn bản mẫu. Hiện chưa mở đăng ký, thanh toán hay
          tự động gia hạn.
        </p>
      </div>
      <div className="fs-offer-now">
        <span className="fs-offer-label">CÓ THỂ DÙNG HÔM NAY</span>
        <div className="fs-offer-title">
          <Compass size={25} aria-hidden="true" />
          <div>
            <h3>Bản mẫu tương tác</h3>
            <p>Không cần tài khoản hoặc thông tin thẻ.</p>
          </div>
        </div>
        <ul>
          <li>
            <Check size={16} aria-hidden="true" /> Dashboard coach mẫu
          </li>
          <li>
            <Check size={16} aria-hidden="true" /> Không gian học viên mẫu
          </li>
          <li>
            <Check size={16} aria-hidden="true" /> Demo đọc phiếu mô phỏng
          </li>
        </ul>
        <Link href="/app/dashboard" className="fs-button">
          Khám phá bản mẫu <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="fs-offer-later">
        <span className="fs-offer-label">ĐỊNH HƯỚNG KHI RA MẮT</span>
        <div>
          <span className="fs-offer-price">199.000 ₫</span>
          <small>mức giá Pro đang được kiểm chứng</small>
        </div>
        <p className="fs-offer-free">
          Định hướng Freemium: tối đa 3 học viên và 3 lượt quét thử. Chưa được
          kích hoạt trong bản mẫu.
        </p>
        <ul>
          {launchFeatures.map((feature) => (
            <li key={feature}>
              <Check size={15} aria-hidden="true" /> {feature}
            </li>
          ))}
        </ul>
        <a href="#faq" className="fs-text-link">
          Đọc về giới hạn bản mẫu <ArrowRight size={16} />
        </a>
        <p className="fs-offer-disclaimer">
          Đây là định hướng, không phải lời chào bán. Tính năng và mức giá có
          thể thay đổi sau thử nghiệm với người dùng.
        </p>
      </div>
    </section>
  );
}
