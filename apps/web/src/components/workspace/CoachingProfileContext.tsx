import {getCoachingProfileBundle} from "@/features/coaching-context/data";
import {isCoachingContextEnabled} from "@/features/coaching-context/config";
import {membershipStatus} from "@/features/coaching-context/validation";
import {getApplicationDate} from "@/features/engagement/calendar";
import {CoachingNoteForm,MembershipForm} from "./CoachingContextForms";

export default async function CoachingProfileContext({traineeId,section}:{traineeId:string;section?:"membership"|"notes"}) {
 if(!isCoachingContextEnabled()) return <>{section!=="notes"&&<section id="membership" className="coaching-context-section"><h2>Membership</h2><p>Thời hạn membership chưa được mở tại môi trường này. Số buổi PT được theo dõi riêng.</p></section>}{section!=="membership"&&<section id="coaching-notes" className="coaching-context-section"><h2>Ghi chú coaching</h2><p>Ghi chú riêng và chia sẻ chưa được mở tại môi trường này.</p></section>}</>;
 const bundle=await getCoachingProfileBundle(traineeId);if(!bundle) return <p role="alert">Không thể mở ngữ cảnh coaching của hồ sơ này.</p>;
 const {context,memberships,notes}=bundle; const {viewer,trainee}=context;const isPt=viewer.profile.role==="pt";

 const current=memberships.data?.[0];const status=current?membershipStatus(current.starts_on,current.ends_on,getApplicationDate()):null;
 const day=(value:string)=>value.split("-").reverse().join("/");const time=new Intl.DateTimeFormat("vi-VN",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Ho_Chi_Minh"});
 return <>{section!=="notes"&&<section id="membership" className="coaching-context-section" aria-labelledby="membership-title"><div className="workspace-section-heading"><h2 id="membership-title">Membership</h2><span>Thời hạn, tách riêng buổi PT</span></div>
  {memberships.error?<p role="alert">Chưa tải được membership. Hãy tải lại trước khi chỉnh sửa.</p>:current?<div className="coaching-membership-summary" data-testid="membership-summary"><div><span className="workspace-badge">{status!.label}</span><h3>{current.label}</h3><p>{day(current.starts_on)} — {day(current.ends_on)}</p></div>{status!.days!==null&&status!.days>0&&<div className="membership-days"><strong>{status!.days}</strong><span>ngày còn lại, gồm hôm nay</span></div>}</div>:<p>Chưa có thời hạn membership được PT ghi nhận.</p>}
  {isPt&&!memberships.error&&(trainee.profile_id?<details className="coaching-edit-disclosure" open={!current}><summary>{current?"Điều chỉnh thời hạn":"Thêm thời hạn membership"}</summary><MembershipForm key={current?.revision??0} traineeId={traineeId} current={current}/></details>:<p>Membership dùng chung sẽ mở sau khi học viên kết nối tài khoản.</p>)}
  {(memberships.data?.length??0)>1&&<details className="coaching-membership-history"><summary>Xem lịch sử điều chỉnh</summary><ol>{memberships.data!.map(item=><li key={item.id}><strong>{item.label}</strong><span>{day(item.starts_on)} — {day(item.ends_on)} · Bản {item.revision}</span></li>)}</ol><p>Tối đa 10 bản gần nhất; không phải lịch sử thanh toán.</p></details>}
 </section>}{section!=="membership"&&<section id="coaching-notes" className="coaching-context-section" aria-labelledby="coaching-notes-title"><div className="workspace-section-heading"><h2 id="coaching-notes-title">{isPt?"Ghi chú coaching":"PT chia sẻ với bạn"}</h2>{isPt&&<span>Riêng tư mặc định</span>}</div>
  {isPt&&<CoachingNoteForm traineeId={traineeId} linked={!!trainee.profile_id}/>}
  {notes.error?<p role="alert">Chưa tải được ghi chú. Hãy tải lại để kiểm tra lịch sử.</p>:notes.data?.length?<ol className="coaching-notes-list">{notes.data.slice(0,50).map(item=><li key={item.id} data-testid="coaching-note"><div><span className="workspace-badge">{item.visibility==="shared"?"PT và học viên":"Chỉ PT"}</span><time dateTime={item.created_at}>{time.format(new Date(item.created_at))}</time></div><p>{item.body}</p></li>)}</ol>:<p>{isPt?"Chưa có ghi chú trong hồ sơ này.":"Ghi chú PT chọn chia sẻ sẽ xuất hiện tại đây."}</p>}
  {(notes.data?.length??0)>50&&<p>Đang hiển thị 50 ghi chú gần nhất.</p>}
 </section>}</>;
}
