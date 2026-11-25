import { describe, expect, it, vi } from "vitest";

import {
  reconcileUnknownOutcomeAndRetry,
  submitCheckinWithContract,
  type CheckinBackend,
  type SavedCheckinRecord,
} from "./submission";

function createMockBackend(overrides: Partial<CheckinBackend> = {}): CheckinBackend {
  return {
    rpcSubmitDailyCheckin: vi.fn(),
    readCheckinById: vi.fn(),
    readCheckinByDate: vi.fn(),
    ...overrides,
  };
}

describe("check-in submission and retry state machine", () => {
  const savedRow: SavedCheckinRecord = {
    id: "chk-1",
    localCheckinDate: "2026-11-25",
    note: "Hoàn thành buổi chân",
    submittedAt: "2026-11-25T10:15:00.000Z",
  };

  it("returns created with server-confirmed date and readback record", async () => {
    const backend = createMockBackend({
      rpcSubmitDailyCheckin: vi.fn().mockResolvedValue({
        kind: "ok",
        checkinId: "chk-1",
        outcome: "created",
        localCheckinDate: "2026-11-25",
      }),
      readCheckinById: vi.fn().mockResolvedValue({
        kind: "found",
        record: savedRow,
        serverDate: "2026-11-25",
      }),
    });

    const outcome = await submitCheckinWithContract(backend, {
      targetDate: "2026-11-25",
      draftNote: "  Hoàn thành buổi chân  ",
    });

    expect(outcome.status).toBe("created");
    if (outcome.status === "created") {
      expect(outcome.record).toEqual(savedRow);
      expect(outcome.dateChangedDuringSubmit).toBe(false);
    }
    expect(backend.rpcSubmitDailyCheckin).toHaveBeenCalledWith("  Hoàn thành buổi chân  ");
  });

  it("flags when server Vietnam date crossed midnight during live submission", async () => {
    const rolledRecord: SavedCheckinRecord = {
      id: "chk-2",
      localCheckinDate: "2026-11-26",
      note: "Tập tối muộn",
      submittedAt: "2026-11-25T17:00:02.000Z",
    };
    const backend = createMockBackend({
      rpcSubmitDailyCheckin: vi.fn().mockResolvedValue({
        kind: "ok",
        checkinId: "chk-2",
        outcome: "created",
        localCheckinDate: "2026-11-26",
      }),
      readCheckinById: vi.fn().mockResolvedValue({
        kind: "found",
        record: rolledRecord,
        serverDate: "2026-11-26",
      }),
    });

    const outcome = await submitCheckinWithContract(backend, {
      targetDate: "2026-11-25",
      draftNote: "Tập tối muộn",
    });

    expect(outcome.status).toBe("created");
    if (outcome.status === "created") {
      expect(outcome.dateChangedDuringSubmit).toBe(true);
      expect(outcome.record.localCheckinDate).toBe("2026-11-26");
    }
  });

  it("reads back existing row on already_submitted and warns when revised note was not applied", async () => {
    const backend = createMockBackend({
      rpcSubmitDailyCheckin: vi.fn().mockResolvedValue({
        kind: "ok",
        checkinId: "chk-1",
        outcome: "already_submitted",
        localCheckinDate: "2026-11-25",
      }),
      readCheckinById: vi.fn().mockResolvedValue({
        kind: "found",
        record: savedRow,
        serverDate: "2026-11-25",
      }),
    });

    const outcome = await submitCheckinWithContract(backend, {
      targetDate: "2026-11-25",
      draftNote: "Ghi chú sửa lại sau",
    });

    expect(outcome.status).toBe("already_submitted");
    if (outcome.status === "already_submitted") {
      expect(outcome.record).toEqual(savedRow);
      expect(outcome.noteNotApplied).toBe(true);
      expect(outcome.recoveredFromUnknown).toBe(false);
    }
  });

  it("treats already_submitted with ASCII-space-equivalent note as matching", async () => {
    const backend = createMockBackend({
      rpcSubmitDailyCheckin: vi.fn().mockResolvedValue({
        kind: "ok",
        checkinId: "chk-1",
        outcome: "already_submitted",
        localCheckinDate: "2026-11-25",
      }),
      readCheckinById: vi.fn().mockResolvedValue({
        kind: "found",
        record: savedRow,
        serverDate: "2026-11-25",
      }),
    });

    const outcome = await submitCheckinWithContract(backend, {
      targetDate: "2026-11-25",
      draftNote: "   Hoàn thành buổi chân   ",
    });

    expect(outcome.status).toBe("already_submitted");
    if (outcome.status === "already_submitted") {
      expect(outcome.noteNotApplied).toBe(false);
    }
  });

  it("preserves draft and original date on unknown outcome (network failure)", async () => {
    const backend = createMockBackend({
      rpcSubmitDailyCheckin: vi.fn().mockRejectedValue(new Error("Network timeout")),
    });

    const outcome = await submitCheckinWithContract(backend, {
      targetDate: "2026-11-25",
      draftNote: "Đang mất mạng",
    });

    expect(outcome.status).toBe("unknown_outcome");
    if (outcome.status === "unknown_outcome") {
      expect(outcome.attempt.originalDate).toBe("2026-11-25");
      expect(outcome.attempt.draftNote).toBe("Đang mất mạng");
      expect(outcome.attempt.normalizedNote).toBe("Đang mất mạng");
    }
  });

  it("on retry after unknown outcome, reads original day FIRST and stops without duplicate RPC when already saved", async () => {
    const backend = createMockBackend({
      readCheckinByDate: vi.fn().mockResolvedValue({
        kind: "found",
        record: savedRow,
        serverDate: "2026-11-25",
      }),
    });

    const outcome = await reconcileUnknownOutcomeAndRetry(backend, {
      traineeId: "trainee-1",
      previousAttempt: {
        originalDate: "2026-11-25",
        draftNote: "Hoàn thành buổi chân",
        normalizedNote: "Hoàn thành buổi chân",
      },
      currentDraftNote: "Hoàn thành buổi chân",
    });

    expect(backend.readCheckinByDate).toHaveBeenCalledWith("trainee-1", "2026-11-25");
    expect(backend.rpcSubmitDailyCheckin).not.toHaveBeenCalled();
    expect(outcome.status).toBe("already_submitted");
    if (outcome.status === "already_submitted") {
      expect(outcome.recoveredFromUnknown).toBe(true);
      expect(outcome.noteNotApplied).toBe(false);
      expect(outcome.record).toEqual(savedRow);
    }
  });

  it("on retry after unknown outcome, warns if trainee edited draft while original day was already saved", async () => {
    const backend = createMockBackend({
      readCheckinByDate: vi.fn().mockResolvedValue({
        kind: "found",
        record: savedRow,
        serverDate: "2026-11-26",
      }),
    });

    const outcome = await reconcileUnknownOutcomeAndRetry(backend, {
      traineeId: "trainee-1",
      previousAttempt: {
        originalDate: "2026-11-25",
        draftNote: "Hoàn thành buổi chân",
        normalizedNote: "Hoàn thành buổi chân",
      },
      currentDraftNote: "Hoàn thành buổi chân + thêm cardio",
    });

    expect(backend.readCheckinByDate).toHaveBeenCalledWith("trainee-1", "2026-11-25");
    expect(backend.rpcSubmitDailyCheckin).not.toHaveBeenCalled();
    expect(outcome.status).toBe("already_submitted");
    if (outcome.status === "already_submitted") {
      expect(outcome.noteNotApplied).toBe(true);
      expect(outcome.record.localCheckinDate).toBe("2026-11-25");
    }
  });

  it("after midnight rollover, NEVER silently submits original draft to the new day", async () => {
    const readCheckinByDate = vi
      .fn()
      .mockResolvedValueOnce({ kind: "not_found", serverDate: "2026-11-26" })
      .mockResolvedValueOnce({ kind: "not_found", serverDate: "2026-11-26" });

    const backend = createMockBackend({ readCheckinByDate });

    const outcome = await reconcileUnknownOutcomeAndRetry(backend, {
      traineeId: "trainee-1",
      previousAttempt: {
        originalDate: "2026-11-25",
        draftNote: "Ghi chú ngày 25",
        normalizedNote: "Ghi chú ngày 25",
      },
      currentDraftNote: "Ghi chú ngày 25",
    });

    expect(readCheckinByDate).toHaveBeenNthCalledWith(1, "trainee-1", "2026-11-25");
    expect(readCheckinByDate).toHaveBeenNthCalledWith(2, "trainee-1", "2026-11-26");
    expect(backend.rpcSubmitDailyCheckin).not.toHaveBeenCalled();
    expect(outcome.status).toBe("day_rolled_over");
    if (outcome.status === "day_rolled_over") {
      expect(outcome.originalDate).toBe("2026-11-25");
      expect(outcome.currentServerDate).toBe("2026-11-26");
      expect(outcome.draftNote).toBe("Ghi chú ngày 25");
      expect(outcome.existingNewDayRecord).toBeNull();
    }
  });

  it("after midnight rollover, surfaces an already-landed new-day record without calling submit RPC", async () => {
    const newDayRow: SavedCheckinRecord = {
      id: "chk-26",
      localCheckinDate: "2026-11-26",
      note: "Ghi chú ngày 25",
      submittedAt: "2026-11-25T17:00:01.000Z",
    };
    const readCheckinByDate = vi
      .fn()
      .mockResolvedValueOnce({ kind: "not_found", serverDate: "2026-11-26" })
      .mockResolvedValueOnce({
        kind: "found",
        record: newDayRow,
        serverDate: "2026-11-26",
      });

    const backend = createMockBackend({ readCheckinByDate });

    const outcome = await reconcileUnknownOutcomeAndRetry(backend, {
      traineeId: "trainee-1",
      previousAttempt: {
        originalDate: "2026-11-25",
        draftNote: "Ghi chú ngày 25",
        normalizedNote: "Ghi chú ngày 25",
      },
      currentDraftNote: "Ghi chú ngày 25",
    });

    expect(backend.rpcSubmitDailyCheckin).not.toHaveBeenCalled();
    expect(outcome.status).toBe("day_rolled_over");
    if (outcome.status === "day_rolled_over") {
      expect(outcome.existingNewDayRecord).toEqual(newDayRow);
      expect(outcome.noteNotAppliedOnNewDay).toBe(false);
    }
  });

  it("retries submit_daily_checkin only when original day is empty and date has not rolled over", async () => {
    const backend = createMockBackend({
      readCheckinByDate: vi.fn().mockResolvedValue({
        kind: "not_found",
        serverDate: "2026-11-25",
      }),
      rpcSubmitDailyCheckin: vi.fn().mockResolvedValue({
        kind: "ok",
        checkinId: "chk-1",
        outcome: "created",
        localCheckinDate: "2026-11-25",
      }),
      readCheckinById: vi.fn().mockResolvedValue({
        kind: "found",
        record: savedRow,
        serverDate: "2026-11-25",
      }),
    });

    const outcome = await reconcileUnknownOutcomeAndRetry(backend, {
      traineeId: "trainee-1",
      previousAttempt: {
        originalDate: "2026-11-25",
        draftNote: "Hoàn thành buổi chân",
        normalizedNote: "Hoàn thành buổi chân",
      },
      currentDraftNote: "Hoàn thành buổi chân",
    });

    expect(backend.readCheckinByDate).toHaveBeenCalledWith("trainee-1", "2026-11-25");
    expect(backend.rpcSubmitDailyCheckin).toHaveBeenCalledTimes(1);
    expect(outcome.status).toBe("created");
  });

  it("handles session expiration and archived/unlinked access denial explicitly", async () => {
    const expiredBackend = createMockBackend({
      readCheckinByDate: vi.fn().mockResolvedValue({ kind: "session_expired" }),
    });
    const expired = await reconcileUnknownOutcomeAndRetry(expiredBackend, {
      traineeId: "trainee-1",
      previousAttempt: {
        originalDate: "2026-11-25",
        draftNote: "Test",
        normalizedNote: "Test",
      },
      currentDraftNote: "Test",
    });
    expect(expired.status).toBe("session_expired");
    expect(expiredBackend.rpcSubmitDailyCheckin).not.toHaveBeenCalled();

    const deniedBackend = createMockBackend({
      rpcSubmitDailyCheckin: vi.fn().mockResolvedValue({
        kind: "access_denied",
        code: "42501",
        message: "Active linked profile required",
      }),
    });
    const denied = await submitCheckinWithContract(deniedBackend, {
      targetDate: "2026-11-25",
      draftNote: "Test",
    });
    expect(denied.status).toBe("access_denied");
  });
});
