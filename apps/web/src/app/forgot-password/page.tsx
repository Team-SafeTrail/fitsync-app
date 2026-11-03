import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, AtSign } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { requestPasswordReset } from "../auth/actions";

export const metadata: Metadata = {
  title: "Quên mật khẩu | FitSync",
  description: "Đặt lại mật khẩu cho tài khoản FitSync của bạn.",
};

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <AuthShell
      eyebrow="ĐẶT LẠI MẬT KHẨU"
      title="Khôi phục quyền truy cập."
      description="Nhập email tài khoản của bạn để nhận liên kết xác thực đặt lại mật khẩu an toàn."
    >
      {searchParams.error && (
        <p role="alert" className="auth-alert is-error">
          {searchParams.error}
        </p>
      )}
      {searchParams.message && (
        <p role="status" className="auth-alert is-success">
          {searchParams.message}
        </p>
      )}
      <form action={requestPasswordReset} className="auth-form">
        <label>
          <span>Email đã đăng ký</span>
          <div className="auth-input">
            <AtSign size={17} />
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="coach@fitsync.vn"
              required
            />
          </div>
        </label>
        <button className="auth-submit">
          Gửi liên kết đặt lại mật khẩu <ArrowRight size={17} />
        </button>
      </form>
      <div className="auth-switch">
        <Link href="/login">
          <ArrowLeft size={14} /> Quay lại trang đăng nhập
        </Link>
      </div>
    </AuthShell>
  );
}

