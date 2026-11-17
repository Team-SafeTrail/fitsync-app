"use client";
import {useActionState,useEffect,useState,type ReactNode} from "react";
import {changeAppointment,decideAppointmentRequest,completeAppointment,reverseCompletion} from "@/features/scheduling/workflow-actions";
import {initialContextState,type ContextState} from "@/features/coaching-context/action-state";
import type {Tables} from "@/types/database";
import {usePreservedForm,PendingFields} from "./PreservedForm";
import SubmitButton from "./SubmitButton";

type Action=(previous:ContextState,form:FormData)=>Promise<ContextState>;
function WorkflowForm({action,label,children}:{action:Action;label:string;children:ReactNode}){
 const preserved=usePreservedForm();const [nonce,setNonce]=useState("");
 useEffect(()=>setNonce(crypto.randomUUID()),[]);
 const [state,dispatch]=useActionState(async(previous:ContextState,form:FormData):Promise<ContextState>=>{
  try{const result=await action(previous,form);if(result.status==="success"){preserved.reset();setNonce(crypto.randomUUID());}return result;}
  catch{return {status:"error",notice:"Chưa nhận được xác nhận. Thông tin vẫn ở đây; kiểm tra lịch sử trước khi gửi lại."};}
 },initialContextState);
 return <form aria-label={label} className="coaching-context-form" action={dispatch} ref={preserved.ref} onReset={preserved.onReset}><PendingFields disabled={!nonce}>
  <input type="hidden" name="nonce" value={nonce}/>{children}
  {state.notice&&<p role={state.status==="error"?"alert":"status"}>{state.notice}</p>}
  {state.conflict&&<a href="">Tải bản mới nhất trước khi nhập lại</a>}
 </PendingFields></form>;
}
const states:Record<string,string>={pending:"Chờ PT xử lý",accepted:"Đã chấp nhận",rejected:"Đã từ chối",withdrawn:"Đã rút",stale:"Lịch đã thay đổi"};
const instant=(value:string)=>new Date(Date.parse(value)+7*3600000).toISOString().slice(0,16);
const display=(value:string)=>new Intl.DateTimeFormat("vi-VN",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit",timeZone:"Asia/Ho_Chi_Minh"}).format(new Date(value));

export default function AppointmentWorkflow({appointment,isPt,requests,completion,reversed,sessionVersion}:{
 appointment:Tables<"coaching_appointments">;isPt:boolean;requests:Tables<"appointment_change_requests">[];
 completion?:Pick<Tables<"session_ledger">,"id"|"delta">;reversed:boolean;sessionVersion:number;
}){
 const [kind,setKind]=useState("reschedule");const pending=requests.find(r=>r.state==="pending");
 const a=appointment;
 return <div className="appointment-workflow">
  {completion&&<p role="status"><strong>{reversed?"Đã đảo xác nhận hoàn thành":`Đã hoàn thành · ${completion.delta===-1?"Đã trừ 1 buổi PT":"Không trừ buổi PT"}`}</strong></p>}
  {requests.length>0&&<details><summary>Lịch sử đề nghị ({requests.length})</summary><ul>{requests.map(r=><li key={r.id}><strong>{states[r.state]??r.state}</strong> · {r.kind==="cancel"?"Hủy cuộc hẹn":`Đổi sang ${display(r.proposed_starts_at!)} – ${display(r.proposed_ends_at!)}`}<p>{r.reason}</p></li>)}</ul></details>}
  {pending&&a.status==="scheduled"&&!completion&&<section aria-label="Đề nghị đang chờ"><p>{pending.kind==="cancel"?"Học viên đề nghị hủy cuộc hẹn.":`Đề nghị đổi sang ${display(pending.proposed_starts_at!)} – ${display(pending.proposed_ends_at!)} (giờ Việt Nam).`}</p><p>{pending.reason}</p>
   <WorkflowForm key={pending.id} label="Xử lý đề nghị" action={decideAppointmentRequest.bind(null,pending.id,a.version)}>
    {isPt?<><button className="workspace-button" name="decision" value="accepted">Chấp nhận đề nghị</button><button className="workspace-button workspace-button-secondary" name="decision" value="rejected">Từ chối đề nghị</button></>:<button className="workspace-button workspace-button-secondary" name="decision" value="withdrawn">Rút đề nghị</button>}
   </WorkflowForm>
  </section>}
  {a.status==="scheduled"&&!completion&&(isPt||!pending)&&<details><summary>{isPt?"Đổi hoặc hủy cuộc hẹn":"Đề nghị đổi hoặc hủy"}</summary>
   <WorkflowForm key={`change-${a.version}`} label="Thay đổi cuộc hẹn" action={changeAppointment.bind(null,a.id,a.version)}>
    <label>Thao tác<select name="kind" value={kind} onChange={e=>setKind(e.target.value)}><option value="reschedule">Đổi thời gian</option><option value="cancel">Hủy cuộc hẹn</option></select></label>
    {kind==="reschedule"&&<div className="coaching-date-fields"><label>Bắt đầu mới<input type="datetime-local" name="startLocal" required defaultValue={instant(a.starts_at)}/></label><label>Kết thúc mới<input type="datetime-local" name="endLocal" required defaultValue={instant(a.ends_at)}/></label></div>}
    <label>Lý do thay đổi<textarea name="reason" minLength={3} maxLength={500} required rows={2}/></label>
    <p>Giờ Việt Nam (UTC+7). {isPt?"Thay đổi được lưu vào lịch sử; không tự trừ buổi hoặc hoàn tiền.":"Giữ lịch cũ cho tới khi PT chấp nhận. Gửi đề nghị chưa làm thay đổi cuộc hẹn."}</p>
    <SubmitButton idle={isPt?"Lưu thay đổi lịch":"Gửi đề nghị"} pending="Đang xử lý…"/>
   </WorkflowForm>
  </details>}
  {isPt&&a.status==="scheduled"&&!completion&&Date.parse(a.ends_at)<=Date.now()&&<details><summary>Xác nhận hoàn thành buổi</summary>
   <WorkflowForm label="Hoàn thành cuộc hẹn" action={completeAppointment.bind(null,a.id,a.version,sessionVersion)}>
    <label>Sử dụng buổi PT<select name="consume" required defaultValue=""><option value="" disabled>Chọn rõ cách ghi nhận</option><option value="yes">Trừ 1 buổi PT</option><option value="no">Không trừ buổi PT</option></select></label>
    <label>Ghi chú xác nhận<textarea name="reason" required minLength={3} maxLength={500} rows={2}/></label>
    <label><input type="checkbox" name="confirmed" required/> Tôi xác nhận buổi đã hoàn thành và đã đối chiếu số buổi với học viên.</label>
    <SubmitButton idle="Xác nhận hoàn thành" pending="Đang ghi nhận…"/>
   </WorkflowForm>
  </details>}
  {isPt&&completion&&!reversed&&<details><summary>Đảo xác nhận hoàn thành</summary><WorkflowForm label="Đảo buổi hoàn thành" action={reverseCompletion.bind(null,completion.id,sessionVersion)}>
   <label>Lý do sửa sai<textarea name="reason" required minLength={3} maxLength={500} rows={2}/></label><label><input type="checkbox" name="confirmed" required/> Tôi xác nhận sửa sai bằng bút toán đảo và giữ nguyên lịch sử.</label><p>Không chuyển hoặc hoàn tiền. Mỗi xác nhận chỉ được đảo một lần; tạo cuộc hẹn mới nếu cần ghi nhận một buổi khác.</p><SubmitButton idle="Ghi bút toán đảo buổi" pending="Đang ghi nhận…"/>
  </WorkflowForm></details>}
 </div>;
}
