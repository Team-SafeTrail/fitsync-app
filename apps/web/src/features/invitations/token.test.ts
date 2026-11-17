import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createInvitationToken, hashInvitationToken, isInvitationToken } from "./token";

describe("invitation tokens", () => {
  it("generates a 43-character base64url random token", () => {
    const token = createInvitationToken();
    expect(token).toHaveLength(43);
    expect(isInvitationToken(token)).toBe(true);
  });

  it("produces a deterministic SHA-256 hex digest for token hashing", () => {
    const token = "mock_invitation_token_123456789012345678901";
    const hash1 = hashInvitationToken(token);
    const hash2 = hashInvitationToken(token);
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
    expect(/^[a-f0-9]{64}$/.test(hash1)).toBe(true);
  });

  it("validates valid invitation token format", () => {
    expect(isInvitationToken("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1")).toBe(true);
    expect(isInvitationToken("0123456789-_abcdefghijklmnopqrstuvwxyzABCDE")).toBe(true);
  });

  it("rejects invalid invitation token format", () => {
    expect(isInvitationToken("")).toBe(false);
    expect(isInvitationToken("short-token")).toBe(false);
    expect(isInvitationToken("too-long-token-1234567890123456789012345678901234567890")).toBe(false);
    expect(isInvitationToken("invalid+characters/token==1234567890123456")).toBe(false);
    expect(isInvitationToken("../path-traversal-attempt-1234567890123456")).toBe(false);
  });
});
