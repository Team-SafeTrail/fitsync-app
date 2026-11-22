import {describe,it,expect} from "vitest";
import {simulationSummary} from "./simulation-summary";
import type {FinanceEntry} from "./live-data";
const row=(id:string,kind:FinanceEntry['kind'],amount:number,extra:Partial<FinanceEntry>={}):FinanceEntry=>({id,kind,amount_vnd:amount,category:"subscription",customer_id:"synthetic-pt",bank_reference:id,occurred_at:"2026-11-18T00:00:00Z",note:"TEST ONLY",is_test:true,reverses_id:null,evidence_path:"TEST.pdf",evidence_sha256:"0".repeat(64),...extra});
describe("isolated teaching finance summary",()=>{
 it("counts unique simulated buyers and excludes real entries",()=>{
  const result=simulationSummary([row("a","income",199000),row("b","income",199000),row("c","expense",40000,{customer_id:null,category:"hosting"}),row("real","income",999999,{is_test:false,customer_id:"actual-pt"})]);
  expect(result).toEqual({customers:1,revenue:398000,cost:40000,result:358000,visibleTestRows:3});
 });
 it("retains reversal rows while excluding both reversed income and costs from the scenario",()=>{
  const result=simulationSummary([row("a","income",199000),row("b","expense",40000,{customer_id:null,category:"tools"}),row("reverse-a","reversal",199000,{reverses_id:"a"}),row("reverse-b","reversal",40000,{reverses_id:"b"})]);
  expect(result).toEqual({customers:0,revenue:0,cost:0,result:0,visibleTestRows:4});
 });
});
