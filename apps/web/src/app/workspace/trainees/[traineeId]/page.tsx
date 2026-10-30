import {Suspense} from "react";
import Link from "next/link";
import {notFound,redirect} from "next/navigation";
import {Activity,ArrowLeft,CircleUserRound,Phone,Target,TicketCheck,AlertTriangle} from "lucide-react";
import ProgressHistory from "@/components/workspace/ProgressHistory";
import ProfileSectionTabs from "@/components/workspace/ProfileSectionTabs";
import CoachingScheduleSummary from "@/components/workspace/CoachingScheduleSummary";
import CoachingProfileContext from "@/components/workspace/CoachingProfileContext";
import CheckinActivityList from "@/components/workspace/CheckinActivityList";
import FollowUpActions from "@/components/workspace/FollowUpActions";
import InBodyForm from "@/components/workspace/InBodyForm";
import InBodyRecordCard from "@/components/workspace/InBodyRecordCard";
import SessionBalanceForm from "@/components/workspace/SessionBalanceForm";
import {isCheckinWarningDue} from "@/features/engagement/calendar";
import {prepareFollowUp} from "@/features/engagement/follow-up";
import {getPtTrainee,getWorkspaceViewer} from "@/features/workspace/data";

const goals={fat_loss:"Giảm mỡ",muscle_gain:"Tăng cơ",recomp:"Tái cấu trúc cơ thể"};
export default async function TraineeDetailPage({params,searchParams}:{params:{traineeId:string};searchParams:{created?:string;nutrition?:string}}) {
 const viewer=await getWorkspaceViewer();if(!viewer)redirect("/login");if(viewer.profile.role!=="pt")redirect("/workspace");
 const {trainee,records,checkins}=await getPtTrainee(params.traineeId);if(!trainee)notFound();
 const warningReference=trainee.last_checkin_date??trainee.engagement_started_on;
 const warningDue=warningReference?isCheckinWarningDue(warningReference):false;
 const followUp=prepareFollowUp(trainee.display_name,trainee.phone);
 const nutritionMessage=searchParams.nutrition==="updated"?"Đã cập nhật bản nháp dinh dưỡng.":searchParams.nutrition?"Không thể cập nhật bản nháp dinh dưỡng. Kiểm tra lại giới hạn.":null;
 const overview=<>
  <dl id="overview" className="workspace-profile-summary"><div><dt><Target size={15}/> Mục tiêu</dt><dd>{goals[trainee.primary_goal]}</dd></div><div><dt><TicketCheck size={15}/> Buổi PT</dt><dd>{trainee.remaining_sessions}/{trainee.total_sessions} buổi còn lại</dd></div><div><dt><Phone size={15}/> Liên hệ</dt><dd>{trainee.phone??"Chưa thêm"}</dd></div><div><dt><Activity size={15}/> InBody</dt><dd>{records.length} bản ghi</dd></div></dl>
  <Suspense fallback={<p role="status">Đang tải lịch liên quan…</p>}><CoachingScheduleSummary isPt traineeId={trainee.id}/></Suspense>
  {warningDue&&<section className="workspace-followup-panel" data-testid="trainee-warning"><AlertTriangle size={22}/><div><h2>Đã qua ba ngày trọn vẹn chưa check-in</h2><p>Sao chép nội dung hoặc chủ động mở Zalo. FitSync không tự gửi tin nhắn.</p></div><FollowUpActions message={followUp.message} zaloUrl={followUp.zaloUrl}/></section>}
  <section className="workspace-record-list" aria-labelledby="checkin-history-title"><div className="workspace-section-heading"><div><h2 id="checkin-history-title">Check-in của học viên</h2></div><p>{checkins.length} ngày đã ghi nhận</p></div><CheckinActivityList checkins={checkins} emptyMessage="Check-in của học viên sẽ xuất hiện ở đây sau khi gửi."/></section>
 </>;
 const progress=<><ProgressHistory records={records}/><section className="workspace-record-list" aria-labelledby="record-history-title"><div className="workspace-section-heading"><div><h2 id="record-history-title">Lịch sử InBody</h2></div><p>{records.length} bản ghi</p></div>{records.length===0?<div className="workspace-empty compact"><h3>Chưa có dữ liệu đã xác minh</h3><p>Nhập và xác nhận chỉ số để tạo bản ghi đầu tiên.</p><a href="#intake">Thêm số đo</a></div>:records.map(record=><InBodyRecordCard key={record.id} record={record} traineeId={trainee.id} editableNutrition/>)}</section></>;
 const membership=<><Suspense fallback={<p role="status">Đang tải membership…</p>}><CoachingProfileContext traineeId={trainee.id} section="membership"/></Suspense><section id="pt-sessions" className="workspace-panel workspace-session-panel" aria-labelledby="session-balance-title"><div><h2 id="session-balance-title">Số buổi còn lại</h2><p>Điều chỉnh số dư thủ công sau khi hai bên đối chiếu. Membership và đặt lịch không tự thay đổi số này.</p></div><SessionBalanceForm traineeId={trainee.id} remainingSessions={trainee.remaining_sessions} totalSessions={trainee.total_sessions}/></section></>;
 const notes=<Suspense fallback={<p role="status">Đang tải ghi chú…</p>}><CoachingProfileContext traineeId={trainee.id} section="notes"/></Suspense>;
 const intake=<section id="intake"><p className="coaching-intake-scope">Biểu mẫu hiện lưu năm chỉ số nền. Chưa hỗ trợ PDF và báo cáo chi tiết theo vùng.</p>{trainee.profile_id?<InBodyForm traineeId={trainee.id}/>:<section className="workspace-empty compact"><CircleUserRound size={28}/><h2>Đang chờ học viên kết nối</h2><p>Gửi link mời đã tạo cho học viên. Có thể ghi chú tư vấn riêng trước khi họ nhận lời mời.</p><a href="#coaching-notes">Mở ghi chú tư vấn</a></section>}</section>;
 return <main id="main-content" className="workspace-main dossier-page"><Link href="/workspace" className="workspace-back"><ArrowLeft size={16}/> Danh sách học viên</Link><header className="workspace-page-heading trainee-detail-heading"><div><p className="workspace-kicker">Hồ sơ học viên</p><h1>{trainee.display_name}</h1><p>Bối cảnh coaching, tiến trình và những việc cần làm cùng học viên.</p></div><span className={"workspace-badge "+(trainee.profile_id?"is-verified":"is-pending")}><CircleUserRound size={14}/>{trainee.profile_id?"Đã kết nối tài khoản":"Đang chờ lời mời"}</span></header>
  <div className="workspace-primary-actions">{trainee.profile_id&&trainee.status!=="archived"&&<><Link className="workspace-button" href={"/workspace/chat/"+trainee.id}>Trao đổi với học viên</Link><Link className="workspace-button workspace-button-secondary" href={"/workspace/calendar?trainee="+trainee.id}>Xếp lịch với học viên</Link></>}<a className="workspace-inline-link" href="#coaching-notes">Ghi chú tư vấn</a><a className="workspace-inline-link" href="#intake">Thêm số đo</a></div>
  {searchParams.created&&<p className="workspace-alert is-success" role="status">Bản ghi đã được xác minh và lưu.</p>}
  {nutritionMessage&&<p className={"workspace-alert is-"+(searchParams.nutrition==="updated"?"success":"error")} role="status">{nutritionMessage}</p>}
  <ProfileSectionTabs sections={[{id:"overview",label:"Tổng quan",content:overview},{id:"progress",label:"Tiến trình",content:progress},{id:"membership",label:"Membership & buổi",content:membership},{id:"notes",label:"Ghi chú",content:notes},{id:"intake",label:"Nhập số đo",content:intake}]}/>
 </main>;
}
