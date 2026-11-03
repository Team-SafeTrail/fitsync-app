import { describe, expect, it } from "vitest";
import { sanitizeRedirectPath } from "./redirect";

describe("sanitizeRedirectPath", () => {
  it("allows valid relative paths", () => {
    expect(sanitizeRedirectPath("/workspace")).toBe("/workspace");
    expect(sanitizeRedirectPath("/admin")).toBe("/admin");
    expect(sanitizeRedirectPath("/workspace/calendar?view=week#today")).toBe("/workspace/calendar?view=week#today");
    expect(sanitizeRedirectPath("/update-password")).toBe("/update-password");
  });

  it("returns fallback for null, undefined, and empty string", () => {
    expect(sanitizeRedirectPath(null)).toBe("/workspace");
    expect(sanitizeRedirectPath(undefined)).toBe("/workspace");
    expect(sanitizeRedirectPath("")).toBe("/workspace");
    expect(sanitizeRedirectPath("   ")).toBe("/workspace");
    expect(sanitizeRedirectPath(null, "/custom-fallback")).toBe("/custom-fallback");
  });

  it("rejects absolute URLs (open redirect attacks)", () => {
    expect(sanitizeRedirectPath("https://evil.com")).toBe("/workspace");
    expect(sanitizeRedirectPath("http://evil.com/workspace")).toBe("/workspace");
    expect(sanitizeRedirectPath("javascript:alert(1)")).toBe("/workspace");
    expect(sanitizeRedirectPath("data:text/html,evil")).toBe("/workspace");
  });

  it("rejects protocol-relative and backslash bypass attempts", () => {
    expect(sanitizeRedirectPath("//evil.com")).toBe("/workspace");
    expect(sanitizeRedirectPath("//localhost")).toBe("/workspace");
    expect(sanitizeRedirectPath("/\\evil.com")).toBe("/workspace");
    expect(sanitizeRedirectPath("\\evil.com")).toBe("/workspace");
    expect(sanitizeRedirectPath("///evil.com")).toBe("/workspace");
  });

  it("rejects newline and control character injection", () => {
    expect(sanitizeRedirectPath("/workspace\r\nSet-Cookie:evil=1")).toBe("/workspace");
    expect(sanitizeRedirectPath("/workspace\nLocation:http://evil.com")).toBe("/workspace");
    expect(sanitizeRedirectPath("/workspace\0evil")).toBe("/workspace");
  });
});

