import { describe, expect, it } from "vitest";
import {
  APPLICATION_TIME_ZONE,
  fullCalendarDaysWithoutCheckin,
  getApplicationDate,
  isCheckinWarningDue,
  warningStartsOn,
} from "./calendar";
import { prepareFollowUp } from "./follow-up";
import { validateCheckin, validateRemainingSessions } from "./validation";

function form(values: Record<string, string | File>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("engagement calendar", () => {
  it("uses the documented Vietnam application timezone at its UTC date boundary", () => {
    expect(APPLICATION_TIME_ZONE).toBe("Asia/Ho_Chi_Minh");
    expect(getApplicationDate("2026-09-21T16:59:59.999Z")).toBe("2026-09-21");
    expect(getApplicationDate("2026-09-21T17:00:00.000Z")).toBe("2026-09-22");
  });

  it("warns only after three complete intervening calendar dates", () => {
    expect(warningStartsOn("2026-09-21")).toBe("2026-09-25");
    expect(fullCalendarDaysWithoutCheckin("2026-09-21", "2026-09-24")).toBe(2);
    expect(fullCalendarDaysWithoutCheckin("2026-09-21", "2026-09-25")).toBe(3);
    expect(isCheckinWarningDue("2026-09-21", "2026-09-24T16:59:59.999Z")).toBe(false);
    expect(isCheckinWarningDue("2026-09-21", "2026-09-24T17:00:00.000Z")).toBe(true);
  });

  it("crosses month and year boundaries deterministically", () => {
    expect(warningStartsOn("2026-12-29")).toBe("2027-01-02");
    expect(isCheckinWarningDue("2026-12-29", "2027-01-01T17:00:00.000Z")).toBe(true);
  });
});

describe("check-in validation", () => {
  it("accepts an optional note and a signature-valid PNG", async () => {
    const png = new File([
      new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]),
    ], "meal.png", { type: "image/png" });
    const result = await validateCheckin(form({ note: "  Ăn đủ bữa.  ", mealPhoto: png }));

    expect(result).toEqual(expect.objectContaining({ success: true }));
    if (result.success) {
      expect(result.data.note).toBe("Ăn đủ bữa.");
      expect(result.data.photoExtension).toBe("png");
    }
  });

  it("accepts an empty check-in and rejects spoofed image content", async () => {
    expect(await validateCheckin(form({}))).toEqual({
      success: true,
      data: { note: null, photo: null, photoType: null, photoExtension: null },
    });

    const spoofed = new File(["not an image"], "meal.png", { type: "image/png" });
    const result = await validateCheckin(form({ mealPhoto: spoofed }));
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.mealPhoto).toContain("không khớp");
  });

  it("enforces session balances against the package total", () => {
    expect(validateRemainingSessions(form({ remainingSessions: "7" }), 12)).toEqual({
      success: true,
      data: { remainingSessions: 7 },
    });
    expect(validateRemainingSessions(form({ remainingSessions: "13" }), 12).success).toBe(false);
    expect(validateRemainingSessions(form({ remainingSessions: "4.5" }), 12).success).toBe(false);
  });
});

describe("manual follow-up", () => {
  it("prepares copy and Zalo destinations without a send operation", () => {
    const options = prepareFollowUp("Nguyễn Minh Lan", "090 123 4567");
    expect(options.message).toContain("Lan");
    expect(options.zaloUrl).toBe("https://zalo.me/0901234567");
    expect(Object.keys(options).sort()).toEqual(["message", "zaloUrl"]);
  });
});
