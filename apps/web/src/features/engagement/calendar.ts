export const APPLICATION_TIME_ZONE = "Asia/Ho_Chi_Minh";

const applicationDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: APPLICATION_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MILLISECONDS_PER_DAY = 86_400_000;

function dateParts(date: string) {
  const match = ISO_DATE_PATTERN.exec(date);
  if (!match) throw new Error(`Invalid calendar date: ${date}`);
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}
function dateOrdinal(date: string) {
  const { year, month, day } = dateParts(date);
  return Math.floor(Date.UTC(year, month - 1, day) / MILLISECONDS_PER_DAY);
}

export function getApplicationDate(at: Date | string = new Date()) {
  const instant = typeof at === "string" ? new Date(at) : at;
  if (Number.isNaN(instant.getTime())) throw new Error("Invalid instant");

  const parts = applicationDateFormatter.formatToParts(instant);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;

  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function addCalendarDays(date: string, days: number) {
  const { year, month, day } = dateParts(date);
  const result = new Date(Date.UTC(year, month - 1, day + days));
  return result.toISOString().slice(0, 10);
}

export function warningStartsOn(referenceDate: string) {
  return addCalendarDays(referenceDate, 4);
}

export function fullCalendarDaysWithoutCheckin(referenceDate: string, currentDate: string) {
  return Math.max(0, dateOrdinal(currentDate) - dateOrdinal(referenceDate) - 1);
}

export function isCheckinWarningDue(referenceDate: string, at: Date | string = new Date()) {
  return getApplicationDate(at) >= warningStartsOn(referenceDate);
}
