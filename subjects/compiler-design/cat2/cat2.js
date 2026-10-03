const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const key='compiler-cat2-progress-v1';let done=new Set(JSON.parse(localStorage.getItem(key)||'[]'));
function refresh(){const bs=$$('.done[data-topic]');bs.forEach(b=>{const on=done.has(b.dataset.topic);b.classList.toggle('on',on);b.textContent=on?'✓ Done':'Mark done'});if($('#ptext'))$('#ptext').textContent=done.size+' / '+bs.length;if($('#pfill'))$('#pfill').style.width=(bs.length?done.size/bs.length*100:0)+'%'}
document.addEventListener('click',e=>{if(e.target.matches('.done[data-topic]')){const k=e.target.dataset.topic;done.has(k)?done.delete(k):done.add(k);localStorage.setItem(key,JSON.stringify([...done]));refresh()}if(e.target.matches('.reveal'))e.target.closest('.quiz').classList.toggle('show');if(e.target.matches('.copy')){const p=e.target.parentElement.querySelector('pre');navigator.clipboard.writeText(p?p.innerText:'');e.target.textContent='Copied';setTimeout(()=>e.target.textContent='Copy',900)}});
function search(){const q=$('#search');if(!q)return;q.addEventListener('input',()=>{const v=q.value.toLowerCase().trim();$$('.searchable').forEach(s=>s.classList.toggle('hidden',!!v&&!((s.innerText||'').toLowerCase().includes(v)||(s.dataset.keywords||'').toLowerCase().includes(v))))})}
function spy(){const links=$$('.nav-link'),secs=links.map(a=>$(a.getAttribute('href'))).filter(Boolean);addEventListener('scroll',()=>{let cur=secs[0];secs.forEach(s=>{if(s.getBoundingClientRect().top<130)cur=s});links.forEach(a=>a.classList.toggle('active',cur&&a.getAttribute('href')==='#'+cur.id))},{passive:true})}
const clrStates=[
['I0','S′→·S, $\nS→·AA, $\nA→·aA, a|b\nA→·b, a|b','Initial closure. For S→·AA,$ the new A-items get FIRST(A$)={a,b}.'],
['I1','S′→S·, $','Accept state: ACTION[1,$]=accept.'],
['I2','S→A·A, $\nA→·aA, $\nA→·b, $','GOTO(I0,A). Because β is empty in S→A·A,$, the A-items inherit lookahead $.'],
['I3','A→a·A, a|b\nA→·aA, a|b\nA→·b, a|b','GOTO(I0,a). Same LR(0) core as I6 later, but different lookaheads.'],
['I4','A→b·, a|b','Reduce A→b only on a or b.'],
['I5','S→AA·, $','Reduce S→AA only on $.'],
['I6','A→a·A, $\nA→·aA, $\nA→·b, $','GOTO(I2,a). Same core as I3, lookahead $.'],
['I7','A→b·, $','Reduce A→b only on $.'],
['I8','A→aA·, a|b','Reduce A→aA on a or b.'],
['I9','A→aA·, $','Reduce A→aA on $.']
];let cs=0;
function clr(){if(!$('#clrState'))return;const draw=()=>{const x=clrStates[cs];$('#clrState').textContent=x[0]+'\n'+x[1];$('#clrExplain').innerHTML='<b>'+x[0]+'</b> · '+x[2];$('#clrLabel').textContent=(cs+1)+' / '+clrStates.length};$('#clrPrev').onclick=()=>{cs=(cs-1+clrStates.length)%clrStates.length;draw()};$('#clrNext').onclick=()=>{cs=(cs+1)%clrStates.length;draw()};draw()}
const lalrTrace=[['0','bdc$','shift b → state 3'],['0 b 3','dc$','shift d → state 7'],['0 b 3 d 7','c$','reduce A→d; goto(3,A)=6'],['0 b 3 A 6','c$','shift c → state 9'],['0 b 3 A 6 c 9','$','reduce S→bAc'],['0 S 1','$','accept']];let ls=0;
function lalr(){if(!$('#lalrStack'))return;const draw=()=>{const x=lalrTrace[ls];$('#lalrStack').textContent=x[0];$('#lalrInput').textContent=x[1];$('#lalrAction').textContent=x[2];$('#lalrLabel').textContent=(ls+1)+' / '+lalrTrace.length};$('#lalrPrev').onclick=()=>{ls=(ls-1+lalrTrace.length)%lalrTrace.length;draw()};$('#lalrNext').onclick=()=>{ls=(ls+1)%lalrTrace.length;draw()};draw()}
const bp=[['Start','100: if x < 100 goto _\n101: goto _','B1.true=[100], B1.false=[101]'],['After OR marker M=102','102: if y > 200 goto _\n103: goto _','Backpatch B1.false [101] → 102.'],['AND marker M=104','104: if x != y goto _\n105: goto _','Backpatch (y>200).true [102] → 104.'],['Merge lists','truelist = [100,104]\nfalselist = [103,105]','OR merges true lists; AND merges false lists.'],['Final patch','100: if x<100 goto 106\n101: goto 102\n102: if y>200 goto 104\n103: goto 107\n104: if x!=y goto 106\n105: goto 107','Backpatch truelist→106 and falselist→107.']];let bs=0;
function backpatch(){if(!$('#bpCode'))return;const draw=()=>{const x=bp[bs];$('#bpTitle').textContent=x[0];$('#bpCode').textContent=x[1];$('#bpExplain').textContent=x[2];$('#bpLabel').textContent=(bs+1)+' / '+bp.length};$('#bpPrev').onclick=()=>{bs=(bs-1+bp.length)%bp.length;draw()};$('#bpNext').onclick=()=>{bs=(bs+1)%bp.length;draw()};draw()}
function blocks(){const b=$('#blockCalc');if(!b)return;b.onclick=()=>{const raw=$('#blockCode').value.split(/\n/).map(x=>x.trim()).filter(Boolean);const labels=new Map();raw.forEach((l,i)=>{const m=l.match(/^([A-Za-z_]\w*):/);if(m)labels.set(m[1],i)});const leaders=new Set([0]);raw.forEach((l,i)=>{let m=l.match(/\bgoto\s+([A-Za-z_]\w*)/i);if(m&&labels.has(m[1]))leaders.add(labels.get(m[1]));if(/\bgoto\b/i.test(l)&&i+1<raw.length)leaders.add(i+1)});const arr=[...leaders].sort((a,b)=>a-b);const out=[];arr.forEach((st,k)=>{const en=(k+1<arr.length?arr[k+1]:raw.length);out.push('B'+(k+1)+':\n'+raw.slice(st,en).map((x,j)=>(st+j+1)+'. '+x).join('\n'))});$('#blockOut').textContent=out.join('\n\n')};b.click()}
function peephole(){const b=$('#peepholeBtn');if(!b)return;b.onclick=()=>{$('#peepholeAfter').textContent='MOV R0, x\ngoto L2\nx = x * x\nINCR i';};}
function printCheat(){window.print()}
function init(){refresh();search();spy();clr();lalr();backpatch();blocks();peephole()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();