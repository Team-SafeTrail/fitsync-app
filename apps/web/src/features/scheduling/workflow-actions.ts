"use server";
import {revalidatePath} from "next/cache";
import {createClient} from "@/lib/supabase/server";
import {getWorkspaceViewer} from "@/features/workspace/data";
import {isCalendarEnabled} from "./config";
import {vietnamAppointmentInstant} from "./validation";
import type {ContextState} from "@/features/coaching-context/action-state";

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function fail(notice:string,conflict=false):ContextState{return {status:"error",notice,conflict};}
function databaseError(code:string):ContextState{
 return fail(code==="40001"?"Lịch hoặc số buổi đã thay đổi. Tải bản mới nhất và xem lại trước khi gửi.":code==="23P01"?"Khung giờ đề nghị trùng lịch. Cuộc hẹn và yêu cầu vẫn được giữ nguyên.":code==="23505"?"Lượt xử lý đã được dùng hoặc đã có yêu cầu chờ. Tải lại để kiểm tra lịch sử.":code==="23514"?"Thời gian hoặc số buổi không phù hợp. Buổi chưa kết thúc không thể xác nhận hoàn thành; số dư không được âm.":"Chưa thực hiện được. Kiểm tra quyền, trạng thái hồ sơ và kết nối rồi thử lại.",["40001","23505"].includes(code));
}
function refresh(){revalidatePath("/workspace/calendar");revalidatePath("/workspace");revalidatePath("/workspace/trainees/[traineeId]","page");}
export async function changeAppointment(appointmentId:string,version:number,_previous:ContextState,form:FormData):Promise<ContextState>{
 if(!isCalendarEnabled()||!uuid.test(appointmentId))return fail("Lịch chưa sẵn sàng.");
 const viewer=await getWorkspaceViewer();if(!viewer||!["pt","trainee"].includes(viewer.profile.role))return fail("Đăng nhập lại để tiếp tục.");
 const kind=form.get("kind"),reason=String(form.get("reason")??"").trim(),nonce=String(form.get("nonce")??"");
 if(!["reschedule","cancel"].includes(String(kind))||reason.length<3||reason.length>500||!uuid.test(nonce))return fail("Chọn thao tác và nhập lý do từ 3 đến 500 ký tự.");
 const start=kind==="reschedule"?vietnamAppointmentInstant(form.get("startLocal")):undefined;
 const end=kind==="reschedule"?vietnamAppointmentInstant(form.get("endLocal")):undefined;
 if(kind==="reschedule"&&(!start||!end||Date.parse(end)<=Date.parse(start)||Date.parse(end)-Date.parse(start)>86400000))return fail("Nhập khung giờ hợp lệ theo giờ Việt Nam, tối đa 24 giờ.");
 const db=await createClient();
 const args={target_appointment:appointmentId,expected_version:version,change_kind:String(kind),change_reason:reason,request_nonce:nonce,...(start&&end?{proposed_start:start,proposed_end:end}:{})};
 const result=viewer.profile.role==="pt"?await db.rpc("change_coaching_appointment",args):await db.rpc("request_appointment_change",args);
 if(result.error)return databaseError(result.error.code);
 refresh();return {status:"success",nonce,notice:viewer.profile.role==="pt"?"Đã cập nhật cuộc hẹn và lưu lịch sử. Không tự trừ buổi.":"Đã gửi đề nghị. Khung giờ cũ giữ nguyên đến khi PT chấp nhận."};
}
export async function decideAppointmentRequest(requestId:string,version:number,_previous:ContextState,form:FormData):Promise<ContextState>{
 if(!isCalendarEnabled()||!uuid.test(requestId))return fail("Yêu cầu không hợp lệ.");
 const decision=String(form.get("decision")??""),nonce=String(form.get("nonce")??"");
 if(!["accepted","rejected","withdrawn"].includes(decision)||!uuid.test(nonce))return fail("Chọn quyết định hợp lệ.");
 const db=await createClient();
 const result=decision==="withdrawn"?await db.rpc("withdraw_appointment_change",{target_request:requestId,request_nonce:nonce}):await db.rpc("resolve_appointment_change",{target_request:requestId,decision,expected_version:version,request_nonce:nonce});
 if(result.error)return databaseError(result.error.code);
 refresh();return {status:"success",nonce,notice:decision==="accepted"?"Đã chấp nhận đề nghị và cập nhật lịch.":decision==="rejected"?"Đã từ chối đề nghị. Lịch cũ giữ nguyên.":"Đã rút đề nghị. Lịch cũ giữ nguyên."};
}
export async function completeAppointment(appointmentId:string,version:number,sessionVersion:number,_previous:ContextState,form:FormData):Promise<ContextState>{
 if(!isCalendarEnabled()||!uuid.test(appointmentId))return fail("Cuộc hẹn không hợp lệ.");
 const nonce=String(form.get("nonce")??""),reason=String(form.get("reason")??"").trim(),consume=form.get("consume");
 if(!uuid.test(nonce)||reason.length<3||reason.length>500||!["yes","no"].includes(String(consume))||form.get("confirmed")!=="on")return fail("Chọn rõ có trừ buổi, nhập lý do và xác nhận buổi đã hoàn thành.");
 const db=await createClient();const result=await db.rpc("complete_coaching_appointment",{target_appointment:appointmentId,expected_appointment_version:version,expected_session_version:sessionVersion,consume_session:consume==="yes",completion_reason:reason,request_nonce:nonce});
 if(result.error)return databaseError(result.error.code);
 refresh();return {status:"success",nonce,notice:consume==="yes"?"Đã xác nhận hoàn thành và trừ đúng 1 buổi.":"Đã xác nhận hoàn thành, không trừ buổi PT."};
}
export async function reverseCompletion(entryId:string,sessionVersion:number,_previous:ContextState,form:FormData):Promise<ContextState>{
 if(!uuid.test(entryId))return fail("Bút toán không hợp lệ.");
 const nonce=String(form.get("nonce")??""),reason=String(form.get("reason")??"").trim();
 if(!uuid.test(nonce)||reason.length<3||reason.length>500||form.get("confirmed")!=="on")return fail("Nhập lý do và xác nhận sửa sai; lịch sử cũ vẫn được giữ.");
 const db=await createClient();const result=await db.rpc("reverse_session_completion",{target_entry:entryId,expected_session_version:sessionVersion,change_reason:reason,request_nonce:nonce});
 if(result.error)return databaseError(result.error.code);
 refresh();return {status:"success",nonce,notice:"Đã ghi bút toán đảo xác nhận hoàn thành. Thao tác không chuyển hoặc hoàn tiền ngân hàng."};
}
