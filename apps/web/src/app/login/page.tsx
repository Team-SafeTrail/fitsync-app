import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import AuthShell from "@/components/auth/AuthShell";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { login } from "../auth/actions";

export default function LoginPage({ searchParams }: { searchParams: { error?: string; message?: string } }) {
  const configured = isSupabaseConfigured();
  return (
    <AuthShell eyebrow="Không gian làm việc" title="Tiếp tục cùng học viên." description="Đăng nhập vào khu vực dữ liệu thật. Bản mẫu công khai vẫn nằm ở mục Khám phá trên trang chủ.">
      {configured ? (
        <AuthForm mode="login" action={login} error={searchParams.error} message={searchParams.message} />
      ) : (
        <div className="auth-alert is-unavailable" role="status"><p>Workspace thật hiện chưa khả dụng trong môi trường này. Bạn vẫn có thể khám phá giao diện bằng dữ liệu mẫu.</p><Link href="/app/dashboard" className="auth-demo-link">Xem bản mẫu công khai</Link></div>
      )}
    </AuthShell>
  );
}
