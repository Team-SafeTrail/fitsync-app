import RosterLifecycle from "@/components/workspace/RosterLifecycle";
import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Activity, ArrowLeft, CalendarDays, CircleUserRound, MessageCircle, Phone, Plus, Target, TicketCheck, AlertTriangle } from "lucide-react";
import ProgressHistory from "@/components/workspace/ProgressHistory";
import ProfileSectionTabs from "@/components/workspace/ProfileSectionTabs";
import CoachingScheduleSummary from "@/components/workspace/CoachingScheduleSummary";
import CoachingProfileContext from "@/components/workspace/CoachingProfileContext";
import CheckinActivityList from "@/components/workspace/CheckinActivityList";
import FollowUpActions from "@/components/workspace/FollowUpActions";
import InBodyForm from "@/components/workspace/InBodyForm";
import InBodyRecordCard from "@/components/workspace/InBodyRecordCard";
import SessionBalanceForm from "@/components/workspace/SessionBalanceForm";
import SessionHistory from "@/components/workspace/SessionHistory";
import { isCheckinWarningDue } from "@/features/engagement/calendar";
import { prepareFollowUp } from "@/features/engagement/follow-up";
import { getPtTrainee, getWorkspaceViewer } from "@/features/workspace/data";

const goals = { fat_loss: "Giảm mỡ", muscle_gain: "Tăng cơ", recomp: "Tái cấu trúc cơ thể" };

export default async function TraineeDetailPage({ params: route, searchParams: query }: { params: Promise<{ traineeId: string }>; searchParams: Promise<{ created?: string; nutrition?: string }> }) {
  const [params, searchParams] = await Promise.all([route, query]);
  const viewer = await getWorkspaceViewer();
  if (!viewer) redirect("/login");
  if (viewer.profile.role !== "pt") notFound();
  const { trainee, records, checkins } = await getPtTrainee(params.traineeId, viewer.user.id);
  if (!trainee || trainee.assigned_pt_id !== viewer.user.id) notFound();

  if (trainee.status === "archived") {
    return (
      <main id="main-content" className="workspace-main">
        <div style={{ marginBottom: "14px" }}>
          <Link href="/workspace?filter=archived" className="fs-pill-link"><ArrowLeft size={15} /> Danh sách đã lưu trữ</Link>
        </div>
        <h1>{trainee.display_name}</h1>
        <p>Hồ sơ đã lưu trữ. Khôi phục trước khi tiếp tục coaching.</p>
        <RosterLifecycle key={trainee.roster_version} trainee={trainee} />
        <ProgressHistory records={records} />
      </main>
    );
  }

  const warningReference = trainee.last_checkin_date ?? trainee.engagement_started_on;
  const warningDue = warningReference ? isCheckinWarningDue(warningReference) : false;
  const followUp = prepareFollowUp(trainee.display_name, trainee.phone);
  const savedRecord = records.find((record) => record.id === searchParams.created);
  const savedMessage = savedRecord ? (savedRecord.source === "manual" ? "Bản ghi đã được lưu thành công." : "Bản ghi InBody đã được xác minh và lưu.") : undefined;
  const nutritionMessage = searchParams.nutrition === "updated" ? "Đã cập nhật bản nháp dinh dưỡng." : searchParams.nutrition ? "Không thể cập nhật bản nháp dinh dưỡng. Kiểm tra lại giới hạn." : null;

  const overview = (
    <div className="fs-stack">
      <dl id="overview" className="workspace-profile-summary" style={{ margin: 0 }}>
        <div><dt><Target size={15} /> Mục tiêu</dt><dd>{goals[trainee.primary_goal]}</dd></div>
        <div><dt><TicketCheck size={15} /> Buổi PT</dt><dd>{trainee.remaining_sessions}/{trainee.total_sessions} buổi còn lại</dd></div>
        <div><dt><Phone size={15} /> Liên hệ</dt><dd>{trainee.phone ?? "Chưa thêm"}</dd></div>
        <div><dt><Activity size={15} /> InBody</dt><dd>{records.length} bản ghi</dd></div>
      </dl>

      <Suspense fallback={<div className="fs-card"><p role="status">Đang tải lịch liên quan…</p></div>}>
        <CoachingScheduleSummary isPt traineeId={trainee.id} />
      </Suspense>

      {warningDue && (
        <section className="workspace-followup-panel" data-testid="trainee-warning" style={{ marginTop: 0 }}>
          <AlertTriangle size={22} />
          <div>
            <h2>Quá 3 ngày chưa check-in</h2>
            <p>Nhắn nhắc nhở thủ công qua Zalo hoặc mẫu tin.</p>
          </div>
          <FollowUpActions message={followUp.message} zaloUrl={followUp.zaloUrl} />
        </section>
      )}

      <section className="workspace-record-list" aria-labelledby="checkin-history-title" style={{ marginTop: 0 }}>
        <div className="workspace-section-heading">
          <div>
            <p className="workspace-kicker">Nhật ký</p>
            <h2 id="checkin-history-title">Check-in của học viên</h2>
          </div>
          <span className="workspace-badge">{checkins.length} ngày</span>
        </div>
        <CheckinActivityList checkins={checkins} emptyMessage="Check-in của học viên sẽ xuất hiện tại đây." />
      </section>
    </div>
  );

  const progress = (
    <div className="fs-stack">
      <ProgressHistory records={records} />
      <section className="workspace-record-list" aria-labelledby="record-history-title" style={{ marginTop: 0 }}>
        <div className="workspace-section-heading">
          <div><h2 id="record-history-title">Lịch sử InBody</h2></div>
          <span className="workspace-badge">{records.length} bản ghi</span>
        </div>
        {records.length === 0 ? (
          <div className="workspace-empty compact">
            <h3>Chưa có dữ liệu đã xác minh</h3>
            <p>Nhập và xác nhận chỉ số để tạo bản ghi đầu tiên.</p>
            <a href="#intake" className="fs-pill-link is-brand">Thêm số đo</a>
          </div>
        ) : (
          <div className="fs-record-grid">
            {records.map((record) => <InBodyRecordCard key={record.id} record={record} traineeId={trainee.id} editableNutrition />)}
          </div>
        )}
      </section>
    </div>
  );

  const membership = (
    <div className="fs-stack">
      <Suspense fallback={<div className="fs-card"><p role="status">Đang tải membership…</p></div>}>
        <CoachingProfileContext traineeId={trainee.id} section="membership" />
      </Suspense>
      <section id="pt-sessions" className="workspace-panel workspace-session-panel" aria-labelledby="session-balance-title" style={{ marginTop: 0 }}>
        <div>
          <h2 id="session-balance-title">Số buổi còn lại</h2>
          <p>Điều chỉnh thủ công khi hai bên đối chiếu.</p>
        </div>
        <SessionBalanceForm traineeId={trainee.id} remainingSessions={trainee.remaining_sessions} totalSessions={trainee.total_sessions} version={trainee.session_version} />
      </section>
      <Suspense fallback={null}>
        <SessionHistory traineeId={trainee.id} />
      </Suspense>
    </div>
  );

  const notes = (
    <Suspense fallback={<div className="fs-card"><p role="status">Đang tải ghi chú…</p></div>}>
      <CoachingProfileContext traineeId={trainee.id} section="notes" />
    </Suspense>
  );

  const intake = (
    <section id="intake">
      {trainee.profile_id ? (
        <InBodyForm traineeId={trainee.id} savedMessage={savedMessage} />
      ) : (
        <section className="workspace-empty compact">
          <CircleUserRound size={28} />
          <h2>Đang chờ học viên kết nối</h2>
          <p>Gửi link mời để học viên kích hoạt tài khoản trước khi lưu số đo.</p>
          <a href="#coaching-notes" className="fs-pill-link">Mở ghi chú tư vấn</a>
        </section>
      )}
    </section>
  );

  return (
    <main id="main-content" className="workspace-main dossier-page">
      <div style={{ marginBottom: "14px" }}>
        <Link href="/workspace" prefetch={true} className="fs-pill-link">
          <ArrowLeft size={15} /> Danh sách học viên
        </Link>
      </div>

      <header className="workspace-page-heading trainee-detail-heading" style={{ marginBottom: "16px" }}>
        <div>
          <p className="workspace-kicker">Hồ sơ học viên</p>
          <h1>{trainee.display_name}</h1>
        </div>
        <span className={`workspace-badge ${trainee.profile_id ? "is-verified" : "is-pending"}`}>
          <CircleUserRound size={14} /> {trainee.profile_id ? "Đã kết nối tài khoản" : "Đang chờ lời mời"}
        </span>
      </header>

      <div className="workspace-primary-actions" style={{ margin: "0 0 20px" }}>
        {trainee.profile_id && (
          <>
            <Link className="workspace-button" href={`/workspace/chat/${trainee.id}`}>
              <MessageCircle size={16} style={{ marginRight: "6px" }} /> Trao đổi với học viên
            </Link>
            <Link className="workspace-button workspace-button-secondary" href={`/workspace/calendar?trainee=${trainee.id}`}>
              <CalendarDays size={16} style={{ marginRight: "6px" }} /> Xếp lịch với học viên
            </Link>
          </>
        )}
        <a className="fs-pill-link" href="#coaching-notes">Ghi chú tư vấn</a>
        <a className="fs-pill-link is-brand" href="#intake"><Plus size={14} /> Thêm số đo</a>
      </div>

      {nutritionMessage && (
        <p className={`workspace-alert is-${searchParams.nutrition === "updated" ? "success" : "error"}`} role="status">
          {nutritionMessage}
        </p>
      )}

      <RosterLifecycle key={trainee.roster_version} trainee={trainee} />
      <ProfileSectionTabs
        sections={[
          { id: "overview", label: "Tổng quan", content: overview },
          { id: "progress", label: "Tiến trình", content: progress },
          { id: "membership", label: "Membership & buổi", content: membership },
          { id: "notes", label: "Ghi chú", content: notes },
          { id: "intake", label: "Nhập số đo", content: intake },
        ]}
      />
    </main>
  );
}
