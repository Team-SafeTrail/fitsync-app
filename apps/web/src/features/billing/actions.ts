"use server";
import { revalidatePath } from "next/cache";
import { getWorkspaceViewer } from "@/features/workspace/data";
import { createClient } from "@/lib/supabase/server";
import type { WorkspaceActionState } from "@/features/workspace/action-state";
export async function requestUpgrade(_state: WorkspaceActionState, form: FormData): Promise<WorkspaceActionState> {
  if ((await getWorkspaceViewer())?.profile.role !== "pt" || form.get("understood") !== "on") return { status: "error", message: "PT cần xác nhận giá gói và cách đối soát." };
  const nonce = String(form.get("nonce") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(nonce)) return { status: "error", message: "Tải lại trang để tạo mã yêu cầu." };
  const { error } = await (await createClient()).rpc("request_pt_upgrade", { request_nonce: nonce });
  if (error) return { status: "error", message: "Chưa lưu được yêu cầu. Kiểm tra kết nối và thử lại." };
  revalidatePath("/workspace/billing"); revalidatePath("/admin");
  return { status: "success", message: "Đã ghi nhận yêu cầu nâng cấp. Yêu cầu này chưa phải xác nhận đã thanh toán." };
}
export async function recordWorkspaceVisit() {
  const viewer = await getWorkspaceViewer();
  if (!viewer || !["pt", "trainee"].includes(viewer.profile.role)) return;
  await (await createClient()).rpc("log_workspace_open");
}
