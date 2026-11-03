import AuthForm from "@/components/auth/AuthForm";
import AuthShell from "@/components/auth/AuthShell";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signup } from "../auth/actions";

export default function RegisterPage({ searchParams }: { searchParams: { error?: string } }) {
  const configured = isSupabaseConfigured();
  return (
    <AuthShell eyebrow="DÀNH CHO HUẤN LUYỆN VIÊN" title="Tạo không gian FitSync." description="Bắt đầu bằng tài khoản PT. Lời mời học viên sẽ được tạo từ workspace sau khi đăng nhập.">
      {configured ? (
        <AuthForm mode="register" action={signup} error={searchParams.error} />
      ) : (
        <p role="status" className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Supabase chưa được cấu hình. Dùng tệp <code>apps/web/.env.example</code> để thiết lập môi trường local trước.
        </p>
      )}
    </AuthShell>
  );
}
