import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  ScanLine,
  Users,
  Smartphone,
} from "lucide-react";
import ProductPreview from "./ProductPreview";

export default function HeroSection() {
  return (
    <section className="fs-hero fs-container">
      <div className="fs-hero-copy">
        <p className="fs-eyebrow">
          <span className="fs-eyebrow-line" /> DÀNH CHO HUẤN LUYỆN VIÊN VIỆT NAM
        </p>
        <h1>
          Bớt việc quản lý.
          <br />
          <span>
            Thêm giờ
            <br className="fs-desktop-break" /> huấn luyện.
          </span>
        </h1>
        <p className="fs-hero-description">
          Từ phiếu InBody đến từng lần check-in. Một không gian cho PT độc lập
          quản lý hồ sơ, gói tập và tiến trình của học viên mà không phải ghép
          dữ liệu từ nhiều công cụ.
        </p>
        <div className="fs-actions">
          <Link className="fs-button" href="/app/dashboard">
            Khám phá bản mẫu <ArrowUpRight size={18} />
          </Link>
          <Link className="fs-text-link" href="/register">
            Tạo workspace PT <ArrowRight size={17} />
          </Link>
        </div>
      </div>
      <div className="fs-hero-product">
        <ProductPreview />
      </div>
      <div className="fs-hero-bottom">
        <span>ÍT THAO TÁC HƠN. KẾT NỐI TỐT HƠN.</span>
        <div>
          <span>
            <ScanLine size={17} /> Đọc chỉ số
          </span>
          <span>
            <Users size={17} /> Quản lý học viên
          </span>
          <span>
            <Smartphone size={17} /> Đồng hành mỗi ngày
          </span>
        </div>
      </div>
    </section>
  );
}
