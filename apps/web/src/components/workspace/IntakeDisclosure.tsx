"use client";
import {useEffect,useState} from "react";
export default function IntakeDisclosure({children,defaultOpen}:{children:React.ReactNode;defaultOpen:boolean}) {
 const [open,setOpen]=useState(defaultOpen);
 useEffect(()=>{const reveal=()=>{if(location.hash==="#intake")setOpen(true);};reveal();window.addEventListener("hashchange",reveal);return()=>window.removeEventListener("hashchange",reveal);},[]);
 return <details id="intake" className="coaching-intake-disclosure" open={open} onToggle={event=>setOpen(event.currentTarget.open)}><summary>Thêm và đối chiếu bản ghi InBody</summary>{children}</details>;
}
