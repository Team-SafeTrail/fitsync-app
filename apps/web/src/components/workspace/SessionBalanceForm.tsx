"use client";

import { useActionState,useEffect,useState } from "react";
import { updateRemainingSessions } from "@/features/workspace/actions";
import { initialWorkspaceActionState,type WorkspaceActionState } from "@/features/workspace/action-state";
import SubmitButton from "./SubmitButton";
import {PendingFields,usePreservedForm} from "./PreservedForm";

export default function SessionBalanceForm({
  traineeId,
  remainingSessions,
  totalSessions,
  version,
}: {
  traineeId: string;
  remainingSessions: number;
  totalSessions: number;
  version:number;
}) {
  const action = updateRemainingSessions.bind(null, traineeId,version);
  const preserved=usePreservedForm();const [nonce,setNonce]=useState("");useEffect(()=>setNonce(crypto.randomUUID()),[]);
  const [state, formAction] = useActionState(async(previous:WorkspaceActionState,form:FormData):Promise<WorkspaceActionState>=>{
    try{const result=await action(previous,form);if(result.status==="success"){preserved.reset();setNonce(crypto.randomUUID());}return result;}
    catch{return {status:"error",message:"Chưa xác nhận được lần lưu. Giữ thông tin và kiểm tra lịch sử trước khi gửi lại."};}
  }, initialWorkspaceActionState);

  return (
    <form action={formAction} className="workspace-session-form" ref={preserved.ref} onReset={preserved.onReset}><PendingFields disabled={!nonce}>
      <input type="hidden" name="nonce" value={nonce}/>
      <label htmlFor="remaining-session-balance">
        <span>Số buổi còn lại</span>
        <span className="workspace-session-input">
          <input
            id="remaining-session-balance"
            name="remainingSessions"
            type="number"
            min={0}
            max={totalSessions}
            step={1}
            defaultValue={remainingSessions}
            required
          />
          <span>/ {totalSessions}</span>
        </span>
      </label>
      <label>Lý do điều chỉnh số buổi<textarea name="reason" minLength={3} maxLength={500} required rows={2}/></label>
      <p>Số dư ban đầu được giữ làm mốc. Điều chỉnh có người thực hiện và lý do; không tạo lại các buổi đã xảy ra khi thiếu bằng chứng.</p>
      <SubmitButton idle="Cập nhật số buổi" pending="Đang cập nhật..." className="workspace-button workspace-button-secondary" />
      {state.message && <span className={`workspace-inline-status is-${state.status}`} role={state.status === "error" ? "alert" : "status"}>{state.message}</span>}
      {state.fieldErrors?.remainingSessions && <span className="workspace-field-error">{state.fieldErrors.remainingSessions}</span>}
    </PendingFields></form>
  );
}
