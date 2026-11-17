"use client";
import {useActionState} from "react";
import {updateNutritionDraft} from "@/features/workspace/actions";
import {initialWorkspaceActionState,type WorkspaceActionState} from "@/features/workspace/action-state";
import type {InBodyRecord} from "@/features/workspace/data";
import {PendingFields,usePreservedForm} from "./PreservedForm";
import SubmitButton from "./SubmitButton";
import {navigateAfterSave} from "./navigate-after-save";
export default function NutritionDraftForm({record,traineeId}:{record:InBodyRecord;traineeId:string}){
 const preserved=usePreservedForm();
 const [state,action,pending]=useActionState(async(previous:WorkspaceActionState,form:FormData):Promise<WorkspaceActionState>=>{
  try{const result=await updateNutritionDraft(record.id,traineeId,previous,form);if(result.status==="success")navigateAfterSave(`/workspace/trainees/${traineeId}?nutrition=updated#progress`);return result;}
  catch{return {status:"error",message:"Chưa xác nhận được lần lưu. Thông tin vẫn ở đây; kiểm tra lại trước khi gửi."};}
 },initialWorkspaceActionState);
 return <form action={action} ref={preserved.ref} onReset={preserved.onReset} className="workspace-nutrition-form"><PendingFields disabled={pending||state.status==="success"}>
  <label><span>Kcal</span><input name="targetCalories" type="number" min={800} max={6000} defaultValue={record.target_calories??""}/></label>
  <label><span>Protein (g)</span><input name="targetProteinGrams" type="number" min={0} max={500} defaultValue={record.target_protein_grams??""}/></label>
  <label><span>Carb (g)</span><input name="targetCarbGrams" type="number" min={0} max={1000} defaultValue={record.target_carb_grams??""}/></label>
  <label><span>Chất béo (g)</span><input name="targetFatGrams" type="number" min={0} max={300} defaultValue={record.target_fat_grams??""}/></label>
  <SubmitButton idle="Lưu bản nháp" pending="Đang lưu bản nháp…" className="workspace-button workspace-button-secondary"/>
  {state.status==="error"&&<p role="alert">{state.message}</p>}
 </PendingFields></form>;
}
