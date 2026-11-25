import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getWorkspaceViewer } from "@/features/workspace/data";
import { createClient } from "@/lib/supabase/server";
import { isCalendarEnabled } from "@/features/scheduling/config";
import { scheduleWeek } from "@/features/scheduling/calendar";
import { getApplicationDate } from "@/features/engagement/calendar";
import AppointmentForm from "@/components/workspace/AppointmentForm";
import AppointmentWorkflow from "@/components/workspace/AppointmentWorkflow";
import GoogleCalendarGrid from "@/components/workspace/GoogleCalendarGrid";

export const dynamic = "force-dynamic";

export default async function CalendarPage({ searchParams: query }: { searchParams: Promise<{ week?: string; trainee?: string; saved?: string }> }) {
  const searchParams = await query;
  const viewer = await getWorkspaceViewer();
  if (!viewer) redirect("/login");
  if (!isCalendarEnabled()) {
    return (
      <main id="main-content" className="workspace-main">
        <div style={{ marginBottom: "14px" }}>
        </div>
        <h1>Lịch của bạn</h1>
        <section className="workspace-empty">
          <p>Lịch chưa được mở tại môi trường này.</p>
        </section>
      </main>
    );
  }
  if (!["pt", "trainee"].includes(viewer.profile.role)) redirect("/workspace");
  const week = scheduleWeek(searchParams.week);
  if (!week) notFound();

  return (
    <main id="main-content" className="workspace-main calendar-page">
      <Suspense fallback={<p role="status">Đang tải lịch của bạn…</p>}>
        <CalendarContent viewer={viewer} week={week} selected={searchParams.trainee} saved={searchParams.saved} />
      </Suspense>
    </main>
  );
}

async function CalendarContent({ viewer, week, selected, saved }: { viewer: NonNullable<Awaited<ReturnType<typeof getWorkspaceViewer>>>; week: NonNullable<ReturnType<typeof scheduleWeek>>; selected?: string; saved?: string }) {
  const isPt = viewer.profile.role === "pt";
  const supabase = await createClient();
  const [appointments, trainees] = await Promise.all([
    supabase.from("coaching_appointments").select("*").lt("starts_at", week.endsAt).gt("ends_at", week.startsAt).order("starts_at").order("id").limit(501),
    supabase.from("trainee_profiles").select("id,display_name,profile_id,session_version").neq("status", "archived").not("profile_id", "is", null).eq(isPt ? "assigned_pt_id" : "profile_id", viewer.user.id).order("display_name"),
  ]);
  const names = new Map((trainees.data ?? []).map((item) => [item.id, item.display_name]));
  const sessionVersions = new Map((trainees.data ?? []).map((item) => [item.id, item.session_version]));
  const ids = (appointments.data ?? []).slice(0, 500).map((a) => a.id);
  const [changes, completions] = ids.length
    ? await Promise.all([
      supabase.from("appointment_change_requests").select("*").in("appointment_id", ids).order("created_at", { ascending: false }).limit(1001),
      supabase.from("session_ledger").select("id,delta,appointment_id").eq("kind", "completion").in("appointment_id", ids).limit(501),
    ])
    : [{ data: [], error: null }, { data: [], error: null }];
  const completedIds = (completions.data ?? []).map((c) => c.id);
  const reversals = completedIds.length ? await supabase.from("session_ledger").select("reverses_id").in("reverses_id", completedIds) : { data: [], error: null };
  const reversedIds = new Set((reversals.data ?? []).map((r) => r.reverses_id));
  const completionMap = new Map((completions.data ?? []).map((c) => [c.appointment_id, c]));
  const workflowUnavailable = changes.error || completions.error || reversals.error;
  const groups = new Map<string, NonNullable<typeof appointments.data>>();
  for (const item of (appointments.data ?? []).slice(0, 500)) {
    const day = getApplicationDate(item.starts_at);
    const group = groups.get(day) ?? [];
    group.push(item);
    groups.set(day, group);
  }
  const time = new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Ho_Chi_Minh" });
  const dayLabel = new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "numeric", month: "numeric", timeZone: "Asia/Ho_Chi_Minh" });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "14px" }}>

        <div className="calendar-heading-actions">
          {isPt && <a className="workspace-button" href="#calendar-entry-title">Xếp cuộc hẹn</a>}
          <Link href="/workspace/chat" prefetch={true} className="fs-pill-link is-brand">
            <MessageCircle size={15} /> Mở trao đổi
          </Link>
        </div>
      </div>

      <header className="calendar-heading">
        <div>
          <p className="workspace-kicker">Lịch đồng bộ · UTC+7</p>
          <h1>Lịch tập, cùng một nhịp.</h1>
          <p>{isPt ? "Xếp lịch hẹn và xử lý yêu cầu đổi lịch." : "Theo dõi buổi tập hoặc đề nghị đổi giờ khi cần."}</p>
        </div>
      </header>

      <nav className="calendar-week-nav" aria-label="Chọn tuần">
        <Link href={`/workspace/calendar?week=${week.previous}`} aria-label="Tuần trước" className="fs-pill-link">← Tuần trước</Link>
        <div>
          <strong>Tuần từ {week.monday.split("-").reverse().join("/")}</strong>
          <span>Đặt lịch không tự trừ buổi PT</span>
        </div>
        <Link href={`/workspace/calendar?week=${week.next}`} aria-label="Tuần sau" className="fs-pill-link">Tuần sau →</Link>
        <Link href="/workspace/calendar" className="fs-pill-link is-brand">Tuần này</Link>
      </nav>

      {!appointments.error && !trainees.error && (
        <GoogleCalendarGrid
          weekMonday={week.monday}
          isPt={isPt}
          events={(appointments.data ?? []).slice(0, 500).map((item) => {
            const completion = completionMap.get(item.id);
            const hasPendingChange = (changes.data ?? []).some(
              (r) => r.appointment_id === item.id && r.state === "pending",
            );
            return {
              id: item.id,
              title: item.title,
              kind: item.kind,
              status: item.status,
              startsAt: item.starts_at,
              endsAt: item.ends_at,
              participantLabel: isPt ? names.get(item.trainee_id) ?? "Học viên" : "Cùng PT của bạn",
              hasPendingChange,
              isCompleted: !!completion && !reversedIds.has(completion.id),
            };
          })}
        />
      )}

      <div className={isPt ? "calendar-layout" : "calendar-layout is-learner"}>
        <section className="calendar-agenda" aria-label="Lịch đã xếp">
          <h2>Lịch đã xếp</h2>
          {appointments.error || trainees.error ? (
            <p role="alert">Chưa tải được lịch. <a href={`/workspace/calendar?week=${week.monday}`}>Tải lại lịch</a></p>
          ) : groups.size ? (
            Array.from(groups, ([day, items]) => (
              <section key={day} className="calendar-day">
                <h3>{dayLabel.format(new Date(`${day}T12:00:00+07:00`))}</h3>
                {items.map((item) => (
                  <article key={item.id} id={item.id} className="calendar-appointment" data-testid={item.status === "scheduled" ? "calendar-appointment" : "calendar-retired-appointment"}>
                    <div className="calendar-time">
                      <time dateTime={item.starts_at}>{time.format(new Date(item.starts_at))}</time>
                      <span>đến {time.format(new Date(item.ends_at))}{getApplicationDate(item.ends_at) !== day ? ` · ${getApplicationDate(item.ends_at).split("-").reverse().join("/")}` : ""}</span>
                    </div>
                    <div>
                      <span className="calendar-kind">{item.kind === "training" ? "Buổi tập" : "Tư vấn"} · {item.status === "scheduled" ? "Đã xếp lịch" : "Đã hủy/ngừng"}</span>
                      <h4>{item.title}</h4>
                      <p>{isPt ? names.get(item.trainee_id) ?? "Học viên" : "Cùng PT của bạn"}</p>
                      <div className="calendar-row-links">
                        {isPt && <Link href={`/workspace/trainees/${item.trainee_id}`} className="fs-pill-link">Hồ sơ học viên</Link>}
                        <Link href={`/workspace/chat/${item.trainee_id}`} className="fs-pill-link is-brand">{isPt ? "Trao đổi với học viên" : "Trao đổi với PT"}</Link>
                      </div>
                      {workflowUnavailable ? (
                        <p role="alert">Chưa tải được lịch sử thay đổi/số buổi. Tải lại trước khi thao tác.</p>
                      ) : (
                        <AppointmentWorkflow
                          appointment={item}
                          isPt={isPt}
                          requests={(changes.data ?? []).filter((r) => r.appointment_id === item.id)}
                          completion={completionMap.get(item.id)}
                          reversed={reversedIds.has(completionMap.get(item.id)?.id ?? "")}
                          sessionVersion={sessionVersions.get(item.trainee_id) ?? 0}
                        />
                      )}
                    </div>
                  </article>
                ))}
              </section>
            ))
          ) : (
            <div className="workspace-empty compact">
              <h3>Tuần này chưa có cuộc hẹn.</h3>
              <p>{isPt ? "Chọn học viên và khung giờ bên cạnh để xếp lịch." : "Cuộc hẹn mới sẽ hiển thị tại đây."}</p>
            </div>
          )}
          {(changes.data?.length ?? 0) > 1000 && <p role="alert">Đang hiển thị tối đa 1.000 đề nghị trong tuần.</p>}
          {(appointments.data?.length ?? 0) > 500 && <p role="alert">Đang hiển thị 500 cuộc hẹn đầu tuần.</p>}
        </section>

        {isPt && (
          <section className="calendar-entry" aria-labelledby="calendar-entry-title">
            <span className="calendar-entry-label">Cùng học viên</span>
            <h2 id="calendar-entry-title">Thêm cuộc hẹn</h2>
            {trainees.error ? (
              <p role="alert">Chưa tải được danh sách học viên.</p>
            ) : trainees.data?.length ? (
              <AppointmentForm trainees={trainees.data} selected={selected} confirmedSaved={isPt && !!saved && (appointments.data ?? []).some((a) => a.client_request_id === saved)} />
            ) : (
              <p>Kết nối tài khoản học viên qua <Link href="/workspace">lời mời</Link> trước khi xếp lịch.</p>
            )}
          </section>
        )}
      </div>
    </>
  );
}
