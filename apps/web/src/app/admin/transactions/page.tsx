import React from "react";
import { redirect } from "next/navigation";
import { getLiveAdminData } from "@/features/admin/live-data";
import { getWorkspaceViewer } from "@/features/workspace/data";
import AdminTransactionsView from "@/components/admin/AdminTransactionsView";

export const dynamic = "force-dynamic";

export default async function AdminTransactionsPage() {
  const viewer = await getWorkspaceViewer();
  if (!viewer) {
    redirect("/login?next=/admin/transactions");
  }
  if (viewer.profile.role !== "admin") {
    redirect("/workspace");
  }

  const { snapshot, error } = await getLiveAdminData();

  return snapshot ? (
    <AdminTransactionsView snapshot={snapshot} />
  ) : (
    <section className="admin-section">
      <h2>Chưa tải được dữ liệu quản trị</h2>
      <p role="alert">{error}</p>
    </section>
  );
}
