import { describe, expect, it } from "vitest";

import {
  areCheckinNotesEquivalent,
  MAX_CHECKIN_NOTE_LENGTH,
  normalizeCheckinNote,
  postgresCharLength,
  validateCheckinNote,
} from "./validation";

describe("Postgres-aligned check-in note validation and comparison", () => {
  it("matches Postgres nullif(trim(note), '') by trimming only ASCII spaces", () => {
    expect(normalizeCheckinNote("")).toBeNull();
    expect(normalizeCheckinNote("     ")).toBeNull();
    expect(normalizeCheckinNote("  Tập xong buổi chân  ")).toBe("Tập xong buổi chân");

    // Postgres trim(text) does NOT strip newlines, tabs, or NBSP
    expect(normalizeCheckinNote("\n")).toBe("\n");
    expect(normalizeCheckinNote("\t")).toBe("\t");
    expect(normalizeCheckinNote("\u00A0")).toBe("\u00A0");
    expect(normalizeCheckinNote("  Dòng 1\n  ")).toBe("Dòng 1\n");
  });

  it("matches Postgres UTF-8 char_length using Unicode scalar code points", () => {
    const emoji = "💪";
    expect(emoji.length).toBe(2); // UTF-16 code units
    expect(postgresCharLength(emoji)).toBe(1); // Postgres char_length

    const exactly500Emoji = emoji.repeat(MAX_CHECKIN_NOTE_LENGTH);
    const valid = validateCheckinNote(`  ${exactly500Emoji}  `);
    expect(valid.ok).toBe(true);
    if (valid.ok) {
      expect(valid.charLength).toBe(500);
    }

    const tooLong501Emoji = emoji.repeat(MAX_CHECKIN_NOTE_LENGTH + 1);
    const invalid = validateCheckinNote(tooLong501Emoji);
    expect(invalid.ok).toBe(false);
    if (!invalid.ok) {
      expect(invalid.code).toBe("TOO_LONG");
      expect(invalid.charLength).toBe(501);
    }
  });

  it("rejects NUL bytes unsupported by Postgres text columns", () => {
    const result = validateCheckinNote("abc\u0000def");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("NUL_BYTE");
    }
  });

  it("compares draft notes against saved Postgres notes identically to Postgres storage", () => {
    expect(areCheckinNotesEquivalent("", null)).toBe(true);
    expect(areCheckinNotesEquivalent("   ", null)).toBe(true);
    expect(areCheckinNotesEquivalent("  Tốt  ", "Tốt")).toBe(true);

    // Trailing newline is preserved by Postgres trim(), so it is NOT equivalent to trimmed text
    expect(areCheckinNotesEquivalent("Tốt\n", "Tốt")).toBe(false);
    expect(areCheckinNotesEquivalent("Ghi chú mới", "Ghi chú cũ")).toBe(false);
    expect(areCheckinNotesEquivalent("Ghi chú mới", null)).toBe(false);
  });
});
