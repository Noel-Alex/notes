
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const doneKey="dm-cat2-final-progress-v1";
let doneSet=new Set(JSON.parse(localStorage.getItem(doneKey)||"[]"));
function progress(){
  const bs=$$(".done[data-topic]");
  bs.forEach(b=>{const on=doneSet.has(b.dataset.topic);b.classList.toggle("on",on);b.textContent=on?"✓ Done":"Mark done"});
  $("#ptext").textContent=doneSet.size+" / "+bs.length;
  $("#pfill").style.width=(bs.length?doneSet.size/bs.length*100:0)+"%";
}
document.addEventListener("click",e=>{
  if(e.target.matches(".done[data-topic]")){const k=e.target.dataset.topic;doneSet.has(k)?doneSet.delete(k):doneSet.add(k);localStorage.setItem(doneKey,JSON.stringify(Array.from(doneSet)));progress()}
  if(e.target.matches(".reveal"))e.target.closest(".quiz").classList.toggle("show");
  if(e.target.matches(".copy")){const pre=e.target.parentElement.querySelector("pre");navigator.clipboard.writeText(pre?pre.innerText:"");e.target.textContent="Copied";setTimeout(()=>e.target.textContent="Copy",800)}
});
function searchSetup(){
  const q=$("#search");
  if(!q)return;
  q.addEventListener("input",()=>{
    const v=q.value.toLowerCase().trim();
    $$(".searchable").forEach(s=>s.classList.toggle("hidden",!!v&&!((s.innerText||"").toLowerCase().includes(v)||(s.dataset.keywords||"").toLowerCase().includes(v))));
  });
}
function scrollSpy(){
  const links=$$(".nav-link"), secs=links.map(a=>$(a.getAttribute("href"))).filter(Boolean);
  addEventListener("scroll",()=>{let cur=secs[0];secs.forEach(s=>{if(s.getBoundingClientRect().top<130)cur=s});links.forEach(a=>a.classList.toggle("active",cur&&a.getAttribute("href")==="#"+cur.id))},{passive:true});
}
function fmt(x,d=4){return Number.isFinite(x)?Number(x.toFixed(d)).toString():"—"}
function entropy(p,n){const t=p+n;if(!t)return 0;let z=0;[p/t,n/t].forEach(v=>{if(v>0)z-=v*Math.log2(v)});return z}
function normalization(){
 const b=$("#normCalc");if(!b)return;
 b.onclick=()=>{
  const v=+$("#nv").value,min=+$("#nmin").value,max=+$("#nmax").value,a=+$("#nnewmin").value,c=+$("#nnewmax").value,mu=+$("#nmu").value,sd=+$("#nsd").value,j=+$("#nj").value;
  const mm=(v-min)/(max-min)*(c-a)+a, z=(v-mu)/sd, dec=v/Math.pow(10,j);
  $("#normOut").innerHTML='<div class="metric"><span>Min–max</span><b>'+fmt(mm,4)+'</b></div><div class="metric"><span>Z-score</span><b>'+fmt(z,4)+'</b></div><div class="metric"><span>Decimal scaling</span><b>'+fmt(dec,4)+'</b></div><div class="metric"><span>Check</span><b>'+((mm>=Math.min(a,c)&&mm<=Math.max(a,c))?"in range":"check inputs")+'</b></div>';
 };
 b.click();
}
function binning(){
 const b=$("#binCalc");if(!b)return;
 b.onclick=()=>{
  const vals=$("#binVals").value.split(/[,\s]+/).map(Number).filter(Number.isFinite).sort((a,b)=>a-b), k=Math.max(1,+$("#binK").value||1);
  if(!vals.length)return;
  const min=vals[0],max=vals[vals.length-1],w=(max-min)/k;
  const ew=[];
  for(let i=0;i<k;i++){const lo=min+i*w,hi=i===k-1?max:min+(i+1)*w;ew.push({lo,hi,v:vals.filter(x=>i===k-1?x>=lo&&x<=hi:x>=lo&&x<hi)})}
  const ef=[];for(let i=0;i<k;i++){const lo=Math.floor(i*vals.length/k),hi=Math.floor((i+1)*vals.length/k);ef.push(vals.slice(lo,hi))}
  $("#binOut").innerHTML='<b>Equal-width</b><br>'+ew.map((x,i)=>'Bin '+(i+1)+' ['+fmt(x.lo,2)+', '+fmt(x.hi,2)+(i===k-1?']':')')+': '+x.v.join(", ")).join("<br>")+'<br><br><b>Equal-frequency</b><br>'+ef.map((x,i)=>'Bin '+(i+1)+': '+x.join(", ")).join("<br>");
 };
 b.click();
}
const fpTransactions=[
 ["T100",["I2","I1","I5"]],["T200",["I2","I4"]],["T300",["I2","I3"]],["T400",["I2","I1","I4"]],
 ["T500",["I1","I3"]],["T600",["I2","I3"]],["T700",["I1","I3"]],["T800",["I2","I1","I3","I5"]],["T900",["I2","I1","I3"]]
];
function makeTree(n){
 const root={name:"null",count:0,ch:{}};
 fpTransactions.slice(0,n).forEach(t=>{let cur=root;t[1].forEach(item=>{if(!cur.ch[item])cur.ch[item]={name:item,count:0,ch:{}};cur=cur.ch[item];cur.count++})});
 return root;
}
function treeLines(node,prefix="",last=true,lines=[]){
 if(node.name!=="null")lines.push(prefix+(last?"└─ ":"├─ ")+node.name+":"+node.count);
 const entries=Object.values(node.ch);
 entries.forEach((c,i)=>treeLines(c,prefix+(node.name==="null"?"":(last?"   ":"│  ")),i===entries.length-1,lines));
 return lines;
}
let fpStep=9;
function fpDraw(){
 const lab=$("#fpStepLabel"),box=$("#fpTree"),info=$("#fpStepInfo");if(!lab)return;
 lab.textContent=fpStep===0?"Start":fpStep+"/9 · after "+fpTransactions[fpStep-1][0];
 box.textContent="null\n"+treeLines(makeTree(fpStep)).join("\n");
 info.innerHTML=fpStep===0?"Insert transactions after sorting each one by global support order I2 → I1 → I3 → I4 → I5.":"Inserted <b>"+fpTransactions[fpStep-1][0]+"</b>: {"+fpTransactions[fpStep-1][1].join(", ")+"}. Shared-prefix node counts are incremented.";
}
function fpSetup(){
 if(!$("#fpPrev"))return;
 $("#fpPrev").onclick=()=>{fpStep=Math.max(0,fpStep-1);fpDraw()};
 $("#fpNext").onclick=()=>{fpStep=Math.min(9,fpStep+1);fpDraw()};
 fpDraw();
}
function metrics(){
 const b=$("#metricCalc");if(!b)return;
 b.onclick=()=>{
  const tp=+$("#tp").value,tn=+$("#tn").value,fp=+$("#fp").value,fn=+$("#fn").value,N=tp+tn+fp+fn;
  const acc=(tp+tn)/N,prec=tp/(tp+fp),rec=tp/(tp+fn),spec=tn/(tn+fp),f1=2*prec*rec/(prec+rec),fpr=fp/(fp+tn),fnr=fn/(fn+tp),npv=tn/(tn+fn);
  const den=Math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn)),mcc=den?(tp*tn-fp*fn)/den:NaN;
  const pe=((tp+fp)*(tp+fn)+(tn+fn)*(tn+fp))/(N*N),kap=(acc-pe)/(1-pe),bal=(rec+spec)/2;
  const vals=[["Accuracy",acc],["Precision",prec],["Recall / Sens.",rec],["Specificity",spec],["F1",f1],["NPV",npv],["FPR / Type I",fpr],["FNR / Type II",fnr],["MCC",mcc],["Cohen κ",kap],["Balanced acc.",bal],["Error rate",(fp+fn)/N]];
  $("#metricOut").innerHTML=vals.map(x=>'<div class="metric"><span>'+x[0]+'</span><b>'+fmt(x[1]*100,2)+'%</b></div>').join("");
 };
 b.click();
}
function cv(){
 const b=$("#cvCalc");if(!b)return;
 b.onclick=()=>{
  const n=Math.max(1,Math.floor(+$("#cvN").value||1)),mode=$("#cvMode").value;let tr,va,label;
  if(mode==="half"){tr=Math.floor(n/2);va=n-tr;label="Large-sample rule: approximately 1/2 + 1/2"}
  else if(mode==="two"){tr=Math.round(n*2/3);va=n-tr;label="Smaller-sample rule: approximately 2/3 + 1/3"}
  else{va=Math.round(n*.30);tr=n-va;label="Decision-tree code example: 70% + 30%"}
  $("#cvOut").innerHTML='<div class="metric"><span>Training</span><b>'+tr+'</b></div><div class="metric"><span>Validation / test</span><b>'+va+'</b></div><div class="metric"><span>Total</span><b>'+n+'</b></div><div class="metric"><span>Rule</span><b style="font-size:10px">'+label+'</b></div>';
 };
 b.click();
}
function id3(){
 const b=$("#id3Step");if(!b)return;
 const steps=[
  ["Start","Dataset: 14 tuples. Yes=9, No=5. Entropy(S)=0.940."],
  ["Root gains","Outlook: I=0.693, Gain=0.247 · Temperature: I=0.911, Gain=0.029 · Humidity: I=0.788, Gain=0.152 · Windy: I=0.892, Gain=0.048. Highest = Outlook."],
  ["Intermediate tree","Outlook is root. Overcast is pure Yes. Sunny and Rainy still require splitting."],
  ["Sunny branch","Sunny subset: Yes=2, No=3, Entropy=0.971. Gains: Humidity=0.971, Temperature=0.571, Windy=0.020. Choose Humidity. High→No, Normal→Yes."],
  ["Rainy branch","Rainy subset: Yes=3, No=2, Entropy=0.971. Gains: Windy=0.971, Humidity=0.020, Temperature=0.020. Choose Windy. Weak→Yes, Strong→No."],
  ["Final tree","Outlook\n├─ Overcast → YES\n├─ Sunny → Humidity\n│  ├─ High → NO\n│  └─ Normal → YES\n└─ Rainy → Windy\n   ├─ Weak → YES\n   └─ Strong → NO"]
 ];
 let s=+b.dataset.step||0;s=(s+1)%steps.length;b.dataset.step=s;
 $("#id3Title").textContent=(s+1)+"/"+steps.length+" · "+steps[s][0];
 $("#id3Text").textContent=steps[s][1];
}
function setupId3(){const b=$("#id3Step");if(!b)return;b.onclick=id3;b.dataset.step=-1;id3()}
function printCheat(){window.print()}
function init(){progress();searchSetup();scrollSpy();normalization();binning();fpSetup();metrics();cv();setupId3();$$(".copy").forEach(b=>{});}
document.addEventListener("DOMContentLoaded",init);
