"use client";
import {useEffect,useRef,useState} from "react";
import {useFormState,useFormStatus} from "react-dom";
import {useRouter} from "next/navigation";
import {createAppointment} from "@/features/scheduling/actions";
import {initialAppointmentState,type AppointmentState} from "@/features/scheduling/action-state";
import SubmitButton from "./SubmitButton";

type Choice = {id:string;display_name:string};
export default function AppointmentForm({trainees,selected}:{trainees:Choice[];selected?:string}) {
  const [state,action] = useFormState(async (previous:AppointmentState, form:FormData):Promise<AppointmentState> => {
    try {return await createAppointment(previous,form);}
    catch {return {status:"error",notice:"Kết nối bị gián đoạn. Thông tin vẫn ở đây; thử lại để xác nhận cuộc hẹn."};}
  },initialAppointmentState);
  const [nonce,setNonce] = useState("");
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  useEffect(()=>setNonce(crypto.randomUUID()),[]);
  useEffect(()=>{
    if(state.status === "success" && state.nonce === nonce && state.week) {
      ref.current?.reset(); setNonce(crypto.randomUUID());
      router.replace(`/workspace/calendar?week=${state.week}`); router.refresh();
    }
  },[state,nonce,router]);
  return <form ref={ref} action={action} className="appointment-form" aria-label="Xếp cuộc hẹn">
    <Fields trainees={trainees} selected={selected} nonce={nonce} state={state} renewNonce={()=>setNonce(crypto.randomUUID())}/>
  </form>;
}

function Fields({trainees,selected,nonce,state,renewNonce}:{trainees:Choice[];selected?:string;nonce:string;state:AppointmentState;renewNonce:()=>void}) {
  const {pending} = useFormStatus();
  return <fieldset disabled={pending || !nonce}>
    <input type="hidden" name="clientRequestId" value={nonce}/>
    <label htmlFor="appointment-trainee">Học viên</label><select id="appointment-trainee" name="traineeId" required defaultValue={trainees.some(item=>item.id===selected)?selected:""}><option value="" disabled>Chọn học viên đã kết nối</option>{trainees.map(item=><option key={item.id} value={item.id}>{item.display_name}</option>)}</select>
    <label htmlFor="appointment-title">Tên cuộc hẹn</label><input id="appointment-title" name="title" required maxLength={100} defaultValue="Buổi tập"/>
    <label htmlFor="appointment-kind">Loại cuộc hẹn</label><select id="appointment-kind" name="kind" defaultValue="training"><option value="training">Buổi tập</option><option value="consultation">Tư vấn</option></select>
    <p id="appointment-timezone">Giờ Việt Nam (UTC+7). Không bắt buộc giáo án. Mỗi cuộc hẹn tối đa 24 giờ.</p>
    <label htmlFor="appointment-start">Bắt đầu</label><input id="appointment-start" name="startLocal" type="datetime-local" required aria-describedby="appointment-timezone"/>
    <label htmlFor="appointment-end">Kết thúc</label><input id="appointment-end" name="endLocal" type="datetime-local" required aria-describedby="appointment-timezone"/>
    {state.notice && <p role={state.status==="error"?"alert":"status"}>{state.notice}</p>}
    {state.conflict && <button type="button" className="workspace-inline-link" onClick={renewNonce}>Bắt đầu lượt đặt mới</button>}
    <SubmitButton idle="Thêm cuộc hẹn" pending="Đang lưu cuộc hẹn…"/>
  </fieldset>;
}
