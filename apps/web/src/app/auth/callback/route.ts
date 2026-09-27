import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const origin = url.origin;

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/workspace`);
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Liên kết xác nhận không hợp lệ hoặc đã hết hạn.")}`,
  );
}
