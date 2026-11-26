import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import AuthShell from "@/components/auth/AuthShell";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signup } from "../auth/actions";

export default async function RegisterPage({ searchParams: query }: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await query;
  const configured = isSupabaseConfigured();
  return (
    <AuthShell eyebrow="Dành cho huấn luyện viên" title="Tạo không gian FitSync." description="Bắt đầu bằng tài khoản PT. Lời mời học viên sẽ được tạo từ workspace sau khi đăng nhập.">
      {configured ? (
        <AuthForm mode="register" action={signup} error={searchParams.error} />
      ) : (
        <div className="auth-alert is-unavailable" role="status"><p>Workspace thật hiện chưa khả dụng trong môi trường này. Bạn vẫn có thể khám phá giao diện bằng dữ liệu mẫu.</p></div>
      )}
    </AuthShell>
  );
}
