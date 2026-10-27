/* =========================================================
   GERICHT HERHALEN (eerst rekenen)
   1. Na een paar gevechten verschijnt op de kaart een korte trainingsronde
      met maximaal twee lastige onderdelen (zie lastig() in js/invoer.js).
   2. Na die training komen die onderdelen ook gemengd terug in gewone rekengevechten.
   3. Lukt een lastig onderdeel weer (4x achter elkaar zelf goed), dan krijgt het kind
      een beperkte bonus: per onderdeel hooguit eens per week, en hooguit 2 per dag.
   ========================================================= */
const HERHAAL = {naGevechten:3, vragen:6, maxOnderdelen:2, mengInGevecht:2, munt:2, bonus:10, bonusPerDag:2, bonusDagen:7};
function herhState(p){ p.herh = p.herh || {n:0, bonus:{}, dag:'', vandaag:0}; return p.herh; }
/* Lastige rekenonderdelen die we met een recept opnieuw kunnen maken. getraind=true: alleen al getrainde. */
function trainbaar(p, getraind){
  return lastig(p, 20).filter(x => { const l = L.find(y=>y.id===x.lid);
    return l && l.gen && l.vak==='rekenen' && x.sk!=='_les' && (!getraind || x.x.T); }).slice(0, HERHAAL.maxOnderdelen);
}
function trainingKlaar(p){ return herhState(p).n >= HERHAAL.naGevechten && trainbaar(p).length > 0; }
function genVoorOnderdeel(lid, sk, groep, n, seen){
  const l = L.find(y=>y.id===lid); const out = [];
  for(let t=0; t<500 && out.length<n; t++){ const q = l.gen(groep); if(q.skill!==sk) continue;
    const k = qKey(lid,q); if(seen.has(k) && t<400) continue; seen.add(k); q.lid = lid; q.herh = true; out.push(q); }
  return out;
}
function startTraining(){
  const p = P(); const sk = trainbaar(p); if(!sk.length) return go({s:'map'});
  const per = Math.ceil(HERHAAL.vragen / sk.length), seen = new Set();
  const lijsten = sk.map(x => genVoorOnderdeel(x.lid, x.sk, p.groep, per, seen));
  const oef = []; for(let i=0; i<per; i++) for(const lst of lijsten) if(lst[i] && oef.length<HERHAAL.vragen) oef.push(lst[i]);
  go({s:'training', phase:'oef', oef, i:0, picked:null, typed:'', res:[],
      skills: sk.map(x => ({lid:x.lid, sk:x.sk, naam:x.naam, voor:{zelf:x.zelf, n:x.n}}))});
}
function finishTraining(){
  const p = P(); const v = view; const st = herhState(p);
  const goed = v.res.filter(Boolean).length; let coins = goed * HERHAAL.munt; const notes = [];
  for(const s of v.skills){ const x = p.fouten?.[s.lid]?.[s.sk]; if(x) x.T = Date.now(); }
  const gb = geefBonussen(p); coins += gb.coins; notes.push(...gb.notes);
  st.n = 0; p.coins += coins; save();
  v.phase = 'klaar'; v.coins = coins; v.notes = notes; v.goed = goed; render(); window.scrollTo(0,0);
  if(goed >= v.oef.length - 1) confetti();
}
/* Beloning voor verbetering, beperkt zodat expres fout antwoorden niets oplevert. */
function geefBonussen(p){
  const st = herhState(p); const dag = vandaag(); if(st.dag!==dag){ st.dag = dag; st.vandaag = 0; }
  let coins = 0; const notes = [];
  for(const b of (p.beter||[])){
    const key = b.lid+'|'+b.sk; const naam = b.sk==='_les' ? (L.find(l=>l.id===b.lid)?.titel || b.lid) : b.sk;
    if(Date.now() - (st.bonus[key]||0) > HERHAAL.bonusDagen*864e5 && st.vandaag < HERHAAL.bonusPerDag){
      coins += HERHAAL.bonus; st.vandaag++; st.bonus[key] = Date.now(); notes.push(`🎯 Je hebt "${naam}" weer onder de knie! +${HERHAAL.bonus} munten.`);
    } else notes.push(`🎯 Je hebt "${naam}" weer onder de knie!`);
  }
  p.beter = []; return {coins, notes};
}
/* In een rekengevecht: hooguit 2 vragen over al getrainde lastige onderdelen, verspreid tussen de gewone vragen. */
function mengHerhaling(p, src, qs){
  if(!src.some(l=>l.vak==='rekenen')) return qs;
  const sk = trainbaar(p, true).slice(0, HERHAAL.mengInGevecht); if(!sk.length || qs.length<4) return qs;
  const seen = new Set(qs.map(q=>qKey(q.lid,q))); const plekken = shuffle(qs.map((_,i)=>i).slice(1)).slice(0, sk.length);
  sk.forEach((x,i) => { const q = genVoorOnderdeel(x.lid, x.sk, p.groep, 1, seen)[0]; if(q) qs[plekken[i]] = q; });
  return qs;
}
function herhBanner(p){
  if(!trainingKlaar(p)) return '';
  const sk = trainbaar(p);
  return `<div class="evbanner herh"><b>🎯 Trainingsronde</b><span>Oefen ${sk.map(x=>`<b>${esc(x.naam)}</b>`).join(' en ')}. ${HERHAAL.vragen} vragen.</span><button class="btn" data-act="training">Start training</button></div>`;
}
function vTraining(){
  const p = P(); const v = view; const young = p.groep<=3; const WD = WORLDS[W()];
  const kop = `<button class="back" data-act="map">← Kaart</button>`;
  if(v.phase==='klaar'){
    const per = v.skills.map(s => { const idx = v.oef.map((q,i)=>q.skill===s.sk && q.lid===s.lid ? i : -1).filter(i=>i>=0);
      const g = idx.filter(i=>v.res[i]).length; return {s, g, n:idx.length}; });
    return bar()+`<div class="wrap">${kop}<div class="panel qcard result">
      <div class="label">Trainingsronde</div><h1 style="font-size:34px">${v.goed===v.oef.length?'Alles goed!':v.goed>=v.oef.length/2?'Goed bezig!':'Je hebt geoefend!'}</h1>
      <div class="trres">${per.map(({s,g,n})=>`<div><b>${esc(s.naam)}</b><span class="muted">eerst ${s.voor.zelf} van ${s.voor.n} goed · nu ${g} van ${n} · ${n && g/n > s.voor.zelf/s.voor.n ? 'beter dan eerst! 💪' : 'die komt nog vaker terug'}</span><div class="mbar"><i style="width:${n?Math.round(g/n*100):0}%"></i></div></div>`).join('')}</div>
      ${v.notes.map(n=>`<p class="tip" style="margin:0">${n}</p>`).join('')}
      <div class="gain"><span>🪙 +${v.coins} munten</span></div>
      <p class="muted" style="margin:0;max-width:52ch">Deze onderdelen komen de komende tijd ook af en toe terug in je gevechten. Zo word je er steeds beter in.</p>
      <button class="btn sun" data-act="map">Naar de kaart</button></div></div>`;
  }
  const q = v.oef[v.i]; const answered = v.picked!==null; const ok = answered && v.picked===q.ans;
  if(answered && v.fb==null) v.fb = ok ? pick(WD.ok) : WD.no;
  return bar()+`<div class="wrap">${kop}
    <div class="panel qcard"><div class="prog">${v.oef.map((_,k)=>`<i class="${k<v.i?(v.res[k]?'done':'miss'):k===v.i?'now':''}"></i>`).join('')}</div>
      <span class="phase toets">🎯 Trainingsronde ${v.i+1} van ${v.oef.length}</span> <span class="muted" style="font-size:14px">${esc(q.skill||'')}</span>
      ${qBlock(q, v.picked, young, null, q.lid)}
      ${answered?`<div class="fb ${ok?'ok':'no'}"><b>${v.fb}</b>${q.uitleg}<div style="margin-top:12px"><button class="btn ${ok?'':'sun'}" data-act="next">${v.i+1<v.oef.length?'Volgende':'Klaar!'}</button></div></div>`:''}
    </div></div>`;
}
