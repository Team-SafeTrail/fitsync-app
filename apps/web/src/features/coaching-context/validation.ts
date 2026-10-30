const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isContextId=(value:unknown):value is string=>typeof value==="string"&&uuid.test(value);
export function isMembershipDate(value:unknown):value is string {
  return typeof value==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+"T00:00:00Z"))&&new Date(value+"T00:00:00Z").toISOString().slice(0,10)===value;
}
export function validateNote(form:FormData) {
  const raw=form.get("body"); const body=typeof raw==="string"?raw.trim():"";
  const visibility=form.get("visibility"); const nonce=form.get("clientRequestId");
  if(!isContextId(nonce)) return {ok:false as const,error:"Không xác định được lượt lưu. Hãy tải lại trang."};
  if(!body||! /[^\s\u200B-\u200D\uFEFF]/u.test(body)||body.length>2000) return {ok:false as const,error:"Nhập ghi chú từ 1 đến 2.000 ký tự."};
  if(visibility!=="private"&&visibility!=="shared") return {ok:false as const,error:"Chọn người có thể đọc ghi chú."};
  return {ok:true as const,body,visibility,nonce};
}
export function validateMembership(form:FormData) {
  const raw=form.get("label"); const label=typeof raw==="string"?raw.trim():"";
  const starts=form.get("startsOn"),ends=form.get("endsOn"),nonce=form.get("clientRequestId"),revision=form.get("revision");
  if(!isContextId(nonce)||typeof revision!=="string"||!/^\d+$/.test(revision)||!Number.isSafeInteger(Number(revision))) return {ok:false as const,error:"Không xác định được phiên bản gói. Hãy tải lại trang."};
  if(!label||label.length>100) return {ok:false as const,error:"Nhập tên membership từ 1 đến 100 ký tự."};
  if(!isMembershipDate(starts)||!isMembershipDate(ends)||ends<starts) return {ok:false as const,error:"Kiểm tra ngày bắt đầu/kết thúc. Ngày kết thúc được tính bao gồm cả ngày đó."};
  return {ok:true as const,label,starts,ends,nonce,revision:Number(revision)};
}
export function membershipStatus(starts:string,ends:string,today:string) {
  if(today<starts) return {label:"Chưa bắt đầu",days:null};
  if(today>ends) return {label:"Đã hết hạn",days:0};
  return {label:"Còn hiệu lực",days:Math.floor((Date.parse(ends+"T00:00:00Z")-Date.parse(today+"T00:00:00Z"))/86400000)+1};
}
