import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["benchmark/ocr/tests/**/*.test.ts"],
  },
});
