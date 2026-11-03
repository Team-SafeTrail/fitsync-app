export type ChatState = {
  status: "idle" | "error" | "success";
  notice: string;
  nonce?: string;
  conflict?: boolean;
};
export const initialChatState: ChatState = { status: "idle", notice: "" };
