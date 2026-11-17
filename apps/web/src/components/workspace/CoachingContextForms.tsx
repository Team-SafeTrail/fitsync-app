"use client";
import {useEffect,useState} from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {addCoachingNote,saveMembership} from "@/features/coaching-context/actions";
import {initialContextState,type ContextState} from "@/features/coaching-context/action-state";
import SubmitButton from "./SubmitButton";
import {usePreservedForm} from "./PreservedForm";

function useContextForm(action:(previous:ContextState,form:FormData)=>Promise<ContextState>,destination:string) {
  const {ref,onReset}=usePreservedForm();
  const [state,dispatch,pending]=useActionState(async(previous:ContextState,form:FormData):Promise<ContextState>=>{
    try{const result=await action(previous,form);if(result.status==="success"&&result.nonce===form.get("clientRequestId"))window.location.assign(destination);return result;}
    catch{return {status:"error",notice:"Kết nối bị gián đoạn. Thông tin vẫn ở đây; thử lại khi mạng ổn định."};}
  },initialContextState);
  const [nonce,setNonce]=useState("");
  useEffect(()=>setNonce(crypto.randomUUID()),[]);
  return {state,dispatch,nonce,ref,onReset,disabled:pending,renew:()=>setNonce(crypto.randomUUID())};
}
function FormFields({nonce,children,disabled=false}:{nonce:string;children:React.ReactNode;disabled?:boolean}) {
 const {pending}=useFormStatus();return <fieldset disabled={pending||!nonce||disabled}><input type="hidden" name="clientRequestId" value={nonce}/>{children}</fieldset>;
}
function Notice({state}:{state:ContextState}) {return state.notice?<p role={state.status==="error"?"alert":"status"}>{state.notice}</p>:null;}
export function CoachingNoteForm({traineeId,linked}:{traineeId:string;linked:boolean}) {
 const {state,dispatch,nonce,ref,onReset,renew,disabled}=useContextForm(addCoachingNote.bind(null,traineeId),`/workspace/trainees/${traineeId}#coaching-notes`);
 return <form action={dispatch} ref={ref} onReset={onReset} className="coaching-context-form" aria-label="Thêm ghi chú"><FormFields nonce={nonce} disabled={disabled}>
  <label htmlFor="coaching-note">Nội dung ghi chú</label><textarea id="coaching-note" name="body" maxLength={2000} rows={3} required placeholder="Điều cần nhớ trước buổi gặp, phản hồi hoặc điều chỉnh coaching…"/>
  <label htmlFor="coaching-note-visibility">Ai có thể đọc?</label><select id="coaching-note-visibility" name="visibility" defaultValue="private"><option value="private">Chỉ PT phụ trách</option>{linked&&<option value="shared">Chia sẻ với học viên này</option>}</select><p>Ghi chú mặc định là riêng tư. Chỉ nội dung bạn chọn chia sẻ mới hiển thị cho học viên.</p>
  <Notice state={state}/>{state.conflict&&<button type="button" onClick={renew}>Bắt đầu lượt lưu mới</button>}<SubmitButton idle="Lưu ghi chú" pending="Đang lưu ghi chú…"/>
 </FormFields></form>;
}
export function MembershipForm({traineeId,current}:{traineeId:string;current?:{label:string;starts_on:string;ends_on:string;revision:number}}) {
 const {state,dispatch,nonce,ref,onReset,disabled}=useContextForm(saveMembership.bind(null,traineeId),`/workspace/trainees/${traineeId}#membership`);
 return <form action={dispatch} ref={ref} onReset={onReset} className="coaching-context-form" aria-label="Điều chỉnh membership"><FormFields nonce={nonce} disabled={disabled}><input type="hidden" name="revision" value={current?.revision??0}/>
  <label htmlFor="membership-label">Tên membership</label><input id="membership-label" name="label" required maxLength={100} defaultValue={current?.label??""} placeholder="Ví dụ: Membership phòng tập"/>
  <div className="coaching-date-fields"><label>Ngày bắt đầu<input type="date" name="startsOn" required defaultValue={current?.starts_on??""}/></label><label>Ngày kết thúc<input type="date" name="endsOn" required defaultValue={current?.ends_on??""}/></label></div><p>Ngày kết thúc được tính bao gồm cả ngày đó. Lưu thời hạn không thay đổi số buổi PT.</p>
  <Notice state={state}/>{state.conflict&&<a href={`/workspace/trainees/${traineeId}#membership`}>Xem bản mới nhất trước khi nhập lại</a>}<SubmitButton idle="Lưu membership" pending="Đang lưu membership…"/>
 </FormFields></form>;
}
