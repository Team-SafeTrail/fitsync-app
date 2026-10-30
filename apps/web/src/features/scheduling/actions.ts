"use server";
import {revalidatePath} from "next/cache";
import {createClient} from "@/lib/supabase/server";
import {getWorkspaceViewer} from "@/features/workspace/data";
import {isCalendarEnabled} from "./config";
import {validateAppointment} from "./validation";
import {scheduleWeek} from "./calendar";
import type {AppointmentState} from "./action-state";
import type {Tables} from "@/types/database";
import {getApplicationDate} from "../engagement/calendar";

export async function createAppointment(_previous:AppointmentState, form:FormData):Promise<AppointmentState> {
  if (!isCalendarEnabled()) return {status:"error",notice:"Lịch chưa được mở tại môi trường này."};
  // A committed retry must still be acknowledged after its start time passes.
  // Only an uncommitted new appointment must satisfy the future-time gate.
  const input = validateAppointment(form,new Date(),{allowPast:true});
  if (!input.ok) return {status:"error",notice:input.error};
  const viewer = await getWorkspaceViewer();
  if (viewer?.profile.role !== "pt") return {status:"error",notice:"Chỉ PT đang đăng nhập mới có thể xếp lịch."};
  const supabase = createClient();
  const {data:trainee,error:relationError} = await supabase.from("trainee_profiles")
    .select("id,profile_id").eq("id",input.traineeId).eq("assigned_pt_id",viewer.user.id).neq("status","archived").maybeSingle();
  if (relationError || !trainee?.profile_id) return {status:"error",notice:"Học viên chưa kết nối hoặc không còn thuộc danh sách của bạn."};
  function confirm(existing:Tables<"coaching_appointments">):AppointmentState {
    if (existing.trainee_id !== trainee!.id || existing.learner_id !== trainee!.profile_id || existing.title !== input.title || existing.kind !== input.kind
      || Date.parse(existing.starts_at) !== Date.parse(input.startsAt) || Date.parse(existing.ends_at) !== Date.parse(input.endsAt) || existing.status !== "scheduled") {
      return {status:"error",conflict:true,notice:"Lượt đặt này đã được dùng cho cuộc hẹn khác. Kiểm tra lịch trước khi bắt đầu lượt mới."};
    }
    return success();
  }
  function success():AppointmentState {
    revalidatePath("/workspace/calendar");
    return {status:"success",notice:"Đã thêm cuộc hẹn. Không trừ buổi PT.",nonce:input.nonce,week:scheduleWeek(getApplicationDate(input.startsAt))!.monday};
  }
  const lookup = () => supabase.from("coaching_appointments").select("*").eq("pt_id",viewer.user.id).eq("client_request_id",input.nonce).maybeSingle();
  const committed = await lookup();
  if (committed.error) return {status:"error",notice:"Chưa xác nhận được cuộc hẹn. Giữ nguyên thông tin và thử lại."};
  if (committed.data) return confirm(committed.data);
  if (Date.parse(input.startsAt) <= Date.now()) return {status:"error",notice:"Chọn thời gian bắt đầu trong tương lai."};
  const {error} = await supabase.from("coaching_appointments").insert({
    trainee_id:trainee.id, pt_id:viewer.user.id, learner_id:trainee.profile_id,
    client_request_id:input.nonce, title:input.title, kind:input.kind, starts_at:input.startsAt, ends_at:input.endsAt,
  });
  if (error?.code === "23505" || error?.code === "23P01") {
    const {data:existing} = await lookup();
    if (existing) return confirm(existing);
    else if (error.code === "23P01") return {status:"error",notice:"Khung giờ này trùng lịch PT hoặc học viên. Chọn giờ khác; lịch hiện có vẫn giữ nguyên."};
    else return {status:"error",notice:"Chưa xác nhận được cuộc hẹn. Giữ nguyên thông tin và thử lại."};
  } else if (error) return {status:"error",notice:"Chưa lưu được cuộc hẹn. Kiểm tra thời gian, kết nối với học viên rồi thử lại."};
  return success();
}
