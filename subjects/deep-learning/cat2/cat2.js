
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const doneKey="deep-learning-cat2-progress-v1";
let doneSet=new Set(JSON.parse(localStorage.getItem(doneKey)||"[]"));
function progress(){
  const bs=$$(".done[data-topic]");
  bs.forEach(b=>{const on=doneSet.has(b.dataset.topic);b.classList.toggle("on",on);b.textContent=on?"✓ Done":"Mark done"});
  const p=$("#ptext"),f=$("#pfill"); if(p)p.textContent=doneSet.size+" / "+bs.length;if(f)f.style.width=(bs.length?doneSet.size/bs.length*100:0)+"%";
}
document.addEventListener("click",e=>{
  if(e.target.matches(".done[data-topic]")){const k=e.target.dataset.topic;doneSet.has(k)?doneSet.delete(k):doneSet.add(k);localStorage.setItem(doneKey,JSON.stringify([...doneSet]));progress()}
  if(e.target.matches(".reveal"))e.target.closest(".quiz").classList.toggle("show");
  if(e.target.matches(".copy")){const pre=e.target.parentElement.querySelector("pre");navigator.clipboard.writeText(pre?pre.innerText:"");e.target.textContent="Copied";setTimeout(()=>e.target.textContent="Copy",900)}
});
function searchSetup(){
 const q=$("#search");if(!q)return;
 q.addEventListener("input",()=>{const v=q.value.toLowerCase().trim();$$(".searchable").forEach(s=>s.classList.toggle("hidden",!!v&&!((s.innerText||"").toLowerCase().includes(v)||(s.dataset.keywords||"").toLowerCase().includes(v))))});
}
function scrollSpy(){
 const links=$$(".nav-link"),secs=links.map(a=>$(a.getAttribute("href"))).filter(Boolean);
 addEventListener("scroll",()=>{let cur=secs[0];secs.forEach(s=>{if(s.getBoundingClientRect().top<130)cur=s});links.forEach(a=>a.classList.toggle("active",cur&&a.getAttribute("href")==="#"+cur.id))},{passive:true});
}
function fmt(x,d=4){return Number.isFinite(x)?Number(x.toFixed(d)).toString():"—"}
function convCalc(){
 const b=$("#convCalc");if(!b)return;
 const run=()=>{
  const H=+$("#inH").value,W=+$("#inW").value,Cin=+$("#inC").value,Fh=+$("#fH").value,Fw=+$("#fW").value,Cout=+$("#outC").value,P=+$("#pad").value,S=+$("#stride").value;
  const oh=Math.floor((H+2*P-Fh)/S)+1,ow=Math.floor((W+2*P-Fw)/S)+1,params=(Fh*Fw*Cin+1)*Cout,flat=Math.max(0,oh)*Math.max(0,ow)*Cout;
  $("#convOut").innerHTML=[
   ["Output H×W×C",oh+" × "+ow+" × "+Cout],
   ["Trainable params",params.toLocaleString()],
   ["Flatten size",flat.toLocaleString()],
   ["Per filter",Fh*Fw*Cin+" weights + 1 bias"]
  ].map(x=>'<div class="metric"><span>'+x[0]+'</span><b>'+x[1]+'</b></div>').join("");
 };
 b.onclick=run;
 const p=$("#convPreset");if(p)p.onclick=()=>{$("#inH").value=100;$("#inW").value=100;$("#inC").value=3;$("#fH").value=3;$("#fW").value=3;$("#outC").value=10;$("#pad").value=2;$("#stride").value=1;run()};
 run();
}
function poolCalc(){
 const b=$("#poolCalc");if(!b)return;
 b.onclick=()=>{
  const H=+$("#pH").value,W=+$("#pW").value,C=+$("#pC").value,F=+$("#pF").value,S=+$("#pS").value,P=+$("#pP").value;
  const oh=Math.floor((H+2*P-F)/S)+1,ow=Math.floor((W+2*P-F)/S)+1;
  $("#poolOut").innerHTML='<div class="metric"><span>Output</span><b>'+oh+' × '+ow+' × '+C+'</b></div><div class="metric"><span>Trainable params</span><b>0</b></div><div class="metric"><span>Spatial reduction</span><b>'+fmt(H*W/(oh*ow),2)+'×</b></div><div class="metric"><span>Channels</span><b>'+C+' unchanged</b></div>';
 };b.click();
}
const rnnSteps=[
 ["Given","x₁=1, x₂=0.5, x₃=0.5; Wₓ=1.8; Wₕ=0.5; Wᵧ=1.1; b=0; h₀=0; activation=σ(z)=1/(1+e⁻ᶻ)."],
 ["t=1","h₁=σ(1.8·1 + 0.5·0)=σ(1.8)≈0.858. y₁=1.1·0.858≈0.944."],
 ["t=2","h₂=σ(1.8·0.5 + 0.5·0.858)=σ(1.329)≈0.791. y₂≈1.1·0.791≈0.870."],
 ["t=3","h₃=σ(1.8·0.5 + 0.5·0.791)=σ(1.2955)≈0.785. y₃≈1.1·0.785≈0.864."],
 ["Argmax","Slides frame a 2-class output as +Wᵧh₃ versus −Wᵧh₃: +0.8636 > −0.8636, so argmax selects Class A."]
];
let rnnStep=0;
function drawRnn(){if(!$("#rnnStepTitle"))return;$("#rnnStepTitle").textContent=(rnnStep+1)+"/"+rnnSteps.length+" · "+rnnSteps[rnnStep][0];$("#rnnStepText").textContent=rnnSteps[rnnStep][1]}
function rnnSetup(){
 if(!$("#rnnNext"))return;$("#rnnPrev").onclick=()=>{rnnStep=(rnnStep-1+rnnSteps.length)%rnnSteps.length;drawRnn()};$("#rnnNext").onclick=()=>{rnnStep=(rnnStep+1)%rnnSteps.length;drawRnn()};drawRnn();
}
const archData={
 "LeNet-5":["1998 · handwritten digits / MNIST","7-layer classic template; trainable-weight layers give the '5' name","5×5 convs, average pooling, tanh","C1 6 filters → S2 → C3 16 → S4 → C5 120 → F6 84 → 10 outputs"],
 "AlexNet":["2012 · ImageNet winner","5 convolution + 2 fully-connected layers in the supplied architecture summary","ReLU, overlapped max-pooling, dropout/L2, data augmentation, two-GPU training","≈60M parameters; early layers compute-heavy, FC layers parameter-heavy"],
 "VGG":["2014 · VGG-16 / VGG-19","Simple deep sequential network","Mostly 3×3 conv, stride 1, pad 1; 2×2 max-pool stride 2","Very high parameter/memory cost; source comparison labels VGG highest memory/operations"],
 "GoogLeNet":["2014 · Inception v1","≈22 learnable layers; parallel branches inside Inception modules","1×1, 3×3, 5×5 + pooling in parallel; 1×1 reductions; global average pooling","High computational efficiency; far fewer parameters than VGG"],
 "ResNet":["2015 · residual learning","Stack residual blocks; source lists ResNet-18/34/50/101/152","Skip connection y=F(x)+x; downsample with stride 2 and increase filters periodically","Addresses degradation and improves gradient flow in very deep networks"]
};
function archSetup(){
 const buttons=$$("[data-arch]"); if(!buttons.length)return;
 const draw=k=>{buttons.forEach(b=>b.classList.toggle("active",b.dataset.arch===k));const a=archData[k];$("#archOut").innerHTML='<h3>'+k+'</h3><div class="grid2">'+a.map((x,i)=>'<div class="card"><span class="tag">'+["Identity","Structure","Key mechanics","Exam memory"][i]+'</span><p>'+x+'</p></div>').join("")+'</div>'};
 buttons.forEach(b=>b.onclick=()=>draw(b.dataset.arch));draw("LeNet-5");
}
const lstmGates={
 "forget":["Forget gate fₜ","Decides how much old cell memory Cₜ₋₁ to keep.","fₜ = σ(Wf xₜ + Uf hₜ₋₁ + b_f)","fₜ≈1 → keep; fₜ≈0 → forget."],
 "input":["Input gate iₜ + candidate C̃ₜ","Controls how much new candidate information enters memory.","iₜ = σ(Wi xₜ + Ui hₜ₋₁ + b_i)\\nC̃ₜ = tanh(Wc xₜ + Uc hₜ₋₁ + b_c)","Gate chooses amount; candidate proposes the new content."],
 "cell":["Cell-state update Cₜ","Combines retained old memory and accepted new memory.","Cₜ = fₜ ⊙ Cₜ₋₁ + iₜ ⊙ C̃ₜ","This is the long-term memory path."],
 "output":["Output gate oₜ + hidden hₜ","Chooses what part of the updated cell state is exposed.","oₜ = σ(Wo xₜ + Uo hₜ₋₁ + b_o)\\nhₜ = oₜ ⊙ tanh(Cₜ)","hₜ is the current short-term/output state."]
};
function lstmSetup(){
 const bs=$$("[data-lstm]");if(!bs.length)return;
 const draw=k=>{bs.forEach(b=>b.classList.toggle("active",b.dataset.lstm===k));const x=lstmGates[k];$("#lstmGate").innerHTML='<h3>'+x[0]+'</h3><p>'+x[1]+'</p><div class="formula">'+x[2].replace(/\\n/g,"<br>")+'</div><p class="tiny">'+x[3]+'</p>'};bs.forEach(b=>b.onclick=()=>draw(b.dataset.lstm));draw("forget");
}
const gruGates={
 "update":["Update gate zₜ","How much old memory to keep versus how much new candidate to use.","zₜ = σ(Wz xₜ + Uz hₜ₋₁ + b_z)"],
 "reset":["Reset gate rₜ","How much previous hidden state to forget while building the candidate.","rₜ = σ(Wr xₜ + Ur hₜ₋₁ + b_r)"],
 "candidate":["Candidate h̃ₜ","Candidate new hidden content, using reset-filtered old state.","h̃ₜ = tanh(Wh xₜ + Uh(rₜ ⊙ hₜ₋₁) + b_h)"],
 "final":["Final hidden hₜ","Blend old state and candidate using the update gate.","hₜ = (1−zₜ)⊙hₜ₋₁ + zₜ⊙h̃ₜ"]
};
function gruSetup(){
 const bs=$$("[data-gru]");if(!bs.length)return;
 const draw=k=>{bs.forEach(b=>b.classList.toggle("active",b.dataset.gru===k));const x=gruGates[k];$("#gruGate").innerHTML='<h3>'+x[0]+'</h3><p>'+x[1]+'</p><div class="formula">'+x[2]+'</div>'};bs.forEach(b=>b.onclick=()=>draw(b.dataset.gru));draw("update");
}
let maskStep=0;
function bertMask(){
 const b=$("#maskNext");if(!b)return;
 const modes=[
  ["80% MASK","This is going to be so long → This is going to be [MASK] long"],
  ["10% random","This is going to be so long → This is going to be random-word long"],
  ["10% unchanged","This is going to be so long → This is going to be so long"]
 ];
 const draw=()=>{$("#maskMode").textContent=modes[maskStep][0];$("#maskText").textContent=modes[maskStep][1]};
 b.onclick=()=>{maskStep=(maskStep+1)%modes.length;draw()};draw();
}
function printCheat(){window.print()}
function init(){progress();searchSetup();scrollSpy();convCalc();poolCalc();rnnSetup();archSetup();lstmSetup();gruSetup();bertMask();}
document.addEventListener("DOMContentLoaded",init);
