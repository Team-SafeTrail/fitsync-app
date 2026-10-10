import { describe, expect, it } from "vitest";
import type { OcrAdapterResult } from "../../../apps/web/src/features/workspace/ocr-adapter";
import type { OcrMetrics } from "../../../apps/web/src/features/workspace/ocr-validation";
import { calculateAggregate, passesQualityGates } from "../src/metrics";
import type { BenchmarkObservation, GroundTruthEntry } from "../src/types";

const metrics: OcrMetrics = {
  weight_kg: 70,
  skeletal_muscle_mass_kg: 31,
  body_fat_mass_kg: 14,
  percent_body_fat: 20,
  total_body_water_liters: 41,
};

function successResult(durationMs: number): OcrAdapterResult {
  return {
    success: true,
    provider: "candidate",
    providerVersion: "1",
    durationMs,
    draft: { metrics, confidence: {
      weight_kg: 0.99,
      skeletal_muscle_mass_kg: 0.99,
      body_fat_mass_kg: 0.99,
      percent_body_fat: 0.99,
      total_body_water_liters: 0.99,
    }, warnings: [] },
  };
}

function observation(sampleId: string, overrides: Partial<BenchmarkObservation> = {}): BenchmarkObservation {
  return {
    sampleId,
    candidateId: "candidate",
    adapterResult: successResult(100),
    observedMetrics: metrics,
    confidence: {
      weight_kg: 0.99,
      skeletal_muscle_mass_kg: 0.99,
      body_fat_mass_kg: 0.99,
      percent_body_fat: 0.99,
      total_body_water_liters: 0.99,
    },
    flaggedFields: [],
    recoverable: true,
    verifiedRecordWrites: 0,
    ...overrides,
  };
}

describe("benchmark aggregate calculations", () => {
  it("passes exact reports with bounded latency and no writes", () => {
    const truth: GroundTruthEntry[] = Array.from({ length: 10 }, (_, index) => ({
      sampleId: `s${index}`,
      metrics,
    }));
    const aggregate = calculateAggregate(truth.map((entry, index) => observation(entry.sampleId, {
      adapterResult: successResult(100 + index * 10),
    })), truth);

    expect(aggregate.allRequiredExact).toEqual({ exact: 10, eligible: 10 });
    expect(aggregate.fieldMetrics.weight_kg).toEqual({ eligible: 10, returned: 10, exact: 10 });
    expect(aggregate.latencyMs).toEqual({ p50: 140, p95: 190 });
    expect(passesQualityGates(aggregate)).toBe(true);
  });

  it("counts an incorrect flagged field and recoverable bounded failure", () => {
    const truth = [{ sampleId: "s1", metrics }];
    const failed: OcrAdapterResult = {
      success: false,
      provider: "candidate",
      providerVersion: "1",
      errorCode: "inconsistent_values",
      message: "bounded",
      durationMs: 250,
    };
    const aggregate = calculateAggregate([
      observation("s1", {
        adapterResult: failed,
        observedMetrics: { ...metrics, percent_body_fat: 25 },
        flaggedFields: ["percent_body_fat"],
      }),
    ], truth);

    expect(aggregate.flaggedErrorRecall).toEqual({ flagged: 1, errors: 1 });
    expect(aggregate.recoverableFailures).toEqual({ recoverable: 1, failures: 1 });
    expect(aggregate.failures.inconsistent_values).toBe(1);
  });

  it("requires optional-field errors to be flagged in recall", () => {
    const truth = [{ sampleId: "s1", metrics }];
    const aggregate = calculateAggregate([
      observation("s1", {
        observedMetrics: { ...metrics, total_body_water_liters: undefined },
        flaggedFields: [],
      }),
    ], truth);

    expect(aggregate.flaggedErrorRecall).toEqual({ flagged: 0, errors: 1 });
    expect(passesQualityGates(aggregate)).toBe(false);
  });
});
