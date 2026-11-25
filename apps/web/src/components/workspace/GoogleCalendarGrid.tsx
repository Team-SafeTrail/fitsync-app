"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3 } from "lucide-react";
import { addCalendarDays } from "@/features/engagement/calendar";

export type GoogleCalendarEvent = {
  id: string;
  title: string;
  kind: string;
  status: string;
  startsAt: string;
  endsAt: string;
  participantLabel: string;
  hasPendingChange: boolean;
  isCompleted: boolean;
};

type DaySlice = {
  event: GoogleCalendarEvent;
  startMin: number;
  endMin: number;
  lane: number;
  laneCount: number;
};

const HOUR_HEIGHT = 44;
const VN_OFFSET_MS = 7 * 3600 * 1000;
const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function getVietnamToday(): { day: string; minuteOfDay: number } {
  const now = new Date(Date.now() + VN_OFFSET_MS);
  return {
    day: now.toISOString().slice(0, 10),
    minuteOfDay: now.getUTCHours() * 60 + now.getUTCMinutes(),
  };
}

function formatHm(iso: string): string {
  const d = new Date(Date.parse(iso) + VN_OFFSET_MS);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

function layoutOverlaps(rawSlices: Omit<DaySlice, "lane" | "laneCount">[]): DaySlice[] {
  const sorted = [...rawSlices].sort((a, b) => a.startMin - b.startMin || b.endMin - a.endMin);
  const placed: { slice: Omit<DaySlice, "lane" | "laneCount">; lane: number; group: number }[] = [];
  const laneEnds: number[] = [];
  let currentGroup = 0;
  let groupMaxEnd = -1;

  for (const slice of sorted) {
    if (slice.startMin >= groupMaxEnd) {
      currentGroup += 1;
      laneEnds.length = 0;
      groupMaxEnd = slice.endMin;
    } else {
      groupMaxEnd = Math.max(groupMaxEnd, slice.endMin);
    }

    let lane = laneEnds.findIndex((end) => end <= slice.startMin);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(slice.endMin);
    } else {
      laneEnds[lane] = slice.endMin;
    }
    placed.push({ slice, lane, group: currentGroup });
  }

  const groupMaxLanes = new Map<number, number>();
  for (const item of placed) {
    groupMaxLanes.set(item.group, Math.max(groupMaxLanes.get(item.group) ?? 1, item.lane + 1));
  }

  return placed.map((item) => ({
    ...item.slice,
    lane: item.lane,
    laneCount: groupMaxLanes.get(item.group) ?? 1,
  }));
}

/** Interactive Google Calendar-style 7-day weekly time grid in UTC+7. */
export default function GoogleCalendarGrid({
  weekMonday,
  events,
  isPt,
}: {
  weekMonday: string;
  events: GoogleCalendarEvent[];
  isPt: boolean;
}) {
  const [todayInfo, setTodayInfo] = useState<{ day: string; minuteOfDay: number } | null>(null);
  const [activeSlotHint, setActiveSlotHint] = useState<string | null>(null);

  useEffect(() => {
    setTodayInfo(getVietnamToday());
    const timer = window.setInterval(() => setTodayInfo(getVietnamToday()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const days = Array.from({ length: 7 }, (_, idx) => addCalendarDays(weekMonday, idx));

  let minHour = 6;
  let maxHour = 22;

  const slicesByDay = new Map<string, DaySlice[]>();
  for (const dayStr of days) {
    const dayStartMs = Date.parse(`${dayStr}T00:00:00+07:00`);
    const dayEndMs = dayStartMs + 86400000;
    const raw: Omit<DaySlice, "lane" | "laneCount">[] = [];

    for (const ev of events) {
      const sMs = Date.parse(ev.startsAt);
      const eMs = Date.parse(ev.endsAt);
      if (sMs < dayEndMs && eMs > dayStartMs) {
        const startMin = Math.max(0, Math.floor((sMs - dayStartMs) / 60000));
        const endMin = Math.min(1440, Math.ceil((eMs - dayStartMs) / 60000));
        if (endMin > startMin) {
          minHour = Math.min(minHour, Math.floor(startMin / 60));
          maxHour = Math.max(maxHour, Math.min(24, Math.ceil(endMin / 60)));
          raw.push({ event: ev, startMin, endMin });
        }
      }
    }
    slicesByDay.set(dayStr, layoutOverlaps(raw));
  }

  const hours = Array.from({ length: maxHour - minHour }, (_, idx) => minHour + idx);
  const totalHeight = hours.length * HOUR_HEIGHT;

  function jumpToAppointment(appointmentId: string) {
    const target = document.getElementById(appointmentId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("is-gcal-highlighted");
    window.setTimeout(() => target.classList.remove("is-gcal-highlighted"), 1800);
  }

  function prefillSlot(dayStr: string, hour: number) {
    if (!isPt) return;
    const startInput = document.getElementById("appointment-start") as HTMLInputElement | null;
    const endInput = document.getElementById("appointment-end") as HTMLInputElement | null;
    const titleInput = document.getElementById("appointment-title") as HTMLInputElement | null;
    if (!startInput || !endInput) return;

    const startVal = `${dayStr}T${String(hour).padStart(2, "0")}:00`;
    const endVal =
      hour >= 23
        ? `${dayStr}T23:59`
        : `${dayStr}T${String(hour + 1).padStart(2, "0")}:00`;

    startInput.value = startVal;
    endInput.value = endVal;
    startInput.dispatchEvent(new Event("input", { bubbles: true }));
    endInput.dispatchEvent(new Event("input", { bubbles: true }));

    setActiveSlotHint(`Đã chọn khung ${dayStr.split("-").reverse().join("/")} · ${String(hour).padStart(2, "0")}:00`);
    (titleInput ?? startInput).scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => titleInput?.focus(), 220);
  }

  return (
    <section className="gcal-card" aria-label="Lịch tuần dạng Google Calendar">
      <div className="gcal-toolbar">
        <div className="gcal-toolbar-title">
          <CalendarDays size={17} />
          <strong>Lịch tuần</strong>
          <span className="gcal-toolbar-count">{events.length} cuộc hẹn</span>
        </div>

        <div className="gcal-legend">
          <span className="gcal-legend-item"><i className="is-training" /> Buổi tập</span>
          <span className="gcal-legend-item"><i className="is-consultation" /> Tư vấn</span>
          <span className="gcal-legend-item"><i className="is-pending" /> Chờ duyệt đổi</span>
          {isPt && (
            <span className="gcal-slot-tip">
              <Clock3 size={13} />
              {activeSlotHint ?? "Bấm vào ô giờ trống để điền nhanh lịch hẹn"}
            </span>
          )}
        </div>
      </div>

      <div className="gcal-scroll">
        <div className="gcal-grid">
          <div className="gcal-header-row">
            <div className="gcal-gutter-head">UTC+7</div>
            {days.map((dayStr, index) => {
              const isToday = todayInfo?.day === dayStr;
              const dayEventsCount = (slicesByDay.get(dayStr) ?? []).filter(
                (s) => s.event.status === "scheduled",
              ).length;
              const [, mm, dd] = dayStr.split("-");
              return (
                <div key={dayStr} className={`gcal-day-head${isToday ? " is-today" : ""}`}>
                  <span className="gcal-day-name">{DAY_LABELS[index]}</span>
                  <span className="gcal-day-num">{Number(dd)}</span>
                  <span className="gcal-day-month">thg {Number(mm)}</span>
                  {dayEventsCount > 0 && (
                    <span className="gcal-day-dot" aria-label={`${dayEventsCount} lịch hẹn`}>
                      {dayEventsCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="gcal-body-row" style={{ height: `${totalHeight}px` }}>
            <div className="gcal-time-axis">
              {hours.map((hour) => (
                <div key={hour} className="gcal-time-label" style={{ height: `${HOUR_HEIGHT}px` }}>
                  <span>{`${String(hour).padStart(2, "0")}:00`}</span>
                </div>
              ))}
            </div>

            {days.map((dayStr) => {
              const isToday = todayInfo?.day === dayStr;
              const slices = slicesByDay.get(dayStr) ?? [];
              const nowMinutes = todayInfo?.minuteOfDay ?? -1;
              const nowTopPx =
                isToday && nowMinutes >= minHour * 60 && nowMinutes <= maxHour * 60
                  ? ((nowMinutes - minHour * 60) / 60) * HOUR_HEIGHT
                  : null;

              return (
                <div key={dayStr} className={`gcal-day-col${isToday ? " is-today" : ""}`}>
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      disabled={!isPt}
                      onClick={() => prefillSlot(dayStr, hour)}
                      className={`gcal-hour-cell${isPt ? " is-clickable" : ""}`}
                      style={{ height: `${HOUR_HEIGHT}px` }}
                      aria-label={
                        isPt
                          ? `Chọn giờ ${String(hour).padStart(2, "0")}:00 ngày ${dayStr.split("-").reverse().join("/")}`
                          : undefined
                      }
                    />
                  ))}

                  {nowTopPx !== null && (
                    <div className="gcal-now-line" style={{ top: `${nowTopPx}px` }} aria-hidden="true">
                      <span className="gcal-now-dot" />
                    </div>
                  )}

                  {slices.map((slice) => {
                    const ev = slice.event;
                    const clampedStart = Math.max(slice.startMin, minHour * 60);
                    const clampedEnd = Math.min(slice.endMin, maxHour * 60);
                    const topPx = ((clampedStart - minHour * 60) / 60) * HOUR_HEIGHT;
                    const heightPx = Math.max(((clampedEnd - clampedStart) / 60) * HOUR_HEIGHT - 3, 28);
                    const widthPct = 100 / slice.laneCount;
                    const leftPct = slice.lane * widthPct;

                    const stateClass =
                      ev.status !== "scheduled"
                        ? "is-cancelled"
                        : ev.isCompleted
                          ? "is-completed"
                          : ev.hasPendingChange
                            ? "is-pending"
                            : ev.kind === "consultation"
                              ? "is-consultation"
                              : "is-training";

                    return (
                      <button
                        key={`${ev.id}-${dayStr}`}
                        type="button"
                        onClick={() => jumpToAppointment(ev.id)}
                        className={`gcal-event ${stateClass}`}
                        style={{
                          top: `${topPx + 1}px`,
                          height: `${heightPx}px`,
                          left: `calc(${leftPct}% + 3px)`,
                          width: `calc(${widthPct}% - 6px)`,
                        }}
                        title={`${ev.title} (${formatHm(ev.startsAt)} – ${formatHm(ev.endsAt)}) · ${ev.participantLabel}`}
                      >
                        <span className="gcal-event-time">
                          {formatHm(ev.startsAt)}–{formatHm(ev.endsAt)}
                          {ev.isCompleted && <CheckCircle2 size={11} aria-hidden="true" />}
                        </span>
                        <strong className="gcal-event-title">{ev.title}</strong>
                        {heightPx >= 46 && (
                          <span className="gcal-event-who">{ev.participantLabel}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
