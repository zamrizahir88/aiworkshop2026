/* Animated recreation of the FKTEN eBooking Room System.
   mountBookingDemo(host, {onStage}) -> {start, stop} */
(function(){
const ROOMS_PH='Select a room...';
const html=`
<div class="bdemo" aria-hidden="true">
 <div class="bd-win bd-app">
  <div class="bd-bar"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><div class="bd-url">script.google.com/a/macros/unimap.edu.my/s/…/exec</div></div>
  <div class="bd-body">
   <div class="bd-head"><div class="bd-title">FKTEN Room Reservation</div><div class="bd-badge">Logged in: aina@unimap.edu.my</div></div>
   <div class="bd-tabs"><div class="bd-tab on" data-t="book">&#128100; Book a Room</div><div class="bd-tab adm" data-t="admin">&#9881; Admin Dashboard</div></div>
   <div class="bd-view on" data-v="book">
    <div class="bd-grid">
     <div class="bd-f"><label>Lecturer Name</label><div class="bd-in ph" data-f="name">e.g. Dr. Ahmad</div></div>
     <div class="bd-f"><label>Staff Email</label><div class="bd-in ro">aina@unimap.edu.my</div></div>
     <div class="bd-f"><label>Room Requested</label><div class="bd-in sel ph" data-f="room">${ROOMS_PH}</div></div>
     <div class="bd-f"><label>Date of Event</label><div class="bd-in ph" data-f="date">dd/mm/yyyy</div></div>
     <div class="bd-f t"><label>Start Time</label><div class="bd-in ph" data-f="start">--:-- --</div></div>
     <div class="bd-f t"><label>End Time</label><div class="bd-in ph" data-f="end">--:-- --</div></div>
     <div class="bd-f t"><label>Expected Attendees</label><div class="bd-in ph" data-f="pax">e.g. 25</div></div>
     <div class="bd-f w"><label>Purpose of Booking</label><div class="bd-in ph" data-f="purpose">e.g. Final Year Project Presentation</div></div>
    </div>
    <div class="bd-btn" data-b="submit"><span data-bt>Submit Reservation</span><div class="bd-spin"></div></div>
    <div class="bd-h5">Public Schedule</div>
    <table class="bd-table"><thead><tr><th>Date</th><th>Room</th><th>Time</th><th>Lecturer</th><th>Status</th></tr></thead><tbody data-sched></tbody></table>
   </div>
   <div class="bd-view" data-v="admin">
    <div class="bd-alertbox"><b>Admin Access Verified:</b> You can approve or reject pending requests below.</div>
    <table class="bd-table bd-adm"><thead><tr><th style="width:52%">Booking Details</th><th>Status</th><th style="width:30%">Action (Admin Only)</th></tr></thead><tbody data-adm></tbody></table>
   </div>
   <div class="bd-dialog" data-dlg><b>script.googleusercontent.com says</b><span data-dlgt></span><div class="okb" data-dlgok>OK</div></div>
  </div>
 </div>
 <div class="bd-win bd-sheet" style="display:flex;flex-direction:column">
  <div class="bd-sbar"><svg width="16" height="20" viewBox="0 0 16 20"><path d="M10 0H2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6z" fill="#fff" opacity=".9"/><path d="M3 9h10v7H3z" fill="#188038"/><path d="M4 10h3.5v2H4zm4.5 0H12v2H8.5zM4 13h3.5v2H4zm4.5 0H12v2H8.5z" fill="#fff"/></svg>eBooking Room System · Google Sheets</div>
  <table class="bd-sgrid"><thead><tr><th style="width:30px"></th><th>B</th><th>D</th><th style="width:88px">J</th><th>K</th></tr></thead><tbody data-sheet></tbody></table>
  <div class="bd-sfoot">Showing 4 of 11 columns. Every booking is one row.</div>
 </div>
 <svg class="bd-cursor" viewBox="0 0 24 24"><path d="M4 2l15 11-7 1.2 4 7.3-3 1.6-4-7.4L4 20z" fill="#fff" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/></svg>
</div>`;
const BASE=[
 ['2026-10-01','Bilik Mesyuarat Utama','09:00 - 12:00','Hafiz','a'],
 ['2026-10-02','Dewan Seminar','14:00 - 16:00','Nurul','a']];
window.mountBookingDemo=function(host,opt){
 opt=opt||{};
 host.classList.add('bdemo-scale');host.innerHTML=html;
 const R=host.querySelector('.bdemo'),$=s=>R.querySelector(s),cur=$('.bd-cursor');
 const fit=()=>{const s=host.clientWidth/1180;R.style.transform='scale('+s+')';host.style.height=(600*s)+'px'};
 fit(); if(window.ResizeObserver) new ResizeObserver(fit).observe(host); else addEventListener('resize',fit);
 let run=0; const stage=i=>opt.onStage&&opt.onStage(i);
 const wait=(ms,id)=>new Promise((res,rej)=>setTimeout(()=>id===run?res():rej('stop'),ms));
 const pos=el=>{const a=el.getBoundingClientRect(),b=R.getBoundingClientRect(),s=b.width/1180;return[(a.left-b.left)/s+a.width/s*0.55,(a.top-b.top)/s+a.height/s*0.6]};
 const move=async(el,id)=>{const p=pos(el);cur.style.transform=`translate(${p[0]}px,${p[1]}px)`;await wait(750,id)};
 const click=async id=>{cur.classList.remove('click');void cur.offsetWidth;cur.classList.add('click');await wait(260,id)};
 const type=async(el,txt,id)=>{el.classList.remove('ph');el.classList.add('foc');el.textContent='';for(const c of txt){el.textContent+=c;await wait(45,id)}el.classList.remove('foc');await wait(120,id)};
 const set=async(el,txt,id)=>{el.classList.add('foc');await wait(250,id);el.classList.remove('ph');el.textContent=txt;await wait(250,id);el.classList.remove('foc')};
 const sched=()=>$('[data-sched]'),sheet=()=>$('[data-sheet]');
 const pill=s=>s==='a'?'<span class="bd-pill a">Approved</span>':'<span class="bd-pill p">Pending</span>';
 function reset(){
  cur.style.transition='none';cur.style.transform='translate(900px,560px)';void cur.offsetWidth;cur.style.transition='';
  tab('book');
  const ph={name:'e.g. Dr. Ahmad',room:ROOMS_PH,date:'dd/mm/yyyy',start:'--:-- --',end:'--:-- --',pax:'e.g. 25',purpose:'e.g. Final Year Project Presentation'};
  for(const k in ph){const e=$(`[data-f="${k}"]`);e.textContent=ph[k];e.classList.add('ph')}
  const b=$('[data-b="submit"]');b.className='bd-btn';b.querySelector('[data-bt]').textContent='Submit Reservation';
  sched().innerHTML=BASE.map(r=>`<tr><td>${r[0]}</td><td><b>${r[1]}</b></td><td>${r[2]}</td><td>${r[3]}</td><td>${pill(r[4])}</td></tr>`).join('');
  $('[data-adm]').innerHTML='<tr><td colspan="3" class="bd-empty">No pending requests.</td></tr>';
  sheet().innerHTML='<tr class="hdr"><td class="rn">1</td><td>Lecturer Name</td><td>Room Requested</td><td>Booking Status</td><td>Admin Remarks</td></tr>'+
   BASE.map((r,i)=>`<tr><td class="rn">${i+2}</td><td>${r[3]}</td><td>${r[1]}</td><td>Approved</td><td></td></tr>`).join('')+
   '<tr><td class="rn">4</td><td></td><td></td><td></td><td></td></tr><tr><td class="rn">5</td><td></td><td></td><td></td><td></td></tr>';
  dlg(false);
 }
 function tab(t){R.querySelectorAll('.bd-tab').forEach(x=>x.classList.toggle('on',x.dataset.t===t));R.querySelectorAll('.bd-view').forEach(x=>x.classList.toggle('on',x.dataset.v===t))}
 function dlg(on,t){const d=$('[data-dlg]');if(t)$('[data-dlgt]').textContent=t;d.classList.toggle('on',on)}
 function flash(td,txt){td.textContent=txt;td.classList.remove('flash');void td.offsetWidth;td.classList.add('flash')}
 async function loop(id){
  for(;;){
   reset();stage(0);await wait(900,id);
   const F=[['name','Dr. Aina','t'],['room','Bilik Diskusi (Capacity: 10)','s'],['date','05/10/2026','t'],['start','10:00 AM','t'],['end','12:00 PM','t'],['pax','8','t'],['purpose','FYP supervision meeting','t']];
   for(const f of F){const el=$(`[data-f="${f[0]}"]`);await move(el,id);await click(id);f[2]==='t'?await type(el,f[1],id):await set(el,f[1],id)}
   const b=$('[data-b="submit"]');await move(b,id);await click(id);b.classList.add('press');await wait(120,id);b.classList.remove('press');b.classList.add('busy');b.querySelector('[data-bt]').textContent='Submitting...';
   await wait(1300,id);dlg(true,'Booking request submitted successfully! It is now Pending admin approval.');
   stage(1);
   const tr=document.createElement('tr');tr.className='bd-new';tr.innerHTML='<td>2026-10-05</td><td><b>Bilik Diskusi</b></td><td>10:00 - 12:00</td><td>Dr. Aina</td><td>'+pill('p')+'</td>';sched().appendChild(tr);
   const row=sheet().children[3];row.children[1].textContent='';['Dr. Aina','Bilik Diskusi','Pending'].forEach((t,i)=>flash(row.children[i+1],t));
   await wait(1500,id);await move($('[data-dlgok]'),id);await click(id);dlg(false);
   b.className='bd-btn';b.querySelector('[data-bt]').textContent='Submit Reservation';await wait(700,id);
   // admin
   const at=R.querySelector('.bd-tab.adm');await move(at,id);await click(id);
   $('[data-adm]').innerHTML=`<tr><td><b>Bilik Diskusi (FKTEN 1 – Blok 11, Aras 1)</b><br><span style="color:#6c757d">2026-10-05 | 10:00 - 12:00</span><br>By: Dr. Aina (aina@unimap.edu.my)<br>Purpose: <i>FYP supervision meeting</i> (Pax: 8)</td><td>${pill('p')}</td><td><div class="rm ph" data-rm>Admin remarks (optional)</div><div class="ok" data-ok>Approve</div><div class="no">Reject</div></td></tr>`;
   tab('admin');stage(2);await wait(900,id);
   const rm=$('[data-rm]');await move(rm,id);await click(id);rm.style.color='#212529';await type(rm,'Key at FKTEN office',id);
   const ok=$('[data-ok]');await move(ok,id);await click(id);ok.classList.add('busy');ok.textContent='Processing...';await wait(1200,id);
   dlg(true,'Booking successfully Approved!');
   flash(row.children[3],'Approved');flash(row.children[4],'Key at FKTEN office');stage(3);
   await wait(1400,id);await move($('[data-dlgok]'),id);await click(id);dlg(false);
   $('[data-adm]').innerHTML='<tr><td colspan="3" class="bd-empty">No pending requests. All caught up!</td></tr>';await wait(600,id);
   await move(R.querySelector('.bd-tab[data-t="book"]'),id);await click(id);tab('book');
   tr.lastElementChild.innerHTML=pill('a');tr.classList.remove('bd-new');void tr.offsetWidth;tr.classList.add('bd-new');
   await wait(3800,id);
  }
 }
 reset();
 return{
  start(){const id=++run;loop(id).catch(()=>{})},
  stop(){run++}
 };
};
})();
