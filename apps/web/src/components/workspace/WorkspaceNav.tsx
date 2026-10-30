"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {UsersRound,LayoutDashboard,CalendarDays,MessageCircle,ChartNoAxesCombined} from "lucide-react";
export default function WorkspaceNav({isPt}:{isPt:boolean}) {
 const path=usePathname();
 return <nav className="workspace-nav" aria-label="Điều hướng workspace">
  {isPt&&<Link href="/workspace/today" aria-current={path==="/workspace/today"?"page":undefined}><LayoutDashboard size={18}/><span>Hôm nay</span></Link>}
  <Link href="/workspace" aria-current={path==="/workspace"?"page":undefined}>{isPt?<UsersRound size={18}/>:<LayoutDashboard size={18}/>}<span>{isPt?"Học viên":"Hôm nay"}</span></Link>
  {!isPt && <><Link href="/workspace#trainee-activity-title">Hoạt động của bạn</Link><Link href="/workspace/progress" aria-current={path==="/workspace/progress"?"page":undefined}>Chỉ số và tiến trình</Link><Link href="/workspace#membership">Membership và ghi chú</Link></>}
  <Link href="/workspace/calendar" aria-current={path.startsWith("/workspace/calendar")?"page":undefined}><CalendarDays size={18}/><span>Lịch của bạn</span></Link>
  <Link href="/workspace/chat" aria-current={path.startsWith("/workspace/chat")?"page":undefined}><MessageCircle size={18}/><span>Trao đổi</span></Link>
 </nav>;
}

export function WorkspaceMobileNav({isPt}:{isPt:boolean}) {
 const path=usePathname();
 return <nav className="workspace-mobile-nav" aria-label="Điều hướng chính trên điện thoại">
  <Link href={isPt?"/workspace/today":"/workspace"} aria-current={path===(isPt?"/workspace/today":"/workspace")?"page":undefined}><LayoutDashboard size={20}/><span>Hôm nay</span></Link>
  {isPt?<Link href="/workspace" aria-current={path==="/workspace"||path.startsWith("/workspace/trainees/")?"page":undefined}><UsersRound size={20}/><span>Học viên</span></Link>:<Link href="/workspace/progress" aria-current={path==="/workspace/progress"?"page":undefined}><ChartNoAxesCombined size={20}/><span>Tiến trình</span></Link>}
  <Link href="/workspace/calendar" aria-current={path.startsWith("/workspace/calendar")?"page":undefined}><CalendarDays size={20}/><span>Lịch của bạn</span></Link>
  <Link href="/workspace/chat" aria-current={path.startsWith("/workspace/chat")?"page":undefined}><MessageCircle size={20}/><span>Trao đổi</span></Link>
 </nav>;
}
