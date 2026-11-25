"use client";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, BadgeCheck, Database, Download, Search, Users, UserRoundCheck, Wallet } from "lucide-react";
import { recordFinance, reverseFinance } from "@/features/admin/finance-actions";
import type { AdminSnapshot, FinanceEntry } from "@/features/admin/live-data";
import { initialWorkspaceActionState, type WorkspaceActionState } from "@/features/workspace/action-state";
import SubmitButton from "@/components/workspace/SubmitButton";
import { PendingFields, usePreservedForm } from "@/components/workspace/PreservedForm";
import { simulationSummary } from "@/features/admin/simulation-summary";

const money = (v: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
const date = (s: string) => new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(s));
function exportCsv(entries: FinanceEntry[]) {
  const rows = [["ID", "Loại", "Nhóm", "VND", "Ngày", "Tham chiếu", "Diễn giải", "Dữ liệu thử", "Đảo mục"], ...entries.map((e) => [e.id, e.kind, e.category, e.amount_vnd, e.occurred_at, e.bank_reference ?? "", e.note, String(e.is_test), e.reverses_id ?? ""])];
  const quote = (v: string | number) => `"${String(v).replace(/^[\s\uFEFF]*[=+@-]/, "'$&").replaceAll('"', '""')}"`;
  const url = URL.createObjectURL(new Blob(["\ufeff" + rows.map((r) => r.map(quote).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "fitsync-finance-recorded.csv";
  a.click();
  URL.revokeObjectURL(url);
}
function ReverseForm({ entry }: { entry: FinanceEntry }) {
  const preserved = usePreservedForm();
  const [state, action] = useActionState(reverseFinance.bind(null, entry.id), initialWorkspaceActionState);
  const [nonce, setNonce] = useState("");
  useEffect(() => setNonce(crypto.randomUUID()), []);
  return (
    <details>
      <summary>Thêm bút toán đảo</summary>
      <form ref={preserved.ref} onReset={preserved.onReset} action={action}>
        <PendingFields disabled={!nonce}>
          <input type="hidden" name="nonce" value={nonce} />
          <label>Lý do điều chỉnh<input name="reason" minLength={5} maxLength={500} required /></label>
          <label><input name="confirmed" type="checkbox" required /> Đã đối chiếu; cần đảo giao dịch và quyền gói liên quan</label>
          <SubmitButton className="admin-btn admin-btn-primary" idle="Xác nhận điều chỉnh" pending="Đang đối chiếu…" />
          {state.message && <p role="status">{state.message}</p>}
        </PendingFields>
      </form>
    </details>
  );
}
export default function LiveAdminDashboard({ snapshot: s }: { snapshot: AdminSnapshot }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "pt" | "trainee" | "admin">("all");
  const preserved = usePreservedForm();
  const [recorded, record] = useActionState(
    async (previous: WorkspaceActionState, form: FormData): Promise<WorkspaceActionState> => {
      try {
        const result = await recordFinance(previous, form);
        if (result.status === "success") {
          preserved.reset();
          setNonce(crypto.randomUUID());
        }
        return result;
      } catch {
        return { status: "error", message: "Chưa xác nhận được lần ghi. Chứng từ và thông tin vẫn được giữ." };
      }
    },
    initialWorkspaceActionState,
  );
  const [nonce, setNonce] = useState("");
  useEffect(() => setNonce(crypto.randomUUID()), []);
  const reversed = new Set(s.financeEntries.flatMap((e) => (e.reverses_id ? [e.reverses_id] : [])));
  const simulation = simulationSummary(s.financeEntries);
  const users = s.users.filter(
    (u) =>
      (roleFilter === "all" || u.role === roleFilter) &&
      u.display_name.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi")),
  );
  const roleLabel = (role: string) => (role === "admin" ? "Quản trị" : role === "pt" ? "Huấn luyện viên" : "Học viên");
  const kindLabel = (kind: string) => (kind === "income" ? "Thu" : kind === "expense" ? "Chi" : "Đảo bút toán");

  return (
    <div className="admin-content live-admin-dashboard" data-testid="live-admin-dashboard">
      <p role="status" className="admin-status-bar">
        <Database size={16} aria-hidden="true" />
        <span>
          <strong>Database trực tiếp · Cập nhật {date(s.checkedAt)}</strong> — Doanh thu thực tế loại trừ hoàn toàn giao dịch thử.
        </span>
      </p>

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

      <section className="admin-kpi-grid" aria-label="Số liệu đã ghi nhận">
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

      <section id="finance-summary" className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">
            <Wallet size={19} style={{ color: "var(--color-brand)" }} />
            <h2>Tài chính thực tế</h2>
            <span>Chỉ tính bút toán đã đối soát</span>
          </div>
        </div>
        <div className="admin-finance-strip">
          <div className="admin-finance-tile">
            <div className="admin-finance-label"><ArrowUpRight size={15} /> Thu thực tế</div>
            <strong>{money(s.recordedRevenueVnd)}</strong>
          </div>
          <div className="admin-finance-tile">
            <div className="admin-finance-label"><ArrowDownRight size={15} /> Chi thực tế</div>
            <strong>{money(s.recordedCostVnd)}</strong>
          </div>
          <div className="admin-finance-tile is-net">
            <div className="admin-finance-label">Dòng tiền thuần</div>
            <strong>{money(s.recordedRevenueVnd - s.recordedCostVnd)}</strong>
          </div>
        </div>
      </section>

      <section id="users-table" className="admin-section">
        <div className="admin-toolbar">
          <div className="admin-section-title">
            <h2>Tài khoản ({s.authAccounts} Auth)</h2>
            <span>Hiển thị {users.length}</span>
          </div>
          <div className="admin-toolbar-controls">
            <div className="admin-filter-tabs" role="group" aria-label="Lọc vai trò">
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
            <thead><tr><th>Tên hiển thị</th><th>Vai trò</th><th>Nguồn</th><th>Ngày tạo</th></tr></thead>
            <tbody>
              {users.map((u) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="transactions-table" className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">
            <h2>Sổ thu–chi và chứng từ</h2>
            <span>{s.financeEntries.length} bút toán</span>
          </div>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => exportCsv(s.financeEntries)}>
            <Download size={15} /> Xuất sổ CSV
          </button>
        </div>
        {s.financeEntries.length === 0 ? (
          <p className="admin-empty-hint">Chưa có giao dịch được ghi sổ.</p>
        ) : (
          <div className="admin-table-container" role="region" tabIndex={0} aria-label="Sổ thu chi">
            <table className="admin-table">
              <thead><tr><th>Ngày</th><th>Loại</th><th>Số tiền</th><th>Mã và diễn giải</th><th>Nguồn</th><th>Chứng từ</th></tr></thead>
              <tbody>
                {s.financeEntries.map((e) => (
                  <tr key={e.id}>
                    <td>{date(e.occurred_at)}</td>
                    <td><span className={`admin-status-badge ${e.kind === "income" ? "active" : "pending"}`}>{kindLabel(e.kind)}</span></td>
                    <td><strong>{money(e.amount_vnd)}</strong></td>
                    <td>{e.bank_reference}<p>{e.note}</p></td>
                    <td>{e.is_test ? "Dữ liệu thử" : "Admin đã đối soát"}</td>
                    <td>
                      {e.signedUrl && <a href={e.signedUrl} rel="noreferrer">Tải chứng từ riêng</a>}
                      {e.kind !== "reversal" && !reversed.has(e.id) && <ReverseForm entry={e} />}
                      <small>SHA-256: {e.evidence_sha256.slice(0, 12)}…</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <details style={{ marginTop: "14px" }}>
          <summary>Ghi giao dịch đã đối soát</summary>
          <form ref={preserved.ref} onReset={preserved.onReset} action={record} className="admin-finance-form" aria-label="Ghi sổ tài chính">
            <PendingFields disabled={!nonce}>
              <input type="hidden" name="nonce" value={nonce} />
              <label>Loại giao dịch<select name="kind"><option value="income">Thu</option><option value="expense">Chi</option></select></label>
              <label>Nhóm<select name="category"><option value="subscription">Phí FitSync 199.000đ/PT/tháng</option><option value="hosting">Hosting</option><option value="marketing">Marketing</option><option value="tools">Công cụ</option><option value="other">Khác</option></select></label>
              <label>Khách PT<select name="customer"><option value="">Không áp dụng cho chi phí</option>{s.users.filter((u) => u.role === "pt").map((u) => <option key={u.id} value={u.id}>{u.display_name}{u.is_test ? " (thử)" : ""}</option>)}</select></label>
              <label>Số tiền VND<input name="amount" type="number" min={1} max={1e10} step={1} defaultValue={199000} required /></label>
              <label>Thời gian giao dịch (kèm múi giờ)<input name="transactedAt" placeholder="2026-11-17T17:30:00+07:00" required /></label>
              <label>Mã tham chiếu trên sao kê<input name="reference" minLength={3} maxLength={120} required /></label>
              <label>Diễn giải<input name="note" minLength={5} maxLength={500} required /></label>
              <label>Chứng từ riêng tư (PDF, JPEG, PNG ≤5 MB)<input name="receipt" type="file" accept="application/pdf,image/jpeg,image/png" required /></label>
              <label><input name="isTest" type="checkbox" /> Giao dịch thử, không tính doanh thu hoặc cấp Pro</label>
              <label><input name="verified" type="checkbox" required /> Đã đối chiếu số tiền, khách và mã giao dịch</label>
              <SubmitButton className="admin-btn admin-btn-primary" idle="Ghi giao dịch và chứng từ" pending="Đang ghi sổ…" />
              {recorded.message && <p role={recorded.status === "error" ? "alert" : "status"}>{recorded.message}</p>}
            </PendingFields>
          </form>
        </details>
      </section>

      <div className="fs-card-grid-2" style={{ marginTop: "20px" }}>
        <section className="admin-section" style={{ marginTop: 0 }}>
          <h2>Yêu cầu nâng cấp</h2>
          {s.billingRequests.length ? (
            <ul>{s.billingRequests.map((b) => <li key={b.id}>{s.users.find((u) => u.id === b.customer_id)?.display_name ?? b.customer_id}: {money(b.amount_vnd)} · {b.state} · {date(b.created_at)}</li>)}</ul>
          ) : (
            <p>Chưa có yêu cầu.</p>
          )}
        </section>

        <section className="admin-section" style={{ marginTop: 0 }}>
          <h2>Hoạt động theo tuần ({s.activeUsers7d} trong 7 ngày)</h2>
          <div className="admin-table-container" role="region" tabIndex={0} aria-label="Hoạt động theo tuần">
            <table className="admin-table">
              <thead><tr><th>Tuần</th><th>Sự kiện</th><th>Kênh</th><th>Lượt</th><th>TK</th></tr></thead>
              <tbody>{s.weeklyEvents.map((e) => <tr key={`${e.week}-${e.event_key}-${e.channel}`}><td>{e.week}</td><td>{e.event_key}</td><td>{e.channel}</td><td>{e.events}</td><td>{e.users}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
