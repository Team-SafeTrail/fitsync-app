import Link from "next/link";
import { ArrowRight, AtSign, LockKeyhole, UserRound } from "lucide-react";

export default function AuthForm({ mode, action, error, message }: {
  mode: "login" | "register";
  action: (formData: FormData) => Promise<void>;
  error?: string;
  message?: string;
}) {
  const registering = mode === "register";
  return (
    <>
      {error && <p role="alert" className="auth-alert is-error">{error}</p>}
      {message && <p role="status" className="auth-alert is-success">{message}</p>}
      <form action={action} className="auth-form">
        {registering && <label><span>Tên hiển thị</span><div className="auth-input"><UserRound size={17} /><input name="displayName" autoComplete="name" minLength={2} maxLength={100} placeholder="Nguyễn Hoàng Nam" required /></div></label>}
        <label><span>Email</span><div className="auth-input"><AtSign size={17} /><input name="email" type="email" autoComplete="email" placeholder="coach@fitsync.vn" required /></div></label>
        <label><span>Mật khẩu</span><div className="auth-input"><LockKeyhole size={17} /><input name="password" type="password" autoComplete={registering ? "new-password" : "current-password"} minLength={8} placeholder="Ít nhất 8 ký tự" required /></div></label>
        <button className="auth-submit">{registering ? "Tạo workspace PT" : "Vào workspace"}<ArrowRight size={17} /></button>
      </form>
      <div className="auth-switch"><span>{registering ? "Đã có workspace?" : "Lần đầu dùng FitSync?"}</span><Link href={registering ? "/login" : "/register"}>{registering ? "Đăng nhập" : "Tạo tài khoản PT"} <ArrowRight size={14} /></Link></div>
    </>
  );
}
