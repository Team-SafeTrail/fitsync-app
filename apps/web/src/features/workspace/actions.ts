"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createInvitationToken, hashInvitationToken, isInvitationToken } from "@/features/invitations/token";
import { validateCheckin, validateRemainingSessions } from "@/features/engagement/validation";
import type { WorkspaceActionState } from "./action-state";
import { validateCreateTrainee, validateInBody, validateNutritionDraft } from "./validation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function errorState(message: string, fieldErrors?: Record<string, string>): WorkspaceActionState {
  return { status: "error", message, fieldErrors };
}

async function requireRole(role: "pt" | "trainee") {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== role) return null;
  return { user, supabase };
}

export async function createTrainee(
  _previousState: WorkspaceActionState,
  formData: FormData,
): Promise<WorkspaceActionState> {
  const input = validateCreateTrainee(formData);
  if (!input.success) return errorState(input.message, input.fieldErrors);

  const context = await requireRole("pt");
  if (!context) return errorState("Chỉ tài khoản PT đã đăng nhập mới có thể tạo học viên.");

  const rawToken = createInvitationToken();
  const tokenHash = hashInvitationToken(rawToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await context.supabase.rpc("create_trainee_with_invitation", {
    trainee_display_name: input.data.displayName,
    trainee_goal: input.data.goal,
    trainee_phone: input.data.phone ?? "",
    package_total: input.data.totalSessions,
    package_remaining: input.data.remainingSessions,
    invite_email: input.data.email,
    invite_token_hash: tokenHash,
    invite_expires_at: expiresAt,
  });

  if (error) {
    if (error.code === "23505") {
      return errorState("Email này đã có một lời mời đang chờ trong workspace của bạn.", {
        email: "Thu hồi hoặc dùng lời mời hiện tại trước khi tạo lời mời mới.",
      });
    }
    return errorState("Không thể tạo học viên và lời mời. Kiểm tra dữ liệu rồi thử lại.");
  }

  revalidatePath("/workspace");
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
  return {
    status: "success",
    message: `Đã tạo ${input.data.displayName}. Sao chép liên kết này ngay, token sẽ không được hiển thị lại sau khi tải lại trang.`,
    invitationUrl: `${siteUrl}/invite/${rawToken}`,
    invitationExpiresAt: expiresAt,
  };
}

export async function acceptInvitation(
  rawToken: string,
  _previousState: WorkspaceActionState,
  formData: FormData,
): Promise<WorkspaceActionState> {
  if (!isInvitationToken(rawToken)) return errorState("Liên kết mời không hợp lệ.");
  const passwordValue = formData.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";
  if (password.length < 8) {
    return errorState("Mật khẩu cần có ít nhất 8 ký tự.", {
      password: "Dùng ít nhất 8 ký tự.",
    });
  }

  const tokenHash = hashInvitationToken(rawToken);
  const supabase = createClient();
  const { data: previews, error: previewError } = await supabase.rpc("get_invitation_preview", {
    invite_token_hash: tokenHash,
  });
  const invitation = previews?.[0];
  if (previewError || !invitation) {
    return errorState("Lời mời không còn hiệu lực hoặc đã được sử dụng.");
  }

  const { data: currentAuth } = await supabase.auth.getUser();
  if (!currentAuth.user) {
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: invitation.email,
      password,
      options: {
        data: { display_name: invitation.display_name, role: "trainee" },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000"}/auth/callback`,
      },
    });

    if (signupError) return errorState("Không thể tạo thông tin đăng nhập cho lời mời này.");
    if (!signupData.session) {
      return {
        status: "success",
        message: "Kiểm tra email xác nhận, sau đó mở lại liên kết mời để hoàn tất kết nối.",
      };
    }
  } else if (currentAuth.user.email?.toLowerCase() !== invitation.email) {
    return errorState("Hãy đăng xuất và dùng đúng email ghi trên lời mời.");
  }

  const { data: outcomes, error: acceptError } = await supabase.rpc("accept_trainee_invitation", {
    invite_token_hash: tokenHash,
  });
  const outcome = outcomes?.[0]?.outcome;
  if (acceptError || outcome !== "accepted") {
    const messages: Record<string, string> = {
      expired: "Lời mời đã hết hạn.",
      used: "Lời mời đã được sử dụng.",
      email_mismatch: "Email đăng nhập không khớp với lời mời.",
      account_role: "Tài khoản PT không thể nhận lời mời học viên.",
      invalid: "Lời mời không hợp lệ.",
    };
    return errorState(messages[outcome ?? ""] ?? "Không thể chấp nhận lời mời.");
  }

  revalidatePath("/workspace");
  redirect("/workspace");
}

export async function createInBodyRecord(
  traineeId: string,
  _previousState: WorkspaceActionState,
  formData: FormData,
): Promise<WorkspaceActionState> {
  const input = validateInBody(formData);
  if (!input.success) return errorState(input.message, input.fieldErrors);

  const context = await requireRole("pt");
  if (!context) return errorState("Chỉ PT phụ trách mới có thể xác nhận bản ghi.");

  const { data: trainee } = await context.supabase
    .from("trainee_profiles")
    .select("id, assigned_pt_id, profile_id")
    .eq("id", traineeId)
    .maybeSingle();
  if (!trainee || trainee.assigned_pt_id !== context.user.id || !trainee.profile_id) {
    return errorState("Học viên chưa liên kết hoặc không thuộc workspace này.");
  }

  const values = input.data;
  const { error } = await context.supabase.from("inbody_records").insert({
    trainee_id: trainee.id,
    pt_id: context.user.id,
    verified_by: context.user.id,
    source: "manual",
    is_manually_edited: true,
    weight_kg: values.weightKg,
    skeletal_muscle_mass_kg: values.skeletalMuscleMassKg,
    body_fat_mass_kg: values.bodyFatMassKg,
    percent_body_fat: values.percentBodyFat,
    total_body_water_liters: values.totalBodyWaterLiters,
    target_calories: values.targetCalories,
    target_protein_grams: values.targetProteinGrams,
    target_carb_grams: values.targetCarbGrams,
    target_fat_grams: values.targetFatGrams,
  });

  if (error) return errorState("Không thể lưu bản ghi. Các chỉ số chưa vượt qua kiểm tra dữ liệu.");

  revalidatePath("/workspace");
  revalidatePath(`/workspace/trainees/${trainee.id}`);
  return {
    status: "success",
    message: "Bản ghi đã được lưu thành công.",
  };
}

export async function updateNutritionDraft(recordId: string, traineeId: string, formData: FormData) {
  const input = validateNutritionDraft(formData);
  if (!input.success) redirect(`/workspace/trainees/${traineeId}?nutrition=invalid`);

  const context = await requireRole("pt");
  if (!context) redirect("/login");

  const { data: updatedRecord, error } = await context.supabase
    .from("inbody_records")
    .update({
      target_calories: input.data.targetCalories,
      target_protein_grams: input.data.targetProteinGrams,
      target_carb_grams: input.data.targetCarbGrams,
      target_fat_grams: input.data.targetFatGrams,
    })
    .eq("id", recordId)
    .eq("trainee_id", traineeId)
    .eq("pt_id", context.user.id)
    .select("id")
    .maybeSingle();

  if (error || !updatedRecord) redirect(`/workspace/trainees/${traineeId}?nutrition=error`);
  revalidatePath(`/workspace/trainees/${traineeId}`);
  redirect(`/workspace/trainees/${traineeId}?nutrition=updated`);
}

export async function submitDailyCheckin(
  _previousState: WorkspaceActionState,
  formData: FormData,
): Promise<WorkspaceActionState> {
  const context = await requireRole("trainee");
  if (!context) return errorState("Chỉ học viên đã liên kết mới có thể gửi check-in.");

  const input = await validateCheckin(formData);
  if (!input.success) return errorState(input.message, input.fieldErrors);

  const { data: trainee } = await context.supabase
    .from("trainee_profiles")
    .select("id")
    .eq("profile_id", context.user.id)
    .maybeSingle();
  if (!trainee) return errorState("Hồ sơ học viên chưa được liên kết với tài khoản này.");

  let photoPath: string | null = null;
  if (input.data.photo && input.data.photoType && input.data.photoExtension) {
    photoPath = `${trainee.id}/${crypto.randomUUID()}.${input.data.photoExtension}`;
    const bytes = new Uint8Array(await input.data.photo.arrayBuffer());
    const { error: uploadError } = await context.supabase.storage
      .from("meal-media")
      .upload(photoPath, bytes, {
        contentType: input.data.photoType,
        upsert: false,
      });

    if (uploadError) {
      return errorState("Không thể tải ảnh bữa ăn lên vùng lưu trữ riêng tư. Hãy thử lại.", {
        mealPhoto: "Ảnh chưa được tải lên.",
      });
    }
  }

  const rpcArgs = photoPath && input.data.photo && input.data.photoType
    ? {
      checkin_note: input.data.note ?? "",
      meal_photo_path: photoPath,
      meal_photo_mime_type: input.data.photoType,
      meal_photo_size_bytes: input.data.photo.size,
    }
    : { checkin_note: input.data.note ?? "" };
  const { data: results, error } = await context.supabase.rpc("submit_daily_checkin", rpcArgs);
  const result = results?.[0];

  if (error || result?.outcome !== "created") {
    if (photoPath) await context.supabase.storage.from("meal-media").remove([photoPath]);
    if (result?.outcome === "already_submitted") {
      return errorState("Bạn đã gửi check-in cho ngày hôm nay. Mỗi ngày chỉ có một check-in.");
    }
    return errorState("Không thể lưu check-in. Hãy tải lại trang và thử lại.");
  }

  revalidatePath("/workspace");
  revalidatePath(`/workspace/trainees/${trainee.id}`);
  return {
    status: "success",
    message: input.data.photo
      ? "Đã lưu check-in và ảnh bữa ăn trong vùng riêng tư."
      : "Đã lưu check-in hôm nay.",
  };
}

export async function updateRemainingSessions(
  traineeId: string,
  _previousState: WorkspaceActionState,
  formData: FormData,
): Promise<WorkspaceActionState> {
  const context = await requireRole("pt");
  if (!context) return errorState("Chỉ PT phụ trách mới có thể cập nhật số buổi.");

  const { data: trainee } = await context.supabase
    .from("trainee_profiles")
    .select("id, assigned_pt_id, total_sessions")
    .eq("id", traineeId)
    .maybeSingle();
  if (!trainee || trainee.assigned_pt_id !== context.user.id) {
    return errorState("Không tìm thấy học viên trong workspace này.");
  }

  const input = validateRemainingSessions(formData, trainee.total_sessions);
  if (!input.success) return errorState(input.message, input.fieldErrors);

  const { data: updated, error } = await context.supabase
    .from("trainee_profiles")
    .update({ remaining_sessions: input.data.remainingSessions })
    .eq("id", trainee.id)
    .eq("assigned_pt_id", context.user.id)
    .select("id")
    .maybeSingle();

  if (error || !updated) return errorState("Không thể cập nhật số buổi còn lại.");

  revalidatePath("/workspace");
  revalidatePath(`/workspace/trainees/${trainee.id}`);
  return { status: "success", message: "Đã cập nhật số buổi còn lại." };
}

export async function submitInBodyForm(traineeId: string, previousState: WorkspaceActionState, formData: FormData) {
  const ocrAttemptId = formData.get("ocrAttemptId") as string | null;
  if (ocrAttemptId) {
    const { confirmOcrDraft } = await import("./ocr-actions");
    return confirmOcrDraft(ocrAttemptId, traineeId, previousState, formData);
  }
  return createInBodyRecord(traineeId, previousState, formData);
}
