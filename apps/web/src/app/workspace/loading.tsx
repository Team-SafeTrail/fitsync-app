export default function WorkspaceLoading() {
  return (
    <main id="main-content" className="workspace-main" aria-busy="true" aria-label="Đang tải dữ liệu...">
      <div className="animate-pulse" style={{ padding: "8px 0" }}>
        <div style={{ height: "14px", width: "140px", background: "#dbe5de", borderRadius: "6px", marginBottom: "12px" }} />
        <div style={{ height: "36px", width: "280px", background: "#dbe5de", borderRadius: "8px", marginBottom: "24px" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          <div style={{ height: "80px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "14px" }} />
          <div style={{ height: "80px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "14px" }} />
          <div style={{ height: "80px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "14px" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ height: "68px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "12px" }} />
          <div style={{ height: "68px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "12px" }} />
          <div style={{ height: "68px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "12px" }} />
          <div style={{ height: "68px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "12px" }} />
        </div>
      </div>
    </main>
  );
}
