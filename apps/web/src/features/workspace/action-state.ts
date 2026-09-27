export type WorkspaceActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Record<string, string>;
  invitationUrl?: string;
  invitationExpiresAt?: string;
};

export const initialWorkspaceActionState: WorkspaceActionState = {
  status: "idle",
  message: "",
};
