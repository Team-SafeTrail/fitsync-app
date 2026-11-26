"use client";
import { useActionState } from "react";
import { archiveRosterProfile, saveRosterProfile } from "@/features/workspace/roster-actions";
import { reissueInvitation, revokeInvitation } from "@/features/workspace/actions";
import { initialWorkspaceActionState } from "@/features/workspace/action-state";
import type { Trainee } from "@/features/workspace/data";
import SubmitButton from "./SubmitButton";
import CopyInvitationButton from "./CopyInvitationButton";

function InvitationControls({ traineeId }: { traineeId: string }) {
  const [issued, issue] = useActionState(async () => reissueInvitation(traineeId), initialWorkspaceActionState);
  const [revoked, revoke] = useActionState(async () => revokeInvitation(traineeId), initialWorkspaceActionState);
  return <section className="workspace-panel"><h3>Lời mời kết nối</h3><p>Cấp link mới sẽ thu hồi link chưa nhận trước đó. Chỉ gửi link cho đúng học viên.</p><div className="workspace-primary-actions"><form action={issue}><SubmitButton pending="Đang cấp…" idle="Cấp lại link mời"/></form><form action={revoke}><SubmitButton pending="Đang thu hồi…" idle="Thu hồi lời mời"/></form></div>{issued.message && <p role="status">{issued.message}</p>}{issued.invitationUrl && <div className="workspace-invite-actions"><input aria-label="Link mời cấp lại" readOnly value={issued.invitationUrl}/><CopyInvitationButton value={issued.invitationUrl}/></div>}{revoked.message && <p role="status">{revoked.message}</p>}</section>;
}

export default function RosterLifecycle({ trainee }: { trainee: Trainee }) {
  const archived = trainee.status === "archived";
  const [saved, save] = useActionState(saveRosterProfile.bind(null, trainee.id, trainee.roster_version), initialWorkspaceActionState);
  const [changed, change] = useActionState(archiveRosterProfile.bind(null, trainee.id, trainee.roster_version, !archived), initialWorkspaceActionState);
  return <details className="workspace-panel"><summary>Quản lý hồ sơ và lời mời</summary>
    {!archived && <form aria-label="Sửa hồ sơ học viên" action={save} className="workspace-form-grid"><label className="workspace-field">Tên hiển thị<input name="displayName" defaultValue={trainee.display_name} minLength={2} maxLength={100} required/></label><label className="workspace-field">Số điện thoại<input name="phone" type="tel" defaultValue={trainee.phone ?? ""} maxLength={20}/></label><label className="workspace-field">Mục tiêu<select name="goal" defaultValue={trainee.primary_goal}><option value="fat_loss">Giảm mỡ</option><option value="muscle_gain">Tăng cơ</option><option value="recomp">Tái cấu trúc</option></select></label><div className="workspace-field-wide"><SubmitButton pending="Đang lưu…" idle="Lưu hồ sơ"/>{saved.message && <p role={saved.status === "error" ? "alert" : "status"}>{saved.message}</p>}</div></form>}
    {!archived && !trainee.profile_id && <InvitationControls traineeId={trainee.id}/>}
    <form aria-label="Trạng thái hồ sơ" action={change}><h3>{archived ? "Khôi phục hồ sơ" : "Lưu trữ hồ sơ"}</h3><p>{archived ? "Khôi phục để tiếp tục coaching và giữ nguyên lịch sử đã có." : "Đưa học viên ra khỏi danh sách đang theo dõi, dừng trao đổi và thu hồi lời mời chưa nhận. Lịch sử được giữ lại."}</p><label><input type="checkbox" name="confirmed" required/> Tôi xác nhận {archived ? "khôi phục" : "lưu trữ"} hồ sơ này</label><p><SubmitButton pending="Đang cập nhật…" idle={archived ? "Khôi phục hồ sơ" : "Lưu trữ hồ sơ"}/></p>{changed.message && <p role={changed.status === "error" ? "alert" : "status"}>{changed.message}</p>}</form>
  </details>;
}
