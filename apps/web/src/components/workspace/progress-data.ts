export function progressData<T extends {recorded_at:string;weight_kg:number}>(records:T[]) {
 const readings = [...records].sort((a,b)=>new Date(a.recorded_at).getTime()-new Date(b.recorded_at).getTime()).slice(-8);
 return {readings, latest:readings.at(-1), max:Math.ceil(Math.max(0,...readings.map(r=>r.weight_kg))/10)*10 || 10};
}

export function measurementPoints<T extends {recorded_at:string}>(readings:T[],metric:keyof T) {
 const values=readings.map(item=>Number(item[metric]));
 const ceiling=Math.ceil(Math.max(0,...values)/10)*10||10;
 const times=readings.map(item=>Date.parse(item.recorded_at));
 const span=(times.at(-1)??0)-(times[0]??0);
 return {ceiling,points:values.map((value,index)=>({x:span?5+(times[index]-times[0])*90/span:50,y:95-value/ceiling*85}))};
}
