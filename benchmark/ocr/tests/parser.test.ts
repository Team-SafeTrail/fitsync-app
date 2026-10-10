import { describe, expect, it } from "vitest";
import { parseMetricTokens } from "../src/parser";
import type { Token } from "../src/types";

function row(y: number, label: string, value: string, confidence = 0.97): Token[] {
  return [
    { text: label, confidence: 0.99, x: 10, y, width: 300, height: 30 },
    { text: value, confidence, x: 500, y, width: 80, height: 30 },
  ];
}

describe("OCR metric token parser", () => {
  it("maps labeled rows into the existing raw OCR contract", () => {
    const parsed = parseMetricTokens([
      ...row(10, "Weight (kg)", "70.0"),
      ...row(110, "Skeletal Muscle Mass (kg)", "31.5"),
      ...row(210, "Body Fat Mass (kg)", "14.0"),
      ...row(310, "Percent Body Fat (%)", "20.0"),
      ...row(410, "Total Body Water (L)", "41.2", 0.81),
    ]);

    expect(parsed.raw).toMatchObject({
      weightKg: 70,
      skeletalMuscleMassKg: 31.5,
      bodyFatMassKg: 14,
      percentBodyFat: 20,
      totalBodyWaterLiters: 41.2,
    });
    expect(parsed.raw.confidence?.total_body_water_liters).toBe(0.81);
  });

  it("keeps an explicitly absent optional field as null", () => {
    const parsed = parseMetricTokens([
      ...row(10, "Weight (kg)", "70.0"),
      { text: "Total Body Water (L) Not measured", confidence: 0.98, x: 10, y: 60, width: 500, height: 30 },
    ]);

    expect(parsed.observed.total_body_water_liters).toBeNull();
  });

  it("groups label and value tokens from a rotated row", () => {
    const parsed = parseMetricTokens([
      { text: "Weight", confidence: 0.99, x: 20, y: 10, width: 140, height: 30 },
      { text: "(kg)", confidence: 0.99, x: 170, y: 20, width: 70, height: 30 },
      { text: "70.0", confidence: 0.98, x: 500, y: 45, width: 80, height: 30 },
    ]);

    expect(parsed.observed.weight_kg).toBe(70);
  });

  it("associates a right-column value emitted on a separate OCR line", () => {
    const parsed = parseMetricTokens([
      { text: "Body Fat Mass (kg)", confidence: 0.99, x: 20, y: 100, width: 300, height: 30, lineId: "1:1:1" },
      { text: "14.0", confidence: 0.96, x: 500, y: 135, width: 80, height: 30, lineId: "1:1:2" },
    ]);

    expect(parsed.observed.body_fat_mass_kg).toBe(14);
  });
});
