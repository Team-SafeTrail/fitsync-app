import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AuthenticatedUser = {
  id: string;
  email?: string;
};

export const getCurrentUser = cache(async (): Promise<AuthenticatedUser | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const sub = claimsData?.claims?.sub;
  if (typeof sub === "string" && sub && !claimsError) {
    return {
      id: sub,
      email: typeof claimsData.claims.email === "string" ? claimsData.claims.email : undefined,
    };
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email };
});
