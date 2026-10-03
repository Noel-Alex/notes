(()=>{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const kinds={
 'm2-prereq':'mixed','m2-clr':'procedure','m2-lalr':'mixed','m2-conflicts':'theory',
 'm3-sdd':'theory','m3-annotated':'mixed','m3-dependency':'mixed','m3-lattr':'theory','m3-sdt':'mixed','m3-applications':'mixed',
 'm4-ir':'theory','m4-tac':'mixed','m4-types':'theory','m4-declarations':'mixed','m4-assignment':'procedure','m4-boolean':'mixed','m4-procedures':'mixed','m4-backpatch':'mixed',
 'm5-intro':'theory','m5-sources':'theory','m5-dataflow':'mixed','m5-blocks':'mixed','m5-transform':'theory','m5-peephole':'theory'
};
const labels={theory:'THEORY · quick read',mixed:'MIXED · theory + method',procedure:'PROCEDURAL · video-friendly'};
function addKind(id,kind){const s=$('#'+id);if(!s)return;s.classList.add('study-'+kind);const title=$('.section-title',s);if(title&&!$('.study-kind',title)){title.insertAdjacentHTML('afterbegin',`<span class="study-kind ${kind}">${labels[kind]}</span>`);if(kind==='theory')title.insertAdjacentHTML('beforeend','<p class="theory-note">Mostly definitions, distinctions, properties or memorisable concepts — good for a fast read-through.</p>');if(kind==='procedure')title.insertAdjacentHTML('beforeend','<p class="video-note">Construction / solving heavy. A worked video may be faster; use this page afterward as the exact source-aligned reference.</p>')}}
function badge(el,label='THEORY'){if(!el||el.dataset.theoryMarked)return;el.dataset.theoryMarked='1';el.classList.add('theory-mark');const b=`<span class="theory-badge">${label}</span>`;if(el.tagName==='DETAILS'){const sm=$('summary',el);if(sm)sm.insertAdjacentHTML('afterbegin',b)}else if(el.tagName==='TABLE'){el.insertAdjacentHTML('beforebegin',b)}else el.insertAdjacentHTML('afterbegin',b)}
function markAll(id,selector,label){const s=$('#'+id);if(!s)return;$$(selector,s).forEach(x=>badge(x,label))}
function markSummary(id,needle,label='THEORY'){const s=$('#'+id);if(!s)return;$$('details',s).forEach(d=>{const sm=$('summary',d);if(sm&&(sm.textContent||'').toLowerCase().includes(needle.toLowerCase()))badge(d,label)})}
function guide(){const host=$('#dynamic-content');if(!host||$('#theory-guide'))return;const box=document.createElement('section');box.id='theory-guide';box.className='theory-guide searchable';box.dataset.keywords='theory scan theoretical concepts definitions distinctions quick read';box.innerHTML=`
 <div class="theory-guide-head"><div><h2>Theory scan · what you can read quickly</h2><p>I marked every theory-heavy section and the theory blocks inside mixed/problem-solving sections. Use <b>Highlight theory</b> to make them jump out, or <b>Theory-first mode</b> to hide the most procedural sections while you do a fast conceptual pass.</p></div><div class="legend"><span class="study-kind theory">THEORY · quick read</span><span class="study-kind mixed">MIXED · theory + method</span><span class="study-kind procedure">PROCEDURAL · video-friendly</span></div></div>
 <div class="theory-index">
  <div class="card"><h3>Module 2 theory</h3><ul><li><a href="#m2-prereq">LR(1) item, lookahead, GOTO, closure/FIRST(βa)</a></li><li><a href="#m2-lalr">CLR vs LALR; same LR(0) core + lookahead union</a></li><li><a href="#m2-conflicts">Shift/reduce and reduce/reduce conflicts</a></li></ul></div>
  <div class="card"><h3>Module 3 theory</h3><ul><li><a href="#m3-sdd">SDD; synthesized vs inherited attributes</a></li><li><a href="#m3-annotated">Annotated parse tree</a></li><li><a href="#m3-dependency">Dependency graph + topological order</a></li><li><a href="#m3-lattr">S-attributed vs L-attributed</a></li><li><a href="#m3-sdt">SDD vs SDT; top-down vs bottom-up action timing</a></li><li><a href="#m3-applications">Applications of SDT</a></li></ul></div>
  <div class="card"><h3>Module 4 theory</h3><ul><li><a href="#m4-ir">Why IR; syntax tree vs DAG; postfix; TAC</a></li><li><a href="#m4-tac">Quadruple vs triple vs indirect triple</a></li><li><a href="#m4-types">TAC statement categories</a></li><li><a href="#m4-declarations">mktable / enter / addwidth</a></li><li><a href="#m4-boolean">Numerical Boolean vs flow-of-control; short circuit</a></li><li><a href="#m4-backpatch">makelist, merge, backpatch, nextinstr, true/false/next lists</a></li></ul></div>
  <div class="card"><h3>Module 5 theory</h3><ul><li><a href="#m5-intro">Optimization goals; machine-independent vs dependent</a></li><li><a href="#m5-sources">CSE, dead code, code motion, copy propagation, strength reduction, induction variable, constant folding</a></li><li><a href="#m5-dataflow">Reaching / available / live / busy facts</a></li><li><a href="#m5-blocks">Basic block + flow graph concept</a></li><li><a href="#m5-transform">Structure-preserving vs algebraic transforms</a></li><li><a href="#m5-peephole">Peephole definition + five local optimizations</a></li></ul></div>
 </div>
 <div class="theory-toolbar"><button id="theoryHighlight">Highlight theory</button><button id="theoryOnly">Theory-first mode</button><button id="theoryReset">Normal view</button></div>`;
 host.insertBefore(box,host.firstChild);
 $('#theoryHighlight').onclick=()=>{document.body.classList.toggle('theory-scan');document.body.classList.remove('theory-only');syncButtons()};
 $('#theoryOnly').onclick=()=>{document.body.classList.add('theory-scan','theory-only');syncButtons()};
 $('#theoryReset').onclick=()=>{document.body.classList.remove('theory-scan','theory-only');syncButtons()};
 const navAnchor=$('.nav-link[href="#survival"]');if(navAnchor&&!$('.nav-link[href="#theory-guide"]'))navAnchor.insertAdjacentHTML('afterend','<a class="nav-link" href="#theory-guide"><i class="dot"></i>Theory scan</a>');
 const heroActions=$('.hero-actions');if(heroActions&&!$('#heroTheory'))heroActions.insertAdjacentHTML('beforeend','<button class="btn ghost" id="heroTheory">Theory scan</button>');if($('#heroTheory'))$('#heroTheory').onclick=()=>{$('#theory-guide').scrollIntoView();document.body.classList.add('theory-scan');syncButtons()};
}
function syncButtons(){const scan=document.body.classList.contains('theory-scan'),only=document.body.classList.contains('theory-only');const h=$('#theoryHighlight'),o=$('#theoryOnly');if(h)h.classList.toggle('active',scan&&!only);if(o)o.classList.toggle('active',only)}
function markConcepts(){
 Object.entries(kinds).forEach(([id,k])=>addKind(id,k));
 markAll('m2-prereq','.card');
 markAll('m2-clr','.callout.good','THEORY KEY');
 markSummary('m2-lalr','Source merge example','THEORY + EXAMPLE');
 markAll('m2-conflicts','.card,.callout.warn,details');
 markAll('m3-sdd','.grid3 .card,.callout.good');
 markAll('m3-annotated','details');
 markAll('m3-dependency','details');
 markAll('m3-lattr','.grid2 .card,.formula');
 markAll('m3-sdt','.grid2 .card');markSummary('m3-sdt','Top-down vs bottom-up','THEORY');markSummary('m3-sdt','Bottom-up evaluation','THEORY');
 markAll('m3-applications','.ribbon');
 markAll('m4-ir','.ir-card,.callout.good,details');
 markAll('m4-tac','.grid3 .card');
 markAll('m4-types','table');
 markAll('m4-declarations','.grid3 .card');
 markSummary('m4-assignment','Reusing temporary names','THEORY');
 markAll('m4-boolean','.grid2 .card,.callout.good');markSummary('m4-boolean','Flow-of-control statement shapes','THEORY');
 markAll('m4-procedures','details','PATTERN / THEORY');
 markAll('m4-backpatch','.grid4 .card,.grid3 .card');markSummary('m4-backpatch','Boolean backpatching rules','RULES');
 markAll('m5-intro','.grid3 .card,details');
 markAll('m5-sources','.grid2 .card,details');
 markAll('m5-dataflow','.grid3 .card');markSummary('m5-dataflow','Four data-flow properties','THEORY');markSummary('m5-dataflow','Path definition','THEORY');
 markAll('m5-transform','.grid2 .card,details');
 markAll('m5-peephole','.grid3 .card,details');
}
function init(){guide();markConcepts();syncButtons()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
