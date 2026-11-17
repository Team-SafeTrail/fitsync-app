"use client";
import {useActionState,useEffect,useRef} from "react";
import {updateNutritionDraft} from "@/features/workspace/actions";
import {initialWorkspaceActionState,type WorkspaceActionState} from "@/features/workspace/action-state";
import type {InBodyRecord} from "@/features/workspace/data";
import {PendingFields,usePreservedForm} from "./PreservedForm";
import SubmitButton from "./SubmitButton";
export default function NutritionDraftForm({record,traineeId}:{record:InBodyRecord;traineeId:string}){
 const preserved=usePreservedForm();const handled=useRef<WorkspaceActionState|null>(null);
 const [state,action]=useActionState(async(previous:WorkspaceActionState,form:FormData):Promise<WorkspaceActionState>=>{
  try{return await updateNutritionDraft(record.id,traineeId,previous,form);}
  catch{return {status:"error",message:"Chưa xác nhận được lần lưu. Thông tin vẫn ở đây; kiểm tra lại trước khi gửi."};}
 },initialWorkspaceActionState);
 useEffect(()=>{if(state.status==="success"&&handled.current!==state){handled.current=state;window.location.assign(`/workspace/trainees/${traineeId}?nutrition=updated#progress`);}},[state,traineeId]);
 return <form action={action} ref={preserved.ref} onReset={preserved.onReset} className="workspace-nutrition-form"><PendingFields>
  <label><span>Kcal</span><input name="targetCalories" type="number" min={800} max={6000} defaultValue={record.target_calories??""}/></label>
  <label><span>Protein (g)</span><input name="targetProteinGrams" type="number" min={0} max={500} defaultValue={record.target_protein_grams??""}/></label>
  <label><span>Carb (g)</span><input name="targetCarbGrams" type="number" min={0} max={1000} defaultValue={record.target_carb_grams??""}/></label>
  <label><span>Chất béo (g)</span><input name="targetFatGrams" type="number" min={0} max={300} defaultValue={record.target_fat_grams??""}/></label>
  <SubmitButton idle="Lưu bản nháp" pending="Đang lưu bản nháp…" className="workspace-button workspace-button-secondary"/>
  {state.status==="error"&&<p role="alert">{state.message}</p>}
 </PendingFields></form>;
}
