"use server";
import { revalidatePath } from "next/cache";
import { getWorkspaceViewer } from "./data";
import { createClient } from "@/lib/supabase/server";
import type { WorkspaceActionState } from "./action-state";

export async function saveRosterProfile(traineeId: string, version: number, _state: WorkspaceActionState, form: FormData): Promise<WorkspaceActionState> {
  const viewer = await getWorkspaceViewer();
  if (viewer?.profile.role !== "pt") return { status: "error", message: "Chỉ PT phụ trách có thể sửa hồ sơ." };
  const name = String(form.get("displayName") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const goal = form.get("goal");
  if (name.length < 2 || name.length > 100 || (phone && (!/^[0-9+ ().-]{8,20}$/.test(phone))) || !["fat_loss", "muscle_gain", "recomp"].includes(String(goal))) {
    return { status: "error", message: "Kiểm tra tên, số điện thoại và mục tiêu trước khi lưu." };
  }
  const { error } = await createClient().rpc("save_trainee_profile", { target_trainee: traineeId, expected_version: version, trainee_name: name, contact_phone: phone, goal: goal as "fat_loss" | "muscle_gain" | "recomp" });
  if (error) return { status: "error", message: error.code === "40001" ? "Hồ sơ vừa thay đổi. Tải lại trang trước khi lưu." : "Không thể lưu hồ sơ. Kiểm tra quyền và trạng thái rồi thử lại." };
  revalidatePath("/workspace"); revalidatePath(`/workspace/trainees/${traineeId}`);
  return { status: "success", message: "Đã lưu thông tin hồ sơ học viên." };
}

export async function archiveRosterProfile(traineeId: string, version: number, archive: boolean, _state: WorkspaceActionState, form: FormData): Promise<WorkspaceActionState> {
  const viewer = await getWorkspaceViewer();
  if (viewer?.profile.role !== "pt" || form.get("confirmed") !== "on") return { status: "error", message: "PT cần xác nhận thao tác trước khi tiếp tục." };
  const { error } = await createClient().rpc("set_trainee_archived", { target_trainee: traineeId, expected_version: version, archive_profile: archive });
  if (error) return { status: "error", message: error.code === "40001" ? "Hồ sơ vừa thay đổi. Tải lại trang rồi thử lại." : "Không thể thay đổi trạng thái hồ sơ." };
  revalidatePath("/workspace"); revalidatePath(`/workspace/trainees/${traineeId}`);
  return { status: "success", message: archive ? "Đã lưu trữ hồ sơ và thu hồi lời mời chưa nhận." : "Đã khôi phục hồ sơ. Lời mời cũ vẫn bị thu hồi; cấp link mới nếu cần." };
}
