"use server";
import { revalidatePath } from "next/cache";
import { getChatContext } from "./data";
import { isChatEnabled } from "./config";
import { validateChatMessage } from "./validation";
import type { ChatState } from "./action-state";

export async function sendChatMessage(traineeId: string, _previous: ChatState, form: FormData): Promise<ChatState> {
  if (!isChatEnabled()) return { status: "error", notice: "Trao đổi chưa được mở tại môi trường này." };
  const input = validateChatMessage(form);
  if (!input.ok) return { status: "error", notice: input.error };
  const context = await getChatContext(traineeId);
  if (!context) return { status: "error", notice: "Không thể gửi. Hãy kiểm tra đăng nhập và kết nối với PT/học viên." };
  const { supabase, viewer, trainee } = context;
  const { error } = await supabase.from("coaching_messages").insert({
    trainee_id: trainee.id, pt_id: trainee.assigned_pt_id, sender_id: viewer.user.id, learner_id: trainee.profile_id!,
    client_message_id: input.nonce, body: input.body,
  });
  if (error?.code === "23505") {
    // A network retry reuses the same nonce. Never silently change a committed body.
    const { data: existing } = await supabase.from("coaching_messages")
      .select("trainee_id, pt_id, learner_id, body").eq("sender_id", viewer.user.id)
      .eq("client_message_id", input.nonce).maybeSingle();
    if (!existing || existing.trainee_id !== trainee.id || existing.pt_id !== trainee.assigned_pt_id || existing.learner_id !== trainee.profile_id || existing.body !== input.body) {
      return { status: "error", conflict: true, notice: "Lượt gửi này đã được dùng. Kiểm tra lịch sử trước khi bắt đầu một tin mới." };
    }
  } else if (error) {
    return { status: "error", notice: "Chưa xác nhận gửi được. Nội dung vẫn giữ ở đây; bạn có thể thử lại." };
  }
  revalidatePath(`/workspace/chat/${traineeId}`);
  return { status: "success", notice: "Đã gửi.", nonce: input.nonce };
}
