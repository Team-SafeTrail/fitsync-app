import {beforeEach,describe,expect,it,vi} from "vitest";
vi.mock("next/cache",()=>({revalidatePath:vi.fn()}));
vi.mock("./data",()=>({getChatContext:vi.fn()}));
vi.mock("./config",()=>({isChatEnabled:vi.fn()}));
import {getChatContext} from "./data";
import {isChatEnabled} from "./config";
import {sendChatMessage} from "./actions";
import {initialChatState} from "./action-state";

const id="ac000000-0000-0000-0000-000000000001";
const input=()=>{const f=new FormData();f.set("body","Hello");f.set("clientMessageId",id);f.set("sender_id","forged-user");return f;};
describe("chat authorization and safe retry",()=>{
 beforeEach(()=>{vi.resetAllMocks();vi.mocked(isChatEnabled).mockReturnValue(true);});
 it("does not access the database when disabled",async()=>{vi.mocked(isChatEnabled).mockReturnValue(false);expect((await sendChatMessage(id,initialChatState,input())).status).toBe("error");expect(getChatContext).not.toHaveBeenCalled();});
 it("rejects a missing participant context without inserting",async()=>{vi.mocked(getChatContext).mockResolvedValue(null);expect((await sendChatMessage(id,initialChatState,input())).status).toBe("error");});
 function setup(error: {code:string}|null, existing: unknown=null) {
  const insert=vi.fn().mockResolvedValue({error});
  const chain={eq:vi.fn().mockReturnThis(),maybeSingle:vi.fn().mockResolvedValue({data:existing})};
  const from=vi.fn().mockReturnValue({insert,select:vi.fn().mockReturnValue(chain)});
  vi.mocked(getChatContext).mockResolvedValue({supabase:{from},viewer:{user:{id:"server-user"}},trainee:{id,assigned_pt_id:"server-pt",profile_id:"server-learner"}} as unknown as NonNullable<Awaited<ReturnType<typeof getChatContext>>>);
  return insert;
 }
 it("binds author and PT from server context, ignoring submitted identity",async()=>{const insert=setup(null);expect((await sendChatMessage(id,initialChatState,input())).status).toBe("success");expect(insert).toHaveBeenCalledWith({trainee_id:id,pt_id:"server-pt",sender_id:"server-user",learner_id:"server-learner",client_message_id:id,body:"Hello"});});
 it("treats the same committed nonce/content as success",async()=>{setup({code:"23505"},{trainee_id:id,pt_id:"server-pt",learner_id:"server-learner",body:"Hello"});expect((await sendChatMessage(id,initialChatState,input())).status).toBe("success");});
 it("does not silently replace a committed message or reuse a nonce across threads",async()=>{setup({code:"23505"},{trainee_id:"other-thread",pt_id:"server-pt",learner_id:"server-learner",body:"Hello"});const result=await sendChatMessage(id,initialChatState,input());expect(result.status).toBe("error");expect(result.conflict).toBe(true);});
 it.each([{learner_id:"different-account",body:"Hello"},{learner_id:"server-learner",body:"Previously committed"}])("rejects mismatched committed recipient/body %#",async(existing)=>{setup({code:"23505"},{trainee_id:id,pt_id:"server-pt",...existing});expect((await sendChatMessage(id,initialChatState,input())).conflict).toBe(true);});
 it("keeps database errors private and reports no success",async()=>{setup({code:"42501"});const result=await sendChatMessage(id,initialChatState,input());expect(result.status).toBe("error");expect(result.notice).not.toContain("42501");});
});
