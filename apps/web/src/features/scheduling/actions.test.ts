import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
vi.mock("next/cache",()=>({revalidatePath:vi.fn()}));
vi.mock("@/lib/supabase/server",()=>({createClient:vi.fn()}));
vi.mock("@/features/workspace/data",()=>({getWorkspaceViewer:vi.fn()}));
vi.mock("./config",()=>({isCalendarEnabled:vi.fn()}));
import {createClient} from "@/lib/supabase/server";
import {getWorkspaceViewer} from "@/features/workspace/data";
import {isCalendarEnabled} from "./config";
import {createAppointment} from "./actions";
import {initialAppointmentState} from "./action-state";

const student="ac000000-0000-0000-0000-000000000001";
const nonce="bd000000-0000-0000-0000-000000000001";
const input=()=>{
  const f=new FormData();
  for(const [key,value] of Object.entries({traineeId:student,clientRequestId:nonce,title:"Buổi tập",kind:"training",startLocal:"2026-11-01T09:00",endLocal:"2026-11-01T10:00",pt_id:"forged",learner_id:"forged"})) f.set(key,value);
  return f;
};
const saved={trainee_id:student,learner_id:"server-learner",title:"Buổi tập",kind:"training",starts_at:"2026-11-01T02:00:00Z",ends_at:"2026-11-01T03:00:00Z",status:"scheduled"};

function setup(existing:unknown=null, error:{code:string}|null=null, afterRace:unknown=null, linked=true) {
  const insert=vi.fn().mockResolvedValue({error});
  const read=vi.fn().mockResolvedValueOnce({data:existing,error:null}).mockResolvedValue({data:afterRace,error:null});
  const appointmentChain={eq:vi.fn().mockReturnThis(),maybeSingle:read};
  const relationChain={eq:vi.fn().mockReturnThis(),neq:vi.fn().mockReturnThis(),maybeSingle:vi.fn().mockResolvedValue({data:linked?{id:student,profile_id:"server-learner"}:null,error:null})};
  const from=vi.fn((table:string)=>table==="trainee_profiles"?{select:()=>relationChain}:{select:()=>appointmentChain,insert});
  vi.mocked(createClient).mockReturnValue({from} as unknown as ReturnType<typeof createClient>);
  return {insert,read,from};
}

describe("appointment authorization and idempotency",()=>{
  beforeEach(()=>{
    vi.resetAllMocks(); vi.useFakeTimers(); vi.setSystemTime(new Date("2026-10-30T12:00:00Z"));
    vi.mocked(isCalendarEnabled).mockReturnValue(true);
    vi.mocked(getWorkspaceViewer).mockResolvedValue({user:{id:"server-pt"},profile:{role:"pt"}} as NonNullable<Awaited<ReturnType<typeof getWorkspaceViewer>>>);
  });
  afterEach(()=>vi.useRealTimers());
  it("does not query identity or database when rollout is disabled",async()=>{
    vi.mocked(isCalendarEnabled).mockReturnValue(false);
    expect((await createAppointment(initialAppointmentState,input())).status).toBe("error");
    expect(getWorkspaceViewer).not.toHaveBeenCalled(); expect(createClient).not.toHaveBeenCalled();
  });
  it.each([null,{user:{id:"server-learner"},profile:{role:"trainee"}}])("rejects unauthenticated/learner actors %#",async(viewer)=>{
    vi.mocked(getWorkspaceViewer).mockResolvedValue(viewer as Awaited<ReturnType<typeof getWorkspaceViewer>>);
    expect((await createAppointment(initialAppointmentState,input())).status).toBe("error"); expect(createClient).not.toHaveBeenCalled();
  });
  it("rejects a missing linked relationship without inserting",async()=>{
    const {insert}=setup(null,null,null,false); expect((await createAppointment(initialAppointmentState,input())).status).toBe("error"); expect(insert).not.toHaveBeenCalled();
  });
  it("uses only server actor/relationship identities",async()=>{
    const {insert}=setup(); expect((await createAppointment(initialAppointmentState,input())).status).toBe("success");
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({pt_id:"server-pt",learner_id:"server-learner",trainee_id:student}));
  });
  it("acknowledges the identical committed request even after its start time passed",async()=>{
    vi.setSystemTime(new Date("2026-11-02T12:00:00Z")); const {insert}=setup(saved);
    expect((await createAppointment(initialAppointmentState,input())).status).toBe("success"); expect(insert).not.toHaveBeenCalled();
  });
  it("rejects a new backdated request without creating an appointment",async()=>{
    vi.setSystemTime(new Date("2026-11-02T12:00:00Z")); const {insert}=setup();
    expect((await createAppointment(initialAppointmentState,input())).notice).toContain("tương lai"); expect(insert).not.toHaveBeenCalled();
  });
  it("never silently reuses a committed nonce with changed content",async()=>{
    const {insert}=setup({...saved,title:"Previously saved"});
    expect((await createAppointment(initialAppointmentState,input())).conflict).toBe(true); expect(insert).not.toHaveBeenCalled();
  });
  it("resolves a concurrent identical nonce race to the committed result",async()=>{
    setup(null,{code:"23505"},saved); expect((await createAppointment(initialAppointmentState,input())).status).toBe("success");
  });
  it("reports real overlap without leaking raw database errors or claiming success",async()=>{
    setup(null,{code:"23P01"}); const result=await createAppointment(initialAppointmentState,input());
    expect(result.status).toBe("error"); expect(result.notice).toContain("trùng lịch"); expect(result.notice).not.toContain("23P01");
  });
});
