'use strict';
// Local design demonstration only: all sample state lives in this page's memory.
const find=s=>document.querySelector(s);
const all=s=>[...document.querySelectorAll(s)];
const state={time:'16:00',pending:false,messages:[]};
const status=text=>{find('#page-status').textContent=text;};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const dialog=find('#preview-dialog');

function updateTime(){
  const [hours,minutes]=state.time.split(':').map(Number);const prep=hours*60+minutes-5;all('[data-prep-time]').forEach(el=>{el.textContent=String(Math.floor(prep/60)).padStart(2,'0')+':'+String(prep%60).padStart(2,'0');});
  all('[data-session-time]').forEach(el=>{el.textContent=state.time;});
  all('.hero-request').forEach(el=>{el.hidden=!state.pending;});
  all('[data-request-time]').forEach(el=>{el.disabled=state.pending||state.time==='16:30';el.textContent=state.time==='16:30'?'Đã chốt giờ mới':'Thử đề nghị đổi sang 16:30 ↗';});
}
function openDialog(kind){
  find('#dialog-title').textContent=kind==='chat'?'Trao đổi với Linh':'Buổi hẹn minh họa';
  const content=find('#dialog-content');
  if(kind==='chat'){
    content.innerHTML='<p>Thử một tin nhắn trong bản thiết kế. Nội dung chỉ tồn tại trên trang này.</p><div id="sample-messages"></div><form id="sample-chat"><label for="sample-message">Tin nhắn mẫu<textarea id="sample-message" maxlength="500" required placeholder="Ví dụ: Chiều nay mình gặp nhau ở phòng tập nhé."></textarea></label><button class="button primary" type="submit">Gửi tin nhắn mẫu ↗</button></form>';
    state.messages.forEach(addMessage);
  }else{
    content.innerHTML='<div class="dialog-fact"><p>Khánh Linh · Buổi cùng PT</p><strong></strong><p>30/10/2026 · 60 phút</p></div><p>Lịch và thẻ trong chat cùng tham chiếu buổi hẹn này. Bài tập là phần đính kèm tùy chọn.</p><p>Đặt lịch chưa trừ số buổi PT. Việc xác nhận hoàn thành nằm trong bản mẫu luồng.</p><a class="button primary" href="/demo/#pt/calendar">Mở bản mẫu lịch ↗</a><small>Dữ liệu giả; không phải cuộc hẹn thật.</small>';
    content.querySelector('strong').textContent=state.time;
  }
  dialog.showModal();
  dialog.querySelector('textarea')?.focus();
}
function addMessage(text){
  const p=document.createElement('p');p.className='sent-message';p.textContent=text;
  find('#sample-messages').append(p);
}
document.addEventListener('click',event=>{
  const view=event.target.closest('[data-view]');
  if(view){
    all('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button===view)));
    all('[data-panel]').forEach(panel=>{panel.hidden=panel.dataset.panel!==view.dataset.view;});
    const labels={profile:'Học viên',calendar:'Lịch tập',progress:'Tiến triển'};
    all('.app-nav>span').forEach(span=>span.classList.toggle('selected',span.textContent===labels[view.dataset.view]));
    status('Đang xem '+view.textContent+'. Giao diện minh họa.');
  }
  const opener=event.target.closest('[data-dialog]');if(opener)openDialog(opener.dataset.dialog);
  if(event.target.closest('.dialog-close'))dialog.close();
  if(event.target.closest('[data-request-time]')){state.pending=true;updateTime();status('Đã gửi đề nghị 16:30. Giờ đã xác nhận vẫn là '+state.time+'.');all('.request-feedback').forEach(el=>el.textContent='Đề nghị đang chờ PT. Giờ cũ vẫn giữ nguyên.');}
  if(event.target.closest('[data-accept-time]')){state.pending=false;state.time='16:30';updateTime();all('.request-feedback').forEach(el=>el.textContent='PT đã chấp nhận. Lịch và thẻ trong chat cùng đổi sang 16:30.');status('Đã chấp nhận giờ 16:30 trong dữ liệu minh họa.');}
  if(event.target.closest('#confirm-sample')){find('.sample-confirmation').textContent='Đã mô phỏng xác nhận. Không lưu hồ sơ thật.';find('#confirm-sample').textContent='Bản mẫu đã xác nhận';find('#confirm-sample').disabled=true;find('#review-confirm').disabled=true;}
});
find('#review-confirm').addEventListener('change',event=>{find('#confirm-sample').disabled=!event.target.checked;});
document.addEventListener('submit',event=>{
  if(event.target.id!=='sample-chat')return;event.preventDefault();const input=find('#sample-message'),message=input.value.trim();if(!message)return;state.messages.push(message);addMessage(message);input.value='';input.focus();status('Đã gửi tin nhắn mẫu trên trang, không gửi tới người thật.');
});
const menuToggle=find('.menu-toggle'),menu=find('#mobile-menu');
menuToggle.addEventListener('click',()=>{const expanded=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!expanded));menuToggle.setAttribute('aria-label',expanded?'Mở menu':'Đóng menu');menu.hidden=expanded;});
menu.addEventListener('click',event=>{if(event.target.closest('a')){menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Mở menu');}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Mở menu');menuToggle.focus();}});

// CSS animation events remain observable to browser QA. Content stays visible
// without JavaScript, and reduced motion skips both the observer and travel.
if(!reduced.matches){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('is-arriving');observer.unobserve(entry.target);});},{threshold:.12});
  all('.reveal').forEach(el=>observer.observe(el));
}
