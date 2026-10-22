import React from "react";
import { Users, ShieldCheck, Code, Smartphone, Database, Palette, Mail, GraduationCap, LucideIcon } from "lucide-react";

interface TeamMember {
  name: string;
  id: string;
  role: string;
  subRole: string;
  email: string;
  icon: LucideIcon;
  color: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Huỳnh Quốc Việt",
    id: "SE194225",
    role: "Team Leader & Tech Lead",
    subRole: "Product Architecture & Quality Gate",
    email: "tyviet1609@gmail.com",
    icon: ShieldCheck,
    color: "#FF6B00",
  },
  {
    name: "Lê Văn Toàn",
    id: "SE190816",
    role: "UI/UX Designer & Growth Lead",
    subRole: "Design System & Marketing Traction",
    email: "toanlvse190816@fpt.edu.vn",
    icon: Palette,
    color: "#10B981",
  },
  {
    name: "Dương Quang Huy",
    id: "SE180459",
    role: "Fullstack & Cloud Ops",
    subRole: "Vercel Deployment & API Integration",
    email: "huydqse180459@fpt.edu.vn",
    icon: Code,
    color: "#3B82F6",
  },
  {
    name: "Lê Nguyễn Gia Hưng",
    id: "SE194127",
    role: "Database & Security Architect",
    subRole: "Supabase Migrations & RLS Policies",
    email: "hunglngse194127@fpt.edu.vn",
    icon: Database,
    color: "#A855F7",
  },
  {
    name: "Diệp Khai",
    id: "SE193097",
    role: "Frontend & Mobile Engineer",
    subRole: "Admin Console & Android Packaging",
    email: "khaidse193097@fpt.edu.vn",
    icon: Smartphone,
    color: "#F59E0B",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="fs-section fs-container" style={{ padding: "80px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <p className="fs-eyebrow" style={{ color: "#FF6B00", fontWeight: 700, letterSpacing: "1.5px" }}>
          ĐỘI NGŨ PHÁT TRIỂN DỰ ÁN
        </p>
        <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#FFFFFF", marginTop: "8px" }}>
          Team SafeTrail — <span style={{ color: "#FF6B00" }}>FitSync</span>
        </h2>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(255, 107, 0, 0.08)",
            border: "1px solid rgba(255, 107, 0, 0.2)",
            borderRadius: "20px",
            padding: "6px 16px",
            marginTop: "12px",
            color: "#E2E8F0",
            fontSize: "0.9rem",
          }}
        >
          <GraduationCap size={18} color="#FF6B00" />
          <span>Sinh viên Đại học FPT TP.HCM — Khóa K18/K19 — Môn học: EXE201</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "24px",
        }}
      >
        {teamMembers.map((member) => {
          const Icon = member.icon;
          return (
            <div
              key={member.id}
              style={{
                backgroundColor: "#151921",
                border: "1px solid #232936",
                borderRadius: "16px",
                padding: "24px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "transform 0.2s ease, border-color 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 107, 0, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  color: member.color,
                }}
              >
                <Icon size={28} />
              </div>

              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
                {member.name}
              </h3>
              
              <p style={{ fontSize: "0.85rem", color: "#FF6B00", fontWeight: 600, marginBottom: "8px" }}>
                MSSV: {member.id}
              </p>

              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderRadius: "8px",
                  padding: "4px 10px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "0.85rem", color: "#E2E8F0", fontWeight: 600 }}>
                  {member.role}
                </span>
              </div>

              <p style={{ fontSize: "0.8rem", color: "#94A3B8", marginBottom: "16px", flexGrow: 1 }}>
                {member.subRole}
              </p>

              <a
                href={`mailto:${member.email}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.78rem",
                  color: "#94A3B8",
                  textDecoration: "none",
                  wordBreak: "break-all",
                }}
              >
                <Mail size={14} />
                <span>{member.email}</span>
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
