import { formatVietnamDate } from "../../lib/vietnam-date";
import {
  areCheckinNotesEquivalent,
  validateCheckinNote,
} from "./validation";

export type SavedCheckinRecord = {
  id: string;
  localCheckinDate: string;
  note: string | null;
  submittedAt: string | null;
};

export type PendingCheckinAttempt = {
  originalDate: string;
  draftNote: string;
  normalizedNote: string | null;
};

export type RpcSubmitResponse =
  | {
      kind: "ok";
      checkinId: string;
      outcome: "created" | "already_submitted";
      localCheckinDate: string;
    }
  | { kind: "session_expired" }
  | { kind: "access_denied"; code?: string; message?: string }
  | { kind: "validation_rejected"; message: string }
  | { kind: "unknown"; reason?: string };

export type ReadCheckinResponse =
  | { kind: "found"; record: SavedCheckinRecord; serverDate: string }
  | { kind: "not_found"; serverDate: string }
  | { kind: "session_expired" }
  | { kind: "unknown"; reason?: string };

export type CheckinBackend = {
  rpcSubmitDailyCheckin(rawNote: string): Promise<RpcSubmitResponse>;
  readCheckinById(checkinId: string): Promise<ReadCheckinResponse>;
  readCheckinByDate(
    traineeId: string,
    localCheckinDate: string,
  ): Promise<ReadCheckinResponse>;
};

export type CheckinSubmissionOutcome =
  | {
      status: "validation_error";
      message: string;
    }
  | {
      status: "created";
      record: SavedCheckinRecord;
      dateChangedDuringSubmit: boolean;
      message: string;
    }
  | {
      status: "already_submitted";
      record: SavedCheckinRecord;
      noteNotApplied: boolean;
      recoveredFromUnknown: boolean;
      message: string;
    }
  | {
      status: "unknown_outcome";
      attempt: PendingCheckinAttempt;
      message: string;
    }
  | {
      status: "day_rolled_over";
      originalDate: string;
      currentServerDate: string;
      draftNote: string;
      existingNewDayRecord: SavedCheckinRecord | null;
      noteNotAppliedOnNewDay: boolean;
      message: string;
    }
  | {
      status: "session_expired";
      message: string;
    }
  | {
      status: "access_denied";
      message: string;
    };

function buildAlreadySubmittedMessage(
  recordDate: string,
  noteNotApplied: boolean,
  recoveredFromUnknown: boolean,
): string {
  const formatted = formatVietnamDate(recordDate);
  if (noteNotApplied) {
    return `Bạn đã check-in ngày ${formatted}. Ghi chú mới chưa được lưu vì mỗi ngày chỉ ghi nhận một lần — đang hiển thị bản ghi đã lưu.`;
  }
  if (recoveredFromUnknown) {
    return `Check-in ngày ${formatted} đã được ghi nhận trên máy chủ.`;
  }
  return `Bạn đã gửi check-in cho ngày ${formatted}. Đang hiển thị bản ghi đã lưu.`;
}

async function resolveSavedRecordAfterRpc(
  backend: CheckinBackend,
  checkinId: string,
  localCheckinDate: string,
  fallbackNote: string | null,
): Promise<SavedCheckinRecord | null> {
  const readback = await backend.readCheckinById(checkinId);
  if (readback.kind === "found") {
    return readback.record;
  }
  if (readback.kind === "session_expired") {
    return null;
  }
  return {
    id: checkinId,
    localCheckinDate,
    note: fallbackNote,
    submittedAt: null,
  };
}

export async function submitCheckinWithContract(
  backend: CheckinBackend,
  params: {
    targetDate: string;
    draftNote: string;
  },
): Promise<CheckinSubmissionOutcome> {
  const validation = validateCheckinNote(params.draftNote);
  if (!validation.ok) {
    return {
      status: "validation_error",
      message: validation.message,
    };
  }

  const attempt: PendingCheckinAttempt = {
    originalDate: params.targetDate,
    draftNote: validation.rawNote,
    normalizedNote: validation.normalizedNote,
  };

  let rpcResult: RpcSubmitResponse;
  try {
    rpcResult = await backend.rpcSubmitDailyCheckin(validation.rawNote);
  } catch {
    return {
      status: "unknown_outcome",
      attempt,
      message: `Chưa xác nhận được kết quả gửi check-in ngày ${formatVietnamDate(params.targetDate)}. Ghi chú vẫn được giữ; hãy kiểm tra máy chủ trước khi gửi lại.`,
    };
  }

  if (rpcResult.kind === "session_expired") {
    return {
      status: "session_expired",
      message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
    };
  }

  if (rpcResult.kind === "access_denied") {
    return {
      status: "access_denied",
      message:
        "Không thể gửi check-in. Hồ sơ học viên có thể đã được lưu trữ hoặc chưa liên kết — hãy tải lại trạng thái.",
    };
  }

  if (rpcResult.kind === "validation_rejected") {
    return {
      status: "validation_error",
      message: rpcResult.message,
    };
  }

  if (rpcResult.kind === "unknown") {
    return {
      status: "unknown_outcome",
      attempt,
      message: `Chưa xác nhận được kết quả gửi check-in ngày ${formatVietnamDate(params.targetDate)}. Ghi chú vẫn được giữ; hãy kiểm tra máy chủ trước khi gửi lại.`,
    };
  }

  if (rpcResult.outcome === "created") {
    const saved = await resolveSavedRecordAfterRpc(
      backend,
      rpcResult.checkinId,
      rpcResult.localCheckinDate,
      validation.normalizedNote,
    );
    if (!saved) {
      return {
        status: "session_expired",
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
      };
    }

    const dateChanged = saved.localCheckinDate !== params.targetDate;
    const formattedDate = formatVietnamDate(saved.localCheckinDate);
    return {
      status: "created",
      record: saved,
      dateChangedDuringSubmit: dateChanged,
      message: dateChanged
        ? `Máy chủ đã ghi nhận check-in theo ngày Việt Nam mới: ${formattedDate}.`
        : `Đã lưu check-in cho ngày ${formattedDate}.`,
    };
  }

  // outcome === "already_submitted" — MUST read back existing row to verify note equality.
  const readback = await backend.readCheckinById(rpcResult.checkinId);
  if (readback.kind === "session_expired") {
    return {
      status: "session_expired",
      message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
    };
  }
  if (readback.kind !== "found") {
    return {
      status: "unknown_outcome",
      attempt,
      message: `Máy chủ báo đã có check-in ngày ${formatVietnamDate(rpcResult.localCheckinDate)} nhưng chưa đọc lại được nội dung. Hãy thử kiểm tra lại.`,
    };
  }

  const noteNotApplied = !areCheckinNotesEquivalent(
    validation.rawNote,
    readback.record.note,
  );
  return {
    status: "already_submitted",
    record: readback.record,
    noteNotApplied,
    recoveredFromUnknown: false,
    message: buildAlreadySubmittedMessage(
      readback.record.localCheckinDate,
      noteNotApplied,
      false,
    ),
  };
}

export async function reconcileUnknownOutcomeAndRetry(
  backend: CheckinBackend,
  params: {
    traineeId: string;
    previousAttempt: PendingCheckinAttempt;
    currentDraftNote: string;
  },
): Promise<CheckinSubmissionOutcome> {
  const validation = validateCheckinNote(params.currentDraftNote);
  if (!validation.ok) {
    return {
      status: "validation_error",
      message: validation.message,
    };
  }

  const updatedAttempt: PendingCheckinAttempt = {
    originalDate: params.previousAttempt.originalDate,
    draftNote: validation.rawNote,
    normalizedNote: validation.normalizedNote,
  };

  // Step 1: ALWAYS read the original Vietnam day FIRST before deciding whether to retry.
  let originalDayRead: ReadCheckinResponse;
  try {
    originalDayRead = await backend.readCheckinByDate(
      params.traineeId,
      params.previousAttempt.originalDate,
    );
  } catch {
    return {
      status: "unknown_outcome",
      attempt: updatedAttempt,
      message: `Vẫn chưa kết nối được để kiểm tra bản ghi ngày ${formatVietnamDate(params.previousAttempt.originalDate)}. Ghi chú vẫn được giữ.`,
    };
  }

  if (originalDayRead.kind === "session_expired") {
    return {
      status: "session_expired",
      message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
    };
  }

  if (originalDayRead.kind === "unknown") {
    return {
      status: "unknown_outcome",
      attempt: updatedAttempt,
      message: `Chưa kiểm tra được bản ghi ngày ${formatVietnamDate(params.previousAttempt.originalDate)}. Ghi chú vẫn được giữ; chưa gửi lại để tránh trùng lặp.`,
    };
  }

  // Step 2: If the original day already has a saved check-in, stop and display it!
  if (originalDayRead.kind === "found") {
    const noteNotApplied = !areCheckinNotesEquivalent(
      validation.rawNote,
      originalDayRead.record.note,
    );
    return {
      status: "already_submitted",
      record: originalDayRead.record,
      noteNotApplied,
      recoveredFromUnknown: true,
      message: buildAlreadySubmittedMessage(
        originalDayRead.record.localCheckinDate,
        noteNotApplied,
        true,
      ),
    };
  }

  // Step 3: Original day has NO record. Check if Vietnam date rolled over!
  const currentServerDate = originalDayRead.serverDate;
  if (currentServerDate !== params.previousAttempt.originalDate) {
    // NEVER silently submit the original draft onto the new day.
    // Perform a read-only check on the new day in case the original request landed after midnight.
    let existingNewDayRecord: SavedCheckinRecord | null = null;
    try {
      const newDayRead = await backend.readCheckinByDate(
        params.traineeId,
        currentServerDate,
      );
      if (newDayRead.kind === "session_expired") {
        return {
          status: "session_expired",
          message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        };
      }
      if (newDayRead.kind === "found") {
        existingNewDayRecord = newDayRead.record;
      }
    } catch {
      existingNewDayRecord = null;
    }

    const oldFormatted = formatVietnamDate(params.previousAttempt.originalDate);
    const newFormatted = formatVietnamDate(currentServerDate);

    if (existingNewDayRecord) {
      const noteNotAppliedOnNewDay = !areCheckinNotesEquivalent(
        validation.rawNote,
        existingNewDayRecord.note,
      );
      return {
        status: "day_rolled_over",
        originalDate: params.previousAttempt.originalDate,
        currentServerDate,
        draftNote: validation.rawNote,
        existingNewDayRecord,
        noteNotAppliedOnNewDay,
        message: noteNotAppliedOnNewDay
          ? `Không có check-in ngày ${oldFormatted}. Hệ thống đã sang ngày ${newFormatted} và đã có bản ghi khác; ghi chú mới chưa được lưu.`
          : `Không có check-in ngày ${oldFormatted}. Hệ thống đã sang ngày ${newFormatted} và bản ghi cho ngày ${newFormatted} đã được lưu.`,
      };
    }

    return {
      status: "day_rolled_over",
      originalDate: params.previousAttempt.originalDate,
      currentServerDate,
      draftNote: validation.rawNote,
      existingNewDayRecord: null,
      noteNotAppliedOnNewDay: false,
      message: `Chưa có check-in nào cho ngày ${oldFormatted}. Theo giờ Việt Nam hiện đã sang ngày ${newFormatted} (chưa hỗ trợ check-in bù). Xác nhận nếu bạn muốn gửi ghi chú này cho ngày ${newFormatted}.`,
    };
  }

  // Step 4: Still the same Vietnam day and no record exists yet — safe to retry submit_daily_checkin.
  return submitCheckinWithContract(backend, {
    targetDate: params.previousAttempt.originalDate,
    draftNote: validation.rawNote,
  });
}
