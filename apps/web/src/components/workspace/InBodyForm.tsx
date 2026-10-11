"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { CheckCircle2, Info, Ruler, Camera, AlertTriangle, Loader2, Image as ImageIcon } from "lucide-react";
import { submitInBodyForm } from "@/features/workspace/actions";
import { startOcrAttempt, getOcrAttemptSignedUrl } from "@/features/workspace/ocr-actions";
import { initialWorkspaceActionState } from "@/features/workspace/action-state";
import { type OcrNormalizedDraft } from "@/features/workspace/ocr-validation";
import SubmitButton from "./SubmitButton";

function ErrorText({ error }: { error?: string }) {
  return error ? <span className="workspace-field-error">{error}</span> : null;
}

export default function InBodyForm({ traineeId }: { traineeId: string }) {
  const boundAction = submitInBodyForm.bind(null, traineeId);
  const [state, action] = useFormState(boundAction, initialWorkspaceActionState);
  const currentState = state ?? initialWorkspaceActionState;
  const formRef = useRef<HTMLFormElement>(null);

  const [ocrStatus, setOcrStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [ocrMessage, setOcrMessage] = useState<string>("");
  const [ocrImageUrl, setOcrImageUrl] = useState<string>("");
  const [ocrWarnings, setOcrWarnings] = useState<string[]>([]);
  const [attemptId, setAttemptId] = useState<string>("");
  const [draftData, setDraftData] = useState<OcrNormalizedDraft | null>(null);

  useEffect(() => {
    if (currentState.status === "success") {
      formRef.current?.reset();
      setOcrStatus("idle");
      setOcrImageUrl("");
      setAttemptId("");
      setDraftData(null);
      setOcrWarnings([]);
      sessionStorage.removeItem(`ocr_attempt_${traineeId}`);
    }
  }, [currentState, traineeId]);

  useEffect(() => {
    const savedAttempt = sessionStorage.getItem(`ocr_attempt_${traineeId}`);
    if (savedAttempt) {
      setOcrStatus("uploading");
      getOcrAttemptSignedUrl(savedAttempt).then((res) => {
        if (res.success && res.signedUrl && res.draft) {
          setAttemptId(savedAttempt);
          setOcrImageUrl(res.signedUrl);
          setDraftData(res.draft as OcrNormalizedDraft);
          setOcrWarnings(res.draft.warnings || []);
          setOcrStatus("success");
        } else {
          sessionStorage.removeItem(`ocr_attempt_${traineeId}`);
          setOcrStatus("idle");
        }
      }).catch(() => {
        setOcrStatus("idle");
      });
    }
  }, [traineeId]);

  function clearOcrDraft() {
    setOcrStatus("idle");
    setOcrMessage("");
    setOcrImageUrl("");
    setAttemptId("");
    setDraftData(null);
    setOcrWarnings([]);
    sessionStorage.removeItem(`ocr_attempt_${traineeId}`);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setOcrStatus("error");
      setOcrMessage("Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setOcrStatus("error");
      setOcrMessage("Dung lượng ảnh vượt quá 10MB.");
      return;
    }

    setOcrStatus("uploading");
    setOcrMessage("");
    
    const formData = new FormData();
    formData.append("file", file);
    if (process.env.NEXT_PUBLIC_E2E_TEST === "true") {
      const ms = document.querySelector<HTMLInputElement>('input[name="mockScenario"]')?.value;
      if (ms) formData.append("mockScenario", ms);
    }

    try {
      const result = await startOcrAttempt(traineeId, initialWorkspaceActionState, formData);
      if (result.status === "success") {
        setOcrStatus("success");
        setOcrImageUrl(result.ocrSourceImageUrl || "");
        setAttemptId(result.ocrAttemptId || "");
        setDraftData((result.ocrDraft as OcrNormalizedDraft) || null);
        setOcrWarnings((result.ocrDraft as OcrNormalizedDraft)?.warnings || []);
        if (result.ocrAttemptId) {
          sessionStorage.setItem(`ocr_attempt_${traineeId}`, result.ocrAttemptId);
        }
      } else {
        setOcrStatus("error");
        setOcrMessage(result.message || "Không thể xử lý ảnh. Vui lòng nhập thủ công.");
        setOcrImageUrl("");
        setAttemptId("");
        setDraftData(null);
      }
    } catch {
      setOcrStatus("error");
      setOcrMessage("Lỗi kết nối. Vui lòng nhập thủ công.");
      setOcrImageUrl("");
      setAttemptId("");
      setDraftData(null);
    }
    
    // Reset file input so user can re-upload if needed
    e.target.value = "";
  }

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

      <div className="workspace-ocr-panel workspace-field-wide">
        <div className="workspace-ocr-heading">
          <Camera size={18} />
          <div><strong>Nhận diện phiếu InBody</strong><span>Thử nghiệm</span></div>
        </div>
        <p className="workspace-helper">
          Khi dịch vụ khả dụng, ảnh chỉ tạo bản nháp. PT vẫn phải rà soát và xác nhận; nhập thủ công luôn sẵn sàng.
        </p>
        
        {ocrStatus === "uploading" ? (
          <div className="workspace-ocr-progress" role="status">
            <Loader2 size={16} className="animate-spin" /> Đang tải và chuẩn bị bản nháp...
          </div>
        ) : (
          <label className="workspace-upload-field workspace-ocr-upload" htmlFor="inbody-photo">
            <Camera size={20} />
            <span><strong>Chọn ảnh phiếu InBody</strong><small>JPG, PNG hoặc WebP, tối đa 10 MB.</small></span>
            <input id="inbody-photo" name="inbodyPhoto" type="file" accept="image/jpeg, image/png, image/webp" capture="environment" onChange={handleFileUpload} />
          </label>
        )}

        {ocrStatus === "error" && (
          <p className="workspace-alert is-error workspace-ocr-message" aria-live="assertive"><AlertTriangle size={15}/> {ocrMessage}</p>
        )}

        {ocrStatus === "success" && (
          <p aria-live="polite" className="workspace-alert is-success workspace-ocr-message"><CheckCircle2 size={15} /> Tải ảnh thành công. Vui lòng kiểm tra lại từng chỉ số.</p>
        )}

        {ocrWarnings.length > 0 && (
          <div className="workspace-alert is-warning workspace-ocr-message">
            <ul>
              {ocrWarnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        {ocrImageUrl && (
          <figure className="workspace-ocr-source">
            <figcaption>
              <ImageIcon size={14} /> Ảnh nguồn (bảo mật)
            </figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ocrImageUrl} alt="Bản chụp InBody cần rà soát" />
          </figure>
        )}
      </div>

      <form ref={formRef} action={action} className="workspace-form-grid">
        <input type="hidden" name="ocrAttemptId" value={attemptId} />
        {attemptId && (
          <div className="workspace-ocr-clear workspace-field-wide">
            <button type="button" onClick={clearOcrDraft} className="workspace-button workspace-button-secondary">
              Bỏ bản nháp và nhập thủ công
            </button>
          </div>
        )}
        <fieldset className="workspace-fieldset workspace-field-wide">
          <legend><Ruler size={16} /> Chỉ số đo {ocrStatus === "success" && <span className="workspace-badge is-draft">Bản nháp OCR cần kiểm tra</span>}</legend>
          <p className="workspace-helper">FitSync sẽ đối chiếu giới hạn và sự nhất quán giữa cân nặng, khối mỡ và tỷ lệ mỡ.</p>
          <div className="workspace-metric-fields" key={attemptId || 'manual'}>
            <label className="workspace-field" htmlFor="weight-kg">
              <span>Cân nặng (kg)</span>
              <input id="weight-kg" data-testid="weight-kg" name="weightKg" type="number" inputMode="decimal" min={30} max={220} step="0.01" defaultValue={draftData?.metrics?.weight_kg ?? ""} required />
              <ErrorText error={currentState.fieldErrors?.weightKg} />
            </label>
            <label className="workspace-field" htmlFor="muscle-kg">
              <span>Khối cơ xương (kg)</span>
              <input id="muscle-kg" name="skeletalMuscleMassKg" type="number" inputMode="decimal" min={10} max={75} step="0.01" defaultValue={draftData?.metrics?.skeletal_muscle_mass_kg ?? ""} required />
              <ErrorText error={currentState.fieldErrors?.skeletalMuscleMassKg} />
            </label>
            <label className="workspace-field" htmlFor="fat-mass-kg">
              <span>Khối mỡ (kg)</span>
              <input id="fat-mass-kg" name="bodyFatMassKg" type="number" inputMode="decimal" min={2} max={100} step="0.01" defaultValue={draftData?.metrics?.body_fat_mass_kg ?? ""} required />
              <ErrorText error={currentState.fieldErrors?.bodyFatMassKg} />
            </label>
            <label className="workspace-field" htmlFor="body-fat-percent">
              <span>Tỷ lệ mỡ (%) {ocrWarnings.some(w => w.includes("Tỷ lệ mỡ")) && <AlertTriangle className="workspace-warning-icon" size={14} />}</span>
              <input className={ocrWarnings.some(w => w.includes("Tỷ lệ mỡ")) ? "is-warning" : undefined} id="body-fat-percent" name="percentBodyFat" type="number" inputMode="decimal" min={3} max={60} step="0.1" defaultValue={draftData?.metrics?.percent_body_fat ?? ""} required />
              <ErrorText error={currentState.fieldErrors?.percentBodyFat} />
            </label>
            <label className="workspace-field" htmlFor="body-water-liters">
              <span>Tổng nước cơ thể (L)</span>
              <input id="body-water-liters" name="totalBodyWaterLiters" type="number" inputMode="decimal" min={10} max={100} step="0.01" defaultValue={draftData?.metrics?.total_body_water_liters ?? ""} />
              <ErrorText error={currentState.fieldErrors?.totalBodyWaterLiters} />
            </label>
          </div>
        </fieldset>

        <fieldset className="workspace-fieldset workspace-field-wide">
          <legend>Mục tiêu dinh dưỡng, bản nháp coaching</legend>
          <p className="workspace-helper">Các giá trị này có thể chỉnh lại sau. Đây không phải chỉ định y khoa.</p>
          <div className="workspace-metric-fields nutrition">
            <label className="workspace-field" htmlFor="target-calories"><span>Năng lượng (kcal)</span><input id="target-calories" name="targetCalories" type="number" min={800} max={6000} step={1} /></label>
            <label className="workspace-field" htmlFor="target-protein"><span>Đạm (g)</span><input id="target-protein" name="targetProteinGrams" type="number" min={0} max={500} step={1} /></label>
            <label className="workspace-field" htmlFor="target-carbs"><span>Tinh bột (g)</span><input id="target-carbs" name="targetCarbGrams" type="number" min={0} max={1000} step={1} /></label>
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
