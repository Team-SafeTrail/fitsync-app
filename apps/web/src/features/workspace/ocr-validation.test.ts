import { describe, expect, it } from "vitest";
import {
  matchesImageSignature,
  validateAndNormalizeOcrDraft,
  validateOcrUploadFile,
  MAX_OCR_IMAGE_BYTES,
  OCR_FAILURE_MESSAGES,
} from "./ocr-validation";
import {
  createDefaultOcrAdapter,
  DeterministicFakeOcrAdapter,
  type FakeOcrScenario,
} from "./ocr-adapter";

// Synthetic binary headers
const VALID_JPEG_HEADER = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
const VALID_PNG_HEADER = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const VALID_WEBP_HEADER = new Uint8Array([
  0x52, 0x49, 0x46, 0x46, // "RIFF"
  0x20, 0x00, 0x00, 0x00, // size
  0x57, 0x45, 0x42, 0x50, // "WEBP"
  0x56, 0x50, 0x38, 0x20,
]);
const CORRUPTED_HEADER = new Uint8Array([0x00, 0x01, 0x02, 0x03]);

function createMockFile(
  bytes: Uint8Array,
  name: string,
  type: string,
  sizeOverride?: number,
): File {
  const file = new File([bytes.buffer as ArrayBuffer], name, { type });
  if (sizeOverride !== undefined) {
    Object.defineProperty(file, "size", { value: sizeOverride });
  }
  return file;
}

describe("OCR File Upload Validation", () => {
  it("accepts valid JPEG, PNG, and WebP files with authentic signatures", async () => {
    const jpegFile = createMockFile(VALID_JPEG_HEADER, "inbody.jpg", "image/jpeg");
    const pngFile = createMockFile(VALID_PNG_HEADER, "inbody.png", "image/png");
    const webpFile = createMockFile(VALID_WEBP_HEADER, "inbody.webp", "image/webp");

    const jpegResult = await validateOcrUploadFile(jpegFile);
    expect(jpegResult.success).toBe(true);
    if (jpegResult.success) {
      expect(jpegResult.data.mimeType).toBe("image/jpeg");
      expect(jpegResult.data.extension).toBe("jpg");
    }

    const pngResult = await validateOcrUploadFile(pngFile);
    expect(pngResult.success).toBe(true);
    if (pngResult.success) {
      expect(pngResult.data.mimeType).toBe("image/png");
      expect(pngResult.data.extension).toBe("png");
    }

    const webpResult = await validateOcrUploadFile(webpFile);
    expect(webpResult.success).toBe(true);
    if (webpResult.success) {
      expect(webpResult.data.extension).toBe("webp");
    }
  });

  it("rejects request when no file or an empty file is provided", async () => {
    const emptyFile = createMockFile(new Uint8Array([]), "empty.png", "image/png", 0);
    const result1 = await validateOcrUploadFile(emptyFile);
    expect(result1.success).toBe(false);
    if (!result1.success) {
      expect(result1.fieldErrors.file).toBeDefined();
    }

    const result2 = await validateOcrUploadFile(null);
    expect(result2.success).toBe(false);
  });

  it("rejects files exceeding the 10 MB limit", async () => {
    const oversizedFile = createMockFile(
      VALID_PNG_HEADER,
      "huge.png",
      "image/png",
      MAX_OCR_IMAGE_BYTES + 1024,
    );
    const result = await validateOcrUploadFile(oversizedFile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("file_too_large");
      expect(result.message).toBe(OCR_FAILURE_MESSAGES.file_too_large);
    }
  });

  it("rejects unsupported MIME types", async () => {
    const pdfFile = createMockFile(
      new Uint8Array([0x25, 0x50, 0x44, 0x46]),
      "report.pdf",
      "application/pdf",
    );
    const result = await validateOcrUploadFile(pdfFile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("unsupported_type");
      expect(result.message).toBe(OCR_FAILURE_MESSAGES.unsupported_type);
    }
  });

  it("rejects spoofed files whose binary signatures do not match declared MIME type", async () => {
    // Declared as PNG but contains corrupted or text bytes
    const spoofedFile = createMockFile(CORRUPTED_HEADER, "fake.png", "image/png");
    const result = await validateOcrUploadFile(spoofedFile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("signature_mismatch");
      expect(result.message).toBe(OCR_FAILURE_MESSAGES.signature_mismatch);
    }
  });

  it("correctly matches image signatures in raw bytes helper", () => {
    expect(matchesImageSignature("image/jpeg", VALID_JPEG_HEADER)).toBe(true);
    expect(matchesImageSignature("image/png", VALID_PNG_HEADER)).toBe(true);
    expect(matchesImageSignature("image/webp", VALID_WEBP_HEADER)).toBe(true);
    expect(matchesImageSignature("image/jpeg", CORRUPTED_HEADER)).toBe(false);
    expect(matchesImageSignature("image/png", CORRUPTED_HEADER)).toBe(false);
    expect(matchesImageSignature("image/webp", CORRUPTED_HEADER)).toBe(false);
  });
});

describe("OCR Draft Normalization and Physiological Validation", () => {
  const validMetrics = {
    weightKg: 70.0,
    skeletalMuscleMassKg: 32.0,
    bodyFatMassKg: 14.0,
    percentBodyFat: 20.0,
    totalBodyWaterLiters: 41.5,
    confidence: {
      weight_kg: 0.98,
      skeletal_muscle_mass_kg: 0.95,
      body_fat_mass_kg: 0.95,
      percent_body_fat: 0.97,
      total_body_water_liters: 0.92,
    },
  };

  it("accepts consistent InBody 270 metrics and normalizes output", () => {
    const result = validateAndNormalizeOcrDraft(validMetrics);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.draft.metrics.weight_kg).toBe(70);
      expect(result.draft.metrics.skeletal_muscle_mass_kg).toBe(32);
      expect(result.draft.metrics.body_fat_mass_kg).toBe(14);
      expect(result.draft.metrics.percent_body_fat).toBe(20);
      expect(result.draft.metrics.total_body_water_liters).toBe(41.5);
      expect(result.draft.warnings).toHaveLength(0);
    }
  });

  it("accepts missing total body water as it is optional", () => {
    const { totalBodyWaterLiters: _water, ...withoutWater } = validMetrics;
    const result = validateAndNormalizeOcrDraft(withoutWater);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.draft.metrics.total_body_water_liters).toBeNull();
    }
  });

  it("rejects drafts missing required metrics with missing_fields error code", () => {
    const { weightKg: _w, ...missingWeight } = validMetrics;
    const result = validateAndNormalizeOcrDraft(missingWeight);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("missing_fields");
      expect(result.fieldErrors.weightKg).toBeDefined();
    }
  });

  it("rejects metrics that violate physiological bounds with invalid_values error code", () => {
    const invalidWeight = { ...validMetrics, weightKg: 20 }; // min is 30
    const result = validateAndNormalizeOcrDraft(invalidWeight);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("invalid_values");
      expect(result.fieldErrors.weightKg).toContain("30");
    }
  });

  it("rejects cross-field inconsistency when fat percentage and fat mass diverge by > 2%", () => {
    // 14kg of 70kg is 20%. percentBodyFat set to 30% (diff = 10% > 2%)
    const inconsistent = { ...validMetrics, percentBodyFat: 30.0 };
    const result = validateAndNormalizeOcrDraft(inconsistent);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("inconsistent_values");
      expect(result.fieldErrors.percentBodyFat).toContain("chênh lệch");
    }
  });

  it("rejects when muscle mass + fat mass exceeds total weight", () => {
    const excess = {
      ...validMetrics,
      weightKg: 60,
      skeletalMuscleMassKg: 40,
      bodyFatMassKg: 25, // 40 + 25 = 65 > 60
    };
    const result = validateAndNormalizeOcrDraft(excess);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("inconsistent_values");
    }
  });

  it("adds warnings when confidence scores fall below threshold (0.85)", () => {
    const lowConfidence = {
      ...validMetrics,
      confidence: {
        weight_kg: 0.95,
        skeletal_muscle_mass_kg: 0.70, // low
        body_fat_mass_kg: 0.65, // low
        percent_body_fat: 0.95,
      },
    };
    const result = validateAndNormalizeOcrDraft(lowConfidence);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.draft.warnings.length).toBeGreaterThanOrEqual(2);
      expect(result.draft.warnings.some((w) => w.includes("Khối cơ xương"))).toBe(true);
      expect(result.draft.warnings.some((w) => w.includes("Khối mỡ"))).toBe(true);
    }
  });
});

describe("Deterministic Fake OCR Provider Adapter", () => {
  const dummyBytes = VALID_PNG_HEADER;
  const dummyMime = "image/png";

  it("returns clean 5-field normalized draft in clean scenario", async () => {
    const adapter = new DeterministicFakeOcrAdapter("clean");
    const result = await adapter.extract(dummyBytes, dummyMime);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.provider).toBe("deterministic-fake");
      expect(result.providerVersion).toBe("1.0.0");
      expect(result.draft.metrics.weight_kg).toBe(70);
      expect(result.draft.metrics.total_body_water_liters).toBe(41.5);
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    }
  });

  it("handles missing water scenario correctly", async () => {
    const adapter = new DeterministicFakeOcrAdapter("missing_water");
    const result = await adapter.extract(dummyBytes, dummyMime);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.draft.metrics.total_body_water_liters).toBeNull();
    }
  });

  it("handles low confidence scenario with flagged warnings", async () => {
    const adapter = new DeterministicFakeOcrAdapter("low_confidence");
    const result = await adapter.extract(dummyBytes, dummyMime);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.draft.warnings.length).toBeGreaterThan(0);
    }
  });

  it("handles provider timeout safely without throwing unhandled exceptions", async () => {
    const adapter = new DeterministicFakeOcrAdapter("timeout");
    const result = await adapter.extract(dummyBytes, dummyMime, { timeoutMs: 100 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("provider_timeout");
      expect(result.message).toContain("timeout");
    }
  });

  it("handles provider unavailable safely", async () => {
    const adapter = new DeterministicFakeOcrAdapter("unavailable");
    const result = await adapter.extract(dummyBytes, dummyMime);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("provider_unavailable");
      expect(result.message).toContain("gián đoạn");
    }
  });

  it("handles unreadable document failure safely", async () => {
    const adapter = new DeterministicFakeOcrAdapter("unreadable");
    const result = await adapter.extract(dummyBytes, dummyMime);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("unreadable_document");
    }
  });

  it("handles missing fields and inconsistent values scenarios safely", async () => {
    const adapterMissing = new DeterministicFakeOcrAdapter("missing_fields");
    const resMissing = await adapterMissing.extract(dummyBytes, dummyMime);
    expect(resMissing.success).toBe(false);
    if (!resMissing.success) {
      expect(resMissing.errorCode).toBe("missing_fields");
    }

    const adapterInconsistent = new DeterministicFakeOcrAdapter("inconsistent_values");
    const resInconsistent = await adapterInconsistent.extract(dummyBytes, dummyMime);
    expect(resInconsistent.success).toBe(false);
    if (!resInconsistent.success) {
      expect(resInconsistent.errorCode).toBe("inconsistent_values");
    }
  });
});

describe("Default OCR provider boundary", () => {
  it("returns a recoverable unavailable result instead of synthetic metrics", async () => {
    const adapter = createDefaultOcrAdapter();
    const result = await adapter.extract(VALID_PNG_HEADER, "image/png");

    expect(adapter.available).toBe(false);
    expect(adapter.name).not.toBe("deterministic-fake");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("provider_unavailable");
      expect(result.message).toContain("nhập tay");
    }
  });
});
