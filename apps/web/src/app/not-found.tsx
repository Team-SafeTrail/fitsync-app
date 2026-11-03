import Link from "next/link";
import { BrandMark } from "@/components/brand/Brand";
import { ArrowLeft } from "lucide-react";
import "./landing.css";

export default function NotFound() {
  return (
    <main id="main-content" className="fs-landing fs-not-found">
      <BrandMark width={54} height={44} />
      <p className="fs-eyebrow">Không tìm thấy trang</p>
      <h1>Đường dẫn này chưa có trong hành trình.</h1>
      <p>Trở về FitSync để tiếp tục khám phá bản mẫu huấn luyện.</p>
      <Link href="/" className="btn-primary">
        <ArrowLeft size={17} aria-hidden="true" /> Trở về trang chủ
      </Link>
    </main>
  );
}
