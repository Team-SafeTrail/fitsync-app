"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { Camera, CheckCircle2, NotebookPen } from "lucide-react";
import { submitDailyCheckin } from "@/features/workspace/actions";
import { initialWorkspaceActionState } from "@/features/workspace/action-state";
import SubmitButton from "./SubmitButton";

export default function CheckinForm() {
  const [state, action] = useFormState(submitDailyCheckin, initialWorkspaceActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

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

      <form ref={formRef} action={action} className="workspace-checkin-form">
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
      </form>
    </section>
  );
}
