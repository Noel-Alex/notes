(function deepLearningVisualStudio(){
'use strict';
const app=document.getElementById('app');
const raw=document.getElementById('course-data');
if(!app||!raw)return;
let course;
try{course=JSON.parse(raw.textContent)}catch(e){return}
const lessons=course.lessons||[];
const guide=(window.EASY_EDITION_CONFIG||{}).guides||[];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const fmt=(n,d=3)=>Number(n).toFixed(d).replace(/\.?0+$/,'')||'0';
const specs=[
"Inputs~Read the input features x₁ and x₂.|Weights~Multiply each input by its own weight.|Bias~Add a learned offset.|Activation~Transform the sum to produce an output.",
"Inputs~Use binary 0 or 1 inputs.|Threshold~Calculate the weighted sum and compare with θ.|AND / OR~Different thresholds create different gates.|Limitation~A single linear threshold cannot represent XOR.",
"Preactivation~Start with z from weights and bias.|Nonlinearity~ReLU and sigmoid transform z differently.|Derivative~Slope controls local gradient flow.|Choice~Use an appropriate activation for the layer.",
"Features~Input layer receives the data.|Hidden layers~Learn intermediate representations.|Output~Produce a task-dependent prediction.|Parameters~Weights connect layers; biases belong to neurons.",
"Prediction~First calculate the network output.|Target~Compare with the correct label.|Loss~Quantify the mismatch.|Update~Training reduces loss through gradients.",
"Layer 1~Compute z¹=W¹x+b¹.|Activation~Apply the nonlinearity elementwise.|Layer 2~Use h¹ as the next input.|Prediction~Finish with the output activation.",
"Prediction~Calculate the forward output first.|Error~Determine the output loss derivative.|Chain rule~Propagate error through earlier layers.|Update~Subtract learning rate × gradient.",
"Loss curve~Parameters occupy a point on a loss surface.|Slope~Gradient shows which way loss rises.|Step~Move opposite the gradient.|Repeat~Recalculate the slope at the new point.",
"Underfit~Too simple to learn the training pattern.|Good fit~Captures the relationship without memorizing noise.|Overfit~Memorizes training examples; validation error rises.|Repair~Use regularization, data or simpler capacity.",
"Forward~Compute output and loss.|Backward~Apply chain rule for derivatives.|Update~Change trainable parameters.|Explain~Show each important intermediate number.",
"Full batch~One update using the whole dataset.|Stochastic~One update per example.|Mini-batch~One update per subset.|Epoch~One pass through the training examples.",
"Observation~Receive a new gradient gₜ.|Memory~Weight past estimate by β.|New signal~Weight new gradient by (1−β).|Average~Combine them into vₜ.",
"Gradient~Find current slope.|Momentum~Accumulate a smoothed direction.|Update~Move in that direction.|Nesterov~Estimate slope at a look-ahead point.",
"Squared gradient~Large magnitudes contribute strongly.|Moving average~Accumulate second moments.|Divide~Normalize the update by root of average.|Effect~Coordinate-wise step size adapts.",
"First moment~Exponential average of gradients.|Second moment~Exponential average of squared gradients.|Bias correction~Correct early estimates near zero.|Update~Use first moment over root second moment.",
"Symptom~Inspect loss and validation behavior.|Learning rate~Tune unstable or slow updates.|Capacity~Adjust layers, width and regularization.|Evidence~Justify settings using validation data.",
"Batch statistics~Estimate mini-batch mean and variance.|Normalize~Subtract mean and divide by standard deviation.|Affine~Learn scale γ and shift β.|Inference~Use stored moving statistics during test.",
"Logits~One score for each class.|Exponentials~Convert scores to positive values.|Normalize~Divide by total to get probabilities.|Cross-entropy~Penalize low probability of true class.",
"Original example~Start from a labeled sample.|Transform~Flip, crop, rotate or jitter meaningfully.|Label~Preserve a valid target.|Generalization~Learn invariances rather than memorizing pixels.",
"L1~Penalizes absolute weight values.|L2~Penalizes squared weights.|Dropout~Randomly masks selected training activations.|Early stopping~Stop when validation performance degrades.",
"Diagnose~Find the main training issue.|Choose~Select optimizer, regularization or normalization.|Reason~Explain why the method fits.|Verify~Check a relevant validation metric.",
"Input image~Neighboring pixels carry spatial patterns.|Local filter~A small kernel observes a receptive field.|Weight sharing~One filter scans many locations.|Feature map~Outputs indicate where a pattern appears.",
"Select patch~Overlay kernel on input cells.|Multiply~Multiply matching cell and weight.|Sum~Add products to produce one output.|Slide~Repeat across valid positions.",
"Input N~Start with spatial width or height.|Kernel K~Determine receptive window size.|Padding P~Add border pixels.|Stride S~Choose jump per step.|Output~Apply the shape equation.",
"Kernel~K×K weights per input channel.|Channels~Multiply by number of input channels.|Bias~One bias per output filter.|Filters~Multiply by output channels; not output pixels.",
"Input 100×100~Track dimensions through each layer.|Convolution~Apply kernel, padding and stride.|Pooling~Reduce spatial dimensions.|Flatten~Multiply remaining dimensions.|Dense~Count weights and biases.",
"Convolution~Produces localized features.|Activation~Applies nonlinear transformation.|Pooling~Aggregates nearby cells.|Head~Flatten or pool globally, then predict.",
"Input~Original image pixels.|Conv + pool~Early local feature detection.|Deeper conv~Combine low-level features.|Dense output~Predict image class.",
"Large filters~Early AlexNet layers use broad kernels.|Convolution~Deeper stages extract features.|Pooling~Reduce feature-map sizes.|Classification~Dense layers form class scores.",
"3×3 block~One small filter has limited receptive field.|Stack~Repeating 3×3 expands receptive field.|Nonlinearity~More activations increase expressivity.|Parameters~Small kernels often require fewer parameters.",
"Shared input~Branch from one feature map.|1×1~Reduce channel dimensionality.|3×3 / 5×5~Extract multiple spatial scales.|Concatenate~Join branch channels.",
"Input x~Pass activations to a residual block.|F(x)~Learn a residual transformation.|Skip~Carry x around the block.|Add~Form y=F(x)+x.",
"Shapes~Calculate dimension changes first.|Parameters~Count unique learned weights.|Architecture~Explain the chosen network design.|Answer~Give consistent final shapes and counts.",
"Input xₜ~Read the current element of a sequence.|Previous hidden~Bring information from t−1.|Recurrence~Combine current input and memory.|New hidden~Pass state to the next time step.",
"One-to-one~A single input maps to an output.|Many-to-one~Summarize a sequence for classification.|One-to-many~Generate an output sequence.|Many-to-many~Produce aligned or decoded outputs.",
"Token~Represent input at time t.|Hidden state~Combine input and previous state.|Output~Produce the time-step prediction.|Unroll~Repeat the same cell over time.",
"Unroll~View RNN as copies across time.|Final loss~Start derivatives at prediction.|Time gradients~Propagate backward through recurrence.|Shared weights~Sum gradient contributions across time.",
"Repeated products~BPTT multiplies Jacobians across steps.|Small norms~Gradients shrink across long distances.|Large norms~Gradients explode.|Mitigation~Gates and gradient clipping help.",
"Forward RNN~Read left to right.|Backward RNN~Read right to left.|Combine~Concatenate or merge hidden states.|Limit~Future context needs the whole sequence.",
"Encoder~Compress source sequence into representations.|Context~Pass information to decoder.|Decoder~Generate target sequence.|Attention~Optionally select source states at each step.",
"Input~Provide example to reconstruct.|Encoder~Compress to a latent representation.|Bottleneck~Force useful feature learning.|Decoder~Reconstruct original input.",
"Layer 1~First recurrent layer processes sequence.|Layer 2~Receives hidden outputs from layer 1.|Temporal links~Each layer also recurs through time.|Capacity~Deeper layers learn richer sequence features.",
"Query~Represent what one token needs.|Keys~Measure relevance of other tokens.|Scores~Calculate similarities and normalize.|Values~Combine information using attention weights.",
"Architecture~Identify whether recurrence is causal or bidirectional.|State~Track time steps and shapes.|Training~Explain BPTT and gradients.|Comparison~Mention attention and memory trade-offs.",
"Short memory~Vanilla RNN can lose distant context.|Repeated gradients~Long BPTT becomes unstable.|Gating~Control which information persists.|Benefit~Longer useful dependencies.",
"Input~Feed sequence to a fixed recurrent reservoir.|Reservoir~Untrained recurrent dynamics create features.|Readout~Train the final linear mapping.|Trade-off~Training is simpler; reservoir is fixed.",
"Old cell~Memory cₜ₋₁ enters.|Forget gate~Decides how much old memory stays.|Input gate~Controls candidate information written.|Output gate~Controls visible hidden state.",
"Forget~Compute fₜcₜ₋₁.|Write~Compute iₜgₜ.|Cell~Add old and new contributions.|Hidden~Multiply tanh(cell) by output gate.",
"Update gate~Controls retention and replacement.|Reset gate~Controls prior information in candidate.|Candidate~Compute proposed hidden state.|Blend~Mix old state and candidate.",
"Vanilla RNN~Single simple recurrent hidden state.|LSTM~Separate cell state and three main gates.|GRU~Combines memory and hidden state with fewer gates.|Choose~Compare complexity and long-context ability.",
"Gradient~Compute raw vector.|Norm~Measure its magnitude.|Threshold~Limit overly large magnitude.|Direction~Scale without changing direction when clipping.",
"Query~What information is needed now?|Memory~A set of external representations.|Attention~Weight useful memory locations.|Read~Combine selected values for prediction.",
"Dependency~Recognize the long-context challenge.|Architecture~Choose RNN, LSTM or GRU.|Equations~Write gate or recurrent update.|Explain~Show why memory is preserved.",
"Pretrained model~Begin with learned features.|Freeze~Keep backbone parameters unchanged.|Head~Train task-specific output layer.|Fine-tune~Optionally unfreeze later layers.",
"Generator~Create synthetic examples from noise.|Discriminator~Judge real versus generated.|Feedback~Train both in opposition.|Result~Improve distribution realism.",
"Vanilla GAN~Original adversarial framework.|Conditional GAN~Control generation using a label.|DCGAN~Use convolutional architectures.|Trade-off~Discuss instability or mode collapse.",
"Classification~Return image-level label.|Detection~Find object classes and boxes.|Localization~Estimate position and size.|Metric~Evaluate overlap with IoU.",
"Proposals~Generate candidate regions.|CNN~Extract features for regions.|Classifier~Identify object classes.|Regressor~Refine bounding boxes.",
"R-CNN~Run CNN for individual proposals.|Fast R-CNN~Share CNN feature computation.|Faster R-CNN~Use trainable proposal network.|Result~Higher reuse and lower redundant work.",
"Image~Input to shared backbone.|Grid / locations~Predict candidate boxes and classes.|Confidence~Score proposed objects.|NMS~Suppress overlapping duplicate predictions.",
"Feature maps~Use multiple resolutions.|Anchors~Predict offsets and categories.|One pass~Detect at multiple scales.|NMS~Remove redundant predictions.",
"Box A~Ground-truth or predicted rectangle.|Box B~Second rectangle.|Intersection~Area contained in both.|Union~Area of either box.|IoU~Intersection divided by union.",
"Task~Choose classification or detection.|Architecture~Compare proposal and one-stage methods.|Output~Explain class and box predictions.|Evaluate~Report IoU, precision or recall.",
"State~What agent currently observes.|Policy~Rule for selecting an action.|Reward~Feedback after action.|Environment~Transitions to next state.",
"Reward~Immediate gain after an action.|Discount γ~Value future rewards less if γ<1.|Value V~Expected cumulative return.|Bellman~Relate a value to future values.",
"Old Q~Current action-value estimate.|Target~Immediate reward + discounted best future value.|TD error~Target minus old value.|Update~Add learning rate × TD error.",
"Explore~Sample actions to discover rewards.|Exploit~Choose current best action.|ε-greedy~Mix random and greedy actions.|Decay~Reduce random exploration gradually.",
"Q network~Predict values for actions.|Replay~Sample stored transitions to reduce correlation.|Target network~Stabilize bootstrap targets.|Update~Fit prediction to Bellman target.",
"Policy π~Assign probabilities to actions.|Sample~Act using current policy.|Return~Estimate quality of action.|Gradient~Increase probability of good actions.",
"Actor~Learns what action to take.|Critic~Estimates value of state/action.|Advantage~Compare action with baseline.|Update~Use critic feedback to improve actor.",
"Workers~Gather trajectories in parallel.|Local agents~Explore varied experiences.|Asynchronous~Send gradients to shared parameters.|Trade-off~Efficiency with update staleness.",
"Dynamics~Learn or assume transition model.|Simulate~Evaluate hypothetical action paths.|Plan~Choose promising sequence.|Act~Execute and update model.",
"Sparse rewards~Feedback may be rare.|Exploration~Unknown states require trying actions.|Instability~Bootstrapping can diverge.|Safety~Deployment needs constraints and evaluation."
];
const topics=specs.map(x=>x.split('|').map(z=>{const p=z.split('~');return {name:p[0],detail:p.slice(1).join('~')}}));
const groups=[
{n:'Neurons & Backprop',icon:'∑',ids:[0,2,5,6,7],desc:'See the forward pass before calculating the gradient'},
{n:'Optimization',icon:'↘',ids:[10,13,14,16,17],desc:'Understand why optimizer updates differ'},
{n:'CNN Calculations',icon:'▦',ids:[21,22,23,25,26],desc:'Move a kernel and calculate output shapes'},
{n:'Sequence Models',icon:'⤳',ids:[33,35,36,37,42],desc:'Unroll hidden states and trace gradients'},
{n:'Long-term Memory',icon:'◎',ids:[45,46,47,48,50],desc:'Understand how gating stores information'},
{n:'Detection & Generative',icon:'▣',ids:[53,54,57,59,61],desc:'Follow architectures and compare box overlap'},
{n:'Reinforcement',icon:'↻',ids:[63,64,65,67,69],desc:'See the agent loop and Q-value updates'}
];
let saved={};
try{saved=JSON.parse(localStorage.getItem('dl-visual-mastered-v2')||'{}')||{}}catch(e){}
const ui={id:-1,stage:{},values:{},revealed:{},pref:'focus'};
function persist(){try{localStorage.setItem('dl-visual-mastered-v2',JSON.stringify(saved))}catch(e){}}
function stageNum(id){return clamp(ui.stage[id]||0,0,(topics[id]||[]).length-1)}
function labType(id){
 if([0,3,5,6,9].includes(id))return 'neuron';
 if(id===2)return 'activation';
 if(id===17)return 'softmax';
 if([4].includes(id))return 'loss';
 if([7,15].includes(id))return 'descent';
 if([8,19].includes(id))return 'fit';
 if(id===37)return 'vanish';
 if([21,22].includes(id))return 'convolution';
 if(id===26)return 'pool';
 if([23,24,25,28,32].includes(id))return 'shapes';
 if([33,34,35,36,38,39,40,41,43,44].includes(id))return 'sequence';
 if([42,51].includes(id))return 'attention';
 if([46,47,52].includes(id))return 'memory';
 if(id===48)return 'gru';
 if([56,57,58,59,60,61,62].includes(id))return 'boxes';
 if([64,65,67].includes(id))return 'qlearning';
 return null;
}
const defaults={
 neuron:{x:2,w:0.5,b:0.2},activation:{x:0,mode:'relu'},softmax:{a:2,b:1,c:0},loss:{y:1,p:0.6},descent:{w:7,rate:0.2,steps:2},fit:{capacity:4},vanish:{factor:.6,depth:8},
 convolution:{patch:0,filter:'edge'},pool:{top:0,mode:'max'},shapes:{n:8,k:3,p:0,s:1,channels:3,filters:8},
 sequence:{t:2,carry:0.6},attention:{q:1,k1:1,k2:0,k3:-1},
 memory:{f:0.7,i:0.6,g:0.8,o:0.9,prev:0.5},gru:{z:.7,h:.6,candidate:.2},boxes:{offset:1},
 qlearning:{old:4,alpha:0.5,reward:3,gamma:0.9,next:6}
};
function config(id){const t=labType(id);if(!t)return {};return ui.values[id]||(ui.values[id]={...defaults[t]})}
function slider(id,key,label,min,max,step){
 const v=config(id)[key];return `<label class="vsl-range"><span>${esc(label)} <strong>${fmt(v,2)}</strong></span><input aria-label="${esc(label)}" data-vsl-input="${esc(key)}" type="range" min="${min}" max="${max}" step="${step}" value="${v}"></label>`;
}
function specialArchitectureDiagram(id){
const node=(name)=>`<span class="vsl-dnode">${name}</span>`,arr='<span class="vsl-arrow">→</span>';
if(id===29)return `<div class="vsl-textdiagram">${node('3×3 conv')}${arr}${node('ReLU')}${arr}${node('3×3 conv')}${arr}${node('ReLU')}${arr}${node('3×3 conv')}<p class="vsl-diagram-caption">VGG stacks small filters to build a larger receptive field.</p></div>`;
if(id===30)return `<div class="vsl-parallel"><div class="vsl-dnode">One input tensor</div><div class="vsl-branch-tracks"><span>1×1 conv</span><span>1×1 → 3×3</span><span>1×1 → 5×5</span><span>Pooling → 1×1</span></div><div class="vsl-dnode">Concatenate channels</div></div>`;
if(id===31)return `<div class="vsl-parallel"><div class="vsl-dnode">Input x</div><div class="vsl-branch-tracks"><span>Residual branch: F(x)</span><span>Identity shortcut: x</span></div><div class="vsl-dnode">Add: y = F(x) + x</div></div>`;
if(id===37)return `<svg class="vsl-figure" viewBox="0 0 348 142" role="img" aria-label="Gradient magnitude shrinks as it flows backward through time"><text x="8" y="16" fill="var(--muted)" font-size="11">Backpropagation across time</text>${[78,58,41,26,15].map((w,i)=>`<rect x="${15+i*66}" y="${115-w}" width="39" height="${w}" rx="4" fill="var(--teal)" fill-opacity="${1-i*.13}"/><text x="${35+i*66}" y="131" font-size="11" fill="var(--muted)" text-anchor="middle">t−${i}</text>`).join('')}</svg>`;
if(id===38)return `<div class="vsl-parallel"><div class="vsl-dnode">Input sequence: A B C</div><div class="vsl-branch-tracks"><span>Forward hidden: A → B → C</span><span>Backward hidden: A ← B ← C</span></div><div class="vsl-dnode">Combine both contexts</div></div>`;
if(id===39)return `<div class="vsl-parallel"><div class="vsl-dnode">Source tokens x₁, x₂, …, xₜ</div><div class="vsl-dnode">ENCODER · RNN/GRU/LSTM hidden states h₁…hₜ</div><div class="vsl-branch-tracks"><span>Classic: final context hₜ</span><span>Attention: weighted access to all encoder states</span></div><div class="vsl-dnode">DECODER · previous token + context + decoder hidden state</div><div class="vsl-dnode">Target tokens y₁, y₂, …, yᵤ (possibly U ≠ T)</div></div>`;
if(id===40)return `<div class="vsl-textdiagram">${node('Original input')}${arr}${node('Encoder')}${arr}${node('Small latent code')}${arr}${node('Decoder')}${arr}${node('Reconstructed input')}</div>`;
if(id===42)return `<div class="vsl-parallel"><div class="vsl-dnode">[CLS] + token embeddings + positions (+ segment IDs)</div><div class="vsl-dnode">Transformer ENCODER block × L</div><div class="vsl-branch-tracks"><span>Bidirectional multi-head self-attention</span><span>Residual + LayerNorm</span><span>Feed-forward network + residual/normalization</span></div><div class="vsl-dnode">Contextual token states → task-specific head</div><p class="vsl-diagram-caption">BERT is encoder-only. A generative encoder–decoder Transformer additionally has a decoder; do not draw one as part of BERT itself.</p></div>`;
if(id===51)return `<div class="vsl-parallel"><div class="vsl-dnode">Tokens / representations</div><div class="vsl-branch-tracks"><span>Query Q · What am I looking for?</span><span>Key K · How relevant is each token?</span><span>Value V · What information is available?</span></div><div class="vsl-dnode">softmax(QKᵀ/√dₖ) V</div></div>`;
if(id===45)return `<div class="vsl-parallel"><div class="vsl-dnode">Sequence input xₜ</div><div class="vsl-dnode">Fixed recurrent reservoir · W_in, W_res</div><div class="vsl-branch-tracks"><span>State feedback hₜ₋₁ → hₜ</span><span>Rich nonlinear sequence features</span></div><div class="vsl-dnode">TRAINED readout W_out → prediction</div><p class="vsl-diagram-caption">Typical ESN: train the readout, not the random recurrent reservoir.</p></div>`;
if(id===46||id===47)return `<div class="vsl-parallel"><div class="vsl-dnode">Previous memory cₜ₋₁</div><div class="vsl-branch-tracks"><span>Forget: fₜ × cₜ₋₁</span><span>Write: iₜ × gₜ</span></div><div class="vsl-dnode">New cell cₜ = old + new</div><div class="vsl-dnode">Hidden hₜ = oₜ × tanh(cₜ)</div></div>`;
if(id===48)return `<div class="vsl-parallel"><div class="vsl-dnode">Previous hidden state</div><div class="vsl-branch-tracks"><span>Reset gate r controls candidate</span><span>Update gate z controls retention</span></div><div class="vsl-dnode">Mix old hidden and candidate</div></div>`;
if(id===50)return `<div class="vsl-textdiagram">${node('Gradient g')}${arr}${node('Compute ‖g‖₂')}${arr}${node('Scale if over limit')}${arr}${node('Same direction · lower norm')}</div>`;
if(id===57)return `<div class="vsl-textdiagram">${node('Image')}${arr}${node('Selective search proposals')}${arr}${node('CNN EACH region')}${arr}${node('SVM / class + box regressor')}</div><p class="vsl-diagram-caption">Original R-CNN reruns CNN feature extraction per proposal: expensive.</p>`;
if(id===58)return `<div class="vsl-textdiagram">${node('Image')}${arr}${node('CNN once: shared feature map')}${arr}${node('External proposals + RoI pooling')}${arr}${node('Class + box head')}</div><p class="vsl-diagram-caption">Fast R-CNN shares convolution but still needs external proposals. Faster R-CNN introduces the learned RPN.</p>`;
if(id===54||id===55)return `<div class="vsl-parallel"><div class="vsl-dnode">Noise z → Generator G → fake sample G(z)</div><div class="vsl-branch-tracks"><span>Real examples x ∼ training data</span><span>Generated examples G(z)</span></div><div class="vsl-dnode">Discriminator D · real/fake score</div><div class="vsl-dnode">Train D to discriminate · train G using discriminator feedback</div></div>`;
if(id===36)return `<div class="vsl-parallel"><div class="vsl-dnode">Forward RNN: x₁→h₁→h₂→…→hₜ→loss</div><div class="vsl-branch-tracks"><span>Backpropagate gradient: ∂L/∂hₜ → … → ∂L/∂h₁</span><span>Accumulate gradient for shared W across all t</span></div><div class="vsl-dnode">Update shared recurrent weights once per optimization step</div></div>`;
if(id===59)return `<div class="vsl-textdiagram">${node('Full image')}${arr}${node('Single network pass')}${arr}${node('Box + class predictions')}${arr}${node('NMS')}</div>`;
if(id===60)return `<div class="vsl-textdiagram">${node('Image')}${arr}${node('Multi-scale feature maps')}${arr}${node('Anchor offsets + classes')}${arr}${node('NMS')}</div>`;
if(id===67)return `<div class="vsl-parallel"><div class="vsl-dnode">Experience (s,a,r,s′)</div><div class="vsl-branch-tracks"><span>Replay buffer → mini-batch</span><span>Target network → stable Q target</span></div><div class="vsl-dnode">Fit online Q network</div></div>`;
if(id===69||id===70)return `<div class="vsl-parallel"><div class="vsl-dnode">State s</div><div class="vsl-branch-tracks"><span>Actor: policy π(a|s)</span><span>Critic: estimate V(s)</span></div><div class="vsl-dnode">Advantage guides policy update</div></div>`;
return '';
}
function svgNodes(id){
 const special=specialArchitectureDiagram(id);if(special)return special;
 const type=labType(id);const n=topics[id]||[];
 if(type==='neuron'){
 const x1=65,x2=65,h=177,o=286;return `<svg class="vsl-figure" viewBox="0 0 348 186" role="img" aria-label="Inputs flow to weighted sum, activation and output">
 <g stroke="currentColor" stroke-opacity=".3" stroke-width="2"><path d="M87 47 L155 95 M87 141 L155 95 M200 95 L259 95"/></g>
 ${[[65,47,'x₁'],[65,141,'x₂'],[177,95,'Σ'],[285,95,'ŷ']].map(([x,y,t])=>`<circle cx="${x}" cy="${y}" r="26" fill="var(--tint)" stroke="var(--teal)" stroke-width="2"/><text x="${x}" y="${y+5}" font-size="15" font-weight="700" fill="var(--ink)" text-anchor="middle">${t}</text>`).join('')}
 <g fill="var(--muted)" font-size="11"><text x="107" y="53">× w₁</text><text x="107" y="132">× w₂</text><text x="214" y="85">activate</text><text x="162" y="148">+ bias</text></g></svg>`;
 }
 if(type==='convolution'||type==='shapes'||(id>=21&&id<=32)){
 const grid=Array.from({length:25},(_,i)=>`<rect x="${30+i%5*25}" y="${16+Math.floor(i/5)*25}" width="23" height="23" rx="3" fill="${i%3===0?'var(--tint)':'var(--paper)'}" stroke="var(--teal)" stroke-opacity=".65"/>`).join('');
 return `<svg class="vsl-figure" viewBox="0 0 348 160" role="img" aria-label="Convolutional filter moves across input image to create a feature map"><g>${grid}<rect x="54" y="40" width="51" height="51" rx="3" fill="var(--gold)" fill-opacity=".14" stroke="var(--coral)" stroke-width="2"/></g><path d="M165 82 H215" stroke="var(--ink)" stroke-width="2"/><path d="m208 74 10 8-10 8" fill="none" stroke="var(--ink)" stroke-width="2"/><g fill="var(--tint)" stroke="var(--teal)"><rect x="237" y="38" width="65" height="65" rx="5"/><path d="M237 59h65M237 81h65M258 38v65M280 38v65"/></g><g fill="var(--muted)" font-size="11" text-anchor="middle"><text x="85" y="153">Input pixels</text><text x="270" y="123">Feature map</text></g></svg>`;
 }
 if(type==='sequence'||type==='memory'||type==='attention'||(id>=33&&id<=52)){
 return `<svg class="vsl-figure" viewBox="0 0 348 155" role="img" aria-label="A sequence model carries hidden state across time steps">
 ${[70,171,272].map((x,i)=>`<g><rect x="${x-29}" y="38" width="58" height="58" rx="12" fill="var(--tint)" stroke="var(--teal)" stroke-width="2"/><text x="${x}" y="70" fill="var(--ink)" text-anchor="middle" font-weight="700">h${i+1}</text><text x="${x}" y="126" fill="var(--muted)" text-anchor="middle" font-size="11">time ${i+1}</text><path d="M${x} 113 V98" stroke="var(--coral)" stroke-width="2"/></g>`).join('')}
 <path d="M102 67 H139 M203 67 H240" fill="none" stroke="var(--ink)" stroke-width="2"/><path d="m132 60 8 7-8 7 m101-14 8 7-8 7" fill="none" stroke="var(--ink)" stroke-width="2"/></svg>`;
 }
 if(id===53)return '<div class="vsl-textdiagram"><span class="vsl-dnode">Pretrained features</span><span class="vsl-arrow">→</span><span class="vsl-dnode">Frozen backbone</span><span class="vsl-arrow">→</span><span class="vsl-dnode">Task-specific head</span></div>';
 
 if(type==='boxes'||(id>=56&&id<=62)){
 return `<svg class="vsl-figure" viewBox="0 0 348 155" role="img" aria-label="Object detection compares and predicts bounding boxes"><rect x="68" y="18" width="210" height="119" rx="10" fill="var(--tint)" stroke="var(--line)" stroke-width="2"/><rect x="109" y="37" width="105" height="80" rx="4" fill="none" stroke="var(--teal)" stroke-width="3"/><rect x="145" y="54" width="96" height="65" rx="4" fill="none" stroke="var(--coral)" stroke-width="3"/><text x="73" y="151" fill="var(--muted)" font-size="10">Overlap = intersection / union</text></svg>`;
 }
 if(type==='qlearning'||id>=63){
 return `<svg class="vsl-figure" viewBox="0 0 348 156" role="img" aria-label="Agent chooses action, environment returns reward and next state"><rect x="19" y="51" width="121" height="53" rx="11" fill="var(--tint)" stroke="var(--teal)" stroke-width="2"/><text x="80" y="83" fill="var(--ink)" font-weight="700" text-anchor="middle">Agent</text><rect x="207" y="51" width="121" height="53" rx="11" fill="var(--tint)" stroke="var(--coral)" stroke-width="2"/><text x="267" y="83" fill="var(--ink)" font-weight="700" text-anchor="middle">Environment</text><path d="M140 64 H207 M207 92 H140" fill="none" stroke="var(--ink)" stroke-width="2"/><text x="174" y="53" fill="var(--muted)" font-size="10" text-anchor="middle">action</text><text x="174" y="119" fill="var(--muted)" font-size="10" text-anchor="middle">state + reward</text></svg>`;
 }
 const labels=(topics[id]||[]).slice(0,4).map(x=>x.name);
 return `<div class="vsl-textdiagram" role="img" aria-label="${esc(labels.join(' then '))}">${labels.map((x,i)=>`<span class="vsl-dnode">${esc(x)}</span>${i<labels.length-1?'<span class="vsl-arrow">→</span>':''}`).join('')}</div>`;
}
function matrix(a,w,active=[]){return `<div class="vsl-matrix" style="grid-template-columns:repeat(${w},minmax(29px,1fr))">${a.map((v,i)=>`<span class="${active.includes(i)?'active':''}">${fmt(v,1)}</span>`).join('')}</div>`}
function additionalVisualLab(id,type,v){
let controls='',output='';
if(type==='softmax'){
controls=slider(id,'a','Logit A',-4,4,.2)+slider(id,'b','Logit B',-4,4,.2)+slider(id,'c','Logit C',-4,4,.2);
const x=[v.a,v.b,v.c],mx=Math.max(...x),e=x.map(z=>Math.exp(z-mx)),total=e.reduce((a,b)=>a+b,0),p=e.map(z=>z/total);
output=`<p>Exponentiate scores and divide each by the sum:</p>${p.map((z,i)=>`<div class="vsl-barrow"><span>Class ${'ABC'[i]}</span><div><i style="width:${z*100}%"></i></div><strong>${fmt(z)}</strong></div>`).join('')}<div class="vsl-equation">Probabilities sum to <b>${fmt(p.reduce((a,b)=>a+b,0))}</b></div>`;
}
if(type==='pool'){
controls=slider(id,'top','Patch example',0,3,1)+`<label class="vsl-select">Pool <select data-vsl-select="mode"><option value="max" ${v.mode==='max'?'selected':''}>Max</option><option value="avg" ${v.mode==='avg'?'selected':''}>Average</option></select></label>`;
const patches=[[1,9,4,3],[2,4,8,6],[0,5,2,1],[7,4,6,3]],a=patches[v.top],out=v.mode==='max'?Math.max(...a):a.reduce((x,y)=>x+y,0)/4;
output=`<p>Pool the highlighted 2 × 2 patch:</p>${matrix(a,2)}<div class="vsl-equation">${v.mode==='max'?'max':'mean'}(${a.join(', ')}) = <b>${fmt(out)}</b></div><p>Pooling summarizes neighborhoods without learning trainable weights.</p>`;
}
if(type==='fit'){
controls=slider(id,'capacity','Model complexity',1,10,1);
const c=v.capacity,tr=1/(c+.3),va=.28+.045*(c-5.3)**2,graph=f=>Array.from({length:91},(_,i)=>`${25+i*3.2},${117-f(1+i*.1)*53}`).join(' ');
output=`<svg class="vsl-mini-graph" viewBox="0 0 335 145" role="img" aria-label="Training error decreases while validation error forms a U-shape"><path d="M25 10 V120 H317" stroke="var(--line)" fill="none" stroke-width="2"/><polyline points="${graph(x=>1/(x+.3))}" fill="none" stroke="var(--teal)" stroke-width="2.5"/><polyline points="${graph(x=>.28+.045*(x-5.3)**2)}" fill="none" stroke="var(--coral)" stroke-width="2.5"/><path d="M${25+(c-1)*32} 10 V120" stroke="var(--muted)" stroke-dasharray="4 4"/><text x="75" y="14" fill="var(--teal)" font-size="12">train</text><text x="178" y="14" fill="var(--coral)" font-size="12">validation</text></svg><div class="vsl-equation">Training: <b>${fmt(tr)}</b> · Validation: <b>${fmt(va)}</b></div><p>Illustrative curves: high model complexity can keep lowering training error while validation error begins rising.</p>`;
}
if(type==='vanish'){
controls=slider(id,'factor','Gradient multiplier per step',.1,1.5,.05)+slider(id,'depth','Steps through time',1,20,1);
const prod=v.factor**v.depth;
output=`<div class="vsl-equation">Approximate gradient product = ${fmt(v.factor,2)}<sup>${v.depth}</sup> = <b>${fmt(prod,6)}</b></div><div class="vsl-barrow"><span>Magnitude</span><div><i style="width:${Math.min(100,prod*100)}%"></i></div><strong>${fmt(prod,4)}</strong></div><p>Repeated factors below 1 cause vanishing gradients; factors above 1 cause explosion. This scalar model illustrates BPTT's matrix-product effect.</p>`;
}
if(type==='gru'){
controls=slider(id,'z','Retention gate z',0,1,.05)+slider(id,'h','Previous hidden h',-1,1,.1)+slider(id,'candidate','Candidate hidden',-1,1,.1);
const old=v.z*v.h,fresh=(1-v.z)*v.candidate;
output=`<div class="vsl-equation">Old contribution: z × hprev = <b>${fmt(old)}</b></div><div class="vsl-equation">New contribution: (1−z) × candidate = <b>${fmt(fresh)}</b></div><div class="vsl-equation">GRU hidden state = <b>${fmt(old+fresh)}</b></div><p>The reset gate influences candidate formation; the convention here matches the existing GRU example.</p>`;
}
return `<div class="vsl-lab"><div class="vsl-lab-top"><b>TRY A NUMBER · LIVE CALCULATION</b><span>Change a control → see the working</span></div><div class="vsl-lab-grid"><div class="vsl-controls">${controls}</div><div class="vsl-results" data-vsl-output>${output}</div></div></div>`;
}
function lab(id){
 const type=labType(id),v=config(id);if(!type)return '';
 if(['softmax','pool','fit','vanish','gru'].includes(type))return additionalVisualLab(id,type,v);
 let controls='',output='';
 if(type==='neuron'){
 controls=slider(id,'x','Input x',-3,3,0.1)+slider(id,'w','Weight w',-3,3,0.1)+slider(id,'b','Bias b',-2,2,0.1);
 const z=v.x*v.w+v.b,y=Math.max(0,z);
 output=`<b>Weighted sum</b><div class="vsl-equation">z = (${fmt(v.x)}) × (${fmt(v.w)}) + (${fmt(v.b)}) = <strong>${fmt(z)}</strong></div><b>ReLU activation</b><div class="vsl-equation">max(0, z) = <strong>${fmt(y)}</strong></div><p>Change the weight sign and watch the output. This toy neuron uses ReLU; the faculty's sigmoid MLP worked example is still directly below.</p>`;
 }else if(type==='activation'){
 controls=slider(id,'x','Preactivation z',-5,5,0.1)+`<label class="vsl-select">Function <select data-vsl-select="mode">${['relu','sigmoid','tanh'].map(t=>`<option value="${t}" ${v.mode===t?'selected':''}>${t}</option>`).join('')}</select></label>`;
 const f={relu:x=>Math.max(0,x),sigmoid:x=>1/(1+Math.exp(-x)),tanh:Math.tanh}[v.mode];const yy=f(v.x),der=v.mode==='relu'?(v.x>0?1:0):v.mode==='sigmoid'?yy*(1-yy):1-yy*yy;
 const points=Array.from({length:81},(_,i)=>{const x=-4+i/10,y=f(x);return `${20+i*3.7},${98-y*39}`}).join(' ');
 output=`<svg viewBox="0 0 338 133" class="vsl-mini-graph" role="img" aria-label="${esc(v.mode)} activation curve"><path d="M20 12 V112 H320" fill="none" stroke="var(--line)" stroke-width="2"/><polyline points="${points}" fill="none" stroke="var(--teal)" stroke-width="2.5"/><circle cx="${20+(v.x+4)*37}" cy="${98-yy*39}" r="5" fill="var(--coral)"/></svg><div class="vsl-equation">f(${fmt(v.x)}) = <strong>${fmt(yy)}</strong> · local derivative = <strong>${fmt(der)}</strong></div>`;
 }else if(type==='loss'){
 controls=slider(id,'y','Target y',0,1,1)+slider(id,'p','Predicted probability p',0.01,0.99,0.01);
 const mse=(v.y-v.p)**2,ce=-(v.y*Math.log(v.p)+(1-v.y)*Math.log(1-v.p));
 output=`<div class="vsl-equation">Squared loss = (${fmt(v.y)} − ${fmt(v.p)})² = <strong>${fmt(mse,4)}</strong></div><div class="vsl-equation">Binary cross-entropy = <strong>${fmt(ce,4)}</strong></div><p>Watch how confidently wrong predictions receive a large cross-entropy penalty.</p>`;
 }else if(type==='descent'){
 controls=slider(id,'w','Current parameter w',-3,9,0.5)+slider(id,'rate','Learning rate η',0.05,0.8,0.05)+slider(id,'steps','Update steps',1,6,1);
 let w=v.w,rows=[];for(let i=0;i<v.steps;i++){const grad=2*(w-3),next=w-v.rate*grad;rows.push([w,grad,next]);w=next}
 const y0=(v.w-3)**2,y1=(w-3)**2;
 output=`<div class="vsl-equation">Toy loss L(w) = (w−3)²; gradient = 2(w−3)</div><table class="vsl-table"><thead><tr><th>Step</th><th>w before</th><th>Gradient</th><th>w after</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${i+1}</td>${r.map(x=>`<td>${fmt(x,3)}</td>`).join('')}</tr>`).join('')}</tbody></table><p>Loss: <b>${fmt(y0)}</b> → <b>${fmt(y1)}</b>. Test a large learning rate and see how updates can overshoot.</p>`;
 }else if(type==='convolution'){
 controls=slider(id,'patch','Patch position',0,8,1)+`<label class="vsl-select">Kernel <select data-vsl-select="filter"><option value="edge" ${v.filter==='edge'?'selected':''}>Edge</option><option value="sum" ${v.filter==='sum'?'selected':''}>Sum</option></select></label>`;
 const inp=Array.from({length:16},(_,i)=>i+1),k=v.filter==='edge'?[1,0,0,-1]:[1,1,1,1],r=Math.floor(v.patch/3),c=v.patch%3,ids=[r*4+c,r*4+c+1,(r+1)*4+c,(r+1)*4+c+1],patch=ids.map(i=>inp[i]),result=patch.reduce((a,x,i)=>a+x*k[i],0);
 output=`<div class="vsl-matrices"><div><small>Input 4 × 4</small>${matrix(inp,4,ids)}</div><div><small>Kernel 2 × 2</small>${matrix(k,2)}</div></div><div class="vsl-equation">${patch.map((x,i)=>`${x}×(${k[i]})`).join(' + ')} = <strong>${result}</strong></div><p>Each move changes the 2×2 region, not the learned kernel coefficients.</p>`;
 }else if(type==='shapes'){
 controls=slider(id,'n','Input width N',4,32,1)+slider(id,'k','Kernel K',1,7,1)+slider(id,'p','Padding P',0,3,1)+slider(id,'s','Stride S',1,4,1)+slider(id,'channels','Input channels',1,8,1)+slider(id,'filters','Filters',1,16,1);
 const o=Math.floor((v.n+2*v.p-v.k)/v.s)+1,valid=o>0,params=(v.k*v.k*v.channels+1)*v.filters;
 output=valid?`<div class="vsl-equation">Output width = ⌊(${v.n}+2×${v.p}−${v.k})/${v.s}⌋ + 1 = <strong>${o}</strong></div><div class="vsl-equation">Output tensor = <strong>${o} × ${o} × ${v.filters}</strong></div><div class="vsl-equation">Parameters = (${v.k}² × ${v.channels}+1)×${v.filters} = <strong>${params}</strong></div>`:'<p>Invalid output geometry. Increase the input or padding or reduce kernel size.</p>';
 }else if(type==='sequence'){
 controls=slider(id,'t','Highlighted timestep',1,5,1)+slider(id,'carry','State retention (illustrative)',0,1,0.1);
 const inputs=[1,.2,-.5,.7,.4];let h=0,hs=[];for(const x of inputs){h=Math.tanh(v.carry*h+x);hs.push(h)}
 output=`<div class="vsl-time">${hs.map((x,i)=>`<button class="${i+1===v.t?'active':''}" data-vsl-set="t" data-value="${i+1}"><small>t${i+1}</small><b>${fmt(x)}</b></button>`).join('')}</div><div class="vsl-equation">hₜ = tanh(${fmt(v.carry)} × hₜ₋₁ + xₜ)</div><p>Step ${v.t}: input ${fmt(inputs[v.t-1])}, hidden state <strong>${fmt(hs[v.t-1])}</strong>. This is a simplified illustrative RNN, not a faculty numerical.</p>`;
 }else if(type==='attention'){
 controls=slider(id,'q','Query q',-2,2,0.2)+slider(id,'k1','Key 1',-2,2,0.2)+slider(id,'k2','Key 2',-2,2,0.2)+slider(id,'k3','Key 3',-2,2,0.2);
 const vals=[v.k1,v.k2,v.k3],scores=vals.map(x=>x*v.q),mx=Math.max(...scores),e=scores.map(x=>Math.exp(x-mx)),total=e.reduce((a,b)=>a+b,0),p=e.map(x=>x/total);
 output=`<p>Score = query × key. Softmax converts scores to attention weights:</p>${p.map((x,i)=>`<div class="vsl-barrow"><span>Token ${i+1}</span><div><i style="width:${x*100}%"></i></div><strong>${fmt(x)}</strong></div>`).join('')}<div class="vsl-equation">Sum of attention weights = <b>${fmt(p.reduce((a,b)=>a+b,0))}</b></div>`;
 }else if(type==='memory'){
 controls=slider(id,'prev','Previous cell memory',-1,1,0.1)+slider(id,'f','Forget gate f',0,1,0.05)+slider(id,'i','Input gate i',0,1,0.05)+slider(id,'g','Candidate g',-1,1,0.05)+slider(id,'o','Output gate o',0,1,0.05);
 const keep=v.f*v.prev,write=v.i*v.g,c=keep+write,h=v.o*Math.tanh(c);
 output=`<div class="vsl-equation">Keep old = f × cprev = <b>${fmt(keep)}</b></div><div class="vsl-equation">Write new = i × g = <b>${fmt(write)}</b></div><div class="vsl-equation">New cell c = <b>${fmt(c)}</b></div><div class="vsl-equation">Visible hidden h = o × tanh(c) = <b>${fmt(h)}</b></div><p>These inputs are already activated gates, so do not apply sigmoid again.</p>`;
 }else if(type==='boxes'){
 controls=slider(id,'offset','Horizontal box shift',0,5,0.5);
 const intersection=Math.max(0,4-v.offset)*3,union=24-intersection,iou=union?intersection/union:0;
 output=`<svg class="vsl-mini-graph" viewBox="0 0 340 110" role="img" aria-label="Green and orange 4 by 3 rectangles overlapping by adjustable amount"><rect x="45" y="12" width="120" height="90" rx="3" fill="var(--teal)" fill-opacity=".18" stroke="var(--teal)" stroke-width="2"/><rect x="${45+v.offset*30}" y="12" width="120" height="90" rx="3" fill="var(--coral)" fill-opacity=".18" stroke="var(--coral)" stroke-width="2"/></svg><div class="vsl-equation">Intersection = ${fmt(intersection)} · Union = ${fmt(union)}<br>IoU = <strong>${fmt(iou)}</strong></div><p>Here both boxes are 4×3 with the same height and a horizontal shift.</p>`;
 }else if(type==='qlearning'){
 controls=slider(id,'old','Old Q(s,a)',-2,10,0.5)+slider(id,'alpha','Learning rate α',0,1,0.05)+slider(id,'reward','Immediate reward r',-5,10,0.5)+slider(id,'gamma','Discount γ',0,1,0.05)+slider(id,'next','Best next Q',-2,10,0.5);
 const target=v.reward+v.gamma*v.next,td=target-v.old,q=v.old+v.alpha*td;
 output=`<div class="vsl-equation">Target = r + γ × maxQ′ = <strong>${fmt(target)}</strong></div><div class="vsl-equation">Temporal difference = target − Qold = <strong>${fmt(td)}</strong></div><div class="vsl-equation">Qnew = Qold + α × TD = <strong>${fmt(q)}</strong></div><p>If the next state is terminal, use next-state value 0.</p>`;
 }
 return `<div class="vsl-lab"><div class="vsl-lab-top"><b>TRY A NUMBER · LIVE CALCULATION</b><span>Change a control → see the working</span></div><div class="vsl-lab-grid"><div class="vsl-controls">${controls}</div><div class="vsl-results" data-vsl-output>${output}</div></div></div>`;
}
function concept(id){
 const n=topics[id]||[],current=stageNum(id),entry=n[current]||{name:'Concept',detail:''},l=lessons[id],g=guide[id]||[];
 return `<section class="vsl" data-vsl-id="${id}" aria-label="Visual explanation for ${esc(l.title)}">
 <div class="vsl-head"><div><div class="vsl-eyebrow">VISUAL FIRST · ${String(l.m).padStart(2,'0')}/${String(l.order+1).padStart(2,'0')}</div><h2>See how it works.</h2><p>Tap each stage of the diagram before memorizing its formula.</p></div><div class="vsl-count">${current+1} / ${n.length}</div></div>
 <div class="vsl-graph">${svgNodes(id)}</div>
 <div class="vsl-steps" role="group" aria-label="Explore stages">${n.map((e,i)=>`<button type="button" class="${i===current?'active':''}" data-vsl-stage="${i}" aria-pressed="${i===current}"><small>${String(i+1).padStart(2,'0')}</small><strong>${esc(e.name)}</strong></button>`).join('')}</div>
 <div class="vsl-explain"><span>YOU ARE LOOKING AT</span><h3>${esc(entry.name)}</h3><p>${esc(entry.detail)}</p></div>
 ${lab(id)}
 <div class="vsl-recall"><div><div class="vsl-eyebrow">CLOSE THE NOTES · RETRIEVE IT</div><p><b>Explain this topic in one sentence, without looking:</b></p><p>${esc(l.title)}</p></div><button type="button" data-vsl-reveal="${id}" aria-expanded="${!!ui.revealed[id]}">${ui.revealed[id]?'Hide answer':'Reveal explanation'}</button></div>
 ${ui.revealed[id]?`<div class="vsl-answer">${esc(g[0]||l.deck)}<br><small>For a tiny example: ${esc(g[2]||'Use the worked example in the faculty chapter below.')}</small></div>`:''}
 <div class="vsl-bottom"><button type="button" class="${saved[id]?'mastered':''}" data-vsl-master="${id}">${saved[id]?'✓ I can explain this':'○ I can explain this'}</button><span>${saved[id]?'Understood — revisit if the numbers feel difficult.':'Mark mastered only after you can explain the diagram unaided.'}</span></div>
 </section>`;
}
function injectReader(){
 const m=(location.hash||'').match(/^#read\/(\d+)$/);if(!m)return;
 const id=+m[1],article=app.querySelector('.reader');if(!article||!lessons[id]||article.querySelector('.vsl'))return;
 const card=article.querySelector('.guided-card');if(!card)return;
 const child=document.createElement('div');child.innerHTML=concept(id);const v=child.firstElementChild;
 card.after(v);
}
function home(){
 const home=app.querySelector('.home');if(!home||home.querySelector('.vsl-home'))return;
 const section=document.createElement('section');section.className='vsl-home';
 const recommended=[6,14,17,22,23,25,36,42,46,47,48,53,54,59,61,65,67];
 const completed=recommended.filter(id=>saved[id]).length;
 section.innerHTML=`<div class="vsl-home-hero"><div class="vsl-eyebrow">TIME-CRUNCHED REVISION · PRIORITY ROUTE</div><h2>Less reading. More understanding.</h2><p>Every chapter now has a visual walkthrough. The numerical chapters also let you change the values and watch the calculation change. Follow this priority route, then return to your faculty-backed long answers.</p><div class="vsl-home-status"><b>${completed}/${recommended.length}</b><span>core visual checkpoints mastered</span></div></div>
 <div class="vsl-home-modules">${groups.map((g,i)=>`<div><div class="vsl-home-icon">${g.icon}</div><h3>${esc(g.n)}</h3><p>${esc(g.desc)}</p><div class="vsl-home-links">${g.ids.map(id=>`<a href="#read/${id}" title="${esc(lessons[id].title)}">${esc(lessons[id].title.replace(/ — .*/,'').slice(0,32))}${saved[id]?' ✓':''}</a>`).join('')}</div></div>`).join('')}</div>
 <div class="vsl-home-order"><b>Fastest high-yield revision order</b><p>Start with numericals (backprop → Adam → CNN → LSTM → IoU → Q-learning), then understand architectures (RNN/BPTT → GANs → detection). Use the 33 original worked long answers and quizzes after you can follow the visual steps.</p><a href="#read/6">Begin with backprop visually →</a></div>`;
 const banner=home.querySelector('.guided-home');if(banner)banner.after(section);else home.prepend(section);
}
function refresh(){
 const m=location.hash.match(/^#read\/(\d+)$/);
 if(m){const container=app.querySelector('.vsl');if(container&&container.dataset.vslId!==m[1])container.remove();injectReader()}
 else home();
}
let pending=false;
const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;refresh()})};
const mutation=new MutationObserver(schedule);mutation.observe(app,{childList:true,subtree:true});window.addEventListener('hashchange',schedule);
function update(id){const node=app.querySelector(`.vsl[data-vsl-id="${id}"]`);if(node)node.outerHTML=concept(id)}
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-vsl-stage],[data-vsl-master],[data-vsl-reveal],[data-vsl-set]');if(!el)return;
 const card=el.closest('.vsl'),id=card?+card.dataset.vslId:+(el.dataset.vslMaster??el.dataset.vslReveal);
 if(!Number.isInteger(id)||id<0||id>=lessons.length)return;
 if(el.dataset.vslStage!==undefined){ui.stage[id]=+el.dataset.vslStage;update(id)}
 else if(el.dataset.vslMaster!==undefined){saved[id]=!saved[id];persist();update(id)}
 else if(el.dataset.vslReveal!==undefined){ui.revealed[id]=!ui.revealed[id];update(id)}
 else if(el.dataset.vslSet!==undefined){config(id)[el.dataset.vslSet]=Number(el.dataset.value);update(id)}
});
function input(e){
 const el=e.target,card=el.closest('.vsl');if(!card)return;
 const id=+card.dataset.vslId,k=el.dataset.vslInput||el.dataset.vslSelect;
 if(!k)return;config(id)[k]=el.type==='range'?Number(el.value):el.value;
 const clone=document.createElement('div');clone.innerHTML=lab(id);
 const old=card.querySelector('.vsl-lab'),fresh=clone.firstElementChild;
 if(!old||!fresh)return;
 old.querySelector('[data-vsl-output]').innerHTML=fresh.querySelector('[data-vsl-output]').innerHTML;
 const controls=old.querySelectorAll('[data-vsl-input]');const neu=fresh.querySelectorAll('[data-vsl-input]');controls.forEach((n,i)=>{const label=n.closest('label').querySelector('strong');if(label)label.textContent=neu[i]?.closest('label')?.querySelector('strong')?.textContent||label.textContent});
}
document.addEventListener('input',input);document.addEventListener('change',input);
schedule();
})();