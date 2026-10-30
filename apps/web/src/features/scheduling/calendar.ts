import {addCalendarDays,getApplicationDate} from "@/features/engagement/calendar";
import {vietnamAppointmentInstant} from "./validation";

export function scheduleWeek(raw?: string) {
  const day = raw ?? getApplicationDate();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !vietnamAppointmentInstant(`${day}T00:00`)) return null;
  const weekday = new Date(`${day}T12:00:00Z`).getUTCDay();
  const monday = addCalendarDays(day, -((weekday + 6) % 7));
  return {
    monday, previous:addCalendarDays(monday,-7), next:addCalendarDays(monday,7),
    startsAt:vietnamAppointmentInstant(`${monday}T00:00`)!,
    endsAt:vietnamAppointmentInstant(`${addCalendarDays(monday,7)}T00:00`)!,
  };
}
