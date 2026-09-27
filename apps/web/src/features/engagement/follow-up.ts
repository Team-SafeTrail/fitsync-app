export type FollowUpOptions = Readonly<{
  message: string;
  zaloUrl: string | null;
}>;

export function prepareFollowUp(displayName: string, phone: string | null): FollowUpOptions {
  const firstName = displayName.trim().split(/\s+/).at(-1) || "bạn";
  const digits = phone?.replace(/\D/g, "") ?? "";

  return {
    message: `Chào ${firstName}, PT thấy bạn chưa check-in vài ngày rồi. Khi tiện, bạn cập nhật nhanh trên FitSync để mình theo sát kế hoạch nhé.`,
    zaloUrl: digits.length >= 8 ? `https://zalo.me/${digits}` : null,
  };
}
