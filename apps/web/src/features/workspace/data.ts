import "server-only";
import { cache } from "react";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type Profile = Pick<Tables<"profiles">, "id" | "display_name" | "role" | "phone">;
export type Trainee = Tables<"trainee_profiles">;
export type InBodyRecord = Tables<"inbody_records">;
export type InvitationSummary = Pick<
  Tables<"trainee_invitations">,
  "trainee_id" | "status" | "expires_at"
>;

export const getWorkspaceViewer = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, display_name, role, phone")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) return null;
  return { user, profile };
});

export async function getPtRoster() {
  const supabase = createClient();
  const [traineesResult, invitationsResult, recordsResult] = await Promise.all([
    supabase
      .from("trainee_profiles")
      .select("*")
      .neq("status", "archived")
      .order("created_at", { ascending: false }),
    supabase
      .from("trainee_invitations")
      .select("trainee_id, status, expires_at")
      .order("created_at", { ascending: false }),
    supabase.from("inbody_records").select("trainee_id"),
  ]);

  if (traineesResult.error) throw new Error("Không thể tải danh sách học viên.");
  if (invitationsResult.error) throw new Error("Không thể tải trạng thái lời mời.");
  if (recordsResult.error) throw new Error("Không thể tải trạng thái InBody.");

  const invitationByTrainee = new Map<string, InvitationSummary>();
  for (const invitation of invitationsResult.data) {
    if (invitation.trainee_id && !invitationByTrainee.has(invitation.trainee_id)) {
      invitationByTrainee.set(invitation.trainee_id, invitation);
    }
  }

  const verifiedRecordCountByTrainee = new Map<string, number>();
  for (const record of recordsResult.data) {
    verifiedRecordCountByTrainee.set(
      record.trainee_id,
      (verifiedRecordCountByTrainee.get(record.trainee_id) ?? 0) + 1,
    );
  }

  return { trainees: traineesResult.data, invitationByTrainee, verifiedRecordCountByTrainee };
}

export async function getPtTrainee(traineeId: string) {
  const supabase = createClient();
  const [traineeResult, recordsResult] = await Promise.all([
    supabase.from("trainee_profiles").select("*").eq("id", traineeId).maybeSingle(),
    supabase
      .from("inbody_records")
      .select("*")
      .eq("trainee_id", traineeId)
      .order("recorded_at", { ascending: false }),
  ]);

  if (traineeResult.error || recordsResult.error) {
    throw new Error("Không thể tải hồ sơ học viên.");
  }

  return { trainee: traineeResult.data, records: recordsResult.data };
}

export async function getTraineeHome(profileId: string) {
  const supabase = createClient();
  const { data: trainee, error: traineeError } = await supabase
    .from("trainee_profiles")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (traineeError) throw new Error("Không thể tải hồ sơ của bạn.");
  if (!trainee) return { trainee: null, records: [] as InBodyRecord[] };

  const { data: records, error: recordsError } = await supabase
    .from("inbody_records")
    .select("*")
    .eq("trainee_id", trainee.id)
    .order("recorded_at", { ascending: false });

  if (recordsError) throw new Error("Không thể tải kết quả InBody.");
  return { trainee, records };
}
