import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, ArrowUpRight, LayoutDashboard, LogOut, ShieldCheck, UsersRound } from "lucide-react";
import { logout } from "../auth/actions";
import { getWorkspaceViewer } from "@/features/workspace/data";
import "./workspace.css";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getWorkspaceViewer();
  if (!viewer) redirect("/login");
  const isPt = viewer.profile.role === "pt";

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <div>
          <Link href="/workspace" className="workspace-brand" aria-label="FitSync Workspace, về tổng quan">
            <Activity size={22} strokeWidth={2.2} />
            <span>fit<strong>sync</strong></span>
          </Link>
          <span className="workspace-product-label">{isPt ? "Coach workspace" : "Trainee workspace"}</span>
        </div>

        <nav className="workspace-nav" aria-label="Điều hướng workspace">
          <Link href="/workspace" aria-current="page">
            {isPt ? <UsersRound size={18} /> : <LayoutDashboard size={18} />}
            <span>{isPt ? "Học viên" : "Tổng quan"}</span>
          </Link>
          <Link href="/app/dashboard" target="_blank">
            <LayoutDashboard size={18} />
            <span>Bản mẫu công khai</span>
            <ArrowUpRight size={14} />
          </Link>
        </nav>

        <div className="workspace-sidebar-foot">
          <div className="workspace-security-note"><ShieldCheck size={16} /><span>Dữ liệu thật được bảo vệ theo vai trò.</span></div>
          <div className="workspace-account">
            <span className="workspace-account-avatar">{viewer.profile.display_name.trim().charAt(0).toUpperCase()}</span>
            <div>
              <strong>{viewer.profile.display_name}</strong>
              <span>{isPt ? "Huấn luyện viên" : "Học viên"}</span>
            </div>
            <form action={logout}>
              <button type="submit" aria-label="Đăng xuất"><LogOut size={17} /></button>
            </form>
          </div>
        </div>
      </aside>

      <div className="workspace-surface">
        <header className="workspace-mobile-header">
          <Link href="/workspace" className="workspace-brand" aria-label="FitSync Workspace, về tổng quan">
            <Activity size={21} strokeWidth={2.2} /><span>fit<strong>sync</strong></span>
          </Link>
          <div className="workspace-account">
            <span className="workspace-account-avatar">{viewer.profile.display_name.trim().charAt(0).toUpperCase()}</span>
            <form action={logout}><button type="submit" aria-label="Đăng xuất"><LogOut size={17} /></button></form>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
