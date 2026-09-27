"use client";

import { useFormState } from "react-dom";
import { updateRemainingSessions } from "@/features/workspace/actions";
import { initialWorkspaceActionState } from "@/features/workspace/action-state";
import SubmitButton from "./SubmitButton";

export default function SessionBalanceForm({
  traineeId,
  remainingSessions,
  totalSessions,
}: {
  traineeId: string;
  remainingSessions: number;
  totalSessions: number;
}) {
  const action = updateRemainingSessions.bind(null, traineeId);
  const [state, formAction] = useFormState(action, initialWorkspaceActionState);

  return (
    <form action={formAction} className="workspace-session-form">
      <label htmlFor="remaining-session-balance">
        <span>Số buổi còn lại</span>
        <span className="workspace-session-input">
          <input
            id="remaining-session-balance"
            name="remainingSessions"
            type="number"
            min={0}
            max={totalSessions}
            step={1}
            defaultValue={remainingSessions}
            required
          />
          <span>/ {totalSessions}</span>
        </span>
      </label>
      <SubmitButton idle="Cập nhật số buổi" pending="Đang cập nhật..." className="workspace-button workspace-button-secondary" />
      {state.message && <span className={`workspace-inline-status is-${state.status}`} role={state.status === "error" ? "alert" : "status"}>{state.message}</span>}
      {state.fieldErrors?.remainingSessions && <span className="workspace-field-error">{state.fieldErrors.remainingSessions}</span>}
    </form>
  );
}
