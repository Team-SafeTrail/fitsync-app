import type { AuthError, PostgrestError } from "@supabase/supabase-js";

import {
  getLastObservedServerVietnamDate,
  type FitSyncSupabaseClient,
} from "../../lib/supabase";
import type {
  CheckinRow,
  ProfileRow,
  TraineeProfileRow,
} from "../../types/database";
import type {
  CheckinBackend,
  ReadCheckinResponse,
  RpcSubmitResponse,
  SavedCheckinRecord,
} from "../checkin/submission";

export type TraineeTodayState =
  | {
      kind: "active";
      profile: Pick<ProfileRow, "id" | "display_name" | "role">;
      trainee: TraineeProfileRow;
      coachName: string | null;
      checkins: SavedCheckinRecord[];
      todayVietnamDate: string;
      todayCheckin: SavedCheckinRecord | null;
    }
  | {
      kind: "non_trainee";
      role: ProfileRow["role"];
      displayName: string;
    }
  | {
      kind: "unlinked";
      displayName: string;
    }
  | {
      kind: "archived";
      displayName: string;
      traineeDisplayName: string;
    }
  | {
      kind: "session_expired";
    };

type ErrorLike = {
  code?: string | null;
  status?: number;
  message?: string | null;
};

export function isSessionExpiredError(error: ErrorLike | null | undefined): boolean {
  if (!error) return false;
  if (error.status === 401) return true;
  const code = (error.code ?? "").toUpperCase();
  if (code === "PGRST301" || code === "PGRST302" || code === "PGRST303") {
    return true;
  }
  const msg = (error.message ?? "").toLowerCase();
  return (
    msg.includes("jwt expired") ||
    msg.includes("invalid jwt") ||
    msg.includes("refresh_token_not_found") ||
    msg.includes("invalid refresh token") ||
    msg.includes("session_not_found") ||
    msg.includes("auth session missing")
  );
}

export function mapSignInErrorMessage(error: AuthError | ErrorLike): string {
  const msg = (error.message ?? "").toLowerCase();
  if (
    msg.includes("invalid login credentials") ||
    msg.includes("invalid_credentials")
  ) {
    return "Email hoặc mật khẩu chưa đúng. Kiểm tra lại thông tin tài khoản học viên.";
  }
  if (msg.includes("email not confirmed")) {
    return "Email chưa được xác nhận. Kiểm tra hộp thư trước khi đăng nhập.";
  }
  if (msg.includes("too many requests") || error.status === 429) {
    return "Quá nhiều lần thử đăng nhập. Chờ một lát rồi thử lại.";
  }
  if (
    msg.includes("network request failed") ||
    msg.includes("failed to fetch") ||
    msg.includes("abort")
  ) {
    return "Không kết nối được tới Supabase local (127.0.0.1:54321). Kiểm tra Docker/Supabase và lệnh adb reverse tcp:54321 tcp:54321.";
  }
  return "Không thể đăng nhập lúc này. Kiểm tra kết nối và thử lại.";
}

function toSavedCheckinRecord(row: CheckinRow): SavedCheckinRecord {
  return {
    id: row.id,
    localCheckinDate: row.local_checkin_date,
    note: row.note,
    submittedAt: row.submitted_at,
  };
}

export async function loadTraineeToday(
  client: FitSyncSupabaseClient,
): Promise<TraineeTodayState> {
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();

  if (userError) {
    if (isSessionExpiredError(userError)) {
      return { kind: "session_expired" };
    }
    throw new Error("Không thể xác thực phiên hiện tại. Kiểm tra kết nối tới máy chủ local.");
  }

  if (!user) {
    return { kind: "session_expired" };
  }

  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    if (isSessionExpiredError(profileError)) {
      return { kind: "session_expired" };
    }
    throw new Error("Không thể tải thông tin tài khoản.");
  }

  if (!profile) {
    return { kind: "session_expired" };
  }

  if (profile.role !== "trainee") {
    return {
      kind: "non_trainee",
      role: profile.role,
      displayName: profile.display_name,
    };
  }

  const { data: trainee, error: traineeError } = await client
    .from("trainee_profiles")
    .select("*")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (traineeError) {
    if (isSessionExpiredError(traineeError)) {
      return { kind: "session_expired" };
    }
    throw new Error("Không thể tải hồ sơ học viên.");
  }

  if (!trainee) {
    return {
      kind: "unlinked",
      displayName: profile.display_name,
    };
  }

  if (trainee.status === "archived") {
    return {
      kind: "archived",
      displayName: profile.display_name,
      traineeDisplayName: trainee.display_name,
    };
  }

  const [checkinsResult, coachResult] = await Promise.all([
    client
      .from("checkins")
      .select("*")
      .eq("trainee_id", trainee.id)
      .order("local_checkin_date", { ascending: false })
      .limit(14),
    client.rpc("get_assigned_coach_identity"),
  ]);

  if (checkinsResult.error) {
    if (isSessionExpiredError(checkinsResult.error)) {
      return { kind: "session_expired" };
    }
    throw new Error("Không thể tải lịch sử check-in.");
  }

  if (coachResult.error && isSessionExpiredError(coachResult.error)) {
    return { kind: "session_expired" };
  }

  const checkins = (checkinsResult.data ?? []).map(toSavedCheckinRecord);
  const observedVietnamDate = getLastObservedServerVietnamDate();
  const latestSavedDate = checkins[0]?.localCheckinDate;
  const todayVietnamDate =
    latestSavedDate && latestSavedDate > observedVietnamDate
      ? latestSavedDate
      : observedVietnamDate;
  const todayCheckin =
    checkins.find((item) => item.localCheckinDate === todayVietnamDate) ?? null;
  const coachName = coachResult.data?.[0]?.display_name ?? null;

  return {
    kind: "active",
    profile,
    trainee,
    coachName,
    checkins,
    todayVietnamDate,
    todayCheckin,
  };
}

function classifyPostgrestSubmitError(error: PostgrestError): RpcSubmitResponse {
  if (isSessionExpiredError(error)) {
    return { kind: "session_expired" };
  }
  if (error.code === "42501") {
    return {
      kind: "access_denied",
      code: error.code,
      message: error.message,
    };
  }
  if (error.code === "22023") {
    return {
      kind: "validation_rejected",
      message: "Ghi chú vượt quá giới hạn 500 ký tự cho phép trên máy chủ.",
    };
  }
  return {
    kind: "unknown",
    reason: error.code ?? error.message,
  };
}

export function createSupabaseCheckinBackend(
  client: FitSyncSupabaseClient,
): CheckinBackend {
  return {
    async rpcSubmitDailyCheckin(rawNote: string): Promise<RpcSubmitResponse> {
      const { data, error } = await client.rpc("submit_daily_checkin", {
        checkin_note: rawNote,
      });

      if (error) {
        return classifyPostgrestSubmitError(error);
      }

      const row = data?.[0];
      if (
        !row ||
        (row.outcome !== "created" && row.outcome !== "already_submitted") ||
        !row.checkin_id ||
        !row.local_checkin_date
      ) {
        return { kind: "unknown", reason: "unexpected_rpc_shape" };
      }

      return {
        kind: "ok",
        checkinId: row.checkin_id,
        outcome: row.outcome,
        localCheckinDate: row.local_checkin_date,
      };
    },

    async readCheckinById(checkinId: string): Promise<ReadCheckinResponse> {
      const { data, error } = await client
        .from("checkins")
        .select("*")
        .eq("id", checkinId)
        .maybeSingle();

      if (error) {
        if (isSessionExpiredError(error)) {
          return { kind: "session_expired" };
        }
        return { kind: "unknown", reason: error.code ?? error.message };
      }

      const serverDate = getLastObservedServerVietnamDate();
      if (!data) {
        return { kind: "not_found", serverDate };
      }

      return {
        kind: "found",
        record: toSavedCheckinRecord(data),
        serverDate,
      };
    },

    async readCheckinByDate(
      traineeId: string,
      localCheckinDate: string,
    ): Promise<ReadCheckinResponse> {
      const { data, error } = await client
        .from("checkins")
        .select("*")
        .eq("trainee_id", traineeId)
        .eq("local_checkin_date", localCheckinDate)
        .maybeSingle();

      if (error) {
        if (isSessionExpiredError(error)) {
          return { kind: "session_expired" };
        }
        return { kind: "unknown", reason: error.code ?? error.message };
      }

      const serverDate = getLastObservedServerVietnamDate();
      if (!data) {
        return { kind: "not_found", serverDate };
      }

      return {
        kind: "found",
        record: toSavedCheckinRecord(data),
        serverDate,
      };
    },
  };
}
