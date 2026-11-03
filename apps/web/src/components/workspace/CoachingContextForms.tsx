"use client";
import {useEffect,useRef,useState} from "react";
import {useFormState,useFormStatus} from "react-dom";
import {useRouter} from "next/navigation";
import {addCoachingNote,saveMembership} from "@/features/coaching-context/actions";
import {initialContextState,type ContextState} from "@/features/coaching-context/action-state";
import SubmitButton from "./SubmitButton";

function useContextForm(action:(previous:ContextState,form:FormData)=>Promise<ContextState>) {
  const [state,dispatch]=useFormState(async(previous:ContextState,form:FormData):Promise<ContextState>=>{try{return await action(previous,form);}catch{return {status:"error",notice:"Kết nối bị gián đoạn. Thông tin vẫn ở đây; thử lại khi mạng ổn định."};}},initialContextState);
  const [nonce,setNonce]=useState("");const ref=useRef<HTMLFormElement>(null);const router=useRouter();
  useEffect(()=>setNonce(crypto.randomUUID()),[]);
  useEffect(()=>{if(state.status==="success"&&state.nonce===nonce){ref.current?.reset();setNonce(crypto.randomUUID());router.refresh();}},[state,nonce,router]);
  return {state,dispatch,nonce,ref,renew:()=>setNonce(crypto.randomUUID())};
}
function FormFields({nonce,children}:{nonce:string;children:React.ReactNode}) {
 const {pending}=useFormStatus();return <fieldset disabled={pending||!nonce}><input type="hidden" name="clientRequestId" value={nonce}/>{children}</fieldset>;
}
function Notice({state}:{state:ContextState}) {return state.notice?<p role={state.status==="error"?"alert":"status"}>{state.notice}</p>:null;}
export function CoachingNoteForm({traineeId,linked}:{traineeId:string;linked:boolean}) {
 const {state,dispatch,nonce,ref,renew}=useContextForm(addCoachingNote.bind(null,traineeId));
 return <form action={dispatch} ref={ref} className="coaching-context-form" aria-label="Thêm ghi chú"><FormFields nonce={nonce}>
  <label htmlFor="coaching-note">Nội dung ghi chú</label><textarea id="coaching-note" name="body" maxLength={2000} rows={3} required placeholder="Điều cần nhớ trước buổi gặp, phản hồi hoặc điều chỉnh coaching…"/>
  <label htmlFor="coaching-note-visibility">Ai có thể đọc?</label><select id="coaching-note-visibility" name="visibility" defaultValue="private"><option value="private">Chỉ PT phụ trách</option>{linked&&<option value="shared">Chia sẻ với học viên này</option>}</select><p>Ghi chú mặc định là riêng tư. Chỉ nội dung bạn chọn chia sẻ mới hiển thị cho học viên.</p>
  <Notice state={state}/>{state.conflict&&<button type="button" onClick={renew}>Bắt đầu lượt lưu mới</button>}<SubmitButton idle="Lưu ghi chú" pending="Đang lưu ghi chú…"/>
 </FormFields></form>;
}
export function MembershipForm({traineeId,current}:{traineeId:string;current?:{label:string;starts_on:string;ends_on:string;revision:number}}) {
 const {state,dispatch,nonce,ref}=useContextForm(saveMembership.bind(null,traineeId));
 return <form action={dispatch} ref={ref} className="coaching-context-form" aria-label="Điều chỉnh membership"><FormFields nonce={nonce}><input type="hidden" name="revision" value={current?.revision??0}/>
  <label htmlFor="membership-label">Tên membership</label><input id="membership-label" name="label" required maxLength={100} defaultValue={current?.label??""} placeholder="Ví dụ: Membership phòng tập"/>
  <div className="coaching-date-fields"><label>Ngày bắt đầu<input type="date" name="startsOn" required defaultValue={current?.starts_on??""}/></label><label>Ngày kết thúc<input type="date" name="endsOn" required defaultValue={current?.ends_on??""}/></label></div><p>Ngày kết thúc được tính bao gồm cả ngày đó. Lưu thời hạn không thay đổi số buổi PT.</p>
  <Notice state={state}/>{state.conflict&&<a href={`/workspace/trainees/${traineeId}#membership`}>Xem bản mới nhất trước khi nhập lại</a>}<SubmitButton idle="Lưu membership" pending="Đang lưu membership…"/>
 </FormFields></form>;
}
