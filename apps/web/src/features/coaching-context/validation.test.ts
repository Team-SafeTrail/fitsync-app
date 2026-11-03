import {describe,expect,it} from "vitest";
import {isMembershipDate,membershipStatus,validateMembership,validateNote} from "./validation";
const nonce="be000000-0000-0000-0000-000000000001";
describe("membership date semantics and private note inputs",()=>{
 it.each(["2026-02-30","2026-13-01","2026-01-01T00:00:00Z",null])("rejects invalid date-only input %s",value=>expect(isMembershipDate(value)).toBe(false));
 it("includes the final calendar day without using the host timezone",()=>expect(membershipStatus("2026-01-01","2026-10-30","2026-10-30")).toEqual({label:"Còn hiệu lực",days:1}));
 it("separates future and expired membership",()=>{expect(membershipStatus("2026-11-01","2026-12-01","2026-10-30").label).toBe("Chưa bắt đầu");expect(membershipStatus("2026-01-01","2026-10-29","2026-10-30").days).toBe(0);});
 it("rejects a reversed date range",()=>{const f=new FormData();for(const [k,v] of Object.entries({clientRequestId:nonce,revision:"0",label:"Gym",startsOn:"2026-12-01",endsOn:"2026-11-01"}))f.set(k,v);expect(validateMembership(f).ok).toBe(false);});
 it.each(["", "\u200b", "x".repeat(2001)])("rejects blank/invisible/oversized note %#",body=>{const f=new FormData();f.set("body",body);f.set("visibility","private");f.set("clientRequestId",nonce);expect(validateNote(f).ok).toBe(false);});
 it("does not accept an unspecified visibility",()=>{const f=new FormData();f.set("body","Advice");f.set("clientRequestId",nonce);expect(validateNote(f).ok).toBe(false);});
 it("preserves explicit private visibility",()=>{const f=new FormData();f.set("body","  Advice  ");f.set("clientRequestId",nonce);f.set("visibility","private");expect(validateNote(f)).toEqual({ok:true,body:"Advice",nonce,visibility:"private"});});
});
