"use client";
import {useId,useState} from "react";
import {progressData,measurementPoints} from "./progress-data";
import type {InBodyRecord} from "@/features/workspace/data";

const metrics=[{key:"weight_kg",label:"Cân nặng",unit:"kg"},{key:"skeletal_muscle_mass_kg",label:"Khối cơ xương",unit:"kg"},{key:"percent_body_fat",label:"Tỷ lệ mỡ",unit:"%"}] as const;
export default function ProgressHistory({records}:{records:InBodyRecord[]}) {
  const [selected,setSelected]=useState<(typeof metrics)[number]["key"]>("weight_kg");
  const heading=useId(); const {readings,latest}=progressData(records);
  const metric=metrics.find(item=>item.key===selected)!;
  const date=(value:string)=>new Intl.DateTimeFormat("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric",timeZone:"Asia/Ho_Chi_Minh"}).format(new Date(value));
  if(!latest) return <section id="progress" className="workspace-progress" aria-labelledby={heading}><h2 id={heading}>Tiến trình của học viên</h2><p>Chưa có số đo được PT xác nhận. Biểu đồ sẽ xuất hiện khi có dữ liệu; không dùng số mẫu để thay thế.</p></section>;
  const {points,ceiling}=measurementPoints(readings,selected);
  const difference=latest[selected]-readings[0][selected];
  const chartLabel=metric.label+" qua "+readings.length+" lần ghi nhận. Trục dọc từ 0 đến "+ceiling+" "+metric.unit+"; trục ngang theo thời gian. Chi tiết ở bảng bên dưới.";
  return <section id="progress" className="workspace-progress" aria-labelledby={heading}>
    <div className="workspace-section-heading"><div><h2 id={heading}>Tiến trình qua các lần đo</h2><p>Số liệu đã được PT xác nhận. Ngày bên dưới là ngày ghi nhận trong FitSync.</p></div><div className="progress-latest"><strong>{latest[selected]} <small>{metric.unit}</small></strong><span>{date(latest.recorded_at)}</span></div></div>
    <div className="progress-metric-picker" role="group" aria-label="Chọn chỉ số biểu đồ">{metrics.map(item=><button key={item.key} type="button" aria-pressed={selected===item.key} onClick={()=>setSelected(item.key)}>{item.label}</button>)}</div>
    {readings.length>1?<><div className="progress-chart"><span>{ceiling} {metric.unit}</span><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={chartLabel}><path d="M0 10H100M0 52.5H100M0 95H100" fill="none" stroke="var(--color-border-default)" strokeWidth=".4"/><polyline points={points.map(p=>p.x+","+p.y).join(" ")} fill="none" stroke="var(--color-brand)" strokeWidth="2" vectorEffect="non-scaling-stroke"/>{points.map((point,index)=><circle key={readings[index].id} cx={point.x} cy={point.y} r="1.1" fill="var(--color-brand)"><title>{date(readings[index].recorded_at)}: {readings[index][selected]} {metric.unit}</title></circle>)}</svg><span>0 {metric.unit}</span></div><div className="progress-axis-labels"><time dateTime={readings[0].recorded_at}>{date(readings[0].recorded_at)}</time><time dateTime={latest.recorded_at}>{date(latest.recorded_at)}</time></div><p className="progress-range">{difference>0?"+":""}{Number(difference.toFixed(2))} {metric.unit==="%"?"điểm %":metric.unit} so với bản đầu trong khoảng đang xem · Tối đa 8 lần gần nhất.</p></>:<p>Đã có bản ghi đầu tiên. Cần thêm một lần đo để xem xu hướng.</p>}
    <details><summary>Xem số đo theo ngày</summary><div className="progress-data" role="region" aria-label="Chi tiết tiến trình" tabIndex={0}><table><caption>Số đo đã xác nhận, không phải mục tiêu hoặc dự báo</caption><thead><tr><th scope="col">Ngày ghi nhận</th><th scope="col">Cân nặng (kg)</th><th scope="col">Cơ xương (kg)</th><th scope="col">Tỷ lệ mỡ (%)</th></tr></thead><tbody>{readings.map(record=><tr key={record.id}><td>{date(record.recorded_at)}</td><td>{record.weight_kg}</td><td>{record.skeletal_muscle_mass_kg}</td><td>{record.percent_body_fat}</td></tr>)}</tbody></table></div></details>
  </section>;
}
