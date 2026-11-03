import {describe,expect,it} from "vitest";
import {progressData,measurementPoints} from "./progress-data";
const record=(day:number,kg:number)=>({recorded_at:`2026-10-${String(day).padStart(2,"0")}T10:00:00Z`,weight_kg:kg});
describe("progress data",()=>{
 it("keeps absent records absent instead of fabricating progress",()=>{expect(progressData([])).toEqual({readings:[],latest:undefined,max:10});});
 it("handles one measurement and a zero-based chart ceiling",()=>{const row=record(3,72);expect(progressData([row])).toEqual({readings:[row],latest:row,max:80});});
 it("orders chronologically, keeps eight most recent and never mutates source",()=>{const source=Array.from({length:10},(_,i)=>record(i+1,80-i)).reverse();const result=progressData(source);expect(result.readings).toHaveLength(8);expect(result.readings[0].recorded_at).toContain("10-03");expect(result.latest?.recorded_at).toContain("10-10");expect(source[0].recorded_at).toContain("10-10");expect(result.max).toBe(80);});
});
describe("measurement chart axes",()=>{
 it("spaces points by actual elapsed time",()=>{const rows=[record(1,70),record(2,71),record(10,72)];const {points}=measurementPoints(rows,"weight_kg");expect(points.map(p=>p.x)).toEqual([5,15,95]);});
 it("handles identical timestamps without division by zero",()=>{expect(measurementPoints([record(1,70),record(1,71)],"weight_kg").points.every(p=>p.x===50&&Number.isFinite(p.y))).toBe(true);});
 it("uses the selected metric rather than a weight scale for percentages",()=>{expect(measurementPoints([{recorded_at:record(1,70).recorded_at,percent_body_fat:21}],"percent_body_fat").ceiling).toBe(30);});
});
