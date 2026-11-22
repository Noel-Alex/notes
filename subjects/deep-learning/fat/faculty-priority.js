(function dlFacultyPriorityHub(){
'use strict';
const app=document.getElementById('app'), raw=document.getElementById('course-data');
if(!app||!raw)return;
let data;try{data=JSON.parse(raw.textContent)}catch{return}
const lessons=data.lessons||[],problems=data.problems||[];
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const modules=[
{id:1,name:"Neurons, Activations & Backprop",subtitle:"Two questions indicated by your professor",topics:[
{key:'activations',name:"Activation functions: graphs, formulas, when to use them",ids:[2,17],priority:'critical',answer:[
"Explain why nonlinearity is essential: stacked linear layers otherwise collapse into one affine transform.",
"State formula, range, slope/derivative, problem type, and one disadvantage for each activation.",
"Hidden layers: ReLU max(0,z) is a common default; Leaky ReLU keeps a nonzero negative slope; tanh is zero-centred but saturates.",
"Outputs: linear for unrestricted regression, sigmoid for a single binary probability, softmax for mutually exclusive multiclass probabilities. Multi-label classification generally uses independent sigmoids.",
"Include labelled graphs. Softmax maps a vector of logits into probabilities and is not an ordinary single-input activation curve."
],formula:"sigmoid σ(z)=1/(1+e⁻ᶻ), σ′=σ(1−σ); tanh′=1−tanh²(z); ReLU=max(0,z); softmax(zᵢ)=exp(zᵢ)/Σⱼ exp(zⱼ).",pitfall:"Don't say softmax is always for classification: binary/multi-label commonly use sigmoid. Sigmoid/tanh can saturate."},
{key:'backprop',name:"ANN / MLP backpropagation numerical",ids:[5,6],problems:[0,1],priority:'critical',answer:[
"State given input x, weights, bias, target y, activation, loss function and learning rate η.",
"Forward: zʰ=Wʰx+bʰ; aʰ=σ(zʰ); zᵒ=Wᵒaʰ+bᵒ; ŷ=σ(zᵒ). Compute numbers in order.",
"Loss for half-squared error: L=½(ŷ−y)². Output delta is δᵒ=(ŷ−y)ŷ(1−ŷ) for sigmoid + half-squared loss.",
"Output gradients: ∂L/∂wⱼᵒ=δᵒ aⱼʰ; bias gradient=δᵒ. Hidden δⱼ=aⱼ(1−aⱼ)Σₖwⱼₖδₖ, if hidden updates are asked.",
"Update each requested weight using w_new=w_old−η∂L/∂w. Use old weights for a simultaneous backward pass; report final prediction/loss or weights with requested rounding."
],formula:"w_new = w_old − η·∂L/∂w; δᵒ=(ŷ−y)·ŷ(1−ŷ) for sigmoid with ½ squared error.",pitfall:"For sigmoid with BCE, the output logit delta becomes (ŷ−y), not the half-squared-error delta; don't mix objectives."},
{key:'hyperparams',name:"Hyperparameters: what is learned and what must be chosen?",ids:[15,8],problems:[9],priority:'high',answer:[
"Parameters are learned by training: weights and biases. Hyperparameters are set or selected externally, often by validation.",
"ANN examples: learning rate, batch size, epochs, depth/width, optimizer, dropout rate, regularization strength.",
"Some options are mandatory for an algorithm to operate (e.g., k in K-means); others have defaults but should be tuned for the task. Do not claim an arbitrary hyperparameter is universally required.",
"Classification learns labels from examples; clustering discovers unlabeled groups. Compare task, inputs, outputs, algorithm choices and evaluation.",
"Typical supervised classification: logistic regression, decision trees, neural networks. Clustering: K-means (k), DBSCAN (ε and min_samples), agglomerative (linkage and stopping criterion)."
],formula:"Neural gradient step: θ←θ−η∇L(θ). η is a hyperparameter; θ is learned.",pitfall:"Classification vs clustering comparison is on your professor's list, but the site's Deep Learning faculty slides may not supply a separate clustering numerical. Treat this comparison as supplemental."}
]},
{id:2,name:"Gradient Descent & Generalisation",subtitle:"Batch size, optimizers, fitting and augmentation",topics:[
{key:'batches',name:"Batch, stochastic and mini-batch gradient descent",ids:[7,10],problems:[5],priority:'critical',answer:[
"Full batch GD computes one gradient from all N samples and makes one parameter update per epoch.",
"SGD (strict single-sample form) uses one example per update: N updates per epoch; noisy but frequent.",
"Mini-batch SGD uses B examples per update: normally ceil(N/B) updates per epoch, including a smaller last batch if needed.",
"Give one strength and one limitation: full batch is smooth but slow/heavy; single-sample updates are noisy; mini-batches exploit efficient matrix operations.",
"The same update rule θ←θ−η·gradient applies; the batch controls how the gradient estimate is formed."
],formula:"Updates per epoch = 1 (full batch), N (single-sample SGD), ceil(N/B) (mini-batch with remainder).",pitfall:"An epoch is one pass through the dataset, not one update unless full-batch."},
{key:'optimizers',name:"Optimization: Momentum, RMSProp, Adam, gradients",ids:[11,12,13,14],problems:[6],priority:'critical',answer:[
"SGD updates opposite the current gradient; Momentum smooths past gradient directions, reducing zigzagging.",
"RMSProp tracks exponentially weighted squared gradients and divides by their root, adapting coordinate-wise step sizes.",
"Adam combines a first moment (momentum) and a second moment (squared gradients), with bias correction especially important at early steps.",
"Write recurrence, substitute initial moment values (often m₀=v₀=0), correct bias for t, then update parameters.",
"State learning rate η, β₁, β₂ and ε in formula; distinguish optimization improvements from guarantees of convergence."
],formula:"mₜ=β₁mₜ₋₁+(1−β₁)gₜ; vₜ=β₂vₜ₋₁+(1−β₂)gₜ²; θₜ=θₜ₋₁−η m̂ₜ/(√v̂ₜ+ε).",pitfall:"Do not leave out Adam's m̂ₜ=mₜ/(1−β₁ᵗ) and v̂ₜ=vₜ/(1−β₂ᵗ) when asked for bias correction."},
{key:'fit',name:"Underfitting vs overfitting and how to diagnose them",ids:[8,19],problems:[4],priority:'high',answer:[
"Underfitting/high bias: both training and validation performance are poor; increase capacity, features or training when justified.",
"Overfitting/high variance: training error is low but validation error is high or increasing; use regularization, augmentation, early stopping or more representative training data.",
"Draw training and validation error versus epochs or model complexity, mark the divergence/optimal stopping region.",
"State the exact symptom before proposing a cure and mention the cost of excessive regularization (new underfitting)."
],formula:"A generalization gap can be discussed as validation loss − training loss (on compatible metrics and splits).",pitfall:"A rising validation loss alone is not sufficient without context; inspect training loss and evaluation data too."},
{key:'augmentation',name:"Data augmentation, regularization and hyperparameters",ids:[18,19,15],priority:'high',answer:[
"Data augmentation applies label-preserving transformations to training examples, e.g. image flips when symmetry is valid, crops, brightness changes or moderate rotations.",
"It increases variety but does not create new independent real-world observations.",
"Differentiate augmentation from regularization: augmentation changes training inputs; L1/L2 penalties, dropout and early stopping constrain training.",
"Specify what transformations are valid for the task: don't flip a handwritten digit or medical image if it can change the label."
],formula:"L1 objective: L+λΣ|w|; L2 objective: L+(λ/2)Σw².",pitfall:"Augmentation transformations must respect labels and the source domain; do not augment the validation/test sets when evaluating generalization."}
]},
{id:3,name:"CNNs & Named Architectures",subtitle:"Important alternative mentioned with Module 4",topics:[
{key:'conv',name:"Convolution numerical and CNN output image size",ids:[22,23,24,25],problems:[10,11],priority:'critical',answer:[
"Write input shape H×W×C_in, kernel K_h×K_w, stride S, padding P, dilation D if provided, and number of filters C_out.",
"Convolution: select each input patch, multiply elementwise by kernel values, sum products and add the bias if specified.",
"Spatial output: floor((N+2P−K_eff)/S)+1 separately for height and width; K_eff=D(K−1)+1.",
"Depth after convolution equals number of filters. Trainable params = (K_h K_w C_in+1)C_out if one bias per filter.",
"Pooling changes spatial shape without trainable convolution-style parameters. Follow each layer sequentially; flatten uses final H×W×C."
],formula:"N_out = ⌊(N+2P−[D(K−1)+1])/S⌋+1; params=(K_h K_w C_in+1)C_out.",pitfall:"Don't confuse output channels with input channels or multiply filter weights by image spatial positions."},
{key:'architectures',name:"AlexNet vs VGG-16 vs Inception vs ResNet",ids:[28,29,30,31],problems:[12,13,14],priority:'critical',answer:[
"AlexNet: deep CNN breakthrough associated with GPU training, ReLU, data augmentation, dropout and large early filters; substantial parameters in dense layers.",
"VGG-16: simple stacks of 3×3 convs and periodic max-pooling; 16 learned weight layers (13 conv + 3 fully connected); high compute/parameter cost.",
"Inception/GoogLeNet: parallel filter branches (1×1, 3×3, 5×5 and pooling), channel concatenation, 1×1 bottlenecks for efficient computation.",
"ResNet: identity skip connections, y=F(x)+x, to address optimization/degradation and improve gradient flow in deeper nets.",
"For 10 marks draw small architecture skeleton for each, then compare core principle, major merit and major limitation; label Inception correctly (the list says 'intercept')."
],formula:"ResNet residual block y=F(x)+x; VGG three stride-1 3×3 layers ≈ effective 7×7 receptive field.",pitfall:"Skip connections address optimization/degradation; don't claim every deeper network automatically has less overfitting."},
{key:'cnn-skeleton',name:"CNN principle, convolution → activation → pooling → output",ids:[21,26,27,32],priority:'high',answer:[
"Explain local receptive fields, weight sharing and hierarchical feature extraction.",
"Draw input → conv → activation → pool → repeated feature blocks → flatten/global pooling → dense classifier.",
"Give merits: parameter reuse, translation-equivariant convolution and effective image feature learning.",
"Give limitations: computational expense, data requirements and poor built-in invariance to arbitrary transformations.",
"Use a shape-tracking table to show image size and channels through each layer."
],formula:"Conv parameters depend on kernel and channel counts, not number of filter positions.",pitfall:"Strict invariance to translation is not guaranteed merely by convolution; convolution is approximately translation equivariant under relevant assumptions."}
]},
{id:4,name:"RNNs, BERT & Encoder–Decoder",subtitle:"Important alternative mentioned with Module 3",topics:[
{key:'rnn',name:"RNN numerical: recurrence, hidden state, BPTT",ids:[33,35,36,37],problems:[15,16],priority:'critical',answer:[
"Unroll the recurrent network over the specified number of timesteps; note that W_x and W_h are shared across timesteps.",
"Compute aₜ=W_x xₜ+W_h hₜ₋₁+b and hₜ=tanh(aₜ) or the specified activation. Then compute output yₜ if supplied.",
"For BPTT backpropagate losses through the unfolded time graph; sum derivatives for each shared parameter across times.",
"RNN cell parameter count h×d+h×h+h = h(d+h+1), excluding optional output head.",
"Explain why products of recurrent Jacobians can cause vanishing/exploding gradients, and mention gated LSTM/GRU or clipping as remedies."
],formula:"hₜ=tanh(W_x xₜ+W_h hₜ₋₁+b); RNN cell params=h(d+h+1).",pitfall:"Sequence length T changes computation but does not multiply the number of shared RNN parameters."},
{key:'seq2seq',name:"Sequence-to-sequence encoder–decoder architecture",ids:[39,34],problems:[18],priority:'critical',answer:[
"An encoder reads source tokens x₁…x_T and builds hidden representations/context.",
"A decoder predicts target tokens y₁…y_U autoregressively in classic RNN seq2seq; lengths T and U can differ.",
"Without attention, a single fixed-length final context can bottleneck long inputs; with attention, the decoder can use multiple encoder states.",
"Draw input tokens → encoder states → context/attention → decoder time steps → output tokens, with hidden state and memory arrows.",
"Discuss teacher forcing during training and error accumulation/exposure bias during inference where relevant."
],formula:"Autoregressive decoder concept: P(y₁:U|x₁:T)=∏ₜ P(yₜ|y_<t,x₁:T).",pitfall:"An encoder–decoder model is not necessarily BERT. BERT itself is encoder-only."},
{key:'bert',name:"BERT architecture: bidirectional Transformer encoder",ids:[42],problems:[17],priority:'critical',answer:[
"Define BERT as Bidirectional Encoder Representations from Transformers, an encoder-only Transformer language model.",
"Token embeddings + position embeddings (+ segment/type embeddings in classic BERT) feed stacked bidirectional Transformer encoder blocks.",
"Each block uses multi-head self-attention, add/residual + layer normalization, feed-forward network, and another residual + normalization (architecture wording may reflect original post-LN implementation).",
"Pretraining in original BERT used masked language modelling and next-sentence prediction. Finetuning attaches task heads (e.g. classification or token labelling).",
"Differentiate BERT encoder-only bidirectional attention from a standard encoder–decoder Transformer with both encoder and decoder, and from causal decoder-only generation."
],formula:"Attention(Q,K,V)=softmax(QKᵀ/√d_k)V.",pitfall:"Do not draw a BERT decoder or claim BERT naturally generates full text left-to-right like a decoder-only LM."}
]},
{id:5,name:"Long Memory & Gated RNNs",subtitle:"Important alternative mentioned with Module 6",topics:[
{key:'lstm',name:"LSTM gates, labelled diagram and numerical",ids:[46,47],problems:[19,20],priority:'critical',answer:[
"Draw xₜ and hₜ₋₁ entering forget fₜ, input iₜ, candidate gₜ and output oₜ branches, plus cell-state path cₜ₋₁→cₜ.",
"Sigmoid gives gate values in [0,1]; tanh gives candidate values in [−1,1].",
"Cell update cₜ=fₜ⊙cₜ₋₁+iₜ⊙gₜ; hidden output hₜ=oₜ⊙tanh(cₜ).",
"Calculate old-memory contribution, candidate contribution, new cell and new hidden step by step.",
"State that gated cell dynamics help preserve information and mitigate, not mathematically abolish, vanishing gradients."
],formula:"fₜ=σ(W_f[hₜ₋₁,xₜ]+b_f), iₜ=σ(...), gₜ=tanh(...), oₜ=σ(...); cₜ=fₜcₜ₋₁+iₜgₜ; hₜ=oₜtanh(cₜ).",pitfall:"If the question supplies gate outputs, do not apply sigmoid or tanh to them again (except tanh applied to the final cell before output)."},
{key:'gru',name:"GRU: reset/update gates, example and LSTM comparison",ids:[48,49],problems:[21],priority:'critical',answer:[
"A GRU has a hidden state hₜ and two gates: reset rₜ and update zₜ. It does not have a separate persistent cell state cₜ.",
"Reset controls use of previous hidden information when constructing a candidate. Update controls retention/blending of old and candidate.",
"Under the convention used in these notes: hₜ=zₜ⊙hₜ₋₁+(1−zₜ)⊙h̃ₜ. Other references reverse the interpretation, so follow the stated equation.",
"Numerical: evaluate retained part and new candidate part separately before adding.",
"Compare LSTM's three named gates and cell/hidden states with GRU's two gates and single state, in terms of simplicity and capacity."
],formula:"hₜ=zₜhₜ₋₁+(1−zₜ)h̃ₜ (retention-gate convention).",pitfall:"Do not confuse GRU with LSTM or silently reverse the update-gate convention."},
{key:'echo',name:"Echo State Network: fixed reservoir and trained readout",ids:[45],priority:'high',answer:[
"ESN is a reservoir-computing recurrent model, with fixed recurrent reservoir weights and generally a trainable readout.",
"Diagram: input → recurrent fixed reservoir → output readout; show the reservoir's feedback loops.",
"State hₜ=φ(W_in xₜ + W_res hₜ₋₁+b), then an output mapping from reservoir state to target.",
"Explain advantage: lightweight readout training; limitations: reservoir design and stability/spectral properties affect memory."
],formula:"hₜ=φ(W_in xₜ+W_res hₜ₋₁+b); ŷₜ=W_out[hₜ;xₜ] is a possible readout.",pitfall:"Not all ESN weights are updated by BPTT; a typical ESN trains the readout and keeps reservoir fixed."}
]},
{id:6,name:"Transfer, GANs & Detection",subtitle:"Important alternative mentioned with Module 5",topics:[
{key:'transfer',name:"Transfer learning: feature extraction vs fine-tuning",ids:[53],problems:[23],priority:'critical',answer:[
"Start from a pretrained model trained on source-task data; reuse useful representations for the target task.",
"Frozen feature extraction: fix backbone weights, replace/train new classifier head.",
"Fine-tuning: unfreeze some or all pretrained layers and adapt them with a careful, often smaller learning rate.",
"Draw source pretrained backbone → new target head, showing which weights are frozen vs trainable.",
"Explain when transfer helps (small related dataset) and limitations (domain shift, negative transfer, overfitting)."
],formula:"θ_target = argmin over trainable θ of L_target(θ); frozen backbone parameters remain unchanged.",pitfall:"Transfer learning is not automatically beneficial for unrelated target domains."},
{key:'gan',name:"Generative AI: GAN generator and discriminator",ids:[54,55],problems:[24],priority:'critical',answer:[
"Generator G takes noise z (possibly class conditioning) and outputs synthetic samples; discriminator D outputs a real/fake probability for a sample.",
"Draw noise z → Generator G → fake image → Discriminator D alongside real images → D, with feedback updating both networks.",
"State classic GAN minimax objective and explain D maximizes discrimination while G learns to fool D (training objectives may vary).",
"Merits: learned realistic generation and synthetic data; limitations: instability, mode collapse, evaluation difficulty.",
"Distinguish GAN discriminator from a standard multi-class object detector or classifier."
],formula:"min_G max_D E_x[log D(x)] + E_z[log(1−D(G(z)))].",pitfall:"D does not generate fake examples; G generates them."},
{key:'detectors',name:"R-CNN, Fast R-CNN, Faster R-CNN, YOLO, SSD",ids:[56,57,58,59,60],problems:[25,26,27],priority:'critical',answer:[
"R-CNN: external region proposals → individual region CNN features → classifier + bounding-box regressor; accurate but repeated CNN cost.",
"Fast R-CNN: one shared convolutional feature map → RoI pooling for proposals → classifier and box regression; still relies on external region proposals.",
"Faster R-CNN: shared backbone with Region Proposal Network (RPN) → RoI features → class and boxes; two-stage architecture.",
"YOLO: one-stage dense box/class prediction in a forward pass; fast and suitable for real time, though small-object performance varies by architecture/version.",
"SSD: one-stage predictions from multiple-scale feature maps with predefined anchor/default boxes; good multi-scale design.",
"Draw each pipeline. Contrast two-stage proposal methods vs single-shot detectors, speed, accuracy and computational trade-offs."
],formula:"IoU=area(A∩B)/area(A∪B); classic YOLO-v1 output S×S×(B·5+C).",pitfall:"Fast R-CNN does not contain the learned RPN—that is Faster R-CNN. SSD does not use R-CNN-style proposals."}
]},
{id:7,name:"RL Algorithms & Taxonomy",subtitle:"Value-based, policy-based, model-based, A2C/A3C",topics:[
{key:'q',name:"Q-learning numerical and Bellman target",ids:[64,65],problems:[28,29],priority:'critical',answer:[
"Define s, a, r, s′, learning rate α and discount γ, and state whether the next state is terminal.",
"Compute best next action value max_a′Q(s′,a′), then target r+γmaxQ.",
"Compute TD error δ = target−Q_old(s,a).",
"Update only the chosen entry Q_new(s,a)=Q_old+αδ; show all substitutions and final number.",
"Q-learning is model-free, value-based, off-policy because its target uses greedy next action values regardless of the behaviour policy."
],formula:"Q_new=Q_old+α[r+γ max_a′Q(s′,a′)−Q_old].",pitfall:"If next state is terminal, continuation value is 0; do not apply gamma to an unrelated state's value."},
{key:'dqn',name:"Deep Q Network: replay buffer and target network",ids:[67],problems:[30],priority:'critical',answer:[
"DQN approximates Q(s,a;θ) with a neural network instead of a lookup table.",
"Interaction generates transition (s,a,r,s′,done), stored in replay buffer; sample randomized mini-batches for training.",
"A separate target network Q(s′,a′;θ⁻) helps stabilize bootstrapped targets.",
"Training target y=r+γ(1−done)max_a′Q_target(s′,a′); loss compares y to online Q(s,a;θ).",
"Explain epsilon-greedy exploration and target-network synchronization."
],formula:"L(θ)=E[(r+γ(1−done)max_a′Q_target(s′,a′)−Q_online(s,a))²].",pitfall:"DQN is value-based; target network and replay buffer serve different purposes."},
{key:'types',name:"Value-based vs policy-based vs model-based RL",ids:[64,68,71],priority:'critical',answer:[
"Value-based (e.g. Q-learning/DQN): learn V(s) or Q(s,a), derive choices via values. Standard Q-learning is not a policy-gradient method.",
"Policy-based (e.g. REINFORCE): directly learn π_θ(a|s), typically optimizing expected return.",
"Actor–critic combines a policy actor with value-estimation critic.",
"Model-based: learn/use a transition/reward model P(s′|s,a), R(s,a) to plan or simulate futures.",
"Clarify that model-free/model-based describes the presence of a dynamics model, while value-based/policy-based describes how decisions are learned; these axes are not mutually exclusive."
],formula:"Policy gradient ∇θJ ≈ Σₜ Gₜ ∇θ log πθ(aₜ|sₜ); value-based uses Bellman backups.",pitfall:"Your professor's 'policy-based Q-learning' phrasing is ambiguous: Q-learning itself is value-based, not policy-gradient."},
{key:'a2c',name:"Actor–Critic, A2C vs A3C",ids:[69,70],problems:[32],priority:'critical',answer:[
"Actor learns π(a|s), the action-selection policy; critic learns a baseline/value and evaluates how good outcomes are.",
"Advantage A(s,a)=Q(s,a)−V(s) measures how much better an action is than the state baseline.",
"A2C: typically synchronous parallel rollout workers that aggregate updates; A3C: asynchronous workers independently update shared parameters.",
"Draw environment(s) → actors → shared policy/critic; label synchronization difference.",
"Discuss benefit of lower-variance policy gradients and parallel exploration; limitations include tuning complexity and update staleness for A3C."
],formula:"A(s,a)=Q(s,a)−V(s); policy gradient commonly uses ∇logπ(a|s)×advantage.",pitfall:"Actor chooses actions, critic estimates value; A2C and A3C are not Q-learning variants."}
]}
];
const topicList=modules.flatMap(m=>m.topics.map(t=>({...t,module:m.id})));
const byId={};for(const t of topicList)for(const id of t.ids)if(!byId[id])byId[id]=[];
for(const t of topicList)for(const id of t.ids)byId[id].push(t);
const priorityIds=new Set(Object.keys(byId).map(Number));
let memory={};
try{memory=JSON.parse(localStorage.getItem('dl-professor-priority-v1')||'{}')||{}}catch{}
let moduleFilter=1,openedPrompt=null,plotChoice='relu',zValue=1.0;
function save(){try{localStorage.setItem('dl-professor-priority-v1',JSON.stringify(memory))}catch{}}
const styles={critical:'★ Exam focus',high:'Exam context'};
function activationPlot(){
 const funcs={sigmoid:{title:'Sigmoid',f:x=>1/(1+Math.exp(-x)),formula:'1/(1+e^(−z))',range:'(0,1)',use:'Binary output; independent multi-label probabilities',risk:'Saturates; near-zero gradients at extremes'},
 tanh:{title:'tanh',f:Math.tanh,formula:'(e^z−e^(−z))/(e^z+e^(−z))',range:'(−1,1)',use:'Traditional recurrent/hidden gates',risk:'Still saturates'},
 relu:{title:'ReLU',f:x=>Math.max(0,x),formula:'max(0,z)',range:'[0,∞)',use:'Common CNN/MLP hidden layer default',risk:'Zero gradient for z<0 (dying ReLU)'},
 leaky:{title:'Leaky ReLU',f:x=>x>=0?x:0.1*x,formula:'max(0.1z,z) (sample slope 0.1)',range:'ℝ',use:'Hidden layers when avoiding dead units',risk:'Negative slope is a design hyperparameter'},
 linear:{title:'Linear',f:x=>x,formula:'z',range:'ℝ',use:'Unrestricted regression output',risk:'Hidden-only stacks remain linear'}};
 const f=funcs[plotChoice],y=f.f(zValue); const pix=(x,y)=>[31+(x+4)*44,139-y*25];const points=Array.from({length:161},(_,i)=>{const x=-4+i*.05;const [a,b]=pix(x,Math.max(-2.6,Math.min(3.8,f.f(x))));return `${a.toFixed(1)},${b.toFixed(1)}`}).join(' ');const [px,py]=pix(zValue,Math.max(-2.6,Math.min(3.8,y)));
 return `<div class="fac-activation">
 <div class="fac-activation-head"><div><div class="fac-kicker">INTERACTIVE · ACTIVATION GRAPH</div><h3>${esc(f.title)}</h3></div><div class="fac-plot-tabs">${Object.keys(funcs).map(k=>`<button type="button" data-fac-plot="${k}" class="${k===plotChoice?'on':''}">${esc(funcs[k].title)}</button>`).join('')}</div></div>
 <svg viewBox="0 0 420 240" role="img" aria-label="${esc(f.title)} curve from z minus 4 to plus 4" class="fac-graph">
 <path d="M31 12 V223 H404 M31 139 H404" fill="none" stroke="var(--line)" stroke-width="1.5"/>
 <g fill="var(--muted)" font-size="11"><text x="31" y="238">−4</text><text x="198" y="238">0</text><text x="384" y="238">+4</text><text x="13" y="143">0</text><text x="10" y="40">4</text></g>
 <polyline points="${points}" fill="none" stroke="var(--teal)" stroke-width="3"/>
 <path d="M${px} 13 V223" stroke="var(--coral)" stroke-width="1.5" stroke-dasharray="4 4"/>
 <circle cx="${px}" cy="${py}" r="6" fill="var(--coral)" stroke="var(--paper)" stroke-width="2"/>
 </svg>
 <label class="fac-range">Input z <input type="range" min="-4" max="4" step=".1" value="${zValue}" data-fac-z/><strong>${zValue.toFixed(1)}</strong></label>
 <div class="fac-activation-facts"><div><b>Formula</b><code>${esc(f.formula)}</code></div><div><b>Output range</b>${esc(f.range)}</div><div><b>When to use</b>${esc(f.use)}</div><div><b>Exam caveat</b>${esc(f.risk)}</div></div>
 <p class="fac-help">f(${zValue.toFixed(1)}) = <strong>${y.toFixed(4)}</strong>. Softmax is not plotted: it is a vector-valued multiclass function, unlike these scalar curves.</p></div>`;
}
function paperPattern(){
 return `<section class="fac-pattern" aria-label="Reported question paper pattern">
 <div class="fac-kicker">PROFESSOR COMMUNICATION · NOV 2026</div>
 <h2>8 answers × 10 marks = 80 marks.</h2>
 <p>Your message says seven modules, seven questions, and an extra question from Module 1; it also mentions choices for Questions 9 and 10. That does not fully specify which questions must be attempted, so the site preserves the report rather than inventing a definitive compulsory/optional scheme.</p>
 <div class="fac-pattern-grid">
 <div><b>Module 1</b><span>Two questions mentioned</span></div>
 <div><b>Question 9 · A / B</b><span>Module 3 or Module 4</span></div>
 <div><b>Question 10 · A / B</b><span>Module 5 or Module 6</span></div>
 <div><b>Answer-key instruction</b><span>Precise formulas, labels and intermediate steps</span></div>
 </div>
 <p class="fac-source-note">This pattern and importance ranking come from your professor message, not an independently verified official paper. All sample answers on this page remain exam preparation, not predicted exact questions.</p></section>`;
}
function chapterLinks(t){
 return `<div class="fac-links">${t.ids.map(id=>`<a href="#read/${id}">${esc(lessons[id]?.title||('Lesson '+id))}<span>↗</span></a>`).join('')}${(t.problems||[]).map(i=>`<a href="#problems" title="Open the original solved problems list, module ${t.module}">Solved problem ${i+1}: ${esc(problems[i]?.title||'Exercise')}<span>↗</span></a>`).join('')}</div>`;
}
function sourceCaveat(t){
 const keys=new Set(t.ids.map(x=>lessons[x]?.source).filter(Boolean));return `<p class="fac-source-note">Linked teaching source${keys.size>1?'s':''}: ${esc([...keys].join('; '))}. ${t.key==='hyperparams'?'Classification/clustering comparison is supplemental and was added because the professor explicitly listed it.':''}</p>`;
}
function solutionCard(i){
 const p=problems[i];if(!p)return '';const exact=/source-exact|faculty|uploaded/i.test(p.title+' '+p.origin)&&!/^Original/i.test(p.origin);
 return `<details class="fac-solution"><summary><span>${exact?'LECTURE/FACULTY EXERCISE':'ORIGINAL EXAM-STYLE PRACTICE'}</span><strong>${esc(p.title)}</strong><small>Reveal complete numerical ↴</small></summary>
 <div class="fac-solution-body"><p><b>Question.</b> ${esc(p.question)}</p><ol>${p.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
 <div class="fac-final"><b>FINAL</b> ${esc(p.final)}</div><p class="fac-source-note">${esc(p.origin)} · ${p.marks} marks (worksheet labelling, not a guaranteed FAT question)</p></div></details>`;
}
function topicCard(t){
 const done=!!memory[t.key],common=styles[t.priority]||'Focus';return `<article class="fac-topic" id="fac-${t.key}">
 <div class="fac-topic-top"><div><span class="fac-level ${t.priority}">${esc(common)}</span><h3>${esc(t.name)}</h3></div><button type="button" data-fac-check="${esc(t.key)}" class="${done?'done':''}" aria-pressed="${done}">${done?'✓ Can answer':'○ Not mastered'}</button></div>
 <div class="fac-topic-actions"><a href="#read/${t.ids[0]}">Open full lesson ↗</a>${t.problems?.length?`<span>${t.problems.length} linked worked problems</span>`:''}</div>
 <details class="fac-model"><summary>What a precise 10-mark answer should contain <span>↴</span></summary>
 <div class="fac-model-inside"><ol>${t.answer.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>
 <div class="fac-formula"><b>WRITE THE FORMULA</b><p>${esc(t.formula)}</p></div>
 <div class="fac-trap"><b>COMMON MARK-LOSING ERROR</b><p>${esc(t.pitfall)}</p></div>
 ${sourceCaveat(t)}</div></details>
 ${t.key==='activations'?activationPlot():''}
 ${t.problems?.length?`<div class="fac-practice-head">OPEN SOURCE-ALIGNED SOLVED QUESTIONS</div>${t.problems.map(solutionCard).join('')}`:''}
 ${chapterLinks(t)}</article>`;
}
function progress(m){
 const ts=m?modules.find(x=>x.id===m)?.topics||[]:topicList;return [ts.filter(t=>!!memory[t.key]).length,ts.length];
}
function panel(){
 const all=moduleFilter===0,selected=all?modules:[modules.find(m=>m.id===moduleFilter)];
 const [done,total]=progress();return `<div class="faculty-hub">
 <div class="fac-hero"><div class="fac-kicker">FACULTY IMPORTANT TOPICS · BCSE332L · FAT PREPARATION</div>
 <h1>Study what your professor actually highlighted.</h1>
 <p>Seven modules, source-linked lessons, exact answer structure, and numerical solutions with every intermediate step. Use this before the 73-chapter textbook, then return to the full lessons for depth.</p>
 <div class="fac-hero-footer"><div><strong>${done}/${total}</strong><span>topic groups marked confident</span></div><a href="#read/6">Start with ANN backprop →</a><a href="#problems">All 33 worked problems →</a></div></div>
 ${paperPattern()}
 <section class="fac-plan"><div class="fac-kicker">HOW TO GET FULL MARKS</div><h2>The structure to use in every 10-mark answer</h2>
 <div class="fac-rubric">${['Define exact algorithm / purpose','Draw labelled architecture or diagram','Write equation and define symbols','Show substitutions / layer dimensions','State final result, merits, demerits, or limitation'].map((x,i)=>`<div><b>0${i+1}</b><span>${esc(x)}</span></div>`).join('')}</div>
 <p>These are answer-writing checkpoints, <b>not official mark allocations</b>. When an answer key is generated automatically, clearly label all equations and final results rather than assuming it will infer missing steps.</p></section>
 <section class="fac-modules"><div class="fac-modules-title"><div><div class="fac-kicker">THE REVISION MAP</div><h2>Choose your module.</h2></div><button data-fac-reset>Reset mastery marks</button></div>
 <div class="fac-module-tabs" role="group" aria-label="Select module">
 ${[{id:0,name:'All'},...modules.map(m=>({id:m.id,name:'M'+m.id}))].map(m=>`<button data-fac-module="${m.id}" class="${moduleFilter===m.id?'active':''}" aria-pressed="${moduleFilter===m.id}">${m.name}</button>`).join('')}
 </div>${selected.map(m=>`<div class="fac-module"><header><div><span>MODULE ${String(m.id).padStart(2,'0')}</span><h2>${esc(m.name)}</h2><p>${esc(m.subtitle)}</p></div><strong>${progress(m.id).join(' / ')} complete</strong></header>
 <div class="fac-topic-stack">${m.topics.map(t=>topicCard({...t,module:m.id})).join('')}</div></div>`).join('')}
 </section>
 <section class="fac-lasts"><div class="fac-kicker">LAST-MINUTE NUMERICALS</div><h2>Do these on paper before the exam.</h2>
 <p>These are linked to the stored course question bank. Some are sourced from faculty exercises; others are clearly labeled original practice.</p>
 <div class="fac-drills">${[[0,"ANN sigmoid backprop"],[5,"Mini-batch updates"],[6,"Adam bias correction"],[10,"Convolution by hand"],[11,"100×100 CNN shape"],[15,"RNN forward + gradient"],[19,"LSTM gate update"],[24,"GAN loss"],[25,"IoU"],[29,"Q-learning"],[32,"A2C/A3C"]].map(([i,label])=>`<details><summary>${esc(label)} <span>10-mark solution ↴</span></summary>${solutionCard(i)}</details>`).join('')}</div>
 </section>
 <section class="fac-lasts"><div class="fac-kicker">ONE SENTENCE THAT SAVES MARKS</div><h2>Precision matters more than impressive wording.</h2>
 <p>Q-learning is <strong>off-policy value-based</strong>; REINFORCE is <strong>policy-based</strong>; DQN is a <strong>deep value-based</strong> method; A2C and A3C are <strong>actor–critic</strong> algorithms; model-based RL predicts or uses transitions for planning. BERT is an <strong>encoder-only Transformer</strong>, while classical seq2seq has both an encoder and a decoder.</p>
 </section>
 </div>`;
}
function compactBanner(){
 return `<section class="fac-banner"><div><div class="fac-kicker">NEW · YOUR PROFESSOR'S IMPORTANT LIST</div><h2>7 modules. 80-mark revision focus.</h2><p>The important topics are marked inside the chapters. Start with backprop, CNN numericals, LSTM, Q-learning and architecture diagrams.</p></div><a href="#faculty">Open professor's priority map →</a></section>`;
}
function labelSidebar(){
 const side=app.querySelector('.sidebar');if(side){
  side.querySelectorAll('[data-go^="read/"]').forEach(b=>{
   const id=Number((b.dataset.go||'').split('/')[1]);
   if(!priorityIds.has(id)||b.querySelector('.fac-sidebar-star'))return;
   const st=document.createElement('small');st.className='fac-sidebar-star';st.textContent='★';st.title='Professor-highlighted FAT topic';b.appendChild(st);
  });
  if(!side.querySelector('.fac-side-shortcut')){
   const link=document.createElement('a');link.href='#faculty';link.className='fac-side-shortcut';link.innerHTML='★ Professor important topics ↗';side.querySelector('.side-head')?.after(link);
  }
 }
}
function labelReader(){
 const m=(location.hash||'').match(/^#read\/(\d+)$/);if(!m)return;const id=Number(m[1]);if(!priorityIds.has(id))return;
 const reader=app.querySelector('.reader');if(!reader||reader.querySelector('.fac-reader-callout'))return;
 const related=byId[id]||[];const section=document.createElement('section');section.className='fac-reader-callout';
 section.innerHTML=`<div class="fac-kicker">★ PROFESSOR'S IMPORTANT TOPIC</div><p>This chapter is part of the reported FAT priority list: <strong>${related.map(t=>esc(t.name)).join(' · ')}</strong>.</p><div class="fac-reader-links"><a href="#faculty">See the exact answer checklist →</a>${related[0]?.problems?.length?'<a href="#problems">Find related worked problems →</a>':''}</div>`;
 reader.querySelector('.chapter-actions')?.after(section);
 const pill=reader.querySelector('.reader-eyebrow .pill');if(pill)pill.textContent='★ FACULTY IMPORTANT';
}
function homeOrPriority(){
 const nav=app.querySelector('#topbar .toplinks');if(nav&&!nav.querySelector('.fac-top-link')){const link=document.createElement('a');link.href='#faculty';link.className='fac-top-link';link.textContent='★ Faculty IMP';nav.prepend(link)}
 const hash=location.hash||'#home';const home=app.querySelector('.home');if(!home)return;
 if(hash==='#faculty'){
  home.dataset.facultyPage='yes';if(!home.querySelector('.faculty-hub')){const el=document.createElement('div');el.innerHTML=panel();home.prepend(el.firstElementChild)}
 }else{
  home.dataset.facultyPage='no';if(!home.querySelector('.fac-banner')){const el=document.createElement('div');el.innerHTML=compactBanner();const banner=home.querySelector('.guided-home')||home.firstElementChild;banner?.after(el.firstElementChild)}
 }
}
function refresh(){homeOrPriority();labelSidebar();labelReader()}
let queued=false;
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refresh()})}
new MutationObserver(queue).observe(app,{subtree:true,childList:true});
window.addEventListener('hashchange',queue);
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-fac-module],[data-fac-check],[data-fac-reset],[data-fac-plot]');
 if(!el)return;
 if(el.dataset.facModule!==undefined){moduleFilter=Number(el.dataset.facModule);renderPanel();return}
 if(el.dataset.facCheck!==undefined){memory[el.dataset.facCheck]=!memory[el.dataset.facCheck];save();renderPanel();return}
 if(el.dataset.facReset!==undefined){memory={};save();renderPanel();return}
 if(el.dataset.facPlot!==undefined){plotChoice=el.dataset.facPlot;renderActivation();return}
});
function renderPanel(){
 const root=app.querySelector('.faculty-hub');if(!root)return;root.outerHTML=panel();
}
function renderActivation(){
 const graph=app.querySelector('.fac-activation');if(graph)graph.outerHTML=activationPlot();
}
document.addEventListener('input',e=>{
 if(e.target.matches('[data-fac-z]')){zValue=Number(e.target.value);renderActivation()}
});
queue();
})();