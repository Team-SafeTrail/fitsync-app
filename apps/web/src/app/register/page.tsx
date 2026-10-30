import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import AuthShell from "@/components/auth/AuthShell";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signup } from "../auth/actions";

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
  const configured = isSupabaseConfigured();
  return (
    <AuthShell eyebrow="Dành cho huấn luyện viên" title="Tạo không gian FitSync." description="Bắt đầu bằng tài khoản PT. Lời mời học viên sẽ được tạo từ workspace sau khi đăng nhập.">
      {configured ? (
        <AuthForm mode="register" action={signup} error={searchParams.error} />
      ) : (
        <div className="auth-alert is-unavailable" role="status"><p>Workspace thật hiện chưa khả dụng trong môi trường này. Bạn vẫn có thể khám phá giao diện bằng dữ liệu mẫu.</p><Link href="/app/dashboard" className="auth-demo-link">Xem bản mẫu công khai</Link></div>
      )}
    </AuthShell>
  );
}
