import Link from "next/link";
import { ArrowLeft, Activity } from "lucide-react";
import "./landing.css";

export default function NotFound() {
  return (
    <main id="main-content" className="fs-landing fs-not-found">
      <Activity size={54} strokeWidth={1.5} aria-hidden="true" />
      <p className="fs-eyebrow">404 · KHÔNG TÌM THẤY TRANG</p>
      <h1>Đường dẫn này chưa có trong hành trình.</h1>
      <p>Trở về FitSync để tiếp tục khám phá bản mẫu huấn luyện.</p>
      <Link href="/" className="fs-button">
        <ArrowLeft size={17} aria-hidden="true" /> Trở về trang chủ
      </Link>
    </main>
  );
}
