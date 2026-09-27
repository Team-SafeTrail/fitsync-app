import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Dumbbell, UserRoundCheck, Users } from "lucide-react";
import CreateTraineeForm from "@/components/workspace/CreateTraineeForm";
import InBodyRecordCard from "@/components/workspace/InBodyRecordCard";
import OpenCreateTraineeButton from "@/components/workspace/OpenCreateTraineeButton";
import { getPtRoster, getTraineeHome, getWorkspaceViewer } from "@/features/workspace/data";

const goalLabels = {
  fat_loss: "Giảm mỡ",
  muscle_gain: "Tăng cơ",
  recomp: "Tái cấu trúc",
};

export default async function WorkspacePage() {
  const viewer = await getWorkspaceViewer();
  if (!viewer) return null;

  if (viewer.profile.role === "trainee") {
    const { trainee, records } = await getTraineeHome(viewer.user.id);
    return (
      <main id="main-content" className="workspace-main">
        <header className="workspace-page-heading trainee-heading">
          <div>
            <p className="workspace-kicker">Tổng quan của bạn</p>
            <h1>Chào {viewer.profile.display_name}</h1>
            <p>Theo dõi gói tập và những kết quả đã được PT xác nhận.</p>
          </div>
          {trainee && <div className="workspace-session-stat"><strong>{trainee.remaining_sessions}</strong><span>buổi còn lại / {trainee.total_sessions}</span></div>}
        </header>

        {!trainee ? (
          <section className="workspace-empty"><UserRoundCheck size={30} /><h2>Chưa liên kết hồ sơ</h2><p>Mở lại liên kết mời từ PT để hoàn tất kết nối.</p></section>
        ) : records.length === 0 ? (
          <section className="workspace-empty"><Dumbbell size={30} /><h2>Chưa có bản ghi đã xác minh</h2><p>PT của bạn sẽ nhập và xác nhận kết quả trước khi nó xuất hiện tại đây.</p></section>
        ) : (
          <section className="workspace-record-list" aria-labelledby="trainee-records-title">
            <div className="workspace-section-heading"><div><p className="workspace-kicker">Tiến trình</p><h2 id="trainee-records-title">Kết quả InBody đã xác minh</h2></div><p>{records.length} lần đo được PT xác nhận</p></div>
            {records.map((record) => <InBodyRecordCard key={record.id} record={record} traineeId={trainee.id} editableNutrition={false} />)}
          </section>
        )}
      </main>
    );
  }

  if (viewer.profile.role !== "pt") {
    return <main id="main-content" className="workspace-main"><section className="workspace-empty"><h1>Vai trò chưa được hỗ trợ</h1></section></main>;
  }

  const { trainees, invitationByTrainee, verifiedRecordCountByTrainee } = await getPtRoster();
  const linkedCount = trainees.filter((trainee) => trainee.profile_id).length;
  const pendingCount = trainees.length - linkedCount;

  return (
    <main id="main-content" className="workspace-main">
      <header className="workspace-page-heading">
        <div>
          <p className="workspace-kicker">Tổng quan học viên</p>
          <h1>Chào {viewer.profile.display_name}</h1>
          <p>Quản lý hồ sơ, kết nối tài khoản và xác nhận kết quả InBody cho từng học viên.</p>
          <OpenCreateTraineeButton />
        </div>
        <div className="workspace-overview-stats">
          <div><Users size={18} /><strong>{trainees.length}</strong><span>học viên</span></div>
          <div><UserRoundCheck size={18} /><strong>{linkedCount}</strong><span>đã kết nối</span></div>
          <div><Clock3 size={18} /><strong>{pendingCount}</strong><span>đang chờ</span></div>
        </div>
      </header>

      {trainees.length === 0 && (
        <section className="workspace-getting-started" aria-labelledby="getting-started-title">
          <div><p className="workspace-kicker">Bắt đầu</p><h2 id="getting-started-title">Ba bước để có bản ghi đầu tiên</h2></div>
          <ol>
            <li className="is-current"><span>01</span><div><strong>Tạo hồ sơ</strong><small>Thêm thông tin và gói buổi tập.</small></div></li>
            <li><span>02</span><div><strong>Gửi link mời</strong><small>Học viên tự tạo mật khẩu.</small></div></li>
            <li><span>03</span><div><strong>Xác nhận InBody</strong><small>Kiểm tra năm chỉ số trước khi lưu.</small></div></li>
          </ol>
        </section>
      )}

      <section className="workspace-roster" aria-labelledby="roster-title">
        <div className="workspace-section-heading">
          <div><p className="workspace-kicker">Roster</p><h2 id="roster-title">Học viên của bạn</h2></div>
          <p>{trainees.length === 0 ? "Tạo hồ sơ đầu tiên để bắt đầu." : `${linkedCount}/${trainees.length} tài khoản đã kết nối`}</p>
        </div>
        {trainees.length === 0 ? (
          <div className="workspace-empty compact"><Users size={28} /><h3>Roster đang trống</h3><p>Thêm học viên, sao chép link mời rồi gửi qua kênh bạn đang dùng.</p><OpenCreateTraineeButton compact /></div>
        ) : (
          <div className="workspace-roster-list">
            <div className="workspace-roster-labels" aria-hidden="true"><span>Học viên</span><span>Trạng thái</span><span>Gói tập</span><span>InBody</span><span /></div>
            {trainees.map((trainee) => {
              const invitation = invitationByTrainee.get(trainee.id);
              const inviteExpired = invitation ? new Date(invitation.expires_at) <= new Date() : false;
              const status = trainee.profile_id ? "Đã kết nối" : invitation?.status === "pending" && !inviteExpired ? "Chờ chấp nhận" : "Lời mời hết hạn";
              const recordCount = verifiedRecordCountByTrainee.get(trainee.id) ?? 0;
              return (
                <Link key={trainee.id} href={`/workspace/trainees/${trainee.id}`} className="workspace-roster-row">
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

      <CreateTraineeForm defaultOpen={trainees.length === 0} />
    </main>
  );
}
