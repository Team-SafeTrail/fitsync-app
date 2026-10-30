import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getWorkspaceViewer } from "@/features/workspace/data";
import { getChatContext } from "@/features/chat/data";
import { isChatEnabled } from "@/features/chat/config";
import { parseChatCursor, makeChatCursor } from "@/features/chat/validation";
import ChatComposer from "@/components/workspace/ChatComposer";

export const dynamic = "force-dynamic";

export default async function ConversationPage({params, searchParams}: {params: {traineeId: string}; searchParams: {before?: string}}) {
  if (!await getWorkspaceViewer()) redirect("/login");
  if (!isChatEnabled()) redirect("/workspace/chat");
  const context = await getChatContext(params.traineeId);
  if (!context) notFound();
  const cursor = parseChatCursor(searchParams.before);
  if (searchParams.before && !cursor) notFound();
  const { trainee, viewer } = context;
  // Resolve identity/membership before any streaming fallback can commit HTTP200.
  return <main id="main-content" className="workspace-main chat-page">
    <header className="workspace-page-heading"><div><Link href="/workspace/chat">Các cuộc trò chuyện</Link><h1>{viewer.profile.role === "pt" ? `Trao đổi với ${trainee.display_name}` : "Trao đổi với PT của bạn"}</h1><p>Cuộc trò chuyện riêng · Giờ Việt Nam</p></div>{viewer.profile.role === "pt" && <Link href={`/workspace/trainees/${trainee.id}`}>Mở hồ sơ học viên</Link>}</header>
    <Suspense fallback={<p role="status">Đang tải tin nhắn…</p>}><MessageHistory context={context} cursor={cursor} /></Suspense>
    <ChatComposer key={trainee.id} traineeId={trainee.id} refreshAutomatically={!cursor} />
    <p className="chat-refresh-note">Trang tin mới nhất tự cập nhật mỗi 15 giây khi đang mở. Chưa có trạng thái đã đọc hoặc thông báo đẩy.</p>
  </main>;
}

async function MessageHistory({context, cursor}: {context: NonNullable<Awaited<ReturnType<typeof getChatContext>>>; cursor: ReturnType<typeof parseChatCursor>}) {
  const {trainee, viewer, supabase} = context;
  let query = supabase.from("coaching_messages").select("id, sender_id, body, created_at")
    .eq("trainee_id", trainee.id).eq("pt_id", trainee.assigned_pt_id).eq("learner_id", trainee.profile_id!)
    .order("created_at", {ascending: false}).order("id", {ascending: false}).limit(51);
  if (cursor) query = query.or(`created_at.lt.${cursor.time},and(created_at.eq.${cursor.time},id.lt.${cursor.id})`);
  const { data, error } = await query;
  const hasOlder = (data?.length ?? 0) > 50;
  const messages = (data ?? []).slice(0,50).reverse();
  const oldest = messages[0];
  const olderCursor = oldest ? makeChatCursor(oldest.created_at, oldest.id) : null;
  const date = new Intl.DateTimeFormat("vi-VN", {dateStyle:"short",timeStyle:"short",timeZone:"Asia/Ho_Chi_Minh"});
  return <>
    {cursor && <Link href={`/workspace/chat/${trainee.id}`}>Về tin nhắn mới nhất</Link>}
    {hasOlder && olderCursor && <Link href={{pathname:`/workspace/chat/${trainee.id}`,query:{before:olderCursor}}}>Xem tin nhắn cũ hơn</Link>}
    {hasOlder && !olderCursor && <p role="alert">Chưa mở được phần lịch sử cũ hơn. Hãy cập nhật lại cuộc trò chuyện.</p>}
    <section className="chat-history" aria-label="Lịch sử tin nhắn">
      {error ? <p role="alert">Chưa tải được cuộc trò chuyện. Hãy cập nhật lại; tin đang soạn vẫn được giữ.</p> : messages.length ? messages.map(message => <article key={message.id} className={message.sender_id === viewer.user.id ? "chat-message is-own" : "chat-message"}><span>{message.sender_id === viewer.user.id ? "Bạn" : viewer.profile.role === "pt" ? trainee.display_name : "PT của bạn"}</span><p>{message.body}</p><time dateTime={message.created_at}>{date.format(new Date(message.created_at))}</time></article>) : <p>Chưa có tin nhắn. Bắt đầu trao đổi về lịch sinh hoạt hoặc việc tập luyện của bạn.</p>}
    </section>
  </>;
}
