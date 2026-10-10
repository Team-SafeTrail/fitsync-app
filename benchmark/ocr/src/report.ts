import { mkdir, writeFile } from "node:fs/promises";
import { cpus } from "node:os";
import path from "node:path";
import type { BenchmarkAggregate } from "./types";
import { METRIC_KEYS } from "./types";
import { passesQualityGates } from "./metrics";

const labels = {
  weight_kg: "Weight",
  skeletal_muscle_mass_kg: "Skeletal muscle mass",
  body_fat_mass_kg: "Body fat mass",
  percent_body_fat: "Body-fat percentage",
  total_body_water_liters: "Total body water",
};

function fraction(value: { exact: number; eligible: number }) {
  return `${value.exact}/${value.eligible} (${((value.exact / value.eligible) * 100).toFixed(1)}%)`;
}

function wilson95(successes: number, total: number) {
  if (total === 0) return "N/A";
  const z = 1.959964;
  const proportion = successes / total;
  const denominator = 1 + (z * z) / total;
  const center = (proportion + (z * z) / (2 * total)) / denominator;
  const margin = (z / denominator) * Math.sqrt((proportion * (1 - proportion)) / total + (z * z) / (4 * total * total));
  return `${(Math.max(0, center - margin) * 100).toFixed(1)}–${(Math.min(1, center + margin) * 100).toFixed(1)}%`;
}

export function renderAggregateReport(
  aggregates: BenchmarkAggregate[],
  runDate: string,
  groundTruthReconciled: boolean,
) {
  const cpuModel = cpus()[0]?.model.trim() || "unknown CPU";
  const candidatePasses = aggregates.map((aggregate) => passesQualityGates(aggregate));
  const selectable = groundTruthReconciled && candidatePasses.some(Boolean);
  const decision = selectable
    ? `Candidate selected: ${aggregates[candidatePasses.findIndex(Boolean)].candidateId}.`
    : "No-provider decision: production OCR remains unavailable and manual entry remains the supported path.";
  const reasons: string[] = [];
  if (!groundTruthReconciled) reasons.push("Two-person independent ground-truth reconciliation is not yet signed off.");
  if (!candidatePasses.some(Boolean)) reasons.push("No measured candidate passed every locked-holdout quality threshold.");

  const sections = aggregates.map((aggregate) => {
    const fieldRows = METRIC_KEYS.map((key) => {
      const metric = aggregate.fieldMetrics[key];
      return `| ${labels[key]} | ${metric.returned}/${metric.eligible} (${((metric.returned / metric.eligible) * 100).toFixed(1)}%) | ${metric.exact}/${metric.eligible} (${((metric.exact / metric.eligible) * 100).toFixed(1)}%; 95% CI ${wilson95(metric.exact, metric.eligible)}) |`;
    }).join("\n");
    const recall = aggregate.flaggedErrorRecall.errors === 0
      ? "N/A (0 field errors observed)"
      : `${aggregate.flaggedErrorRecall.flagged}/${aggregate.flaggedErrorRecall.errors} (${((aggregate.flaggedErrorRecall.flagged / aggregate.flaggedErrorRecall.errors) * 100).toFixed(1)}%; 95% CI ${wilson95(aggregate.flaggedErrorRecall.flagged, aggregate.flaggedErrorRecall.errors)})`;
    const failures = Object.entries(aggregate.failures)
      .filter(([, count]) => count > 0)
      .map(([code, count]) => `${code}: ${count}`)
      .join(", ") || "none";
    const modelEvidence = aggregate.candidateId === "tesseract-lstm"
      ? "eng.traineddata SHA-256 7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2; OEM 1; PSM 11"
      : "CRAFT SHA-256 4a5efbfb48b4081100544e75e1e2b57f8de3d84f213004b14b85fd4b3748db17; english_g2 SHA-256 e2272681d9d67a04e2dff396b6e95077bc19001f8f6d3593c307b9852e1c29e8; CPU; paragraph=false";
    return `### ${aggregate.candidateId}

- Provider/version: ${aggregate.provider} ${aggregate.providerVersion}
- Model/configuration: ${modelEvidence}
- Confidence availability: engine token confidence available; not calibrated
- Holdout denominator: ${aggregate.denominatorReports} synthetic reports
- All required fields exact: ${fraction(aggregate.allRequiredExact)}; 95% CI ${wilson95(aggregate.allRequiredExact.exact, aggregate.allRequiredExact.eligible)}
- Optional field exact: ${fraction(aggregate.optionalFieldExact)}; 95% CI ${wilson95(aggregate.optionalFieldExact.exact, aggregate.optionalFieldExact.eligible)}
- Flagged-error recall: ${recall}
- Unflagged invalid values: ${aggregate.unflaggedInvalidCount}
- Recoverable failures: ${aggregate.recoverableFailures.recoverable}/${aggregate.recoverableFailures.failures}
- Failure codes: ${failures}
- Latency: p50 ${aggregate.latencyMs.p50} ms; p95 ${aggregate.latencyMs.p95} ms
- Estimated provider fee: US$0 per attempt; deployment infrastructure cost is not yet selected or estimated
- Estimated provider fee per all-required-exact report: ${aggregate.vendorCostUsdPerAllRequiredExact === null ? "N/A" : `US$${aggregate.vendorCostUsdPerAllRequiredExact.toFixed(2)}`}
- Verified record writes during benchmark: ${aggregate.verifiedRecordWrites}
- Quality thresholds: ${passesQualityGates(aggregate) ? "pass" : "fail"}

| Field | Coverage | Exact accuracy |
| --- | ---: | ---: |
${fieldRows}`;
  }).join("\n\n");

  return `# M4 InBody 270 OCR benchmark — redacted aggregate

- **Run date:** ${runDate}
- **Corpus:** 30 synthetic source reports; development 20, locked holdout 10
- **Holdout strata:** 3 clean, 3 typical handheld, 4 degraded but human-readable
- **Preprocessing:** orientation-grayscale-autocontrast-1200-v2
- **Region:** local-only; no report left the machine
- **Runtime:** Node ${process.version.replace(/^v/, "")}; Python 3.12.12; CPU-only on ${cpuModel}
- **Ground truth:** ${groundTruthReconciled ? "two-person reconciliation complete" : "synthetic render-source truth only; independent two-person reconciliation pending"}

This report contains aggregate counts only. Source images, manifests, per-sample output, ground-truth values, model files, and raw OCR text are Git-ignored and are not included.

## Decision

${decision}
${reasons.length > 0 ? `\nReasons:\n${reasons.map((reason) => `- ${reason}`).join("\n")}` : ""}

## Candidates

${sections}

## Safety and limitations

- The corpus is synthetic and specific to the InBody 270-style layout; it does not support a public accuracy claim.
- Candidate confidence is engine-reported token confidence, not a calibrated probability.
- Local timings include shared preprocessing and OCR inference on the recorded workstation, but exclude one-time model download and initialization.
- Both engines have zero incremental vendor/API fee; production hosting, maintenance, and compute cost remain unestimated.
- The harness calls the application's existing normalized OCR validation and never connects to Supabase or writes an \`inbody_records\` row.
- Manual entry and explicit PT confirmation remain mandatory.
`;
}

export async function writeReport(
  repositoryRoot: string,
  aggregates: BenchmarkAggregate[],
  runDate: string,
  groundTruthReconciled: boolean,
) {
  const reportDirectory = path.join(repositoryRoot, "docs/evidence");
  await mkdir(reportDirectory, { recursive: true });
  await writeFile(
    path.join(reportDirectory, `m4-ocr-benchmark-${runDate}.md`),
    renderAggregateReport(aggregates, runDate, groundTruthReconciled),
  );
  await writeFile(
    path.join(reportDirectory, `m4-ocr-benchmark-${runDate}.json`),
    `${JSON.stringify({ runDate, groundTruthReconciled, aggregates }, null, 2)}\n`,
  );
}
