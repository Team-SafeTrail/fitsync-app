import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { generateCorpus, readCorpus } from "../src/corpus";
import { reconcileGroundTruth, validateCorpus } from "../src/validation";

const directories: string[] = [];
const config = {
  corpusVersion: "test-v1",
  preprocessingVersion: "test-preprocess-v1",
  reportCount: 30,
  splits: {
    development: [1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26],
    holdout: [8, 9, 10, 18, 19, 20, 27, 28, 29, 30],
  },
};

afterEach(async () => {
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("synthetic corpus", () => {
  it("locks 30 distinct sources into a 20/10 split with ten captures per stratum", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "fitsync-corpus-test-"));
    directories.push(root);
    await generateCorpus(root, config);
    const { manifest, groundTruth } = await readCorpus(root);
    const result = await validateCorpus(root, manifest, groundTruth);

    expect(result.splitCounts).toEqual({ development: 20, holdout: 10 });
    expect(result.stratumCounts).toEqual({
      clean: 10,
      typical_handheld: 10,
      degraded_human_readable: 10,
    });
    expect(new Set(manifest.map((entry) => entry.sourceGroupId)).size).toBe(30);
  }, 30_000);

  it("rejects ground-truth disagreements", () => {
    const source = [{ sampleId: "syn-001", metrics: {
      weight_kg: 70,
      skeletal_muscle_mass_kg: 31,
      body_fat_mass_kg: 14,
      percent_body_fat: 20,
      total_body_water_liters: 41,
    } }];
    const changed = structuredClone(source);
    changed[0].metrics.weight_kg = 71;
    expect(() => reconcileGroundTruth(source, changed, source)).toThrow(/not independently reconciled/);
  });
});
