"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { ChevronDown, Plus, ShieldCheck } from "lucide-react";
import { createTrainee } from "@/features/workspace/actions";
import { initialWorkspaceActionState } from "@/features/workspace/action-state";
import CopyInvitationButton from "./CopyInvitationButton";
import SubmitButton from "./SubmitButton";

function FieldError({ error }: { error?: string }) {
  return error ? <span className="workspace-field-error">{error}</span> : null;
}

const invitationDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Ho_Chi_Minh",
});

export default function CreateTraineeForm({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [state, action] = useFormState(createTrainee, initialWorkspaceActionState);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.invitationUrl) return;
    setIsOpen(true);
    formRef.current?.reset();
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
        <ChevronDown className="workspace-summary-chevron" size={19} />
      </summary>

      <div className="workspace-create-content">
        <div className="workspace-section-heading workspace-form-heading">
          <div>
            <p className="workspace-kicker">Hồ sơ mới</p>
            <h2>Tạo học viên và lời mời</h2>
          </div>
          <p><ShieldCheck size={15} /> Link dùng một lần, tự hết hạn sau 7 ngày.</p>
        </div>

        {state.message && (
          <p className={`workspace-alert is-${state.status}`} role={state.status === "error" ? "alert" : "status"}>
            {state.message}
          </p>
        )}

        {state.invitationUrl && (
          <div className="workspace-invite-result">
            <div className="workspace-invite-heading">
              <div><ShieldCheck size={17} /><strong>Link mời đã sẵn sàng</strong></div>
              {state.invitationExpiresAt && <span>Hết hạn {invitationDateFormatter.format(new Date(state.invitationExpiresAt))}</span>}
            </div>
            <label htmlFor="created-invitation">Gửi link này cho đúng học viên</label>
            <div className="workspace-invite-actions">
              <input id="created-invitation" data-testid="invitation-link" readOnly value={state.invitationUrl} />
              <CopyInvitationButton value={state.invitationUrl} />
              <a className="workspace-button workspace-button-secondary" href={state.invitationUrl} target="_blank" rel="noreferrer">
                Mở thử
              </a>
            </div>
            <p>FitSync chỉ lưu bản băm của token. Hãy sao chép trước khi rời hoặc tải lại trang này.</p>
          </div>
        )}

      <form ref={formRef} action={action} className="workspace-form-grid">
        <label className="workspace-field workspace-field-wide" htmlFor="trainee-name">
          <span>Tên hiển thị</span>
          <input id="trainee-name" name="displayName" autoComplete="name" minLength={2} maxLength={100} required />
          <FieldError error={state.fieldErrors?.displayName} />
        </label>
        <label className="workspace-field" htmlFor="trainee-email">
          <span>Email nhận lời mời</span>
          <input id="trainee-email" name="email" type="email" autoComplete="email" required />
          <FieldError error={state.fieldErrors?.email} />
        </label>
        <label className="workspace-field" htmlFor="trainee-phone">
          <span>Số điện thoại (không bắt buộc)</span>
          <input id="trainee-phone" name="phone" type="tel" autoComplete="tel" minLength={8} maxLength={20} />
          <FieldError error={state.fieldErrors?.phone} />
        </label>
        <label className="workspace-field" htmlFor="trainee-goal">
          <span>Mục tiêu chính</span>
          <select id="trainee-goal" name="goal" defaultValue="fat_loss">
            <option value="fat_loss">Giảm mỡ</option>
            <option value="muscle_gain">Tăng cơ</option>
            <option value="recomp">Tái cấu trúc cơ thể</option>
          </select>
          <FieldError error={state.fieldErrors?.goal} />
        </label>
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
        <div className="workspace-form-action workspace-field-wide">
          <SubmitButton idle="Tạo học viên & link mời" pending="Đang tạo..." />
        </div>
      </form>
      </div>
    </details>
  );
}
