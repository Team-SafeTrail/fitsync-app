// Check-in note validation and comparison matching PostgreSQL submit_daily_checkin:
//   normalized_note text := nullif(trim(checkin_note), '');
//   if normalized_note is not null and char_length(normalized_note) > 500 then ...
//
// PostgreSQL `trim(text)` (btrim with default characters) trims ONLY ASCII space
// (' ', U+0020) from start and end — NOT newlines, tabs, or non-breaking spaces.
// PostgreSQL `char_length(text)` in UTF-8 counts Unicode scalar code points,
// not UTF-16 code units.

export const MAX_CHECKIN_NOTE_LENGTH = 500;

export type NoteValidationResult =
  | {
      ok: true;
      rawNote: string;
      normalizedNote: string | null;
      charLength: number;
    }
  | {
      ok: false;
      code: "NUL_BYTE" | "TOO_LONG";
      message: string;
      charLength: number;
    };

export function trimAsciiSpacesLikePostgres(raw: string): string {
  return raw.replace(/^ +| +$/g, "");
}

export function normalizeCheckinNote(raw: string): string | null {
  const trimmed = trimAsciiSpacesLikePostgres(raw);
  return trimmed.length === 0 ? null : trimmed;
}

export function postgresCharLength(value: string): number {
  let count = 0;
  for (const _char of value) {
    count += 1;
  }
  return count;
}

export function validateCheckinNote(raw: string): NoteValidationResult {
  if (raw.includes("\u0000")) {
    return {
      ok: false,
      code: "NUL_BYTE",
      message: "Ghi chú chứa ký tự điều khiển không hợp lệ.",
      charLength: postgresCharLength(trimAsciiSpacesLikePostgres(raw)),
    };
  }

  const normalized = normalizeCheckinNote(raw);
  const charLength = normalized ? postgresCharLength(normalized) : 0;

  if (charLength > MAX_CHECKIN_NOTE_LENGTH) {
    return {
      ok: false,
      code: "TOO_LONG",
      message: `Ghi chú tối đa ${MAX_CHECKIN_NOTE_LENGTH} ký tự (hiện có ${charLength} ký tự).`,
      charLength,
    };
  }

  return {
    ok: true,
    rawNote: raw,
    normalizedNote: normalized,
    charLength,
  };
}

export function areCheckinNotesEquivalent(
  draftRaw: string,
  savedNote: string | null,
): boolean {
  return normalizeCheckinNote(draftRaw) === savedNote;
}
