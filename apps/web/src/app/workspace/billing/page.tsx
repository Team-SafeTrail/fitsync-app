import Link from "next/link";
import { redirect } from "next/navigation";
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
  return <main id="main-content" className="workspace-main"><Link href="/workspace">Về học viên</Link><h1>Gói FitSync của PT</h1><p>Free: tối đa 3 học viên chưa lưu trữ, gồm hồ sơ chờ kết nối. Pro: 199.000đ/PT/tháng, không giới hạn học viên và cùng chức năng coaching. Hết hạn Pro vẫn giữ hồ sơ cũ; tạo thêm hoặc khôi phục hồ sơ phải theo hạn mức Free.</p><p>Chuyển khoản được đối chiếu thủ công; không tự động gia hạn hoặc tự trừ tiền.</p>
    <section className="workspace-panel"><h2>Trạng thái gói</h2><p>{plan?.subscription_plan ?? "Chưa tải được"}{plan?.subscription_valid_until ? ` · đến ${new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(plan.subscription_valid_until))}` : ""}</p><p>Nhãn gói được quản lý riêng; chỉ giao dịch có chứng từ và được đối soát mới được tính là doanh thu.</p></section>
    <section className="workspace-panel"><h2>Yêu cầu nâng cấp</h2>{error ? <p role="alert">Chưa tải được yêu cầu. Kiểm tra migration và kết nối trước khi tiếp tục.</p> : <UpgradeForm/>}
      {bank.name && bank.account && bank.holder ? <dl><dt>Ngân hàng</dt><dd>{bank.name}</dd><dt>Số tài khoản</dt><dd>{bank.account}</dd><dt>Chủ tài khoản</dt><dd>{bank.holder}</dd><dt>Nội dung</dt><dd>FitSync và mã yêu cầu bên dưới; lưu chứng từ để admin đối chiếu.</dd></dl> : <p>Thông tin nhận tiền đang chờ chủ dự án xác nhận. Bạn có thể gửi yêu cầu; chờ hướng dẫn thanh toán chính thức trước khi chuyển tiền.</p>}
      <h3>Yêu cầu gần đây</h3>{requests?.length ? <ul>{requests.map(r => <li key={r.id}><code>{r.id}</code> · {r.state} · {r.amount_vnd.toLocaleString("vi-VN")}đ</li>)}</ul> : <p>Chưa có yêu cầu được lưu.</p>}
    </section></main>;
}
