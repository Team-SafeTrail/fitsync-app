"use client";

import { useId, useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

type PasswordInputProps = {
  label: string;
  name?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
};

/** Accessible password input with an inline visibility toggle matching FitSync auth surfaces. */
export default function PasswordInput({
  label,
  name = "password",
  autoComplete = "current-password",
  minLength = 8,
  maxLength,
  placeholder = "Ít nhất 8 ký tự",
  required = true,
}: PasswordInputProps) {
  const inputId = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-field">
      <label htmlFor={inputId} className="auth-field-label">
        {label}
      </label>
      <div className="auth-input has-icon has-toggle">
        <LockKeyhole size={18} className="auth-input-icon" aria-hidden="true" />
        <input
          id={inputId}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          className="auth-password-toggle"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          aria-pressed={visible}
          title={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
