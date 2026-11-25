export default function CalendarLoading() {
  return (
    <main id="main-content" className="workspace-main" aria-busy="true" aria-label="Đang tải lịch...">
      <div className="animate-pulse" style={{ padding: "8px 0" }}>
        <div style={{ height: "14px", width: "120px", background: "#dbe5de", borderRadius: "6px", marginBottom: "12px" }} />
        <div style={{ height: "36px", width: "220px", background: "#dbe5de", borderRadius: "8px", marginBottom: "24px" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
          <div style={{ height: "110px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "16px" }} />
          <div style={{ height: "110px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "16px" }} />
          <div style={{ height: "110px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "16px" }} />
        </div>
      </div>
    </main>
  );
}
