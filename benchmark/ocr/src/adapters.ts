import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { createInterface } from "node:readline";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";
import {
  OCR_FAILURE_MESSAGES,
  type OcrConfidence,
  type OcrFailureCode,
  validateAndNormalizeOcrDraft,
} from "../../../apps/web/src/features/workspace/ocr-validation";
import type {
  BenchmarkAdapter,
  BenchmarkObservation,
  MetricKey,
  Token,
} from "./types";
import { METRIC_KEYS, REQUIRED_METRIC_KEYS } from "./types";
import { parseMetricTokens } from "./parser";

const execFileAsync = promisify(execFile);
const PYTHON = process.env.FITSYNC_OCR_PYTHON ?? "python3";
const LOW_CONFIDENCE = 0.85;

async function preprocess(bytes: Uint8Array) {
  return sharp(bytes)
    .rotate()
    .flatten({ background: "white" })
    .grayscale()
    .normalize()
    .resize({ width: 1200, withoutEnlargement: false })
    .png()
    .toBuffer();
}

function confidenceShape(values: Partial<Record<MetricKey, number | null>>): OcrConfidence {
  return {
    weight_kg: values.weight_kg ?? null,
    skeletal_muscle_mass_kg: values.skeletal_muscle_mass_kg ?? null,
    body_fat_mass_kg: values.body_fat_mass_kg ?? null,
    percent_body_fat: values.percent_body_fat ?? null,
    total_body_water_liters: values.total_body_water_liters ?? null,
  };
}

const validationFieldMap: Record<string, MetricKey> = {
  weightKg: "weight_kg",
  skeletalMuscleMassKg: "skeletal_muscle_mass_kg",
  bodyFatMassKg: "body_fat_mass_kg",
  percentBodyFat: "percent_body_fat",
  totalBodyWaterLiters: "total_body_water_liters",
};

function normalizeObservation(
  sampleId: string,
  candidateId: string,
  provider: string,
  providerVersion: string,
  durationMs: number,
  tokens: Token[],
): BenchmarkObservation {
  const parsed = parseMetricTokens(tokens);
  const validation = validateAndNormalizeOcrDraft(parsed.raw);
  const confidence = confidenceShape(parsed.raw.confidence ?? {});
  const flagged = new Set<MetricKey>();
  for (const key of METRIC_KEYS) {
    const score = confidence[key];
    if (score !== null && score < LOW_CONFIDENCE) flagged.add(key);
  }
  for (const key of REQUIRED_METRIC_KEYS) {
    if (parsed.observed[key] === undefined || parsed.observed[key] === null) flagged.add(key);
  }

  if (!validation.success) {
    for (const key of Object.keys(validation.fieldErrors)) {
      const metricKey = validationFieldMap[key];
      if (metricKey) flagged.add(metricKey);
    }
    for (const key of METRIC_KEYS) flagged.add(key);
    return {
      sampleId,
      candidateId,
      adapterResult: {
        success: false,
        provider,
        providerVersion,
        errorCode: validation.errorCode,
        message: OCR_FAILURE_MESSAGES[validation.errorCode],
        fieldErrors: validation.fieldErrors,
        durationMs,
      },
      observedMetrics: parsed.observed,
      confidence,
      flaggedFields: [...flagged],
      recoverable: true,
      verifiedRecordWrites: 0,
    };
  }

  return {
    sampleId,
    candidateId,
    adapterResult: {
      success: true,
      provider,
      providerVersion,
      draft: validation.draft,
      durationMs,
    },
    observedMetrics: parsed.observed,
    confidence,
    flaggedFields: [...flagged],
    recoverable: true,
    verifiedRecordWrites: 0,
  };
}

function failedObservation(
  sampleId: string,
  candidateId: string,
  provider: string,
  providerVersion: string,
  durationMs: number,
  errorCode: OcrFailureCode,
): BenchmarkObservation {
  return {
    sampleId,
    candidateId,
    adapterResult: {
      success: false,
      provider,
      providerVersion,
      errorCode,
      message: OCR_FAILURE_MESSAGES[errorCode],
      durationMs,
    },
    observedMetrics: {},
    confidence: confidenceShape({}),
    flaggedFields: [...METRIC_KEYS],
    recoverable: true,
    verifiedRecordWrites: 0,
  };
}

export class TesseractAdapter implements BenchmarkAdapter {
  readonly candidateId = "tesseract-lstm";
  readonly name = "Tesseract OCR";
  readonly version = "5.5.3";
  readonly available = true;

  async extract(imageBytes: Uint8Array, mimeType: string) {
    return (await this.extractForBenchmark("application", imageBytes, mimeType)).adapterResult;
  }

  async extractForBenchmark(sampleId: string, imageBytes: Uint8Array, _mimeType: string) {
    const startedAt = performance.now();
    const directory = await mkdtemp(path.join(tmpdir(), "fitsync-tesseract-"));
    try {
      const input = path.join(directory, "input.png");
      await writeFile(input, await preprocess(imageBytes));
      const { stdout } = await execFileAsync(
        "tesseract",
        [input, "stdout", "-l", "eng", "--oem", "1", "--psm", "11", "tsv"],
        { maxBuffer: 8 * 1024 * 1024, timeout: 15_000 },
      );
      const tokens = parseTesseractTsv(stdout);
      return normalizeObservation(
        sampleId,
        this.candidateId,
        this.name,
        this.version,
        Math.round(performance.now() - startedAt),
        tokens,
      );
    } catch (error) {
      const code = (error as { killed?: boolean }).killed ? "provider_timeout" : "provider_unavailable";
      return failedObservation(
        sampleId,
        this.candidateId,
        this.name,
        this.version,
        Math.round(performance.now() - startedAt),
        code,
      );
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  }
}

export function parseTesseractTsv(tsv: string): Token[] {
  return tsv
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => line.split("\t"))
    .filter((columns) => columns.length >= 12 && columns[11].trim().length > 0)
    .map((columns) => ({
      text: columns[11],
      confidence: Number(columns[10]) >= 0 ? Number(columns[10]) / 100 : null,
      x: Number(columns[6]),
      y: Number(columns[7]),
      width: Number(columns[8]),
      height: Number(columns[9]),
      lineId: `${columns[2]}:${columns[3]}:${columns[4]}`,
    }));
}

type WorkerResponse = { id?: string; ready?: boolean; tokens?: Token[]; error?: string };

export class EasyOcrAdapter implements BenchmarkAdapter {
  readonly candidateId = "easyocr-english-g2";
  readonly name = "EasyOCR";
  readonly version = "1.7.2/english_g2+craft";
  readonly available = true;
  private readonly worker: ChildProcessWithoutNullStreams;
  private readonly ready: Promise<void>;
  private readonly pending = new Map<string, { resolve: (tokens: Token[]) => void; reject: (error: Error) => void }>();
  private readonly tempRoot: string;

  constructor(repositoryRoot: string, privateRoot: string) {
    this.tempRoot = path.join(privateRoot, "tmp-easyocr");
    this.worker = spawn(PYTHON, [path.join(repositoryRoot, "benchmark/ocr/src/easyocr_worker.py")], {
      env: {
        ...process.env,
        FITSYNC_EASYOCR_MODEL_DIR: path.join(privateRoot, "models/easyocr"),
      },
      stdio: ["pipe", "pipe", "pipe"],
    });
    const output = createInterface({ input: this.worker.stdout });
    let readyResolve!: () => void;
    let readyReject!: (error: Error) => void;
    this.ready = new Promise<void>((resolve, reject) => {
      readyResolve = resolve;
      readyReject = reject;
    });
    output.on("line", (line) => {
      try {
        const response = JSON.parse(line) as WorkerResponse;
        if (response.ready) {
          readyResolve();
          return;
        }
        if (!response.id) return;
        const request = this.pending.get(response.id);
        if (!request) return;
        this.pending.delete(response.id);
        if (response.error) request.reject(new Error(response.error));
        else request.resolve(response.tokens ?? []);
      } catch {
        readyReject(new Error("EasyOCR worker returned an invalid control response."));
      }
    });
    this.worker.once("error", readyReject);
    this.worker.once("exit", (code) => {
      const error = new Error(`EasyOCR worker exited with code ${code ?? "unknown"}.`);
      readyReject(error);
      for (const request of this.pending.values()) request.reject(error);
      this.pending.clear();
    });
  }

  async extract(imageBytes: Uint8Array, mimeType: string) {
    return (await this.extractForBenchmark("application", imageBytes, mimeType)).adapterResult;
  }

  async extractForBenchmark(sampleId: string, imageBytes: Uint8Array, _mimeType: string) {
    await mkdir(this.tempRoot, { recursive: true });
    try {
      await Promise.race([
        this.ready,
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("EasyOCR startup timeout.")), 300_000)),
      ]);
    } catch {
      return failedObservation(sampleId, this.candidateId, this.name, this.version, 0, "provider_unavailable");
    }
    const startedAt = performance.now();
    const requestId = `${sampleId}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const input = path.join(this.tempRoot, `${requestId}.png`);
    try {
      await writeFile(input, await preprocess(imageBytes));
      const tokens = await Promise.race([
        new Promise<Token[]>((resolve, reject) => {
          this.pending.set(requestId, { resolve, reject });
          this.worker.stdin.write(`${JSON.stringify({ id: requestId, path: input })}\n`);
        }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("EasyOCR timeout.")), 15_000)),
      ]);
      return normalizeObservation(
        sampleId,
        this.candidateId,
        this.name,
        this.version,
        Math.round(performance.now() - startedAt),
        tokens,
      );
    } catch (error) {
      this.pending.delete(requestId);
      const code = String(error).includes("timeout") ? "provider_timeout" : "provider_unavailable";
      return failedObservation(
        sampleId,
        this.candidateId,
        this.name,
        this.version,
        Math.round(performance.now() - startedAt),
        code,
      );
    } finally {
      await rm(input, { force: true });
    }
  }

  async dispose() {
    this.worker.stdin.end();
    this.worker.kill("SIGTERM");
  }
}
