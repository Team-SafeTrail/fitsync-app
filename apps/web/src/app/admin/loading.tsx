export default function AdminLoading() {
  return (
    <div className="admin-content live-admin-dashboard animate-pulse" aria-busy="true" aria-label="Đang tải dữ liệu quản trị...">
      <div style={{ height: "44px", background: "#ffffff", border: "1px solid #d4dfd7", borderRadius: "14px" }} />
      <div className="admin-kpi-grid">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="admin-kpi-card" style={{ minHeight: "118px" }} />
        ))}
      </div>
      <div className="admin-section" style={{ minHeight: "150px" }} />
      <div className="admin-section" style={{ minHeight: "260px" }} />
    </div>
  );
}
