import Link from "next/link";
import { ArrowRight, AtSign, UserRound } from "lucide-react";
import PasswordInput from "./PasswordInput";

export default function AuthForm({ mode, action, error, message, next }: {
  mode: "login" | "register";
  action: (formData: FormData) => Promise<void>;
  error?: string;
  message?: string;
  next?: string;
}) {
  const registering = mode === "register";
  return (
    <>
      {error && <p role="alert" className="auth-alert is-error">{error}</p>}
      {message && <p role="status" className="auth-alert is-success">{message}</p>}
      <form action={action} className="auth-form">
        {next && <input type="hidden" name="next" value={next} />}
        {registering && (
          <label>
            <span>Tên hiển thị</span>
            <div className="auth-input has-icon">
              <UserRound size={18} className="auth-input-icon" aria-hidden="true" />
              <input name="displayName" autoComplete="name" minLength={2} maxLength={100} placeholder="Nguyễn Hoàng Nam" required />
            </div>
          </label>
        )}
        <label>
          <span>Email</span>
          <div className="auth-input has-icon">
            <AtSign size={18} className="auth-input-icon" aria-hidden="true" />
            <input name="email" type="email" autoComplete="email" placeholder="coach@fitsync.vn" required />
          </div>
        </label>
        <PasswordInput
          label="Mật khẩu"
          name="password"
          autoComplete={registering ? "new-password" : "current-password"}
          minLength={8}
          placeholder="Ít nhất 8 ký tự"
          required
        />
        {!registering && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-10px" }}>
            <Link href="/forgot-password" style={{ fontSize: "13px", color: "var(--coaching-primary-accent, #226C5D)" }}>
              Quên mật khẩu?
            </Link>
          </div>
        )}
        {registering && <label><span>Bạn biết FitSync qua đâu? (tùy chọn)</span><select name="acquisitionChannel" defaultValue="unknown"><option value="unknown">Chưa chia sẻ</option><option value="facebook">Facebook</option><option value="tiktok">TikTok</option><option value="zalo">Zalo</option><option value="referral">Người quen giới thiệu</option><option value="direct">Truy cập trực tiếp</option></select></label>}
        <button className="auth-submit">{registering ? "Tạo tài khoản" : "Đăng nhập"}<ArrowRight size={17} /></button>
      </form>
      <div className="auth-switch"><span>{registering ? "Đã có workspace?" : "Lần đầu dùng FitSync?"}</span><Link href={registering ? "/login" : "/register"}>{registering ? "Đăng nhập" : "Tạo tài khoản "} <ArrowRight size={14} /></Link></div>
    </>
  );
}
