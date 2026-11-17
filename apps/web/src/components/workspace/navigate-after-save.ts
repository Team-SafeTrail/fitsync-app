export function navigateAfterSave(destination:string) {
 const target=new URL(destination,window.location.href);
 if(target.origin!==window.location.origin||!target.pathname.startsWith("/workspace"))throw new Error("Invalid workspace destination");
 if(target.pathname===window.location.pathname){
  window.history.replaceState(null,"",target.href);
  window.location.reload();
 }else window.location.assign(target.href);
}
