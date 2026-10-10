import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { OcrMetrics } from "../../../apps/web/src/features/workspace/ocr-validation";
import type { GroundTruthEntry, ManifestEntry, Split, Stratum } from "./types";

type Config = {
  corpusVersion: string;
  preprocessingVersion: string;
  reportCount: number;
  splits: { development: number[]; holdout: number[] };
};

const WIDTH = 1200;
const HEIGHT = 1600;

function sampleId(index: number) {
  return `syn-${String(index).padStart(3, "0")}`;
}

function stratumFor(index: number): Stratum {
  if (index <= 10) return "clean";
  if (index <= 20) return "typical_handheld";
  return "degraded_human_readable";
}

function splitFor(index: number, config: Config): Split {
  return config.splits.holdout.includes(index) ? "holdout" : "development";
}

function metricsFor(index: number): OcrMetrics {
  const weight = Number((54 + index * 1.37).toFixed(1));
  const bodyFatMass = Number((weight * (0.12 + (index % 9) * 0.012)).toFixed(1));
  const percentBodyFat = Number(((bodyFatMass / weight) * 100).toFixed(1));
  const skeletalMuscleMass = Number((weight * (0.39 + (index % 5) * 0.012)).toFixed(1));
  const totalBodyWater = index % 6 === 0 ? null : Number((weight * (0.55 + (index % 3) * 0.01)).toFixed(1));

  return {
    weight_kg: weight,
    skeletal_muscle_mass_kg: skeletalMuscleMass,
    body_fat_mass_kg: bodyFatMass,
    percent_body_fat: percentBodyFat,
    total_body_water_liters: totalBodyWater,
  };
}

function renderSvg(id: string, metrics: OcrMetrics) {
  const rows: Array<[string, string]> = [
    ["Weight (kg)", metrics.weight_kg.toFixed(1)],
    ["Skeletal Muscle Mass (kg)", metrics.skeletal_muscle_mass_kg.toFixed(1)],
    ["Body Fat Mass (kg)", metrics.body_fat_mass_kg.toFixed(1)],
    ["Percent Body Fat (%)", metrics.percent_body_fat.toFixed(1)],
    ["Total Body Water (L)", metrics.total_body_water_liters?.toFixed(1) ?? "Not measured"],
  ];
  const rowMarkup = rows
    .map(([label, value], row) => {
      const y = 620 + row * 145;
      return `<rect x="115" y="${y - 65}" width="970" height="105" fill="#fff" stroke="#808080" stroke-width="2"/>
        <text x="155" y="${y}" font-size="38" font-family="DejaVu Sans">${label}</text>
        <text x="930" y="${y}" text-anchor="end" font-size="44" font-weight="700" font-family="DejaVu Sans">${value}</text>`;
    })
    .join("\n");

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f8f8f5"/>
    <rect x="70" y="60" width="1060" height="1480" rx="12" fill="#fff" stroke="#202020" stroke-width="3"/>
    <text x="600" y="180" text-anchor="middle" font-size="78" font-weight="700" font-family="DejaVu Sans">InBody 270</text>
    <text x="600" y="245" text-anchor="middle" font-size="28" font-family="DejaVu Sans">Synthetic Body Composition Result</text>
    <line x1="115" y1="305" x2="1085" y2="305" stroke="#202020" stroke-width="3"/>
    <text x="115" y="370" font-size="26" font-family="DejaVu Sans">Sample</text>
    <text x="1085" y="370" text-anchor="end" font-size="26" font-family="DejaVu Sans">${id}</text>
    <text x="115" y="475" font-size="34" font-weight="700" font-family="DejaVu Sans">Body Composition Analysis</text>
    ${rowMarkup}
    <text x="600" y="1450" text-anchor="middle" font-size="22" font-family="DejaVu Sans" fill="#555">SYNTHETIC TEST REPORT — NOT A MEDICAL RECORD</text>
  </svg>`;
}

async function transformImage(svg: string, stratum: Stratum, index: number) {
  let pipeline = sharp(Buffer.from(svg)).flatten({ background: "#ecebe6" });
  if (stratum === "typical_handheld") {
    pipeline = pipeline
      .rotate(index % 2 === 0 ? 2.2 : -2.8, { background: "#d8d3c8" })
      .affine([[1, (index % 3 - 1) * 0.018], [0.008, 1]], { background: "#d8d3c8" })
      .modulate({ brightness: 0.94 + (index % 4) * 0.025 });
  }
  if (stratum === "degraded_human_readable") {
    const shadow = Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g"><stop offset="0" stop-color="#000" stop-opacity="0.20"/><stop offset="0.48" stop-color="#000" stop-opacity="0.03"/><stop offset="1" stop-color="#fff" stop-opacity="0.08"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`);
    pipeline = pipeline
      .rotate(index % 2 === 0 ? 4.2 : -3.7, { background: "#c9c3b7" })
      .affine([[1, (index % 3 - 1) * 0.03], [0.015, 1]], { background: "#c9c3b7" })
      .resize(WIDTH, HEIGHT, { fit: "cover" })
      .blur(0.7 + (index % 3) * 0.25)
      .modulate({ brightness: 0.82 + (index % 4) * 0.03, saturation: 0.75 })
      .composite([{ input: shadow, blend: "multiply" }]);
  }
  return pipeline.jpeg({ quality: stratum === "degraded_human_readable" ? 58 : 88 }).toBuffer();
}

export async function generateCorpus(root: string, config: Config) {
  const imagesDirectory = path.join(root, "images");
  await mkdir(imagesDirectory, { recursive: true });
  const manifest: ManifestEntry[] = [];
  const groundTruth: GroundTruthEntry[] = [];

  for (let index = 1; index <= config.reportCount; index += 1) {
    const id = sampleId(index);
    const metrics = metricsFor(index);
    const stratum = stratumFor(index);
    const bytes = await transformImage(renderSvg(id, metrics), stratum, index);
    const relativeImagePath = `images/${id}.jpg`;
    await writeFile(path.join(root, relativeImagePath), bytes);
    manifest.push({
      sampleId: id,
      sourceGroupId: id,
      split: splitFor(index, config),
      stratum,
      provenance: "synthetic",
      imagePath: relativeImagePath,
      imageSha256: createHash("sha256").update(bytes).digest("hex"),
      transformVersion: `${config.corpusVersion}/${stratum}`,
    });
    groundTruth.push({ sampleId: id, metrics });
  }

  await writeFile(path.join(root, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(path.join(root, "ground-truth-render-source.json"), `${JSON.stringify(groundTruth, null, 2)}\n`);
  await writeFile(
    path.join(root, "ground-truth-review-a.template.json"),
    `${JSON.stringify(groundTruth.map(({ sampleId }) => ({ sampleId, metrics: null })), null, 2)}\n`,
  );
  await writeFile(
    path.join(root, "ground-truth-review-b.template.json"),
    `${JSON.stringify(groundTruth.map(({ sampleId }) => ({ sampleId, metrics: null })), null, 2)}\n`,
  );
}

export async function readCorpus(root: string) {
  const manifest = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8")) as ManifestEntry[];
  const groundTruth = JSON.parse(
    await readFile(path.join(root, "ground-truth-render-source.json"), "utf8"),
  ) as GroundTruthEntry[];
  return { manifest, groundTruth };
}

export async function loadConfig(repositoryRoot: string) {
  return JSON.parse(
    await readFile(path.join(repositoryRoot, "benchmark/ocr/config.json"), "utf8"),
  ) as Config & { candidates: Array<Record<string, unknown>> };
}
