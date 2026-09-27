import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Compass } from "lucide-react";

const launchFeatures = [
  "Tối đa 3 học viên trong giả thuyết Free",
  "OCR chỉ sau khi có benchmark và bước duyệt",
  "Check-in và cảnh báo đã được kiểm chứng cục bộ",
  "Không gian riêng cho PT và học viên",
];

export default function PricingSection() {
  return (
    <section id="pricing" className="fs-section fs-offer fs-container">
      <div className="fs-offer-heading">
        <p className="fs-eyebrow">TRẠNG THÁI SẢN PHẨM</p>
        <h2>
          Bắt đầu với điều đã chạy.
          <br />
          <span>Kiểm chứng phần còn lại.</span>
        </h2>
        <p>
          Luồng workspace M2 + M3 đã hoạt động. Gói thương mại, thanh toán và trial
          vẫn chưa được phát hành.
        </p>
      </div>
      <div className="fs-offer-now">
        <span className="fs-offer-label">LUỒNG THẬT TRONG SẢN PHẨM</span>
        <div className="fs-offer-title">
          <Compass size={25} aria-hidden="true" />
          <div>
            <h3>Workspace PT</h3>
            <p>Tạo tài khoản PT. Không có bước thanh toán.</p>
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
        <span className="fs-offer-label">ĐỊNH HƯỚNG KHI RA MẮT</span>
        <div>
          <span className="fs-offer-price">199.000 ₫</span>
          <small>mức giá Pro đang được kiểm chứng</small>
        </div>
        <p className="fs-offer-free">
          Định hướng Freemium: tối đa 3 học viên và 3 lượt quét thử. Đây chưa
          phải gói được phát hành.
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
