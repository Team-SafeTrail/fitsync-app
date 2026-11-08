'use strict';
// A controllable narrative, not an integration or a report extraction pipeline.
(() => {
  const stage=document.querySelector('.story-stage');if(!stage)return;
  const panels=[...document.querySelectorAll('[data-story-scene]')];
  const controls=[...document.querySelectorAll('[data-story-step]')];
  const play=document.querySelector('#story-play'),playText=play.querySelector('span');
  const caption=document.querySelector('#story-caption'),announcement=document.querySelector('#story-status');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const captions=['Lịch trong tin nhắn, chỉ số trong bảng, ghi chú ở chỗ khác.','Mở một hồ sơ, nhớ đúng điều cần cho buổi tập.','Cùng lịch hẹn, chia sẻ đúng phần học viên cần thấy.'];
  let current=1,generation=0,playing=false,timer=null,animations=[];
  const cancelAnimation=()=>{animations.forEach(a=>a.cancel());animations=[];};
  function pause(){playing=false;clearTimeout(timer);timer=null;play.setAttribute('aria-pressed','false');playText.textContent='Chạy câu chuyện';}
  function announce(){caption.textContent=captions[current];announcement.textContent=captions[current];}
  function render(next){current=next;stage.dataset.current=String(next);panels.forEach((panel,i)=>{panel.hidden=i!==current;});controls.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)));announce();}
  function animateArrival(el,reverse=false){
    if(motion.matches)return;
    animations.push(el.animate([{transform:`translateX(${reverse?'-12':'12'}px)`},{transform:'translateX(0)'}],{duration:320,easing:'cubic-bezier(.22,1,.36,1)'}));
  }
  async function select(next,{manual=true}={}){
    if(manual)pause();const run=++generation;cancelAnimation();
    if(next===current){render(next);return;}
    if(!motion.matches&&current===0&&next===1){
      const pieces=[...panels[0].querySelectorAll('[data-piece]')];
      animations=pieces.map((el,i)=>{const styles=getComputedStyle(el);return el.animate([{transform:styles.transform==='none'?'rotate(0)':styles.transform},{transform:`translate(${[48,-36,24][i]}px,${[56,-12,-55][i]}px) rotate(0deg)`}],{duration:340,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'});});
      await Promise.allSettled(animations.map(a=>a.finished));if(run!==generation)return;
    }
    cancelAnimation();if(run!==generation)return;render(next);animateArrival(panels[next],next===0);
  }
  function scheduleNext(){
    clearTimeout(timer);if(!playing)return;
    timer=setTimeout(async()=>{if(!playing)return;if(current>=2){pause();playText.textContent='Xem lại câu chuyện';return;}await select(current+1,{manual:false});if(playing)scheduleNext();},2300);
  }
  controls.forEach((button,index)=>{button.disabled=false;button.addEventListener('click',()=>select(index));});
  play.disabled=motion.matches;
  if(motion.matches)playText.textContent='Chọn từng cảnh để xem';
  async function togglePlayback(){
    if(playing){pause();++generation;cancelAnimation();return;}
    if(motion.matches){select(Math.min(current+1,2));return;}
    playing=true;play.setAttribute('aria-pressed','true');playText.textContent='Dừng câu chuyện';
    await select(0,{manual:false});if(playing)scheduleNext();
  }
  play.addEventListener('click',togglePlayback);
  document.querySelector('[data-story-start]')?.addEventListener('click',()=>{if(!playing)togglePlayback();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();++generation;cancelAnimation();}});
  motion.addEventListener('change',()=>{pause();++generation;cancelAnimation();play.disabled=motion.matches;if(motion.matches)playText.textContent='Chọn từng cảnh để xem';});
  render(0);
  const phone=matchMedia('(max-width:600px)');
  const resizeDetails=()=>{document.querySelectorAll('[data-responsive-detail]').forEach(detail=>{if(detail.contains(document.activeElement)&&phone.matches)detail.querySelector('summary').focus({preventScroll:true});detail.open=!phone.matches;});};
  resizeDetails();phone.addEventListener('change',resizeDetails);
})();
