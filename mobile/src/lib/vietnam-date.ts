// Pure Asia/Ho_Chi_Minh (UTC+7, no DST) calendar helpers.
// Uses fixed UTC+7 offset math so date derivation is deterministic across
// Node, Android Hermes, and devices set to any local timezone.

export const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";
const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function getVietnamDate(instant: Date | string | number = new Date()): string {
  const date = instant instanceof Date ? instant : new Date(instant);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid instant for Vietnam date conversion");
  }
  const shifted = new Date(date.getTime() + VIETNAM_OFFSET_MS);
  const year = shifted.getUTCFullYear();
  const month = pad2(shifted.getUTCMonth() + 1);
  const day = pad2(shifted.getUTCDate());
  return `${year}-${month}-${day}`;
}

export function parseHttpDateHeader(headerValue: string | null | undefined): Date | null {
  if (!headerValue) return null;
  const parsed = new Date(headerValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function isValidIsoDate(value: string): boolean {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const check = new Date(Date.UTC(year, month - 1, day));
  return (
    check.getUTCFullYear() === year &&
    check.getUTCMonth() + 1 === month &&
    check.getUTCDate() === day
  );
}

export function formatVietnamDate(isoDate: string): string {
  const match = ISO_DATE_PATTERN.exec(isoDate);
  if (!match) return isoDate;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

const WEEKDAYS_VI = [
  "Chủ nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
] as const;

export function formatVietnamDateLong(isoDate: string): string {
  const match = ISO_DATE_PATTERN.exec(isoDate);
  if (!match) return isoDate;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utcDay = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const weekday = WEEKDAYS_VI[utcDay] ?? "";
  return `${weekday}, ${day}/${month}/${year}`;
}

export function formatVietnamTimestamp(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return isoTimestamp;
  const shifted = new Date(date.getTime() + VIETNAM_OFFSET_MS);
  const hours = pad2(shifted.getUTCHours());
  const minutes = pad2(shifted.getUTCMinutes());
  const day = pad2(shifted.getUTCDate());
  const month = pad2(shifted.getUTCMonth() + 1);
  const year = shifted.getUTCFullYear();
  return `${hours}:${minutes} · ${day}/${month}/${year} (GMT+7)`;
}
