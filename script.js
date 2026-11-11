const $=id=>document.getElementById(id),AT=['AGI','FOR','INT','PRE','VIG'],COL=['#c4253a','#3b7dd8','#3fa66b','#d6b36a','#8a5cd0','#d8742f'];
const WX=[['limpo','Limpo'],['chuva','Chuva'],['tempestade','Tempestade'],['neve','Neve'],['neblina','Neblina'],['sol','Sol forte']];
let S={map:'',grid:60,showGrid:true,wx:'limpo',wi:60,dk:0,sel:null,t:[]};
try{const r=localStorage.getItem('mesa-op');if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}
const save=()=>{try{localStorage.setItem('mesa-op',JSON.stringify(S))}catch(e){}if(window.sync)sync()};
const stage=$('stage'),get=id=>S.t.find(t=>t.id===id);
function mapBg(){const v=S.map;stage.style.background=!v?'#1a1822':v.startsWith('data:')?`url(${v}) center/cover no-repeat`:v}
function gridBg(){const g=$('grid');g.style.display=S.showGrid?'block':'none';g.style.backgroundImage='linear-gradient(#ffffff26 1px,transparent 1px),linear-gradient(90deg,#ffffff26 1px,transparent 1px)';g.style.backgroundSize=S.grid+'px '+S.grid+'px'}
function fig(ty,c){const O='stroke="#000b" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
 if(ty==='monstro')return `<svg viewBox="0 0 60 90" ${O}><path d="M13 86L17 64Q6 50 15 34Q23 20 40 24Q55 30 50 52L46 64L51 86L40 86L36 70L26 70L22 86Z" fill="#1b1520"/><path d="M40 24Q52 8 57 17Q50 19 46 31ZM20 30Q9 12 4 21Q11 23 18 35Z" fill="${c}"/><path d="M14 40L1 62L7 67L18 52ZM48 40L59 64L53 69L44 52Z" fill="#1b1520"/><path d="M24 46Q32 54 40 46" fill="none" stroke="${c}"/><circle cx="26" cy="37" r="3" fill="#ffdf6b"/><circle cx="38" cy="37" r="3" fill="#ffdf6b"/></svg>`;
 if(ty==='npc')return `<svg viewBox="0 0 60 90" ${O}><path d="M22 70L21 86L29 86L30 70L31 86L39 86L38 70Z" fill="#23202c"/><path d="M17 30Q30 24 43 30L47 78L13 78Z" fill="${c}"/><path d="M16 32L9 56L14 58L19 42ZM44 32L51 56L46 58L41 42Z" fill="${c}"/><circle cx="30" cy="18" r="9" fill="#e3c3a1"/><path d="M18 14H42L38 6Q30 2 22 6Z" fill="#3a3340"/></svg>`;
 return `<svg viewBox="0 0 60 90" ${O}><path d="M22 58L20 86L29 86L30 62L31 86L40 86L38 58Z" fill="#23202c"/><path d="M18 30Q30 24 42 30L44 62L16 62Z" fill="${c}"/><path d="M16 32L9 56L14 58L19 42ZM44 32L51 56L46 58L41 42Z" fill="${c}"/><path d="M30 30L30 62" fill="none"/><circle cx="30" cy="18" r="9" fill="#e3c3a1"/><path d="M21 17Q30 3 39 17Q30 11 21 17Z" fill="#2a2330"/></svg>`}
function tokens(){stage.querySelectorAll('.tk').forEach(e=>e.remove());S.t.forEach(t=>{const e=document.createElement('div');e.className='tk '+t.type+(S.sel===t.id?' sel':'');e.dataset.id=t.id;e.tabIndex=0;e.style.zIndex=5+Math.round(t.y);e.style.left=t.x+'%';e.style.top=t.y+'%';
 e.innerHTML=`<div class="st"><div class="base" style="background-color:${t.color}"></div>${t.img?`<img src="${t.img}" alt="">`:fig(t.type,t.color)}</div><div class="n"></div><div class="b"><i style="width:${Math.max(0,Math.min(100,t.pv/(t.pvMax||1)*100))}%"></i></div>`;e.querySelector('.n').textContent=t.name;stage.appendChild(e)})}
function list(){const l=$('list');l.innerHTML=S.t.length?'':'<div class="empty">Nenhuma peça na mesa. Adicione um agente ou criatura.</div>';S.t.forEach(t=>{const d=document.createElement('div');d.className='item'+(S.sel===t.id?' sel':'');d.innerHTML=`<span class="dot" style="background:${t.color}"></span><span style="flex:1"></span><small style="color:var(--mt)">${t.pv}/${t.pvMax}</small>`;d.children[1].textContent=t.name;d.onclick=()=>select(t.id);l.appendChild(d)})}
function editor(){const t=get(S.sel),e=$('ed');if(!t){e.innerHTML='<h2>Ficha</h2><div class="empty">Selecione uma peça para editar nome, atributos, vida e sanidade.</div>';atr();return}
 const n=(k,v,x='')=>`<input type="number" data-k="${k}" value="${v}" ${x}>`;
 e.innerHTML=`<h2>Ficha</h2><label>Nome</label><input data-k="name" value="" id="nm">
 <div class="g2"><div><label>Tipo</label><select data-k="type"><option value="pj">Agente</option><option value="npc">NPC</option><option value="monstro">Criatura</option></select></div><div><label>Cor</label><input type="color" data-k="color" value="${t.color}"></div></div>
 <div class="g2"><div><label>NEX %</label>${n('nex',t.nex,'step=5 min=0 max=99')}</div><div><label>Imagem em pé (PNG sem fundo)</label><input type="file" id="ti" accept="image/*"></div></div>
 <div class="g3"><div><label>PV</label>${n('pv',t.pv)}</div><div><label>PE</label>${n('pe',t.pe)}</div><div><label>SAN</label>${n('san',t.san)}</div>
 <div><label>PV máx</label>${n('pvMax',t.pvMax)}</div><div><label>PE máx</label>${n('peMax',t.peMax)}</div><div><label>SAN máx</label>${n('sanMax',t.sanMax)}</div></div>
 <label>Atributos</label><div class="g5">${AT.map(a=>`<div><small style="color:var(--mt)">${a}</small>${n('at.'+a,t.at[a],'min=0 max=5')}</div>`).join('')}</div>
 <label>Lanterna (revela o escuro)</label><select data-k="lamp"><option value="0">Desligada</option><option value="90">Curta</option><option value="150">Média</option><option value="230">Longa</option></select><label>Anotações</label><textarea data-k="note" rows="3"></textarea>
 <div class="row" style="margin-top:8px"><button id="del">Remover peça</button></div>`;
 $('nm').value=t.name;e.querySelector('[data-k=type]').value=t.type;e.querySelector('[data-k=lamp]').value=t.lamp||0;e.querySelector('[data-k=note]').value=t.note||'';
 $('del').onclick=()=>{S.t=S.t.filter(x=>x!==t);S.sel=null;all()};
 $('ti').onchange=ev=>{const f=ev.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{t.img=r.result;save();tokens();tokImgs()};r.readAsDataURL(f)};atr()}
function tokImgs(){S.t.forEach(t=>{if(t.img){const c=stage.querySelector(`[data-id="${t.id}"] .c`);if(c){c.style.backgroundImage=`url(${t.img})`;c.textContent=''}}})}
function atr(){const t=get(S.sel);$('at').innerHTML=t?AT.map(a=>`<button data-a="${a}" title="Testar ${a}">${a} ${t.at[a]}</button>`).join(''):'<div class="empty" style="grid-column:1/-1">Selecione uma peça para testar atributos.</div>'}
function all(){mapBg();gridBg();tokens();tokImgs();zones();list();editor();save()}
function select(id){S.sel=id;all()}
function add(type){const id='t'+Date.now();const m=type==='monstro';S.t.push({id,type,name:m?'Criatura':type==='npc'?'NPC':'Agente',x:50,y:50,color:m?'#8a1c28':COL[S.t.length%COL.length],nex:5,pv:m?30:16,pvMax:m?30:16,pe:6,peMax:6,san:m?0:20,sanMax:m?0:20,at:{AGI:1,FOR:1,INT:1,PRE:1,VIG:1},note:''});select(id)}
function logLine(h){const d=document.createElement('div');d.innerHTML=h;$('log').prepend(d)}
const d=n=>1+Math.floor(Math.random()*n);
function teste(a){const t=get(S.sel),v=t.at[a],b=+$('pb').value;let r=[],q;if(v<=0){r=[d(20),d(20)];q=Math.min(...r)}else{r=Array.from({length:v},()=>d(20));q=Math.max(...r)}
 const nat=q===20?' · crítico!':q===1?' · falha crítica':'';logLine(`<b></b> ${a}: [${r.join(', ')}] → ${q}${b?' +'+b:''} = <b>${q+b}</b>${nat}`);$('log').firstChild.firstChild.textContent=t.name;toast(q+b,t.name+' · '+a)}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.add)add(b.dataset.add);else if(b.dataset.a)teste(b.dataset.a);
 else if(b.dataset.d){const n=+b.dataset.d,r=d(n);logLine(`d${n}: <b>${r}</b>`);toast(r,'d'+n)}});
$('ed').addEventListener('input',e=>{const t=get(S.sel),k=e.target.dataset.k;if(!t||!k)return;let v=e.target.value;
 if(k.startsWith('at.'))t.at[k.slice(3)]=Math.max(0,+v||0);else if(['nex','pv','pe','san','pvMax','peMax','sanMax','lamp'].includes(k))t[k]=+v||0;else t[k]=v;
 tokens();tokImgs();list();atr();lamp();save()});
$('up').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{S.map=r.result;all()};r.readAsDataURL(f)};
$('pre').onchange=e=>{if(e.target.value){S.map=e.target.value;all()}};
$('gc').onclick=()=>{S.map='';all()};
$('gs').oninput=e=>{S.grid=+e.target.value;gridBg();save()};
$('gt').onclick=()=>{S.showGrid=!S.showGrid;$('gt').textContent=S.showGrid?'Grade ligada':'Grade desligada';$('gt').classList.toggle('on',S.showGrid);gridBg();save()};
$('wi').oninput=e=>{S.wi=+e.target.value;save()};
$('wd').oninput=e=>{S.dk=+e.target.value;$('dark').style.opacity=S.dk/100;save()};
$('reset').onclick=()=>{if(confirm('Remover todas as peças e o mapa?')){S.t=[];S.z=[];S.dr=[];S.roof=[];S.sel=null;S.map='';all()}};
$('wx').innerHTML=WX.map(([k,n])=>`<button data-w="${k}">${n}</button>`).join('');
$('wx').onclick=e=>{const k=e.target.dataset.w;if(k){S.wx=k;wxBtn();save()}};
function wxBtn(){$('wx').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.w===S.wx))}
/* arrastar peças */
stage.addEventListener('pointerdown',e=>{const el=e.target.closest('.tk');if(!el)return;e.preventDefault();const id=el.dataset.id;S.sel=id;list();editor();stage.querySelectorAll('.tk').forEach(x=>x.classList.toggle('sel',x.dataset.id===id));
 const t=get(id);if(!can(t))return;el.classList.add('drag');el.setPointerCapture(e.pointerId);
 const mv=ev=>{const r=stage.getBoundingClientRect();t.x=Math.max(0,Math.min(100,(ev.clientX-r.left)/r.width*100));t.y=Math.max(0,Math.min(100,(ev.clientY-r.top)/r.height*100));el.style.left=t.x+'%';el.style.top=t.y+'%';lamp()};
 const up=()=>{el.classList.remove('drag');el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);save()};
 el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up)});
/* escuridão, portas e mansão */
S.tool=null;S.z=S.z||[];S.dr=S.dr||[];S.roof=S.roof||[];S.view=S.view||'mestre';
if(S.z.some(z=>z.id==='z-hall')){S.z=S.z.filter(z=>!z.id.startsWith('z-'));S.dr=S.dr.filter(d=>!d.id.startsWith('dm'));S.t=S.t.filter(t=>!t.id.startsWith('m-'));S.roof=[];if(S.map.startsWith('data:image/svg+xml'))S.map=''}
const HINT={zone:'Arraste sobre o mapa para escurecer uma área.',door:'Clique na parede onde fica a porta. Ela abre a área escura mais próxima.',del:'Clique numa área escura ou numa porta para apagar.',roof:'Arraste sobre um edifício: dentro dele não chove nem neva.'};
const px=e=>{const r=stage.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100}};
function zones(){stage.querySelectorAll('.zn,.door,.roof').forEach(e=>e.remove());S.roof.forEach(r=>{const e=document.createElement('div');e.className='roof';e.style.cssText=`left:${r.x}%;top:${r.y}%;width:${r.w}%;height:${r.h}%`;stage.appendChild(e)});
 S.z.forEach(z=>{const e=document.createElement('div');e.dataset.z=z.id;e.style.cssText=`left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%`;e.innerHTML='<span></span>';e.firstChild.textContent=z.name+' (clique para abrir)';
  e.onclick=()=>{if(S.tool==='del'){S.z=S.z.filter(q=>q!==z);S.dr=S.dr.filter(d=>d.z!==z.id);zones();save()}else if(!S.tool)flip(z)};stage.appendChild(e)});
 S.dr.forEach(d=>{const e=document.createElement('div');e.dataset.d=d.id;e.style.left=d.x+'%';e.style.top=d.y+'%';e.title='Abrir ou fechar porta';
  e.onclick=ev=>{ev.stopPropagation();if(S.tool==='del'){S.dr=S.dr.filter(q=>q!==d);zones();save()}else if(!S.tool){const z=S.z.find(q=>q.id===d.z);if(z)flip(z)}};stage.appendChild(e)});zst()}
function zst(){stage.classList.toggle('pl',S.view!=='mestre');S.z.forEach(z=>{const e=stage.querySelector(`[data-z='${z.id}']`);if(e)e.className='zn'+(z.open?' open':'')});
 S.dr.forEach(d=>{const z=S.z.find(q=>q.id===d.z),e=stage.querySelector(`[data-d='${d.id}']`);if(e)e.className='door '+d.o+(z&&z.open?' open':'')});
 $('vw').textContent=S.view==='mestre'?'Visão do mestre':'Visão dos jogadores';lamp()}
function flip(z){z.open=!z.open;zst();save()}
stage.addEventListener('pointerdown',e=>{
 if(S.tool==='zone'||S.tool==='roof'){e.preventDefault();e.stopPropagation();const a=px(e),pv=document.createElement('div');pv.className='pvz';stage.appendChild(pv);
  const mv=ev=>{const b=px(ev);pv.style.left=Math.min(a.x,b.x)+'%';pv.style.top=Math.min(a.y,b.y)+'%';pv.style.width=Math.abs(a.x-b.x)+'%';pv.style.height=Math.abs(a.y-b.y)+'%'};
  const up=ev=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);pv.remove();const b=px(ev),w=Math.abs(a.x-b.x),h=Math.abs(a.y-b.y);
   if(w>2&&h>3){const RR={x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),w,h};if(S.tool==='roof')S.roof.push(RR);else S.z.push({id:'z'+Date.now(),...RR,open:false,name:'Área '+(S.z.length+1)});zones();save()}};
  window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up)}
 else if(S.tool==='door'){e.preventDefault();e.stopPropagation();const a=px(e);let best=null,bd=1e9;
  S.z.forEach(z=>{const dx=Math.max(z.x-a.x,0,a.x-z.x-z.w)*10,dy=Math.max(z.y-a.y,0,a.y-z.y-z.h)*6.25,dd=Math.hypot(dx,dy);if(dd<bd){bd=dd;best=z}});
  if(!best)return;const l=Math.abs(a.x-best.x)*10,r=Math.abs(a.x-best.x-best.w)*10,t=Math.abs(a.y-best.y)*6.25,b=Math.abs(a.y-best.y-best.h)*6.25;
  S.dr.push({id:'d'+Date.now(),x:a.x,y:a.y,o:Math.min(t,b)<Math.min(l,r)?'h':'v',z:best.id});zones();save()}
},true);
function mansao(){
 const R=[['hall',400,400,200,175,'Hall de entrada','#6b5238',1],['sala',200,400,200,175,'Sala de estar','#5a3a3a'],['jantar',600,400,200,175,'Sala de jantar','#4d4a3a'],['coz',200,250,200,150,'Cozinha','#4a5560'],['cor',400,250,200,150,'Corredor','#4f3d2f'],['esc',600,250,200,150,'Escritório','#3d4a3b'],['quarto',200,75,200,175,'Quarto do casal','#523a52'],['bib',400,75,200,175,'Biblioteca','#3b3a55'],['cap',600,75,200,175,'Capela oculta','#2e2a36']];
 const q=(x,y,w,h,f,r=2)=>`<rect x='${x}' y='${y}' width='${w}' height='${h}' rx='${r}' fill='${f}' stroke='#0008' stroke-width='2'/>`;
 let s="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 625'><rect width='1000' height='625' fill='#1b2a1b'/>";
 for(let i=0;i<40;i++)s+=`<circle cx='${(i*137)%1000}' cy='${(i*71)%625}' r='${14+i%3*6}' fill='#22351f' opacity='.7'/>`;
 s+="<rect x='470' y='585' width='60' height='40' fill='#6d6048'/><rect x='180' y='58' width='640' height='540' fill='#0009'/><rect x='190' y='65' width='620' height='520' fill='#2a1d14'/>";
 R.forEach(r=>s+=`<rect x='${r[1]}' y='${r[2]}' width='${r[3]}' height='${r[4]}' fill='${r[6]}' stroke='#150e09' stroke-width='8'/><text x='${r[1]+r[3]/2}' y='${r[2]+r[4]-10}' fill='#f2e6cc' font-size='13' text-anchor='middle' font-family='Georgia,serif'>${r[5]}</text>`);
 s+=q(440,430,120,80,'#7a2430',4)+q(562,410,32,60,'#9b8661')+q(480,570,40,10,'#9b6a35')+q(215,430,100,34,'#6e3b4a',6)+q(250,490,50,50,'#8d6a3a',25)+q(640,450,120,60,'#8d6a3a',4)+q(660,430,20,14,'#4b341f')+q(720,430,20,14,'#4b341f')+q(660,516,20,14,'#4b341f')+q(720,516,20,14,'#4b341f')+q(210,262,180,22,'#8b95a1')+q(250,320,60,40,'#8d6a3a',4)+q(420,300,160,50,'#6b2430',3)+q(650,280,110,40,'#8d6a3a',3)+q(690,330,24,24,'#4b341f',12)+q(215,95,90,120,'#a58fb0',4)+q(330,100,50,30,'#8d6a3a',3)+q(415,85,170,20,'#5a3b22')+q(430,150,60,40,'#8d6a3a',3)+q(520,150,50,40,'#8d6a3a',3)+q(670,95,60,32,'#9b9bb0',3)+"<circle cx='700' cy='190' r='34' fill='none' stroke='#c4253a' stroke-width='3'/></svg>";
 S.map='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(s)));
 S.z=R.map(r=>({id:'z-'+r[0],x:r[1]/10,y:r[2]/6.25,w:r[3]/10,h:r[4]/6.25,open:!!r[7],name:r[5]}));
 S.dr=[[500,400,'h','cor'],[400,487,'v','sala'],[600,487,'v','jantar'],[400,325,'v','coz'],[600,325,'v','esc'],[500,250,'h','bib'],[400,162,'v','quarto'],[600,162,'v','cap']].map((d,i)=>({id:'dm'+i,x:d[0]/10,y:d[1]/6.25,o:d[2],z:'z-'+d[3]}));
 const T=(id,type,name,x,y,color,pv,san)=>({id,type,name,x,y,color,nex:5,pv,pvMax:pv,pe:6,peMax:6,san,sanMax:san,at:{AGI:1,FOR:1,INT:1,PRE:1,VIG:1},note:''});
 S.t=S.t.filter(t=>!t.id.startsWith('m-'));S.t.push(T('m-caseiro','npc','Caseiro',50,86,'#6b7f9b',12,12),T('m-criatura','monstro','Criatura da capela',70,26,'#8a1c28',40,0));
 S.roof=[{x:19,y:10.4,w:62,h:83.2}];S.grid=50;S.view='mestre';$('gs').value=S.grid;all()}
$('vw').onclick=()=>{S.view=S.view==='mestre'?'jogadores':'mestre';zst();save()};
document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>{S.tool=S.tool===b.dataset.tool?null:b.dataset.tool;document.querySelectorAll('[data-tool]').forEach(x=>x.classList.toggle('on',x.dataset.tool===S.tool));$('th').textContent=HINT[S.tool]||'Clique numa área escura ou numa porta para abrir.';stage.style.cursor=S.tool?'crosshair':''});
$('za').onclick=()=>{S.z.forEach(z=>z.open=true);zst();save()};$('zc').onclick=()=>{S.z.forEach(z=>z.open=false);zst();save()};

/* lanterna e bestiário */
function lamp(){S.z.forEach(z=>{const e=stage.querySelector(`[data-z='${z.id}']`);if(!e)return;const m=[];if(!z.open)S.t.forEach(t=>{if(!+t.lamp)return;const r=+t.lamp,cx=(t.x-z.x)*10,cy=(t.y-z.y)*6.25;if(cx<-r-30||cy<-r-30||cx>z.w*10+r+30||cy>z.h*6.25+r+30)return;m.push(`radial-gradient(circle at ${cx}px ${cy}px,transparent ${r}px,#000 ${r+28}px)`)});
 const v=m.join(',');e.style.webkitMaskImage=v;e.style.maskImage=v;e.style.webkitMaskComposite='source-in';e.style.maskComposite='intersect'})}
const BEST=[['Cultista','npc','#7a4a8a',18,{AGI:2,FOR:1,INT:1,PRE:2,VIG:1},'Fanático da mansão. Faca (1d4+2). Foge se ferido.'],['Zumbi de sangue','monstro','#8a1c28',35,{AGI:0,FOR:3,INT:0,PRE:0,VIG:3},'Lento, golpe pesado (1d8+3). Aguenta muito dano.'],['Aparição','monstro','#6a8fb0',25,{AGI:3,FOR:0,INT:1,PRE:3,VIG:1},'Atravessa paredes. Ao vê-la, teste de SAN (perde 1d4).'],['Vulto','monstro','#3a3a52',20,{AGI:4,FOR:1,INT:1,PRE:1,VIG:1},'Ataca no escuro e some. Enxerga sem luz.'],['Guardião da capela','monstro','#c4253a',60,{AGI:1,FOR:4,INT:1,PRE:2,VIG:4},'Chefe. Só desperta quando a capela é aberta.']];
BEST.forEach((b,i)=>{const o=document.createElement('option');o.value=i;o.textContent=b[0]+' · PV '+b[3];$('bs').appendChild(o)});
$('bs').onchange=e=>{const b=BEST[e.target.value];e.target.value='';if(!b)return;const id='t'+Date.now(),m=b[1]==='monstro';S.t.push({id,type:b[1],name:b[0],x:50,y:50,color:b[2],nex:5,pv:b[3],pvMax:b[3],pe:6,peMax:6,san:m?0:12,sanMax:m?0:12,at:b[4],note:b[5]});select(id)};
$('rc').onclick=()=>{S.roof=[];zones();save()};
/* mesa: mover vista e zoom */
const tb=$('table'),wd=$('world');let V={x:0,y:0,s:1};
const view=()=>wd.style.transform=`translate(${V.x}px,${V.y}px) scale(${V.s})`;
function fit(){V.s=Math.min(tb.clientWidth*.97/1000,tb.clientHeight*.97/stage.offsetHeight);V.x=(tb.clientWidth-1000*V.s)/2;V.y=(tb.clientHeight-stage.offsetHeight*V.s)/2;view()}
function zoom(f,cx,cy){const n=Math.max(.2,Math.min(3,V.s*f)),r=n/V.s;V.x=cx-(cx-V.x)*r;V.y=cy-(cy-V.y)*r;V.s=n;view()}
tb.addEventListener('wheel',e=>{e.preventDefault();const r=tb.getBoundingClientRect();zoom(e.deltaY<0?1.12:1/1.12,e.clientX-r.left,e.clientY-r.top)},{passive:false});
tb.addEventListener('pointerdown',e=>{if(e.target.closest('.tk,#zoomctl'))return;let lx=e.clientX,ly=e.clientY,sx=lx,sy=ly,on=0;const mv=ev=>{if(!on){if(Math.hypot(ev.clientX-sx,ev.clientY-sy)<5)return;on=1;tb.setPointerCapture(e.pointerId);tb.style.cursor='grabbing'}V.x+=ev.clientX-lx;V.y+=ev.clientY-ly;lx=ev.clientX;ly=ev.clientY;view()};const up=()=>{tb.style.cursor='';tb.removeEventListener('pointermove',mv);tb.removeEventListener('pointerup',up)};tb.addEventListener('pointermove',mv);tb.addEventListener('pointerup',up)});
$('zi').onclick=()=>zoom(1.2,tb.clientWidth/2,tb.clientHeight/2);$('zo').onclick=()=>zoom(1/1.2,tb.clientWidth/2,tb.clientHeight/2);$('zf').onclick=fit;$('zs').onclick=()=>{document.fullscreenElement?document.exitFullscreen():tb.requestFullscreen&&tb.requestFullscreen()};document.addEventListener('fullscreenchange',()=>setTimeout(fit,100));
function toast(n,l){const t=$('toast');t.innerHTML=`<div style="font:80px/1 'Special Elite',monospace;color:var(--gd);text-shadow:0 4px 18px #000">${n}</div><div id="tl"></div>`;$('tl').textContent=l;t.classList.remove('show');void t.offsetWidth;t.classList.add('show')}
/* clima */
const cv=$('fx'),cx=cv.getContext('2d');let W=0,H=0,P=Array.from({length:500},()=>({x:Math.random(),y:Math.random(),v:.5+Math.random(),s:Math.random()*2+1})),fl=0,fg=0;
function rs(){W=cv.width=stage.clientWidth;H=cv.height=stage.clientHeight}new ResizeObserver(rs).observe(stage);
function loop(){cx.clearRect(0,0,W,H);const k=S.wi/100,w=S.wx;
 if(w==='chuva'||w==='tempestade'){const n=Math.floor(k*(w==='tempestade'?500:300));cx.strokeStyle='rgba(175,205,255,.55)';cx.lineWidth=1;cx.beginPath();for(let i=0;i<n;i++){const p=P[i];p.y+=p.v*.03*(1+k);p.x-=.004;if(p.y>1){p.y=0;p.x=Math.random()*1.2}if(p.x<0)p.x=1;cx.moveTo(p.x*W,p.y*H);cx.lineTo(p.x*W-3,p.y*H+14)}cx.stroke();
  if(w==='tempestade'){if(Math.random()<.004*k+.001)fl=1;if(fl>0){cx.fillStyle=`rgba(220,230,255,${fl*.7})`;cx.fillRect(0,0,W,H);fl-=.07}}}
 else if(w==='neve'){const n=Math.floor(k*400);cx.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<n;i++){const p=P[i];p.y+=p.v*.003;p.x+=Math.sin(p.y*20+i)*.0008;if(p.y>1)p.y=0;cx.beginPath();cx.arc(p.x*W,p.y*H,p.s,0,7);cx.fill()}}
 else if(w==='neblina'){fg+=.0007;for(let i=0;i<6;i++){const x=((Math.sin(fg*(i+1)+i*2)+1)/2)*W,y=(i/6+.08)*H,g=cx.createRadialGradient(x,y,0,x,y,W*.45);g.addColorStop(0,`rgba(200,205,215,${.32*k})`);g.addColorStop(1,'rgba(200,205,215,0)');cx.fillStyle=g;cx.fillRect(0,0,W,H)}}
 else if(w==='sol'){const g=cx.createRadialGradient(W*.85,0,0,W*.85,0,W*.9);g.addColorStop(0,`rgba(255,220,140,${.5*k})`);g.addColorStop(1,'rgba(255,200,100,0)');cx.fillStyle=g;cx.fillRect(0,0,W,H)}
 if(S.roof.length){cx.globalCompositeOperation='destination-out';cx.fillStyle='#000';S.roof.forEach(r=>cx.fillRect(r.x/100*W,r.y/100*H,r.w/100*W,r.h/100*H));cx.globalCompositeOperation='source-over'}
 requestAnimationFrame(loop)}
$('gt').classList.toggle('on',S.showGrid);$('gt').textContent=S.showGrid?'Grade ligada':'Grade desligada';
$('gs').value=S.grid;$('wi').value=S.wi;$('wd').value=S.dk;$('dark').style.opacity=S.dk/100;wxBtn();all();rs();fit();loop();
/* aba Personagem */
const FD=()=>({nome:'',classe:'Combatente',origem:'',nex:5,at:{AGI:1,FOR:1,INT:1,PRE:1,VIG:1},pv:16,pvMax:16,pe:6,peMax:6,san:20,sanMax:20,tr:{},rit:[],dd:[{nome:'Teste livre',n:1,l:20,b:0,cor:'#c4253a',f:''}],img:'',hist:''});
S.ficha=Object.assign(FD(),S.ficha||{});
const PER='Acrobacia:AGI,Adestramento:PRE,Artes:PRE,Atletismo:FOR,Atualidades:INT,Ciências:INT,Crime:AGI,Diplomacia:PRE,Enganação:PRE,Fortitude:VIG,Furtividade:AGI,Iniciativa:AGI,Intimidação:PRE,Intuição:PRE,Investigação:INT,Luta:FOR,Medicina:INT,Ocultismo:INT,Percepção:PRE,Pilotagem:AGI,Pontaria:AGI,Profissão:INT,Reflexos:AGI,Religião:PRE,Sobrevivência:INT,Tática:INT,Tecnologia:INT,Vontade:PRE'.split(',').map(s=>s.split(':'));
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])),gp=(o,p)=>p.split('.').reduce((a,k)=>a&&a[k],o),sp=(o,p,v)=>{const a=p.split('.'),l=a.pop();a.reduce((x,k)=>x[k],o)[l]=v};
function showTab(t){$('sheet').classList.toggle('on',t==='ficha');document.querySelector('.app').style.display=t==='ficha'?'none':'';document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab===t))}
$('role').insertAdjacentHTML('afterend',"<div id='tabs' class='row' style='flex:none;margin-left:12px'><button data-tab='mesa' class='on'>Mesa</button><button data-tab='ficha'>Personagem</button></div>");
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
function anim(cor,txt,label){const e=$('dv'),s=String(txt);e.style.setProperty('--c',cor||'#c4253a');e.classList.remove('rd');void e.offsetWidth;e.classList.add('rd');let i=0;const iv=setInterval(()=>{e.style.fontSize='34px';e.textContent=1+Math.floor(Math.random()*20);if(++i>9){clearInterval(iv);e.style.fontSize=s.length>6?'14px':s.length>3?'22px':'34px';e.textContent=s;const l=document.createElement('div');l.textContent=label+' → '+s;$('flog').prepend(l);logLine(esc(label)+' → <b>'+esc(s)+'</b>')}},70)}
function renderImg(){const b=$('fimg');b.innerHTML='';if(S.ficha.img){const i=document.createElement('img');i.src=S.ficha.img;i.style.cssText='max-width:100%;max-height:100%;object-fit:contain';b.appendChild(i)}else{b.textContent='Sem imagem ainda';b.style.color='var(--mt)'}}
$('sheet').addEventListener('input',e=>{const k=e.target.dataset.f;if(!k)return;sp(S.ficha,k,e.target.type==='number'?(+e.target.value||0):e.target.value);save()});
/* perícias */
$('fper').innerHTML=PER.map((p,i)=>`<div class='per'><span>${p[0]} <small style='color:var(--mt)'>${p[1]}</small></span><select data-t='${p[0]}'><option value='0'>Destr. +0</option><option value='5'>Trein. +5</option><option value='10'>Vet. +10</option><option value='15'>Exp. +15</option></select><button data-p='${i}' title='Rolar'>🎲</button></div>`).join('');
$('fper').onchange=e=>{const n=e.target.dataset.t;if(n){S.ficha.tr[n]=+e.target.value;save()}};
$('fper').onclick=e=>{const b=e.target.closest('button');if(!b)return;const p=PER[+b.dataset.p],v=S.ficha.at[p[1]]||0,bn=S.ficha.tr[p[0]]||0;let r,q;if(v<=0){r=[d(20),d(20)];q=Math.min(...r)}else{r=Array.from({length:v},()=>d(20));q=Math.max(...r)}anim('#3b7dd8',q+bn,`${S.ficha.nome||'Agente'}: ${p[0]} (${p[1]} ${v}) [${r.join(', ')}]${bn?' +'+bn:''}`)};
/* dados personalizados */
function renderDD(){const r=$('fdd');r.innerHTML='';S.ficha.dd.forEach((x,i)=>{const e=document.createElement('div');e.className='card';e.innerHTML=`<div class='row'><input type='color' data-di='${i}' data-dk='cor' style='max-width:44px'><input data-di='${i}' data-dk='nome' placeholder='Nome do dado'></div><div class='g3' style='margin-top:6px;color:var(--mt);font-size:11px'><span>Qtd</span><span>Lados</span><span>Bônus</span></div><div class='g3'><input type='number' min='1' max='20' data-di='${i}' data-dk='n'><input type='number' min='2' max='1000' data-di='${i}' data-dk='l'><input type='number' data-di='${i}' data-dk='b'></div><input data-di='${i}' data-dk='f' placeholder='Faces personalizadas (opcional): Sucesso, Falha…' style='margin-top:6px'><div class='row' style='margin-top:6px'><button data-dr='${i}' class='pri'>Rolar</button><button data-dx='${i}'>Remover</button></div>`;['cor','nome','n','l','b','f'].forEach(k=>e.querySelector(`[data-dk='${k}']`).value=x[k]??'');r.appendChild(e)})}
$('fdd').oninput=e=>{const i=e.target.dataset.di,k=e.target.dataset.dk;if(i==null)return;S.ficha.dd[i][k]=e.target.type==='number'?(+e.target.value||0):e.target.value;save()};
$('fdd').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.dx!=null){S.ficha.dd.splice(+b.dataset.dx,1);renderDD();save();return}if(b.dataset.dr==null)return;const x=S.ficha.dd[+b.dataset.dr],n=Math.max(1,+x.n||1),fs=(x.f||'').split(',').map(s=>s.trim()).filter(Boolean),l=fs.length||Math.max(2,+x.l||6),r=[];for(let i=0;i<n;i++)r.push(fs.length?fs[Math.floor(Math.random()*fs.length)]:d(l));const txt=fs.length?r.join(' · '):r.reduce((a,c)=>a+c,0)+(+x.b||0);anim(x.cor,txt,`${x.nome||'Dado'} ${n}d${l}${!fs.length&&x.b?(x.b>0?'+':'')+x.b:''} [${r.join(', ')}]`)};
$('fadd').onclick=()=>{S.ficha.dd.push({nome:'Novo dado',n:1,l:6,b:0,cor:COL[S.ficha.dd.length%COL.length],f:''});renderDD();save()};
/* rituais */
function renderRT(){const r=$('frt');r.innerHTML='';S.ficha.rit.forEach((x,i)=>{const e=document.createElement('div');e.className='card';e.innerHTML=`<div class='row'><input data-ri='${i}' data-rk='nome' placeholder='Nome do ritual'><select data-ri='${i}' data-rk='el' style='max-width:112px'>${['Sangue','Morte','Conhecimento','Energia','Medo'].map(o=>`<option>${o}</option>`).join('')}</select></div><div class='g3' style='margin-top:6px'><input type='number' min='1' max='4' data-ri='${i}' data-rk='ci' placeholder='Círculo'><input type='number' min='0' data-ri='${i}' data-rk='pe' placeholder='PE'><input data-ri='${i}' data-rk='al' placeholder='Alcance'></div><textarea data-ri='${i}' data-rk='ef' rows='2' placeholder='Efeito' style='margin-top:6px'></textarea><div class='row' style='margin-top:6px'><button data-rc='${i}' class='pri'>Conjurar</button><button data-rx='${i}'>Remover</button></div>`;['nome','el','ci','pe','al','ef'].forEach(k=>e.querySelector(`[data-rk='${k}']`).value=x[k]??'');r.appendChild(e)})}
$('frt').oninput=e=>{const i=e.target.dataset.ri,k=e.target.dataset.rk;if(i==null)return;S.ficha.rit[i][k]=e.target.type==='number'?(+e.target.value||0):e.target.value;save()};
$('frt').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.rx!=null){S.ficha.rit.splice(+b.dataset.rx,1);renderRT();save();return}if(b.dataset.rc==null)return;const x=S.ficha.rit[+b.dataset.rc],c=+x.pe||0;if(S.ficha.pe<c){alert('PE insuficiente para conjurar.');return}S.ficha.pe-=c;document.querySelector("[data-f='pe']").value=S.ficha.pe;save();anim('#8a5cd0','✦',`${x.nome||'Ritual'} (${x.el||'?'}) conjurado, -${c} PE`)};
$('frad').onclick=()=>{S.ficha.rit.push({nome:'',el:'Sangue',ci:1,pe:1,al:'',ef:''});renderRT();save()};
/* imagem: foto ou desenho */
$('ffoto').onchange=e=>{const f=e.target.files[0];if(f)shrink(f,300,.9,u=>{S.ficha.img=u;renderImg();save()});e.target.value=''};
$('frm').onclick=()=>{S.ficha.img='';renderImg();save()};
$('fdes').onclick=()=>{const m=document.createElement('div');m.id='rm';m.innerHTML=`<div class='rb' style='width:min(360px,94vw)'><h2>Desenhar personagem</h2><canvas id='dc' width='300' height='420'></canvas><div class='row'><input type='color' id='dcor' value='#c4253a' style='max-width:48px'><input type='range' id='dsz' min='1' max='30' value='6'><button id='der'>Borracha</button></div><div class='row' style='margin-top:6px'><button id='dun'>Desfazer</button><button id='dcl'>Limpar</button><button id='dbs'>Boneco base</button></div><div class='row' style='margin-top:8px'><button id='dx'>Cancelar</button><button id='du' class='pri'>Usar desenho</button></div></div>`;document.body.appendChild(m);
 const cv=$('dc'),c=cv.getContext('2d',{willReadFrequently:true});c.lineCap='round';c.lineJoin='round';let er=false,hist=[],down=false,lx=0,ly=0;
 if(S.ficha.img){const im=new Image();im.onload=()=>{const k=Math.min(300/im.width,420/im.height);c.drawImage(im,(300-im.width*k)/2,(420-im.height*k)/2,im.width*k,im.height*k)};im.src=S.ficha.img}
 const snap=()=>{hist.push(c.getImageData(0,0,300,420));if(hist.length>25)hist.shift()},pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*300/r.width,(e.clientY-r.top)*420/r.height]},pen=()=>{c.globalCompositeOperation=er?'destination-out':'source-over';c.strokeStyle=c.fillStyle=$('dcor').value;c.lineWidth=+$('dsz').value};
 cv.onpointerdown=e=>{e.preventDefault();cv.setPointerCapture(e.pointerId);snap();down=true;[lx,ly]=pos(e);pen();c.beginPath();c.arc(lx,ly,c.lineWidth/2,0,7);c.fill()};
 cv.onpointermove=e=>{if(!down)return;const[x,y]=pos(e);pen();c.beginPath();c.moveTo(lx,ly);c.lineTo(x,y);c.stroke();lx=x;ly=y};
 cv.onpointerup=cv.onpointercancel=()=>{down=false};
 $('der').onclick=()=>{er=!er;$('der').classList.toggle('on',er)};$('dun').onclick=()=>{const s=hist.pop();if(s)c.putImageData(s,0,0)};$('dcl').onclick=()=>{snap();c.clearRect(0,0,300,420)};
 $('dbs').onclick=()=>{snap();const im=new Image();im.onload=()=>{c.globalCompositeOperation='source-over';c.drawImage(im,30,30,240,360)};im.src='data:image/svg+xml;utf8,'+encodeURIComponent(fig('pj',$('dcor').value,3).replace('<svg ',"<svg xmlns='http://www.w3.org/2000/svg' "))};
 $('dx').onclick=()=>m.remove();
 $('du').onclick=()=>{const dt=c.getImageData(0,0,300,420).data;let x0=300,y0=420,x1=-1,y1=-1;for(let y=0;y<420;y++)for(let x=0;x<300;x++)if(dt[(y*300+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}if(x1<0){alert('O desenho está vazio.');return}const w=x1-x0+1,h=y1-y0+1,t=document.createElement('canvas');t.width=w;t.height=h;t.getContext('2d').drawImage(cv,x0,y0,w,h,0,0,w,h);S.ficha.img=t.toDataURL('image/png');m.remove();renderImg();save()}};
/* enviar para a mesa */
$('fenv').onclick=()=>{const f=S.ficha,id=shared&&!GM&&ME?ME:(S.fichaTok||'t'+Date.now());let t=get(id);if(!t){t={id,type:'pj',x:50,y:50,color:COL[Math.floor(Math.random()*COL.length)],note:''};if(shared&&!GM&&ME)t.dono=ME;S.t.push(t)}S.fichaTok=id;Object.assign(t,{name:f.nome||'Agente',nex:f.nex,pv:f.pv,pvMax:f.pvMax,pe:f.pe,peMax:f.peMax,san:f.san,sanMax:f.sanMax,at:{...f.at}});if(f.img)t.img=f.img;else delete t.img;showTab('mesa');select(id)};
document.querySelectorAll('#sheet [data-f]').forEach(e=>{e.value=gp(S.ficha,e.dataset.f)??''});renderImg();renderDD();renderRT();
/* v2: multijogador, cidade, pistas e modelos */
let shared=false,GM=true,ME=null,DB=null,AS=null,live=false,first=true,lpT=0,tm=0,lastScene='';const got={c:0,f:0},lastTok={};
const SC=['map','grid','showGrid','wx','wi','dk','z','dr','roof','items'],IC=['🔍','🩸','📄','🗝️','✉️','📷','💀','🧪','🔦','📞'];
S.items=S.items||[];
const can=t=>!shared||GM||(!!t&&t.dono===ME),mine=t=>GM?!t.dono:t.dono===ME;
const _flip=flip;flip=z=>{if(GM)_flip(z)};
const _lamp=lamp;lamp=function(){_lamp();livePush()};
const _list=list;list=function(){_list();const b=$('meu');if(b)b.textContent=get(ME)?'Selecionar meu personagem':'Criar meu personagem'};
const _all=all;all=function(){_all();items()};
function shrink(f,mh,q,cb){const rd=new FileReader();rd.onload=()=>{const im=new Image(),u=rd.result;im.onload=()=>{const k=Math.min(1,mh/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL(/png|svg/.test(f.type)?'image/png':'image/jpeg',q))};im.onerror=()=>alert('Não consegui abrir essa imagem.');im.src=u};rd.readAsDataURL(f)}
const _ed=editor;editor=function(){_ed();const t=get(S.sel);if(t&&!can(t))$('ed').querySelectorAll('input,select,textarea,button').forEach(x=>x.disabled=true);const ti=$('ti');if(ti)ti.onchange=ev=>{const f=ev.target.files[0],k=get(S.sel);if(f&&k)shrink(f,220,.92,u=>{k.img=u;tokens();save()})}};
/* modelos em pé, sem base */
fig=function(ty,c,h=0){const sk=['#f2d2b3','#dcaa82','#b98258','#7e5237'][h%4],hr=['#241b1f','#4a2f1d','#b58a3c','#1d1d22','#7a2f2f'][(h>>2)%5],O="stroke='#000a' stroke-width='1.6' stroke-linejoin='round' stroke-linecap='round'";
 if(ty==='monstro')return `<svg viewBox='0 0 60 90' ${O}><path d='M13 86L17 64Q6 50 15 34Q23 20 40 24Q55 30 50 52L46 64L51 86L40 86L36 70L26 70L22 86Z' fill='#1b1520'/><path d='M40 24Q52 8 57 17Q50 19 46 31ZM20 30Q9 12 4 21Q11 23 18 35Z' fill='${c}'/><path d='M14 40L1 62L7 67L18 52ZM48 40L59 64L53 69L44 52Z' fill='#1b1520'/><path d='M23 47Q32 56 41 47' fill='none' stroke='${c}'/><circle cx='26' cy='37' r='3' fill='#ffdf6b'/><circle cx='38' cy='37' r='3' fill='#ffdf6b'/></svg>`;
 const long=ty==='npc';
 return `<svg viewBox='0 0 60 90' ${O}><path d='M21 56L19 82L28 82L30 60L32 82L41 82L39 56Z' fill='#2b2a38'/><path d='M16 82h13v5H14ZM31 82h13l2 5H31Z' fill='#16151c'/><path d='M17 31Q30 25 43 31L${long?47:45} ${long?78:60}L${long?13:15} ${long?78:60}Z' fill='${c}'/><path d='M26 28L30 41L34 28Z' fill='#e9e4d8'/><path d='M15 33L8 57L14 59L19 44ZM45 33L52 57L46 59L41 44Z' fill='${c}'/><circle cx='11' cy='59' r='3.3' fill='${sk}'/><circle cx='49' cy='59' r='3.3' fill='${sk}'/><rect x='27' y='23' width='6' height='7' fill='${sk}'/><ellipse cx='30' cy='15' rx='8.5' ry='9.5' fill='${sk}'/>${long?`<path d='M19 13H41L38 5Q30 1 22 5Z' fill='#3a3340'/><path d='M17 13H43' stroke='#3a3340' stroke-width='3'/>`:`<path d='M21 14Q21 3 31 4Q40 4 39 14Q36 8 30 9Q24 9 21 14Z' fill='${hr}'/>`}<circle cx='27' cy='16' r='1' fill='#222' stroke='none'/><circle cx='33' cy='16' r='1' fill='#222' stroke='none'/></svg>`};
tokens=function(){stage.querySelectorAll('.tk').forEach(e=>e.remove());S.t.forEach(t=>{const e=document.createElement('div'),h=[...(t.name||'')].reduce((a,x)=>a+x.charCodeAt(0),0);e.className='tk '+t.type+(S.sel===t.id?' sel':'');e.dataset.id=t.id;e.tabIndex=0;e.style.zIndex=5+Math.round(t.y);e.style.left=t.x+'%';e.style.top=t.y+'%';
 e.innerHTML=`<div class='st'>${t.img?`<img src='${t.img}' alt=''>`:fig(t.type,t.color,h)}</div><div class='n'></div><div class='b'><i style='width:${Math.max(0,Math.min(100,t.pv/(t.pvMax||1)*100))}%'></i></div>`;e.querySelector('.n').textContent=t.name;stage.appendChild(e)})};
/* pistas */
const cd=document.createElement('div');cd.id='card';cd.hidden=true;tb.appendChild(cd);['pointerdown','wheel'].forEach(k=>cd.addEventListener(k,e=>e.stopPropagation()));
function items(){stage.querySelectorAll('.it').forEach(e=>e.remove());S.items.forEach(it=>{if(it.oc&&!GM)return;const e=document.createElement('div');e.className='it'+(it.oc?' oc':'');e.textContent=it.ic;e.title=it.nome;e.style.left=it.x+'%';e.style.top=it.y+'%';
 e.onclick=()=>{if(S.tool==='del'){if(GM){S.items=S.items.filter(q=>q!==it);items();save()}}else if(!S.tool)card(it)};stage.appendChild(e)})}
function card(it){cd.hidden=false;if(GM){cd.innerHTML=`<div class='row'><select id='ci' style='max-width:70px'>${IC.map(i=>`<option>${i}</option>`).join('')}</select><input id='cn' placeholder='Nome da pista'></div><textarea id='cx' rows='5' placeholder='O que os investigadores descobrem…' style='margin-top:6px'></textarea><label style='display:flex;gap:6px;align-items:center;margin:6px 0'><input type='checkbox' id='co' style='width:auto'>Oculta dos jogadores</label><div class='row'><button id='cc'>Fechar</button><button id='cdel'>Apagar</button></div>`;
  $('ci').value=it.ic;$('cn').value=it.nome;$('cx').value=it.desc;$('co').checked=!!it.oc;const up=()=>{it.ic=$('ci').value;it.nome=$('cn').value;it.desc=$('cx').value;it.oc=$('co').checked;items();save()};['ci','cn','cx','co'].forEach(i=>{$(i).oninput=up;$(i).onchange=up});$('cdel').onclick=()=>{S.items=S.items.filter(q=>q!==it);cd.hidden=true;items();save()}}
 else{cd.innerHTML=`<div style='font-size:30px'></div><h2></h2><p style='white-space:pre-wrap;margin:6px 0 10px'></p><button id='cc'>Fechar</button>`;cd.children[0].textContent=it.ic;cd.children[1].textContent=it.nome;cd.children[2].textContent=it.desc||'Nada mais a observar.'}
 $('cc').onclick=()=>{cd.hidden=true}}
stage.addEventListener('pointerdown',e=>{if(S.tool!=='item'||!GM)return;e.preventDefault();e.stopPropagation();const a=px(e),it={id:'i'+Date.now(),x:a.x,y:a.y,ic:'🔍',nome:'Nova pista',desc:'',oc:false};S.items.push(it);items();save();card(it)},true);
const ib=document.createElement('button');ib.dataset.tool='item';ib.textContent='Pista';ib.onclick=()=>{S.tool=S.tool==='item'?null:'item';document.querySelectorAll('[data-tool]').forEach(x=>x.classList.toggle('on',x.dataset.tool===S.tool));$('th').textContent=S.tool==='item'?'Clique no mapa para colocar uma pista.':'Clique numa área escura ou numa porta para abrir.';stage.style.cursor=S.tool?'crosshair':''};document.querySelector('[data-tool=roof]').parentNode.appendChild(ib);
/* cidade */
function cidade(){const B=[['Delegacia',30,30,240,140,'#4b5a73'],['Hotel Aurora',370,30,250,140,'#6b4f5a'],['Banco',720,30,230,140,'#5b6b5a'],['Igreja',30,264,240,126,'#6a6258',1],['Praça',370,264,250,126,'#2f5a34'],['Hospital',720,264,230,126,'#5d7480',1],['Bar do Zé',30,474,240,120,'#6a4a2f'],['Armazém abandonado',370,474,250,120,'#4a4540',1],['Casa velha',720,474,230,120,'#5a4440',1]];
 const r=(x,y,w,h,f)=>`<rect x='${x}' y='${y}' width='${w}' height='${h}' fill='${f}' stroke='#0007' stroke-width='2'/>`;
 let s="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 625'><rect width='1000' height='625' fill='#33363b'/>";
 [[0,0,300,200],[344,0,306,200],[694,0,306,200],[0,244,300,166],[344,244,306,166],[694,244,306,166],[0,454,300,171],[344,454,306,171],[694,454,306,171]].forEach(a=>s+=`<rect x='${a[0]}' y='${a[1]}' width='${a[2]}' height='${a[3]}' fill='#4a4d52'/>`);
 for(let i=0;i<10;i++)s+=`<rect x='${i*100+30}' y='221' width='40' height='3' fill='#d6b36a' opacity='.7'/><rect x='${i*100+30}' y='431' width='40' height='3' fill='#d6b36a' opacity='.7'/>`;
 for(let i=0;i<7;i++)s+=`<rect x='320' y='${i*95+20}' width='3' height='40' fill='#d6b36a' opacity='.7'/><rect x='670' y='${i*95+20}' width='3' height='40' fill='#d6b36a' opacity='.7'/>`;
 B.forEach(b=>s+=`<rect x='${b[1]}' y='${b[2]}' width='${b[3]}' height='${b[4]}' fill='${b[5]}' stroke='#14110f' stroke-width='6'/><text x='${b[1]+b[3]/2}' y='${b[2]+b[4]/2+5}' fill='#f2e6cc' font-size='15' text-anchor='middle' font-family='Georgia,serif'>${b[0]}</text>`);
 s+=[[60,320,30,50],[100,320,30,50],[140,320,30,50],[230,300,30,40]].map(a=>r(a[0],a[1],a[2],a[3],'#5a4636')).join('')+[[390,490,40,40],[440,490,40,40],[560,540,40,40],[400,550,40,40]].map(a=>r(a[0],a[1],a[2],a[3],'#7a6040')).join('')+[[740,300,40,22],[740,340,40,22],[850,300,40,22]].map(a=>r(a[0],a[1],a[2],a[3],'#cfd8dc')).join('')+r(740,490,60,30,'#6e5236')+r(880,540,50,40,'#8d7a8f')+"<circle cx='495' cy='327' r='22' fill='#3b6f9e' stroke='#0007' stroke-width='3'/><circle cx='400' cy='290' r='14' fill='#264a2a'/><circle cx='590' cy='360' r='14' fill='#264a2a'/><circle cx='420' cy='365' r='14' fill='#264a2a'/><circle cx='580' cy='290' r='14' fill='#264a2a'/></svg>";
 S.map='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(s)));
 S.z=B.filter(b=>b[6]).map(b=>({id:'z-'+b[0],x:b[1]/10,y:b[2]/6.25,w:b[3]/10,h:b[4]/6.25,open:false,name:b[0]}));
 S.dr=[[270,327,'v','Igreja'],[720,327,'v','Hospital'],[495,474,'h','Armazém abandonado'],[835,474,'h','Casa velha']].map((d,i)=>({id:'dc'+i,x:d[0]/10,y:d[1]/6.25,o:d[2],z:'z-'+d[3]}));
 S.roof=B.filter(b=>b[0]!=='Praça').map(b=>({x:b[1]/10,y:b[2]/6.25,w:b[3]/10,h:b[4]/6.25}));
 S.items=[[150,360,'🩸','Mancha de sangue','Ainda fresca. O rastro leva até a sacristia.'],[550,520,'📄','Documento rasgado','Lista de nomes com datas. Três deles estão riscados.'],[780,560,'🗝️','Chave enferrujada','Gravada com um símbolo estranho.'],[800,300,'📷','Foto antiga','Um grupo diante da igreja, há trinta anos.'],[150,215,'🔍','Marcas de pneu','Frescas. Alguém saiu apressado da delegacia.']].map((a,i)=>({id:'ic'+i,x:a[0]/10,y:a[1]/6.25,ic:a[2],nome:a[3],desc:a[4],oc:false}));
 S.grid=50;S.view='mestre';syncUI();all()}
function syncUI(){$('gs').value=S.grid;$('wi').value=S.wi;$('wd').value=S.dk;$('dark').style.opacity=S.dk/100;$('gt').classList.toggle('on',S.showGrid);$('gt').textContent=S.showGrid?'Grade ligada':'Grade desligada';wxBtn()}
const cb=document.createElement('button');cb.className='pri';cb.style.width='100%';cb.style.marginTop='8px';cb.textContent='Carregar cidade';cb.onclick=()=>{if(!S.z.length&&!S.items.length||confirm('Carregar a cidade substitui o mapa, as áreas escuras, as portas e as pistas atuais. Continuar?'))cidade()};document.querySelector('.col .box.gm').appendChild(cb);
$('up').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(AS){const r=await AS.upload(f);S.map='url('+r.url+') center/cover no-repeat';all();return}}catch(x){}shrink(f,1400,.6,u=>{S.map=u;all()})};
/* mesa compartilhada */
function sync(){if(!DB||!live)return;clearTimeout(tm);tm=setTimeout(push,350)}
function push(){if(GM){const sc={};SC.forEach(k=>sc[k]=S[k]);const j=JSON.stringify(sc);if(j!==lastScene){lastScene=j;DB.doc('cena/estado').set(sc).catch(()=>{})}}
 const cur={};S.t.forEach(t=>{if(GM||t.dono===ME)cur[t.id]=JSON.stringify(t)});
 for(const id in cur)if(cur[id]!==lastTok[id]){lastTok[id]=cur[id];DB.doc('fichas/'+id).set(JSON.parse(cur[id])).catch(()=>{})}
 for(const id in lastTok)if(!(id in cur)&&(GM||id===ME)){delete lastTok[id];DB.doc('fichas/'+id).delete().catch(()=>{})}}
function livePush(){if(!DB||!live)return;const n=Date.now();if(n-lpT<150)return;lpT=n;const t=get(S.sel);if(t&&can(t)){const j=JSON.stringify(t);if(j!==lastTok[t.id]){lastTok[t.id]=j;DB.doc('fichas/'+t.id).set(JSON.parse(j)).catch(()=>{})}}}
function applyScene(d){SC.forEach(k=>{if(k in d)S[k]=d[k]});S.items=S.items||[];if(!GM)S.view='jogadores';syncUI();all()}
function applyToks(arr){if(stage.querySelector('.tk.drag')){setTimeout(()=>applyToks(arr),250);return}
 const keep=first?(GM&&!arr.some(t=>!t.dono)?S.t.filter(mine):[]):S.t.filter(mine),ids=new Set(keep.map(t=>t.id)),from=arr.filter(t=>(first||!mine(t))&&!ids.has(t.id));
 from.forEach(t=>{lastTok[t.id]=JSON.stringify(t)});S.t=keep.concat(from);if(S.sel&&!get(S.sel))S.sel=null;tokens();list();lamp();if(!$('ed').contains(document.activeElement))editor()}
function ready(){if(got.c&&got.f&&!live){live=true;first=false;sync()}}
function start(){DB.doc('cena/estado').onSnapshot(s=>{if(s.exists&&(!GM||first))applyScene(s.data());got.c=1;ready()},()=>{got.c=1;ready()});
 DB.collection('fichas').onSnapshot(q=>{applyToks(q.docs.map(x=>x.data()));got.f=1;ready()},()=>{got.f=1;ready()});
 setTimeout(()=>{if(!live){live=true;first=false;sync()}},9000)}
$('meu').onclick=()=>{if(!shared||!ME)return;if(!get(ME))S.t.push({id:ME,dono:ME,type:'pj',name:'Meu agente',x:50,y:50,color:COL[Math.floor(Math.random()*COL.length)],nex:5,pv:16,pvMax:16,pe:6,peMax:6,san:20,sanMax:20,at:{AGI:1,FOR:1,INT:1,PRE:1,VIG:1},note:''});select(ME)};
document.querySelector('header h1').insertAdjacentHTML('afterend',"<span id='role' style='color:var(--mt);font-size:12px'>Modo local</span>");
(async()=>{const R=m=>{$('role').textContent='Modo local ('+m+')'};if(!window.claude)return R('sem conexão com o Claude');try{AS=await claude.use('assets')}catch(x){}try{const[u,db]=await Promise.all([claude.use('user'),claude.use('db')]);if(!u||!db)return R(!db?'banco de dados indisponível':'usuário não identificado');DB=db;ME=await u.id();GM=!!((await u.isOwner())||(await u.canEdit()));shared=true;document.body.classList.toggle('pl',!GM);if(!GM){S.view='jogadores';zst()}$('role').textContent=GM?'Mestre · mesa compartilhada':'Jogador';start()}catch(x){R('erro: '+(x&&(x.message||x.code)||x))}})();
all();


