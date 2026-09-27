import type { ValidationResult } from "@/features/workspace/validation";

export const MAX_CHECKIN_NOTE_LENGTH = 500;
export const MAX_MEAL_PHOTO_BYTES = 5 * 1024 * 1024;
export const MEAL_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

type MealPhotoType = (typeof MEAL_PHOTO_TYPES)[number];

export type CheckinInput = {
  note: string | null;
  photo: File | null;
  photoType: MealPhotoType | null;
  photoExtension: "jpg" | "png" | "webp" | null;
};

function failure(message: string, fieldErrors: Record<string, string>): ValidationResult<never> {
  return { success: false, message, fieldErrors };
}
function matchesSignature(type: MealPhotoType, bytes: Uint8Array) {
  if (type === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (type === "image/png") {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return signature.every((value, index) => bytes[index] === value);
  }
  return bytes.length >= 12
    && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
    && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
}

export async function validateCheckin(formData: FormData): Promise<ValidationResult<CheckinInput>> {
  const noteValue = formData.get("note");
  const note = typeof noteValue === "string" ? noteValue.trim() : "";
  const photoValue = formData.get("mealPhoto");
  const photo = photoValue instanceof File && photoValue.size > 0 ? photoValue : null;
  const fieldErrors: Record<string, string> = {};

  if (note.length > MAX_CHECKIN_NOTE_LENGTH) {
    fieldErrors.note = `Ghi chú tối đa ${MAX_CHECKIN_NOTE_LENGTH} ký tự.`;
  }

  let photoType: MealPhotoType | null = null;
  let photoExtension: CheckinInput["photoExtension"] = null;
  if (photo) {
    if (photo.size > MAX_MEAL_PHOTO_BYTES) {
      fieldErrors.mealPhoto = "Ảnh bữa ăn cần nhỏ hơn hoặc bằng 5 MB.";
    } else if (!MEAL_PHOTO_TYPES.includes(photo.type as MealPhotoType)) {
      fieldErrors.mealPhoto = "Chỉ nhận ảnh JPEG, PNG hoặc WebP.";
    } else {
      photoType = photo.type as MealPhotoType;
      const bytes = new Uint8Array(await photo.slice(0, 16).arrayBuffer());
      if (!matchesSignature(photoType, bytes)) {
        fieldErrors.mealPhoto = "Nội dung tệp không khớp với định dạng ảnh đã khai báo.";
      } else {
        photoExtension = photoType === "image/jpeg" ? "jpg" : photoType.split("/")[1] as "png" | "webp";
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return failure("Check-in chưa được lưu. Kiểm tra lại nội dung được đánh dấu.", fieldErrors);
  }

  return {
    success: true,
    data: {
      note: note || null,
      photo,
      photoType,
      photoExtension,
    },
  };
}

export function validateRemainingSessions(formData: FormData, totalSessions: number) {
  const value = formData.get("remainingSessions");
  const remainingSessions = typeof value === "string" && value.trim() !== ""
    ? Number(value)
    : Number.NaN;

  if (!Number.isInteger(remainingSessions) || remainingSessions < 0 || remainingSessions > totalSessions) {
    return failure("Số buổi còn lại chưa hợp lệ.", {
      remainingSessions: `Nhập số nguyên từ 0 đến ${totalSessions}.`,
    });
  }

  return { success: true as const, data: { remainingSessions } };
}
