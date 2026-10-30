const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LOCAL_MINUTE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

// datetime-local has no timezone. Interpret every calendar form as Vietnam time,
// regardless of the browser/server's configured timezone; reject normalized dates.
export function vietnamAppointmentInstant(value: unknown) {
  if (typeof value !== "string" || !LOCAL_MINUTE.test(value)) return null;
  const instant = new Date(`${value}:00+07:00`);
  if (!Number.isFinite(instant.getTime())) return null;
  const local = new Date(instant.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 16);
  return local === value ? instant.toISOString() : null;
}

export function validateAppointment(form: FormData, now = new Date()) {
  const traineeId = form.get("traineeId");
  const nonce = form.get("clientRequestId");
  const rawTitle = form.get("title");
  const title = typeof rawTitle === "string" ? rawTitle.trim() : "";
  const kind = form.get("kind");
  const startsAt = vietnamAppointmentInstant(form.get("startLocal"));
  const endsAt = vietnamAppointmentInstant(form.get("endLocal"));
  if (typeof traineeId !== "string" || !UUID.test(traineeId)) return {ok:false as const, error:"Chọn học viên đã kết nối."};
  if (typeof nonce !== "string" || !UUID.test(nonce)) return {ok:false as const, error:"Không xác định được lượt đặt lịch. Hãy tải lại trang."};
  if (!title || title.length > 100) return {ok:false as const, error:"Nhập tên cuộc hẹn từ 1 đến 100 ký tự."};
  if (kind !== "training" && kind !== "consultation") return {ok:false as const, error:"Chọn loại cuộc hẹn hợp lệ."};
  if (!startsAt || !endsAt) return {ok:false as const, error:"Nhập ngày giờ hợp lệ theo giờ Việt Nam."};
  if (Date.parse(startsAt) <= now.getTime()) return {ok:false as const, error:"Chọn thời gian bắt đầu trong tương lai."};
  const duration = Date.parse(endsAt) - Date.parse(startsAt);
  if (duration <= 0 || duration > 24 * 60 * 60 * 1000) return {ok:false as const, error:"Giờ kết thúc phải sau giờ bắt đầu, tối đa 24 giờ cho một cuộc hẹn."};
  return {ok:true as const, traineeId, nonce, title, kind, startsAt, endsAt};
}
