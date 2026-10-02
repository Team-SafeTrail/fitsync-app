export type WorkspaceActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Record<string, string>;
  invitationUrl?: string;
  invitationExpiresAt?: string;
  ocrAttemptId?: string;
  ocrDraft?: import("./ocr-validation").OcrNormalizedDraft;
  ocrErrorCode?: import("./ocr-validation").OcrFailureCode;
  ocrSourceImageUrl?: string;
};

export const initialWorkspaceActionState: WorkspaceActionState = {
  status: "idle",
  message: "",
};
