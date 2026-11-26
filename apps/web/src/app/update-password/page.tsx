import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import PasswordInput from "@/components/auth/PasswordInput";
import { updatePassword } from "../auth/actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tạo mật khẩu mới | FitSync",
  robots: { index: false, follow: false },
};

export default async function UpdatePasswordPage({
  searchParams: query,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await query;
  if (!await getCurrentUser()) redirect("/forgot-password");
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
        <PasswordInput
          label="Mật khẩu mới"
          name="password"
          autoComplete="new-password"
          minLength={8}
          placeholder="Ít nhất 8 ký tự"
          required
        />
        <PasswordInput
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          autoComplete="new-password"
          minLength={8}
          placeholder="Nhập lại mật khẩu mới"
          required
        />
        <button className="auth-submit">
          Lưu mật khẩu mới <ArrowRight size={17} />
        </button>
      </form>
    </AuthShell>
  );
}

