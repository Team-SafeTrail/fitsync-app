"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { ChevronDown, ExternalLink, Plus, ShieldCheck, UserPlus } from "lucide-react";
import { createTrainee } from "@/features/workspace/actions";
import { initialWorkspaceActionState, type WorkspaceActionState } from "@/features/workspace/action-state";
import CopyInvitationButton from "./CopyInvitationButton";
import SubmitButton from "./SubmitButton";
import { PendingFields, usePreservedForm } from "./PreservedForm";

function FieldError({ error }: { error?: string }) {
  return error ? <span className="workspace-field-error">{error}</span> : null;
}

const invitationDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Ho_Chi_Minh",
});

export default function CreateTraineeForm({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const {ref:formRef,reset,onReset}=usePreservedForm();
  const [state, action] = useActionState(async(previous:WorkspaceActionState,form:FormData):Promise<WorkspaceActionState>=>{
    try {const result=await createTrainee(previous,form);if(result.status==="success")reset();return result;}
    catch {return {status:"error",message:"Chưa xác nhận được hồ sơ. Dữ liệu vẫn được giữ; kiểm tra danh sách trước khi tạo lại."};}
  }, initialWorkspaceActionState);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!state.invitationUrl) return;
    setIsOpen(true);
  }, [state.invitationUrl]);

  useEffect(() => {
    const openForm = () => setIsOpen(true);
    window.addEventListener("fitsync:open-trainee-form", openForm);
    return () => window.removeEventListener("fitsync:open-trainee-form", openForm);
  }, []);

  return (
    <details
      id="new-trainee"
      className="workspace-panel workspace-create-panel"
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary className="workspace-create-summary">
        <div>
          <span className="workspace-summary-icon"><Plus size={18} /></span>
          <span><strong id="create-trainee-title">Thêm học viên</strong><small>Tạo hồ sơ, gói buổi tập và liên kết mời bảo mật</small></span>
        </div>
        <div className="workspace-summary-right">
          <span className="workspace-invite-chip"><ShieldCheck size={14} /> Link dùng 1 lần · 7 ngày</span>
          <ChevronDown className="workspace-summary-chevron" size={19} />
        </div>
      </summary>

      <div className="workspace-create-content">
        {state.message && !state.invitationUrl && (
          <p className={`workspace-alert is-${state.status}`} role={state.status === "error" ? "alert" : "status"}>
            {state.message}
          </p>
        )}

        {state.invitationUrl && (
          <div className="workspace-invite-result" role="status">
            <div className="workspace-invite-heading">
              <div>
                <ShieldCheck size={18} />
                <div>
                  <strong>Link mời đã sẵn sàng</strong>
                  {state.message && <p className="workspace-invite-subnote">{state.message}</p>}
                </div>
              </div>
              {state.invitationExpiresAt && (
                <span className="workspace-invite-expiry">
                  Hết hạn {invitationDateFormatter.format(new Date(state.invitationExpiresAt))}
                </span>
              )}
            </div>
            <label htmlFor="created-invitation">Gửi link này cho đúng học viên (token chỉ hiển thị một lần)</label>
            <div className="workspace-invite-actions">
              <input id="created-invitation" data-testid="invitation-link" readOnly value={state.invitationUrl} />
              <CopyInvitationButton value={state.invitationUrl} />
              <a className="workspace-button workspace-button-secondary" href={state.invitationUrl} target="_blank" rel="noreferrer">
                Mở thử <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}

        <form ref={formRef} onReset={onReset} action={action} className="workspace-create-split">
          <PendingFields>
            <div className="workspace-create-group">
              <div className="workspace-create-group-head">
                <span className="workspace-kicker">01 · Thông tin học viên</span>
              </div>
              <div className="workspace-create-fields">
                <label className="workspace-field" htmlFor="trainee-name">
                  <span>Tên hiển thị</span>
                  <input id="trainee-name" name="displayName" autoComplete="name" placeholder="Ví dụ: Nguyễn Minh Anh" minLength={2} maxLength={100} required />
                  <FieldError error={state.fieldErrors?.displayName} />
                </label>
                <div className="workspace-create-pair">
                  <label className="workspace-field" htmlFor="trainee-email">
                    <span>Email nhận lời mời</span>
                    <input id="trainee-email" name="email" type="email" autoComplete="email" placeholder="hocvien@example.com" required />
                    <FieldError error={state.fieldErrors?.email} />
                  </label>
                  <label className="workspace-field" htmlFor="trainee-phone">
                    <span>Số điện thoại (không bắt buộc)</span>
                    <input id="trainee-phone" name="phone" type="tel" autoComplete="tel" placeholder="09xx xxx xxx" minLength={8} maxLength={20} />
                    <FieldError error={state.fieldErrors?.phone} />
                  </label>
                </div>
              </div>
            </div>

            <div className="workspace-create-group">
              <div className="workspace-create-group-head">
                <span className="workspace-kicker">02 · Mục tiêu &amp; gói buổi</span>
              </div>
              <div className="workspace-create-fields">
                <label className="workspace-field" htmlFor="trainee-goal">
                  <span>Mục tiêu chính</span>
                  <select id="trainee-goal" name="goal" defaultValue="fat_loss">
                    <option value="fat_loss">Giảm mỡ</option>
                    <option value="muscle_gain">Tăng cơ</option>
                    <option value="recomp">Tái cấu trúc cơ thể</option>
                  </select>
                  <FieldError error={state.fieldErrors?.goal} />
                </label>
                <div className="workspace-create-pair">
                  <label className="workspace-field" htmlFor="total-sessions">
                    <span>Tổng số buổi</span>
                    <input id="total-sessions" name="totalSessions" type="number" inputMode="numeric" min={0} max={500} defaultValue={12} required />
                    <FieldError error={state.fieldErrors?.totalSessions} />
                  </label>
                  <label className="workspace-field" htmlFor="remaining-sessions">
                    <span>Số buổi còn lại</span>
                    <input id="remaining-sessions" name="remainingSessions" type="number" inputMode="numeric" min={0} max={500} defaultValue={12} required />
                    <FieldError error={state.fieldErrors?.remainingSessions} />
                  </label>
                </div>
                <div className="workspace-create-footer">
                  <p className="workspace-create-hint">
                    <ShieldCheck size={14} /> FitSync chỉ lưu bản băm của token mời.
                  </p>
                  <SubmitButton idle="Tạo học viên & link mời" pending="Đang tạo..." icon={<UserPlus size={16} aria-hidden="true" />} />
                </div>
              </div>
            </div>
          </PendingFields>
        </form>
      </div>
    </details>
  );
}
