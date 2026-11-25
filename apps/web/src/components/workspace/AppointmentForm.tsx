"use client";
import {useEffect,useState} from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {createAppointment} from "@/features/scheduling/actions";
import {initialAppointmentState,type AppointmentState} from "@/features/scheduling/action-state";
import SubmitButton from "./SubmitButton";
import {usePreservedForm} from "./PreservedForm";

type Choice = { id: string; display_name: string };

type AppointmentFormProps = {
  trainees: Choice[];
  selected?: string;
  confirmedSaved?: boolean;
  formAriaLabel?: string;
  idPrefix?: string;
  defaultStart?: string;
  defaultEnd?: string;
  onCancel?: () => void;
};

export default function AppointmentForm({
  trainees,
  selected,
  confirmedSaved = false,
  formAriaLabel = "Xếp cuộc hẹn",
  idPrefix = "",
  defaultStart,
  defaultEnd,
  onCancel,
}: AppointmentFormProps) {
  const { ref, onReset } = usePreservedForm();
  const [state, action, pending] = useActionState(async (previous: AppointmentState, form: FormData): Promise<AppointmentState> => {
    try {
      const result = await createAppointment(previous, form);
      if (result.status === "success" && result.nonce && result.nonce === form.get("clientRequestId") && result.week) {
        window.location.assign(`/workspace/calendar?${new URLSearchParams({ week: result.week, saved: result.nonce })}`);
      }
      return result;
    } catch {
      return { status: "error", notice: "Kết nối bị gián đoạn. Thông tin vẫn ở đây; thử lại để xác nhận cuộc hẹn." };
    }
  }, initialAppointmentState);
  const [nonce, setNonce] = useState("");
  useEffect(() => setNonce(crypto.randomUUID()), []);

  return (
    <form ref={ref} onReset={onReset} action={action} className="appointment-form" aria-label={formAriaLabel}>
      <Fields
        trainees={trainees}
        selected={selected}
        nonce={nonce}
        state={state.status === "idle" && confirmedSaved ? { status: "success", notice: "Đã thêm cuộc hẹn. Không trừ buổi PT." } : state}
        disabled={pending}
        renewNonce={() => setNonce(crypto.randomUUID())}
        idPrefix={idPrefix}
        defaultStart={defaultStart}
        defaultEnd={defaultEnd}
        onCancel={onCancel}
      />
    </form>
  );
}

function Fields({
  trainees,
  selected,
  nonce,
  state,
  renewNonce,
  disabled,
  idPrefix = "",
  defaultStart,
  defaultEnd,
  onCancel,
}: {
  trainees: Choice[];
  selected?: string;
  nonce: string;
  state: AppointmentState;
  renewNonce: () => void;
  disabled: boolean;
  idPrefix?: string;
  defaultStart?: string;
  defaultEnd?: string;
  onCancel?: () => void;
}) {
  const { pending } = useFormStatus();
  const prefix = idPrefix ? `${idPrefix}-` : "";
  const traineeInputId = `${prefix}appointment-trainee`;
  const titleInputId = `${prefix}appointment-title`;
  const kindInputId = `${prefix}appointment-kind`;
  const timezoneId = `${prefix}appointment-timezone`;
  const startInputId = `${prefix}appointment-start`;
  const endInputId = `${prefix}appointment-end`;

  return (
    <fieldset disabled={pending || !nonce || disabled}>
      <input type="hidden" name="clientRequestId" value={nonce} />
      <label htmlFor={traineeInputId}>Học viên</label>
      <select
        id={traineeInputId}
        name="traineeId"
        required
        defaultValue={trainees.some((item) => item.id === selected) ? selected : trainees.length === 1 ? trainees[0].id : ""}
      >
        <option value="" disabled>Chọn học viên đã kết nối</option>
        {trainees.map((item) => (
          <option key={item.id} value={item.id}>{item.display_name}</option>
        ))}
      </select>
      <label htmlFor={titleInputId}>Tên cuộc hẹn</label>
      <input id={titleInputId} name="title" required maxLength={100} defaultValue="Buổi tập" />
      <label htmlFor={kindInputId}>Loại cuộc hẹn</label>
      <select id={kindInputId} name="kind" defaultValue="training">
        <option value="training">Buổi tập</option>
        <option value="consultation">Tư vấn</option>
      </select>
      <p id={timezoneId} className="appointment-timezone-note">Giờ Việt Nam (UTC+7). Không bắt buộc giáo án. Mỗi cuộc hẹn tối đa 24 giờ.</p>
      <label htmlFor={startInputId}>Bắt đầu</label>
      <input id={startInputId} name="startLocal" type="datetime-local" required defaultValue={defaultStart} aria-describedby={timezoneId} />
      <label htmlFor={endInputId}>Kết thúc</label>
      <input id={endInputId} name="endLocal" type="datetime-local" required defaultValue={defaultEnd} aria-describedby={timezoneId} />
      {state.notice && <p role={state.status === "error" ? "alert" : "status"}>{state.notice}</p>}
      {state.conflict && (
        <button type="button" className="workspace-inline-link" onClick={renewNonce}>Bắt đầu lượt đặt mới</button>
      )}
      {onCancel ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", marginTop: "18px" }}>
          <button
            type="button"
            className="workspace-inline-link"
            style={{ padding: "8px 18px", borderRadius: "999px", background: "#f3f5f4", color: "#143e38", border: "1px solid var(--color-border-default)", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}
            onClick={onCancel}
          >
            Hủy
          </button>
          <SubmitButton idle="Thêm cuộc hẹn" pending="Đang lưu cuộc hẹn…" />
        </div>
      ) : (
        <SubmitButton idle="Thêm cuộc hẹn" pending="Đang lưu cuộc hẹn…" />
      )}
    </fieldset>
  );
}
