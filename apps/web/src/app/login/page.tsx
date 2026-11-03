import AuthForm from "@/components/auth/AuthForm";
import AuthShell from "@/components/auth/AuthShell";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { login } from "../auth/actions";

export default function LoginPage({ searchParams }: { searchParams: { error?: string; message?: string } }) {
  const configured = isSupabaseConfigured();
  return (
    <AuthShell eyebrow="KHÔNG GIAN LÀM VIỆC" title="Tiếp tục cùng học viên." description="Đăng nhập vào khu vực dữ liệu thật. Bản mẫu công khai vẫn nằm ở mục Khám phá trên trang chủ.">
      {configured ? (
        <AuthForm mode="login" action={login} error={searchParams.error} message={searchParams.message} />
      ) : (
        <p role="status" className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          Supabase chưa được cấu hình. Sao chép <code>apps/web/.env.example</code> thành <code>apps/web/.env.local</code> và thêm khóa dự án để bật đăng nhập.
        </p>
      )}
    </AuthShell>
  );
}
