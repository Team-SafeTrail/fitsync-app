import React from "react";
import { redirect } from "next/navigation";
import { getAdminDashboardData } from "@/features/admin/data";
import { getWorkspaceViewer } from "@/features/workspace/data";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const viewer = await getWorkspaceViewer();
  if (!viewer) {
    redirect("/login?next=/admin");
  }
  if (viewer.profile.role !== "admin") {
    redirect("/workspace");
  }

  const { kpi, users, transactions } = await getAdminDashboardData();

  return (
    <AdminDashboardClient
      kpi={kpi}
      users={users}
      transactions={transactions}
    />
  );
}
