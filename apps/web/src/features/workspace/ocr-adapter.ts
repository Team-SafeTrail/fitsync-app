import type {
  OcrFailureCode,
  OcrNormalizedDraft,
  RawExtractedMetrics,
} from "./ocr-validation";
import { validateAndNormalizeOcrDraft } from "./ocr-validation";

export type OcrExtractionOptions = {
  timeoutMs?: number;
  mockScenario?: FakeOcrScenario;
};

export type OcrAdapterResult =
  | {
      success: true;
      provider: string;
      providerVersion: string;
      draft: OcrNormalizedDraft;
      durationMs: number;
    }
  | {
      success: false;
      provider: string;
      providerVersion: string;
      errorCode: OcrFailureCode;
      message: string;
      fieldErrors?: Record<string, string>;
      durationMs: number;
    };

export interface OcrProviderAdapter {
  readonly name: string;
  readonly version: string;
  readonly available: boolean;
  extract(
    imageBytes: Uint8Array,
    mimeType: string,
    options?: OcrExtractionOptions,
  ): Promise<OcrAdapterResult>;
}

export type FakeOcrScenario =
  | "clean"
  | "missing_water"
  | "low_confidence"
  | "missing_fields"
  | "invalid_values"
  | "inconsistent_values"
  | "timeout"
  | "unavailable"
  | "unreadable";

class UnavailableOcrAdapter implements OcrProviderAdapter {
  readonly name = "unconfigured";
  readonly version = "0";
  readonly available = false;

  async extract(): Promise<OcrAdapterResult> {
    return {
      success: false,
      provider: this.name,
      providerVersion: this.version,
      errorCode: "provider_unavailable",
      message: "Nhà cung cấp OCR chưa được chọn. Bạn có thể tiếp tục nhập tay.",
      durationMs: 0,
    };
  }
}

export function createDefaultOcrAdapter(): OcrProviderAdapter {
  return new UnavailableOcrAdapter();
}

export class DeterministicFakeOcrAdapter implements OcrProviderAdapter {
  readonly name = "deterministic-fake";
  readonly version = "1.0.0";
  readonly available = true;

  private defaultScenario: FakeOcrScenario;

  constructor(defaultScenario: FakeOcrScenario = "clean") {
    this.defaultScenario = defaultScenario;
  }

  async extract(
    _imageBytes: Uint8Array,
    _mimeType: string,
    options?: OcrExtractionOptions,
  ): Promise<OcrAdapterResult> {
    const startTime = Date.now();
    const scenario = options?.mockScenario ?? this.defaultScenario;
    const timeoutMs = options?.timeoutMs ?? 15000;

    if (scenario === "timeout") {
      const simulatedDuration = Math.min(timeoutMs + 10, 50); // don't block tests for 15s
      return {
        success: false,
        provider: this.name,
        providerVersion: this.version,
        errorCode: "provider_timeout",
        message: "Hệ thống OCR không phản hồi kịp thời (timeout). Bạn có thể nhập tay.",
        durationMs: simulatedDuration,
      };
    }

    if (scenario === "unavailable") {
      return {
        success: false,
        provider: this.name,
        providerVersion: this.version,
        errorCode: "provider_unavailable",
        message: "Dịch vụ OCR tạm thời gián đoạn. Bạn có thể nhập tay ngay.",
        durationMs: Date.now() - startTime,
      };
    }

    if (scenario === "unreadable") {
      return {
        success: false,
        provider: this.name,
        providerVersion: this.version,
        errorCode: "unreadable_document",
        message: "Không nhận diện được nội dung phiếu InBody từ ảnh chụp.",
        durationMs: Date.now() - startTime,
      };
    }

    let raw: RawExtractedMetrics;

    switch (scenario) {
      case "missing_water":
        raw = {
          weightKg: 68.5,
          skeletalMuscleMassKg: 31.0,
          bodyFatMassKg: 13.7,
          percentBodyFat: 20.0,
          totalBodyWaterLiters: null,
          confidence: {
            weight_kg: 0.98,
            skeletal_muscle_mass_kg: 0.95,
            body_fat_mass_kg: 0.95,
            percent_body_fat: 0.94,
          },
        };
        break;

      case "low_confidence":
        raw = {
          weightKg: 72.0,
          skeletalMuscleMassKg: 32.5,
          bodyFatMassKg: 14.4,
          percentBodyFat: 20.0,
          totalBodyWaterLiters: 42.0,
          confidence: {
            weight_kg: 0.92,
            skeletal_muscle_mass_kg: 0.91,
            body_fat_mass_kg: 0.81, // < 0.85
            percent_body_fat: 0.79, // < 0.85
            total_body_water_liters: 0.88,
          },
        };
        break;

      case "missing_fields":
        raw = {
          weightKg: 70.0,
          skeletalMuscleMassKg: null, // missing required field
          bodyFatMassKg: 14.0,
          percentBodyFat: 20.0,
        };
        break;

      case "invalid_values":
        raw = {
          weightKg: 25.0, // < 30
          skeletalMuscleMassKg: 30.0,
          bodyFatMassKg: 14.0,
          percentBodyFat: 20.0,
        };
        break;

      case "inconsistent_values":
        raw = {
          weightKg: 70.0,
          skeletalMuscleMassKg: 30.0,
          bodyFatMassKg: 14.0,
          percentBodyFat: 45.0, // calculated is 20%, diff is 25% > 2%
        };
        break;

      case "clean":
      default:
        raw = {
          weightKg: 70.0,
          skeletalMuscleMassKg: 32.0,
          bodyFatMassKg: 14.0,
          percentBodyFat: 20.0,
          totalBodyWaterLiters: 41.5,
          confidence: {
            weight_kg: 0.99,
            skeletal_muscle_mass_kg: 0.96,
            body_fat_mass_kg: 0.95,
            percent_body_fat: 0.97,
            total_body_water_liters: 0.94,
          },
        };
        break;
    }

    const validation = validateAndNormalizeOcrDraft(raw);
    const durationMs = Date.now() - startTime;

    if (!validation.success) {
      return {
        success: false,
        provider: this.name,
        providerVersion: this.version,
        errorCode: validation.errorCode,
        message: validation.message,
        fieldErrors: validation.fieldErrors,
        durationMs,
      };
    }

    return {
      success: true,
      provider: this.name,
      providerVersion: this.version,
      draft: validation.draft,
      durationMs,
    };
  }
}
