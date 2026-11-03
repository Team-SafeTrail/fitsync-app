"use client";
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";

export default function AccessibleModal({labelId,onClose,children,width=720}:{labelId:string;onClose:()=>void;children:ReactNode;width?:number}) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const dialog=ref.current,opener=document.activeElement as HTMLElement|null;if(!dialog)return;dialog.showModal();return()=>{dialog.close();if(opener?.isConnected)opener.focus({preventScroll:true});};},[]);
  function trap(event:KeyboardEvent<HTMLDialogElement>){if(event.key!=="Tab")return;const nodes=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]')).filter(el=>el.getClientRects().length);const first=nodes[0],last=nodes[nodes.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}
  return <dialog ref={ref} className="app-modal" style={{maxWidth:width}} aria-labelledby={labelId} onKeyDown={trap} onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target!==event.currentTarget)return;const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)onClose();}}>{children}</dialog>;
}
