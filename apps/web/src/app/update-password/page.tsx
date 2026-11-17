import type { Metadata } from "next";
import { ArrowRight, LockKeyhole } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { updatePassword } from "../auth/actions";

export const metadata: Metadata = {
  title: "Tạo mật khẩu mới | FitSync",
  robots: { index: false, follow: false },
};

export default function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <AuthShell
      eyebrow="BẢO MẬT TÀI KHOẢN"
      title="Thiết lập mật khẩu mới."
      description="Nhập mật khẩu mới có ít nhất 8 ký tự để hoàn tất khôi phục quyền truy cập."
    >
      {searchParams.error && (
        <p role="alert" className="auth-alert is-error">
          {searchParams.error}
        </p>
      )}
      <form action={updatePassword} className="auth-form">
        <label>
          <span>Mật khẩu mới</span>
          <div className="auth-input">
            <LockKeyhole size={17} />
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="Ít nhất 8 ký tự"
              required
            />
          </div>
        </label>
        <label>
          <span>Xác nhận mật khẩu mới</span>
          <div className="auth-input">
            <LockKeyhole size={17} />
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="Nhập lại mật khẩu mới"
              required
            />
          </div>
        </label>
        <button className="auth-submit">
          Lưu mật khẩu mới <ArrowRight size={17} />
        </button>
      </form>
    </AuthShell>
  );
}

