import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { getWorkspaceViewer } from "@/features/workspace/data";
import { createClient } from "@/lib/supabase/server";
import { isChatEnabled } from "@/features/chat/config";

export const dynamic = "force-dynamic";

export default async function ConversationsPage() {
  const viewer = await getWorkspaceViewer();
  if (!viewer) redirect("/login");
  if (!isChatEnabled()) {
    return (
      <main id="main-content" className="workspace-main">
        <div style={{ marginBottom: "14px" }}>
          <Link href="/workspace" prefetch={true} className="fs-pill-link">
            <ArrowLeft size={15} /> Về workspace
          </Link>
        </div>
        <h1>Trao đổi</h1>
        <section className="workspace-empty">
          <MessageCircle size={28} />
          <h2>Trao đổi chưa được mở</h2>
          <p>Bạn vẫn có thể xem hồ sơ và hoạt động trong workspace.</p>
        </section>
      </main>
    );
  }
  if (viewer.profile.role !== "pt" && viewer.profile.role !== "trainee") redirect("/workspace");
  const supabase = await createClient();
  const query = supabase
    .from("trainee_profiles")
    .select("id, display_name")
    .not("profile_id", "is", null)
    .neq("status", "archived");
  const { data, error } = await (viewer.profile.role === "pt"
    ? query.eq("assigned_pt_id", viewer.user.id)
    : query.eq("profile_id", viewer.user.id));
  if (!error && viewer.profile.role === "trainee" && data?.length === 1) {
    redirect(`/workspace/chat/${data[0].id}`);
  }

  return (
    <main id="main-content" className="workspace-main">
      <div style={{ marginBottom: "14px" }}>
        <Link href="/workspace" prefetch={true} className="fs-pill-link">
          <ArrowLeft size={15} /> Về workspace
        </Link>
      </div>

      <header className="coaching-page-header">
        <div>
          <p className="workspace-kicker">Nhắn tin riêng tư</p>
          <h1>Trao đổi với học viên</h1>
          <p>Chọn học viên đã kết nối tài khoản để mở hội thoại.</p>
        </div>
        {data && (
          <span className="workspace-badge is-verified">
            <MessageCircle size={14} /> {data.length} cuộc trò chuyện
          </span>
        )}
      </header>

      {error ? (
        <p role="alert" className="workspace-alert is-error">Chưa tải được danh sách. Hãy thử lại.</p>
      ) : data?.length ? (
        <div className="fs-chat-directory">
          {data.map((trainee) => {
            const initials = trainee.display_name
              .trim()
              .split(/\s+/)
              .slice(-2)
              .map((p) => p[0])
              .join("")
              .toUpperCase();
            return (
              <Link key={trainee.id} href={`/workspace/chat/${trainee.id}`} prefetch={true} className="fs-chat-card">
                <span className="workspace-avatar">{initials}</span>
                <div className="fs-chat-card-meta">
                  <strong>{trainee.display_name}</strong>
                  <span>Mở cuộc trò chuyện</span>
                </div>
                <ArrowRight size={17} style={{ color: "var(--color-text-secondary)" }} />
              </Link>
            );
          })}
        </div>
      ) : (
        <section className="workspace-empty compact">
          <MessageCircle size={28} />
          <h3>Chưa có hội thoại nào</h3>
          <p>Hoàn tất gửi lời mời kết nối tài khoản trong hồ sơ trước khi trao đổi.</p>
          <Link href="/workspace" className="fs-pill-link is-brand">Mở danh sách học viên</Link>
        </section>
      )}
    </main>
  );
}
