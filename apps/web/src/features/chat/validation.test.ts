import {describe, expect, it} from "vitest";
import {isChatId, parseChatCursor, makeChatCursor, validateChatMessage} from "./validation";
const id = "ac000000-0000-0000-0000-000000000001";
const form = (body: string, nonce = id) => {const value = new FormData(); value.set("body",body);value.set("clientMessageId",nonce);return value;};
describe("private chat input boundaries",()=>{
  it("allows existing database UUIDs and trims text without evaluating markup",()=>{
    expect(isChatId(id)).toBe(true);
    expect(validateChatMessage(form("  <script>alert(1)</script>\nhello  "))).toEqual({ok:true,body:"<script>alert(1)</script>\nhello",nonce:id});
  });
  it.each(["", "   ", "\n\t", "\u200B\u200C", "a".repeat(4001)])("rejects blank/invisible/overlong content %#",body=>{expect(validateChatMessage(form(body)).ok).toBe(false);});
  it("rejects file fields and missing retry identifiers",()=>{const value=form("text");value.set("body",new Blob(["not text"]));expect(validateChatMessage(value).ok).toBe(false);expect(validateChatMessage(form("text","not-a-uuid")).ok).toBe(false);});
  it("accepts the bounded pagination token",()=>{expect(parseChatCursor(`2026-10-30T10:01:02.000Z~${id}`)).toEqual({time:"2026-10-30T10:01:02.000Z",id});});
  it("preserves Postgres microseconds so same-millisecond history is not skipped",()=>{
    const cursor = makeChatCursor("2026-10-30T10:01:02.123456+00:00",id);
    expect(cursor).toBe(`2026-10-30T10:01:02.123456Z~${id}`);
    expect(parseChatCursor(cursor)?.time).toBe("2026-10-30T10:01:02.123456Z");
  });
  it.each([undefined, "", `2026-02-31T00:00:00.000Z~${id}`, `2026-10-30T00:00:00.000Z~${id},body.neq.x`, `2026-10-30T00:00:00.000Z~${id}~extra`])("rejects malformed/injected pagination %#",value=>{expect(parseChatCursor(value)).toBeNull();});
});
