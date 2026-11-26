"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Wallet, BadgeCheck, FileText, ArrowRight } from "lucide-react";
import type { AdminSnapshot } from "@/features/admin/live-data";

const money = (v: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
const date = (s: string) => new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(s));

export default function AdminFinanceView({ snapshot: s }: { snapshot: AdminSnapshot }) {
  const netFlow = s.recordedRevenueVnd - s.recordedCostVnd;

  return (
    <div className="admin-content admin-finance-page">
      {/* Finance Overview Tile Strip */}
      <section className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">
            <Wallet size={20} style={{ color: "var(--color-brand)" }} />
            <h2>Tài chính thực tế</h2>
            <span>Chỉ tính các bút toán đã được quản trị viên đối soát thực tế</span>
          </div>
          <Link href="/admin/transactions" prefetch={true} className="admin-btn admin-btn-secondary">
            <FileText size={15} /> Sổ thu chi &amp; Chứng từ <ArrowRight size={14} />
          </Link>
        </div>

        <div className="admin-finance-strip">
          <div className="admin-finance-tile">
            <div className="admin-finance-label"><ArrowUpRight size={16} /> Thu thực tế</div>
            <strong style={{ color: "var(--color-brand)" }}>{money(s.recordedRevenueVnd)}</strong>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", marginTop: "4px" }}>
              Từ {s.paidCustomers} huấn luyện viên đã đối soát
            </span>
          </div>

          <div className="admin-finance-tile">
            <div className="admin-finance-label"><ArrowDownRight size={16} /> Chi thực tế</div>
            <strong style={{ color: "#e11d48" }}>{money(s.recordedCostVnd)}</strong>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", marginTop: "4px" }}>
              Chi phí server, vận hành & công cụ
            </span>
          </div>

          <div className="admin-finance-tile is-net">
            <div className="admin-finance-label">Dòng tiền thuần (Net Cashflow)</div>
            <strong style={{ color: netFlow >= 0 ? "var(--color-brand)" : "#e11d48" }}>
              {money(netFlow)}
            </strong>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", marginTop: "4px" }}>
              {netFlow >= 0 ? "Thặng dư dòng tiền" : "Cần bổ sung vốn"}
            </span>
          </div>
        </div>
      </section>

      {/* Breakdown Summary Grid */}
      <div className="fs-card-grid-2" style={{ marginTop: "24px" }}>
        <section className="admin-section" style={{ marginTop: 0 }}>
          <div className="admin-section-header">
            <div className="admin-section-title">
              <BadgeCheck size={18} style={{ color: "var(--color-brand)" }} />
              <h2>Khách hàng trả phí đối soát</h2>
              <span>{s.paidCustomers} PT</span>
            </div>
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            Doanh thu thực tế chỉ được ghi nhận khi có chứng từ chuyển khoản và quản trị viên đã đối soát khớp với mã sao kê ngân hàng.
          </p>
        </section>

        <section className="admin-section" style={{ marginTop: 0 }}>
          <div className="admin-section-header">
            <div className="admin-section-title">
              <h2>Giao dịch gần đây</h2>
              <span>{s.financeEntries.length} bút toán</span>
            </div>
          </div>
          {s.financeEntries.length === 0 ? (
            <p className="admin-empty-hint">Chưa có giao dịch đối soát nào.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {s.financeEntries.slice(0, 5).map((e) => (
                <li key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "var(--color-surface-muted)", borderRadius: "8px", fontSize: "0.85rem" }}>
                  <div>
                    <span className={`admin-status-badge ${e.kind === "income" ? "active" : "pending"}`} style={{ marginRight: "8px" }}>
                      {e.kind === "income" ? "Thu" : "Chi"}
                    </span>
                    <strong>{e.note}</strong>
                  </div>
                  <strong>{money(e.amount_vnd)}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
