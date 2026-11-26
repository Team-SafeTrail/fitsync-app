import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check, Crown, Sparkles } from "lucide-react";
import { getWorkspaceViewer } from "@/features/workspace/data";
import { createClient } from "@/lib/supabase/server";
import UpgradeForm from "@/components/workspace/UpgradeForm";

export default async function BillingPage() {
  const viewer = await getWorkspaceViewer();
  if (viewer?.profile.role !== "pt") redirect("/workspace");
  const db = await createClient();
  const [{ data: requests, error }, { data: plan }] = await Promise.all([
    db.from("billing_requests").select("id,state,amount_vnd,created_at").eq("customer_id", viewer.user.id).order("created_at", { ascending: false }).limit(20),
    db.from("pt_profiles").select("subscription_plan,subscription_valid_until").eq("id", viewer.user.id).single(),
  ]);
  const bank = { name: process.env.FITSYNC_PAYMENT_BANK, account: process.env.FITSYNC_PAYMENT_ACCOUNT_NUMBER, holder: process.env.FITSYNC_PAYMENT_ACCOUNT_HOLDER };
  const isPro = plan?.subscription_plan === "pro";

  return (
    <main id="main-content" className="workspace-main">


      <header className="coaching-page-header">
        <div>
          <p className="workspace-kicker">Gói dịch vụ</p>
          <h1>Gói FitSync của PT</h1>
          <p>Quản lý hạn mức học viên và yêu cầu nâng cấp gói Pro.</p>
        </div>
        <span className={`workspace-badge ${isPro ? "is-verified" : "is-pending"}`}>
          <Crown size={14} /> {isPro ? "Đang dùng Pro" : "Đang dùng Free"}
          {plan?.subscription_valid_until ? ` · đến ${new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(plan.subscription_valid_until))}` : ""}
        </span>
      </header>

      <section className="fs-plan-grid" aria-label="So sánh gói dịch vụ">
        <article className="fs-plan-card">
          <h3>
            <span>Gói Free</span>
            {!isPro && <span className="workspace-badge is-verified">Hiện tại</span>}
          </h3>
          <div className="fs-plan-price">0₫ <small>/ tháng</small></div>
          <ul className="fs-plan-list">
            <li><Check size={16} /> Tối đa 3 học viên đang theo dõi (gồm cả hồ sơ chờ kết nối)</li>
            <li><Check size={16} /> Đầy đủ InBody, lịch hẹn, check-in, chat &amp; ghi chú</li>
            <li><Check size={16} /> Học viên sử dụng miễn phí</li>
          </ul>
        </article>

        <article className="fs-plan-card is-pro">
          <h3>
            <span>Gói Pro</span>
            <span className="workspace-badge is-verified"><Sparkles size={13} /> Không giới hạn</span>
          </h3>
          <div className="fs-plan-price">199.000₫ <small>/ PT / tháng</small></div>
          <ul className="fs-plan-list">
            <li><Check size={16} /> Không giới hạn số lượng học viên đang kèm</li>
            <li><Check size={16} /> Hết hạn vẫn giữ nguyên lịch sử hồ sơ cũ</li>
            <li><Check size={16} /> Đối soát thủ công, không tự động gia hạn</li>
          </ul>
        </article>
      </section>

      <div className="fs-split-grid">
        <section className="fs-card">
          <h2 style={{ margin: "0 0 12px", fontSize: "18px" }}>Yêu cầu nâng cấp Pro</h2>
          {error ? (
            <p role="alert">Chưa tải được yêu cầu. Kiểm tra kết nối trước khi thử lại.</p>
          ) : (
            <UpgradeForm />
          )}
          <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--color-border-default)" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: "15px" }}>Thông tin chuyển khoản</h3>
            {bank.name && bank.account && bank.holder ? (
              <dl className="fs-stack" style={{ gap: "6px", fontSize: "13.5px" }}>
                <div><strong>Ngân hàng:</strong> {bank.name}</div>
                <div><strong>Số tài khoản:</strong> {bank.account}</div>
                <div><strong>Chủ tài khoản:</strong> {bank.holder}</div>
                <div><strong>Nội dung:</strong> FitSync + mã yêu cầu bên cạnh</div>
              </dl>
            ) : (
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--color-text-secondary)" }}>
                Thông tin nhận chuyển khoản đang chờ xác nhận chính thức trước khi mở thanh toán.
              </p>
            )}
          </div>
        </section>

        <section className="fs-card-muted">
          <h2 style={{ margin: "0 0 10px", fontSize: "17px" }}>Yêu cầu gần đây</h2>
          {requests?.length ? (
            <ul className="fs-request-list">
              {requests.map((r) => (
                <li key={r.id} className="fs-request-row">
                  <code>{r.id.slice(0, 8)}…</code>
                  <span className="workspace-badge">{r.state}</span>
                  <strong>{r.amount_vnd.toLocaleString("vi-VN")}đ</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--color-text-secondary)" }}>
              Chưa có yêu cầu nâng cấp nào.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
