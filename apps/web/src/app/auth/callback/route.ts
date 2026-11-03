import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeRedirectPath } from "@/lib/redirect";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const origin = url.origin;

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Role-based routing: Admin routes to Admin Portal
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile?.role === "admin") {
        return NextResponse.redirect(`${origin}/admin`);
      }

      const safeTarget = sanitizeRedirectPath(next, "/workspace");
      return NextResponse.redirect(`${origin}${safeTarget}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Liên kết xác nhận không hợp lệ hoặc đã hết hạn.")}`,
  );
}
