/* Slide engine + interactive slide behaviours */
(function(){
const stage=document.getElementById('stage'),wrap=document.querySelector('.stage-wrap');
const slides=[...stage.querySelectorAll('.slide')];
const H={};let cur=0;
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const frags=s=>$$('.frag',s);
const shown=s=>frags(s).filter(f=>f.classList.contains('show')).length;
const hook=(s,name,arg)=>{const h=H[s.dataset.id];if(h&&h[name])h[name](s,arg)};
function setFrags(s,n){frags(s).forEach((f,i)=>f.classList.toggle('show',i<n));hook(s,'frag',n)}
function go(i,mode){
 i=Math.max(0,Math.min(slides.length-1,i));const old=slides[cur],s=slides[i];
 if(old!==s){old.classList.remove('active');hook(old,'leave')}
 cur=i;s.classList.add('active');hook(s,'enter');setFrags(s,mode==='end'?frags(s).length:0);ui();
 history.replaceState(null,'','#'+(i+1));
}
function next(){const s=slides[cur],n=shown(s);if(n<frags(s).length)setFrags(s,n+1);else if(cur<slides.length-1)go(cur+1)}
function prev(){const s=slides[cur],n=shown(s);if(n>0)setFrags(s,n-1);else if(cur>0)go(cur-1,'end')}
function ui(){
 $('.count').textContent=(cur+1)+' / '+slides.length;
 $('.pbar i').style.width=((cur+1)/slides.length*100)+'%';
 const a=$('aside.notes',slides[cur]);$('#notes-body').textContent=a?a.textContent.trim():'';
}
function fit(){const w=wrap.clientWidth-20,h=wrap.clientHeight-20,k=Math.max(.1,Math.min(w/1280,h/720));stage.style.transform=`translate(-50%,-50%) scale(${k})`}
addEventListener('resize',fit);fit();
const notesP=$('#notes'),btnN=$('[data-b="notes"]'),keyh=$('.keyhelp');
function toggleNotes(){const o=notesP.classList.toggle('open');btnN.setAttribute('aria-pressed',o)}
const root=document.documentElement,fsEl=()=>document.fullscreenElement||document.webkitFullscreenElement;
const fsOK=!!(root.requestFullscreen||root.webkitRequestFullscreen);
function toggleFS(){if(!fsOK)return;if(!fsEl())(root.requestFullscreen||root.webkitRequestFullscreen).call(root);else(document.exitFullscreen||document.webkitExitFullscreen).call(document)}
function onFS(){document.body.classList.toggle('fs',!!fsEl());$('[data-b="fs"]').setAttribute('aria-pressed',!!fsEl());setTimeout(fit,60)}
document.addEventListener('fullscreenchange',onFS);document.addEventListener('webkitfullscreenchange',onFS);
if(!fsOK)$('[data-b="fs"]').hidden=true;
$('[data-b="prev"]').onclick=prev;$('[data-b="next"]').onclick=next;btnN.onclick=toggleNotes;$('[data-b="fs"]').onclick=toggleFS;
$('[data-b="keys"]').onclick=()=>keyh.classList.toggle('open');
document.addEventListener('keydown',e=>{
 const t=e.target,tag=(t.tagName||'').toLowerCase();
 if(tag==='input'||tag==='textarea'||tag==='select'||e.ctrlKey||e.metaKey||e.altKey)return;
 const onBtn=tag==='button';
 if(['ArrowRight','PageDown'].includes(e.key)||(e.key===' '&&!onBtn)){e.preventDefault();next()}
 else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();prev()}
 else if(e.key==='Home')go(0);else if(e.key==='End')go(slides.length-1);
 else if(e.key==='n'||e.key==='N')toggleNotes();
 else if(e.key==='f'||e.key==='F')toggleFS();
 else if(e.key==='?')keyh.classList.toggle('open');
});
let tx=null;wrap.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
wrap.addEventListener('touchend',e=>{if(tx===null)return;const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>60)(dx<0?next:prev)();tx=null});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function relPos(el,root){let x=0,y=0;while(el&&el!==root){x+=el.offsetLeft;y+=el.offsetTop;el=el.offsetParent}return[x,y]}

/* 2 journey */
const JD=[["Learn how web systems work and the 4 golden rules of prompting.","A mental model and a prompt checklist"],["Prompts 1 to 3: design the system, set up the Sheet, generate Code.gs and Index.html.","Your own Sheet and two code files"],["Deploy as a web app, authorise it, and submit your first booking.","A live link to your own booking system"],["Prompt 4 adds admin and user roles with approvals. Then redeploy.","Admins can approve or reject bookings"],["Catch up, fix bugs, try challenge tasks, and plan the Title Proposal Vetting system.","Ideas for your own next system"]];
H.journey={enter(s){const sel=i=>{$$('.jn-stop',s).forEach((b,k)=>b.classList.toggle('sel',k===i));$('[data-jd="do"]',s).textContent=JD[i][0];$('[data-jd="have"]',s).textContent=JD[i][1];$('.jn-line i',s).style.width=(i/4*100)+'%'};
 if(!s._b){s._b=1;$$('.jn-stop',s).forEach(b=>b.onclick=()=>sel(+b.dataset.i))}sel(0)}};

/* 3 build (booking demo) */
let demo=null;
H.build={enter(s){const lis=$$('.stages li',s);if(!demo){demo=mountBookingDemo($('[data-demo]',s),{onStage:i=>lis.forEach((l,k)=>l.classList.toggle('on',k===i))});$('[data-act="replay"]',s).onclick=()=>{demo.stop();demo.start()}}demo.start()},leave(){demo&&demo.stop()}};

/* 4 static vs system */
H['static-system']={enter(s){
 if(s._b)return;s._b=1;let vis=1;const rooms=['Bilik Diskusi','Dewan Seminar','Bilik Tutorial'];
 let data=[{n:'Dr. Hafiz',r:'Dewan Seminar'},{n:'Pn. Nurul',r:'Bilik Diskusi'}];
 const ops=o=>{$$('.crud span',s).forEach(x=>x.classList.toggle('on',o.includes(x.dataset.op)));clearTimeout(s._t);s._t=setTimeout(()=>$$('.crud span',s).forEach(x=>x.classList.remove('on')),1600)};
 const render=()=>{const ul=$('[data-list]',s);ul.innerHTML='';data.forEach((d,i)=>{const li=document.createElement('li');li.innerHTML=`<span><b></b> · <a href="#" title="Click to change room" style="color:inherit"></a></span><button aria-label="Delete">×</button>`;li.querySelector('b').textContent=d.n;li.querySelector('a').textContent=d.r;
  li.querySelector('a').onclick=e=>{e.preventDefault();d.r=rooms[(rooms.indexOf(d.r)+1)%rooms.length];render();ops('UR')};
  li.querySelector('button').onclick=()=>{data.splice(i,1);render();ops('DR')};ul.appendChild(li)});
  $('[data-cnt]',s).textContent=data.length+(data.length===1?' record':' records')+' stored'};
 render();
 const add=()=>{const inp=$('[data-in]',s),v=inp.value.trim();if(!v){inp.focus();return}data.push({n:v,r:$('[data-rm]',s).value});inp.value='';render();ops('CR')};
 $('[data-act="add"]',s).onclick=add;$('[data-in]',s).addEventListener('keydown',e=>{if(e.key==='Enter')add()});
 $('[data-act="visit"]',s).onclick=()=>{vis++;$('[data-vis]',s).textContent='Visitor '+vis;const m=$('.mini-body',s);m.style.opacity=.3;setTimeout(()=>m.style.opacity=1,200)};
}};

/* 5 quiz */
H.quiz={enter(s){if(!s._b){s._b=1;$$('.qcard',s).forEach(c=>c.onclick=()=>c.classList.toggle('flip'))}},frag(s,n){$$('.qcard',s).forEach((c,i)=>c.classList.toggle('flip',i<n))}};

/* 6 layers */
const LM=[[0,'Index.html collects the booking from the form'],[1,'Code.gs receives it and checks it'],[2,'Google Sheet stores it as a new row'],[1,'Code.gs reads all the bookings back'],[0,'Index.html shows the updated table. Done!']];
H.layers={async run(s){const id=s._run=(s._run||0)+1;for(const m of LM){if(s._run!==id)return;$$('.layer',s).forEach((l,k)=>l.classList.toggle('on',k===m[0]));$('[data-lmsg]',s).textContent=m[1];await sleep(1500)}if(s._run===id)$$('.layer',s).forEach(l=>l.classList.remove('on'))},
 enter(s){if(!s._b){s._b=1;$('[data-act="send"]',s).onclick=()=>H.layers.run(s)}setTimeout(()=>{if(s.classList.contains('active'))H.layers.run(s)},700)},leave(s){s._run=(s._run||0)+1;$$('.layer',s).forEach(l=>l.classList.remove('on'))}};

/* 7 GAS menu animation */
H.gas={async enter(s){const id=s._run=(s._run||0)+1,g=$('[data-gm]',s),cur=$('[data-cur]',g),cap=$('[data-cap]',g),drop=$('[data-drop]',g),ed=$('[data-ed]',g),ext=$('[data-ext]',g),as=$('[data-as]',g);
 const mv=async el=>{const p=relPos(el,g);cur.style.transform=`translate(${p[0]+el.offsetWidth*.5}px,${p[1]+el.offsetHeight*.6}px)`;await sleep(800)};
 const alive=()=>s._run===id;
 while(alive()){cur.style.transition='none';cur.style.transform='translate(470px,330px)';void cur.offsetWidth;cur.style.transition='';drop.classList.remove('on');ed.classList.remove('on');ext.classList.remove('on');as.classList.remove('hv');
  cap.innerHTML='Open your Google Sheet';await sleep(1400);if(!alive())return;
  cap.innerHTML='Click <b>Extensions</b>';await mv(ext);if(!alive())return;ext.classList.add('on');drop.classList.add('on');await sleep(700);
  cap.innerHTML='Choose <b>Apps Script</b>';await mv(as);if(!alive())return;as.classList.add('hv');await sleep(600);
  ed.classList.add('on');cap.innerHTML='The editor opens in a new tab, with <b>Code.gs</b> ready';await sleep(3500)}
},leave(s){s._run=(s._run||0)+1}};

/* 9 flow */
const FS=[[234,100,306,100,0,1,'The lecturer fills in the booking form on Index.html'],[536,100,614,100,1,2,'Index.html sends the booking to Code.gs'],[844,100,920,100,2,3,'Code.gs saves it as a new row in the Sheet'],[920,170,844,170,3,2,'Code.gs reads all the bookings back'],[614,170,536,170,2,1,'Index.html refreshes the table. Done!']];
H.flow={frag(s,n){const dot=$('[data-dot]',s),nodes=$$('.fnode',s);s._run=(s._run||0)+1;const id=s._run;nodes.forEach(x=>x.classList.remove('on'));
 if(n===0){dot.style.opacity=0;$('[data-fn]',s).textContent='1';$('[data-ft]',s).textContent='Press → to follow one booking through the system.';s._last=0;return}
 const st=FS[n-1],animate=n===(s._last||0)+1;s._last=n;$('[data-fn]',s).textContent=n;$('[data-ft]',s).textContent=st[6];
 const place=(x,y)=>{dot.style.left=(x-13)+'px';dot.style.top=(y-13)+'px'};
 if(!animate){place(st[2],st[3]);dot.style.opacity=1;nodes[st[5]].classList.add('on');return}
 nodes[st[4]].classList.add('on');place(st[0],st[1]);dot.style.opacity=1;const t0=performance.now();
 const f=t=>{if(s._run!==id)return;let p=Math.min(1,(t-t0)/900);p=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;place(st[0]+(st[2]-st[0])*p,st[1]+(st[3]-st[1])*p);if(p<1)requestAnimationFrame(f);else{nodes[st[4]].classList.remove('on');nodes[st[5]].classList.add('on')}};requestAnimationFrame(f)}};

/* 10 vibe */
const VD=[['Describe','Say what you want in plain language, using the 4 golden rules.'],['Generate','Gemini writes Code.gs and Index.html in seconds.'],['Test','Paste, deploy, and try it like a real user would.'],['Refine','Describe what is wrong or what to add. Then go round again.']];
H.vibe={enter(s){const bs=$$('.cyc',s),orb=$('.orb',s);const set=i=>{bs.forEach((b,k)=>b.classList.toggle('on',k===i));$('[data-vk]',s).textContent=VD[i][0];$('[data-vd]',s).textContent=VD[i][1]};
 if(!s._b){s._b=1;bs.forEach(b=>b.onclick=()=>{clearInterval(s._iv);orb.style.animationPlayState='paused';set(+b.dataset.c)})}
 clearInterval(s._iv);orb.style.animation='none';void orb.offsetWidth;orb.style.animation='';orb.style.animationPlayState='running';let i=0;set(0);s._iv=setInterval(()=>{i=(i+1)%4;set(i)},2000)},
 leave(s){clearInterval(s._iv)}};

/* 11 roles sorting */
const RI=[['Types the code','a'],['Decides what to build','y'],['Explains error messages','a'],['Tests every change','y'],['Knows FKTEN\'s booking rules','y'],['Suggests a structure','a'],['Spots what\'s wrong','y'],['Works fast, sometimes wrong','a']];
H.roles={enter(s){const pool=$('[data-pool]',s),sa=$('[data-slot="a"]',s),sy=$('[data-slot="y"]',s);pool.innerHTML='';sa.innerHTML='';sy.innerHTML='';let left=RI.length;
 RI.forEach(([t,ans])=>{const c=document.createElement('div');c.className='pc-chip';c.innerHTML='<span></span><button class="a">AI</button><button class="y">You</button>';c.querySelector('span').textContent=t;
  c.querySelectorAll('button').forEach(b=>b.onclick=()=>{const pick=b.classList.contains('a')?'a':'y';if(pick===ans){const d=document.createElement('div');d.textContent=t;(ans==='a'?sa:sy).appendChild(d);c.remove();if(--left===0)pool.innerHTML='<div class="done">All sorted! &#127881;</div>'}else{c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake')}});pool.appendChild(c)})}};

/* 12 mistakes */
H.mistakes={enter(s){if(!s._b){s._b=1;$$('.mcard',s).forEach(c=>c.onclick=()=>c.classList.toggle('open'))}$$('.mcard',s).forEach(c=>c.classList.remove('open'))}};

/* 13 RCTC builder */
const RT={r:'Act as a Senior Web Systems Analyst.',c:'I want to build an Online Room Reservation System for FKTEN using Google Apps Script and Google Sheets. Lecturers can book only our 6 official rooms.',t:'Suggest 5 essential features, the data fields to store, and a booking status workflow.',k:'Keep it simple, practical and non-technical. Do not write the code yet.'};
const RN={r:'Role',c:'Context',t:'Task',k:'Constraints'},RO=['r','c','t','k'];
H.rctc={render(s){const on=s._on,box=$('[data-pv]',s);const got=RO.filter(k=>on.has(k));
 box.innerHTML=got.length?'':'<span class="ph">Your prompt appears here. Switch on a rule to start.</span>';got.forEach(k=>{const sp=document.createElement('span');sp.className=k;sp.textContent=RT[k];box.appendChild(sp)});
 $$('.tg',s).forEach(b=>b.classList.toggle('on',on.has(b.dataset.k)));$('[data-meter]',s).className='meter m'+got.length;
 const miss=RO.filter(k=>!on.has(k)).map(k=>RN[k]);
 $('[data-says]',s).textContent=got.length===0?'"I have nothing to go on."':miss.length===0?'"Clear. I know exactly what to deliver."':`"I'll have to guess the ${miss.join(' and ').toLowerCase()}."`},
 enter(s){s._on=s._on||new Set();if(!s._b){s._b=1;$$('.tg',s).forEach(b=>b.onclick=()=>{const k=b.dataset.k;s._on.has(k)?s._on.delete(k):s._on.add(k);H.rctc.render(s)})}},
 frag(s,n){s._on=new Set(RO.slice(0,n));H.rctc.render(s)}};

/* 15 anatomy */
const AK=['t','d','b','f','k'];
H.anatomy={hl(s,k){const code=$('[data-code]',s);code.classList.toggle('dim',!!k);$$('.seg',s).forEach(x=>x.classList.toggle('hl',x.dataset.s===k));$$('.aitem',s).forEach(x=>x.classList.toggle('on',x.dataset.s===k))},
 enter(s){if(!s._b){s._b=1;$$('.aitem',s).forEach(b=>b.onclick=()=>H.anatomy.hl(s,b.dataset.s))}},frag(s,n){H.anatomy.hl(s,n?AK[n-1]:null)}};

/* 16 constraints */
H.constraints={enter(s){if(!s._b){s._b=1;$$('.fc',s).forEach(c=>c.onclick=()=>c.classList.toggle('flip'))}},frag(s,n){$$('.fc',s).forEach((c,i)=>c.classList.toggle('flip',i<n))}};

/* 17 chain */
H.chain={frag(s,n){$$('.ch',s).forEach((c,i)=>c.classList.toggle('on',n===0||i<n))}};

/* 18 activity timer */
H.activity={enter(s){if(s._b)return;s._b=1;let left=120,iv=null;const t=$('[data-t]',s),b=$('[data-act="tstart"]',s);
 const show=()=>{t.textContent=left<=0?'Time!':Math.floor(left/60)+':'+String(left%60).padStart(2,'0');t.classList.toggle('low',left<=15)};
 b.onclick=()=>{if(iv){clearInterval(iv);iv=null;b.textContent='Resume';return}if(left<=0)left=120;b.textContent='Pause';iv=setInterval(()=>{left--;show();if(left<=0){clearInterval(iv);iv=null;b.textContent='Start'}},1000)};
 $('[data-act="treset"]',s).onclick=()=>{clearInterval(iv);iv=null;left=120;b.textContent='Start';show()};show()}};

/* 19 debug */
H.debug={frag(s,n){$('.err',s).classList.toggle('sel',n>=1);const a=n<=1?0:n-1;$$('.ds',s).forEach((d,i)=>d.classList.toggle('on',i<=a))}};

/* 20 save vs deploy */
const SC=[['blue','#0d6efd'],['green','#198754'],['purple','#6f42c1'],['orange','#fd7e14']];
H.savedeploy={enter(s){const st=s._st={d:0,sv:0,lv:0,ver:1};const es=$('[data-es]',s),ec=$('[data-ec]',s),lv=$('[data-lv]',s),lb=$('[data-lb]',s),m=$('[data-sdm]',s);
 const msg=(t,c)=>{m.textContent=t;m.className='sd-msg'+(c?' '+c:'')};
 const paint=()=>{ec.textContent='"'+SC[st.d][0]+'"';es.textContent=st.d===st.sv?'Saved':'Unsaved changes';es.className='st '+(st.d===st.sv?'saved':'unsaved');lv.textContent='Version '+st.ver;lb.style.background=SC[st.lv][1]};
 paint();msg('Click "Edit the code" to change the button colour.');
 $('[data-act="edit"]',s).onclick=()=>{st.d=(st.d+1)%4;if(st.d===st.lv&&st.d===st.sv)st.d=(st.d+1)%4;paint();msg('You changed the code to '+SC[st.d][0]+'. The live app has not changed. Nobody else can see your edit yet.')};
 $('[data-act="save"]',s).onclick=()=>{if(st.d===st.sv){msg('Nothing new to save.');return}st.sv=st.d;paint();msg('Saved. The live app still shows '+SC[st.lv][0]+'. Saving only updates the editor.')};
 $('[data-act="deploy"]',s).onclick=()=>{if(st.d!==st.sv){msg('You have unsaved changes. Save first: a new version uses your last saved code.','warn');return}if(st.sv===st.lv){msg('Nothing new to deploy. Edit and save a change first.');return}st.lv=st.sv;st.ver++;paint();msg('Deployed version '+st.ver+'. Colleagues now see a '+SC[st.lv][0]+' button, at the same link.','good')};
 $('[data-act="sdreset"]',s).onclick=()=>H.savedeploy.enter(s)}};

/* 22 glossary */
H.glossary={enter(s){if(!s._b){s._b=1;$$('.gcard',s).forEach(c=>c.onclick=()=>c.classList.toggle('open'))}}};

const start=parseInt((location.hash||'').slice(1),10);
slides.forEach(s=>s.classList.remove('active'));cur=0;slides[0].classList.add('active');
go(isNaN(start)?0:start-1);
})();
