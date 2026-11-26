"use client";

import { useEffect, useState, useActionState } from "react";
import { CreditCard, Download, FileText } from "lucide-react";
import { recordFinance, reverseFinance } from "@/features/admin/finance-actions";
import type { AdminSnapshot, FinanceEntry } from "@/features/admin/live-data";
import { initialWorkspaceActionState, type WorkspaceActionState } from "@/features/workspace/action-state";
import SubmitButton from "@/components/workspace/SubmitButton";
import { PendingFields, usePreservedForm } from "@/components/workspace/PreservedForm";

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
    <details style={{ marginTop: "6px" }}>
      <summary style={{ fontSize: "0.8rem", color: "#e11d48", cursor: "pointer" }}>Thêm bút toán đảo</summary>
      <form ref={preserved.ref} onReset={preserved.onReset} action={action} style={{ marginTop: "8px", padding: "10px", background: "var(--color-surface-muted)", borderRadius: "8px" }}>
        <PendingFields disabled={!nonce}>
          <input type="hidden" name="nonce" value={nonce} />
          <label style={{ display: "block", marginBottom: "8px", fontSize: "0.85rem" }}>
            Lý do điều chỉnh
            <input name="reason" minLength={5} maxLength={500} required style={{ display: "block", width: "100%", marginTop: "4px" }} />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", marginBottom: "8px" }}>
            <input name="confirmed" type="checkbox" required /> Đã đối chiếu; cần đảo giao dịch và quyền gói liên quan
          </label>
          <SubmitButton className="admin-btn admin-btn-primary" idle="Xác nhận điều chỉnh" pending="Đang đối chiếu…" />
          {state.message && <p role="status" style={{ fontSize: "0.8rem", marginTop: "6px" }}>{state.message}</p>}
        </PendingFields>
      </form>
    </details>
  );
}

export default function AdminTransactionsView({ snapshot: s }: { snapshot: AdminSnapshot }) {
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
  const kindLabel = (kind: string) => (kind === "income" ? "Thu" : kind === "expense" ? "Chi" : "Đảo bút toán");

  return (
    <div className="admin-content admin-transactions-page">
      <section className="admin-section">
        <div className="admin-section-header">
          <div className="admin-section-title">
            <CreditCard size={20} style={{ color: "var(--color-brand)" }} />
            <h2>Sổ thu–chi và chứng từ</h2>
            <span>{s.financeEntries.length} bút toán đã ghi</span>
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
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Loại</th>
                  <th>Số tiền</th>
                  <th>Mã và diễn giải</th>
                  <th>Nguồn</th>
                  <th>Chứng từ &amp; Điều chỉnh</th>
                </tr>
              </thead>
              <tbody>
                {s.financeEntries.map((e) => (
                  <tr key={e.id}>
                    <td>{date(e.occurred_at)}</td>
                    <td>
                      <span className={`admin-status-badge ${e.kind === "income" ? "active" : "pending"}`}>
                        {kindLabel(e.kind)}
                      </span>
                    </td>
                    <td><strong>{money(e.amount_vnd)}</strong></td>
                    <td>
                      {e.bank_reference && <code>{e.bank_reference}</code>}
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem" }}>{e.note}</p>
                    </td>
                    <td>{e.is_test ? "Dữ liệu thử" : "Admin đã đối soát"}</td>
                    <td>
                      {e.signedUrl && (
                        <div style={{ marginBottom: "4px" }}>
                          <a href={e.signedUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.85rem", color: "var(--color-brand)", textDecoration: "underline" }}>
                            Tải chứng từ riêng
                          </a>
                        </div>
                      )}
                      {e.kind !== "reversal" && !reversed.has(e.id) && <ReverseForm entry={e} />}
                      <small style={{ color: "var(--color-text-secondary)", fontSize: "0.75rem", display: "block", marginTop: "4px" }}>
                        SHA-256: {e.evidence_sha256.slice(0, 12)}…
                      </small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Entry Form Accordion */}
        <details style={{ marginTop: "24px" }}>
          <summary style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-brand)", cursor: "pointer" }}>
            + Ghi nhận giao dịch đã đối soát mới
          </summary>
          <form ref={preserved.ref} onReset={preserved.onReset} action={record} className="admin-finance-form" aria-label="Ghi sổ tài chính" style={{ marginTop: "16px" }}>
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
              {recorded.message && <p role={recorded.status === "error" ? "alert" : "status"} style={{ marginTop: "10px" }}>{recorded.message}</p>}
            </PendingFields>
          </form>
        </details>
      </section>
    </div>
  );
}
