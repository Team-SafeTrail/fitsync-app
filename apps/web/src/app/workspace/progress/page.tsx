import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getTraineeHome, getWorkspaceViewer } from "@/features/workspace/data";
import ProgressHistory from "@/components/workspace/ProgressHistory";
import InBodyRecordCard from "@/components/workspace/InBodyRecordCard";

export const dynamic = "force-dynamic";

export default async function LearnerProgressPage() {
  const viewer = await getWorkspaceViewer();
  if (!viewer) redirect("/login");
  if (viewer.profile.role !== "trainee") redirect("/workspace");
  const { trainee, records } = await getTraineeHome(viewer.user.id);

  return (
    <main id="main-content" className="workspace-main">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", marginBottom: "14px" }}>
        <Link href="/workspace" prefetch={true} className="fs-pill-link">
          <ArrowLeft size={15} /> Về Hôm nay
        </Link>
        <Link href="/workspace/chat" prefetch={true} className="fs-pill-link is-brand">
          <MessageCircle size={15} /> Trao đổi với PT
        </Link>
      </div>

      <header className="coaching-page-header">
        <div>
          <p className="workspace-kicker">Chỉ số thể chất</p>
          <h1>Tiến trình của bạn.</h1>
          <p>Lịch sử đo InBody đã được PT xác nhận theo thời gian.</p>
        </div>
        <span className="workspace-badge is-verified">{records.length} bản ghi</span>
      </header>

      {!trainee ? (
        <div className="workspace-empty">
          <h2>Chưa kết nối với PT</h2>
          <p>Mở lời mời từ PT để xem hồ sơ của bạn.</p>
        </div>
      ) : (
        <div className="fs-stack">
          <ProgressHistory records={records} />
          <section className="workspace-record-list" aria-label="Lịch sử chỉ số đã xác nhận">
            <div className="workspace-section-heading">
              <div>
                <p className="workspace-kicker">Chi tiết từng lần đo</p>
                <h2>Lịch sử bản ghi</h2>
              </div>
              <p>{records.length} bản ghi đã duyệt</p>
            </div>
            {records.length ? (
              <div className="fs-record-grid">
                {records.map((record) => (
                  <InBodyRecordCard key={record.id} record={record} traineeId={trainee.id} editableNutrition={false} />
                ))}
              </div>
            ) : (
              <div className="fs-card-muted">
                <p style={{ margin: 0 }}>Chưa có bản ghi đã xác minh.</p>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
