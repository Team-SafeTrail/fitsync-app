"use client";
import {useEffect,useRef} from "react";

export default function ChatHistoryViewport({children,revision,latest}:{children:React.ReactNode;revision?:string;latest:boolean}) {
  const region=useRef<HTMLElement>(null);
  const follow=useRef(true);
  const previousMode=useRef<boolean|null>(null);
  useEffect(()=>{
    const node=region.current; if(!node) return;
    const changed=previousMode.current!==latest;
    if(changed) {node.scrollTop=latest?node.scrollHeight:0; follow.current=latest; previousMode.current=latest;}
    else if(latest&&follow.current) node.scrollTop=node.scrollHeight;
  },[revision,latest]);
  return <section ref={region} className="chat-history" aria-label="Lịch sử tin nhắn" tabIndex={0} onScroll={event=>{const node=event.currentTarget;follow.current=node.scrollHeight-node.scrollTop-node.clientHeight<64;}}>{children}</section>;
}
