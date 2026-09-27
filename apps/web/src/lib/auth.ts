import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const getCurrentUser = cache(async () => {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
});
