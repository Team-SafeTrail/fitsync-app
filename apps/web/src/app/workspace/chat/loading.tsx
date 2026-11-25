export default function ChatLoading() {
  return (
    <main id="main-content" className="workspace-main" aria-busy="true" aria-label="Đang tải tin nhắn...">
      <div className="animate-pulse" style={{ padding: "8px 0" }}>
        <div style={{ height: "14px", width: "100px", background: "#dbe5de", borderRadius: "6px", marginBottom: "12px" }} />
        <div style={{ height: "36px", width: "180px", background: "#dbe5de", borderRadius: "8px", marginBottom: "24px" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "680px" }}>
          <div style={{ height: "54px", width: "70%", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "16px 16px 16px 4px" }} />
          <div style={{ height: "54px", width: "65%", background: "#eaf3ed", borderRadius: "16px 16px 4px 16px", alignSelf: "flex-end" }} />
          <div style={{ height: "54px", width: "75%", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "16px 16px 16px 4px" }} />
        </div>
      </div>
    </main>
  );
}
