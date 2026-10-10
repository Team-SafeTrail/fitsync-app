import type { RawExtractedMetrics } from "../../../apps/web/src/features/workspace/ocr-validation";
import type { MetricKey, OptionalMetrics, Token } from "./types";
import { METRIC_KEYS } from "./types";

type ParsedMetrics = {
  raw: RawExtractedMetrics;
  observed: OptionalMetrics;
};

const fieldMatchers: Array<{ key: MetricKey; matches: (line: string) => boolean }> = [
  {
    key: "skeletal_muscle_mass_kg",
    matches: (line) => line.includes("muscle") && line.includes("mass") && !line.includes("fat"),
  },
  {
    key: "body_fat_mass_kg",
    matches: (line) => !line.includes("percent") && line.includes("fat") && line.includes("mass"),
  },
  {
    key: "percent_body_fat",
    matches: (line) => (line.includes("percent") || line.includes("%")) && line.includes("fat"),
  },
  {
    key: "total_body_water_liters",
    matches: (line) => line.includes("total") && line.includes("water"),
  },
  {
    key: "weight_kg",
    matches: (line) => line.includes("weight"),
  },
];

function groupLines(tokens: Token[]) {
  if (tokens.length > 0 && tokens.every((token) => token.lineId)) {
    const byLine = new Map<string, Token[]>();
    for (const token of tokens) {
      const line = byLine.get(token.lineId as string) ?? [];
      line.push(token);
      byLine.set(token.lineId as string, line);
    }
    return [...byLine.values()]
      .map((line) => line.sort((a, b) => a.x - b.x))
      .sort((a, b) => a[0].y - b[0].y);
  }
  const ordered = [...tokens].sort((a, b) => a.y + a.height / 2 - (b.y + b.height / 2) || a.x - b.x);
  const lines: Token[][] = [];
  for (const token of ordered) {
    const center = token.y + token.height / 2;
    const line = lines.find((candidate) => {
      const average = candidate.reduce((sum, item) => sum + item.y + item.height / 2, 0) / candidate.length;
      const tolerance = Math.max(55, ...candidate.map((item) => item.height * 1.2), token.height * 1.2);
      return Math.abs(center - average) <= tolerance;
    });
    if (line) line.push(token);
    else lines.push([token]);
  }
  return lines.map((line) => line.sort((a, b) => a.x - b.x));
}

function normalizeLine(line: Token[]) {
  return line
    .map((token) => token.text.toLowerCase())
    .join(" ")
    .replace(/[^a-z0-9.%]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function numericToken(line: Token[]) {
  return [...line]
    .reverse()
    .map((token) => ({ token, match: token.text.replace(",", ".").match(/\d{1,3}(?:\.\d{1,2})?/) }))
    .find(({ match }) => match !== null);
}

export function parseMetricTokens(tokens: Token[]): ParsedMetrics {
  const observed: OptionalMetrics = {};
  const confidence: Partial<Record<MetricKey, number | null>> = {};

  for (const line of groupLines(tokens)) {
    const normalized = normalizeLine(line);
    const field = fieldMatchers.find(({ matches }) => matches(normalized));
    if (!field || observed[field.key] !== undefined) continue;
    if (field.key === "total_body_water_liters" && normalized.includes("not measured")) {
      observed[field.key] = null;
      confidence[field.key] = null;
      continue;
    }
    const labelRight = Math.max(...line.map((token) => token.x + token.width));
    const labelCenterY = line.reduce((sum, token) => sum + token.y + token.height / 2, 0) / line.length;
    const numeric = numericToken(line) ?? tokens
      .filter((token) => token.x > labelRight - 20)
      .map((token) => ({ token, match: token.text.replace(",", ".").match(/^\D*(\d{1,3}(?:\.\d{1,2})?)\D*$/) }))
      .filter(({ match, token }) => match !== null && Math.abs(token.y + token.height / 2 - labelCenterY) <= 90)
      .sort((a, b) => {
        const ay = Math.abs(a.token.y + a.token.height / 2 - labelCenterY);
        const by = Math.abs(b.token.y + b.token.height / 2 - labelCenterY);
        return ay - by || a.token.x - b.token.x;
      })[0];
    if (!numeric?.match) continue;
    observed[field.key] = Number(numeric.match[1] ?? numeric.match[0]);
    confidence[field.key] = numeric.token.confidence;
  }

  const raw: RawExtractedMetrics = {
    weightKg: observed.weight_kg,
    skeletalMuscleMassKg: observed.skeletal_muscle_mass_kg,
    bodyFatMassKg: observed.body_fat_mass_kg,
    percentBodyFat: observed.percent_body_fat,
    totalBodyWaterLiters: observed.total_body_water_liters,
    confidence,
  };
  for (const key of METRIC_KEYS) {
    if (confidence[key] === undefined) confidence[key] = null;
  }
  return { raw, observed };
}
