import {describe,expect,it} from "vitest";
import {validateAppointment,vietnamAppointmentInstant} from "./validation";

const id = "ac000000-0000-0000-0000-000000000001";
const now = new Date("2026-10-30T12:00:00Z");
function form() {
  const value = new FormData();
  for (const [key,item] of Object.entries({traineeId:id,clientRequestId:id,title:"Buổi tập",kind:"training",startLocal:"2026-11-01T09:00",endLocal:"2026-11-01T10:00"})) value.set(key,item);
  return value;
}
describe("Vietnam appointment boundaries",()=>{
  it("uses Vietnam offset across UTC date/year boundaries",()=>{
    expect(vietnamAppointmentInstant("2027-01-01T00:15")).toBe("2026-12-31T17:15:00.000Z");
  });
  it("does not inherit daylight-saving changes from the host",()=>{
    expect(vietnamAppointmentInstant("2026-11-01T01:30")).toBe("2026-10-31T18:30:00.000Z");
  });
  it.each(["2026-02-30T09:00","2026-13-01T09:00","2026-11-01T24:00","2026-11-01T09:00Z","2026-11-01T09:00:00+07:00","2026-11-01",null])("rejects invalid/ambiguous local input %s",value=>{
    expect(vietnamAppointmentInstant(value)).toBeNull();
  });
  it("accepts a training appointment without exercises or a fee classification",()=>{
    const result = validateAppointment(form(),now);
    expect(result.ok).toBe(true);
    if(result.ok) expect(result.startsAt).toBe("2026-11-01T02:00:00.000Z");
  });
  it("allows an overnight appointment",()=>{
    const input = form(); input.set("startLocal","2026-11-01T23:30"); input.set("endLocal","2026-11-02T00:30");
    expect(validateAppointment(input,now).ok).toBe(true);
  });
  it.each([
    ["startLocal","2026-10-30T18:00"],["endLocal","2026-11-01T09:00"],
    ["endLocal","2026-11-01T08:00"],["endLocal","2026-11-02T09:01"],
    ["kind","paid"],["traineeId","other-user"],["clientRequestId",""],["title","   "],
  ])("rejects invalid appointment boundary %s=%s",(key,value)=>{
    const input = form(); input.set(key,value);
    expect(validateAppointment(input,now).ok).toBe(false);
  });
});
