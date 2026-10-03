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
    } catch (err) {
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

      {/* OCR Upload Section */}
      <div className="workspace-fieldset workspace-field-wide" style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Camera size={18} /> <strong>Quét ảnh InBody (Thử nghiệm)</strong>
        </div>
        <p className="workspace-helper" style={{ marginBottom: '1rem' }}>
          Tải lên ảnh chụp phiếu InBody để máy trích xuất số liệu tự động. (Hỗ trợ JPG, PNG, WEBP)
        </p>
        
        {ocrStatus === "uploading" ? (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: "var(--text-muted)" }}>
            <Loader2 size={16} className="animate-spin" /> Đang tải lên và xử lý ảnh...
          </div>
        ) : (
          <label className="workspace-field" style={{ display: "inline-block", width: "auto", cursor: "pointer" }}>
            <span className="sr-only">Tải ảnh lên</span>
            <input type="file" accept="image/jpeg, image/png, image/webp" capture="environment" onChange={handleFileUpload} />
          </label>
        )}

        {ocrStatus === "error" && (
          <p className="workspace-alert is-error" style={{ marginTop: '1rem' }} aria-live="assertive"><AlertTriangle size={15}/> {ocrMessage}</p>
        )}

        {ocrStatus === "success" && (
          <div aria-live="polite" className="sr-only">Tải ảnh thành công, vui lòng kiểm tra lại số liệu.</div>
        )}

        {ocrWarnings.length > 0 && (
          <div className="workspace-alert is-warning" style={{ marginTop: '1rem' }}>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              {ocrWarnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        {ocrImageUrl && (
          <div style={{ marginTop: '1rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--surface-raised)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={14} /> Ảnh nguồn (bảo mật)
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ocrImageUrl} alt="Bản chụp InBody" style={{ display: 'block', width: '100%', maxHeight: '400px', objectFit: 'contain', backgroundColor: '#000' }} />
          </div>
        )}
      </div>

      <form ref={formRef} action={action} className="workspace-form-grid">
        <input type="hidden" name="ocrAttemptId" value={attemptId} />
        {attemptId && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button type="button" onClick={clearOcrDraft} className="workspace-btn workspace-btn-secondary" style={{ fontSize: '0.8rem' }}>
              Hủy bản nháp OCR / Nhập thủ công
            </button>
          </div>
        )}
        <fieldset className="workspace-fieldset workspace-field-wide">
          <legend><Ruler size={16} /> Chỉ số đo {ocrStatus === "success" && <span style={{fontSize: '0.8rem', color: 'var(--accent-primary)'}}>(Bản nháp OCR)</span>}</legend>
          <p className="workspace-helper">FitSync sẽ đối chiếu giới hạn và sự nhất quán giữa cân nặng, khối mỡ và tỷ lệ mỡ.</p>
          <div className="workspace-metric-fields" key={attemptId || 'manual'}>
            <label className="workspace-field" htmlFor="weight-kg">
              <span>Cân nặng (kg)</span>
              <input id="weight-kg" data-testid="weight-kg" name="weightKg" type="number" inputMode="decimal" min={30} max={220} step="0.01" defaultValue={draftData?.metrics?.weight_kg} required />
              <ErrorText error={currentState.fieldErrors?.weightKg} />
            </label>
            <label className="workspace-field" htmlFor="muscle-kg">
              <span>Khối cơ xương (kg)</span>
              <input id="muscle-kg" name="skeletalMuscleMassKg" type="number" inputMode="decimal" min={10} max={75} step="0.01" defaultValue={draftData?.metrics?.skeletal_muscle_mass_kg} required />
              <ErrorText error={currentState.fieldErrors?.skeletalMuscleMassKg} />
            </label>
            <label className="workspace-field" htmlFor="fat-mass-kg">
              <span>Khối mỡ (kg)</span>
              <input id="fat-mass-kg" name="bodyFatMassKg" type="number" inputMode="decimal" min={2} max={100} step="0.01" defaultValue={draftData?.metrics?.body_fat_mass_kg} required />
              <ErrorText error={currentState.fieldErrors?.bodyFatMassKg} />
            </label>
            <label className="workspace-field" htmlFor="body-fat-percent">
              <span>Tỷ lệ mỡ (%) {ocrWarnings.some(w => w.includes("Tỷ lệ mỡ")) && <AlertTriangle size={14} color="var(--intent-warning)" style={{display: 'inline', verticalAlign: 'middle', marginLeft: '0.3rem'}}/>}</span>
              <input id="body-fat-percent" name="percentBodyFat" type="number" inputMode="decimal" min={3} max={60} step="0.1" defaultValue={draftData?.metrics?.percent_body_fat} required style={ocrWarnings.some(w => w.includes("Tỷ lệ mỡ")) ? { borderColor: 'var(--intent-warning)', backgroundColor: 'color-mix(in srgb, var(--intent-warning) 10%, transparent)' } : {}}/>
              <ErrorText error={currentState.fieldErrors?.percentBodyFat} />
            </label>
            <label className="workspace-field" htmlFor="body-water-liters">
              <span>Tổng nước cơ thể (L)</span>
              <input id="body-water-liters" name="totalBodyWaterLiters" type="number" inputMode="decimal" min={10} max={100} step="0.01" defaultValue={draftData?.metrics?.total_body_water_liters} />
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
