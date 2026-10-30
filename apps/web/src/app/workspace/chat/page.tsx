import Link from "next/link";
import { redirect } from "next/navigation";
import { getWorkspaceViewer } from "@/features/workspace/data";
import { createClient } from "@/lib/supabase/server";
import { isChatEnabled } from "@/features/chat/config";

export const dynamic = "force-dynamic";

export default async function ConversationsPage() {
  const viewer = await getWorkspaceViewer();
  if (!viewer) redirect("/login");
  if (!isChatEnabled()) return <main id="main-content" className="workspace-main"><h1>Trao đổi</h1><section className="workspace-empty"><h2>Trao đổi chưa được mở</h2><p>Bạn vẫn có thể xem hồ sơ và hoạt động trong workspace.</p><Link href="/workspace">Về workspace</Link></section></main>;
  if (viewer.profile.role !== "pt" && viewer.profile.role !== "trainee") redirect("/workspace");
  const supabase = createClient();
  const query = supabase.from("trainee_profiles").select("id, display_name").not("profile_id", "is", null).neq("status", "archived");
  const { data, error } = await (viewer.profile.role === "pt" ? query.eq("assigned_pt_id", viewer.user.id) : query.eq("profile_id", viewer.user.id));
  if (!error && viewer.profile.role === "trainee" && data?.length === 1) redirect(`/workspace/chat/${data[0].id}`);
  return <main id="main-content" className="workspace-main"><h1>Trao đổi với học viên</h1><p>Chọn học viên đã kết nối để tiếp tục cuộc trò chuyện.</p>{error ? <p role="alert">Chưa tải được danh sách. Hãy thử lại.</p> : <div className="chat-thread-list">{data?.map(trainee => <Link key={trainee.id} href={`/workspace/chat/${trainee.id}`}>{trainee.display_name}<span>Mở cuộc trò chuyện</span></Link>)}{!data?.length && <p>Chưa có tài khoản học viên được kết nối. Hoàn tất lời mời trong hồ sơ trước khi trao đổi.</p>}</div>}<Link href="/workspace">Về workspace</Link></main>;
}
