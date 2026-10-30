"use server";
import {revalidatePath} from "next/cache";
import {getCoachingContext} from "./data";
import {isCoachingContextEnabled} from "./config";
import {validateMembership,validateNote} from "./validation";
import type {ContextState} from "./action-state";

function refresh(traineeId:string) {revalidatePath(`/workspace/trainees/${traineeId}`);revalidatePath("/workspace");}
export async function addCoachingNote(traineeId:string,_previous:ContextState,form:FormData):Promise<ContextState> {
  if(!isCoachingContextEnabled()) return {status:"error",notice:"Ghi chú chưa được mở tại môi trường này."};
  const input=validateNote(form);if(!input.ok) return {status:"error",notice:input.error};
  const context=await getCoachingContext(traineeId);
  if(!context||context.viewer.profile.role!=="pt") return {status:"error",notice:"Chỉ PT phụ trách mới có thể ghi chú."};
  const {db,viewer,trainee:t}=context;
  if(input.visibility==="shared"&&!t.profile_id) return {status:"error",notice:"Học viên cần kết nối tài khoản trước khi nhận ghi chú chia sẻ."};
  const {error}=await db.from("coaching_notes").insert({trainee_id:t.id,pt_id:viewer.user.id,learner_id:t.profile_id,client_request_id:input.nonce,body:input.body,visibility:input.visibility});
  if(error?.code==="23505") {
    const {data:existing}=await db.from("coaching_notes").select("trainee_id,learner_id,body,visibility").eq("pt_id",viewer.user.id).eq("client_request_id",input.nonce).maybeSingle();
    if(!existing||existing.trainee_id!==t.id||existing.learner_id!==t.profile_id||existing.body!==input.body||existing.visibility!==input.visibility) return {status:"error",conflict:true,notice:"Lượt lưu đã được dùng. Kiểm tra ghi chú trước khi bắt đầu lượt mới."};
  } else if(error) return {status:"error",notice:"Chưa lưu được ghi chú. Nội dung vẫn ở đây; hãy thử lại."};
  refresh(traineeId);return {status:"success",notice:input.visibility==="shared"?"Đã lưu ghi chú chia sẻ với học viên.":"Đã lưu ghi chú riêng của PT.",nonce:input.nonce};
}
export async function saveMembership(traineeId:string,_previous:ContextState,form:FormData):Promise<ContextState> {
  if(!isCoachingContextEnabled()) return {status:"error",notice:"Membership chưa được mở tại môi trường này."};
  const input=validateMembership(form);if(!input.ok) return {status:"error",notice:input.error};
  const context=await getCoachingContext(traineeId);
  if(!context||context.viewer.profile.role!=="pt"||!context.trainee.profile_id) return {status:"error",notice:"Chỉ PT phụ trách học viên đã kết nối mới có thể lưu membership."};
  const {error}=await context.db.rpc("save_coaching_membership",{target_trainee:traineeId,request_id:input.nonce,membership_label:input.label,starts_on:input.starts,ends_on:input.ends,expected_revision:input.revision});
  if(error) return {status:"error",conflict:["40001","23505"].includes(error.code),notice:error.code==="40001"?"Membership đã thay đổi ở nơi khác. Xem bản mới nhất trước khi sửa lại.":error.code==="23505"?"Lượt lưu đã được dùng. Kiểm tra membership trước khi bắt đầu lượt mới.":"Chưa lưu được membership. Thông tin vẫn ở đây; kiểm tra rồi thử lại."};
  refresh(traineeId);return {status:"success",notice:"Đã lưu thời hạn membership. Số buổi PT không thay đổi.",nonce:input.nonce};
}
