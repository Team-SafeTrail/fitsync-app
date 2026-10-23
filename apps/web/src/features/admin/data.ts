import "server-only";
import { cache } from "react";
import { getWorkspaceViewer } from "@/features/workspace/data";
import { createPrivilegedClient } from "@/lib/supabase/admin";

export interface AdminKPI {
  totalPts: number;
  totalTrainees: number;
  totalInBodyRecords: number;
  totalRevenueVnd: number;
  activeRatePercent: number;
  ocrUsagePercent: number;
  dataMode: "live_counts" | "synthetic";
}

export interface AdminUserItem {
  id: string;
  displayName: string;
  email: string;
  role: "pt" | "trainee" | "admin";
  phone: string;
  gymAffiliation?: string;
  status: "active" | "warning" | "inactive";
  inbodyCount: number;
  createdAt: string;
  rlsProtected: boolean;
}

export interface VietQRTransaction {
  id: string;
  orderCode: string;
  userName: string;
  userRole: "PT" | "Học viên";
  planName: string;
  amountVnd: number;
  paymentMethod: "VietQR Napas247" | "Chuyển khoản thủ công";
  status: "success" | "pending" | "failed";
  paidAt: string;
}

const SYNTHETIC_PT_USERS: AdminUserItem[] = Array.from({ length: 4 }, (_, index) => ({
  id: `demo-pt-${String(index + 1).padStart(2, "0")}`,
  displayName: `PT Mẫu ${String(index + 1).padStart(2, "0")}`,
  email: `oc2.pt${String(index + 1).padStart(2, "0")}@example.test`,
  role: "pt",
  phone: "Dữ liệu mô phỏng",
  gymAffiliation: `Phòng tập mô phỏng ${String.fromCharCode(65 + index)}`,
  status: "active",
  inbodyCount: 0,
  createdAt: `2026-10-${String(index + 1).padStart(2, "0")}T01:00:00Z`,
  rlsProtected: true,
}));

const syntheticInBodyCounts = [2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0];
const SYNTHETIC_TRAINEE_USERS: AdminUserItem[] = Array.from({ length: 12 }, (_, index) => ({
  id: `demo-trainee-${String(index + 1).padStart(2, "0")}`,
  displayName: `Học viên Mẫu ${String(index + 1).padStart(2, "0")}`,
  email: `oc2.trainee${String(index + 1).padStart(2, "0")}@example.test`,
  role: "trainee",
  phone: "Dữ liệu mô phỏng",
  gymAffiliation: `Phòng tập mô phỏng ${String.fromCharCode(65 + (index % 4))}`,
  status: index >= 10 ? "warning" : "active",
  inbodyCount: syntheticInBodyCounts[index],
  createdAt: `2026-10-${String(index + 5).padStart(2, "0")}T01:00:00Z`,
  rlsProtected: true,
}));

const SYNTHETIC_USERS: AdminUserItem[] = [
  ...SYNTHETIC_PT_USERS,
  ...SYNTHETIC_TRAINEE_USERS,
  {
    id: "demo-admin-01",
    displayName: "Quản trị viên Demo OC2",
    email: "oc2.admin@example.test",
    role: "admin",
    phone: "Dữ liệu mô phỏng",
    gymAffiliation: "SafeTrail demo environment",
    status: "active",
    inbodyCount: 0,
    createdAt: "2026-10-01T00:00:00Z",
    rlsProtected: true,
  },
];

const SYNTHETIC_TRANSACTIONS: VietQRTransaction[] = [
  {
    id: "tx-001",
    orderCode: "FS-VQR-20261021-001",
    userName: "PT Mẫu 01",
    userRole: "PT",
    planName: "Gói Huấn Luyện Viên PT Pro (1 Tháng)",
    amountVnd: 99000,
    paymentMethod: "VietQR Napas247",
    status: "success",
    paidAt: "2026-10-21T10:14:22Z",
  },
  {
    id: "tx-002",
    orderCode: "FS-VQR-20261021-002",
    userName: "PT Mẫu 02",
    userRole: "PT",
    planName: "Gói Huấn Luyện Viên PT Pro (Gia hạn sớm -30%)",
    amountVnd: 69000,
    paymentMethod: "VietQR Napas247",
    status: "success",
    paidAt: "2026-10-21T14:32:05Z",
  },
  {
    id: "tx-003",
    orderCode: "FS-VQR-20261022-001",
    userName: "Học viên Mẫu 01",
    userRole: "Học viên",
    planName: "Gói FitSync Early Bird Học Viên",
    amountVnd: 49000,
    paymentMethod: "VietQR Napas247",
    status: "success",
    paidAt: "2026-10-22T08:05:11Z",
  },
];

export const getAdminDashboardData = cache(async () => {
  const viewer = await getWorkspaceViewer();
  if (!viewer || viewer.profile.role !== "admin") {
    throw new Error("Admin authorization is required.");
  }

  let liveCounts: { totalPts: number; totalTrainees: number; totalInBodyRecords: number } | null = null;

  try {
    const supabase = createPrivilegedClient();
    const [ptRes, traineeRes, inbodyRes] = await Promise.all([
      supabase.from("pt_profiles").select("id", { count: "exact", head: true }),
      supabase.from("trainee_profiles").select("id", { count: "exact", head: true }),
      supabase.from("inbody_records").select("id", { count: "exact", head: true }),
    ]);
    if (ptRes.error || traineeRes.error || inbodyRes.error) {
      throw new Error("A live aggregate query failed.");
    }
    liveCounts = {
      totalPts: ptRes.count ?? 0,
      totalTrainees: traineeRes.count ?? 0,
      totalInBodyRecords: inbodyRes.count ?? 0,
    };
  } catch {
    liveCounts = null;
  }

  const syntheticRevenueVnd = SYNTHETIC_TRANSACTIONS.reduce(
    (total, transaction) => total + (transaction.status === "success" ? transaction.amountVnd : 0),
    0,
  );

  const kpi: AdminKPI = {
    totalPts: liveCounts?.totalPts ?? 4,
    totalTrainees: liveCounts?.totalTrainees ?? 12,
    totalInBodyRecords: liveCounts?.totalInBodyRecords ?? 15,
    totalRevenueVnd: syntheticRevenueVnd,
    activeRatePercent: 83.3,
    ocrUsagePercent: 0,
    dataMode: liveCounts ? "live_counts" : "synthetic",
  };

  return {
    currentUser: viewer.user,
    kpi,
    users: SYNTHETIC_USERS,
    transactions: SYNTHETIC_TRANSACTIONS,
  };
});
