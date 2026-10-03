import type { ValidationResult } from "./validation";

export const MAX_OCR_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const OCR_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type OcrImageMimeType = (typeof OCR_IMAGE_TYPES)[number];

export const OCR_FAILURE_CODES = [
  "unsupported_type",
  "file_too_large",
  "signature_mismatch",
  "provider_timeout",
  "provider_unavailable",
  "unreadable_document",
  "missing_fields",
  "invalid_values",
  "inconsistent_values",
  "processing_error",
] as const;

export type OcrFailureCode = (typeof OCR_FAILURE_CODES)[number];

export const OCR_FAILURE_MESSAGES: Record<OcrFailureCode, string> = {
  unsupported_type: "Định dạng tệp không được hỗ trợ. Chỉ chấp nhận JPEG, PNG hoặc WebP.",
  file_too_large: "Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 10 MB).",
  signature_mismatch: "Nội dung tệp không khớp với phần mở rộng hoặc định dạng ảnh đã khai báo.",
  provider_timeout: "Quá thời gian phản hồi từ hệ thống OCR. Bạn có thể nhập tay ngay.",
  provider_unavailable: "Dịch vụ OCR tạm thời không khả dụng. Bạn có thể nhập tay ngay.",
  unreadable_document: "Không nhận diện được nội dung phiếu InBody. Vui lòng chụp rõ hoặc nhập tay.",
  missing_fields: "Thiếu một số trường chỉ số bắt buộc từ phiếu InBody.",
  invalid_values: "Một số chỉ số trích xuất nằm ngoài khoảng giá trị sinh lý hợp lệ.",
  inconsistent_values: "Các chỉ số cơ/mỡ/cân nặng trích xuất mâu thuẫn với nhau.",
  processing_error: "Đã xảy ra lỗi trong quá trình xử lý ảnh.",
};

export type ValidatedOcrFileInput = {
  file: File;
  mimeType: OcrImageMimeType;
  extension: "jpg" | "png" | "webp";
  sizeBytes: number;
};

export type OcrMetrics = {
  weight_kg: number;
  skeletal_muscle_mass_kg: number;
  body_fat_mass_kg: number;
  percent_body_fat: number;
  total_body_water_liters: number | null;
};

export type OcrConfidence = {
  weight_kg: number | null;
  skeletal_muscle_mass_kg: number | null;
  body_fat_mass_kg: number | null;
  percent_body_fat: number | null;
  total_body_water_liters: number | null;
};

export type OcrNormalizedDraft = {
  metrics: OcrMetrics;
  confidence: OcrConfidence;
  warnings: string[];
};

export function matchesImageSignature(type: OcrImageMimeType, bytes: Uint8Array): boolean {
  if (type === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (type === "image/png") {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return signature.every((value, index) => bytes[index] === value);
  }
  return (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  );
}

export async function validateOcrUploadFile(
  file: unknown,
): Promise<ValidationResult<ValidatedOcrFileInput> & { errorCode?: OcrFailureCode }> {
  if (!(file instanceof File) || file.size === 0) {
    return {
      success: false,
      message: "Vui lòng chọn ảnh kết quả InBody 270 để quét.",
      fieldErrors: { file: "Thiếu tệp ảnh tải lên." },
      errorCode: "unreadable_document",
    };
  }

  if (file.size > MAX_OCR_IMAGE_BYTES) {
    return {
      success: false,
      message: OCR_FAILURE_MESSAGES.file_too_large,
      fieldErrors: { file: `Kích thước tệp ${(file.size / 1024 / 1024).toFixed(1)} MB vượt quá 10 MB.` },
      errorCode: "file_too_large",
    };
  }

  const mimeType = file.type as OcrImageMimeType;
  if (!OCR_IMAGE_TYPES.includes(mimeType)) {
    return {
      success: false,
      message: OCR_FAILURE_MESSAGES.unsupported_type,
      fieldErrors: { file: "Định dạng không được hỗ trợ. Chỉ nhận JPEG, PNG hoặc WebP." },
      errorCode: "unsupported_type",
    };
  }

  const headerBytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (!matchesImageSignature(mimeType, headerBytes)) {
    return {
      success: false,
      message: OCR_FAILURE_MESSAGES.signature_mismatch,
      fieldErrors: { file: "Chữ ký nhị phân của tệp không khớp với định dạng MIME khai báo." },
      errorCode: "signature_mismatch",
    };
  }

  const extension = mimeType === "image/jpeg" ? "jpg" : (mimeType.split("/")[1] as "png" | "webp");

  return {
    success: true,
    data: {
      file,
      mimeType,
      extension,
      sizeBytes: file.size,
    },
  };
}

export type RawExtractedMetrics = {
  weightKg?: number | null;
  skeletalMuscleMassKg?: number | null;
  bodyFatMassKg?: number | null;
  percentBodyFat?: number | null;
  totalBodyWaterLiters?: number | null;
  confidence?: Partial<Record<keyof OcrMetrics, number | null>>;
};

export type DraftValidationResult =
  | { success: true; draft: OcrNormalizedDraft }
  | { success: false; errorCode: OcrFailureCode; message: string; fieldErrors: Record<string, string> };

export function validateAndNormalizeOcrDraft(raw: RawExtractedMetrics): DraftValidationResult {
  const fieldErrors: Record<string, string> = {};
  const warnings: string[] = [];

  const { weightKg, skeletalMuscleMassKg, bodyFatMassKg, percentBodyFat, totalBodyWaterLiters } = raw;

  if (weightKg === null || weightKg === undefined) {
    fieldErrors.weightKg = "Thiếu chỉ số cân nặng.";
  }
  if (skeletalMuscleMassKg === null || skeletalMuscleMassKg === undefined) {
    fieldErrors.skeletalMuscleMassKg = "Thiếu chỉ số khối cơ xương.";
  }
  if (bodyFatMassKg === null || bodyFatMassKg === undefined) {
    fieldErrors.bodyFatMassKg = "Thiếu chỉ số khối mỡ.";
  }
  if (percentBodyFat === null || percentBodyFat === undefined) {
    fieldErrors.percentBodyFat = "Thiếu chỉ số tỷ lệ mỡ cơ thể.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      errorCode: "missing_fields",
      message: "Phiếu quét thiếu một số chỉ số bắt buộc.",
      fieldErrors,
    };
  }

  // Bounds checking
  const w = Number(weightKg);
  const smm = Number(skeletalMuscleMassKg);
  const bfm = Number(bodyFatMassKg);
  const pbf = Number(percentBodyFat);
  const tbw = totalBodyWaterLiters !== null && totalBodyWaterLiters !== undefined
    ? Number(totalBodyWaterLiters)
    : null;

  if (Number.isNaN(w) || w < 30 || w > 220) {
    fieldErrors.weightKg = "Cân nặng cần từ 30 đến 220 kg.";
  }
  if (Number.isNaN(smm) || smm < 10 || smm > 75) {
    fieldErrors.skeletalMuscleMassKg = "Khối cơ xương cần từ 10 đến 75 kg.";
  }
  if (Number.isNaN(bfm) || bfm < 2 || bfm > 100) {
    fieldErrors.bodyFatMassKg = "Khối mỡ cần từ 2 đến 100 kg.";
  }
  if (Number.isNaN(pbf) || pbf < 3 || pbf > 60) {
    fieldErrors.percentBodyFat = "Tỷ lệ mỡ cần từ 3% đến 60%.";
  }
  if (tbw !== null && (Number.isNaN(tbw) || tbw < 10 || tbw > 100)) {
    fieldErrors.totalBodyWaterLiters = "Tổng nước cơ thể cần từ 10 đến 100 lít.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      errorCode: "invalid_values",
      message: "Chỉ số trích xuất nằm ngoài khoảng sinh lý hợp lệ.",
      fieldErrors,
    };
  }

  // Physiological consistency
  if (bfm > w) {
    fieldErrors.bodyFatMassKg = "Khối mỡ không thể lớn hơn cân nặng.";
  }
  if (smm + bfm > w) {
    fieldErrors.skeletalMuscleMassKg = "Tổng khối cơ và mỡ vượt quá tổng cân nặng.";
  }
  if (tbw !== null && tbw > w) {
    fieldErrors.totalBodyWaterLiters = "Lượng nước cơ thể vượt quá cân nặng.";
  }

  const calculatedFatPercent = (bfm / w) * 100;
  if (Math.abs(calculatedFatPercent - pbf) > 2) {
    fieldErrors.percentBodyFat = `Khối mỡ và tỷ lệ mỡ chênh lệch ${Math.abs(calculatedFatPercent - pbf).toFixed(1)} điểm phần trăm (tối đa cho phép 2).`;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      errorCode: "inconsistent_values",
      message: "Các chỉ số trích xuất mâu thuẫn sinh lý.",
      fieldErrors,
    };
  }

  // Check confidence scores for warnings
  const conf = raw.confidence ?? {};
  const CONF_THRESHOLD = 0.85;

  const confidence: OcrConfidence = {
    weight_kg: conf.weight_kg ?? null,
    skeletal_muscle_mass_kg: conf.skeletal_muscle_mass_kg ?? null,
    body_fat_mass_kg: conf.body_fat_mass_kg ?? null,
    percent_body_fat: conf.percent_body_fat ?? null,
    total_body_water_liters: conf.total_body_water_liters ?? null,
  };

  if (confidence.weight_kg !== null && confidence.weight_kg < CONF_THRESHOLD) {
    warnings.push("Cân nặng có độ tin cậy thấp, cần kiểm tra lại.");
  }
  if (confidence.skeletal_muscle_mass_kg !== null && confidence.skeletal_muscle_mass_kg < CONF_THRESHOLD) {
    warnings.push("Khối cơ xương có độ tin cậy thấp, cần kiểm tra lại.");
  }
  if (confidence.body_fat_mass_kg !== null && confidence.body_fat_mass_kg < CONF_THRESHOLD) {
    warnings.push("Khối mỡ có độ tin cậy thấp, cần kiểm tra lại.");
  }
  if (confidence.percent_body_fat !== null && confidence.percent_body_fat < CONF_THRESHOLD) {
    warnings.push("Tỷ lệ mỡ có độ tin cậy thấp, cần kiểm tra lại.");
  }

  return {
    success: true,
    draft: {
      metrics: {
        weight_kg: Number(w.toFixed(2)),
        skeletal_muscle_mass_kg: Number(smm.toFixed(2)),
        body_fat_mass_kg: Number(bfm.toFixed(2)),
        percent_body_fat: Number(pbf.toFixed(1)),
        total_body_water_liters: tbw !== null ? Number(tbw.toFixed(2)) : null,
      },
      confidence,
      warnings,
    },
  };
}
