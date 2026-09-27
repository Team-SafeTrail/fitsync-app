import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import InvitationAcceptForm from "@/components/workspace/InvitationAcceptForm";
import { hashInvitationToken, isInvitationToken } from "@/features/invitations/token";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Chấp nhận lời mời | FitSync",
  robots: { index: false, follow: false },
};

export default async function InvitationPage({ params }: { params: { token: string } }) {
  const rawToken = params.token;
  let invitation: { display_name: string; email: string; expires_at: string } | undefined;

  if (isInvitationToken(rawToken)) {
    const supabase = createClient();
    const { data } = await supabase.rpc("get_invitation_preview", {
      invite_token_hash: hashInvitationToken(rawToken),
    });
    invitation = data?.[0];
  }

  if (!invitation) {
    return (
      <AuthShell eyebrow="LỜI MỜI KHÔNG CÒN HIỆU LỰC" title="Yêu cầu PT gửi liên kết mới." description="Liên kết có thể đã hết hạn, đã được dùng hoặc không hợp lệ.">
        <p className="auth-alert is-error" role="alert">Không có dữ liệu học viên nào được mở từ liên kết này.</p>
        <Link className="auth-submit" href="/login">Đến trang đăng nhập</Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="LỜI MỜI HỌC VIÊN" title={`Chào ${invitation.display_name}.`} description="Tạo mật khẩu để kết nối với PT và xem các kết quả đã xác minh của riêng bạn.">
      <InvitationAcceptForm rawToken={rawToken} email={invitation.email} />
    </AuthShell>
  );
}
