"use client";

import { useState } from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";

export default function ROICalculator() {
  const [clients, setClients] = useState(14);
  const [minutes, setMinutes] = useState(15);
  const [reduction, setReduction] = useState(50);
  const hours = (((clients * minutes * reduction) / 100) * 4.33) / 60;
  return (
    <section className="fs-container fs-estimator" id="time-saved">
      <div className="fs-estimator-intro">
        <Clock3 size={25} />
        <h2>
          Nếu có thêm thời gian,
          <br />
          bạn sẽ dành cho điều gì?
        </h2>
        <p>
          Tự điều chỉnh giả định để ước tính thời gian có thể dành lại cho việc
          huấn luyện.
        </p>
      </div>
      <div className="fs-estimator-controls">
        <label htmlFor="estimate-clients">
          Số học viên <strong>{clients}</strong>
        </label>
        <input
          id="estimate-clients"
          name="activeClients"
          type="range"
          min="1"
          max="50"
          value={clients}
          onChange={(event) => setClients(Number(event.target.value))}
        />
        <div className="fs-estimator-fields">
          <label htmlFor="estimate-minutes">
            Phút quản lý / học viên / tuần
            <input
              id="estimate-minutes"
              name="adminMinutesPerClient"
              type="number"
              inputMode="numeric"
              min="0"
              max="600"
              value={minutes}
              onChange={(event) =>
                setMinutes(
                  Math.max(0, Math.min(600, Number(event.target.value))),
                )
              }
            />
          </label>
          <label htmlFor="estimate-reduction">
            Mức giảm giả định (%)
            <input
              id="estimate-reduction"
              name="estimatedReduction"
              type="number"
              inputMode="numeric"
              min="0"
              max="100"
              value={reduction}
              onChange={(event) =>
                setReduction(
                  Math.max(0, Math.min(100, Number(event.target.value))),
                )
              }
            />
          </label>
        </div>
      </div>
      <div className="fs-estimator-result" aria-live="polite">
        <ArrowUpRight size={25} />
        <strong>
          {hours.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}
          <span>giờ</span>
        </strong>
        <p>có thể tiết kiệm mỗi tháng</p>
        <small>Ước tính minh họa, không phải cam kết.</small>
      </div>
      <details className="fs-estimator-formula">
        <summary>Cách tính ước lượng</summary>
        <p>
          Số học viên × phút quản lý mỗi tuần × tỷ lệ giảm giả định × 4,33 tuần
          ÷ 60. Thời gian tiết kiệm không đồng nghĩa với doanh thu tăng thêm.
        </p>
      </details>
    </section>
  );
}
