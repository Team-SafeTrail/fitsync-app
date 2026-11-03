import Link from "next/link";
import {Suspense} from "react";
import {notFound,redirect} from "next/navigation";
import {getWorkspaceViewer} from "@/features/workspace/data";
import {createClient} from "@/lib/supabase/server";
import {isCalendarEnabled} from "@/features/scheduling/config";
import {scheduleWeek} from "@/features/scheduling/calendar";
import {getApplicationDate} from "@/features/engagement/calendar";
import AppointmentForm from "@/components/workspace/AppointmentForm";

export const dynamic = "force-dynamic";

export default async function CalendarPage({searchParams}:{searchParams:{week?:string;trainee?:string}}) {
  const viewer = await getWorkspaceViewer();
  if(!viewer) redirect("/login");
  if(!isCalendarEnabled()) return <main id="main-content" className="workspace-main"><h1>Lịch của bạn</h1><p>Lịch chưa được mở tại môi trường này.</p><Link href="/workspace">Về workspace</Link></main>;
  if(!["pt","trainee"].includes(viewer.profile.role)) redirect("/workspace");
  const week = scheduleWeek(searchParams.week);
  if(!week) notFound();
  return <main id="main-content" className="workspace-main calendar-page"><Suspense fallback={<p role="status">Đang tải lịch của bạn…</p>}><CalendarContent viewer={viewer} week={week} selected={searchParams.trainee}/></Suspense></main>;
}

async function CalendarContent({viewer,week,selected}:{viewer:NonNullable<Awaited<ReturnType<typeof getWorkspaceViewer>>>;week:NonNullable<ReturnType<typeof scheduleWeek>>;selected?:string}) {
  const isPt = viewer.profile.role === "pt";
  const supabase = createClient();
  const [appointments,trainees] = await Promise.all([
    supabase.from("coaching_appointments").select("*").eq("status","scheduled")
      .lt("starts_at",week.endsAt).gt("ends_at",week.startsAt).order("starts_at").order("id").limit(501),
    supabase.from("trainee_profiles").select("id,display_name,profile_id").neq("status","archived").not("profile_id","is",null)
      .eq(isPt?"assigned_pt_id":"profile_id",viewer.user.id).order("display_name"),
  ]);
  const names = new Map((trainees.data??[]).map(item=>[item.id,item.display_name]));
  const groups = new Map<string,NonNullable<typeof appointments.data>>();
  for(const item of (appointments.data??[]).slice(0,500)) {
    const day = getApplicationDate(item.starts_at); const group = groups.get(day)??[]; group.push(item); groups.set(day,group);
  }
  const time = new Intl.DateTimeFormat("vi-VN",{hour:"2-digit",minute:"2-digit",timeZone:"Asia/Ho_Chi_Minh"});
  const dayLabel = new Intl.DateTimeFormat("vi-VN",{weekday:"long",day:"numeric",month:"numeric",timeZone:"Asia/Ho_Chi_Minh"});
  return <>
    <header className="calendar-heading"><div><Link href="/workspace">Không gian của bạn</Link><h1>Lịch tập, cùng một nhịp.</h1><p>{isPt?"Xếp lịch với học viên, không cần soạn giáo án trước.":"Cuộc hẹn PT đã xếp cho bạn. Cần thay đổi? Trao đổi với PT."}</p></div><div className="calendar-heading-actions">{isPt&&<a className="workspace-button" href="#calendar-entry-title">Xếp cuộc hẹn</a>}<Link href="/workspace/chat">Mở trao đổi</Link></div></header>
    <nav className="calendar-week-nav" aria-label="Chọn tuần"><Link href={`/workspace/calendar?week=${week.previous}`} aria-label="Tuần trước">← Tuần trước</Link><div><strong>Tuần từ {week.monday.split("-").reverse().join("/")}</strong><span>Giờ Việt Nam · UTC+7</span></div><Link href={`/workspace/calendar?week=${week.next}`} aria-label="Tuần sau">Tuần sau →</Link><Link href="/workspace/calendar">Tuần này</Link></nav>
    <p className="calendar-note">Đặt lịch không tự trừ buổi PT hoặc ghi nhận check-in.</p>
    <div className={isPt?"calendar-layout":"calendar-layout is-learner"}>
      <section className="calendar-agenda" aria-label="Lịch đã xếp"><h2>Lịch đã xếp</h2>
        {appointments.error||trainees.error?<p role="alert">Chưa tải được lịch. <a href={`/workspace/calendar?week=${week.monday}`}>Tải lại lịch</a></p>:groups.size?Array.from(groups,([day,items])=><section key={day} className="calendar-day"><h3>{dayLabel.format(new Date(`${day}T12:00:00+07:00`))}</h3>{items.map(item=><article key={item.id} id={item.id} className="calendar-appointment" data-testid="calendar-appointment"><div className="calendar-time"><time dateTime={item.starts_at}>{time.format(new Date(item.starts_at))}</time><span>đến {time.format(new Date(item.ends_at))}{getApplicationDate(item.ends_at)!==day?` · ${getApplicationDate(item.ends_at).split("-").reverse().join("/")}`:""}</span></div><div><span className="calendar-kind">{item.kind==="training"?"Buổi tập":"Tư vấn"} · Đã xếp lịch</span><h4>{item.title}</h4><p>{isPt?names.get(item.trainee_id)??"Học viên":"Cùng PT của bạn"}</p><div className="calendar-row-links">{isPt&&<Link href={`/workspace/trainees/${item.trainee_id}`}>Hồ sơ học viên</Link>}<Link href={`/workspace/chat/${item.trainee_id}`}>{isPt?"Trao đổi với học viên":"Trao đổi với PT"}</Link></div></div></article>)}</section>):<div className="workspace-empty"><h3>Tuần này chưa có cuộc hẹn.</h3><p>{isPt?"Chọn học viên và khung giờ để bắt đầu xếp lịch.":"Cuộc hẹn sẽ xuất hiện ở đây khi PT xếp lịch."}</p></div>}
        {(appointments.data?.length??0)>500&&<p role="alert">Đang hiển thị 500 cuộc hẹn đầu tuần. Cần thu hẹp khoảng ngày trước khi dùng với lịch dày hơn.</p>}
      </section>
      {isPt&&<section className="calendar-entry" aria-labelledby="calendar-entry-title"><span className="calendar-entry-label">Cùng học viên</span><h2 id="calendar-entry-title">Thêm cuộc hẹn</h2>{trainees.error?<p role="alert">Chưa tải được danh sách học viên.</p>:trainees.data?.length?<AppointmentForm trainees={trainees.data} selected={selected}/>:<p>Kết nối tài khoản học viên qua <Link href="/workspace">lời mời</Link> trước khi xếp lịch dùng chung.</p>}</section>}
    </div>
  </>;
}
