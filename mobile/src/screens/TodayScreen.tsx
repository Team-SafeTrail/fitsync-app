import React from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BrandMark } from "../components/BrandMark";
import {
  CalendarIcon,
  CheckCircleIcon,
  LogOutIcon,
  RefreshIcon,
} from "../components/Icons";
import { InlineBanner } from "../components/InlineBanner";
import { PrimaryButton } from "../components/PrimaryButton";
import type { TraineeTodayState } from "../features/trainee/trainee-api";
import {
  formatVietnamDate,
  formatVietnamDateLong,
  formatVietnamTimestamp,
} from "../lib/vietnam-date";
import { colors, fonts, radius, spacing, touchTarget } from "../theme/tokens";

export type TodayNotice = {
  tone: "success" | "warning" | "info";
  title?: string;
  message: string;
};

type TodayScreenProps = {
  todayState: Exclude<TraineeTodayState, { kind: "session_expired" }> | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  notice: TodayNotice | null;
  signingOut: boolean;
  onRefresh: () => void;
  onOpenCheckin: () => void;
  onSignOut: () => void;
  onDismissNotice: () => void;
};

export function TodayScreen({
  todayState,
  loading,
  refreshing,
  error,
  notice,
  signingOut,
  onRefresh,
  onOpenCheckin,
  onSignOut,
  onDismissNotice,
}: TodayScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.topBar,
          { paddingTop: Math.max(insets.top, spacing.md) + spacing.xs },
        ]}
      >
        <BrandMark size="sm" />
        <View style={styles.topBarActions}>
          <Pressable
            onPress={onRefresh}
            disabled={loading || refreshing || signingOut}
            accessibilityRole="button"
            accessibilityLabel="Tải lại dữ liệu hôm nay"
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <RefreshIcon color={colors.forest} />
          </Pressable>
          <Pressable
            onPress={onSignOut}
            disabled={signingOut}
            accessibilityRole="button"
            accessibilityLabel="Đăng xuất"
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.buttonPressed,
              signingOut && styles.disabled,
            ]}
          >
            <LogOutIcon size={16} color={colors.forest} />
            <Text style={styles.signOutLabel}>
              {signingOut ? "Đang thoát..." : "Đăng xuất"}
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.xl },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.jade}
            colors={[colors.jade]}
          />
        }
      >
        <View style={styles.container}>
          {loading && !todayState ? (
            <View style={styles.stateSurface}>
              <ActivityIndicator size="small" color={colors.jade} />
              <Text style={styles.stateTitle}>Đang tải trang Hôm nay...</Text>
              <Text style={styles.stateBody}>
                Đang đọc hồ sơ học viên và trạng thái check-in theo giờ Việt Nam.
              </Text>
            </View>
          ) : error && !todayState ? (
            <View style={styles.stateSurface}>
              <InlineBanner tone="error" title="Chưa tải được dữ liệu" message={error} />
              <View style={styles.actionRow}>
                <PrimaryButton label="Thử lại" onPress={onRefresh} />
                <PrimaryButton
                  label="Đăng xuất"
                  variant="secondary"
                  loading={signingOut}
                  onPress={onSignOut}
                />
              </View>
            </View>
          ) : todayState?.kind === "non_trainee" ? (
            <View style={styles.stateSurface}>
              <InlineBanner
                tone="warning"
                title="Tài khoản không thuộc vai trò học viên"
                message={`Bạn đang đăng nhập bằng tài khoản ${todayState.role.toUpperCase()} (${todayState.displayName}). Bản Android U-01 chỉ phục vụ học viên đã liên kết; PT và quản trị tiếp tục dùng giao diện web.`}
              />
              <PrimaryButton
                label="Đăng xuất để đổi tài khoản"
                loading={signingOut}
                onPress={onSignOut}
              />
            </View>
          ) : todayState?.kind === "unlinked" ? (
            <View style={styles.stateSurface}>
              <InlineBanner
                tone="warning"
                title="Chưa liên kết hồ sơ học viên"
                message={`Xin chào ${todayState.displayName}. Tài khoản này chưa gắn với hồ sơ PT nào. Hãy mở liên kết lời mời từ PT trên trình duyệt web trước, rồi quay lại đây.`}
              />
              <View style={styles.actionRow}>
                <PrimaryButton label="Kiểm tra lại" onPress={onRefresh} />
                <PrimaryButton
                  label="Đăng xuất"
                  variant="secondary"
                  loading={signingOut}
                  onPress={onSignOut}
                />
              </View>
            </View>
          ) : todayState?.kind === "archived" ? (
            <View style={styles.stateSurface}>
              <InlineBanner
                tone="warning"
                title="Hồ sơ đã được lưu trữ"
                message={`Hồ sơ ${todayState.traineeDisplayName} hiện đang ở trạng thái lưu trữ nên không thể gửi check-in mới. Liên hệ PT phụ trách để khôi phục trước khi tiếp tục.`}
              />
              <PrimaryButton
                label="Đăng xuất"
                variant="secondary"
                loading={signingOut}
                onPress={onSignOut}
              />
            </View>
          ) : todayState?.kind === "active" ? (
            <>
              <View style={styles.identityHeader}>
                <View style={styles.dateRow}>
                  <CalendarIcon size={15} color={colors.jade} />
                  <Text style={styles.dateText}>
                    {formatVietnamDateLong(todayState.todayVietnamDate)} · GMT+7
                  </Text>
                </View>
                <Text style={styles.greeting}>
                  Chào {todayState.profile.display_name}
                </Text>
                {todayState.coachName ? (
                  <Text style={styles.coachContext}>
                    PT đồng hành: {todayState.coachName}
                  </Text>
                ) : null}
                <View style={styles.sessionPill}>
                  <Text style={styles.sessionCount}>
                    {todayState.trainee.remaining_sessions}
                  </Text>
                  <Text style={styles.sessionLabel}>
                    buổi PT còn lại / {todayState.trainee.total_sessions}
                  </Text>
                </View>
              </View>

              {error ? (
                <InlineBanner tone="error" title="Không thể làm mới" message={error} />
              ) : null}

              {notice ? (
                <View style={styles.noticeWrap}>
                  <InlineBanner
                    tone={notice.tone}
                    title={notice.title}
                    message={notice.message}
                  />
                  <Pressable
                    onPress={onDismissNotice}
                    accessibilityRole="button"
                    accessibilityLabel="Đóng thông báo"
                    style={styles.dismissButton}
                  >
                    <Text style={styles.dismissLabel}>Đã hiểu</Text>
                  </Pressable>
                </View>
              ) : null}

              {todayState.todayCheckin ? (
                <View style={styles.completedSurface}>
                  <View style={styles.completedHeader}>
                    <CheckCircleIcon size={22} color={colors.success} />
                    <View style={styles.completedTitleWrap}>
                      <Text style={styles.completedKicker}>Đã xác nhận từ máy chủ</Text>
                      <Text style={styles.sectionTitle}>Đã check-in hôm nay</Text>
                    </View>
                  </View>

                  <View style={styles.metaLine}>
                    <Text style={styles.metaLabel}>Ngày Việt Nam</Text>
                    <Text style={styles.metaValue}>
                      {formatVietnamDate(todayState.todayCheckin.localCheckinDate)}
                    </Text>
                  </View>

                  {todayState.todayCheckin.submittedAt ? (
                    <View style={styles.metaLine}>
                      <Text style={styles.metaLabel}>Thời điểm lưu</Text>
                      <Text style={styles.metaValue}>
                        {formatVietnamTimestamp(todayState.todayCheckin.submittedAt)}
                      </Text>
                    </View>
                  ) : null}

                  <View style={styles.noteBox}>
                    <Text style={styles.noteBoxLabel}>Ghi chú đã lưu</Text>
                    <Text
                      style={[
                        styles.noteBoxValue,
                        !todayState.todayCheckin.note && styles.mutedItalic,
                      ]}
                    >
                      {todayState.todayCheckin.note ?? "Không có ghi chú"}
                    </Text>
                  </View>

                  <Text style={styles.quietHelper}>
                    PT phụ trách có thể xem bản ghi này ngay khi tải lại hồ sơ trên web.
                  </Text>
                </View>
              ) : (
                <View style={styles.dueSurface}>
                  <Text style={styles.kicker}>Việc cần làm hôm nay</Text>
                  <Text style={styles.sectionTitle}>Check-in hôm nay</Text>
                  <Text style={styles.bodyText}>
                    Gửi một cập nhật ngắn về buổi tập hoặc năng lượng hôm nay. Mỗi ngày
                    chỉ lưu một lượt check-in theo giờ Việt Nam.
                  </Text>
                  <PrimaryButton
                    label="Check-in hôm nay"
                    onPress={onOpenCheckin}
                    style={styles.ctaButton}
                  />
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.historySection}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>Lịch sử check-in gần đây</Text>
                  <Text style={styles.historyCount}>
                    {todayState.checkins.length} ngày
                  </Text>
                </View>

                {todayState.checkins.length === 0 ? (
                  <View style={styles.emptyHistory}>
                    <Text style={styles.emptyHistoryText}>
                      Chưa có lượt check-in nào. Gửi check-in đầu tiên để PT theo sát giữa
                      các buổi tập.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.timeline}>
                    {todayState.checkins.map((item, index) => (
                      <View
                        key={item.id}
                        style={[
                          styles.timelineRow,
                          index < todayState.checkins.length - 1 && styles.timelineDivider,
                        ]}
                      >
                        <View style={styles.timelineMeta}>
                          <Text style={styles.timelineDate}>
                            {formatVietnamDate(item.localCheckinDate)}
                          </Text>
                          {item.submittedAt ? (
                            <Text style={styles.timelineTime}>
                              {formatVietnamTimestamp(item.submittedAt)}
                            </Text>
                          ) : null}
                        </View>
                        <Text
                          style={[
                            styles.timelineNote,
                            !item.note && styles.mutedItalic,
                          ]}
                        >
                          {item.note ?? "Không có ghi chú"}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  topBar: {
    backgroundColor: colors.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconButton: {
    minWidth: touchTarget.minSize,
    minHeight: touchTarget.minSize,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  signOutButton: {
    minHeight: touchTarget.minSize,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  signOutLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.forest,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.55,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  container: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    gap: spacing.lg,
  },
  stateSurface: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.base,
  },
  stateTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.forest,
  },
  stateBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  actionRow: {
    gap: spacing.sm,
  },
  identityHeader: {
    gap: spacing.xs,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  dateText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.jade,
    fontVariant: ["tabular-nums"],
  },
  greeting: {
    fontFamily: fonts.semiBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.6,
    color: colors.forest,
  },
  coachContext: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  sessionPill: {
    marginTop: spacing.xs,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sessionCount: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.forest,
    fontVariant: ["tabular-nums"],
  },
  sessionLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    fontVariant: ["tabular-nums"],
  },
  noticeWrap: {
    gap: spacing.xs,
  },
  dismissButton: {
    alignSelf: "flex-end",
    minHeight: touchTarget.minSize,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
  },
  dismissLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.jade,
  },
  dueSurface: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  kicker: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.jade,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.forest,
  },
  bodyText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  ctaButton: {
    marginTop: spacing.sm,
  },
  completedSurface: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  completedHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  completedTitleWrap: {
    flex: 1,
    gap: 2,
  },
  completedKicker: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.success,
  },
  metaLine: {
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
  noteBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  noteBoxLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  noteBoxValue: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.forest,
  },
  quietHelper: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  historySection: {
    gap: spacing.md,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  historyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.forest,
  },
  historyCount: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
    fontVariant: ["tabular-nums"],
  },
  emptyHistory: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },
  emptyHistoryText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  timeline: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  timelineRow: {
    padding: spacing.base,
    gap: spacing.xs,
  },
  timelineDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timelineMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  timelineDate: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.forest,
    fontVariant: ["tabular-nums"],
  },
  timelineTime: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    fontVariant: ["tabular-nums"],
  },
  timelineNote: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  mutedItalic: {
    color: colors.textMuted,
  },
});
