import type {
  BenchmarkAggregate,
  BenchmarkObservation,
  FieldMetric,
  GroundTruthEntry,
  MetricKey,
} from "./types";
import { METRIC_KEYS, REQUIRED_METRIC_KEYS } from "./types";

function percentile(values: number[], percentileValue: number) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.ceil((percentileValue / 100) * sorted.length) - 1;
  return sorted[Math.max(0, rank)];
}

function exactValue(actual: number | null | undefined, expected: number | null) {
  return actual === expected;
}

export function calculateAggregate(
  observations: BenchmarkObservation[],
  groundTruth: GroundTruthEntry[],
): BenchmarkAggregate {
  if (observations.length === 0) throw new Error("At least one observation is required.");
  const truthBySample = new Map(groundTruth.map((entry) => [entry.sampleId, entry.metrics]));
  const fieldMetrics = Object.fromEntries(
    METRIC_KEYS.map((key) => [key, { eligible: 0, returned: 0, exact: 0 } satisfies FieldMetric]),
  ) as Record<MetricKey, FieldMetric>;
  let allRequiredExact = 0;
  let optionalExact = 0;
  let flaggedErrors = 0;
  let totalErrors = 0;
  let unflaggedInvalidCount = 0;
  let recoverableFailures = 0;
  let failureCount = 0;
  let verifiedRecordWrites = 0;
  const failures: BenchmarkAggregate["failures"] = {
    unsupported_type: 0,
    file_too_large: 0,
    signature_mismatch: 0,
    provider_timeout: 0,
    provider_unavailable: 0,
    unreadable_document: 0,
    missing_fields: 0,
    invalid_values: 0,
    inconsistent_values: 0,
    processing_error: 0,
  };

  for (const observation of observations) {
    const expected = truthBySample.get(observation.sampleId);
    if (!expected) throw new Error(`Missing truth for ${observation.sampleId}.`);
    let requiredExact = true;
    for (const key of METRIC_KEYS) {
      const field = fieldMetrics[key];
      field.eligible += 1;
      const actual = observation.observedMetrics[key];
      if (actual !== undefined) field.returned += 1;
      const exact = exactValue(actual, expected[key]);
      if (exact) field.exact += 1;
      if ((REQUIRED_METRIC_KEYS as readonly MetricKey[]).includes(key) && !exact) requiredExact = false;
      if (!exact) {
        totalErrors += 1;
        if (observation.flaggedFields.includes(key)) flaggedErrors += 1;
      }
    }
    if (requiredExact) allRequiredExact += 1;
    if (exactValue(observation.observedMetrics.total_body_water_liters, expected.total_body_water_liters)) {
      optionalExact += 1;
    }
    if (!observation.adapterResult.success) {
      failureCount += 1;
      failures[observation.adapterResult.errorCode] += 1;
      if (observation.recoverable) recoverableFailures += 1;
      if (
        ["invalid_values", "inconsistent_values"].includes(observation.adapterResult.errorCode) &&
        observation.flaggedFields.length === 0
      ) {
        unflaggedInvalidCount += 1;
      }
    }
    verifiedRecordWrites += observation.verifiedRecordWrites;
  }

  const first = observations[0].adapterResult;
  const exactReports = allRequiredExact;
  return {
    candidateId: observations[0].candidateId,
    provider: first.provider,
    providerVersion: first.providerVersion,
    denominatorReports: observations.length,
    fieldMetrics,
    allRequiredExact: { exact: allRequiredExact, eligible: observations.length },
    optionalFieldExact: { exact: optionalExact, eligible: observations.length },
    flaggedErrorRecall: { flagged: flaggedErrors, errors: totalErrors },
    unflaggedInvalidCount,
    failures,
    recoverableFailures: { recoverable: recoverableFailures, failures: failureCount },
    latencyMs: {
      p50: percentile(observations.map((entry) => entry.adapterResult.durationMs), 50),
      p95: percentile(observations.map((entry) => entry.adapterResult.durationMs), 95),
    },
    verifiedRecordWrites,
    vendorCostUsdPerAttempt: 0,
    vendorCostUsdPerAllRequiredExact: exactReports > 0 ? 0 : null,
  };
}

export function passesQualityGates(aggregate: BenchmarkAggregate) {
  const requiredFieldsPass = REQUIRED_METRIC_KEYS.every((key) => {
    const metric = aggregate.fieldMetrics[key];
    return metric.exact / metric.eligible >= 0.85;
  });
  const flaggedRecall = aggregate.flaggedErrorRecall.errors === 0
    ? 1
    : aggregate.flaggedErrorRecall.flagged / aggregate.flaggedErrorRecall.errors;
  return (
    aggregate.allRequiredExact.exact / aggregate.allRequiredExact.eligible >= 0.9 &&
    requiredFieldsPass &&
    flaggedRecall >= 0.95 &&
    aggregate.unflaggedInvalidCount === 0 &&
    aggregate.latencyMs.p95 <= 15_000 &&
    aggregate.verifiedRecordWrites === 0
  );
}
