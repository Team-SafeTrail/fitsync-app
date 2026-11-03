import Link from "next/link";
import {redirect} from "next/navigation";
import {Suspense} from "react";
import {ArrowUpRight,NotebookPen,UserRoundPlus} from "lucide-react";
import {getPtRoster,getWorkspaceViewer} from "@/features/workspace/data";
import CoachingScheduleSummary from "@/components/workspace/CoachingScheduleSummary";

export const dynamic="force-dynamic";
export default async function TodayPage() {
  const viewer=await getWorkspaceViewer();
  if(!viewer) redirect("/login");
  if(viewer.profile.role!=="pt") redirect("/workspace");
  const {trainees,warningByTrainee}=await getPtRoster();
  const warnings=trainees.filter(item=>warningByTrainee.has(item.id));
  const pending=trainees.filter(item=>!item.profile_id);
  const date=new Intl.DateTimeFormat("vi-VN",{weekday:"long",day:"numeric",month:"long",timeZone:"Asia/Ho_Chi_Minh"}).format(new Date());
  return <main id="main-content" className="workspace-main coaching-today">
    <header className="coaching-page-header"><div><p>{date}</p><h1>Một ngày đồng hành tốt hơn.</h1><p>Chào {viewer.profile.display_name}. Lịch tập, học viên và những việc cần bạn xem.</p></div><Link className="workspace-button" href="/workspace?create=1#new-trainee"><UserRoundPlus size={18}/> Thêm học viên</Link></header>
    <div className="coaching-today-layout"><div><Suspense fallback={<p role="status">Đang tải cuộc hẹn…</p>}><CoachingScheduleSummary isPt/></Suspense>
      <section className="coaching-attention"><div className="workspace-section-heading"><h2>Học viên cần bạn xem</h2><Link href="/workspace?filter=attention">Xem danh sách</Link></div>
        {warnings.length?<ul>{warnings.slice(0,5).map(item=><li key={item.id}><Link href={`/workspace/trainees/${item.id}`}><span className="workspace-avatar">{item.display_name.trim().charAt(0)}</span><div><strong>{item.display_name}</strong><span>Hơn ba ngày trọn vẹn chưa check-in</span></div><ArrowUpRight size={18}/></Link></li>)}</ul>:<div className="coaching-empty-line"><p>Hiện không có học viên trong nhóm cần nhắc check-in.</p><Link href="/workspace">Mở danh sách học viên</Link></div>}
      </section></div>
      <aside className="coaching-day-context"><NotebookPen size={24}/><h2>Giữ mọi việc trong một hồ sơ.</h2><p>Mở hồ sơ để xem lần đo gần nhất, ghi chú, dinh dưỡng và gói tập trước khi gặp học viên.</p><Link href="/workspace">Mở học viên <ArrowUpRight size={16}/></Link><dl><div><dt>Học viên đang quản lý</dt><dd>{trainees.length}</dd></div><div><dt>Chờ kết nối tài khoản</dt><dd>{pending.length}</dd></div></dl>{pending.length>0&&<Link href="/workspace?filter=pending">Xem lời mời đang chờ</Link>}</aside>
    </div>
  </main>;
}
