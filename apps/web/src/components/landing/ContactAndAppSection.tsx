"use client";

import React, { useState } from "react";
import { 
  Smartphone, 
  Download, 
  MessageCircle, 
  PhoneCall, 
  Mail, 
  ShieldCheck, 
  HelpCircle, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function ContactAndAppSection() {
  const [showApkGuide, setShowApkGuide] = useState(false);

  return (
    <section id="contact-app" className="fs-section fs-container" style={{ padding: "80px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <p className="fs-eyebrow" style={{ color: "#FF6B00", fontWeight: 700, letterSpacing: "1.5px" }}>
          KẾT NỐI & TRẢI NGHIỆM ĐA NỀN TẢNG
        </p>
        <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#FFFFFF", marginTop: "8px" }}>
          Hỗ Trợ Trực Tiếp & <span style={{ color: "#FF6B00" }}>Tải Ứng Dụng Android</span>
        </h2>
        <p style={{ color: "#94A3B8", maxWidth: "620px", margin: "12px auto 0", fontSize: "1rem" }}>
          Android là nền tảng ứng dụng được ưu tiên. Chưa công bố bản cài đặt, thời gian phát hành hoặc cam kết hỗ trợ 24/7.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "28px",
        }}
      >
        {/* Card 1: Kênh Liên Hệ & Hỗ Trợ Khách Hàng */}
        <div
          style={{
            backgroundColor: "#151921",
            border: "1px solid #232936",
            borderRadius: "20px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  color: "#3B82F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PhoneCall size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF" }}>
                  Tư Vấn & Hỗ Trợ 1:1
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
                  Kênh chăm sóc PT & Giải đáp thắc mắc
                </p>
              </div>
            </div>

            <p style={{ color: "#CBD5E1", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "24px" }}>
              Bạn cần giải đáp về cách đồng bộ học viên, tạo mã VietQR hoặc muốn đặt câu hỏi trực tiếp cho đội ngũ phát triển SafeTrail?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Zalo OA */}
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#1E2430",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  border: "1px solid #2D3748",
                  transition: "border-color 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      backgroundColor: "#0068FF",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                    }}
                  >
                    Zalo
                  </div>
                  <div>
                    <div style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "0.95rem" }}>
                      Zalo Official Account
                    </div>
                    <div style={{ color: "#94A3B8", fontSize: "0.8rem" }}>
                      Hỗ trợ trực tiếp từ Leader & CSKH
                    </div>
                  </div>
                </div>
                <ExternalLink size={18} color="#94A3B8" />
              </a>

              {/* Hotline */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#1E2430",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: "1px solid #2D3748",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <PhoneCall size={20} color="#10B981" />
                  <div>
                    <div style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "0.95rem" }}>
                      Hotline Hỗ Trợ Kỹ Thuật
                    </div>
                    <div style={{ color: "#10B981", fontWeight: 700, fontSize: "0.9rem" }}>
                      0901.234.567 (08:00 – 22:00)
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "4px 8px", borderRadius: "6px" }}>
                  Miễn cước
                </span>
              </div>

              {/* Email */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  backgroundColor: "#1E2430",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: "1px solid #2D3748",
                }}
              >
                <Mail size={20} color="#FF6B00" />
                <div>
                  <div style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "0.95rem" }}>
                    Email Dự Án
                  </div>
                  <div style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
                    support@fitsync.vn • tyviet1609@gmail.com
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #232936", display: "flex", alignItems: "center", gap: "8px", color: "#64748B", fontSize: "0.8rem" }}>
            <ShieldCheck size={16} color="#10B981" />
            <span>Phản hồi cam kết trong vòng 30 phút trong giờ làm việc.</span>
          </div>
        </div>

        {/* Card 2: Tải Ứng Dụng Android APK */}
        <div
          style={{
            backgroundColor: "#151921",
            border: "1px solid rgba(255, 107, 0, 0.3)",
            borderRadius: "20px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle gradient glow */}
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 107, 0, 0.15)",
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 107, 0, 0.15)",
                  color: "#FF6B00",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Smartphone size={24} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#FFFFFF" }}>
                    FitSync Android App
                  </h3>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      backgroundColor: "rgba(255, 107, 0, 0.2)",
                      color: "#FF6B00",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    v0.1.0-alpha
                  </span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
                  Bản cài đặt thử nghiệm nội bộ (Expo EAS Build)
                </p>
              </div>
            </div>

            <p style={{ color: "#CBD5E1", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "20px" }}>
              Trải nghiệm ứng dụng di động độc quyền dành cho Huấn luyện viên và Học viên trên nền tảng Android. Tối ưu cho chụp ảnh InBody và check-in bữa ăn.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", color: "#94A3B8", fontSize: "0.88rem" }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span>Tương thích Android 8.0 trở lên (Dung lượng: ~24 MB)</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", color: "#94A3B8", fontSize: "0.88rem" }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span>Hỗ trợ chụp ảnh trực tiếp và bảo mật phiên với SecureStore</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", color: "#94A3B8", fontSize: "0.88rem" }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span>Đồng bộ thời gian thực với cơ sở dữ liệu Supabase Cloud</span>
              </li>
            </ul>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <a
                href="/downloads/fitsync-v0.1.0-alpha.apk"
                className="fs-button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "14px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(255, 107, 0, 0.35)",
                }}
              >
                <Download size={20} />
                <span>Tải Bản Cài Đặt Android APK</span>
              </a>

              <button
                type="button"
                onClick={() => setShowApkGuide(!showApkGuide)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "6px",
                }}
              >
                <HelpCircle size={15} />
                <span>{showApkGuide ? "Ẩn hướng dẫn cài đặt" : "Hướng dẫn cài đặt file APK trên điện thoại"}</span>
              </button>
            </div>

            {showApkGuide && (
              <div
                style={{
                  marginTop: "16px",
                  backgroundColor: "#1A202C",
                  border: "1px solid #2D3748",
                  borderRadius: "12px",
                  padding: "16px",
                  fontSize: "0.85rem",
                  color: "#E2E8F0",
                  lineHeight: "1.6",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#F59E0B", fontWeight: 600, marginBottom: "8px" }}>
                  <AlertTriangle size={16} />
                  <span>Cách cài đặt file APK:</span>
                </div>
                <ol style={{ paddingLeft: "20px", margin: 0 }}>
                  <li>Bấm nút <strong>Tải Bản Cài Đặt</strong> ở trên để tải file về điện thoại.</li>
                  <li>Mở file đã tải trong mục <em>Tệp đã tải xuống (Downloads)</em>.</li>
                  <li>Nếu máy báo <em>&ldquo;Ứng dụng từ nguồn không xác định&rdquo;</em>, chọn <strong>Cài đặt</strong> ➔ bật <strong>Cho phép từ nguồn này</strong>.</li>
                  <li>Bấm <strong>Cài đặt (Install)</strong> và mở ứng dụng để trải nghiệm.</li>
                </ol>
              </div>
            )}
          </div>

          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #232936", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#64748B", fontSize: "0.8rem" }}>
            <span>Đóng gói bởi Diệp Khai & SafeTrail Team</span>
            <span style={{ color: "#FF6B00", fontWeight: 600 }}>EAS Build Pipeline</span>
          </div>
        </div>
      </div>
    </section>
  );
}
