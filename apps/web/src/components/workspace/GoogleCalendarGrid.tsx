"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, X } from "lucide-react";
import { addCalendarDays } from "@/features/engagement/calendar";
import AppointmentForm from "./AppointmentForm";

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
  trainees = [],
}: {
  weekMonday: string;
  events: GoogleCalendarEvent[];
  isPt: boolean;
  trainees?: { id: string; display_name: string }[];
}) {
  const [todayInfo, setTodayInfo] = useState<{ day: string; minuteOfDay: number } | null>(null);
  const [activeSlotHint, setActiveSlotHint] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<{
    dayStr: string;
    hour: number;
    startIso: string;
    endIso: string;
    formattedTime: string;
  } | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const openerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setTodayInfo(getVietnamToday());
    const timer = window.setInterval(() => setTodayInfo(getVietnamToday()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!activeSlot) return;

    // Focus the first interactive element or dialog after mounting
    const timer = window.setTimeout(() => {
      const dialog = dialogRef.current;
      if (dialog) {
        const focusable = dialog.querySelector<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }
    }, 50);

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setActiveSlot(null);
        openerElementRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSlot]);

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

  function openSlotModal(dayStr: string, hour: number) {
    if (!isPt) return;
    openerElementRef.current = document.activeElement as HTMLElement | null;
    const startIso = `${dayStr}T${String(hour).padStart(2, "0")}:00`;
    const endHour = hour >= 23 ? 23 : hour + 1;
    const endMin = hour >= 23 ? 59 : 0;
    const endIso = `${dayStr}T${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;

    const [year, month, day] = dayStr.split("-");
    const dateObj = new Date(`${dayStr}T12:00:00+07:00`);
    const dayName = new Intl.DateTimeFormat("vi-VN", { weekday: "long", timeZone: "Asia/Ho_Chi_Minh" }).format(dateObj);
    const formattedTime = `${dayName}, ${day}/${month}/${year} · ${String(hour).padStart(2, "0")}:00 – ${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;

    setActiveSlot({
      dayStr,
      hour,
      startIso,
      endIso,
      formattedTime,
    });
    setActiveSlotHint(`Đã chọn: ${String(hour).padStart(2, "0")}:00 ngày ${day}/${month}`);

    const startInput = document.getElementById("appointment-start") as HTMLInputElement | null;
    const endInput = document.getElementById("appointment-end") as HTMLInputElement | null;
    if (startInput && endInput) {
      startInput.value = startIso;
      endInput.value = endIso;
      startInput.dispatchEvent(new Event("input", { bubbles: true }));
      endInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
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
              {activeSlotHint ?? "Bấm vào ô giờ để mở tab đăng ký lịch hẹn"}
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
                      onClick={() => openSlotModal(dayStr, hour)}
                      className={`gcal-hour-cell${isPt ? " is-clickable" : ""}`}
                      style={{ height: `${HOUR_HEIGHT}px` }}
                      aria-label={
                        isPt
                          ? `Đăng ký lịch hẹn ${String(hour).padStart(2, "0")}:00 ngày ${dayStr.split("-").reverse().join("/")}`
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

      {activeSlot && (
        <div
          className="gcal-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveSlot(null);
              openerElementRef.current?.focus();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gcal-modal-title"
        >
          <div className="gcal-modal-dialog" ref={dialogRef} tabIndex={-1}>
            <header className="gcal-modal-header">
              <div>
                <p className="gcal-modal-kicker">Lịch hẹn mới · UTC+7</p>
                <h3 id="gcal-modal-title">Đăng ký lịch hẹn với học viên</h3>
              </div>
              <button
                type="button"
                className="gcal-modal-close"
                onClick={() => {
                  setActiveSlot(null);
                  openerElementRef.current?.focus();
                }}
                aria-label="Đóng bảng đăng ký lịch hẹn"
              >
                <X size={18} />
              </button>
            </header>

            <div className="gcal-modal-body">
              <div className="gcal-modal-slot-badge">
                <Clock3 size={15} />
                <span>{activeSlot.formattedTime}</span>
              </div>

              {trainees.length === 0 ? (
                <div className="gcal-modal-empty">
                  <p>Bạn chưa có học viên nào được kết nối.</p>
                  <p style={{ marginTop: "6px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                    Hãy kết nối tài khoản học viên qua <a href="/workspace" style={{ color: "var(--color-brand)", textDecoration: "underline" }}>lời mời</a> trước khi xếp lịch.
                  </p>
                  <div style={{ marginTop: "16px", textAlign: "right" }}>
                    <button
                      type="button"
                      className="workspace-button secondary"
                      onClick={() => {
                        setActiveSlot(null);
                        openerElementRef.current?.focus();
                      }}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              ) : (
                <AppointmentForm
                  key={`${activeSlot.dayStr}-${activeSlot.hour}`}
                  trainees={trainees}
                  formAriaLabel="Đăng ký lịch hẹn"
                  idPrefix="modal"
                  defaultStart={activeSlot.startIso}
                  defaultEnd={activeSlot.endIso}
                  onCancel={() => {
                    setActiveSlot(null);
                    openerElementRef.current?.focus();
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
