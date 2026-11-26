"use client";

import { useState } from "react";
import { Search, Users, UserCheck } from "lucide-react";
import type { AdminSnapshot } from "@/features/admin/live-data";

const date = (s: string) => new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(s));

export default function AdminUsersView({ snapshot: s }: { snapshot: AdminSnapshot }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "pt" | "trainee" | "admin">("all");

  const users = s.users.filter(
    (u) =>
      (roleFilter === "all" || u.role === roleFilter) &&
      u.display_name.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi")),
  );

  const roleLabel = (role: string) => (role === "admin" ? "Quản trị" : role === "pt" ? "Huấn luyện viên" : "Học viên");

  return (
    <div className="admin-content admin-users-page">
      <section className="admin-section">
        <div className="admin-toolbar">
          <div className="admin-section-title">
            <Users size={20} style={{ color: "var(--color-brand)" }} />
            <h2>Tài khoản hệ thống ({s.authAccounts} Auth)</h2>
            <span>Hiển thị {users.length} tài khoản</span>
          </div>

          <div className="admin-toolbar-controls">
            <div className="admin-filter-tabs" role="group" aria-label="Lọc theo vai trò">
              {(
                [
                  ["all", "Tất cả"],
                  ["pt", "PT"],
                  ["trainee", "Học viên"],
                  ["admin", "Admin"],
                ] as const
              ).map(([key, text]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRoleFilter(key)}
                  className={`admin-filter-btn${roleFilter === key ? " active" : ""}`}
                >
                  {text}
                </button>
              ))}
            </div>

            <label className="admin-search-box" aria-label="Tìm tên tài khoản">
              <Search size={15} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên..."
              />
            </label>
          </div>
        </div>

        <div className="admin-table-container" role="region" tabIndex={0} aria-label="Tài khoản database">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên hiển thị</th>
                <th>Vai trò</th>
                <th>Nguồn dữ liệu</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "32px", color: "var(--color-text-secondary)" }}>
                    Không tìm thấy tài khoản nào phù hợp với bộ lọc &quot;{query}&quot;
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="admin-user-cell">
                        <span className="admin-user-avatar">{u.display_name.trim().charAt(0).toUpperCase()}</span>
                        <strong>{u.display_name}</strong>
                      </div>
                    </td>
                    <td><span className={`admin-status-badge ${u.role}`}>{roleLabel(u.role)}</span></td>
                    <td>
                      <span className={`admin-status-badge ${u.is_test ? "warning" : "active"}`}>
                        {u.is_test ? "Dữ liệu thử" : "Hệ thống"}
                      </span>
                    </td>
                    <td>{date(u.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
