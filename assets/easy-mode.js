
/* 3-step teaching layer: only explains the supplied source; textbook retained verbatim. */
(()=>{'use strict';
 const cfg=window.EASY_EDITION_CONFIG;
 const app=document.getElementById('app');
 if(!cfg||!app)return;
 const guides=cfg.guides||[];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const key=cfg.subject+'-guided-mode-v1';
 let mode='simple';
 try{mode=localStorage.getItem(key)==='full'?'full':'simple'}catch(_){}
 function routeInfo(){
  let route=decodeURIComponent(location.hash.slice(1)||'home');
  if(cfg.subject==='dl'){
   const match=route.match(/^read\/(\d+)$/);
   return match?{index:+match[1]}:null;
  }
  const match=route.match(/^read\/(\d+)-(\d+)$/);
  if(!match)return null;
  let idx=0,m=+match[1],l=+match[2];
  for(let n=1;n<m;n++)idx+=(cfg.lengths[n-1]||0);
  return {index:idx+l};
 }
 function setStage(card,n){
  n=Math.min(2,Math.max(0,n));
  card.dataset.stage=String(n);
  card.querySelectorAll('.guided-dot').forEach((x,i)=>x.classList.toggle('active',i<=n));
  const item=guides[Number(card.dataset.index)]||guides[0];
  const options=[
   {tag:'01 / UNDERSTAND',h:'What this actually means',lead:item[0],extra:'Think of it like this: '+item[1]},
   {tag:'02 / SEE IT',h:'One small example',lead:item[2],extra:'Check the meaning of each quantity before worrying about a long equation.'},
   {tag:'03 / ANSWER IT',h:'How to tackle an exam question',lead:item[3],extra:'Write the method, show the important intermediate step, then clearly state the result or reason. The full faculty-based explanation is directly below.'}
  ];
  const v=options[n];
  card.querySelector('.guided-stage-label').textContent=v.tag;
  card.querySelector('.guided-subtitle').textContent=v.h;
  card.querySelector('.guided-content').innerHTML='<p>'+esc(v.lead)+'</p><div class="guided-highlight">'+esc(v.extra)+'</div>';
  card.querySelector('.guided-back').disabled=n===0;
  card.querySelector('.guided-forward').textContent=n===2?'Show detailed textbook ↓':'Got it — continue →';
 }
 function toggleMode(card,want){
  mode=want;
  try{localStorage.setItem(key,mode)}catch(_){}
  card.dataset.mode=mode;
  const toggle=card.querySelector('.guided-mode-toggle');
  toggle.textContent=mode==='simple'?'Full technical notes':'Back to simple explanation';
  const depth=card.nextElementSibling;
  if(depth?.classList.contains('guided-depth'))depth.open=mode==='full';
 }
 function applyReader(){
  const info=routeInfo();if(!info||!guides[info.index])return;
  const article=app.querySelector('.reader');
  if(!article||article.dataset.guidedDone==='yes')return;
  const tools=article.querySelector(cfg.subject==='dl'?'.chapter-actions':'.chapter-tools');
  if(!tools)return;
  article.dataset.guidedDone='yes';
  const card=document.createElement('section');
  card.className='guided-card no-print';
  card.dataset.index=String(info.index);
  card.setAttribute('aria-label','Three step beginner explanation');
  card.innerHTML='<div class="guided-kicker">LEARN MODE / NOT ANOTHER WALL OF TEXT</div><div class="guided-head"><h2>First, make it make sense.</h2><button type="button" class="guided-mode-toggle"></button></div><div class="guided-steps"><span class="guided-dot"></span><span class="guided-dot"></span><span class="guided-dot"></span></div><div class="guided-step-label guided-stage-label"></div><h3 class="guided-subtitle" style="margin:5px 0 8px;font:600 22px var(--serif)"></h3><div class="guided-content"></div><div class="guided-actions"><span style="font:11px var(--mono);color:var(--muted)">THREE SMALL STEPS · FULL DEPTH BELOW</span><div class="guided-nav"><button type="button" class="guided-back">← Back</button><button type="button" class="guided-forward guided-main">Got it — continue →</button></div></div>';
  const depth=document.createElement('details');
  depth.className='guided-depth';
  const summary=document.createElement('summary');
  summary.textContent='Complete faculty-based explanation, formulas and interactive demonstration';
  depth.append(summary);
  const selectors=cfg.subject==='dl'?'.source-track, .prose, .demo':'.source-note, .prose, .demo';
  const original=[...article.children].filter(x=>x.matches?.(selectors));
  for(const node of original)depth.append(node);
  tools.after(card,depth);
  setStage(card,0);
  toggleMode(card,mode);
  card.querySelector('.guided-mode-toggle').addEventListener('click',()=>toggleMode(card,mode==='simple'?'full':'simple'));
  card.querySelector('.guided-back').addEventListener('click',()=>setStage(card,Number(card.dataset.stage)-1));
  card.querySelector('.guided-forward').addEventListener('click',()=>{
    const n=Number(card.dataset.stage);
    if(n<2){setStage(card,n+1);return}
    depth.open=true;
    depth.scrollIntoView({block:'start',behavior:'smooth'});
  });
 }
 function homeBanner(){
  if(routeInfo())return;
  if(!/^(?:#home|#)$/.test(location.hash||'#home'))return;
  const home=app.querySelector('.home');
  if(!home||home.querySelector('.guided-home'))return;
  const box=document.createElement('section');
  box.className='guided-home';
  box.innerHTML='<span class="guided-kicker">NEW / MADE FOR FIRST-TIME LEARNING</span><h2>Understand first. Memorize later.</h2><p>The technical textbook is still here, but you no longer need to start with formulas. Every chapter now opens with a three-step beginner explanation: plain English → tiny example → how to answer. Open the full lecture-level notes only when you’re ready.</p><div class="guided-path"><span>1 · Understand</span><span>2 · See an example</span><span>3 · Solve like the exam</span></div><p style="margin-top:17px">Historical FAT questions guide the answer style; they do not prove which questions will repeat. <a href="#'+cfg.firstRoute+'">Start your first easy lesson →</a></p>';
  home.insertBefore(box,home.firstElementChild);
 }
 let scheduled=false;
 function queue(){
  if(scheduled)return; scheduled=true;
  requestAnimationFrame(()=>{scheduled=false;applyReader();homeBanner()});
 }
 new MutationObserver(queue).observe(app,{childList:true,subtree:true});
 window.addEventListener('hashchange',queue);
 window.addEventListener('beforeprint',()=>{app.querySelectorAll('.guided-depth').forEach(d=>d.open=true)});
 queue();
})();
