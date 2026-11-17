/* PECCATI · interacciones */
(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const body=document.body;

/* --- menú móvil --- */
const bt=$('.burger');
if(bt){bt.addEventListener('click',()=>{const o=body.classList.toggle('menu-open');bt.setAttribute('aria-expanded',o)});
$$('.overlay a').forEach(a=>a.addEventListener('click',()=>{body.classList.remove('menu-open');bt.setAttribute('aria-expanded','false')}))}

/* --- nav + progress + barra inferior --- */
const nav=$('.nav'),pr=$('.progress'),bar=$('.bar');let lastY=0;
const onScroll=()=>{const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  nav&&nav.classList.toggle('scrolled',y>30);
  pr&&(pr.style.transform=`scaleX(${h>0?y/h:0})`);
  if(bar){bar.classList.toggle('hide',y>lastY+4&&y>500);if(y<lastY-4)bar.classList.remove('hide')}
  lastY=y;spinPizzas(y)};
addEventListener('scroll',onScroll,{passive:true});

/* --- pizzas que giran con el scroll --- */
const pz=$$('.pz__img img');
function spinPizzas(y){if(RM)return;for(let i=0;i<pz.length;i++){pz[i].style.setProperty('--rot',(y*.12*(i%2?-1:1))+'deg')}}

/* --- reveal --- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
$$('.rv').forEach(el=>io.observe(el));

/* --- contadores --- */
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,end=+el.dataset.count,pre=el.dataset.pre||'',suf=el.dataset.suf||'';
  if(RM){el.textContent=pre+end.toLocaleString('es-ES')+suf;return}
  const t0=performance.now(),d=1600;const step=t=>{const p=Math.min((t-t0)/d,1),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=pre+v.toLocaleString('es-ES')+suf;if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step);co.unobserve(el)}),{threshold:.5});
$$('[data-count]').forEach(el=>co.observe(el));

/* --- horario: abierto ahora + día de hoy --- */
// 0=domingo ... 6=sábado ; [apertura, cierre] en minutos
const H={0:[1140,1350],1:[1140,1335],2:[1140,1335],3:[1140,1335],4:null,5:[1140,1380],6:[1140,1380]};
const now=new Date(),d=now.getDay(),m=now.getHours()*60+now.getMinutes(),fmt=x=>String(Math.floor(x/60)).padStart(2,'0')+':'+String(x%60).padStart(2,'0');
const nextOpen=()=>{for(let i=1;i<=7;i++){const k=(d+i)%7;if(H[k])return [k,H[k][0]]}};
const DN=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const open=!!H[d]&&m>=H[d][0]&&m<H[d][1];
let msg;
if(open)msg=`Abierto ahora · hasta las ${fmt(H[d][1])}`;
else if(H[d]&&m<H[d][0])msg=`Hoy abrimos a las ${fmt(H[d][0])}`;
else{const [k,t]=nextOpen();msg=(!H[d]?'Hoy cerrado · ':'Cerrado · ')+(k===(d+1)%7?'mañana':'el '+DN[k])+' desde las '+fmt(t)}
$$('.status').forEach(s=>{if(s.closest('.box'))return;s.classList.toggle('open',open);s.classList.toggle('closed',!open);const t=$('span',s);if(t)t.textContent=msg});
$$('.hours tr[data-d]').forEach(tr=>{if(tr.dataset.d.split(',').includes(String(d)))tr.classList.add('now')});

/* --- oferta del día --- */
const week=$('.week');
if(week){const today=$(`.day[data-d="${d}"]`,week);
  if(today){today.classList.add('today');const tg=$('.day__tag',today);if(tg)tg.textContent='¡HOY!';
    requestAnimationFrame(()=>{week.scrollLeft=today.offsetLeft-(week.clientWidth-today.clientWidth)/2})}
  const tb=$('.today-box p');const P={1:'<strong>3x2 en pizzas</strong>: pide 3 y paga solo 2.',2:'<strong>Martes del Peccado</strong>: 2 burgers + 2 bebidas por 19,95€.',3:'<strong>2ª burger al 50%</strong>. Hoy se pecca doble.',4:'Hoy estamos <strong>cerrados por fiesta</strong>. ¡Nos vemos mañana!',5:'<strong>Envío a domicilio GRATIS</strong>.',6:'<strong>Matcha Cookie a 1,95€</strong> (antes 3,95€).',0:'<strong>Peccacoins x2</strong>: hoy acumulas el doble.'};
  if(tb)tb.innerHTML=(d===4?'':'Hoy: ')+P[d]}

/* --- tabs carta con scroll-spy --- */
const tabs=$$('.tab'),cats=$$('.cat');
if(tabs.length){
  tabs.forEach(t=>t.addEventListener('click',e=>{e.preventDefault();const c=$(t.getAttribute('href'));c&&scrollTo({top:c.getBoundingClientRect().top+scrollY-110,behavior:RM?'auto':'smooth'})}));
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){tabs.forEach(t=>{const on=t.getAttribute('href')==='#'+e.target.id;t.classList.toggle('on',on);if(on){const bx=t.parentElement;bx.scrollTo({left:t.offsetLeft-(bx.clientWidth-t.clientWidth)/2,behavior:'smooth'})}})}}),{rootMargin:'-45% 0px -50% 0px'});
  cats.forEach(c=>so.observe(c))}

/* --- glow en tarjetas + tilt (desktop) --- */
if(matchMedia('(hover:hover)').matches&&!RM){
  $$('.it').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');c.style.transform=`perspective(700px) rotateY(${(x/r.width-.5)*8}deg) rotateX(${(.5-y/r.height)*8}deg)`});c.addEventListener('pointerleave',()=>c.style.transform='')});
  const cu=$('.cursor');if(cu)addEventListener('pointermove',e=>{cu.style.transform=`translate(${e.clientX}px,${e.clientY}px)`},{passive:true});
  const hv=$('.hero__visual img');if(hv)addEventListener('pointermove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;hv.parentElement.style.translate=`${x*-24}px ${y*-18}px`},{passive:true});
}

/* --- mapa bajo demanda (sin cookies hasta que se pulsa) --- */
const mb=$('.map button');
if(mb)mb.addEventListener('click',()=>{const f=document.createElement('iframe');f.src='https://www.google.com/maps?q=Peccati+Pizza+%26+Burger,+Av.+Onze+de+Setembre+44,+17230+Palam%C3%B3s&output=embed';f.loading='lazy';f.title='Mapa Peccati Pizza & Burger Palamós';f.referrerPolicy='no-referrer-when-downgrade';mb.replaceWith(f)});

/* --- brasas (canvas) --- */
const cv=$('#embers');
if(cv&&!RM){const ctx=cv.getContext('2d');let W,Hh,P=[],dpr=Math.min(devicePixelRatio||1,2),run=true;
  const rs=()=>{W=cv.width=cv.offsetWidth*dpr;Hh=cv.height=cv.offsetHeight*dpr};rs();addEventListener('resize',rs);
  const N=innerWidth<700?38:70;
  const mk=()=>({x:Math.random()*W,y:Hh+Math.random()*Hh*.4,r:(Math.random()*2+.6)*dpr,v:(Math.random()*.9+.35)*dpr,w:Math.random()*6.28,a:Math.random()*.6+.4,h:Math.random()<.7?28:12});
  for(let i=0;i<N;i++){const p=mk();p.y=Math.random()*Hh;P.push(p)}
  new IntersectionObserver(([e])=>{run=e.isIntersecting;if(run)loop()}).observe(cv);
  function loop(){if(!run)return;ctx.clearRect(0,0,W,Hh);ctx.globalCompositeOperation='lighter';
    for(const p of P){p.y-=p.v;p.w+=.03;p.x+=Math.sin(p.w)*.6*dpr;const life=p.y/Hh;
      if(p.y<-10){Object.assign(p,mk())}
      ctx.beginPath();ctx.fillStyle=`hsla(${p.h},100%,${55+life*10}%,${p.a*Math.min(1,life*1.6)})`;ctx.shadowBlur=12*dpr;ctx.shadowColor='#ff6a00';ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fill()}
    requestAnimationFrame(loop)}
  loop()}

onScroll();
$$('[data-year]').forEach(e=>e.textContent=now.getFullYear());
})();
