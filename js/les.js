/* =========================================================
   EILAND EN LES: lessenlijst, uitleg, oefenen
   
   ========================================================= */
function lessonsFor(vak, groep){
  const std = L.filter(l=>!l.custom);
  const own = std.filter(l=>l.vak===vak && groep>=l.g[0] && groep<=l.g[1]);
  const extra = std.filter(l=>l.vak===vak && l.g[0]===groep+1);
  const herh = std.filter(l=>l.vak===vak && l.g[1]===groep-1);
  const eigen = L.filter(l=>l.custom && l.vak===vak && groep>=l.g[0] && groep<=l.g[1]);
  return {own, extra, herh, eigen};
}
function starsHtml(n){ return `<span class="stars" aria-label="${n} van 3 sterren">${'★'.repeat(n)}<span class="off">${'★'.repeat(3-n)}</span></span>`; }
function vIsle(){
  const p = P(); const w = W(); const v = isle(view.v, w);
  if(!v || (v.vanaf && p.groep < v.vanaf)) return bar()+`<div class="wrap"><button class="back" data-act="map">← Kaart</button><div class="panel"><h1 style="font-size:32px">${v?v.naam:'Gesloten'}</h1><p>Deze plek gaat open vanaf groep ${v?v.vanaf:''}. Je komt er vanzelf!</p></div></div>`;
  const {own, extra, herh, eigen} = lessonsFor(view.v, p.groep);
  const row = (l,i,tag) => `<button class="lesson" data-act="les" data-id="${l.id}"><span class="n">${i+1}</span><span class="t"><b>${l.titel}${tag?`<span class="badge">${tag}</span>`:l.nieuw?'<span class="badge">nieuw</span>':''}</b><span class="muted">Groep ${l.g[0]===l.g[1]?l.g[0]:l.g[0]+'–'+l.g[1]}</span></span>${starsHtml(p.lessons[l.id]?.best||0)}</button>`;
  let i = 0;
  const B = WORLDS[w].boss[view.v]; const done = own.filter(l=>(p.lessons[l.id]?.best||0)>=1).length; const open = own.length && done===own.length; const won = p.badges[bossKey(w,view.v)];
  return bar()+`<div class="wrap"><button class="back" data-act="map">← Kaart</button>
    <h1 style="font-size:36px">${v.ico} ${v.naam}</h1><p class="muted" style="margin-top:4px">${v.vak} voor groep ${p.groep}. Elke les: uitleg, oefenen en dan een gevecht tegen een wild monster.</p>
    <div class="lessons">${own.map(l=>row(l,i++,'')).join('') || '<p>Nog geen lessen voor jouw groep hier.</p>'}
    ${eigen.map(l=>row(l,i++,'eigen les')).join('')}${herh.map(l=>row(l,i++,'herhalen')).join('')}${extra.map(l=>row(l,i++,'uitdaging')).join('')}</div>
    ${!B?'<p class="tip" style="margin-top:16px">Ontdekles: je verdient sterren, XP en munten met gewone lesgevechten. Voor dit vak is er nog geen eilandmeester; het telt niet mee voor het openen van de Kampioen.</p>':''}
    ${B?`<div class="boss-card ${open?'':'locked'} ${won?'won':''}">${trImg(B.tr)}<div style="flex:1;min-width:0"><div class="label">Eilandmeester</div><b style="font-family:var(--f-display);font-size:22px">${B.naam}</b>
      <div class="muted" style="font-size:14px">${won?'Verslagen! Je hebt de badge. Revanche geeft extra munten.':open?`Beloning: een badge en het legendarische monster <b>${MON[BOSS_LEG[view.v]].names[0]}</b>!`:`Haal minstens 1 ster op alle lessen van je groep (${done}/${own.length}).`}</div></div>
      ${open?`<button class="btn ${won?'ghost':'sun'}" data-act="boss" data-v="${view.v}">${won?'Revanche':'Uitdagen!'}</button>`:''}</div>`:''}
  </div>`;
}

/* ---- les: uitleg en oefenen ---- */
function genQs(l, n, groep){ const out=[], seen=new Set(); let t=0; while(out.length<n && t<80){ t++; const q=l.gen(groep); const k=q.q+q.vis+q.ans; if(seen.has(k)&&t<50) continue; seen.add(k); out.push(q);} return out; }
function readSeconds(l, p){
  if((p.lessons[l.id]?.best||0) >= 1) return 0;            // al eens gehaald: niet opnieuw wachten
  const tmp = document.createElement('div'); tmp.innerHTML = l.uitleg + ' ' + l.vb;
  const words = tmp.textContent.trim().split(/\s+/).length;
  return Math.min(30, Math.max(6, Math.round(words / (p.groep<=3 ? 1.5 : 2.5))));
}
function startLesson(id){ const l=L.find(x=>x.id===id); const p=P(); go({s:'les', id, phase:'uitleg', readUntil:Date.now()+readSeconds(l,p)*1000, oef:genQs(l,OEFEN_VRAGEN,p.groep), i:0, picked:null}); }
function tickRead(){
  const b = document.getElementById('startoef'); if(!b || view.s!=='les' || view.phase!=='uitleg') return;
  const left = Math.ceil(((view.readUntil||0) - Date.now())/1000);
  if(left > 0){ b.disabled = true; b.textContent = `Lees eerst de uitleg… ${left}`; }
  else if(b.disabled){ b.disabled = false; b.textContent = 'Ik snap het, oefenen!'; }
}
setInterval(tickRead, 500);
function qBlock(q, picked, young, hide, lid){
  const answered = picked !== null; const inv = invoerVan(q, lid);
  return `<div class="row" style="justify-content:space-between"><div class="q">${q.q}</div>${(young||q.say)?`<button class="speak" data-act="sayq">🔊</button>`:''}</div>
    ${q.vis?`<div class="vis">${q.vis}</div>`:''}
    ${inv && !(hide||[]).length ? invoerHtml(q, inv, view, P().groep) : q.tik ? `<div style="max-width:360px">${topoMap(answered?{res:{ans:q.ans,picked}}:{click:true})}</div>` : `<div class="opts">${q.opts.filter(o=>!(hide||[]).includes(o)).map(o=>{ let c=''; if(answered){ if(o===q.ans) c='right'; else if(o===picked) c='wrong'; } return `<button class="opt ${q.big?'big':''} ${c}" data-act="ans" data-o="${esc(o)}" ${answered?'disabled':''}>${esc(o)}</button>`; }).join('')}</div>`}`;
}
function vLes(){
  const p = P(); const l = L.find(x=>x.id===view.id); const v = isle(l.vak, W()) || isle(l.vak, 2); const young = p.groep<=3; const WD = WORLDS[W()];
  if(view.phase==='uitleg') return bar()+`<div class="wrap"><button class="back" data-act="isle" data-v="${l.vak}">← ${v.naam}</button>
    <div class="panel qcard"><div class="label">Uitleg</div><h1 style="font-size:34px;margin:4px 0 12px">${l.titel}</h1>
      <div class="uitleg">${l.uitleg}<div class="vb"><b>Voorbeeld:</b> ${l.vb}</div></div>
      <div class="row" style="margin-top:18px"><button class="btn" id="startoef" data-act="startoef" ${(view.readUntil||0)>Date.now()?'disabled':''}>${(view.readUntil||0)>Date.now()?`Lees eerst de uitleg… ${Math.ceil((view.readUntil-Date.now())/1000)}`:'Ik snap het, oefenen!'}</button>${(young||l.nieuw)?`<button class="speak" data-act="sayuitleg">🔊 Voorlezen</button>`:''}</div></div></div>`;
  const q = view.oef[view.i]; const answered = view.picked!==null; const ok = answered && view.picked===q.ans;
  if(answered && view.fb==null) view.fb = ok ? pick(WD.ok) : WD.no;
  return bar()+`<div class="wrap"><button class="back" data-act="isle" data-v="${l.vak}">← ${v.naam}</button>
    <div class="panel qcard"><div class="prog">${view.oef.map((_,k)=>`<i class="${k<view.i?'done':k===view.i?'now':''}"></i>`).join('')}</div>
      <span class="phase">Oefenen ${view.i+1} van ${view.oef.length}</span>
      ${qBlock(q, view.picked, young, null, view.id)}
      ${answered?`<div class="fb ${ok?'ok':'no'}"><b>${view.fb}</b>${q.uitleg}<div style="margin-top:12px"><button class="btn ${ok?'':'sun'}" data-act="next">${view.i+1<view.oef.length?'Volgende':'Naar het gevecht! ⚔️'}</button></div></div>`:''}
    </div></div>`;
}

