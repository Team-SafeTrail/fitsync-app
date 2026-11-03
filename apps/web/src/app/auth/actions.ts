"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sanitizeRedirectPath } from "@/lib/redirect";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function authRedirect(path: string, type: "error" | "message", value: string): never {
  redirect(`${path}?${type}=${encodeURIComponent(value)}`);
}

export async function login(formData: FormData) {
  const email = text(formData, "email").toLowerCase();
  const password = text(formData, "password");
  const next = text(formData, "next");
  if (!email || !password) authRedirect("/login", "error", "Nhập email và mật khẩu để tiếp tục.");

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) authRedirect("/login", "error", "Không thể đăng nhập với thông tin này.");

  // If user role is admin, route directly to Admin Portal
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  const safeTarget = sanitizeRedirectPath(next, "/workspace");
  redirect(safeTarget);
}

export async function signup(formData: FormData) {
  const displayName = text(formData, "displayName");
  const email = text(formData, "email").toLowerCase();
  const password = text(formData, "password");

  if (displayName.length < 2) authRedirect("/register", "error", "Tên cần có ít nhất 2 ký tự.");
  if (!email || password.length < 8) authRedirect("/register", "error", "Dùng email hợp lệ và mật khẩu từ 8 ký tự.");

  const supabase = createClient();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, role: "pt" },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) authRedirect("/register", "error", "Không thể tạo tài khoản. Kiểm tra thông tin và thử lại.");
  if (data.session) redirect("/workspace");
  authRedirect("/login", "message", "Kiểm tra email để xác nhận tài khoản, sau đó đăng nhập.");
}

export async function requestPasswordReset(formData: FormData) {
  const email = text(formData, "email").toLowerCase();
  if (!email) authRedirect("/forgot-password", "error", "Nhập email để nhận liên kết đặt lại mật khẩu.");

  const supabase = createClient();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/update-password`,
  });

  if (error) {
    authRedirect("/forgot-password", "error", "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.");
  }

  authRedirect("/login", "message", "Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi.");
}

export async function updatePassword(formData: FormData) {
  const password = text(formData, "password");
  const confirmPassword = text(formData, "confirmPassword");

  if (password.length < 8) {
    authRedirect("/update-password", "error", "Mật khẩu mới phải có ít nhất 8 ký tự.");
  }
  if (password !== confirmPassword) {
    authRedirect("/update-password", "error", "Mật khẩu xác nhận không khớp.");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    authRedirect("/update-password", "error", "Không thể cập nhật mật khẩu. Vui lòng thử lại.");
  }

  authRedirect("/workspace", "message", "Đã cập nhật mật khẩu thành công.");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
