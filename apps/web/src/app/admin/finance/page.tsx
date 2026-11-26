import React from "react";
import { redirect } from "next/navigation";
import { getLiveAdminData } from "@/features/admin/live-data";
import { getWorkspaceViewer } from "@/features/workspace/data";
import AdminFinanceView from "@/components/admin/AdminFinanceView";

export const dynamic = "force-dynamic";

export default async function AdminFinancePage() {
  const viewer = await getWorkspaceViewer();
  if (!viewer) {
    redirect("/login?next=/admin/finance");
  }
  if (viewer.profile.role !== "admin") {
    redirect("/workspace");
  }

  const { snapshot, error } = await getLiveAdminData();

  return snapshot ? (
    <AdminFinanceView snapshot={snapshot} />
  ) : (
    <section className="admin-section">
      <h2>Chưa tải được dữ liệu quản trị</h2>
      <p role="alert">{error}</p>
    </section>
  );
}
