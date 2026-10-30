const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isChatId = (value: unknown): value is string => typeof value === "string" && uuid.test(value);

export function validateChatMessage(form: FormData) {
  const raw = form.get("body");
  const nonce = form.get("clientMessageId");
  const body = typeof raw === "string" ? raw.trim() : "";
  if (!isChatId(nonce)) return { ok: false as const, error: "Không xác định được lượt gửi. Hãy tải lại trang." };
  if (!body || !/[^\s\u200B-\u200D\uFEFF]/u.test(body) || body.length > 4000) {
    return { ok: false as const, error: "Nhập tin nhắn từ 1 đến 4.000 ký tự." };
  }
  return { ok: true as const, body, nonce };
}

// Only canonical timestamp/UUID tokens can enter the PostgREST OR expression.
export function parseChatCursor(raw: unknown) {
  if (typeof raw !== "string") return null;
  const [time, id, extra] = raw.split("~");
  if (extra !== undefined || !isChatId(id) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?Z$/.test(time)) return null;
  const parsed = new Date(time);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0,19) !== time.slice(0,19)) return null;
  return { time, id };
}

export function makeChatCursor(time: string, id: string) {
  // Do not round Postgres microseconds through JS Date (which has millisecond precision).
  const token = `${time.replace(/\+00:00$/, "Z")}~${id}`;
  return parseChatCursor(token) ? token : null;
}
