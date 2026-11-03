import Link from "next/link";
import {redirect} from "next/navigation";
import {getTraineeHome,getWorkspaceViewer} from "@/features/workspace/data";
import ProgressHistory from "@/components/workspace/ProgressHistory";
import InBodyRecordCard from "@/components/workspace/InBodyRecordCard";
export const dynamic="force-dynamic";
export default async function LearnerProgressPage() {
 const viewer=await getWorkspaceViewer();if(!viewer)redirect("/login");if(viewer.profile.role!=="trainee")redirect("/workspace");
 const {trainee,records}=await getTraineeHome(viewer.user.id);
 return <main id="main-content" className="workspace-main"><header className="coaching-page-header"><div><Link href="/workspace">Về Hôm nay</Link><h1>Tiến trình của bạn.</h1><p>Xem lại các lần ghi nhận đã được PT xác nhận, với ngày, nguồn và đơn vị rõ ràng.</p></div><Link href="/workspace/chat">Trao đổi với PT</Link></header>
  {!trainee?<div className="workspace-empty"><h2>Chưa kết nối với PT</h2><p>Mở lời mời từ PT để xem hồ sơ của bạn.</p></div>:<><ProgressHistory records={records}/><section className="workspace-record-list" aria-label="Lịch sử chỉ số đã xác nhận">{records.length?records.map(record=><InBodyRecordCard key={record.id} record={record} traineeId={trainee.id} editableNutrition={false}/>):<p>Chưa có bản ghi đã xác minh.</p>}</section></>}
 </main>;
}
