const BIENE='<svg viewBox="-20 -16 40 30" aria-hidden="true"><g class="fluegel"><ellipse cx="-3" cy="-8" rx="7" ry="5" fill="#fff" fill-opacity=".8" stroke="#3a2410" stroke-width="1"/><ellipse cx="4" cy="-8.5" rx="6" ry="4.5" fill="#fff" fill-opacity=".8" stroke="#3a2410" stroke-width="1"/></g><path d="M-12 2l-5 1 5 1z" fill="#3a2410"/><ellipse cx="0" cy="2" rx="12" ry="8" fill="#efa51a" stroke="#3a2410" stroke-width="1.4"/><path d="M-4.5-5v14.5M2.5-5.5v15" stroke="#3a2410" stroke-width="3"/><circle cx="12" cy="1" r="5" fill="#3a2410"/><circle cx="13.6" cy="-.4" r="1.3" fill="#fff"/></svg>';
const BLUETE=(x,y,s,c)=>`<g class="bl"><path d="M${x} ${y+40}q-2-24 0-40" stroke="#6f7f34" stroke-width="2.2" fill="none"/><path d="M${x} ${y+28}q-14-4-16-14q12 0 16 14z" fill="#8a9a45"/><g transform="translate(${x} ${y}) scale(${s})">${[0,72,144,216,288].map(r=>`<ellipse cx="0" cy="-9" rx="5.5" ry="9" transform="rotate(${r})" fill="${c}" stroke="#3a2410" stroke-opacity=".35"/>`).join('')}<circle r="5" fill="#efa51a" stroke="#3a2410" stroke-opacity=".5"/></g></g>`;
function bienenFuellen(main,ruhig){
 if(ruhig)return;
 main.querySelectorAll('[data-bienen]').forEach(el=>{if(el.querySelector('.flugraum'))return;const f=document.createElement('div');f.className='flugraum';f.setAttribute('aria-hidden','true');f.innerHTML=el.dataset.bienen.split(',').map(b=>`<div class="biene ${b}"><span>${BIENE}</span></div>`).join('');el.prepend(f);});
}
function parallax(main,ruhig){
 const band=main.querySelector('.landschaft');if(!band||ruhig)return;
 const ebenen=[...band.querySelectorAll('.ebene')];let lauf=false;
 const rechne=()=>{lauf=false;const r=band.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const d=(innerHeight-r.top)/(innerHeight+r.height)-.5;ebenen.forEach(e=>{e.style.transform=`translateY(${(d*(+e.dataset.tiefe||0)).toFixed(1)}px)`;});};
 addEventListener('scroll',()=>{if(!lauf){lauf=true;requestAnimationFrame(rechne);}},{passive:true});rechne();
}
function hoverBienen(main,ruhig){
 if(ruhig||!matchMedia('(hover: hover)').matches)return;
 main.querySelectorAll('.product-teaser .text-link,.product-request,.neu-streifen,.paket .text-link').forEach(a=>{
  a.classList.add('hb-wirt');
  a.addEventListener('mouseenter',()=>{if(a.querySelector('.hb'))return;const w=a.offsetWidth,h=a.offsetHeight;const zx=Math.max(w-14,20),zy=Math.min(h/2-12,-4);
   const b=document.createElement('span');b.className='hb';b.setAttribute('aria-hidden','true');b.innerHTML=BIENE;
   b.style.offsetPath=`path("M -40 ${h+10} C ${w*.2} -60, ${w*.55} ${h+30}, ${w*.7} ${-24} S ${zx+30} ${zy-30}, ${zx} ${zy}")`;
   a.append(b);b.addEventListener('animationend',()=>b.remove());});
 });
}
function zaehler(){
 const bar=document.querySelector('.preview-bar');if(!bar)return;bar.querySelector('.zaehler')?.remove();
 const n=document.querySelectorAll('main .platzhalter, main .fehlt').length;if(!n)return;
 const z=document.createElement('span');z.className='zaehler';z.innerHTML=`· <a href="freigabe.html#platzhalter">${n} Platzhalter auf dieser Seite</a>`;bar.append(z);
}
function karte(main){
 const pins=main.querySelectorAll('.karte .pin');if(!pins.length)return;
 const waehle=id=>{main.querySelectorAll('.karte .pin,.orte-liste>li').forEach(e=>e.classList.toggle('aktiv',e.dataset.ort===id));};
 pins.forEach(p=>{p.addEventListener('click',()=>{waehle(p.dataset.ort);const li=main.querySelector(`.orte-liste>li[data-ort="${p.dataset.ort}"]`);if(li&&matchMedia('(max-width:800px)').matches)li.scrollIntoView({behavior:'smooth',block:'center'});});p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();p.dispatchEvent(new Event('click'));}});});
 main.querySelectorAll('.orte-liste>li[data-ort]').forEach(li=>li.addEventListener('mouseenter',()=>waehle(li.dataset.ort)));
}
/* Zeiger (Maus oder Finger) – gemeinsam für Bienen und Bär */
const zeiger={x:-1e4,y:-1e4,v:0,t:0,maus:false,drin:false};
(()=>{let lx=0,ly=0,lt=0;const neu=e=>{const n=performance.now(),dt=Math.max(n-lt,1);zeiger.v=Math.hypot(e.clientX-lx,e.clientY-ly)/dt;lx=zeiger.x=e.clientX;ly=zeiger.y=e.clientY;lt=zeiger.t=n;zeiger.maus=e.pointerType==='mouse';zeiger.drin=true;};
 addEventListener('pointermove',neu,{passive:true});addEventListener('pointerdown',neu,{passive:true});
 document.documentElement.addEventListener('mouseleave',()=>{zeiger.drin=false;});})();
function zeigerAktiv(){return zeiger.drin&&(zeiger.maus||performance.now()-zeiger.t<3000);}
/* Bienen: wandern frei, schauen in Flugrichtung, umkreisen neugierig den Zeiger, weichen schnellen Bewegungen aus */
let schwarmLaeuft=false;const bienen=[];
function schwarm(main,ruhig){
 if(ruhig)return;
 main.querySelectorAll('.flugraum').forEach(r=>{if(r.dataset.schwarm)return;r.dataset.schwarm='1';const rr=r.getBoundingClientRect();
  r.querySelectorAll('.biene').forEach((el,i)=>bienen.push({el,r,i,x:Math.random()*Math.max(rr.width,200),y:Math.random()*Math.max(rr.height,120),vx:0,vy:0,tx:0,ty:0,neu:0,flucht:0,blick:1,ph:Math.random()*6}));
  if('IntersectionObserver' in window)new IntersectionObserver(es=>es.forEach(e=>{e.target._sicht=e.isIntersecting;})).observe(r);else r._sicht=true;});
 for(let k=bienen.length-1;k>=0;k--)if(!document.contains(bienen[k].el))bienen.splice(k,1);
 if(schwarmLaeuft)return;schwarmLaeuft=true;let lt=performance.now();
 const takt=ts=>{const f=Math.min((ts-lt)/16.7,3);lt=ts;const aktiv=zeigerAktiv();
  for(const b of bienen){if(!b.r._sicht)continue;const R=b.r.getBoundingClientRect(),w=R.width,h=R.height;const px=zeiger.x-R.left,py=zeiger.y-R.top;
   const nah=aktiv&&px>-160&&px<w+160&&py>-160&&py<h+160;let spd=1.5;
   const dz=Math.hypot(b.x-px,b.y-py);
   if(nah&&zeiger.v>1.4&&dz<90&&ts>b.flucht){b.tx=b.x+(b.x-px)/(dz||1)*190;b.ty=b.y+(b.y-py)/(dz||1)*190;b.flucht=ts+800;}
   if(ts<b.flucht){spd=5;}
   else if(nah){const a=ts/950*(b.i%2?1:-1)+b.i*2.2,rad=44+b.i*20;b.tx=px+Math.cos(a)*rad;b.ty=py+Math.sin(a)*rad*.7;spd=3;}
   else if(ts>b.neu||Math.hypot(b.tx-b.x,b.ty-b.y)<18){const x0=b.r.parentElement.classList.contains('hero')&&w>800?.5:.06;b.tx=w*(x0+Math.random()*(.94-x0));b.ty=h*(.08+Math.random()*.84);b.neu=ts+2200+Math.random()*3200;}
   b.tx=Math.max(-24,Math.min(w+24,b.tx));b.ty=Math.max(-24,Math.min(h+24,b.ty));
   const dx=b.tx-b.x,dy=b.ty-b.y,d=Math.hypot(dx,dy)||1,s=Math.min(spd,d*.06+.25);
   b.vx+=((dx/d)*s-b.vx)*.06*f;b.vy+=((dy/d)*s-b.vy)*.06*f+Math.sin(ts/170+b.ph)*.05*f;
   b.x+=b.vx*f;b.y+=b.vy*f;
   if(b.vx<-.2)b.blick=-1;else if(b.vx>.2)b.blick=1;
   const neig=Math.max(-28,Math.min(28,b.vy*9));
   b.el.style.transform=`translate(${(b.x-17).toFixed(1)}px,${(b.y-12).toFixed(1)}px) scaleX(${b.blick}) rotate(${neig.toFixed(1)}deg)`;}
  requestAnimationFrame(takt);};
 requestAnimationFrame(takt);
}
/* Bär: schaut dem Zeiger nach, hüpft und redet, wenn man ihn antippt */
const BAER_SAETZE=['Nur zum Kosten …','Pfoten weg, des is meins!','Na guat, a Löfferl für di.','Mmh … Waldhonig!','Hast die Bienen gsehn?','Kitzelt!'];
function baerSpiel(main){
 const b=main.querySelector('.baer');if(!b||b.dataset.spiel)return;b.dataset.spiel='1';
 const svg=b.querySelector('svg'),blick=b.querySelector('.blick'),blase=main.querySelector('.sprechblase');let satz=0,uhr;
 const schau=()=>{if(!zeigerAktiv()){blick.style.transform='';return;}const r=svg.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
  const cx=r.left+r.width*110/280,cy=r.top+r.height*104/200,dx=zeiger.x-cx,dy=zeiger.y-cy,d=Math.hypot(dx,dy)||1,k=Math.min(1,d/160)*4;
  blick.style.transform=`translate(${(dx/d*k).toFixed(2)}px,${(dy/d*k*.8).toFixed(2)}px)`;};
 addEventListener('pointermove',schau,{passive:true});addEventListener('scroll',schau,{passive:true});
 svg.addEventListener('pointerdown',e=>{if(!b.classList.contains('da'))return;b.classList.remove('huepf');void b.offsetWidth;b.classList.add('huepf');
  satz=(satz+1)%BAER_SAETZE.length;if(blase){blase.textContent=BAER_SAETZE[satz];blase.classList.add('zeigen');clearTimeout(uhr);uhr=setTimeout(()=>blase.classList.remove('zeigen'),2600);}});
 b.addEventListener('animationend',e=>{if(e.animationName==='huepf')b.classList.remove('huepf');});
}
function leben(){
 const ruhig=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const main=document.querySelector('main');
 bienenFuellen(main,ruhig);parallax(main,ruhig);hoverBienen(main,ruhig);zaehler();karte(main);
 const raum=main.querySelector('.hero,.page-intro');
 if(raum&&!raum.querySelector('.flugraum')&&!ruhig){const f=document.createElement('div');f.className='flugraum';f.setAttribute('aria-hidden','true');const n=raum.classList.contains('hero')?['b1','b2','b3']:['b1','b2'];f.innerHTML=n.map(b=>`<div class="biene ${b}"><span>${BIENE}</span></div>`).join('');raum.prepend(f);}
 schwarm(main,ruhig);baerSpiel(main);
 const baer=main.querySelector('.baer');
 const ziele=main.querySelectorAll('.section-head,.product-teaser,.split>*,.call-strip,.product-detail,.plain-list li,.region-panel,.contact-aside,.form-grid');
 if(ruhig||!('IntersectionObserver' in window)){baer?.classList.add('da');return;}
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('sichtbar');io.unobserve(e.target);}}),{rootMargin:'0px 0px -8% 0px'});
 ziele.forEach(el=>{const g=[...el.parentElement.children].filter(c=>c.matches?.('.product-teaser,.split>*,.plain-list li')).indexOf(el);el.style.setProperty('--d',(g>0?g*.12:0)+'s');el.classList.add('reveal');io.observe(el);});
 if(baer){const bo=new IntersectionObserver(es=>{if(es[0].isIntersecting){setTimeout(()=>{baer.classList.add('da');baer.closest('.call-strip').classList.add('bereit');},350);bo.disconnect();}},{threshold:.2});bo.observe(baer.closest('.call-strip'));}
}


document.documentElement.classList.add('js');
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);toggle.innerHTML=open?'Menü <span aria-hidden="true">−</span>':'Menü <span aria-hidden="true">＋</span>';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){toggle.click();toggle.focus();}});
const preview=document.body.dataset.preview==='true';
function params(){return new URLSearchParams(preview?location.hash.split('?')[1]?.split('#')[0]:location.search);}
function init(){leben();
 const route=document.querySelector('main').dataset.route;
 document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===route)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 document.querySelectorAll('.choice-box').forEach(box=>{const update=()=>{const size=box.querySelector('input:checked').value;box.querySelector('a').href=(preview?'#/kontakt?':'kontakt.html?')+new URLSearchParams({produkt:box.dataset.product,groesse:size});};box.addEventListener('change',update);update();});
 const form=document.querySelector('#request-form');if(!form)return;
 form.querySelector('button[type=submit]').disabled=false;const p=params(),prod=document.querySelector('#product'),size=document.querySelector('#size');
 if([...prod.options].some(o=>o.value===p.get('produkt')))prod.value=p.get('produkt');
 function sizes(){let allowed=prod.value==='Honigwaben'?['250 g','2 kg']:['Waldhonig','Cremehonig'].includes(prod.value)?['250 g','500 g']:['250 g','500 g','2 kg'];[...size.options].forEach(o=>o.disabled=!!o.value&&!allowed.includes(o.value));if(size.selectedOptions[0]?.disabled)size.value='';}sizes();
 if([...size.options].some(o=>o.value===p.get('groesse')&&!o.disabled))size.value=p.get('groesse');prod.addEventListener('change',sizes);
 const reply=document.querySelector('#reply');reply.addEventListener('input',()=>reply.setCustomValidity(''));
 form.addEventListener('submit',e=>{e.preventDefault();const nameField=document.querySelector('#name');if(!nameField.value.trim()){nameField.setCustomValidity('Bitte deinen Namen eintragen.');nameField.reportValidity();nameField.addEventListener('input',()=>nameField.setCustomValidity(''),{once:true});return;}const v=reply.value.trim();const valid=v.includes('@')?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v):/^[+\d\s()/.-]+$/.test(v)&&v.replace(/\D/g,'').length>=6;if(!valid){reply.setCustomValidity('Bitte eine gültige E-Mail-Adresse oder Telefonnummer eintragen.');reply.reportValidity();return;}const f=new FormData(form);const text=`Hallo Thiemo,\n\nich möchte folgenden Honig anfragen:\n\nProdukt: ${f.get('product')||'noch offen'}\nGröße: ${f.get('size')||'noch offen'}\nMenge: ${String(f.get('quantity')).trim()||'noch offen'}\nLieferung: ${f.get('delivery')||'noch offen'}\n\n${String(f.get('message')).trim()}\n\nBitte gib mir Bescheid, was verfügbar ist, was es kostet und wann eine Übergabe bzw. der Versand möglich wäre.\n\n${String(f.get('name')).trim()}\nRückmeldung an: ${v}`;document.querySelector('#draft-text').value=text.replace(/\n{3,}/g,'\n\n');document.querySelector('#draft').hidden=false;document.querySelector('#draft-heading').focus();});
 document.querySelector('#copy').onclick=async()=>{const el=document.querySelector('#draft-text'),s=document.querySelector('#copy-status');try{if(!navigator.clipboard)throw new Error();await navigator.clipboard.writeText(el.value);s.textContent='Kopiert. Die Anfrage wurde nicht versendet.';}catch{el.focus();el.select();s.textContent='Bitte den markierten Text mit Strg+C bzw. ⌘C kopieren. Die Anfrage wurde nicht versendet.';}};
 document.querySelector('#save').onclick=()=>{const u=URL.createObjectURL(new Blob([document.querySelector('#draft-text').value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='Anfrage-Imkerei-Grassler.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);document.querySelector('#copy-status').textContent='Textdatei vorbereitet. Die Anfrage wurde nicht versendet.';};
}
if(preview){const templates=JSON.parse(document.querySelector('#page-data').textContent);const titles=JSON.parse(document.querySelector('#title-data').textContent);function route(first=false){const raw=location.hash.slice(2)||document.body.dataset.initial;const name=raw.split(/[?#]/)[0];const r=templates[name]?name:'index';const main=document.querySelector('main');main.innerHTML=templates[r];main.dataset.route=r;document.title=titles[r]+' | Imkerei Grassler';nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.innerHTML='Menü <span aria-hidden="true">＋</span>';init();const anchor=raw.includes('#')?raw.split('#')[1]:null;if(anchor)document.getElementById(anchor)?.scrollIntoView();else{window.scrollTo(0,0);if(!first)main.querySelector('h1')?.focus({preventScroll:true});}}window.addEventListener('hashchange',()=>route());route(true);}else init();
