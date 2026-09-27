import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Activity, ArrowLeft, CircleUserRound, Phone, Target, TicketCheck } from "lucide-react";
import InBodyForm from "@/components/workspace/InBodyForm";
import InBodyRecordCard from "@/components/workspace/InBodyRecordCard";
import { getPtTrainee, getWorkspaceViewer } from "@/features/workspace/data";

const goalLabels = {
  fat_loss: "Giảm mỡ",
  muscle_gain: "Tăng cơ",
  recomp: "Tái cấu trúc cơ thể",
};

export default async function TraineeDetailPage({
  params,
  searchParams,
}: {
  params: { traineeId: string };
  searchParams: { created?: string; nutrition?: string };
}) {
  const viewer = await getWorkspaceViewer();
  if (!viewer) redirect("/login");
  if (viewer.profile.role !== "pt") redirect("/workspace");

  const { trainee, records } = await getPtTrainee(params.traineeId);
  if (!trainee) notFound();

  const nutritionMessage = searchParams.nutrition === "updated"
    ? "Đã cập nhật bản nháp dinh dưỡng."
    : searchParams.nutrition
      ? "Không thể cập nhật bản nháp dinh dưỡng. Kiểm tra lại giới hạn."
      : null;

  return (
    <main id="main-content" className="workspace-main">
      <Link href="/workspace" className="workspace-back"><ArrowLeft size={16} /> Quay lại roster</Link>
      <header className="workspace-page-heading trainee-detail-heading">
        <div>
          <p className="workspace-kicker">Hồ sơ học viên</p>
          <h1>{trainee.display_name}</h1>
          <p>Theo dõi kết quả đã xác minh và tạo bản ghi mới cho học viên này.</p>
        </div>
        <span className={`workspace-badge ${trainee.profile_id ? "is-verified" : "is-pending"}`}>
          <CircleUserRound size={14} /> {trainee.profile_id ? "Đã kết nối tài khoản" : "Đang chờ lời mời"}
        </span>
      </header>

      <dl className="workspace-profile-summary">
        <div><dt><Target size={15} /> Mục tiêu</dt><dd>{goalLabels[trainee.primary_goal]}</dd></div>
        <div><dt><TicketCheck size={15} /> Gói tập</dt><dd>{trainee.remaining_sessions}/{trainee.total_sessions} buổi còn lại</dd></div>
        <div><dt><Phone size={15} /> Liên hệ</dt><dd>{trainee.phone ?? "Chưa thêm"}</dd></div>
        <div><dt><Activity size={15} /> InBody</dt><dd>{records.length} bản ghi</dd></div>
      </dl>

      {searchParams.created && <p className="workspace-alert is-success" role="status">Bản ghi đã được xác minh và lưu.</p>}
      {nutritionMessage && <p className={`workspace-alert is-${searchParams.nutrition === "updated" ? "success" : "error"}`} role="status">{nutritionMessage}</p>}

      {trainee.profile_id ? (
        <InBodyForm traineeId={trainee.id} />
      ) : (
        <section className="workspace-empty compact"><CircleUserRound size={28} /><h2>Đang chờ học viên kết nối</h2><p>Gửi link mời đã tạo cho học viên. Biểu mẫu InBody sẽ mở ngay sau khi họ tạo mật khẩu.</p><Link href="/workspace#new-trainee" className="workspace-inline-link"><ArrowLeft size={15} /> Về roster</Link></section>
      )}

      <section className="workspace-record-list" aria-labelledby="record-history-title">
        <div className="workspace-section-heading"><div><p className="workspace-kicker">Theo thời gian</p><h2 id="record-history-title">Lịch sử InBody</h2></div><p>{records.length} bản ghi</p></div>
        {records.length === 0 ? (
          <div className="workspace-empty compact"><h3>Chưa có dữ liệu đã xác minh</h3><p>Nhập đủ năm chỉ số và xác nhận để tạo bản ghi đầu tiên.</p></div>
        ) : records.map((record) => <InBodyRecordCard key={record.id} record={record} traineeId={trainee.id} editableNutrition />)}
      </section>
    </main>
  );
}
