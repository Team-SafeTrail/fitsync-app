import "server-only";
export const isCalendarEnabled = () => process.env.FITSYNC_CALENDAR_ENABLED === "true";
