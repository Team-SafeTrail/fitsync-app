import React from "react";
import { redirect } from "next/navigation";
import { getLiveAdminData } from "@/features/admin/live-data";
import { getWorkspaceViewer } from "@/features/workspace/data";
import AdminUsersView from "@/components/admin/AdminUsersView";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const viewer = await getWorkspaceViewer();
  if (!viewer) {
    redirect("/login?next=/admin/users");
  }
  if (viewer.profile.role !== "admin") {
    redirect("/workspace");
  }

  const { snapshot, error } = await getLiveAdminData();

  return snapshot ? (
    <AdminUsersView snapshot={snapshot} />
  ) : (
    <section className="admin-section">
      <h2>Chưa tải được dữ liệu quản trị</h2>
      <p role="alert">{error}</p>
    </section>
  );
}
