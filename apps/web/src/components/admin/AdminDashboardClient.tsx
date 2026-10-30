"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  FileSpreadsheet,
  CreditCard,
  Search,
  ShieldCheck,
  ArrowUpRight,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Filter
} from "lucide-react";
import type { AdminKPI, AdminUserItem, VietQRTransaction } from "@/features/admin/data";

interface AdminDashboardClientProps {
  kpi: AdminKPI;
  users: AdminUserItem[];
  transactions: VietQRTransaction[];
}

export default function AdminDashboardClient({
  kpi,
  users,
  transactions,
}: AdminDashboardClientProps) {
  // State for Users Table
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "pt" | "trainee" | "admin">("all");

  // State for Transactions Table
  const [txSearch, setTxSearch] = useState("");

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        (u.phone && u.phone.includes(userSearch));
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, userSearch, roleFilter]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      return (
        tx.orderCode.toLowerCase().includes(txSearch.toLowerCase()) ||
        tx.userName.toLowerCase().includes(txSearch.toLowerCase()) ||
        tx.planName.toLowerCase().includes(txSearch.toLowerCase())
      );
    });
  }, [transactions, txSearch]);

  const exportUsersCsv = () => {
    const headers = ["ID,Họ và Tên,Email,Số điện thoại,Vai trò,Phòng Gym,Trạng thái,Số bản ghi InBody,Bảo vệ RLS\n"];
    const rows = filteredUsers.map(
      (u) =>
        `"${u.id}","${u.displayName}","${u.email}","${u.phone || ""}","${u.role}","${u.gymAffiliation || ""}","${u.status}","${u.inbodyCount}","${u.rlsProtected ? "Có" : "Không"}"`
    );
    const blob = new Blob([headers.concat(rows.join("\n")).join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `FitSync_Users_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-content">
      <div
        role="status"
        style={{
          border: "1px solid rgba(245, 158, 11, 0.45)",
          background: "rgba(245, 158, 11, 0.1)",
          borderRadius: "12px",
          padding: "14px 18px",
          color: "var(--color-warning)",
          lineHeight: 1.5,
        }}
      >
        <strong>Dữ liệu demo OC2:</strong>{" "}
        {kpi.dataMode === "live_counts"
          ? "ba KPI người dùng/InBody được đọc từ Supabase; bảng chi tiết và VietQR bên dưới vẫn là dữ liệu tổng hợp mô phỏng."
          : "toàn bộ KPI và bảng bên dưới là dữ liệu synthetic để kiểm thử giao diện, không phải người dùng hay doanh thu thực."}
      </div>

      {/* KPI Cards Grid */}
      <section className="admin-kpi-grid">
        {/* KPI 1: Tổng PT */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Tổng Huấn Luyện Viên PT</span>
            <div className="admin-kpi-icon" style={{ backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }}>
              <Users size={22} />
            </div>
          </div>
          <p className="admin-kpi-value">{kpi.totalPts}</p>
          <div className="admin-kpi-meta">
            <span className="admin-kpi-badge positive">{kpi.dataMode === "live_counts" ? "Live" : "Synthetic"}</span>
            <span>• Không chứa danh tính thật</span>
          </div>
        </div>

        {/* KPI 2: Tổng Học Viên */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Tổng Học Viên Hoạt Động</span>
            <div className="admin-kpi-icon" style={{ backgroundColor: "var(--color-brand-light)", color: "var(--color-brand)" }}>
              <UserCheck size={22} />
            </div>
          </div>
          <p className="admin-kpi-value">{kpi.totalTrainees}</p>
          <div className="admin-kpi-meta">
            <span className="admin-kpi-badge positive">{kpi.activeRatePercent}%</span>
            <span>• Tỷ lệ của bộ dữ liệu demo</span>
          </div>
        </div>

        {/* KPI 3: Bản ghi InBody */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Bản Ghi InBody Đã Xác Nhận</span>
            <div className="admin-kpi-icon" style={{ backgroundColor: "var(--color-brand-light)", color: "var(--color-success)" }}>
              <FileSpreadsheet size={22} />
            </div>
          </div>
          <p className="admin-kpi-value">{kpi.totalInBodyRecords}</p>
          <div className="admin-kpi-meta">
            <span className="admin-kpi-badge positive">Đã gắn nhãn nguồn</span>
            <span>• 5 chỉ số được kiểm tra miền giá trị</span>
          </div>
        </div>

        {/* KPI 4: Doanh thu VietQR */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Kịch Bản VietQR Mô Phỏng</span>
            <div className="admin-kpi-icon" style={{ backgroundColor: "rgba(168, 85, 247, 0.15)", color: "var(--color-brand)" }}>
              <CreditCard size={22} />
            </div>
          </div>
          <p className="admin-kpi-value" style={{ color: "var(--color-success)" }}>
            {kpi.totalRevenueVnd.toLocaleString("vi-VN")} đ
          </p>
          <div className="admin-kpi-meta">
            <span className="admin-kpi-badge positive">Synthetic</span>
            <span>• 3 giao dịch mẫu, chưa đối soát thật</span>
          </div>
        </div>
      </section>

      {/* Security & Multi-tenant RLS Notice */}
      <div
        style={{
          backgroundColor: "var(--color-brand-light)",
          border: "1px solid var(--color-brand-light)",
          borderRadius: "12px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ShieldCheck size={24} color="var(--color-success)" />
          <div>
            <div style={{ color: "var(--color-text-primary)", fontWeight: 700, fontSize: "0.95rem" }}>
              Ranh giới bảo mật dữ liệu (được kiểm chứng bằng migration/pgTAP)
            </div>
            <div style={{ color: "var(--color-text-secondary)", fontSize: "0.82rem" }}>
              Mỗi PT chỉ có quyền truy cập học viên được phân công. Bản ghi sức khỏe InBody và ảnh bữa ăn cách ly hoàn toàn theo Tenant ID.
            </div>
          </div>
        </div>
        <Link href="/workspace" className="admin-btn admin-btn-primary" style={{ fontSize: "0.82rem" }}>
          <span>Truy Cập PT Workspace</span>
          <ArrowUpRight size={15} />
        </Link>
      </div>

      {/* Section 1: Quản Trị Người Dùng & Phân Quyền */}
      <section id="users-table" className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">
            <Users size={22} color="var(--color-brand)" />
            <h2>Tài Khoản Mẫu & Phân Quyền</h2>
            <span>{filteredUsers.length} tài khoản</span>
          </div>

          <button onClick={exportUsersCsv} className="admin-btn admin-btn-secondary" title="Xuất dữ liệu CSV">
            <Download size={16} />
            <span>Xuất CSV</span>
          </button>
        </div>

        {/* Toolbar: Search + Filter Tabs in single row */}
        <div className="admin-toolbar">
          <div className="admin-search-box">
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>

          <div className="admin-filter-tabs">
            <button
              className={`admin-filter-btn ${roleFilter === "all" ? "active" : ""}`}
              onClick={() => setRoleFilter("all")}
            >
              Tất cả ({users.length})
            </button>
            <button
              className={`admin-filter-btn ${roleFilter === "pt" ? "active" : ""}`}
              onClick={() => setRoleFilter("pt")}
            >
              Huấn luyện viên ({users.filter((u) => u.role === "pt").length})
            </button>
            <button
              className={`admin-filter-btn ${roleFilter === "trainee" ? "active" : ""}`}
              onClick={() => setRoleFilter("trainee")}
            >
              Học viên ({users.filter((u) => u.role === "trainee").length})
            </button>
            <button
              className={`admin-filter-btn ${roleFilter === "admin" ? "active" : ""}`}
              onClick={() => setRoleFilter("admin")}
            >
              Admin ({users.filter((u) => u.role === "admin").length})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-table-container" role="region" aria-label="Danh sách người dùng mẫu" tabIndex={0}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>HỌ VÀ TÊN</th>
                <th>VAI TRÒ</th>
                <th>EMAIL / ĐĂNG NHẬP</th>
                <th>SỐ ĐIỆN THOẠI</th>
                <th>ĐƠN VỊ / PHÒNG GYM</th>
                <th>TRẠNG THÁI</th>
                <th>SỐ ĐO INBODY</th>
                <th>BẢO MẬT RLS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          backgroundColor:
                            user.role === "admin"
                              ? "rgba(168, 85, 247, 0.2)"
                              : user.role === "pt"
                              ? "var(--color-brand-light)"
                              : "var(--color-brand-light)",
                          color:
                            user.role === "admin"
                              ? "var(--color-brand)"
                              : user.role === "pt"
                              ? "var(--color-brand)"
                              : "var(--color-brand)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        {user.displayName.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{user.displayName}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-status-badge ${user.role}`}>
                      {user.role === "admin" ? "Quản trị viên" : user.role === "pt" ? "Huấn luyện viên" : "Học viên"}
                    </span>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || "—"}</td>
                  <td>{user.gymAffiliation || "FitSync Workspace"}</td>
                  <td>
                    {user.status === "active" ? (
                      <span className="admin-status-badge active">
                        <CheckCircle2 size={13} /> Hoạt động
                      </span>
                    ) : user.status === "warning" ? (
                      <span className="admin-status-badge warning">
                        <AlertTriangle size={13} /> Cảnh báo 3 ngày
                      </span>
                    ) : (
                      <span className="admin-status-badge pending">
                        <Clock size={13} /> Đang chờ
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: user.inbodyCount > 0 ? "var(--color-success)" : "var(--color-text-muted)" }}>
                      {user.inbodyCount} bản ghi
                    </span>
                  </td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--color-success)", fontSize: "0.78rem" }}>
                      <ShieldCheck size={14} /> Cách ly
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Quản Trị Đơn Hàng & Giao Dịch VietQR */}
      <section id="transactions-table" className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">
            <CreditCard size={22} color="var(--color-success)" />
            <h2>Kịch Bản Đơn Hàng & VietQR Mô Phỏng</h2>
            <span>{filteredTransactions.length} giao dịch</span>
          </div>

          <div className="admin-search-box" style={{ minWidth: "240px" }}>
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn, người trả..."
              value={txSearch}
              onChange={(e) => setTxSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-container" role="region" aria-label="Giao dịch VietQR mẫu" tabIndex={0}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>MÃ ĐƠN HÀNG</th>
                <th>NGƯỜI THANH TOÁN</th>
                <th>VAI TRÒ</th>
                <th>GÓI DỊCH VỤ</th>
                <th>SỐ TIỀN</th>
                <th>PHƯƠNG THỨC</th>
                <th>TRẠNG THÁI</th>
                <th>THỜI GIAN</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <span style={{ fontFamily: "monospace", color: "var(--color-brand)", fontWeight: 700 }}>
                      {tx.orderCode}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>{tx.userName}</td>
                  <td>
                    <span className={`admin-status-badge ${tx.userRole === "PT" ? "pt" : "trainee"}`}>
                      {tx.userRole}
                    </span>
                  </td>
                  <td>{tx.planName}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: "var(--color-success)" }}>
                      {tx.amountVnd.toLocaleString("vi-VN")} đ
                    </span>
                  </td>
                  <td>{tx.paymentMethod}</td>
                  <td>
                    {tx.status === "success" ? (
                      <span className="admin-status-badge active">
                        <CheckCircle2 size={13} /> Đã thanh toán
                      </span>
                    ) : (
                      <span className="admin-status-badge warning">
                        <Clock size={13} /> Chờ xác nhận
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                    {new Date(tx.paidAt).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
