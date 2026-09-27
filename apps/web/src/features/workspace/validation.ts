const goals = ["fat_loss", "muscle_gain", "recomp"] as const;

export type FitnessGoal = (typeof goals)[number];

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; fieldErrors: Record<string, string> };

export type CreateTraineeInput = {
  displayName: string;
  email: string;
  phone: string | null;
  goal: FitnessGoal;
  totalSessions: number;
  remainingSessions: number;
};

export type InBodyInput = {
  weightKg: number;
  skeletalMuscleMassKg: number;
  bodyFatMassKg: number;
  percentBodyFat: number;
  totalBodyWaterLiters: number | null;
  targetCalories: number | null;
  targetProteinGrams: number | null;
  targetCarbGrams: number | null;
  targetFatGrams: number | null;
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function hasErrors(errors: Record<string, string>) {
  return Object.keys(errors).length > 0;
}

function failure(message: string, fieldErrors: Record<string, string>): ValidationResult<never> {
  return { success: false, message, fieldErrors };
}

export function validateCreateTrainee(formData: FormData): ValidationResult<CreateTraineeInput> {
  const displayName = text(formData, "displayName");
  const email = text(formData, "email").toLowerCase();
  const phone = text(formData, "phone");
  const goal = text(formData, "goal") as FitnessGoal;
  const totalSessions = numberValue(formData, "totalSessions");
  const remainingSessions = numberValue(formData, "remainingSessions");
  const fieldErrors: Record<string, string> = {};

  if (displayName.length < 2 || displayName.length > 100) {
    fieldErrors.displayName = "Tên học viên cần từ 2 đến 100 ký tự.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Nhập email hợp lệ để học viên nhận lời mời.";
  }
  if (phone && (!/^[0-9+ ().-]+$/.test(phone) || phone.length < 8 || phone.length > 20)) {
    fieldErrors.phone = "Số điện thoại cần từ 8 đến 20 ký tự hợp lệ.";
  }
  if (!goals.includes(goal)) {
    fieldErrors.goal = "Chọn một mục tiêu hợp lệ.";
  }
  if (!Number.isInteger(totalSessions) || totalSessions === null || totalSessions < 0 || totalSessions > 500) {
    fieldErrors.totalSessions = "Tổng số buổi cần là số nguyên từ 0 đến 500.";
  }
  if (!Number.isInteger(remainingSessions) || remainingSessions === null || remainingSessions < 0 || remainingSessions > 500) {
    fieldErrors.remainingSessions = "Số buổi còn lại cần là số nguyên từ 0 đến 500.";
  } else if (totalSessions !== null && remainingSessions > totalSessions) {
    fieldErrors.remainingSessions = "Số buổi còn lại không thể lớn hơn tổng gói.";
  }

  if (hasErrors(fieldErrors)) {
    return failure("Kiểm tra lại thông tin học viên được đánh dấu.", fieldErrors);
  }

  return {
    success: true,
    data: {
      displayName,
      email,
      phone: phone || null,
      goal,
      totalSessions: totalSessions as number,
      remainingSessions: remainingSessions as number,
    },
  };
}

type NumericRule = {
  key: keyof InBodyInput;
  formKey: string;
  label: string;
  min: number;
  max: number;
  required?: boolean;
  integer?: boolean;
};

const biometricRules: NumericRule[] = [
  { key: "weightKg", formKey: "weightKg", label: "Cân nặng", min: 30, max: 220, required: true },
  { key: "skeletalMuscleMassKg", formKey: "skeletalMuscleMassKg", label: "Khối cơ xương", min: 10, max: 75, required: true },
  { key: "bodyFatMassKg", formKey: "bodyFatMassKg", label: "Khối mỡ", min: 2, max: 100, required: true },
  { key: "percentBodyFat", formKey: "percentBodyFat", label: "Tỷ lệ mỡ", min: 3, max: 60, required: true },
  { key: "totalBodyWaterLiters", formKey: "totalBodyWaterLiters", label: "Tổng nước cơ thể", min: 10, max: 100 },
  { key: "targetCalories", formKey: "targetCalories", label: "Năng lượng", min: 800, max: 6000, integer: true },
  { key: "targetProteinGrams", formKey: "targetProteinGrams", label: "Protein", min: 0, max: 500, integer: true },
  { key: "targetCarbGrams", formKey: "targetCarbGrams", label: "Carb", min: 0, max: 1000, integer: true },
  { key: "targetFatGrams", formKey: "targetFatGrams", label: "Chất béo", min: 0, max: 300, integer: true },
];

export function validateInBody(formData: FormData): ValidationResult<InBodyInput> {
  const fieldErrors: Record<string, string> = {};
  const values = {} as InBodyInput;

  for (const rule of biometricRules) {
    const value = numberValue(formData, rule.formKey);
    if (value === null) {
      if (rule.required) fieldErrors[rule.formKey] = `${rule.label} là bắt buộc.`;
      values[rule.key] = null as never;
      continue;
    }
    if (!Number.isFinite(value) || value < rule.min || value > rule.max || (rule.integer && !Number.isInteger(value))) {
      fieldErrors[rule.formKey] = `${rule.label} cần nằm trong khoảng ${rule.min}-${rule.max}${rule.integer ? " và là số nguyên" : ""}.`;
    }
    values[rule.key] = value as never;
  }

  if (formData.get("confirmed") !== "on") {
    fieldErrors.confirmed = "Coach cần xác nhận đã kiểm tra đủ năm chỉ số.";
  }

  if (!hasErrors(fieldErrors)) {
    const calculatedPercent = (values.bodyFatMassKg / values.weightKg) * 100;
    if (Math.abs(calculatedPercent - values.percentBodyFat) > 2) {
      const message = "Khối mỡ và tỷ lệ mỡ chênh nhau quá 2 điểm phần trăm.";
      fieldErrors.bodyFatMassKg = message;
      fieldErrors.percentBodyFat = message;
    }
    if (values.skeletalMuscleMassKg + values.bodyFatMassKg > values.weightKg) {
      fieldErrors.skeletalMuscleMassKg = "Tổng khối cơ xương và khối mỡ không thể lớn hơn cân nặng.";
      fieldErrors.bodyFatMassKg = "Kiểm tra lại khối mỡ so với cân nặng và khối cơ xương.";
    }
    if (values.totalBodyWaterLiters !== null && values.totalBodyWaterLiters > values.weightKg) {
      fieldErrors.totalBodyWaterLiters = "Tổng nước cơ thể không thể lớn hơn cân nặng.";
    }
  }

  if (hasErrors(fieldErrors)) {
    return failure("Bản ghi chưa được lưu. Kiểm tra giới hạn và tính nhất quán của các chỉ số.", fieldErrors);
  }

  return { success: true, data: values };
}

export function validateNutritionDraft(formData: FormData) {
  const withConfirmation = new FormData();
  for (const key of ["targetCalories", "targetProteinGrams", "targetCarbGrams", "targetFatGrams"]) {
    const value = formData.get(key);
    if (typeof value === "string") withConfirmation.set(key, value);
  }
  withConfirmation.set("weightKg", "70");
  withConfirmation.set("skeletalMuscleMassKg", "30");
  withConfirmation.set("bodyFatMassKg", "14");
  withConfirmation.set("percentBodyFat", "20");
  withConfirmation.set("confirmed", "on");

  const result = validateInBody(withConfirmation);
  if (!result.success) return result;
  const { targetCalories, targetProteinGrams, targetCarbGrams, targetFatGrams } = result.data;
  return {
    success: true as const,
    data: { targetCalories, targetProteinGrams, targetCarbGrams, targetFatGrams },
  };
}
