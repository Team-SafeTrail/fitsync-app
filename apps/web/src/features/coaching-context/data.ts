import "server-only";
import {cache} from "react";
import {getWorkspaceViewer} from "@/features/workspace/data";
import {createClient} from "@/lib/supabase/server";
import {isContextId} from "./validation";
export async function getCoachingContext(traineeId:string) {
  const viewer=await getWorkspaceViewer();
  if(!viewer||!isContextId(traineeId)||!["pt","trainee"].includes(viewer.profile.role)) return null;
  const db=createClient();
  const {data:t,error}=await db.from("trainee_profiles").select("id,profile_id,assigned_pt_id,status").eq("id",traineeId).maybeSingle();
  if(error||!t||t.status==="archived"||(viewer.profile.role==="pt"?t.assigned_pt_id!==viewer.user.id:t.profile_id!==viewer.user.id)) return null;
  return {viewer,db,trainee:t};
}

export const getCoachingProfileBundle=cache(async(traineeId:string)=>{
 const context=await getCoachingContext(traineeId);if(!context)return null;
 const [memberships,notes]=await Promise.all([context.db.from("coaching_membership_versions").select("*").eq("trainee_id",traineeId).order("revision",{ascending:false}).limit(10),context.db.from("coaching_notes").select("id,body,visibility,created_at").eq("trainee_id",traineeId).order("created_at",{ascending:false}).order("id",{ascending:false}).limit(51)]);
 return {context,memberships,notes};
});
