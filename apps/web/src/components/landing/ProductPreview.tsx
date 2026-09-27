"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Bell,
  ChevronRight,
  ClipboardCheck,
  Droplets,
  LayoutDashboard,
  ScanLine,
  ShieldCheck,
  Users,
  Activity,
  Smartphone,
} from "lucide-react";

const people = [
  {
    name: "Khánh Linh",
    initials: "KL",
    goal: "Giảm mỡ bền vững",
    status: "Đã xác minh",
    sessions: 8,
    summary: "59,8 kg · 28,4% mỡ · Xác nhận 27/09/2026",
  },
  {
    name: "Minh Khoa",
    initials: "MK",
    goal: "Tăng cơ",
    status: "Đã kết nối",
    sessions: 12,
    summary: "Đang chờ PT tạo bản ghi InBody đầu tiên",
  },
  {
    name: "Hoàng Nam",
    initials: "HN",
    goal: "Giảm mỡ",
    status: "Chờ nhận lời mời",
    sessions: 2,
    summary: "Liên kết một lần còn hạn đến 04/10/2026",
  },
];

export default function ProductPreview() {
  const [view, setView] = useState<"coach" | "client">("coach");
  const [selected, setSelected] = useState(0);
  const person = people[selected];
  return (
    <div className="fs-product-stage">
      <div className="fs-preview-label">
        <span>
          <span className="fs-status-dot" /> WORKSPACE M2 ĐÃ KIỂM THỬ
        </span>
        <span>Dữ liệu mẫu</span>
      </div>
      <div className="fs-preview-tabs" aria-label="Chọn góc nhìn">
        <button
          aria-pressed={view === "coach"}
          onClick={() => setView("coach")}
        >
          <LayoutDashboard size={14} /> Huấn luyện viên
        </button>
        <button
          aria-pressed={view === "client"}
          onClick={() => {
            setSelected(0);
            setView("client");
          }}
        >
          <Smartphone size={14} /> Học viên
        </button>
      </div>
      <div className="fs-workspace">
        <aside className="fs-preview-rail" aria-hidden="true">
          <Activity size={24} className="fs-amber" />
          <span className="selected">
            <LayoutDashboard size={18} />
          </span>
          <Users size={18} />
          <ScanLine size={18} />
          <ClipboardCheck size={18} />
          <span className="fs-rail-avatar">N</span>
        </aside>
        <div className="fs-workspace-main">
          <div className="fs-workspace-top">
            <span>
              {view === "coach" ? "Roster" : "Không gian học viên"}{" "}
              <ChevronRight size={11} /> Hồ sơ InBody
            </span>
            <Bell size={15} />
          </div>
          <div className="fs-workspace-heading">
            <div>
              <p>
                {view === "coach"
                  ? "HỒ SƠ, KẾT NỐI VÀ BẢN GHI"
                  : "CHỈ SỐ ĐƯỢC PT XÁC NHẬN"}
              </p>
              <h3>
                {view === "coach"
                  ? "Học viên của bạn."
                  : `Hồ sơ của ${person.name.split(" ").at(-1)}`}
              </h3>
            </div>
            <span className="fs-coach-avatar">
              {view === "coach" ? "N" : person.initials}
            </span>
          </div>
          {view === "coach" ? (
            <>
              <div className="fs-preview-stats">
                <div>
                  <span>Học viên</span>
                  <strong>
                    03 <small>trong roster</small>
                  </strong>
                </div>
                <div>
                  <span>Bản ghi InBody</span>
                  <strong className="fs-amber">
                    01 <small>đã xác minh</small>
                  </strong>
                </div>
              </div>
              <div className="fs-roster-title">
                <strong>Hồ sơ học viên</strong>
                <span>Buổi còn lại</span>
              </div>
              <div className="fs-roster">
                {people.map((p, i) => (
                  <button
                    key={p.name}
                    className={selected === i ? "is-selected" : ""}
                    aria-pressed={selected === i}
                    onClick={() => setSelected(i)}
                  >
                    <span className={`fs-person-avatar fs-person-${i}`}>
                      {p.initials}
                    </span>
                    <span className="fs-person-info">
                      <strong>{p.name}</strong>
                      <small>{p.goal}</small>
                    </span>
                    <span
                      className={`fs-person-status ${i < 2 ? "is-good" : ""}`}
                    >
                      {p.status}
                    </span>
                    <span className="fs-session-count">
                      {p.sessions}
                      <small> buổi</small>
                    </span>
                  </button>
                ))}
              </div>
              <div className="fs-client-note" aria-live="polite">
                <span className="fs-note-icon">
                  <BadgeCheck size={16} />
                </span>
                <div>
                  <strong>{person.status}</strong>
                  <p>{person.summary}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="fs-client-preview">
              <div className="fs-trainee-record">
                <div className="fs-trainee-record-head">
                  <span>
                    <ShieldCheck size={17} /> BẢN GHI ĐÃ XÁC MINH
                  </span>
                  <small>27/09/2026</small>
                </div>
                <div className="fs-trainee-primary-metric">
                  <span>Cân nặng</span>
                  <strong>
                    59,8 <small>kg</small>
                  </strong>
                </div>
                <div className="fs-trainee-metrics">
                  <span>
                    <strong>22,1 kg</strong>Cơ xương
                  </span>
                  <span>
                    <strong>17,0 kg</strong>Khối lượng mỡ
                  </span>
                  <span>
                    <strong>28,4%</strong>Tỷ lệ mỡ
                  </span>
                  <span>
                    <strong>31,7 L</strong>
                    <Droplets size={12} /> Nước cơ thể
                  </span>
                </div>
                <p className="fs-trainee-draft">
                  Mục tiêu dinh dưỡng là bản nháp coaching và PT có thể chỉnh
                  sửa.
                </p>
              </div>
            </div>
          )}
          <Link
            href={view === "coach" ? "/app/dashboard" : "/app/trainee"}
            className="fs-preview-footer"
          >
            Mở bản mẫu {view === "coach" ? "PT" : "học viên"}{" "}
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <div className="fs-preview-caption">
        <span>MỘT BẢN GHI. ĐÚNG NGƯỜI ĐƯỢC XEM.</span>
        <span>
          Dữ liệu hoàn toàn là minh họa <ArrowUpRight size={12} />
        </span>
      </div>
    </div>
  );
}
