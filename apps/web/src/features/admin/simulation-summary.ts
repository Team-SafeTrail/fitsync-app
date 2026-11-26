import type {FinanceEntry} from "./live-data";
export function simulationSummary(entries:FinanceEntry[]){
 const reversed=new Set(entries.flatMap(e=>e.reverses_id?[e.reverses_id]:[]));
 const active=entries.filter(e=>e.is_test&&e.kind!=="reversal"&&!reversed.has(e.id));
 const revenue=active.filter(e=>e.kind==="income").reduce((sum,e)=>sum+e.amount_vnd,0);
 const cost=active.filter(e=>e.kind==="expense").reduce((sum,e)=>sum+e.amount_vnd,0);
 const customers=new Set(active.filter(e=>e.kind==="income"&&e.category==="subscription"&&e.customer_id).map(e=>e.customer_id)).size;
 return {customers,revenue,cost,result:revenue-cost,visibleTestRows:entries.filter(e=>e.is_test).length};
}
