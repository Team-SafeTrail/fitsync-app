import React, { useEffect, useMemo, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ArrowLeftIcon, CalendarIcon, CheckCircleIcon } from "../components/Icons";
import { InlineBanner } from "../components/InlineBanner";
import { PrimaryButton } from "../components/PrimaryButton";
import {
  reconcileUnknownOutcomeAndRetry,
  submitCheckinWithContract,
  type PendingCheckinAttempt,
  type SavedCheckinRecord,
} from "../features/checkin/submission";
import {
  MAX_CHECKIN_NOTE_LENGTH,
  validateCheckinNote,
} from "../features/checkin/validation";
import { createSupabaseCheckinBackend } from "../features/trainee/trainee-api";
import { getSupabaseClient } from "../lib/supabase";
import {
  formatVietnamDate,
  formatVietnamDateLong,
  formatVietnamTimestamp,
} from "../lib/vietnam-date";
import { colors, fonts, radius, spacing, touchTarget } from "../theme/tokens";
import type { TodayNotice } from "./TodayScreen";

type CheckinScreenProps = {
  traineeId: string;
  initialDate: string;
  onBack: () => void;
  onCompleted: (notice: TodayNotice) => void;
  onSessionExpired: (message: string) => void;
  onAccessDenied: (message: string) => void;
};

type ScreenMode =
  | { kind: "editing" }
  | { kind: "unknown_outcome"; attempt: PendingCheckinAttempt; message: string }
  | {
      kind: "day_rolled_over";
      originalDate: string;
      currentServerDate: string;
      existingNewDayRecord: SavedCheckinRecord | null;
      noteNotAppliedOnNewDay: boolean;
      message: string;
    }
  | {
      kind: "saved";
      record: SavedCheckinRecord;
      tone: "success" | "warning";
      title: string;
      message: string;
      unsavedDraft: string | null;
    };

export function CheckinScreen({
  traineeId,
  initialDate,
  onBack,
  onCompleted,
  onSessionExpired,
  onAccessDenied,
}: CheckinScreenProps) {
  const insets = useSafeAreaInsets();
  const [draftNote, setDraftNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [mode, setMode] = useState<ScreenMode>({ kind: "editing" });

  const backend = useMemo(
    () => createSupabaseCheckinBackend(getSupabaseClient()),
    [],
  );

  const noteCheck = useMemo(() => validateCheckinNote(draftNote), [draftNote]);

  const activeTargetDate =
    mode.kind === "day_rolled_over"
      ? mode.currentServerDate
      : mode.kind === "unknown_outcome"
        ? mode.attempt.originalDate
        : initialDate;

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (submitting) {
        return true;
      }
      if (mode.kind === "saved") {
        onCompleted({
          tone: mode.tone,
          title: mode.title,
          message: mode.message,
        });
      } else {
        onBack();
      }
      return true;
    });
    return () => subscription.remove();
  }, [submitting, mode, onBack, onCompleted]);

  async function runSubmission(targetDate: string) {
    if (submitting) return;
    setValidationError(null);

    const checked = validateCheckinNote(draftNote);
    if (!checked.ok) {
      setValidationError(checked.message);
      return;
    }

    setSubmitting(true);
    try {
      const outcome = await submitCheckinWithContract(backend, {
        targetDate,
        draftNote,
      });
      handleOutcome(outcome);
    } finally {
      setSubmitting(false);
    }
  }

  async function runUnknownOutcomeReconcile(attempt: PendingCheckinAttempt) {
    if (submitting) return;
    setValidationError(null);

    const checked = validateCheckinNote(draftNote);
    if (!checked.ok) {
      setValidationError(checked.message);
      return;
    }

    setSubmitting(true);
    try {
      const outcome = await reconcileUnknownOutcomeAndRetry(backend, {
        traineeId,
        previousAttempt: attempt,
        currentDraftNote: draftNote,
      });
      handleOutcome(outcome);
    } finally {
      setSubmitting(false);
    }
  }

  function handleOutcome(
    outcome: Awaited<ReturnType<typeof submitCheckinWithContract>>,
  ) {
    switch (outcome.status) {
      case "validation_error":
        setValidationError(outcome.message);
        return;

      case "session_expired":
        onSessionExpired(outcome.message);
        return;

      case "access_denied":
        onAccessDenied(outcome.message);
        return;

      case "unknown_outcome":
        setMode({
          kind: "unknown_outcome",
          attempt: outcome.attempt,
          message: outcome.message,
        });
        return;

      case "day_rolled_over":
        setMode({
          kind: "day_rolled_over",
          originalDate: outcome.originalDate,
          currentServerDate: outcome.currentServerDate,
          existingNewDayRecord: outcome.existingNewDayRecord,
          noteNotAppliedOnNewDay: outcome.noteNotAppliedOnNewDay,
          message: outcome.message,
        });
        return;

      case "created":
        setMode({
          kind: "saved",
          record: outcome.record,
          tone: outcome.dateChangedDuringSubmit ? "warning" : "success",
          title: outcome.dateChangedDuringSubmit
            ? "Đã lưu theo ngày Việt Nam mới"
            : "Đã ghi nhận check-in",
          message: outcome.message,
          unsavedDraft: null,
        });
        return;

      case "already_submitted":
        setMode({
          kind: "saved",
          record: outcome.record,
          tone: outcome.noteNotApplied ? "warning" : "success",
          title: outcome.noteNotApplied
            ? "Đã có check-in — ghi chú mới chưa được lưu"
            : "Đã có check-in trên máy chủ",
          message: outcome.message,
          unsavedDraft: outcome.noteNotApplied ? draftNote : null,
        });
        return;
    }
  }

  const isSaved = mode.kind === "saved";
  const isRolloverWithExistingNewDay =
    mode.kind === "day_rolled_over" && mode.existingNewDayRecord !== null;

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.topBar,
          { paddingTop: Math.max(insets.top, spacing.md) + spacing.xs },
        ]}
      >
        <Pressable
          onPress={() => {
            if (submitting) return;
            if (mode.kind === "saved") {
              onCompleted({
                tone: mode.tone,
                title: mode.title,
                message: mode.message,
              });
            } else {
              onBack();
            }
          }}
          disabled={submitting}
          accessibilityRole="button"
          accessibilityLabel="Quay lại trang Hôm nay"
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <ArrowLeftIcon size={20} color={colors.forest} />
          <Text style={styles.backLabel}>Hôm nay</Text>
        </Pressable>
        <Text style={styles.topBarTitle}>Check-in hôm nay</Text>
        <View style={styles.topBarSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.dateBar}>
              <CalendarIcon size={16} color={colors.jade} />
              <Text style={styles.dateBarText}>
                {formatVietnamDateLong(activeTargetDate)} · Giờ Việt Nam (GMT+7)
              </Text>
            </View>

            {mode.kind === "saved" ? (
              <View style={styles.savedContainer}>
                <InlineBanner
                  tone={mode.tone}
                  title={mode.title}
                  message={mode.message}
                />

                <View style={styles.recordCard}>
                  <View style={styles.recordHeader}>
                    <CheckCircleIcon size={22} color={colors.success} />
                    <Text style={styles.recordHeading}>Bản ghi đã xác nhận</Text>
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Ngày máy chủ xác nhận</Text>
                    <Text style={styles.metaValue}>
                      {formatVietnamDate(mode.record.localCheckinDate)}
                    </Text>
                  </View>

                  {mode.record.submittedAt ? (
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Thời điểm lưu</Text>
                      <Text style={styles.metaValue}>
                        {formatVietnamTimestamp(mode.record.submittedAt)}
                      </Text>
                    </View>
                  ) : null}

                  <View style={styles.notePreview}>
                    <Text style={styles.notePreviewLabel}>Ghi chú trên máy chủ</Text>
                    <Text
                      style={[
                        styles.notePreviewText,
                        !mode.record.note && styles.mutedText,
                      ]}
                    >
                      {mode.record.note ?? "Không có ghi chú"}
                    </Text>
                  </View>
                </View>

                {mode.unsavedDraft !== null ? (
                  <View style={styles.unsavedBox}>
                    <Text style={styles.unsavedLabel}>
                      Ghi chú bạn vừa nhập (chưa được áp dụng)
                    </Text>
                    <Text style={styles.unsavedText}>
                      {mode.unsavedDraft.length > 0 ? mode.unsavedDraft : "(Trống)"}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : (
              <>
                {mode.kind === "unknown_outcome" ? (
                  <InlineBanner
                    tone="warning"
                    title="Chưa rõ kết quả gửi trước đó"
                    message={mode.message}
                  />
                ) : null}

                {mode.kind === "day_rolled_over" ? (
                  <View style={styles.rolloverBlock}>
                    <InlineBanner
                      tone="warning"
                      title={`Đã sang ngày mới (${formatVietnamDate(mode.currentServerDate)})`}
                      message={mode.message}
                    />
                    {mode.existingNewDayRecord ? (
                      <View style={styles.recordCard}>
                        <View style={styles.recordHeader}>
                          <CheckCircleIcon size={20} color={colors.success} />
                          <Text style={styles.recordHeading}>
                            Bản ghi ngày {formatVietnamDate(mode.existingNewDayRecord.localCheckinDate)}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.notePreviewText,
                            !mode.existingNewDayRecord.note && styles.mutedText,
                          ]}
                        >
                          {mode.existingNewDayRecord.note ?? "Không có ghi chú"}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {!isRolloverWithExistingNewDay ? (
                  <View style={styles.formSurface}>
                    <View style={styles.labelRow}>
                      <Text style={styles.label} nativeID="checkin-note-label">
                        Ghi chú (không bắt buộc)
                      </Text>
                      <Text
                        style={[
                          styles.counter,
                          noteCheck.charLength > MAX_CHECKIN_NOTE_LENGTH &&
                            styles.counterError,
                        ]}
                      >
                        {noteCheck.charLength}/{MAX_CHECKIN_NOTE_LENGTH}
                      </Text>
                    </View>

                    <TextInput
                      value={draftNote}
                      onChangeText={(text) => {
                        setDraftNote(text);
                        if (validationError) setValidationError(null);
                      }}
                      editable={!submitting}
                      multiline
                      textAlignVertical="top"
                      placeholder="Ví dụ: năng lượng tốt, đã hoàn thành buổi chân và ăn đủ bữa."
                      placeholderTextColor={colors.textMuted}
                      accessibilityLabel="Ghi chú check-in hôm nay"
                      accessibilityLabelledBy="checkin-note-label"
                      style={[
                        styles.textarea,
                        (validationError || !noteCheck.ok) && styles.textareaError,
                      ]}
                    />

                    {validationError ? (
                      <Text style={styles.fieldError} accessibilityRole="alert">
                        {validationError}
                      </Text>
                    ) : !noteCheck.ok ? (
                      <Text style={styles.fieldError} accessibilityRole="alert">
                        {noteCheck.message}
                      </Text>
                    ) : (
                      <Text style={styles.helperText}>
                        Một lượt check-in mỗi ngày theo giờ Việt Nam. Bản U-01 chỉ gửi văn bản, chưa đính kèm ảnh.
                      </Text>
                    )}
                  </View>
                ) : null}
              </>
            )}
          </View>
        </ScrollView>

        <View
          style={[
            styles.actionBar,
            { paddingBottom: Math.max(insets.bottom, spacing.md) },
          ]}
        >
          <View style={styles.actionInner}>
            {isSaved ? (
              <PrimaryButton
                label="Về trang Hôm nay"
                onPress={() =>
                  onCompleted({
                    tone: mode.tone,
                    title: mode.title,
                    message: mode.message,
                  })
                }
              />
            ) : isRolloverWithExistingNewDay ? (
              <PrimaryButton
                label="Về trang Hôm nay"
                onPress={() =>
                  onCompleted({
                    tone: mode.noteNotAppliedOnNewDay ? "warning" : "success",
                    title: `Đã có check-in ngày ${formatVietnamDate(mode.currentServerDate)}`,
                    message: mode.message,
                  })
                }
              />
            ) : mode.kind === "unknown_outcome" ? (
              <PrimaryButton
                label={`Kiểm tra ngày ${formatVietnamDate(mode.attempt.originalDate)} và thử lại`}
                loadingLabel="Đang kiểm tra máy chủ..."
                loading={submitting}
                disabled={!noteCheck.ok}
                onPress={() => {
                  void runUnknownOutcomeReconcile(mode.attempt);
                }}
              />
            ) : mode.kind === "day_rolled_over" ? (
              <View style={styles.stackedActions}>
                <PrimaryButton
                  label={`Gửi như check-in ngày ${formatVietnamDate(mode.currentServerDate)}`}
                  loadingLabel="Đang gửi check-in..."
                  loading={submitting}
                  disabled={!noteCheck.ok}
                  onPress={() => {
                    void runSubmission(mode.currentServerDate);
                  }}
                />
                <PrimaryButton
                  label="Hủy bản nháp và quay lại"
                  variant="secondary"
                  disabled={submitting}
                  onPress={onBack}
                />
              </View>
            ) : (
              <PrimaryButton
                label="Gửi check-in"
                loadingLabel="Đang gửi check-in..."
                loading={submitting}
                disabled={!noteCheck.ok}
                onPress={() => {
                  void runSubmission(initialDate);
                }}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  flex: {
    flex: 1,
  },
  topBar: {
    backgroundColor: colors.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.pill,
  },
  backLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.forest,
  },
  topBarTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.forest,
  },
  topBarSpacer: {
    width: 72,
  },
  pressed: {
    opacity: 0.75,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  container: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    gap: spacing.base,
  },
  dateBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dateBarText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.forest,
    fontVariant: ["tabular-nums"],
    flex: 1,
  },
  formSurface: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.forest,
  },
  counter: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
    fontVariant: ["tabular-nums"],
  },
  counterError: {
    color: colors.destructive,
  },
  textarea: {
    minHeight: 152,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    padding: spacing.base,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.forest,
  },
  textareaError: {
    borderColor: colors.destructive,
  },
  helperText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
  },
  fieldError: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 19,
    color: colors.destructive,
  },
  savedContainer: {
    gap: spacing.base,
  },
  rolloverBlock: {
    gap: spacing.md,
  },
  recordCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  recordHeading: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.forest,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  metaLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  metaValue: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.forest,
    fontVariant: ["tabular-nums"],
    flexShrink: 1,
    textAlign: "right",
  },
  notePreview: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  notePreviewLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  notePreviewText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.forest,
  },
  mutedText: {
    color: colors.textMuted,
  },
  unsavedBox: {
    backgroundColor: colors.warningBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    padding: spacing.md,
    gap: spacing.xs,
  },
  unsavedLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.warning,
  },
  unsavedText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.forest,
  },
  actionBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  actionInner: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
  },
  stackedActions: {
    gap: spacing.sm,
  },
});
