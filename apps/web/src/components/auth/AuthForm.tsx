"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { ArrowRight, AtSign, Eye, EyeOff, Loader2, LockKeyhole, UserRound } from "lucide-react";

function SubmitButton({ registering }: { registering: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button className="auth-submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 size={17} className="animate-spin" />
          <span>{registering ? "Đang tạo tài khoản..." : "Đang đăng nhập..."}</span>
        </>
      ) : (
        <>
          <span>{registering ? "Tạo workspace PT" : "Vào workspace"}</span>
          <ArrowRight size={17} />
        </>
      )}
    </button>
  );
}

export default function AuthForm({ mode, action, error, message }: {
  mode: "login" | "register";
  action: (formData: FormData) => Promise<void>;
  error?: string;
  message?: string;
}) {
  const registering = mode === "register";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {error && <p role="alert" className="auth-alert is-error">{error}</p>}
      {message && <p role="status" className="auth-alert is-success">{message}</p>}
      <form action={action} className="auth-form">
        {registering && (
          <label>
            <span>Tên hiển thị</span>
            <div className="auth-input">
              <UserRound size={17} />
              <input
                name="displayName"
                autoComplete="name"
                minLength={2}
                maxLength={100}
                placeholder="Nguyễn Hoàng Nam"
                required
              />
            </div>
          </label>
        )}
        <label>
          <span>Email</span>
          <div className="auth-input">
            <AtSign size={17} />
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="coach@fitsync.vn"
              required
            />
          </div>
        </label>
        <label>
          <span>Mật khẩu</span>
          <div className="auth-input">
            <LockKeyhole size={17} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={registering ? "new-password" : "current-password"}
              minLength={8}
              placeholder="Ít nhất 8 ký tự"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="auth-password-toggle"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        <SubmitButton registering={registering} />
      </form>
      <div className="auth-switch">
        <span>{registering ? "Đã có workspace?" : "Lần đầu dùng FitSync?"}</span>
        <Link href={registering ? "/login" : "/register"}>
          {registering ? "Đăng nhập" : "Tạo tài khoản PT"} <ArrowRight size={14} />
        </Link>
      </div>
    </>
  );
}

