"use client";

import { useActionState } from "react";
import { AtSign } from "lucide-react";
import { acceptInvitation } from "@/features/workspace/actions";
import { initialWorkspaceActionState } from "@/features/workspace/action-state";
import PasswordInput from "../auth/PasswordInput";
import SubmitButton from "./SubmitButton";

export default function InvitationAcceptForm({ rawToken, email }: { rawToken: string; email: string }) {
  const boundAction = acceptInvitation.bind(null, rawToken);
  const [state, action] = useActionState(boundAction, initialWorkspaceActionState);

  return (
    <form action={action} className="auth-form">
      {state.message && (
        <p className={`auth-alert is-${state.status === "error" ? "error" : "success"}`} role={state.status === "error" ? "alert" : "status"}>
          {state.message}
        </p>
      )}
      <label>
        <span>Email được mời</span>
        <div className="auth-input has-icon">
          <AtSign size={18} className="auth-input-icon" aria-hidden="true" />
          <input value={email} readOnly aria-readonly="true" />
        </div>
      </label>
      <div className="auth-field">
        <PasswordInput
          label="Tạo mật khẩu"
          name="password"
          autoComplete="new-password"
          minLength={8}
          placeholder="Ít nhất 8 ký tự"
          required
        />
        {state.fieldErrors?.password && <span className="workspace-field-error">{state.fieldErrors.password}</span>}
      </div>
      <SubmitButton idle="Chấp nhận lời mời" pending="Đang kết nối..." className="auth-submit" />
    </form>
  );
}
