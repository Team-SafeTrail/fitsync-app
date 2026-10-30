import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getWorkspaceViewer } from "@/features/workspace/data";
import { isChatId } from "./validation";

export async function getChatContext(traineeId: string) {
  const viewer = await getWorkspaceViewer();
  if (!viewer || !isChatId(traineeId) || !["pt", "trainee"].includes(viewer.profile.role)) return null;
  const supabase = createClient();
  const { data: trainee, error } = await supabase.from("trainee_profiles")
    .select("id, display_name, assigned_pt_id, profile_id, status").eq("id", traineeId).maybeSingle();
  if (error || !trainee || !trainee.profile_id || trainee.status === "archived") return null;
  const actorMatches = viewer.profile.role === "pt" ? trainee.assigned_pt_id === viewer.user.id : trainee.profile_id === viewer.user.id;
  if (!actorMatches) return null;
  return { supabase, viewer, trainee };
}
