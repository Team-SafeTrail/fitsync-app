"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { CheckCircle2, Info, Ruler } from "lucide-react";
import { createInBodyRecord } from "@/features/workspace/actions";
import { initialWorkspaceActionState } from "@/features/workspace/action-state";
import SubmitButton from "./SubmitButton";

function ErrorText({ error }: { error?: string }) {
  return error ? <span className="workspace-field-error">{error}</span> : null;
}

export default function InBodyForm({ traineeId }: { traineeId: string }) {
  const boundAction = createInBodyRecord.bind(null, traineeId);
  const [state, action] = useFormState(boundAction, initialWorkspaceActionState);
  const currentState = state ?? initialWorkspaceActionState;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (currentState.status === "success") formRef.current?.reset();
  }, [currentState]);

  return (
    <section className="workspace-panel" aria-labelledby="inbody-form-title">
      <div className="workspace-section-heading">
        <div>
          <p className="workspace-kicker">Bản ghi mới</p>
          <h2 id="inbody-form-title">Xác nhận năm chỉ số InBody</h2>
        </div>
        <p><Info size={15} /> Nhập từ phiếu InBody, sau đó kiểm tra lại trước khi xác nhận.</p>
      </div>
      {currentState.message && <p className={`workspace-alert is-${currentState.status}`} role={currentState.status === "error" ? "alert" : "status"}>{currentState.message}</p>}

      <form ref={formRef} action={action} className="workspace-form-grid">
        <fieldset className="workspace-fieldset workspace-field-wide">
          <legend><Ruler size={16} /> Chỉ số đo</legend>
          <p className="workspace-helper">FitSync sẽ đối chiếu giới hạn và sự nhất quán giữa cân nặng, khối mỡ và tỷ lệ mỡ.</p>
          <div className="workspace-metric-fields">
            <label className="workspace-field" htmlFor="weight-kg">
              <span>Cân nặng (kg)</span>
              <input id="weight-kg" data-testid="weight-kg" name="weightKg" type="number" inputMode="decimal" min={30} max={220} step="0.01" required />
              <ErrorText error={currentState.fieldErrors?.weightKg} />
            </label>
            <label className="workspace-field" htmlFor="muscle-kg">
              <span>Khối cơ xương (kg)</span>
              <input id="muscle-kg" name="skeletalMuscleMassKg" type="number" inputMode="decimal" min={10} max={75} step="0.01" required />
              <ErrorText error={currentState.fieldErrors?.skeletalMuscleMassKg} />
            </label>
            <label className="workspace-field" htmlFor="fat-mass-kg">
              <span>Khối mỡ (kg)</span>
              <input id="fat-mass-kg" name="bodyFatMassKg" type="number" inputMode="decimal" min={2} max={100} step="0.01" required />
              <ErrorText error={currentState.fieldErrors?.bodyFatMassKg} />
            </label>
            <label className="workspace-field" htmlFor="body-fat-percent">
              <span>Tỷ lệ mỡ (%)</span>
              <input id="body-fat-percent" name="percentBodyFat" type="number" inputMode="decimal" min={3} max={60} step="0.1" required />
              <ErrorText error={currentState.fieldErrors?.percentBodyFat} />
            </label>
            <label className="workspace-field" htmlFor="body-water-liters">
              <span>Tổng nước cơ thể (L)</span>
              <input id="body-water-liters" name="totalBodyWaterLiters" type="number" inputMode="decimal" min={10} max={100} step="0.01" />
              <ErrorText error={currentState.fieldErrors?.totalBodyWaterLiters} />
            </label>
          </div>
        </fieldset>

        <fieldset className="workspace-fieldset workspace-field-wide">
          <legend>Mục tiêu dinh dưỡng, bản nháp coaching</legend>
          <p className="workspace-helper">Các giá trị này có thể chỉnh lại sau. Đây không phải chỉ định y khoa.</p>
          <div className="workspace-metric-fields nutrition">
            <label className="workspace-field" htmlFor="target-calories"><span>Năng lượng (kcal)</span><input id="target-calories" name="targetCalories" type="number" min={800} max={6000} step={1} /></label>
            <label className="workspace-field" htmlFor="target-protein"><span>Protein (g)</span><input id="target-protein" name="targetProteinGrams" type="number" min={0} max={500} step={1} /></label>
            <label className="workspace-field" htmlFor="target-carbs"><span>Carb (g)</span><input id="target-carbs" name="targetCarbGrams" type="number" min={0} max={1000} step={1} /></label>
            <label className="workspace-field" htmlFor="target-fat"><span>Chất béo (g)</span><input id="target-fat" name="targetFatGrams" type="number" min={0} max={300} step={1} /></label>
          </div>
        </fieldset>

        <label className="workspace-confirm workspace-field-wide" htmlFor="confirm-inbody">
          <input id="confirm-inbody" name="confirmed" type="checkbox" />
          <span><strong><CheckCircle2 size={15} /> Sẵn sàng xác nhận</strong>Tôi đã đối chiếu các chỉ số với phiếu đo và hiểu rằng dữ liệu sinh trắc sẽ bị khóa sau khi lưu.</span>
        </label>
        <ErrorText error={currentState.fieldErrors?.confirmed} />
        <div className="workspace-form-action workspace-field-wide">
          <SubmitButton idle="Xác nhận và lưu" pending="Đang xác nhận..." />
        </div>
      </form>
    </section>
  );
}
