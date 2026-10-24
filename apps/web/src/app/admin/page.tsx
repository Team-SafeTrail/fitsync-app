import React from "react";
import { getAdminDashboardData } from "@/features/admin/data";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { kpi, users, transactions } = await getAdminDashboardData();

  return (
    <AdminDashboardClient
      kpi={kpi}
      users={users}
      transactions={transactions}
    />
  );
}
