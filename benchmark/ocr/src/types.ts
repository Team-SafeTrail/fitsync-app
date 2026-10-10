import type {
  OcrAdapterResult,
  OcrProviderAdapter,
} from "../../../apps/web/src/features/workspace/ocr-adapter";
import type {
  OcrConfidence,
  OcrFailureCode,
  OcrMetrics,
} from "../../../apps/web/src/features/workspace/ocr-validation";

export const METRIC_KEYS = [
  "weight_kg",
  "skeletal_muscle_mass_kg",
  "body_fat_mass_kg",
  "percent_body_fat",
  "total_body_water_liters",
] as const;

export const REQUIRED_METRIC_KEYS = METRIC_KEYS.slice(0, 4);

export type MetricKey = (typeof METRIC_KEYS)[number];
export type OptionalMetrics = Partial<Record<MetricKey, number | null>>;
export type Split = "development" | "holdout";
export type Stratum = "clean" | "typical_handheld" | "degraded_human_readable";

export type ManifestEntry = {
  sampleId: string;
  sourceGroupId: string;
  split: Split;
  stratum: Stratum;
  provenance: "synthetic";
  imagePath: string;
  imageSha256: string;
  transformVersion: string;
};

export type GroundTruthEntry = {
  sampleId: string;
  metrics: OcrMetrics;
};

export type Token = {
  text: string;
  confidence: number | null;
  x: number;
  y: number;
  width: number;
  height: number;
  lineId?: string;
};

export type BenchmarkObservation = {
  sampleId: string;
  candidateId: string;
  adapterResult: OcrAdapterResult;
  observedMetrics: OptionalMetrics;
  confidence: OcrConfidence;
  flaggedFields: MetricKey[];
  recoverable: true;
  verifiedRecordWrites: 0;
};

export interface BenchmarkAdapter extends OcrProviderAdapter {
  readonly candidateId: string;
  extractForBenchmark(
    sampleId: string,
    imageBytes: Uint8Array,
    mimeType: string,
  ): Promise<BenchmarkObservation>;
  dispose?(): Promise<void>;
}

export type FieldMetric = {
  eligible: number;
  returned: number;
  exact: number;
};

export type BenchmarkAggregate = {
  candidateId: string;
  provider: string;
  providerVersion: string;
  denominatorReports: number;
  fieldMetrics: Record<MetricKey, FieldMetric>;
  allRequiredExact: { exact: number; eligible: number };
  optionalFieldExact: { exact: number; eligible: number };
  flaggedErrorRecall: { flagged: number; errors: number };
  unflaggedInvalidCount: number;
  failures: Record<OcrFailureCode, number>;
  recoverableFailures: { recoverable: number; failures: number };
  latencyMs: { p50: number; p95: number };
  verifiedRecordWrites: number;
  vendorCostUsdPerAttempt: number;
  vendorCostUsdPerAllRequiredExact: number | null;
};
