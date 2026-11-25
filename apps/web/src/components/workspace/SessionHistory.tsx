import {createClient} from "@/lib/supabase/server";
const labels:Record<string,string>={opening:"Số dư đầu kỳ từ dữ liệu cũ",adjustment:"Điều chỉnh đã đối soát",completion:"Xác nhận hoàn thành",reversal:"Đảo xác nhận hoàn thành"};
export default async function SessionHistory({traineeId}:{traineeId:string}){
 const db=await createClient();const entitlement=await db.from("session_entitlements").select("id").eq("trainee_id",traineeId).maybeSingle();
 if(entitlement.error)return <p role="alert">Chưa tải được sổ buổi tập. Kiểm tra schema và kết nối trước khi đối soát.</p>;
 if(!entitlement.data)return <section className="workspace-panel" aria-label="Sổ buổi PT"><h3>Lịch sử số buổi PT</h3><p style={{margin:0,color:"var(--color-text-secondary)",fontSize:"13.5px",lineHeight:1.6}}>Chưa mở sổ lịch sử. Số dư hiện có sẽ được chụp làm mốc khi PT ghi thao tác đầu tiên.</p></section>;
 const entries=await db.from("session_ledger").select("id,kind,delta,balance_after,reason,created_at,version").eq("entitlement_id",entitlement.data.id).order("version",{ascending:false}).limit(101);
 if(entries.error)return <p role="alert">Chưa tải được lịch sử buổi tập.</p>;
 const time=new Intl.DateTimeFormat("vi-VN",{dateStyle:"short",timeStyle:"short",timeZone:"Asia/Ho_Chi_Minh"});
 return <section className="workspace-panel" aria-label="Sổ buổi PT"><h3>Lịch sử số buổi PT</h3><ol>{entries.data.slice(0,100).map(e=><li key={e.id} data-testid="session-ledger-entry"><strong>{labels[e.kind]??e.kind}</strong> · {e.delta>0?"+":""}{e.delta} · Còn {e.balance_after} buổi<p>{e.reason}</p><small>{time.format(new Date(e.created_at))} · Phiên bản {e.version}</small></li>)}</ol>{entries.data.length>100&&<p>Đang hiển thị 100 bút toán mới nhất; cần xuất lịch sử đầy đủ trước khi đối soát toàn kỳ.</p>}</section>;
}
