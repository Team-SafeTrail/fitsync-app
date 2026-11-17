"use client";

import { useActionState } from "react";
import { Camera, CheckCircle2, NotebookPen } from "lucide-react";
import { submitDailyCheckin } from "@/features/workspace/actions";
import { initialWorkspaceActionState, type WorkspaceActionState } from "@/features/workspace/action-state";
import SubmitButton from "./SubmitButton";
import { PendingFields, usePreservedForm } from "./PreservedForm";
import {navigateAfterSave} from "./navigate-after-save";

export default function CheckinForm() {
  const { ref: formRef, onReset } = usePreservedForm();
  const [state, action, isPending] = useActionState(async (previous: WorkspaceActionState, form: FormData): Promise<WorkspaceActionState> => {
    try { const result=await submitDailyCheckin(previous,form);if(result.status==="success")navigateAfterSave("/workspace");return result; }
    catch { return {status:"error",message:"Chưa xác nhận được check-in. Ảnh và ghi chú được giữ; kiểm tra lịch sử trước khi gửi lại."}; }
  }, initialWorkspaceActionState);

  return (
    <section className="workspace-panel workspace-checkin-panel" aria-labelledby="daily-checkin-title">
      <div className="workspace-section-heading">
        <div>
          <p className="workspace-kicker">Hôm nay</p>
          <h2 id="daily-checkin-title">Check-in trong một phút</h2>
        </div>
        <p><CheckCircle2 size={15} /> Một lần mỗi ngày theo giờ Việt Nam.</p>
      </div>

      {state.message && (
        <p className={`workspace-alert is-${state.status}`} role={state.status === "error" ? "alert" : "status"}>
          {state.message}
        </p>
      )}

      <form ref={formRef} onReset={onReset} action={action} className="workspace-checkin-form"><PendingFields disabled={isPending||state.status==="success"}>
        <label className="workspace-field" htmlFor="checkin-note">
          <span><NotebookPen size={15} /> Ghi chú (không bắt buộc)</span>
          <textarea
            id="checkin-note"
            name="note"
            maxLength={500}
            rows={4}
            placeholder="Ví dụ: năng lượng tốt, đã hoàn thành buổi chân."
          />
          {state.fieldErrors?.note && <span className="workspace-field-error">{state.fieldErrors.note}</span>}
        </label>

        <label className="workspace-upload-field" htmlFor="meal-photo">
          <Camera size={20} />
          <span><strong>Thêm ảnh bữa ăn</strong><small>JPEG, PNG hoặc WebP, tối đa 5 MB. Ảnh được lưu riêng tư.</small></span>
          <input id="meal-photo" name="mealPhoto" type="file" accept="image/jpeg,image/png,image/webp" />
        </label>
        {state.fieldErrors?.mealPhoto && <span className="workspace-field-error">{state.fieldErrors.mealPhoto}</span>}

        <div className="workspace-form-action">
          <SubmitButton idle="Gửi check-in hôm nay" pending="Đang lưu riêng tư..." />
        </div>
      </PendingFields></form>
    </section>
  );
}
