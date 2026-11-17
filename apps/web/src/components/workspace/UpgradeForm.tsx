"use client";
import { useState } from "react";
import { useFormState } from "react-dom";
import { requestUpgrade } from "@/features/billing/actions";
import { initialWorkspaceActionState } from "@/features/workspace/action-state";
import SubmitButton from "./SubmitButton";
export default function UpgradeForm() {
  const [state, action] = useFormState(requestUpgrade, initialWorkspaceActionState);
  const [nonce] = useState(() => crypto.randomUUID());
  return <form action={action} aria-label="Yêu cầu nâng cấp"><input name="nonce" type="hidden" value={nonce}/><label><input name="understood" type="checkbox" required/> Tôi hiểu giá 199.000đ/PT/tháng; gói chỉ được xác nhận sau khi admin đối chiếu giao dịch và chứng từ.</label><p><SubmitButton idle="Gửi yêu cầu nâng cấp" pending="Đang gửi yêu cầu…"/></p>{state.message && <p role={state.status === "error" ? "alert" : "status"}>{state.message}</p>}</form>;
}
