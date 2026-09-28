"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { WorkspaceActionState } from "./action-state";
import { validateInBody } from "./validation";
import {
  validateOcrUploadFile,
  type OcrFailureCode,
  type OcrNormalizedDraft,
} from "./ocr-validation";
import {
  DeterministicFakeOcrAdapter,
  type FakeOcrScenario,
  type OcrProviderAdapter,
} from "./ocr-adapter";
import type { Json } from "@/types/database";

function errorState(
  message: string,
  fieldErrors?: Record<string, string>,
  errorCode?: OcrFailureCode,
  attemptId?: string,
): WorkspaceActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    ocrErrorCode: errorCode,
    ocrAttemptId: attemptId,
  };
}

async function requirePt() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "pt") return null;
  return { user, supabase };
}

export async function startOcrAttempt(
  traineeId: string,
  _previousState: WorkspaceActionState,
  formData: FormData,
  adapterOverride?: OcrProviderAdapter,
): Promise<WorkspaceActionState> {
  const context = await requirePt();
  if (!context) {
    return errorState("Chỉ PT phụ trách đã đăng nhập mới có thể quét phiếu InBody.");
  }

  // Verify trainee belongs to this PT and is active
  const { data: trainee, error: traineeError } = await context.supabase
    .from("trainee_profiles")
    .select("id, assigned_pt_id, profile_id")
    .eq("id", traineeId)
    .maybeSingle();

  if (traineeError || !trainee || trainee.assigned_pt_id !== context.user.id || !trainee.profile_id) {
    return errorState("Học viên chưa liên kết tài khoản hoặc không thuộc quyền quản lý của bạn.");
  }

  // Validate upload file (MIME, size <= 10MB, binary signature)
  const fileField = formData.get("inbodyImage") ?? formData.get("file");
  const fileValidation = await validateOcrUploadFile(fileField);
  if (!fileValidation.success) {
    return errorState(
      fileValidation.message,
      fileValidation.fieldErrors,
      fileValidation.errorCode,
    );
  }

  const fileData = fileValidation.data;
  const imagePath = `${trainee.id}/${crypto.randomUUID()}.${fileData.extension}`;
  const imageBytes = new Uint8Array(await fileData.file.arrayBuffer());

  // Upload to private InBody media storage
  const { error: uploadError } = await context.supabase.storage
    .from("inbody-media")
    .upload(imagePath, imageBytes, {
      contentType: fileData.mimeType,
      upsert: false,
    });

  if (uploadError) {
    return errorState(
      "Không thể lưu trữ ảnh trong vùng riêng tư. Vui lòng thử lại.",
      { file: "Tải ảnh lên storage thất bại." },
      "processing_error",
    );
  }

  // Execute OCR provider adapter (deterministic fake by default for development/test)
  const scenario = (formData.get("mockScenario") as FakeOcrScenario | null) ?? undefined;
  const adapter = adapterOverride ?? new DeterministicFakeOcrAdapter(scenario);
  const extractionResult = await adapter.extract(imageBytes, fileData.mimeType, {
    mockScenario: scenario,
  });

  // Create signed URL for PT to view private image side-by-side
  const { data: signedData } = await context.supabase.storage
    .from("inbody-media")
    .createSignedUrl(imagePath, 60);

  const signedUrl = signedData?.signedUrl;

  // Persist attempt to database
  const insertPayload = {
    trainee_id: trainee.id,
    pt_id: context.user.id,
    private_image_path: imagePath,
    image_mime_type: fileData.mimeType,
    image_size_bytes: fileData.sizeBytes,
    provider: extractionResult.provider,
    provider_version: extractionResult.providerVersion,
    status: (extractionResult.success ? "success" : "failed") as "success" | "failed",
    error_code: extractionResult.success ? null : extractionResult.errorCode,
    raw_draft: (extractionResult.success ? (extractionResult.draft as unknown as Json) : null),
  };

  const { data: attemptRow, error: attemptError } = await context.supabase
    .from("ocr_attempts")
    .insert(insertPayload)
    .select("id")
    .maybeSingle();

  if (attemptError || !attemptRow) {
    return errorState(
      "Không thể khởi tạo bản ghi lần quét OCR trong cơ sở dữ liệu.",
      undefined,
      "processing_error",
    );
  }

  if (!extractionResult.success) {
    return {
      status: "error",
      message: extractionResult.message,
      ocrAttemptId: attemptRow.id,
      ocrErrorCode: extractionResult.errorCode,
      fieldErrors: extractionResult.fieldErrors,
      ocrSourceImageUrl: signedUrl,
    };
  }

  return {
    status: "success",
    message: "Quét phiếu thành công. Huấn luyện viên cần kiểm tra lại các chỉ số trước khi xác nhận.",
    ocrAttemptId: attemptRow.id,
    ocrDraft: extractionResult.draft,
    ocrSourceImageUrl: signedUrl,
  };
}

export async function confirmOcrDraft(
  attemptId: string,
  traineeId: string,
  _previousState: WorkspaceActionState,
  formData: FormData,
): Promise<WorkspaceActionState> {
  const context = await requirePt();
  if (!context) {
    return errorState("Chỉ PT phụ trách đã đăng nhập mới có thể xác nhận bản ghi.");
  }

  // Validate confirmed inputs against physiological bounds and confirmation checkbox
  const input = validateInBody(formData);
  if (!input.success) {
    return errorState(input.message, input.fieldErrors);
  }

  const values = input.data;

  // Execute atomic confirmation procedure
  const { data: results, error: rpcError } = await context.supabase.rpc(
    "confirm_ocr_inbody_record",
    {
      attempt_id: attemptId,
      confirmed_weight_kg: values.weightKg,
      confirmed_muscle_kg: values.skeletalMuscleMassKg,
      confirmed_fat_kg: values.bodyFatMassKg,
      confirmed_fat_percent: values.percentBodyFat,
      confirmed_water_liters: values.totalBodyWaterLiters,
      nutrition_calories: values.targetCalories,
      nutrition_protein: values.targetProteinGrams,
      nutrition_carb: values.targetCarbGrams,
      nutrition_fat: values.targetFatGrams,
    },
  );

  const result = results?.[0];

  if (rpcError || !result) {
    return errorState(
      "Không thể xác nhận bản ghi InBody. Vui lòng kiểm tra lại quyền hạn hoặc dữ liệu.",
    );
  }

  revalidatePath("/workspace");
  revalidatePath(`/workspace/trainees/${traineeId}`);

  return {
    status: "success",
    message: result.is_manually_edited
      ? "Bản ghi InBody đã được xác minh và lưu (đã ghi nhận chỉnh sửa từ huấn luyện viên)."
      : "Bản ghi InBody đã được xác minh và lưu.",
  };
}

export async function getOcrAttemptSignedUrl(attemptId: string): Promise<{
  success: boolean;
  signedUrl?: string;
  error?: string;
}> {
  const context = await requirePt();
  if (!context) {
    return { success: false, error: "Yêu cầu tài khoản PT đã đăng nhập." };
  }

  const { data: attempt, error: attemptError } = await context.supabase
    .from("ocr_attempts")
    .select("private_image_path, pt_id")
    .eq("id", attemptId)
    .maybeSingle();

  if (attemptError || !attempt || attempt.pt_id !== context.user.id) {
    return { success: false, error: "Không tìm thấy lần quét này hoặc bạn không có quyền truy cập." };
  }

  const { data: signedData, error: storageError } = await context.supabase.storage
    .from("inbody-media")
    .createSignedUrl(attempt.private_image_path, 60);

  if (storageError || !signedData?.signedUrl) {
    return { success: false, error: "Không thể tạo liên kết xem ảnh an toàn." };
  }

  return { success: true, signedUrl: signedData.signedUrl };
}
