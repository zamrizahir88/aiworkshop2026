/* Shared helpers: copy buttons and screenshot lightbox */
(function(){
 function copyText(txt,btn){
  const done=()=>{const o=btn.dataset.label||btn.textContent;btn.dataset.label=o;btn.textContent='Copied!';btn.classList.add('done');setTimeout(()=>{btn.textContent=o;btn.classList.remove('done')},1800)};
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(txt).then(done,()=>fallback(txt,done))}else fallback(txt,done);
 }
 function fallback(txt,done){const t=document.createElement('textarea');t.value=txt;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(e){}t.remove()}
 window.copyText=copyText;
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-copy]');if(!b)return;
  const src=document.getElementById(b.dataset.copy);if(!src)return;
  let t=src.dataset.text;
  if(!t){const c=src.cloneNode(true);c.querySelectorAll('.copy,button').forEach(x=>x.remove());c.querySelectorAll('br').forEach(x=>x.replaceWith('\n'));t=c.textContent}
  copyText(t.trim(),b);
 });
 // Lightbox
 const lb=document.createElement('div');lb.className='lightbox';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.innerHTML='<img alt=""><p></p>';
 document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(lb));
 const close=()=>lb.classList.remove('open');
 lb.addEventListener('click',close);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 document.addEventListener('click',e=>{
  const b=e.target.closest('figure.shot button');if(!b)return;
  const img=b.querySelector('img');lb.querySelector('img').src=img.src;lb.querySelector('img').alt=img.alt;
  lb.querySelector('p').textContent=(b.closest('figure').querySelector('figcaption')||{}).textContent||'';
  lb.classList.add('open');
 });
})();
