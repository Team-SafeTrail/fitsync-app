"use client";

import { useFormState } from "react-dom";
import { LockKeyhole } from "lucide-react";
import { acceptInvitation } from "@/features/workspace/actions";
import { initialWorkspaceActionState } from "@/features/workspace/action-state";
import SubmitButton from "./SubmitButton";

export default function InvitationAcceptForm({ rawToken, email }: { rawToken: string; email: string }) {
  const boundAction = acceptInvitation.bind(null, rawToken);
  const [state, action] = useFormState(boundAction, initialWorkspaceActionState);

  return (
    <form action={action} className="auth-form">
      {state.message && (
        <p className={`auth-alert is-${state.status === "error" ? "error" : "success"}`} role={state.status === "error" ? "alert" : "status"}>
          {state.message}
        </p>
      )}
      <label>
        <span>Email được mời</span>
        <div className="auth-input"><input value={email} readOnly aria-readonly="true" /></div>
      </label>
      <label>
        <span>Tạo mật khẩu</span>
        <div className="auth-input"><LockKeyhole size={17} /><input name="password" type="password" autoComplete="new-password" minLength={8} placeholder="Ít nhất 8 ký tự" required /></div>
        {state.fieldErrors?.password && <span className="workspace-field-error">{state.fieldErrors.password}</span>}
      </label>
      <SubmitButton idle="Chấp nhận lời mời" pending="Đang kết nối..." className="auth-submit" />
    </form>
  );
}
