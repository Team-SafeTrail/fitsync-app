import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Brand from "@/components/brand/Brand";

export default function AuthShell({eyebrow,title,description,children}:{eyebrow:string;title:string;description:string;children:React.ReactNode}) {
  return <main id="main-content" className="auth-page">
    <section className="auth-story" aria-label="Không gian đồng hành FitSync">
      <Image src="/images/coaching-afternoon.webp" alt="Minh họa AI: PT và học viên trò chuyện trong phòng gym" fill sizes="(max-width: 980px) 1px, 1800px" className="auth-scene" />
      <div className="auth-story-shade" />
      <Link href="/" className="auth-brand" aria-label="FitSync, về trang chủ"><Brand /></Link>
      <div className="auth-story-copy"><h2>Cùng tập.<br />Cùng tiến xa.</h2><p>Một nơi để PT hiểu học viên hơn. Bắt đầu từ hồ sơ, mục tiêu và những lần đồng hành.</p></div>
      <p className="auth-image-credit">Minh họa AI · Nhân vật giả định</p>
    </section>
    <section className="auth-panel"><div className="auth-panel-inner">
      <Link href="/" className="auth-back"><ArrowLeft size={16} />Trang giới thiệu</Link>
      <Link href="/" className="auth-mobile-brand" aria-label="FitSync, trang chủ"><Brand /></Link>
      <header className="auth-heading"><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></header>
      {children}
      <p className="auth-privacy"><ShieldCheck size={17} />Dữ liệu chỉ hiển thị theo vai trò và hồ sơ được liên kết.</p>
      <div className="auth-legal"><Link href="/privacy">Quyền riêng tư</Link><Link href="/terms">Điều khoản</Link></div>
    </div></section>
  </main>;
}
