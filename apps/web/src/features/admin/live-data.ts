import "server-only";
import { cache } from "react";
import { getWorkspaceViewer } from "@/features/workspace/data";
import { createClient } from "@/lib/supabase/server";

export type FinanceEntry = {
  id: string; kind: "income" | "expense" | "reversal"; category: string; amount_vnd: number;
  customer_id: string | null; bank_reference: string | null; occurred_at: string; note: string;
  is_test: boolean; reverses_id: string | null; evidence_path: string; evidence_sha256: string; signedUrl?: string;
};
export type AdminSnapshot = {
  checkedAt: string; totalPts: number; totalTrainees: number; totalInBodyRecords: number; authAccounts: number;
  trackingSince: string | null; activeUsers7d: number; paidCustomers: number; recordedRevenueVnd: number; recordedCostVnd: number;
  users: { id: string; display_name: string; role: "pt" | "trainee" | "admin"; created_at: string; is_test: boolean }[];
  financeEntries: FinanceEntry[];
  billingRequests: { id: string; customer_id: string; state: string; created_at: string; amount_vnd: number }[];
  weeklyEvents: { week: string; event_key: string; channel: string; events: number; users: number }[];
};
export const getLiveAdminData = cache(async (): Promise<{ snapshot: AdminSnapshot | null; error: string | null }> => {
  if ((await getWorkspaceViewer())?.profile.role !== "admin") throw new Error("Admin authorization required.");
  const db = await createClient();
  const { data, error } = await db.rpc("get_admin_overview");
  if (error || !data || typeof data !== "object" || Array.isArray(data)) return { snapshot: null, error: "Chưa tải được dữ liệu quản trị. Kiểm tra migration và kết nối database; số liệu mẫu sẽ không được thay vào đây." };
  const snapshot = data as unknown as AdminSnapshot;
  if (!Array.isArray(snapshot.users) || !Array.isArray(snapshot.financeEntries) || !Array.isArray(snapshot.weeklyEvents) || !Number.isFinite(snapshot.recordedRevenueVnd)) return { snapshot: null, error: "Dữ liệu quản trị chưa đúng phiên bản schema." };
  const paths = [...new Set(snapshot.financeEntries.map(e => e.evidence_path))];
  if (paths.length) {
    const { data: files } = await db.storage.from("finance-evidence").createSignedUrls(paths, 60, { download: true });
    const urls = new Map(files?.map(f => [f.path, f.signedUrl]) ?? []);
    snapshot.financeEntries = snapshot.financeEntries.map(e => ({ ...e, signedUrl: urls.get(e.evidence_path) }));
  }
  return { snapshot, error: null };
});
