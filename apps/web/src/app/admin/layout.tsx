import React from "react";
import Brand from "@/components/brand/Brand";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Users,
  CreditCard,
  ShieldCheck,
  ArrowUpRight,
  LogOut,
  Home,
  CheckCircle2,
  Server
} from "lucide-react";
import { getWorkspaceViewer } from "@/features/workspace/data";
import { logout } from "../auth/actions";
import "./admin.css";
import DemoNotice from "@/components/workspace/DemoNotice";

export const metadata = {
  title: "FitSync Admin Portal | Hệ Thống Quản Trị SafeTrail",
  description: "Trang kiểm tra quản trị FitSync cho KPI hệ thống và bộ dữ liệu demo OC2 được gắn nhãn rõ ràng.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getWorkspaceViewer();

  // If not logged in, redirect to login page with return URL
  if (!viewer) {
    redirect("/login?next=/admin");
  }

  if (viewer.profile.role !== "admin") {
    redirect("/workspace");
  }

  const displayName = viewer.profile.display_name || "Quản trị viên";
  const userRole = viewer.profile.role;

  return (
    <div className="admin-shell">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div>
          <Link href="/admin" className="admin-brand" aria-label="FitSync Admin Portal">
            <Brand />
          </Link>
          <span className="admin-portal-badge">Admin Console</span>

          <nav className="admin-nav" aria-label="Menu quản trị">
            <Link href="/admin" className="admin-nav-item active">
              <LayoutDashboard size={18} />
              <span>Tổng quan KPI</span>
            </Link>
            <a href="#finance-summary" className="admin-nav-item">
              <CheckCircle2 size={18} />
              <span>Tài chính thực tế</span>
            </a>
            <a href="#users-table" className="admin-nav-item">
              <Users size={18} />
              <span>Tài khoản hệ thống</span>
            </a>
            <a href="#transactions-table" className="admin-nav-item">
              <CreditCard size={18} />
              <span>Sổ thu chi</span>
            </a>
          </nav>
        </div>

        <div className="admin-sidebar-foot">
          <div className="admin-system-health">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "var(--color-text-primary)" }}>
              <span className="admin-system-health-dot" />
              <span>Quản trị đã xác thực</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={13} color="var(--color-brand)" />
              <span>RLS bảo vệ theo vai trò</span>
            </div>
          </div>

          <div className="admin-account-bar">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <div className="admin-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {displayName}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--color-brand)" }}>
                  {userRole === "admin" ? "System Admin" : userRole === "pt" ? "Coach Admin" : "Trainee"}
                </span>
              </div>
            </div>

            <form action={logout}>
              <button type="submit" className="admin-logout-btn" title="Đăng xuất" aria-label="Đăng xuất">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="admin-surface">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <span className="admin-topbar-eyebrow">FitSync Admin Console</span>
            <h1>Bảng điều khiển quản trị</h1>
            <p>Theo dõi PT, học viên, bản ghi InBody và sổ thu chi đối soát thực tế.</p>
          </div>

          <div className="admin-topbar-actions">

          </div>
        </header>

        {/* Content Page */}
        <main id="main-content"><DemoNotice />{children}</main>
      </div>
    </div>
  );
}
