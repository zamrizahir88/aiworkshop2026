/* Hands-on guide: progress, animations, helpers */
(function(){
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const KEY='aiws2026-progress';const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const steps=$$('.step');let done={};
try{done=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){}}
function paint(){let n=0;steps.forEach(s=>{const k=s.dataset.step,d=!!done[k];if(d)n++;s.classList.toggle('is-done',d);$('.check input',s).checked=d;
 const li=$(`#steplist a[href="#step-${k}"]`);li&&li.parentElement.classList.toggle('done',d)});
 $('#pbar').style.width=(n/steps.length*100)+'%';$('#ptxt').textContent=n+' of '+steps.length+' steps done'+(n===steps.length?'. Well done!':'')}
steps.forEach(s=>{$('.check input',s).addEventListener('change',e=>{done[s.dataset.step]=e.target.checked;save();paint();if(e.target.checked&&e.target.hasAttribute('data-celebrate'))confetti(e.target)})});
$('#reset').onclick=()=>{if(confirm('Clear all ticked steps?')){done={};save();paint()}};
paint();

/* Active step in sidebar */
const links=$$('#steplist a');
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}})},{rootMargin:'-30% 0px -60% 0px'});
steps.forEach(s=>io.observe(s));

/* Run an animation when it scrolls into view */
function onView(el,fn){const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){o.disconnect();fn()}},{threshold:.35});o.observe(el)}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

/* Step 2: headers typing into the Sheet */
const HD=['Timestamp','Lecturer Name','Staff Email','Room Requested','Date of Event','Start Time','End Time','Expected Attendees','Purpose of Booking','Booking Status','Admin Remarks'];
const hdrRow=$('[data-hdr-anim] tr.h');
async function typeHeaders(){const cells=[...hdrRow.children].slice(1);cells.forEach(c=>c.textContent='');
 for(let i=0;i<HD.length;i++){const c=cells[i];c.classList.add('typing');if(reduce)c.textContent=HD[i];else for(const ch of HD[i]){c.textContent+=ch;await sleep(28)}c.classList.remove('typing')}}
if(hdrRow)onView(hdrRow,typeHeaders);

/* Click paths */
async function playPath(el){const cps=$$('.cp',el);cps.forEach(c=>c.classList.remove('on','done'));
 for(const c of cps){c.classList.add('on');await sleep(reduce?50:750);c.classList.remove('on');c.classList.add('done')}
 if(el.id==='cp10'){const v=$$('#vt .v');v.forEach(x=>x.classList.remove('live'));v[1].classList.add('live')}}
$$('[data-cp-replay]').forEach(b=>{const el=document.getElementById(b.dataset.cpReplay);b.onclick=()=>playPath(el);onView(el,()=>playPath(el))});
const vt=$$('#vt .v');if(vt.length)vt[0].classList.add('live');

/* Step 5: editor walkthrough */
const ED=[
 {code:'<span class="c">// Default code: select all and delete it</span>\n<span class="k">function</span> myFunction() {\n\n}',files:['Code.gs'],sel:0},
 {code:'<span class="c">// Paste Gemini\'s Code.gs here (yours will differ)</span>\n<span class="k">const</span> SHEET_ID = <span class="s">\'PASTE_YOUR_SHEET_ID_HERE\'</span>;\n<span class="k">const</span> SHEET_NAME = <span class="s">\'Sheet1\'</span>;\n\n<span class="k">function</span> doGet() {\n  <span class="k">return</span> HtmlService.createHtmlOutputFromFile(<span class="s">\'Index\'</span>)\n    .setTitle(<span class="s">\'FKTEN Room Reservation\'</span>);\n}',files:['Code.gs'],sel:0},
 {code:'<span class="c">// Replace the placeholder with YOUR Sheet ID and tab name</span>\n<span class="k">const</span> SHEET_ID = <span class="s hl">\'1AbC...xYz\'</span>;\n<span class="k">const</span> SHEET_NAME = <span class="s hl">\'Sheet1\'</span>;\n\n<span class="k">function</span> doGet() {\n  <span class="k">return</span> HtmlService.createHtmlOutputFromFile(<span class="s">\'Index\'</span>)\n    .setTitle(<span class="s">\'FKTEN Room Reservation\'</span>);\n}',files:['Code.gs'],sel:0},
 {code:'<span class="c">&lt;!-- New HTML file named: Index --&gt;</span>\n&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n  &lt;head&gt;\n    &lt;base target="_top"&gt;\n  &lt;/head&gt;\n  &lt;body&gt;\n  &lt;/body&gt;\n&lt;/html&gt;',files:['Code.gs','Index.html'],sel:1,newf:1},
 {code:'<span class="c">&lt;!-- Paste Gemini\'s Index.html, then Ctrl+S --&gt;</span>\n&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n&lt;head&gt;\n  &lt;link href="https://cdn.jsdelivr.net/npm/bootstrap@5..." rel="stylesheet"&gt;\n  &lt;style&gt; ... &lt;/style&gt;\n&lt;/head&gt;\n&lt;body&gt; ... booking form and table ... &lt;/body&gt;\n&lt;script&gt; ... &lt;/script&gt;\n&lt;/html&gt;',files:['Code.gs','Index.html'],sel:1}];
const edc=$('[data-edcode]'),edf=$('[data-edfiles]'),eds=$$('[data-edsteps] .cp');let edRun=0;
async function playEditor(){const id=++edRun;for(let i=0;i<ED.length;i++){if(id!==edRun)return;const e=ED[i];
 eds.forEach((c,k)=>{c.classList.toggle('on',k===i);c.classList.toggle('done',k<i)});
 edf.innerHTML=e.files.map((f,k)=>`<div class="${k===e.sel?'sel':''} ${e.newf&&k===1?'new':''}">&#128196; ${f}</div>`).join('');edc.innerHTML=e.code;await sleep(reduce?100:2600)}
 eds.forEach(c=>{c.classList.remove('on');c.classList.add('done')})}
if(edc){$('[data-ed-replay]').onclick=playEditor;onView(edc,playEditor);edc.innerHTML=ED[0].code}

/* Sheet ID helper */
const su=$('#sheeturl'),sn=$('#sheetname'),line=$('#idline'),msg=$('#idmsg');
function esc(t){return t.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function upd(){const v=su.value.trim(),m=v.match(/\/d\/([a-zA-Z0-9_-]{20,})/),name=sn.value.trim()||'Sheet1';
 let id='paste your link above';
 if(m){id=m[1];msg.textContent='Found your Sheet ID. Copy these lines and use the values in your Code.gs.';msg.style.color='var(--green)'}
 else if(v){id='not found yet';msg.textContent="That doesn't look like a Google Sheet link. It should contain /spreadsheets/d/ followed by a long code.";msg.style.color='var(--red)'}
 else{msg.textContent='Your AI-generated code may name these differently. Only replace the values inside the quotes.';msg.style.color='var(--muted)'}
 line.innerHTML=`const SHEET_ID = '<b>${esc(id)}</b>';<br>const SHEET_NAME = '<b>${esc(name)}</b>';`}
if(su){su.addEventListener('input',upd);sn.addEventListener('input',upd)}

/* Prompt 4 email */
const em=$('#myemail');
if(em){try{em.value=localStorage.getItem('aiws2026-email')||''}catch(e){}
 const set=()=>{const v=em.value.trim();$('[data-email]').textContent=v||'yourname@unimap.edu.my';try{localStorage.setItem('aiws2026-email',v)}catch(e){}};
 em.addEventListener('input',set);set()}

/* Celebration */
function confetti(from){if(reduce)return;const r=from.getBoundingClientRect(),cols=['#f2a900','#188038','#1a5fd0','#0f2742','#c5362b'];
 for(let i=0;i<60;i++){const d=document.createElement('i');const a=Math.random()*Math.PI*2,v=120+Math.random()*220;
  d.style.cssText=`position:fixed;left:${r.left+r.width/2}px;top:${r.top}px;width:8px;height:12px;background:${cols[i%5]};z-index:200;border-radius:2px;pointer-events:none;transition:transform 1.1s cubic-bezier(.2,.7,.3,1),opacity 1.1s`;
  document.body.appendChild(d);requestAnimationFrame(()=>{d.style.transform=`translate(${Math.cos(a)*v}px,${Math.sin(a)*v-120}px) rotate(${Math.random()*720}deg)`;d.style.opacity='0'});setTimeout(()=>d.remove(),1200)}}
})();
