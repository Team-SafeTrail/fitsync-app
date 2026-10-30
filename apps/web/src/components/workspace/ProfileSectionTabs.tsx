"use client";
import {useEffect,useId,useRef,useState} from "react";
type Section={id:string;label:string;content:React.ReactNode};
const hashSection:Record<string,string>={overview:"overview","checkin-history-title":"overview",progress:"progress","record-history-title":"progress",membership:"membership","pt-sessions":"membership","coaching-notes":"notes",intake:"intake","inbody-form-title":"intake"};
export default function ProfileSectionTabs({sections}:{sections:Section[]}) {
 const [active,setActive]=useState("overview");const prefix=useId();const buttons=useRef<(HTMLButtonElement|null)[]>([]);
 useEffect(()=>{const reveal=()=>{const section=hashSection[location.hash.slice(1)];if(section)setActive(section);};reveal();window.addEventListener("hashchange",reveal);return()=>window.removeEventListener("hashchange",reveal);},[]);
 function choose(index:number,focus=false) {const item=sections[index];setActive(item.id);history.replaceState(null,"",`#${item.id==="notes"?"coaching-notes":item.id}`);if(focus)buttons.current[index]?.focus();}
 return <div className="dossier-tabs"><div className="dossier-section-nav" role="tablist" aria-label="Nội dung hồ sơ">{sections.map((section,index)=><button key={section.id} ref={node=>{buttons.current[index]=node;}} id={`${prefix}-tab-${section.id}`} role="tab" type="button" aria-selected={active===section.id} aria-controls={`${prefix}-panel-${section.id}`} tabIndex={active===section.id?0:-1} onClick={()=>choose(index)} onKeyDown={event=>{let next=index;if(event.key==="ArrowRight")next=(index+1)%sections.length;else if(event.key==="ArrowLeft")next=(index+sections.length-1)%sections.length;else if(event.key==="Home")next=0;else if(event.key==="End")next=sections.length-1;else return;event.preventDefault();choose(next,true);}}>{section.label}</button>)}</div>
  {sections.map(section=><div key={section.id} id={`${prefix}-panel-${section.id}`} role="tabpanel" aria-labelledby={`${prefix}-tab-${section.id}`} hidden={active!==section.id} tabIndex={0}>{section.content}</div>)}
 </div>;
}
