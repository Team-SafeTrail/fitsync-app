"use client";

import { Activity, BadgeCheck, UserRoundCheck, Users, TrendingUp } from "lucide-react";
import type { AdminSnapshot } from "@/features/admin/live-data";
import { simulationSummary } from "@/features/admin/simulation-summary";

const money = (v: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
const date = (s: string) => new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(s));

export default function AdminOverviewView({ snapshot: s }: { snapshot: AdminSnapshot }) {
  const simulation = simulationSummary(s.financeEntries);

  return (
    <div className="admin-content admin-overview-page" data-testid="live-admin-dashboard">
      {simulation.visibleTestRows > 0 && (
        <details className="admin-section" data-testid="demo-finance-summary">
          <summary>Kịch bản mô phỏng — không tính kết quả kinh doanh thật</summary>
          <dl className="admin-kpi-grid" style={{ marginTop: "14px" }}>
            <div className="admin-kpi-card"><dt>PT thuê bao mô phỏng</dt><dd className="admin-kpi-value">{simulation.customers}</dd></div>
            <div className="admin-kpi-card"><dt>Thu mô phỏng</dt><dd className="admin-kpi-value">{money(simulation.revenue)}</dd></div>
            <div className="admin-kpi-card"><dt>Chi mô phỏng</dt><dd className="admin-kpi-value">{money(simulation.cost)}</dd></div>
            <div className="admin-kpi-card"><dt>Chênh lệch mô phỏng</dt><dd className="admin-kpi-value">{money(simulation.result)}</dd></div>
          </dl>
        </details>
      )}

      {/* Primary KPI Grid */}
      <section className="admin-kpi-grid" aria-label="Số liệu tổng quan đã ghi nhận">
        {[
          { label: "PT trong hệ thống", value: s.totalPts, sub: "Huấn luyện viên đang hoạt động", icon: UserRoundCheck },
          { label: "Hồ sơ học viên", value: s.totalTrainees, sub: "Tổng hồ sơ được tạo", icon: Users },
          { label: "Bản ghi InBody", value: s.totalInBodyRecords, sub: "Chỉ số đã xác minh", icon: Activity },
          { label: "PT trả phí đối soát", value: s.paidCustomers, sub: "Khách đã xác nhận thu tiền", icon: BadgeCheck },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div className="admin-kpi-card" key={label}>
            <div className="admin-kpi-header">
              <span className="admin-kpi-title">{label}</span>
              <span className="admin-kpi-icon"><Icon size={18} /></span>
            </div>
            <strong className="admin-kpi-value">{value}</strong>
            <span className="admin-kpi-meta">{sub}</span>
          </div>
        ))}
      </section>

      {/* Side-by-side: Billing Requests & Weekly Activity */}
      <div className="fs-card-grid-2" style={{ marginTop: "24px" }}>
        <section className="admin-section" style={{ marginTop: 0 }}>
          <div className="admin-section-header">
            <div className="admin-section-title">
              <h2>Yêu cầu nâng cấp</h2>
              <span>{s.billingRequests.length} yêu cầu</span>
            </div>
          </div>
          {s.billingRequests.length ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {s.billingRequests.map((b) => (
                <li key={b.id} style={{ padding: "12px 14px", background: "var(--color-surface-muted)", borderRadius: "10px", fontSize: "0.9rem" }}>
                  <strong>{s.users.find((u) => u.id === b.customer_id)?.display_name ?? b.customer_id}</strong>: {money(b.amount_vnd)} · <span className="admin-status-badge pending">{b.state}</span> · {date(b.created_at)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-empty-hint">Chưa có yêu cầu nâng cấp gói.</p>
          )}
        </section>

        <section className="admin-section" style={{ marginTop: 0 }}>
          <div className="admin-section-header">
            <div className="admin-section-title">
              <h2>Hoạt động theo tuần</h2>
              <span>{s.activeUsers7d} người dùng trong 7 ngày</span>
            </div>
          </div>
          <div className="admin-table-container" role="region" tabIndex={0} aria-label="Hoạt động theo tuần">
            <table className="admin-table">
              <thead><tr><th>Tuần</th><th>Sự kiện</th><th>Kênh</th><th>Lượt</th><th>TK</th></tr></thead>
              <tbody>
                {s.weeklyEvents.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--color-text-secondary)" }}>Chưa có sự kiện trong tuần</td></tr>
                ) : (
                  s.weeklyEvents.map((e) => (
                    <tr key={`${e.week}-${e.event_key}-${e.channel}`}>
                      <td>{e.week}</td>
                      <td>{e.event_key}</td>
                      <td>{e.channel}</td>
                      <td><strong>{e.events}</strong></td>
                      <td>{e.users}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
