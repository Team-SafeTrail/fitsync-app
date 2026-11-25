import { describe, expect, it } from "vitest";

import {
  formatVietnamDate,
  formatVietnamTimestamp,
  getVietnamDate,
  parseHttpDateHeader,
} from "./vietnam-date";

describe("Vietnam (UTC+7) calendar helpers", () => {
  it("rolls over at 17:00:00Z (00:00:00 Asia/Ho_Chi_Minh)", () => {
    expect(getVietnamDate("2026-11-25T16:59:59.000Z")).toBe("2026-11-25");
    expect(getVietnamDate("2026-11-25T17:00:00.000Z")).toBe("2026-11-26");
  });

  it("parses standard HTTP Date headers into Vietnam dates", () => {
    const parsed = parseHttpDateHeader("Wed, 25 Nov 2026 17:05:00 GMT");
    expect(parsed).not.toBeNull();
    expect(getVietnamDate(parsed!)).toBe("2026-11-26");
    expect(parseHttpDateHeader("invalid-date")).toBeNull();
  });

  it("formats Vietnamese date and timestamp deterministically", () => {
    expect(formatVietnamDate("2026-11-25")).toBe("25/11/2026");
    expect(formatVietnamTimestamp("2026-11-25T17:05:00.000Z")).toBe(
      "00:05 · 26/11/2026 (GMT+7)",
    );
  });
});
