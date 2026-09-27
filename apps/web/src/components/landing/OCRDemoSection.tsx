"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ScanLine,
  RotateCcw,
  SlidersHorizontal,
  FileCheck2,
} from "lucide-react";
import { scanFixtures } from "@/lib/mock-data";
import { computeNutrition } from "@/lib/utils";

const samples = ["InBody 270", "InBody 370", "Xiaomi Scale 2"];

export default function OCRDemoSection() {
  const [sample, setSample] = useState(0);
  const [stage, setStage] = useState<"ready" | "scanning" | "review">("ready");
  const [weight, setWeight] = useState(
    String(scanFixtures[0].biometrics.weight_kg),
  );
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fixture = scanFixtures[sample];
  const numericWeight = Number(weight);
  const valid =
    weight.trim() !== "" &&
    Number.isFinite(numericWeight) &&
    numericWeight >= 20 &&
    numericWeight <= 300;
  const nutrition = valid
    ? computeNutrition(
        { ...fixture.biometrics, weight_kg: numericWeight },
        fixture.client_profile.gender,
        fixture.client_profile.age,
        fixture.client_profile.height_cm,
        fixture.client_profile.goal,
      )
    : null;
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function reset(index = sample) {
    if (timer.current) clearTimeout(timer.current);
    setSample(index);
    setWeight(String(scanFixtures[index].biometrics.weight_kg));
    setStage("ready");
  }
  function scan() {
    if (timer.current) clearTimeout(timer.current);
    setStage("scanning");
    timer.current = setTimeout(() => setStage("review"), 1200);
  }
  return (
    <section id="demo" className="fs-section fs-demo-section">
      <div className="fs-container">
        <div className="fs-section-heading">
          <p className="fs-eyebrow">TỪ TRANG GIẤY ĐẾN TIẾN TRÌNH</p>
          <h2>
            Chỉ số có ý nghĩa.
            <br />
            <span>Khi bạn có thể hành động.</span>
          </h2>
          <p>
            Thử một phiếu mẫu. Kiểm tra lại chỉ số. Xem mục tiêu thay đổi ngay
            khi bạn điều chỉnh.
          </p>
        </div>
        <div className="fs-demo-shell">
          <div className="fs-demo-toolbar">
            <div className="fs-sample-buttons" aria-label="Chọn phiếu mẫu">
              {samples.map((label, i) => (
                <button
                  key={label}
                  aria-pressed={sample === i}
                  onClick={() => reset(i)}
                >
                  {label}
                </button>
              ))}
            </div>
            <span>
              <ScanLine size={14} /> Demo mô phỏng
            </span>
          </div>
          <div className="fs-demo-grid">
            <div className="fs-paper-stage">
              <div
                className={`fs-scan-paper ${stage === "scanning" ? "is-scanning" : ""}`}
              >
                <div className="fs-paper-header">
                  <strong>Body composition</strong>
                  <span>PHIẾU MINH HỌA / {samples[sample]}</span>
                </div>
                <div className="fs-paper-meta">
                  <span>HỒ SƠ MẪU {String(sample + 1).padStart(2, "0")}</span>
                  <span>{fixture.client_profile.age} tuổi</span>
                </div>
                <div className="fs-paper-reading">
                  <span>Cân nặng</span>
                  <strong>
                    {fixture.biometrics.weight_kg}
                    <small> kg</small>
                  </strong>
                </div>
                <div className="fs-paper-reading">
                  <span>Khối lượng cơ</span>
                  <strong>
                    {fixture.biometrics.skeletal_muscle_mass_kg}
                    <small> kg</small>
                  </strong>
                </div>
                <div className="fs-paper-reading">
                  <span>Tỷ lệ mỡ</span>
                  <strong>
                    {fixture.biometrics.percent_body_fat}
                    <small> %</small>
                  </strong>
                </div>
                <div className="fs-paper-chart" aria-hidden="true">
                  {[46, 71, 58, 83, 64, 90, 75, 66, 82, 69, 57, 77].map(
                    (height, i) => (
                      <span key={i} style={{ height: `${height}%` }} />
                    ),
                  )}
                </div>
                <p>Phiếu tổng hợp minh họa, không phải kết quả đo thực tế.</p>
                {stage === "scanning" && <span className="fs-scan-beam" />}
              </div>
              <span className="fs-paper-caption">
                <FileCheck2 size={14} /> Không cần tải lên dữ liệu cá nhân
              </span>
            </div>
            <div className="fs-demo-results" aria-busy={stage === "scanning"}>
              <div className="fs-demo-step">
                <span className="fs-step-number">
                  {stage === "review" ? "02" : "01"}
                </span>
                <span>
                  {stage === "review"
                    ? "KIỂM TRA & ĐIỀU CHỈNH"
                    : "BẮT ĐẦU VỚI MỘT PHIẾU MẪU"}
                </span>
              </div>
              <h3>
                {stage === "review"
                  ? "Bạn luôn là người xác nhận."
                  : "Bớt nhập liệu. Thêm thấu hiểu."}
              </h3>
              <p className="fs-demo-explanation">
                {stage === "review"
                  ? "Thay đổi cân nặng để xem phép tính mục tiêu cập nhật. Coach kiểm tra trước khi sử dụng."
                  : "Khám phá cách chỉ số trên phiếu trở thành thông tin dễ theo dõi trong hồ sơ học viên."}
              </p>
              {stage === "review" ? (
                <>
                  <div className="fs-verified">
                    <Check size={14} /> Đã nạp dữ liệu minh họa
                  </div>
                  <label className="fs-weight-label" htmlFor="demo-weight">
                    Cân nặng{" "}
                    <span>
                      Có thể chỉnh sửa <SlidersHorizontal size={12} />
                    </span>
                  </label>
                  <div className="fs-weight-input">
                    <input
                      id="demo-weight"
                      name="sampleWeight"
                      aria-label="Cân nặng"
                      type="number"
                      inputMode="decimal"
                      min="20"
                      max="300"
                      step="0.1"
                      value={weight}
                      aria-invalid={!valid}
                      aria-describedby={!valid ? "weight-error" : undefined}
                      onChange={(event) => setWeight(event.target.value)}
                    />
                    <span>kg</span>
                  </div>
                  {!valid && (
                    <p id="weight-error" className="fs-field-error">
                      Nhập cân nặng từ 20 đến 300 kg để tiếp tục.
                    </p>
                  )}
                  <div className="fs-nutrition-result" aria-live="polite">
                    <div>
                      <span>Năng lượng mẫu</span>
                      <strong>
                        {nutrition?.target_calories_kcal.toLocaleString(
                          "vi-VN",
                        ) ?? "Chưa có"}
                        <small> kcal/ngày</small>
                      </strong>
                    </div>
                    <div>
                      <span>Protein mẫu</span>
                      <strong>
                        {nutrition?.protein_grams ?? "Chưa có"}
                        <small> g/ngày</small>
                      </strong>
                    </div>
                  </div>
                  <div className="fs-demo-result-actions">
                    <Link className="fs-text-link" href="/app/dashboard">
                      Khám phá hồ sơ mẫu <ArrowUpRight size={16} />
                    </Link>
                    <button className="fs-reset" onClick={() => reset()}>
                      <RotateCcw size={14} /> Làm lại
                    </button>
                  </div>
                </>
              ) : (
                <div className="fs-demo-start">
                  <div className="fs-process-items">
                    <span>
                      <ScanLine size={19} /> Đọc phiếu
                    </span>
                    <ArrowRight size={14} />
                    <span>
                      <SlidersHorizontal size={19} /> Kiểm tra
                    </span>
                    <ArrowRight size={14} />
                    <span>
                      <Check size={19} /> Theo dõi
                    </span>
                  </div>
                  <button
                    className="fs-button"
                    onClick={scan}
                    disabled={stage === "scanning"}
                  >
                    {stage === "scanning"
                      ? "Đang mô phỏng đọc phiếu…"
                      : "Thử đọc phiếu mẫu"}
                    <ArrowRight size={17} />
                  </button>
                  <span className="fs-scan-status" role="status">
                    {stage === "scanning"
                      ? "Đang chuẩn bị dữ liệu minh họa."
                      : "Không cần tài khoản. Có thể thử lại bất cứ lúc nào."}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="fs-demo-disclaimer">
            Bản mô phỏng dùng dữ liệu có sẵn, không thực hiện OCR trực tiếp. Kết
            quả tính chỉ dùng để khám phá giao diện. Định hướng MVP hỗ trợ
            InBody 270, 370, 570, Xiaomi Smart Scale 2 và Eufy Smart Scale P2.
          </div>
        </div>
      </div>
    </section>
  );
}
