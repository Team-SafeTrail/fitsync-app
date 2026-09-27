import { describe, expect, it } from "vitest";
import { validateCreateTrainee, validateInBody } from "./validation";

function form(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("validateCreateTrainee", () => {
  it("accepts a complete trainee package", () => {
    const result = validateCreateTrainee(form({
      displayName: "Nguyễn Minh Anh",
      email: "minhanh@example.test",
      phone: "0901234567",
      goal: "recomp",
      totalSessions: "12",
      remainingSessions: "10",
    }));

    expect(result.success).toBe(true);
  });

  it("rejects a remaining-session count above the package total", () => {
    const result = validateCreateTrainee(form({
      displayName: "Nguyễn Minh Anh",
      email: "minhanh@example.test",
      goal: "fat_loss",
      totalSessions: "8",
      remainingSessions: "9",
    }));

    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.remainingSessions).toContain("không thể lớn hơn");
  });
});

describe("validateInBody", () => {
  const valid = {
    weightKg: "70",
    skeletalMuscleMassKg: "30",
    bodyFatMassKg: "14",
    percentBodyFat: "20",
    totalBodyWaterLiters: "40",
    targetCalories: "2100",
    targetProteinGrams: "126",
    targetCarbGrams: "245",
    targetFatGrams: "62",
    confirmed: "on",
  };

  it("accepts consistent metrics and editable nutrition drafts", () => {
    expect(validateInBody(form(valid))).toEqual(expect.objectContaining({ success: true }));
  });

  it("rejects inconsistent fat mass and body-fat percentage", () => {
    const result = validateInBody(form({ ...valid, percentBodyFat: "40" }));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.bodyFatMassKg).toContain("2 điểm phần trăm");
      expect(result.fieldErrors.percentBodyFat).toContain("2 điểm phần trăm");
    }
  });

  it("requires explicit coach confirmation", () => {
    const { confirmed: _confirmed, ...withoutConfirmation } = valid;
    const result = validateInBody(form(withoutConfirmation));
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.confirmed).toContain("xác nhận");
  });
});
