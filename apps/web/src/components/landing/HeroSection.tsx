import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
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
          Bớt việc quản lý. <span>Thêm giờ huấn luyện.</span>
        </h1>
        <p className="fs-hero-description">
          Tạo hồ sơ, mời học viên và xác nhận InBody trong một workspace rõ
          ràng cho cả hai.
        </p>
        <div className="fs-actions">
          <Link className="fs-button" href="/register">
            Tạo workspace PT <ArrowRight size={18} />
          </Link>
          <Link className="fs-text-link" href="/app/dashboard">
            Xem bản mẫu <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
      <div className="fs-hero-product">
        <ProductPreview />
      </div>
    </section>
  );
}
