"use client";
import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { sendChatMessage } from "@/features/chat/actions";
import { initialChatState } from "@/features/chat/action-state";
import type { ChatState } from "@/features/chat/action-state";
import SubmitButton from "./SubmitButton";
import { usePreservedForm } from "./PreservedForm";

export default function ChatComposer({ traineeId, refreshAutomatically }: { traineeId: string; refreshAutomatically: boolean }) {
  const router = useRouter();
  const { onReset } = usePreservedForm();
  const [state, action] = useActionState(async (previous: ChatState, form: FormData): Promise<ChatState> => {
    try {
      const result = await sendChatMessage(traineeId, previous, form);
      if(result.status === "success" && result.nonce === form.get("clientMessageId")) {
        setBody(""); setNonce(crypto.randomUUID());
      }
      return result;
    }
    catch { return {status:"error",notice:"Kết nối bị gián đoạn. Tin đang soạn vẫn ở đây; thử gửi lại khi mạng ổn định."}; }
  }, initialChatState);
  const [body, setBody] = useState("");
  const [nonce, setNonce] = useState("");
  const navigated=useRef<string|undefined>(undefined);
  useEffect(() => setNonce(crypto.randomUUID()), []);
  useEffect(()=>{
    if(state.status==="success"&&state.nonce&&!refreshAutomatically&&navigated.current!==state.nonce){
      navigated.current=state.nonce;router.replace(`/workspace/chat/${traineeId}`);
    }
  },[state,refreshAutomatically,router,traineeId]);
  useEffect(() => {
    if (!refreshAutomatically) return;
    const refresh = () => { if (document.visibilityState === "visible") router.refresh(); };
    const timer = setInterval(refresh, 15000);
    window.addEventListener("focus", refresh); document.addEventListener("visibilitychange", refresh);
    return () => { clearInterval(timer); window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); };
  }, [refreshAutomatically, router]);
  return <div className="chat-composer">
    <button type="button" className="workspace-inline-link" onClick={() => router.refresh()}>Cập nhật cuộc trò chuyện</button>
    <form action={action} onReset={onReset}>
      <ComposerFields body={body} nonce={nonce} state={state} setBody={setBody} renewNonce={() => setNonce(crypto.randomUUID())} />
    </form>
  </div>;
}

function ComposerFields({body, nonce, state, setBody, renewNonce}: {
  body: string; nonce: string; state: ChatState; setBody: (value:string) => void; renewNonce: () => void;
}) {
  const {pending} = useFormStatus();
  return <fieldset disabled={pending || !nonce}>
    <input type="hidden" name="clientMessageId" value={nonce} />
    <label htmlFor="chat-message">Tin nhắn</label>
    <textarea id="chat-message" name="body" value={body} onChange={event => setBody(event.target.value)} maxLength={4000} required rows={3} aria-describedby="chat-help" />
    <p id="chat-help">Tối đa 4.000 ký tự. Tin nhắn chỉ hiển thị cho PT và học viên đang liên kết. Chưa hỗ trợ ảnh hoặc gửi thông báo ngoài ứng dụng.</p>
    {state.notice && <p role={state.status === "error" ? "alert" : "status"}>{state.notice}</p>}
    {state.conflict && <button type="button" className="workspace-button workspace-button-secondary" onClick={renewNonce}>Bắt đầu lượt gửi mới</button>}
    <SubmitButton idle="Gửi tin nhắn" pending="Đang gửi…" />
  </fieldset>;
}
