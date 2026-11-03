"use client";
import { useEffect, useRef, useState } from "react";
const readings = [{day:"02/10",kg:72.1},{day:"09/10",kg:71.6},{day:"16/10",kg:71.0},{day:"23/10",kg:70.4}];
export default function WeightPlot() {
  const ref = useRef<SVGSVGElement>(null);
  const [width,setWidth] = useState(500);
  useEffect(() => { const el = ref.current; if (!el) return;const observer = new ResizeObserver(() => setWidth(Math.max(190,Math.round(el.getBoundingClientRect().width))));observer.observe(el);return () => observer.disconnect();},[]);
  const left=30,right=width-10,points=readings.map((r,i)=>[left+i*(right-left)/3,132-(r.kg-70)*40]);
  return <svg ref={ref} className="responsive-plot" viewBox={`0 0 ${width} 170`} role="img" aria-label="Cân nặng giả qua bốn lần đo tháng 10: 72,1; 71,6; 71,0 và 70,4 kg. Trục dọc thu gọn từ 70 đến 73 kg.">
    {[73,72,71,70].map((n,i)=><g key={n}><path className="grid" d={`M${left} ${12+i*40}H${right}`} /><text className="axis" x={0} y={17+i*40}>{n}</text></g>)}
    {readings.map((r,i)=><text key={r.day} className="axis" x={points[i][0]} y={163} textAnchor={i===0?"start":i===3?"end":"middle"}>{width<300?r.day.slice(0,2):r.day}</text>)}
    <path className="series" d={points.map((point,i)=>`${i?"L":"M"}${point[0]} ${point[1]}`).join(" ")} /><circle className="series-end" cx={points[3][0]} cy={points[3][1]} r={3.5} />
  </svg>;
}
