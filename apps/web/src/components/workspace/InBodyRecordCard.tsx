import { CheckCircle2 } from "lucide-react";
import NutritionDraftForm from "./NutritionDraftForm";
import type { InBodyRecord } from "@/features/workspace/data";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Ho_Chi_Minh",
});

function value(value: number | null, unit: string) {
  return value === null ? "Chưa đặt" : `${value} ${unit}`;
}

export default function InBodyRecordCard({
  record,
  traineeId,
  editableNutrition,
  compact = false,
}: {
  record: InBodyRecord;
  traineeId: string;
  editableNutrition: boolean;
  compact?: boolean;
}) {
  return (
    <article className={compact ? "workspace-record is-compact" : "workspace-record"} data-testid="verified-record">
      <header>
        <div>
          <span className="workspace-badge is-verified"><CheckCircle2 size={14} /> Đã xác minh</span>
          <h3>{dateFormatter.format(new Date(record.recorded_at))}</h3>
        </div>
        <span className="workspace-record-source">{record.source === "ocr" ? "OCR · PT đã kiểm tra" : "Nhập thủ công"}</span>
      </header>
      <dl className="workspace-record-metrics">
        <div><dt>Cân nặng</dt><dd>{record.weight_kg} kg</dd></div>
        <div><dt>Khối cơ xương</dt><dd>{record.skeletal_muscle_mass_kg} kg</dd></div>
        <div><dt>Khối mỡ</dt><dd>{record.body_fat_mass_kg} kg</dd></div>
        <div><dt>Tỷ lệ mỡ</dt><dd>{record.percent_body_fat}%</dd></div>
        <div><dt>Tổng nước</dt><dd>{value(record.total_body_water_liters, "L")}</dd></div>
      </dl>

      <div className="workspace-nutrition-heading">
        <div><h4>Mục tiêu dinh dưỡng</h4><span className="workspace-badge is-draft">Bản nháp coaching</span></div>
        <p>Có thể điều chỉnh bởi PT, không phải chỉ định y khoa.</p>
      </div>

      {editableNutrition ? (
        <NutritionDraftForm record={record} traineeId={traineeId}/>
      ) : (
        <dl className="workspace-nutrition-values">
          <div><dt>Năng lượng</dt><dd>{value(record.target_calories, "kcal")}</dd></div>
          <div><dt>Protein</dt><dd>{value(record.target_protein_grams, "g")}</dd></div>
          <div><dt>Carb</dt><dd>{value(record.target_carb_grams, "g")}</dd></div>
          <div><dt>Chất béo</dt><dd>{value(record.target_fat_grams, "g")}</dd></div>
        </dl>
      )}
    </article>
  );
}
