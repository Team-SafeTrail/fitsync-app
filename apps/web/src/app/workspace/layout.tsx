import WorkspaceNav, {WorkspaceMobileNav} from "@/components/workspace/WorkspaceNav";
import Link from "next/link";
import Brand from "@/components/brand/Brand";
import { redirect } from "next/navigation";
import { ArrowUpRight, LayoutDashboard, LogOut, ShieldCheck, UsersRound } from "lucide-react";
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
            <Brand />
          </Link>
          <span className="workspace-product-label">{isPt ? "Không gian PT" : "Không gian học viên"}</span>
        </div>

        <WorkspaceNav isPt={isPt} />

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
            <Brand />
          </Link>
          <div className="workspace-account">
            <span className="workspace-account-avatar">{viewer.profile.display_name.trim().charAt(0).toUpperCase()}</span>
            <form action={logout}><button type="submit" aria-label="Đăng xuất"><LogOut size={17} /></button></form>
          </div>
        </header>
        {children}
        <WorkspaceMobileNav isPt={isPt}/>
      </div>
    </div>
  );
}
