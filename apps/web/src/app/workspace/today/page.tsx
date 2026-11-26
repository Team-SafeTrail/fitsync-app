import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ArrowUpRight, NotebookPen, UserRoundPlus } from "lucide-react";
import { getPtRoster, getWorkspaceViewer } from "@/features/workspace/data";
import CoachingScheduleSummary from "@/components/workspace/CoachingScheduleSummary";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const viewer = await getWorkspaceViewer();
  if (!viewer) redirect("/login");
  if (viewer.profile.role !== "pt") redirect("/workspace");
  const { trainees, warningByTrainee } = await getPtRoster();
  const warnings = trainees.filter((item) => warningByTrainee.has(item.id));
  const pending = trainees.filter((item) => !item.profile_id);
  const date = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date());

  return (
    <main id="main-content" className="workspace-main coaching-today">
      <header className="coaching-page-header">
        <div>
          <p className="workspace-kicker">{date}</p>
          <h1>Một ngày đồng hành tốt hơn.</h1>
          <p>Chào {viewer.profile.display_name}. Lịch tập và học viên cần chú ý hôm nay.</p>
        </div>
        <Link className="workspace-button" href="/workspace?create=1#new-trainee">
          <UserRoundPlus size={18} /> Thêm học viên
        </Link>
      </header>

      <section className="fs-kpi-strip" aria-label="Tổng quan nhanh">
        <div className="fs-kpi-tile">
          <span>Học viên đang quản lý</span>
          <strong>{trainees.length}</strong>
        </div>
        <div className="fs-kpi-tile">
          <span>Cần nhắc check-in</span>
          <strong>{warnings.length}</strong>
        </div>
        <div className="fs-kpi-tile">
          <span>Chờ kết nối tài khoản</span>
          <strong>{pending.length}</strong>
        </div>
      </section>

      <div className="coaching-today-layout">
        <div className="fs-stack">
          <Suspense fallback={<div className="fs-card"><p role="status">Đang tải cuộc hẹn…</p></div>}>
            <CoachingScheduleSummary isPt />
          </Suspense>

          <section className="coaching-attention">
            <div className="workspace-section-heading">
              <h2>Học viên cần bạn xem</h2>
              <Link href="/workspace?filter=attention" prefetch={true} className="fs-pill-link">
                Xem danh sách
              </Link>
            </div>
            {warnings.length ? (
              <ul>
                {warnings.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <Link href={`/workspace/trainees/${item.id}`} prefetch={true}>
                      <span className="workspace-avatar">{item.display_name.trim().charAt(0)}</span>
                      <div>
                        <strong>{item.display_name}</strong>
                        <span>Quá 3 ngày chưa check-in</span>
                      </div>
                      <ArrowUpRight size={18} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="coaching-empty-line">
                <p>Không có học viên nào cần nhắc check-in.</p>
                <Link href="/workspace" prefetch={true} className="fs-pill-link is-brand">
                  Mở danh sách học viên
                </Link>
              </div>
            )}
          </section>
        </div>

        <aside className="coaching-day-context">
          <NotebookPen size={22} style={{ color: "var(--color-brand)" }} />
          <h2>Lối tắt quản lý</h2>
          <p>Mở hồ sơ để xem InBody, ghi chú, dinh dưỡng và gói buổi tập.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
            <Link href="/workspace" prefetch={true} className="fs-pill-link is-brand">
              Mở học viên <ArrowUpRight size={15} />
            </Link>
            {pending.length > 0 && (
              <Link href="/workspace?filter=pending" prefetch={true} className="fs-pill-link">
                Xem lời mời đang chờ ({pending.length})
              </Link>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
