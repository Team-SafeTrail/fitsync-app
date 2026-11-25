import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { getSupabaseEnv, isSupabaseConfigured } from "./env";

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.next({ request });

  const pathname = request.nextUrl.pathname;
  const isProtected = pathname.startsWith("/workspace") || pathname.startsWith("/admin");

  let response = NextResponse.next({ request });

  // For public pages, skip remote auth roundtrip in middleware for instant navigation
  if (!isProtected) {
    return response;
  }

  const { url, publishableKey } = getSupabaseEnv();
  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  let authenticated = Boolean(claimsData?.claims?.sub) && !claimsError;

  // Fall back to GoTrue only when JWT claims are missing/expired so refresh_token rotation still runs.
  if (!authenticated) {
    const { data: { user } } = await supabase.auth.getUser();
    authenticated = Boolean(user);
  }

  if (!authenticated) {
    const target = request.nextUrl.clone();
    target.pathname = "/login"; target.search = "";
    target.searchParams.set("next", pathname + request.nextUrl.search);
    const login = NextResponse.redirect(target);
    response.cookies.getAll().forEach(cookie => login.cookies.set(cookie));
    return login;
  }
  return response;
}
