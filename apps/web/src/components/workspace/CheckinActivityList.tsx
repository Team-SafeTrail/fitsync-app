/* eslint-disable @next/next/no-img-element */
import { Camera, CheckCircle2, MessageSquareText } from "lucide-react";
import type { CheckinActivity } from "@/features/workspace/data";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "full",
  timeZone: "Asia/Ho_Chi_Minh",
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00+07:00`));
}
export default function CheckinActivityList({
  checkins,
  emptyMessage,
}: {
  checkins: CheckinActivity[];
  emptyMessage: string;
}) {
  if (checkins.length === 0) {
    return <div className="workspace-empty compact"><MessageSquareText size={28} /><h3>Chưa có check-in</h3><p>{emptyMessage}</p></div>;
  }

  return (
    <div className="workspace-activity-list">
      {checkins.map((checkin) => (
        <article className="workspace-activity" data-testid="checkin-activity" key={checkin.id}>
          <header>
            <span className="workspace-badge is-verified"><CheckCircle2 size={14} /> Đã check-in</span>
            <time dateTime={checkin.local_checkin_date}>{formatDate(checkin.local_checkin_date)}</time>
          </header>
          {checkin.note ? <p>{checkin.note}</p> : <p className="workspace-muted-copy">Không có ghi chú.</p>}
          {checkin.meal && (
            <figure className="workspace-meal-photo" data-testid="private-meal-photo">
              <img src={checkin.meal.signedUrl} alt={`Ảnh bữa ăn ngày ${formatDate(checkin.local_checkin_date)}`} />
              <figcaption><Camera size={14} /> Ảnh bữa ăn riêng tư, liên kết xem tự hết hạn.</figcaption>
            </figure>
          )}
        </article>
      ))}
    </div>
  );
}
