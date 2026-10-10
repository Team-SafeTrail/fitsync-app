import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { EasyOcrAdapter, TesseractAdapter } from "./adapters";
import { generateCorpus, loadConfig, readCorpus } from "./corpus";
import { calculateAggregate } from "./metrics";
import { writeReport } from "./report";
import type { BenchmarkAdapter, BenchmarkAggregate, BenchmarkObservation, GroundTruthEntry, Split } from "./types";
import { reconcileGroundTruth, validateCorpus } from "./validation";

const repositoryRoot = path.resolve(process.cwd());
const privateRoot = path.join(repositoryRoot, "benchmark/ocr/private");

async function fileExists(file: string) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function reconciliationStatus(renderSource: GroundTruthEntry[]) {
  const reviewAPath = path.join(privateRoot, "ground-truth-review-a.json");
  const reviewBPath = path.join(privateRoot, "ground-truth-review-b.json");
  if (!(await fileExists(reviewAPath)) || !(await fileExists(reviewBPath))) return false;
  const reviewA = JSON.parse(await readFile(reviewAPath, "utf8")) as GroundTruthEntry[];
  const reviewB = JSON.parse(await readFile(reviewBPath, "utf8")) as GroundTruthEntry[];
  reconcileGroundTruth(reviewA, reviewB, renderSource);
  return true;
}

async function validate() {
  const { manifest, groundTruth } = await readCorpus(privateRoot);
  const counts = await validateCorpus(privateRoot, manifest, groundTruth);
  const reconciled = await reconciliationStatus(groundTruth);
  process.stdout.write(
    `Corpus valid: ${manifest.length} synthetic reports; development ${counts.splitCounts.development}; holdout ${counts.splitCounts.holdout}; independent reconciliation ${reconciled ? "complete" : "pending"}.\n`,
  );
}

async function runCandidate(adapter: BenchmarkAdapter, split: Split) {
  const { manifest } = await readCorpus(privateRoot);
  const selected = manifest.filter((entry) => entry.split === split);
  const observations: BenchmarkObservation[] = [];
  try {
    for (const [index, entry] of selected.entries()) {
      const bytes = await readFile(path.join(privateRoot, entry.imagePath));
      observations.push(await adapter.extractForBenchmark(entry.sampleId, bytes, "image/jpeg"));
      process.stdout.write(`${adapter.candidateId}: ${index + 1}/${selected.length}\r`);
    }
    process.stdout.write(`${adapter.candidateId}: ${selected.length}/${selected.length}\n`);
  } finally {
    await adapter.dispose?.();
  }
  const resultDirectory = path.join(privateRoot, "results");
  await mkdir(resultDirectory, { recursive: true });
  await writeFile(
    path.join(resultDirectory, `${split}-${adapter.candidateId}.json`),
    `${JSON.stringify(observations, null, 2)}\n`,
  );
}

async function loadAggregate(candidateId: string, groundTruth: GroundTruthEntry[]) {
  const observations = JSON.parse(
    await readFile(path.join(privateRoot, "results", `holdout-${candidateId}.json`), "utf8"),
  ) as BenchmarkObservation[];
  const holdoutIds = new Set(observations.map((entry) => entry.sampleId));
  return calculateAggregate(observations, groundTruth.filter((entry) => holdoutIds.has(entry.sampleId)));
}

async function run() {
  const args = new Set(process.argv.slice(3));
  const split: Split = args.has("--locked-holdout") ? "holdout" : "development";
  if (split === "holdout" && !args.has("--accept-unreconciled-synthetic-truth")) {
    const { groundTruth } = await readCorpus(privateRoot);
    if (!(await reconciliationStatus(groundTruth))) {
      throw new Error(
        "Locked holdout requires two completed private review files. Use --accept-unreconciled-synthetic-truth only to produce a non-selectable no-provider report.",
      );
    }
  }
  await runCandidate(new TesseractAdapter(), split);
  await runCandidate(new EasyOcrAdapter(repositoryRoot, privateRoot), split);
}

async function report() {
  const { groundTruth } = await readCorpus(privateRoot);
  const reconciled = await reconciliationStatus(groundTruth);
  const aggregates: BenchmarkAggregate[] = await Promise.all([
    loadAggregate("tesseract-lstm", groundTruth),
    loadAggregate("easyocr-english-g2", groundTruth),
  ]);
  const runDate = new Date().toISOString().slice(0, 10);
  await writeReport(repositoryRoot, aggregates, runDate, reconciled);
  process.stdout.write(`Redacted aggregate report written for ${aggregates.length} candidates; raw values were not printed.\n`);
}

async function main() {
  const command = process.argv[2];
  if (command === "generate") {
    await mkdir(privateRoot, { recursive: true });
    await generateCorpus(privateRoot, await loadConfig(repositoryRoot));
    await validate();
    return;
  }
  if (command === "validate") return validate();
  if (command === "run") return run();
  if (command === "report") return report();
  throw new Error("Usage: cli.ts <generate|validate|run|report>");
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Benchmark command failed."}\n`);
  process.exitCode = 1;
});
