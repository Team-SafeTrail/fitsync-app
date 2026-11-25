import Link from "next/link";
import ProgressHistory from "@/components/workspace/ProgressHistory";
import { Suspense } from "react";
import CoachingProfileContext from "@/components/workspace/CoachingProfileContext";
import CoachingScheduleSummary from "@/components/workspace/CoachingScheduleSummary";
import SessionHistory from "@/components/workspace/SessionHistory";
import { AlertTriangle, ArrowRight, CheckCircle2, Dumbbell, UserRoundCheck, Users } from "lucide-react";
import CheckinActivityList from "@/components/workspace/CheckinActivityList";
import CheckinForm from "@/components/workspace/CheckinForm";
import CreateTraineeForm from "@/components/workspace/CreateTraineeForm";
import FollowUpActions from "@/components/workspace/FollowUpActions";
import InBodyRecordCard from "@/components/workspace/InBodyRecordCard";
import OpenCreateTraineeButton from "@/components/workspace/OpenCreateTraineeButton";
import { getApplicationDate } from "@/features/engagement/calendar";
import { prepareFollowUp } from "@/features/engagement/follow-up";
import { getPtRoster, getTraineeHome, getWorkspaceViewer } from "@/features/workspace/data";

const goalLabels = {
  fat_loss: "Giảm mỡ",
  muscle_gain: "Tăng cơ",
  recomp: "Tái cấu trúc",
};

export default async function WorkspacePage({ searchParams: searchParamsPromise }: { searchParams: Promise<{ q?: string; filter?: string; create?: string }> }) {
  const searchParams = await searchParamsPromise;
  const viewer = await getWorkspaceViewer();
  if (!viewer) return null;

  if (viewer.profile.role === "trainee") {
    const { trainee, coach, records, checkins } = await getTraineeHome(viewer.user.id);
    if (trainee?.status === "archived") {
      return (
        <main id="main-content" className="workspace-main">
          <div className="fs-card-muted">
            <h1>Hồ sơ đã được lưu trữ</h1>
            <p>Liên hệ PT phụ trách để khôi phục trước khi tiếp tục check-in hoặc trao đổi.</p>
          </div>
        </main>
      );
    }
    const checkedInToday = checkins.some((checkin) => checkin.local_checkin_date === getApplicationDate());
    return (
      <main id="main-content" className="workspace-main">
        <header className="workspace-page-heading trainee-heading" style={{ marginBottom: "20px" }}>
          <div>
            <p className="workspace-kicker">Không gian học viên</p>
            <h1>Chào {viewer.profile.display_name}</h1>
            {coach && <p>PT đồng hành: <strong>{coach.display_name}</strong></p>}
          </div>
          {trainee && (
            <div className="workspace-session-stat">
              <strong>{trainee.remaining_sessions}</strong>
              <span>buổi PT còn lại / {trainee.total_sessions}</span>
            </div>
          )}
        </header>

        {!trainee ? (
          <section className="workspace-empty">
            <UserRoundCheck size={30} />
            <h2>Chưa liên kết hồ sơ</h2>
            <p>Mở lại liên kết mời từ PT để hoàn tất kết nối.</p>
          </section>
        ) : (
          <div className="fs-stack">
            <nav className="dossier-section-nav" aria-label="Nội dung của bạn">
              <a href="#daily-checkin-title">Check-in hôm nay</a>
              <a href="#progress">Tiến trình</a>
              <a href="#trainee-records-title">Số đo</a>
              <a href="#membership">Membership</a>
              <a href="#coaching-notes">Ghi chú PT</a>
            </nav>

            <div className="fs-split-grid">
              <div className="fs-stack">
                {checkedInToday ? (
                  <section className="workspace-complete-today" data-testid="checkin-complete-today">
                    <CheckCircle2 size={24} />
                    <div>
                      <h2 id="daily-checkin-title">Đã check-in hôm nay</h2>
                      <p>Hoạt động đã được lưu và đồng bộ với PT.</p>
                    </div>
                  </section>
                ) : (
                  <CheckinForm />
                )}

                <section className="workspace-record-list" aria-labelledby="trainee-activity-title" style={{ marginTop: 0 }}>
                  <div className="workspace-section-heading">
                    <div>
                      <p className="workspace-kicker">Nhịp hằng ngày</p>
                      <h2 id="trainee-activity-title">Lịch sử check-in</h2>
                    </div>
                    <span className="workspace-badge">{checkins.length} ngày</span>
                  </div>
                  <CheckinActivityList checkins={checkins} emptyMessage="Gửi check-in đầu tiên để PT theo sát giữa các buổi tập." />
                </section>
              </div>

              <div className="fs-stack">
                <Suspense fallback={<div className="fs-card"><p role="status">Đang tải cuộc hẹn…</p></div>}>
                  <CoachingScheduleSummary isPt={false} traineeId={trainee.id} />
                </Suspense>
                <Suspense fallback={<div className="fs-card"><p role="status">Đang tải membership và ghi chú…</p></div>}>
                  <CoachingProfileContext traineeId={trainee.id} />
                </Suspense>
                <Suspense fallback={null}>
                  <SessionHistory traineeId={trainee.id} />
                </Suspense>
              </div>
            </div>

            <ProgressHistory records={records} />

            <section className="workspace-record-list" aria-labelledby="trainee-records-title" style={{ marginTop: 0 }}>
              <div className="workspace-section-heading">
                <div>
                  <p className="workspace-kicker">InBody</p>
                  <h2 id="trainee-records-title">Kết quả InBody gần nhất</h2>
                </div>
                <Link href="/workspace/progress" prefetch={true} className="fs-pill-link is-brand">
                  Xem đủ {records.length} bản ghi
                </Link>
              </div>
              {records.length === 0 ? (
                <div className="workspace-empty compact">
                  <Dumbbell size={28} />
                  <h3>Chưa có bản ghi đã xác minh</h3>
                  <p>PT sẽ nhập và xác nhận kết quả đo của bạn tại đây.</p>
                </div>
              ) : (
                records.slice(0, 1).map((record) => <InBodyRecordCard key={record.id} record={record} traineeId={trainee.id} editableNutrition={false} compact />)
              )}
            </section>
          </div>
        )}
      </main>
    );
  }

  if (viewer.profile.role !== "pt") {
    return (
      <main id="main-content" className="workspace-main">
        <section className="workspace-empty"><h1>Vai trò chưa được hỗ trợ</h1></section>
      </main>
    );
  }

  const { trainees, invitationByTrainee, verifiedRecordCountByTrainee, warningByTrainee } = await getPtRoster(searchParams.filter === "archived");
  const linkedCount = trainees.filter((trainee) => trainee.profile_id).length;
  const pendingCount = trainees.length - linkedCount;
  const warningTrainees = trainees.filter((trainee) => warningByTrainee.has(trainee.id));

  const query = typeof searchParams.q === "string" ? searchParams.q.trim().slice(0, 100) : "";
  const filter = typeof searchParams.filter === "string" ? searchParams.filter : "all";
  const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
  const visibleTrainees = trainees.filter(
    (trainee) =>
      normalize(`${trainee.display_name} ${trainee.phone ?? ""}`).includes(normalize(query)) &&
      (filter === "attention" ? warningByTrainee.has(trainee.id) : filter === "pending" ? !trainee.profile_id : true),
  );

  return (
    <main id="main-content" className="workspace-main">
      <header className="workspace-page-heading" style={{ marginBottom: "24px" }}>
        <div>
          <p className="workspace-kicker">Danh bạ PT</p>
          <h1>Chào {viewer.profile.display_name}</h1>
          <div className="workspace-primary-actions" style={{ margin: "14px 0 0" }}>
            <OpenCreateTraineeButton />
            <Link className="fs-pill-link is-brand" href="/workspace/today" prefetch={true}>
              Mở trang Hôm nay
            </Link>
          </div>
        </div>
        <div className="workspace-overview-stats">
          <div><Users size={18} /><strong>{trainees.length}</strong><span>học viên</span></div>
          <div><UserRoundCheck size={18} /><strong>{linkedCount}</strong><span>đã kết nối</span></div>
          <div><AlertTriangle size={18} /><strong>{warningTrainees.length}</strong><span>cần theo dõi</span></div>
        </div>
      </header>

      {trainees.length === 0 && (
        <section className="workspace-getting-started" aria-labelledby="getting-started-title" style={{ marginBottom: "24px" }}>
          <div><p className="workspace-kicker">Bắt đầu</p><h2 id="getting-started-title">3 bước nhanh</h2></div>
          <ol>
            <li className="is-current"><span>01</span><div><strong>Tạo hồ sơ</strong><small>Thêm thông tin &amp; gói buổi.</small></div></li>
            <li><span>02</span><div><strong>Gửi link mời</strong><small>Học viên tự kích hoạt.</small></div></li>
            <li><span>03</span><div><strong>Xác nhận InBody</strong><small>Lưu chỉ số chính thức.</small></div></li>
          </ol>
        </section>
      )}

      {warningTrainees.length > 0 && (
        <section className="workspace-warning-queue" aria-labelledby="warning-queue-title" data-testid="warning-queue" style={{ marginBottom: "24px" }}>
          <div className="workspace-section-heading">
            <div><p className="workspace-kicker">Cần theo dõi</p><h2 id="warning-queue-title">Hơn 3 ngày chưa check-in</h2></div>
            <span className="workspace-badge">{warningTrainees.length} học viên</span>
          </div>
          <div className="workspace-warning-list">
            {warningTrainees.map((trainee) => {
              const followUp = prepareFollowUp(trainee.display_name, trainee.phone);
              return (
                <article key={trainee.id} className="workspace-warning-card">
                  <div>
                    <AlertTriangle size={19} />
                    <span>
                      <strong>{trainee.display_name}</strong>
                      <small>Gần nhất: {trainee.last_checkin_date ?? "chưa có"}</small>
                    </span>
                  </div>
                  <FollowUpActions message={followUp.message} zaloUrl={followUp.zaloUrl} />
                  <Link href={`/workspace/trainees/${trainee.id}`} prefetch={true} className="fs-pill-link">
                    Xem hoạt động <ArrowRight size={15} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="workspace-roster" aria-labelledby="roster-title" style={{ marginTop: 0 }}>
        <div className="workspace-section-heading">
          <div><p className="workspace-kicker">Hồ sơ &amp; hoạt động</p><h2 id="roster-title">Học viên của bạn</h2></div>
          <p>{trainees.length === 0 ? "Chưa có học viên." : `${linkedCount}/${trainees.length} đã kết nối · ${pendingCount} đang chờ`}</p>
        </div>

        <div className="fs-card" style={{ padding: "16px 20px", marginBottom: "14px" }}>
          <form className="workspace-roster-search" action="/workspace" method="get" role="search" aria-label="Tìm học viên trong workspace" style={{ padding: 0 }}>
            <label>Tìm học viên<input name="q" type="search" defaultValue={query} placeholder="Tên hoặc số điện thoại" maxLength={100} /></label>
            <label>
              Trạng thái
              <select name="filter" defaultValue={filter}>
                <option value="all">Tất cả học viên</option>
                <option value="attention">Cần theo dõi check-in</option>
                <option value="pending">Chưa kết nối tài khoản</option>
                <option value="archived">Đã lưu trữ</option>
              </select>
            </label>
            <button type="submit" className="workspace-button workspace-button-primary">Tìm kiếm</button>
            {(query || filter !== "all") && <Link className="fs-pill-link" href="/workspace">Xóa bộ lọc</Link>}
          </form>
        </div>

        <p className="workspace-search-count" role="status">{visibleTrainees.length} / {trainees.length} học viên</p>

        {trainees.length === 0 ? (
          <div className="workspace-empty compact">
            <Users size={28} />
            <h3>Roster đang trống</h3>
            <p>Thêm học viên đầu tiên để bắt đầu quản lý.</p>
            <OpenCreateTraineeButton compact />
          </div>
        ) : visibleTrainees.length === 0 ? (
          <div className="workspace-empty compact">
            <h3>Không tìm thấy học viên</h3>
            <Link href="/workspace" className="fs-pill-link">Xem tất cả học viên</Link>
          </div>
        ) : (
          <div className="workspace-roster-list">
            <div className="workspace-roster-labels" aria-hidden="true"><span>Học viên</span><span>Trạng thái</span><span>Gói tập</span><span>InBody</span><span /></div>
            {visibleTrainees.map((trainee) => {
              const invitation = invitationByTrainee.get(trainee.id);
              const inviteExpired = invitation ? new Date(invitation.expires_at) <= new Date() : false;
              const status = trainee.status === "archived" ? "Đã lưu trữ" : trainee.profile_id ? "Đã kết nối" : invitation?.status === "pending" && !inviteExpired ? "Chờ chấp nhận" : "Lời mời hết hạn";
              const recordCount = verifiedRecordCountByTrainee.get(trainee.id) ?? 0;
              return (
                <Link key={trainee.id} href={`/workspace/trainees/${trainee.id}`} prefetch={true} className="workspace-roster-row">
                  <span className="workspace-avatar">{trainee.display_name.split(/\s+/).slice(-2).map((part) => part[0]).join("").toUpperCase()}</span>
                  <span className="workspace-roster-identity"><strong>{trainee.display_name}</strong><small>{goalLabels[trainee.primary_goal]}{trainee.phone ? ` · ${trainee.phone}` : ""}</small></span>
                  <span className={`workspace-badge ${trainee.profile_id ? "is-verified" : "is-pending"}`}>{status}</span>
                  <span className="workspace-session-inline"><strong>{trainee.remaining_sessions}</strong> / {trainee.total_sessions} buổi</span>
                  <span className="workspace-record-count"><CheckCircle2 size={14} /> {recordCount}</span>
                  <ArrowRight size={17} />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <CreateTraineeForm defaultOpen={trainees.length === 0 || searchParams.create === "1"} />
    </main>
  );
}
