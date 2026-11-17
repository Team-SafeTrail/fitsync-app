"use server";
import { createHash, randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getWorkspaceViewer } from "@/features/workspace/data";
import { createClient } from "@/lib/supabase/server";
import type { WorkspaceActionState } from "@/features/workspace/action-state";

export async function recordFinance(_state: WorkspaceActionState, form: FormData): Promise<WorkspaceActionState> {
  const viewer = await getWorkspaceViewer();
  if (viewer?.profile.role !== "admin") return { status: "error", message: "Chỉ quản trị viên có thể đối soát." };
  if (form.get("verified") !== "on") return { status: "error", message: "Đối chiếu giao dịch với sao kê và chứng từ trước khi ghi sổ." };
  const file = form.get("receipt"), amount = Number(form.get("amount"));
  const kind = String(form.get("kind")), category = String(form.get("category")), note = String(form.get("note") ?? "").trim();
  const reference = String(form.get("reference") ?? "").trim(), transactedAt = String(form.get("transactedAt") ?? "");
  const nonce = String(form.get("nonce") ?? ""), customer = String(form.get("customer") ?? "");
  if (!Number.isSafeInteger(amount) || amount < 1 || amount > 1e10 || !["income", "expense"].includes(kind) || !["subscription", "marketing", "hosting", "tools", "other"].includes(category)
    || note.length < 5 || note.length > 500 || reference.length < 3 || reference.length > 120 || !Number.isFinite(Date.parse(transactedAt)) || !/^[0-9a-f-]{36}$/i.test(nonce)
    || (customer && !/^[0-9a-f-]{36}$/i.test(customer))) return { status: "error", message: "Kiểm tra số tiền, mã giao dịch, ngày và diễn giải." };
  if (!(file instanceof File) || file.size < 1 || file.size > 5 * 1024 * 1024) return { status: "error", message: "Đính kèm chứng từ PDF, JPEG hoặc PNG tối đa 5 MB." };
  const bytes = Buffer.from(await file.arrayBuffer());
  const format = bytes.subarray(0, 5).toString() === "%PDF-" ? { mime: "application/pdf", ext: "pdf" }
    : bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? { mime: "image/png", ext: "png" }
    : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? { mime: "image/jpeg", ext: "jpg" } : null;
  if (!format || format.mime !== file.type) return { status: "error", message: "Định dạng tệp không khớp nội dung. Dùng PDF, JPEG hoặc PNG hợp lệ." };
  const db = await createClient(), hash = createHash("sha256").update(bytes).digest("hex");
  const { data: prior, error: lookupError } = await db.from("finance_entries").select("id,kind,category,amount_vnd,customer_id,bank_reference,occurred_at,evidence_sha256,note,is_test").eq("actor_id", viewer.user.id).eq("client_nonce", nonce).maybeSingle();
  if (lookupError) return { status: "error", message: "Chưa kiểm tra được lần ghi trước. Tải lại sổ trước khi thử lại." };
  if (prior) {
    if (prior.kind !== kind || prior.category !== category || prior.amount_vnd !== amount || prior.customer_id !== (customer || null) || prior.bank_reference !== reference.toLowerCase() || Date.parse(prior.occurred_at) !== Date.parse(transactedAt) || prior.evidence_sha256 !== hash || prior.note !== note || prior.is_test !== (form.get("isTest") === "on")) return { status: "error", message: "Mã yêu cầu này đã ghi giao dịch khác. Tải lại trang trước khi tạo mục mới." };
    revalidatePath("/admin");
    return { status: "success", message: "Giao dịch này đã được ghi ở lần trước. Sổ và quyền gói được giữ nguyên, không tính thêm lần nữa." };
  }
  const path = `${viewer.user.id}/${randomUUID()}.${format.ext}`;
  const uploaded = await db.storage.from("finance-evidence").upload(path, bytes, { contentType: format.mime, upsert: false });
  if (uploaded.error) return { status: "error", message: "Chưa lưu được chứng từ riêng tư. Kiểm tra bucket và quyền quản trị." };
  const { error } = await db.rpc("record_finance_entry", { request_nonce: nonce, entry_kind: kind, entry_category: category, amount, ...(customer ? { customer } : {}),
    transaction_reference: reference, transacted_at: new Date(transactedAt).toISOString(), receipt_path: path, receipt_sha256: hash, description: note, test_entry: form.get("isTest") === "on" });
  if (error) {
    await db.storage.from("finance-evidence").remove([path]);
    return { status: "error", message: error.code === "23505" ? "Mã giao dịch đã có trong sổ. Đối chiếu mục đã ghi trước khi thử lại." : "Chưa ghi được giao dịch. Kiểm tra khách PT, giá gói, chứng từ và phiên bản dữ liệu." };
  }
  revalidatePath("/admin"); revalidatePath("/workspace/billing");
  return { status: "success", message: "Đã ghi giao dịch và lưu chứng từ riêng tư. Giao dịch thử được tách khỏi doanh thu thật." };
}
export async function reverseFinance(entryId: string, _state: WorkspaceActionState, form: FormData): Promise<WorkspaceActionState> {
  if ((await getWorkspaceViewer())?.profile.role !== "admin" || form.get("confirmed") !== "on") return { status: "error", message: "Quản trị viên cần xác nhận điều chỉnh." };
  const reason = String(form.get("reason") ?? "").trim();
  if (reason.length < 5 || reason.length > 500) return { status: "error", message: "Nhập lý do đối chiếu từ 5 đến 500 ký tự." };
  const { error } = await (await createClient()).rpc("reverse_finance_entry", { target_entry: entryId, request_nonce: String(form.get("nonce")), reason });
  if (error) return { status: "error", message: "Không thể đảo giao dịch. Tải lại để kiểm tra giao dịch đã được điều chỉnh chưa." };
  revalidatePath("/admin"); revalidatePath("/workspace/billing");
  return { status: "success", message: "Đã thêm bút toán đảo. Giao dịch gốc và chứng từ vẫn được giữ; quyền gói trả phí đã được đối chiếu lại." };
}
