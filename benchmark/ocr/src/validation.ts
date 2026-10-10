import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { validateAndNormalizeOcrDraft } from "../../../apps/web/src/features/workspace/ocr-validation";
import type { GroundTruthEntry, ManifestEntry, MetricKey } from "./types";
import { METRIC_KEYS, REQUIRED_METRIC_KEYS } from "./types";

const EXPECTED_STRATUM_COUNTS = {
  clean: 10,
  typical_handheld: 10,
  degraded_human_readable: 10,
};

export async function validateCorpus(
  root: string,
  manifest: ManifestEntry[],
  groundTruth: GroundTruthEntry[],
) {
  const errors: string[] = [];
  if (manifest.length !== 30) errors.push(`Expected 30 manifest entries, received ${manifest.length}.`);
  const splitCounts = { development: 0, holdout: 0 };
  const stratumCounts = { ...EXPECTED_STRATUM_COUNTS, clean: 0, typical_handheld: 0, degraded_human_readable: 0 };
  const sourceSplits = new Map<string, Set<string>>();
  const sampleIds = new Set<string>();

  for (const entry of manifest) {
    if (!/^syn-\d{3}$/.test(entry.sampleId) || !/^syn-\d{3}$/.test(entry.sourceGroupId)) {
      errors.push(`Invalid pseudonymous identifiers for ${entry.sampleId}.`);
    }
    if (!(["development", "holdout"] as const).includes(entry.split)) {
      errors.push(`Invalid split for ${entry.sampleId}.`);
      continue;
    }
    if (!(["clean", "typical_handheld", "degraded_human_readable"] as const).includes(entry.stratum)) {
      errors.push(`Invalid stratum for ${entry.sampleId}.`);
      continue;
    }
    if (entry.provenance !== "synthetic") errors.push(`Non-synthetic provenance for ${entry.sampleId}.`);
    if (!/^images\/syn-\d{3}\.jpg$/.test(entry.imagePath)) {
      errors.push(`Invalid private image path for ${entry.sampleId}.`);
      continue;
    }
    if (!/^[a-f0-9]{64}$/.test(entry.imageSha256)) errors.push(`Invalid image digest for ${entry.sampleId}.`);
    if (sampleIds.has(entry.sampleId)) errors.push(`Duplicate sample ID ${entry.sampleId}.`);
    sampleIds.add(entry.sampleId);
    splitCounts[entry.split] += 1;
    stratumCounts[entry.stratum] += 1;
    const splits = sourceSplits.get(entry.sourceGroupId) ?? new Set<string>();
    splits.add(entry.split);
    sourceSplits.set(entry.sourceGroupId, splits);
    const bytes = await readFile(path.join(root, entry.imagePath));
    const digest = createHash("sha256").update(bytes).digest("hex");
    if (digest !== entry.imageSha256) errors.push(`Image digest mismatch for ${entry.sampleId}.`);
  }

  if (splitCounts.development !== 20 || splitCounts.holdout !== 10) {
    errors.push(`Expected a 20/10 split, received ${splitCounts.development}/${splitCounts.holdout}.`);
  }
  for (const [stratum, expected] of Object.entries(EXPECTED_STRATUM_COUNTS)) {
    if (stratumCounts[stratum as keyof typeof stratumCounts] !== expected) {
      errors.push(`Expected ${expected} ${stratum} samples.`);
    }
  }
  for (const [sourceGroupId, splits] of sourceSplits) {
    if (splits.size > 1) errors.push(`Source group ${sourceGroupId} crosses locked splits.`);
  }

  const truthBySample = new Map(groundTruth.map((entry) => [entry.sampleId, entry]));
  for (const entry of manifest) {
    const truth = truthBySample.get(entry.sampleId);
    if (!truth) {
      errors.push(`Missing ground truth for ${entry.sampleId}.`);
      continue;
    }
    for (const key of REQUIRED_METRIC_KEYS) {
      if (typeof truth.metrics[key] !== "number") errors.push(`Missing required ${key} for ${entry.sampleId}.`);
    }
    const domainResult = validateAndNormalizeOcrDraft({
      weightKg: truth.metrics.weight_kg,
      skeletalMuscleMassKg: truth.metrics.skeletal_muscle_mass_kg,
      bodyFatMassKg: truth.metrics.body_fat_mass_kg,
      percentBodyFat: truth.metrics.percent_body_fat,
      totalBodyWaterLiters: truth.metrics.total_body_water_liters,
    });
    if (!domainResult.success) errors.push(`Ground truth violates application domain rules for ${entry.sampleId}.`);
  }

  if (errors.length > 0) throw new Error(errors.join("\n"));
  return { splitCounts, stratumCounts };
}

export function reconcileGroundTruth(
  reviewA: GroundTruthEntry[],
  reviewB: GroundTruthEntry[],
  renderSource: GroundTruthEntry[],
) {
  const errors: string[] = [];
  const a = new Map(reviewA.map((entry) => [entry.sampleId, entry.metrics]));
  const b = new Map(reviewB.map((entry) => [entry.sampleId, entry.metrics]));
  for (const source of renderSource) {
    for (const key of METRIC_KEYS) {
      const first = a.get(source.sampleId)?.[key as MetricKey];
      const second = b.get(source.sampleId)?.[key as MetricKey];
      if (first !== second || first !== source.metrics[key]) {
        errors.push(`${source.sampleId}/${key} is not independently reconciled.`);
      }
    }
  }
  if (errors.length > 0) throw new Error(errors.join("\n"));
  return renderSource;
}
