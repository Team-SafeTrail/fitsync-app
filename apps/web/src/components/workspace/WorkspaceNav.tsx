"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {UsersRound,LayoutDashboard,ArrowUpRight,CalendarDays,MessageCircle} from "lucide-react";
export default function WorkspaceNav({isPt}:{isPt:boolean}) {
 const path=usePathname();
 return <nav className="workspace-nav" aria-label="Điều hướng workspace">
  <Link href="/workspace" aria-current={path==="/workspace"?"page":undefined}>{isPt?<UsersRound size={18}/>:<LayoutDashboard size={18}/>}<span>{isPt?"Học viên":"Hôm nay"}</span></Link>
  {!isPt && <><Link href="/workspace#trainee-activity-title">Hoạt động của bạn</Link><Link href="/workspace#trainee-records-title">Chỉ số và tiến trình</Link></>}
  <Link href="/workspace/calendar" aria-current={path.startsWith("/workspace/calendar")?"page":undefined}><CalendarDays size={18}/><span>Lịch của bạn</span></Link>
  <Link href="/workspace/chat" aria-current={path.startsWith("/workspace/chat")?"page":undefined}>Trao đổi</Link>
  <Link href={isPt?"/app/dashboard":"/app/trainee"} target="_blank"><LayoutDashboard size={18}/><span>Bản mẫu công khai</span><ArrowUpRight size={14}/></Link>
 </nav>;
}

export function WorkspaceMobileNav({isPt}:{isPt:boolean}) {
 const path=usePathname();
 return <nav className="workspace-mobile-nav" aria-label="Điều hướng chính trên điện thoại">
  <Link href="/workspace" aria-current={path==="/workspace"?"page":undefined}>{isPt?<UsersRound size={20}/>:<LayoutDashboard size={20}/>}<span>{isPt?"Học viên":"Hôm nay"}</span></Link>
  <Link href="/workspace/calendar" aria-current={path.startsWith("/workspace/calendar")?"page":undefined}><CalendarDays size={20}/><span>Lịch của bạn</span></Link>
  <Link href="/workspace/chat" aria-current={path.startsWith("/workspace/chat")?"page":undefined}><MessageCircle size={20}/><span>Trao đổi</span></Link>
 </nav>;
}
