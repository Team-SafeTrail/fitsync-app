import "server-only";
import { cache } from "react";
import { isCheckinWarningDue, warningStartsOn } from "@/features/engagement/calendar";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type Profile = Pick<Tables<"profiles">, "id" | "display_name" | "role" | "phone">;
export type Trainee = Tables<"trainee_profiles">;
export type InBodyRecord = Tables<"inbody_records">;
export type Checkin = Tables<"checkins">;
export type MealLog = Tables<"meal_logs">;
export type CheckinActivity = Checkin & {
  meal: (MealLog & { signedUrl: string }) | null;
};
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

  const warningByTrainee = new Map<string, { referenceDate: string; warningSince: string }>();
  for (const trainee of traineesResult.data) {
    const referenceDate = trainee.last_checkin_date ?? trainee.engagement_started_on;
    if (trainee.profile_id && referenceDate && isCheckinWarningDue(referenceDate)) {
      warningByTrainee.set(trainee.id, {
        referenceDate,
        warningSince: warningStartsOn(referenceDate),
      });
    }
  }

  return {
    trainees: traineesResult.data,
    invitationByTrainee,
    verifiedRecordCountByTrainee,
    warningByTrainee,
  };
}

async function withSignedMealMedia(checkins: Checkin[], mealLogs: MealLog[]) {
  if (mealLogs.length === 0) return checkins.map((checkin) => ({ ...checkin, meal: null }));

  const supabase = createClient();
  const paths = mealLogs.map((meal) => meal.private_photo_path);
  const { data: signedFiles, error } = await supabase.storage
    .from("meal-media")
    .createSignedUrls(paths, 60);
  if (error) throw new Error("Không thể mở ảnh bữa ăn riêng tư.");

  const signedUrlByPath = new Map(
    signedFiles.map((file) => [file.path, file.signedUrl]),
  );
  const mealByCheckin = new Map(
    mealLogs.flatMap((meal) => {
      const signedUrl = signedUrlByPath.get(meal.private_photo_path);
      return signedUrl ? [[meal.checkin_id, { ...meal, signedUrl }] as const] : [];
    }),
  );

  return checkins.map((checkin) => ({
    ...checkin,
    meal: mealByCheckin.get(checkin.id) ?? null,
  }));
}

export async function getPtTrainee(traineeId: string) {
  const supabase = createClient();
  const [traineeResult, recordsResult, checkinsResult, mealLogsResult] = await Promise.all([
    supabase.from("trainee_profiles").select("*").eq("id", traineeId).maybeSingle(),
    supabase
      .from("inbody_records")
      .select("*")
      .eq("trainee_id", traineeId)
      .order("recorded_at", { ascending: false }),
    supabase
      .from("checkins")
      .select("*")
      .eq("trainee_id", traineeId)
      .order("local_checkin_date", { ascending: false }),
    supabase
      .from("meal_logs")
      .select("*")
      .eq("trainee_id", traineeId)
      .order("created_at", { ascending: false }),
  ]);

  if (traineeResult.error || recordsResult.error || checkinsResult.error || mealLogsResult.error) {
    throw new Error("Không thể tải hồ sơ học viên.");
  }

  const checkins = await withSignedMealMedia(checkinsResult.data, mealLogsResult.data);
  return { trainee: traineeResult.data, records: recordsResult.data, checkins };
}

export async function getTraineeHome(profileId: string) {
  const supabase = createClient();
  const { data: trainee, error: traineeError } = await supabase
    .from("trainee_profiles")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (traineeError) throw new Error("Không thể tải hồ sơ của bạn.");
  if (!trainee) return { trainee: null, records: [] as InBodyRecord[], checkins: [] as CheckinActivity[] };

  const [recordsResult, checkinsResult, mealLogsResult] = await Promise.all([
    supabase
      .from("inbody_records")
      .select("*")
      .eq("trainee_id", trainee.id)
      .order("recorded_at", { ascending: false }),
    supabase
      .from("checkins")
      .select("*")
      .eq("trainee_id", trainee.id)
      .order("local_checkin_date", { ascending: false }),
    supabase
      .from("meal_logs")
      .select("*")
      .eq("trainee_id", trainee.id)
      .order("created_at", { ascending: false }),
  ]);

  if (recordsResult.error || checkinsResult.error || mealLogsResult.error) {
    throw new Error("Không thể tải hoạt động của bạn.");
  }
  const checkins = await withSignedMealMedia(checkinsResult.data, mealLogsResult.data);
  return { trainee, records: recordsResult.data, checkins };
}
