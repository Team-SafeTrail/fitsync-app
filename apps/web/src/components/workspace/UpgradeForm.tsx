"use client";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import { requestUpgrade } from "@/features/billing/actions";
import { initialWorkspaceActionState } from "@/features/workspace/action-state";
import SubmitButton from "./SubmitButton";
import { PendingFields, usePreservedForm } from "./PreservedForm";
export default function UpgradeForm() {
  const [state, action] = useActionState(requestUpgrade, initialWorkspaceActionState);
  const [nonce,setNonce] = useState("");
  const preserved=usePreservedForm();
  useEffect(()=>setNonce(crypto.randomUUID()),[]);
  return <form ref={preserved.ref} onReset={preserved.onReset} action={action} aria-label="Yêu cầu nâng cấp"><PendingFields disabled={!nonce}><input name="nonce" type="hidden" value={nonce}/><label><input name="understood" type="checkbox" required/> Tôi hiểu giá 199.000đ/PT/tháng; gói chỉ được xác nhận sau khi admin đối chiếu giao dịch và chứng từ.</label><p><SubmitButton idle="Gửi yêu cầu nâng cấp" pending="Đang gửi yêu cầu…"/></p>{state.message && <p role={state.status === "error" ? "alert" : "status"}>{state.message}</p>}</PendingFields></form>;
}
