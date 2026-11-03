import "server-only";
export const isChatEnabled = () => process.env.FITSYNC_CHAT_ENABLED === "true";
