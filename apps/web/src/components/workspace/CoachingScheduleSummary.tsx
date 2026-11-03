import Link from "next/link";
import {CalendarDays,ArrowUpRight} from "lucide-react";
import {createClient} from "@/lib/supabase/server";
import {isCalendarEnabled} from "@/features/scheduling/config";
import {scheduleWeek} from "@/features/scheduling/calendar";
import {getApplicationDate} from "@/features/engagement/calendar";

export default async function CoachingScheduleSummary({isPt,traineeId}:{isPt:boolean;traineeId?:string}) {
  if(!isCalendarEnabled()) return <section className="coaching-schedule-summary"><div className="workspace-section-heading"><h2>{isPt?"Lịch sắp tới":"Buổi hẹn tiếp theo"}</h2><CalendarDays size={22}/></div><p>Lịch dùng chung chưa được mở tại môi trường này.</p><Link href="/workspace/calendar">Xem lịch của bạn</Link></section>;
  const db=createClient();
  let query=db.from("coaching_appointments").select("id,trainee_id,title,starts_at,ends_at").eq("status","scheduled").gt("ends_at",new Date().toISOString()).order("starts_at").limit(isPt?3:1);
  if(traineeId) query=query.eq("trainee_id",traineeId);
  const {data,error}=await query;
  const date=new Intl.DateTimeFormat("vi-VN",{weekday:"short",day:"numeric",month:"numeric",hour:"2-digit",minute:"2-digit",timeZone:"Asia/Ho_Chi_Minh"});
  return <section className="coaching-schedule-summary" aria-label="Cuộc hẹn sắp tới"><div className="workspace-section-heading"><h2>{isPt?"Lịch sắp tới":"Buổi hẹn tiếp theo"}</h2><Link href="/workspace/calendar">Xem lịch <ArrowUpRight size={16}/></Link></div>
    {error?<p role="alert">Chưa tải được cuộc hẹn. Mở lịch để thử lại.</p>:data?.length?<div className="coaching-upcoming-list">{data.map(item=><Link key={item.id} href={`/workspace/calendar?week=${scheduleWeek(getApplicationDate(item.starts_at))!.monday}#${item.id}`}><CalendarDays size={20}/><div><time dateTime={item.starts_at}>{date.format(new Date(item.starts_at))}</time><strong>{item.title}</strong><span>{Date.parse(item.starts_at)<=Date.now()?"Đang trong khung giờ đã xếp":"Đã xếp lịch"} · Giờ Việt Nam</span></div><ArrowUpRight size={18}/></Link>)}</div>:<div className="coaching-empty-line"><p>Chưa có cuộc hẹn sắp tới.</p><Link href={isPt?"/workspace/calendar":"/workspace/chat"}>{isPt?"Xếp cuộc hẹn đầu tiên":"Trao đổi với PT"}</Link></div>}
  </section>;
}
