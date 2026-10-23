import React from "react";
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
            <Activity size={24} color="#FF6B00" strokeWidth={2.5} />
            <span>
              fit<strong>sync</strong>
            </span>
          </Link>
          <span className="admin-portal-badge">Admin Console</span>

          <nav className="admin-nav" aria-label="Menu quản trị">
            <Link href="/admin" className="admin-nav-item active">
              <LayoutDashboard size={18} />
              <span>Tổng quan KPI</span>
            </Link>
            <a href="#users-table" className="admin-nav-item">
              <Users size={18} />
              <span>Quản lý Người dùng</span>
            </a>
            <a href="#transactions-table" className="admin-nav-item">
              <CreditCard size={18} />
              <span>Giao dịch VietQR</span>
            </a>
            <Link href="/workspace" className="admin-nav-item highlight">
              <Activity size={18} />
              <span>Vào PT Workspace</span>
              <ArrowUpRight size={14} />
            </Link>
            <Link href="/" className="admin-nav-item">
              <Home size={18} />
              <span>Về Trang chủ</span>
            </Link>
          </nav>
        </div>

        <div className="admin-sidebar-foot">
          {/* System Health */}
          <div className="admin-system-health">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, color: "#FFFFFF" }}>
              <span className="admin-system-health-dot" />
              <span>Phiên quản trị đã được xác thực</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Server size={12} color="#10B981" />
              <span>Supabase: kiểm tra theo môi trường triển khai</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={12} color="#10B981" />
              <span>RLS: được khai báo trong migrations</span>
            </div>
          </div>

          {/* User Account */}
          <div className="admin-account-bar">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="admin-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>
                  {displayName}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#FF6B00", textTransform: "capitalize" }}>
                  {userRole === "admin" ? "System Admin" : userRole === "pt" ? "Coach Admin" : "Trainee"}
                </span>
              </div>
            </div>

            <form action={logout}>
              <button type="submit" className="admin-logout-btn" title="Đăng xuất">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Surface Area */}
      <div className="admin-surface">
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <h1>Bảng Điều Khiển Quản Trị Hệ Thống</h1>
            <p>FitSync B2B SaaS Platform • Minh chứng kiểm thử Outcome 2 • SafeTrail Team</p>
          </div>

          <div className="admin-topbar-actions">
            <Link href="/workspace" className="admin-btn admin-btn-secondary">
              <Activity size={16} />
              <span>Mở PT Workspace</span>
            </Link>
            <Link href="/" className="admin-btn admin-btn-primary">
              <Home size={16} />
              <span>Trang Chủ</span>
            </Link>
          </div>
        </header>

        {/* Content Page */}
        <main>{children}</main>
      </div>
    </div>
  );
}
