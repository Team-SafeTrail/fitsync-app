export default function TraineeDetailLoading() {
  return (
    <main id="main-content" className="workspace-main" aria-busy="true" aria-label="Đang tải hồ sơ học viên...">
      <div className="animate-pulse" style={{ padding: "8px 0" }}>
        <div style={{ height: "14px", width: "120px", background: "#dbe5de", borderRadius: "6px", marginBottom: "12px" }} />
        <div style={{ height: "36px", width: "240px", background: "#dbe5de", borderRadius: "8px", marginBottom: "20px" }} />

        <div style={{ height: "60px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "14px", marginBottom: "24px" }} />

        <div style={{ height: "180px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "16px", marginBottom: "24px" }} />
        <div style={{ height: "140px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "16px" }} />
      </div>
    </main>
  );
}
