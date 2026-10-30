export function progressData<T extends {recorded_at:string;weight_kg:number}>(records:T[]) {
 const readings = [...records].sort((a,b)=>new Date(a.recorded_at).getTime()-new Date(b.recorded_at).getTime()).slice(-8);
 return {readings, latest:readings.at(-1), max:Math.ceil(Math.max(0,...readings.map(r=>r.weight_kg))/10)*10 || 10};
}
