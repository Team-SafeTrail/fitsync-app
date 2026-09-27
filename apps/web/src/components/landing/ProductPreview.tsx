"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  Check,
  ChevronRight,
  Flame,
  LayoutDashboard,
  MessageCircle,
  ScanLine,
  Users,
  Activity,
  Smartphone,
} from "lucide-react";

const people = [
  {
    name: "Khánh Linh",
    initials: "KL",
    goal: "Duy trì thói quen",
    status: "Cần hỏi thăm",
    sessions: 8,
    note: "3 ngày chưa có check-in. Một lời hỏi thăm có thể giúp Linh trở lại nhịp tập.",
    calories: "1.650",
    meals: 2,
  },
  {
    name: "Minh Khoa",
    initials: "MK",
    goal: "Tăng cơ",
    status: "Đã check-in",
    sessions: 12,
    note: "Khoa đã cập nhật bữa ăn hôm nay. Tiếp tục theo dõi tiến trình ở buổi tập tới.",
    calories: "2.400",
    meals: 3,
  },
  {
    name: "Hoàng Nam",
    initials: "HN",
    goal: "Giảm mỡ",
    status: "Sắp hết buổi",
    sessions: 2,
    note: "Còn 2 buổi trong gói tập. Đây là lúc cùng Nam trao đổi kế hoạch tiếp theo.",
    calories: "1.850",
    meals: 1,
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
          <span className="fs-status-dot" /> KHÔNG GIAN HUẤN LUYỆN
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
          onClick={() => setView("client")}
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
          <MessageCircle size={18} />
          <span className="fs-rail-avatar">N</span>
        </aside>
        <div className="fs-workspace-main">
          <div className="fs-workspace-top">
            <span>
              {view === "coach" ? "Tổng quan" : "Không gian học viên"}{" "}
              <ChevronRight size={11} /> Hôm nay
            </span>
            <Bell size={15} />
          </div>
          <div className="fs-workspace-heading">
            <div>
              <p>
                {view === "coach"
                  ? "MỖI HỌC VIÊN ĐỀU QUAN TRỌNG"
                  : "TỪNG BƯỚC NHỎ, MỖI NGÀY"}
              </p>
              <h3>
                {view === "coach"
                  ? "Một ngày tập thật tốt."
                  : `Chào ${person.name.split(" ").at(-1)}!`}
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
                    14 <small>đang đồng hành</small>
                  </strong>
                </div>
                <div>
                  <span>Cần chú ý</span>
                  <strong className="fs-amber">
                    03 <small>hôm nay</small>
                  </strong>
                </div>
              </div>
              <div className="fs-roster-title">
                <strong>Học viên của bạn</strong>
                <span>Gói tập</span>
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
                      className={`fs-person-status ${i === 1 ? "is-good" : ""}`}
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
                  <MessageCircle size={16} />
                </span>
                <div>
                  <strong>Một chút quan tâm. Một bước tiến dài.</strong>
                  <p>{person.note}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="fs-client-preview">
              <div className="fs-calorie-ring">
                <div>
                  <Flame size={18} />
                  <strong>{person.calories}</strong>
                  <small>kcal mục tiêu mẫu</small>
                </div>
              </div>
              <div className="fs-client-checklist">
                <p>
                  <Check size={15} /> {person.meals} bữa ăn đã ghi nhận
                </p>
                <p>
                  <Check size={15} /> {person.sessions} buổi tập còn lại
                </p>
                <p>
                  <MessageCircle size={15} /> Cùng coach giữ nhịp mỗi ngày
                </p>
              </div>
            </div>
          )}
          <Link
            href={view === "coach" ? "/app/dashboard" : "/app/trainee"}
            className="fs-preview-footer"
          >
            Mở không gian {view === "coach" ? "huấn luyện viên" : "học viên"}{" "}
            mẫu <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
      <div className="fs-preview-caption">
        <span>COACH & CLIENT, IN SYNC.</span>
        <span>
          Chọn một học viên để khám phá <ArrowUpRight size={12} />
        </span>
      </div>
    </div>
  );
}
