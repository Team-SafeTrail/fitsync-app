"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
  if (!email || !password) authRedirect("/login", "error", "Nhập email và mật khẩu để tiếp tục.");

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) authRedirect("/login", "error", "Không thể đăng nhập với thông tin này.");
  redirect("/workspace");
}

export async function signup(formData: FormData) {
  const displayName = text(formData, "displayName");
  const email = text(formData, "email").toLowerCase();
  const password = text(formData, "password");

  if (displayName.length < 2) authRedirect("/register", "error", "Tên cần có ít nhất 2 ký tự.");
  if (!email || password.length < 8) authRedirect("/register", "error", "Dùng email hợp lệ và mật khẩu từ 8 ký tự.");

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, role: "pt" },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000"}/auth/callback`,
    },
  });

  if (error) authRedirect("/register", "error", "Không thể tạo tài khoản. Kiểm tra thông tin và thử lại.");
  if (data.session) redirect("/workspace");
  authRedirect("/login", "message", "Kiểm tra email để xác nhận tài khoản, sau đó đăng nhập.");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
