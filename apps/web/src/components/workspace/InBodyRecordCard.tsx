import { CheckCircle2 } from "lucide-react";
import { updateNutritionDraft } from "@/features/workspace/actions";
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
}: {
  record: InBodyRecord;
  traineeId: string;
  editableNutrition: boolean;
}) {
  const updateAction = updateNutritionDraft.bind(null, record.id, traineeId);
  return (
    <article className="workspace-record" data-testid="verified-record">
      <header>
        <div>
          <span className="workspace-badge is-verified"><CheckCircle2 size={14} /> Đã xác minh</span>
          <h3>{dateFormatter.format(new Date(record.recorded_at))}</h3>
        </div>
        <span className="workspace-record-source">Nhập thủ công</span>
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
        <form action={updateAction} className="workspace-nutrition-form">
          <label><span>Kcal</span><input name="targetCalories" type="number" min={800} max={6000} defaultValue={record.target_calories ?? ""} /></label>
          <label><span>Protein (g)</span><input name="targetProteinGrams" type="number" min={0} max={500} defaultValue={record.target_protein_grams ?? ""} /></label>
          <label><span>Carb (g)</span><input name="targetCarbGrams" type="number" min={0} max={1000} defaultValue={record.target_carb_grams ?? ""} /></label>
          <label><span>Chất béo (g)</span><input name="targetFatGrams" type="number" min={0} max={300} defaultValue={record.target_fat_grams ?? ""} /></label>
          <button className="workspace-button workspace-button-secondary" type="submit">Lưu bản nháp</button>
        </form>
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
