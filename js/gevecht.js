/* ---- gevecht ----
   Een gevecht is een toets met een vast aantal vragen (per wereld). Je maakt altijd alle vragen.
   Balk tegenstander = goede antwoorden die je nog nodig hebt. Jouw balk = fouten die je nog mag maken.
   Te kort (1 of 2)? Met een herstel-drankje krijg je 2 reddingsvragen. Sterren tellen alleen de echte toets. */
function battleSpec(kind, ref, w){ return GEVECHT[kind==='wild' ? 'wild' : ref==='champ' ? 'champ' : 'boss'][w]; }
const qKey = (lid, q) => lid+'|'+q.q+'|'+(q.vis||'')+'|'+q.ans;
function buildQs(src, n, groep, exclude){
  const out=[], seen=new Set(exclude||[]), ls=shuffle(src); let t=0;
  while(out.length<n && t<n*60){ const l=ls[t%ls.length]; t++; const q=l.gen(groep); const k=qKey(l.id,q); if(seen.has(k) && t<n*50) continue; seen.add(k); q.lid=l.id; out.push(q); }
  return out;
}
/* Kracht van je monster: 1 = basisvorm, 2 = eerste evolutie, 3 = laatste evolutie of legendarisch */
function powerOf(m){ const mm=MON[m.id], n=mm.spr.length, s=mStage(m); if(mm.tier==='legend') return 3; if(n===1) return 2; if(s===1) return 1; return (s===n && n===3) ? 3 : 2; }
const POWER_BONUS = {1:0, 2:.10, 3:.20};
const ATTACK = {1:'valt aan', 2:'gebruikt een krachtaanval', 3:'gebruikt een SUPERAANVAL'};
function wildFor(p){
  const pool = MONSTERS.filter(m=>m.tier!=='legend' && m.id!==act(p).id); const w = worldOf(p.groep);
  const m = pick(pool); const n = m.spr.length;
  const st = Math.min(n, w===2 ? R(1,2) : R(2,3));
  return {id:m.id, slug:m.spr[st-1], name:m.names[st-1], lvl:Math.max(1, mLvl(act(p)) + R(-1,2))};
}
function startBattle(kind, ref){
  const p = P(); const w = worldOf(p.groep); let enemy, boss=null, src;
  if(kind==='wild'){ enemy = wildFor(p); src = [L.find(x=>x.id===ref)]; }
  else {
    boss = ref==='champ' ? CHAMP : WORLDS[w].boss[ref];
    const ss = slugStage(boss.mon); const mm = MON[ss.id];
    enemy = {id:ss.id, slug:boss.mon, name:mm.names[ss.stage-1], lvl:Math.max(ref==='champ'?18:10+w*2, mLvl(act(p))+(ref==='champ'?5:3))};
    src = ref==='champ' ? champBosses(p,w).flatMap(k=>lessonsFor(k,p.groep).own) : lessonsFor(ref,p.groep).own;
  }
  if(!p.seen.includes(enemy.id)){ p.seen.push(enemy.id); save(); }
  const spec = battleSpec(kind, ref, w);
  go({s:'battle', kind, ref, boss, src, enemy, n:spec.n, need:spec.need, qs:buildQs(src, spec.n, p.groep), i:0,
      phase:'toets', picked:null, correct:0, wrong:0, hints:0, wrongL:[], streak:0, combo:0, cshield:false, cshieldUsed:false,
      hide:[], anim:'', rescue:null, msg:boss?`${boss.naam} stuurt ${enemy.name} het veld in!`:`Een wilde ${enemy.name} verschijnt!`});
}
function segBar(total, left){ return `<div class="seg">${Array.from({length:total},(_,k)=>`<i class="${k<left?'':'off'}"></i>`).join('')}</div>`; }
function curQ(b){ return b.phase==='redding' ? b.rescue.qs[b.rescue.i] : b.qs[b.i]; }
function vBattle(){
  const p = P(); const b = view; const m = act(p); const young = p.groep<=3; const WD = WORLDS[W()]; const pw = powerOf(m);
  const got = b.correct + (b.rescue ? b.rescue.correct : 0);
  const eLeft = Math.max(0, b.need - got), allowed = b.n - b.need, mLeft = Math.max(0, allowed - b.wrong);
  const down = eLeft===0;
  const q = (b.phase==='toets'||b.phase==='redding') ? curQ(b) : null;
  const answered = b.picked!==null; const ok = q && answered && b.picked===q.ans;
  if(q && answered && b.fb==null) b.fb = ok ? pick(WD.ok) : WD.no;
  const itemBtn = id => { const n = p.items[id]||0; let dis = n<1 || answered || b.phase!=='toets';
      if(id==='shield') dis = dis || b.cshield || b.cshieldUsed; if(id==='hint') dis = dis || b.hide.length || q.opts.length<3 || q.tik;
      const label = id==='shield' ? (b.cshield?'Combo-schild aan':'Combo-schild') : 'Hint';
      return `<button class="bitem ${id==='shield'&&b.cshield?'on':''}" data-act="use" data-id="${id}" ${dis?'disabled':''} title="${ITEM[id].uit}">${itImg(ITEM[id].icon)}${label} ×${n}</button>`; };
  let panel = '';
  if(b.phase==='keuze'){ const short = b.need - b.correct;
    panel = `<div style="display:grid;gap:12px;justify-items:center;text-align:center">${itImg('heal').replace('<img','<img style="width:56px"')}
      <b style="font-family:var(--f-display);font-size:22px">Bijna! ${b.correct} van ${b.n} goed.</b>
      <p style="margin:0">Je komt ${short} goed antwoord${short===1?'':'en'} tekort. Met een herstel-drankje krijg je 2 reddingsvragen${short===1?': één goed is genoeg.':': ze moeten allebei goed.'}</p>
      <div class="row" style="justify-content:center"><button class="btn sun" data-act="rescue">Herstel-drankje gebruiken (×${p.items.heal||0})</button><button class="btn ghost" data-act="bend">Nee, stoppen</button></div></div>`;
  } else if(b.phase==='klaar'){
    panel = `<div style="text-align:center;display:grid;gap:10px;justify-items:center">${b.lastFb||''}<button class="btn sun" data-act="bend">Verder</button></div>`;
  } else {
    const isLast = b.phase==='toets' ? b.i===b.n-1 : false;
    panel = `<div class="row" style="justify-content:space-between;margin-bottom:6px"><span class="phase ${b.phase==='redding'?'toets':''}">${b.phase==='redding'?`Reddingsvraag ${b.rescue.i+1} van 2`:`Vraag ${b.i+1} van ${b.n}`}</span>${b.streak>=2?`<span class="phase toets">Combo ×${b.streak}</span>`:''}</div>
      ${qBlock(q, b.picked, young, b.hide, q.lid)}
      ${answered?`<div class="fb ${ok?'ok':'no'}"><b>${b.fb}</b>${q.uitleg}<div style="margin-top:12px"><button class="btn ${ok?'':'sun'}" data-act="bnext">${isLast?'Uitslag bekijken':'Volgende vraag'}</button></div></div>`
        : (b.phase==='toets' ? `<div class="bitems">${['hint','shield'].map(itemBtn).join('')}</div>` : '')}`;
  }
  return bar()+`<div class="wrap"><div class="qcard">
    <div class="arena">
      <div class="plat foe-p"></div><div class="plat me-p"></div>
      ${b.boss?trImg(b.boss.tr,'boss-tr'):''}
      <div class="foe ${down?'down':''} ${b.anim==='hitfoe'?'hit':b.anim==='foeatk'?'lunge-foe':''}">${sprite(b.enemy.slug,'f')}</div>
      ${b.anim==='hitfoe'?`<div class="burst p${pw}"></div>`:''}
      <div class="me-mon ${b.anim==='hitme'?'hit':b.anim==='meatk'?'lunge-me':''}">${monImg(m,'b')}</div>
      <div class="hpbox f"><b>${b.enemy.name}</b><small>Lv ${b.enemy.lvl}${b.boss?' · '+b.boss.naam:''} · nog ${eLeft} goed nodig</small>${segBar(b.need, eLeft)}</div>
      <div class="hpbox m"><b>${mName(m)}</b><small>Lv ${mLvl(m)} · fouten over: ${mLeft}</small>${segBar(Math.max(1,allowed), mLeft)}</div>
    </div>
    <div class="bmsg">${b.msg}</div>
    <div class="panel">${panel}</div>
  </div></div>`;
}
function battleAnswer(o){
  const p = P(); const b = view; if(b.picked!==null || !(b.phase==='toets'||b.phase==='redding')) return; const m = act(p);
  const q = curQ(b); const ok = o===q.ans; b.picked = o; b.fb = null;
  noteer(p, q.lid, q, ok && !b.hide.length);
  if(b.phase==='redding'){
    b.rescue.asked++;
    if(ok){ b.rescue.correct++; b.anim='hitfoe'; b.msg=`${mName(m)} ${ATTACK[powerOf(m)]}! Raak!`; }
    else { b.anim='foeatk'; b.msg=`${b.enemy.name} ontwijkt!`; }
  } else if(ok){
    b.correct++; if(b.hide.length) b.hints++; b.streak++; b.anim='hitfoe';
    if(b.streak>=3) b.combo += 2;
    const done = b.correct===b.need;
    b.msg = done ? `${mName(m)} ${ATTACK[powerOf(m)]}! ${b.enemy.name} is uitgeschakeld. Maak de toets af voor je sterren!`
      : `${mName(m)} ${ATTACK[powerOf(m)]}!${b.streak>=3?` Combo ×${b.streak}: +2 munten!`:' Raak!'}`;
  } else {
    b.wrong++; b.wrongL.push(q.lid); b.anim='hitme';
    const allowed = b.n - b.need;
    if(b.cshield && b.streak>=1){ b.cshield=false; b.cshieldUsed=true; b.msg=`${b.enemy.name} slaat terug! Je combo-schild houdt je reeks heel.`; }
    else { b.streak = 0; b.msg = b.wrong>allowed ? `${b.enemy.name} slaat terug! Je hebt nu een herstel-drankje nodig om nog te winnen.` : b.wrong===allowed ? `${b.enemy.name} slaat terug! Nu geen fouten meer maken.` : `${b.enemy.name} slaat terug!`; }
  }
  if(q.sayAns && ok) speak(q.sayAns,'en-GB');
  render();
}
function battleNext(){
  const p = P(); const b = view; const q = curQ(b);
  b.lastFb = `<div class="fb ${b.picked===q.ans?'ok':'no'}" style="text-align:left;width:100%"><b>${b.fb||''}</b>${q.uitleg}</div>`;
  b.picked=null; b.fb=null; b.hide=[]; b.anim=''; b.typed='';
  if(b.phase==='toets'){
    if(b.i < b.n-1){ b.i++; b.msg = `Wat doe je, ${esc(p.name)}?`; }
    else {
      const short = b.need - b.correct;
      if(short<=0){ b.phase='klaar'; b.lastFb=''; b.msg=`${b.enemy.name} is verslagen!`; }
      else if(short<=2 && (p.items.heal||0)>0){ b.phase='keuze'; b.msg=`${b.enemy.name} staat nog net overeind…`; }
      else { b.phase='klaar'; b.lastFb=''; b.msg = short<=2 ? `Bijna! Met een herstel-drankje had je nog 2 reddingsvragen gekregen.` : `${b.enemy.name} was deze keer te sterk.`; }
    }
  } else if(b.phase==='redding'){
    const r = b.rescue; const short = b.need - b.correct;
    if(r.correct >= short){ b.phase='klaar'; b.lastFb=''; b.msg=`Gered! ${b.enemy.name} is verslagen!`; }
    else if(r.i>=1 || short - r.correct > 1 - r.i){ b.phase='klaar'; b.lastFb=''; b.msg=`Helaas, het redden is niet gelukt.`; }
    else { r.i++; b.msg='Nog één kans!'; }
  }
  render(); window.scrollTo(0,0);
}
function startRescue(){
  const p = P(); const b = view; if(b.phase!=='keuze' || !(p.items.heal>0)) return;
  p.items.heal--; save();
  const ids = [...new Set(b.wrongL)]; const src = ids.map(id=>L.find(x=>x.id===id)).filter(Boolean);
  b.rescue = {qs:buildQs(src.length?src:b.src, 2, p.groep, b.qs.map(q=>qKey(q.lid,q))), i:0, correct:0, asked:0}; b.phase='redding'; b.picked=null; b.fb=null;
  b.msg = `Herstel-drankje! ${mName(act(p))} krabbelt overeind voor twee reddingsvragen.`; render();
}
function useItem(id){
  const p = P(); const b = view; if(!(p.items[id]>0) || b.phase!=='toets' || b.picked!==null) return; const q = curQ(b);
  if(id==='shield'){ if(b.cshield||b.cshieldUsed) return; b.cshield = true; b.msg='Combo-schild aan! Eén fout verbreekt je reeks niet.'; }
  if(id==='hint'){ if(b.hide.length||q.opts.length<3||q.tik) return; const wrong = q.opts.filter(o=>o!==q.ans); b.hide = shuffle(wrong).slice(0, Math.min(2, q.opts.length-2)); b.msg='De dobbelsteen haalt foute antwoorden weg.'; }
  p.items[id]--; b.anim=''; save(); render();
}
function battleEnd(){
  const p = P(); const b = view; const m = act(p); const w = worldOf(p.groep);
  const passed = b.correct >= b.need; const rescued = !passed && b.rescue && b.rescue.correct >= (b.need - b.correct); const win = passed || rescued;
  const tBefore = levelInfo(p.txp).lvl, mBefore = mLvl(m), sBefore = mStage(m);
  const pct = b.correct / b.n; const stars = pct>=.9 ? 3 : pct>=.8 ? 2 : passed ? 1 : 0;
  let coins, xp, reward=null; const notes=[];
  if(b.kind==='wild'){
    const prev = p.lessons[b.ref] || {best:0,times:0};
    coins = win ? 10 + b.correct*2 + (stars===3?5:0) : 2 + b.correct;
    if(win && prev.best===3){ coins = Math.ceil(coins/2); notes.push('Je had al 3 sterren op deze les, dus de helft van de munten. Probeer ook eens een andere les!'); }
    xp = win ? 30 + b.correct*6 + (stars>prev.best?10:0) : 8 + b.correct*2;
    p.lessons[b.ref] = {best:Math.max(prev.best,stars), times:prev.times+1};
  } else {
    const key = b.ref==='champ' ? 'champ-'+w : bossKey(w,b.ref); const first = win && !p.badges[key];
    coins = win ? (first?100:30) : 5 + b.correct; xp = win ? 120 : 20 + b.correct*2;
    if(first){ p.badges[key]=true; const leg = BOSS_LEG[b.ref]; if(!owns(p,leg)){ addMon(p,leg); reward=leg; } }
  }
  const pw = powerOf(m); const bonus = Math.round(coins * POWER_BONUS[pw]);
  if(bonus){ coins += bonus; notes.push(`${mName(m)} is ${pw===3?'volledig geëvolueerd':'geëvolueerd'}: +${Math.round(POWER_BONUS[pw]*100)}% munten (+${bonus}).`); }
  if(b.combo){ coins += b.combo; notes.push(`Combo-bonus: +${b.combo} munten.`); }
  if(win && p.luck){ coins*=2; p.luck=0; notes.push('Geluksbamboe: dubbele munten!'); }
  if(happyGebruik(p)){ coins*=2; const o=happyOver(p); notes.push(`Happy hour: dubbele munten! ${o?`Nog ${o} gevecht${o===1?'':'en'} met dubbele munten.`:'Dat was je laatste happy-hour-gevecht.'}`); }
  p.coins += coins; p.txp += xp; m.xp += xp;
  p.log.unshift({d:Date.now(), l:b.kind==='wild'?b.ref:'boss:'+b.ref, s:b.correct, t:b.n, h:b.hints, r:b.rescue?(rescued?'ok':'mis'):'', rc:b.rescue?b.rescue.correct:0, rn:b.rescue?b.rescue.asked:0, cs:b.cshieldUsed?1:0, win}); p.log = p.log.slice(0,40);
  save();
  go({s:'result', kind:b.kind, ref:b.ref, win, passed, rescued, stars, coins, xp, notes, reward, correct:b.correct, n:b.n, need:b.need, hints:b.hints, boss:b.boss, enemy:b.enemy});
  afterGain(m, tBefore, mBefore, sBefore);
}
function afterGain(m, tBefore, mBefore, sBefore){
  const p = P(); const queue = [];
  if(mStage(m) > sBefore) queue.push(()=>evolve(m, sBefore, mStage(m)));
  else if(mLvl(m) > mBefore) queue.push(()=>levelUpMon(m));
  if(levelInfo(p.txp).lvl > tBefore) queue.push(()=>levelUpTrainer(levelInfo(p.txp).lvl));
  runQueue(queue);
}
let Q = [];
function runQueue(q){ Q = q; nextQ(); }
function nextQ(){ const f = Q.shift(); if(f) f(); }
function vResult(){
  const p = P(); const r = view; const WD = WORLDS[W()];
  const isWild = r.kind==='wild'; const l = isWild ? L.find(x=>x.id===r.ref) : null;
  const line = `${r.correct} van ${r.n} goed${r.hints?` (${r.hints} met hint)`:''}${r.rescued?' – gevecht gewonnen met een herstel-drankje':''}`;
  return bar()+`<div class="wrap"><div class="panel qcard result">
    <div class="label">${r.win?'Gewonnen':'Verloren'}</div>
    ${r.win ? `<h1 style="font-size:36px">${r.boss?`${r.boss.naam} is verslagen!`:`${r.enemy.name} is verslagen!`}</h1>` : `<h1 style="font-size:34px">Net niet gelukt</h1>`}
    ${isWild?`<div class="big">${starsHtml(r.stars)}</div>`:''}
    <p style="font-size:18px;margin:0">${line}. ${r.passed ? (r.stars===3?'Bijna alles goed, top!':'Goed gevochten!') : r.rescued ? 'Knap gered! Voor sterren moet je de toets zelf halen.' : `Je had er ${r.need} nodig. Lees de uitleg nog eens rustig en probeer het opnieuw.`}</p>
    <div class="gain"><span>🪙 +${r.coins} munten</span><span>⭐ +${r.xp} XP</span></div>
    ${r.notes.length?`<p class="muted" style="margin:0">${r.notes.join(' ')}</p>`:''}
    ${r.reward?`<div class="panel" style="display:grid;justify-items:center;gap:6px;border-color:var(--sun)"><div class="label">Badge gewonnen + legendarisch monster!</div><div style="width:140px">${sprite(MON[r.reward].spr[0])}</div><b style="font-family:var(--f-display);font-size:24px">${MON[r.reward].names[0]}</b><span class="muted">${MON[r.reward].el} · zit nu in je team</span></div>`:''}
    <div class="row" style="justify-content:center;margin-top:8px">
      ${isWild?`<button class="btn ghost" data-act="les" data-id="${r.ref}">Nog een keer</button><button class="btn" data-act="isle" data-v="${l.vak}">Volgende les</button>`:`<button class="btn" data-act="map">Naar de kaart</button>`}
      <button class="btn sun" data-act="shop">${WD.markt}</button></div>
  </div></div>`;
}
function vBossIntro(){
  const p = P(); const w = W(); const B = view.ref==='champ' ? CHAMP : WORLDS[w].boss[view.ref]; const ss = slugStage(B.mon); const sp = battleSpec('boss', view.ref, w);
  return bar()+`<div class="wrap"><button class="back" data-act="map">← Kaart</button><div class="panel intro qcard">${trImg(B.tr,'big-tr')}<div>
    <div class="label">${view.ref==='champ'?'Kampioen':'Eilandmeester'}</div><h1 style="font-size:34px;margin:4px 0 8px">${B.naam}</h1>
    <p style="margin:0 0 6px">"Dus jij bent ${esc(p.name)}. Laten we eens zien wat je hebt geleerd!"</p>
    <p class="muted" style="margin:0 0 12px">Hij vecht met <b>${MON[ss.id].names[ss.stage-1]}</b>. Je krijgt ${sp.n} vragen uit alle lessen ${view.ref==='champ'?'van je wereld':'van dit eiland'}, en hebt er ${sp.need} goed nodig.</p>
    <div class="row"><div style="width:90px">${sprite(B.mon)}</div><button class="btn sun" data-act="bossgo">Gevecht beginnen! ⚔️</button></div></div></div></div>`;
}
function confetti(){
  const cols=['#ffc531','#ff6f59','#7457ee','#4bb05b','#2de2e6','#ff3d81'];
  for(let k=0;k<60;k++){ const c=document.createElement('i'); c.className='conf'; c.style.left=Math.random()*100+'vw'; c.style.background=pick(cols); c.style.animationDuration=(1.6+Math.random()*1.8)+'s'; c.style.animationDelay=(Math.random()*.6)+'s'; document.body.appendChild(c); setTimeout(()=>c.remove(),4200); }
}
function overlay(html){
  const o = document.createElement('div'); o.className='overlay'; o.innerHTML = html; document.body.appendChild(o);
  const btn = o.querySelector('#lvok'); btn.onclick = () => { o.remove(); render(); nextQ(); }; btn.focus();
}
function levelUpMon(m){
  overlay(`<div class="lvbox" role="dialog" aria-label="Level up"><div class="label">${mName(m)} wordt sterker!</div><div class="lvbig">LEVEL ${mLvl(m)}</div><div style="width:160px">${monImg(m)}</div>
    ${evoLevels(m.id)[mStage(m)-1]?`<p class="muted" style="margin:0">Nog ${evoLevels(m.id)[mStage(m)-1]-mLvl(m)} level(s) tot de volgende evolutie.</p>`:''}<button class="btn sun" id="lvok">Joepie!</button></div>`);
  confetti();
}
function levelUpTrainer(lvl){
  const p = P(); const nieuw = MONSTERS.filter(x=>x.req===lvl && x.tier!=='legend' || (SHOP_LEG.includes(x.id) && x.req===lvl));
  overlay(`<div class="lvbox" role="dialog" aria-label="Trainer level up"><div class="label">Je bent slimmer geworden!</div><div class="lvbig">TRAINER LEVEL ${lvl}</div><div style="width:120px">${trImg(p.tr)}</div>
    ${nieuw.length?`<p style="margin:0">Nieuw in de ${WORLDS[W()].markt}: <b>${nieuw.map(x=>x.names[0]).join(', ')}</b></p>`:''}<button class="btn sun" id="lvok">Top!</button></div>`);
  confetti();
}
function evolve(m, s0, s1){
  const c = MON[m.id];
  overlay(`<div class="lvbox" role="dialog" aria-label="Evolutie"><div class="label">Wat gebeurt er met ${c.names[s0-1]}?!</div>
    <div class="evo">${sprite(c.spr[s0-1],'f','a1')}${sprite(c.spr[s1-1],'f','a2')}</div>
    <div class="evotxt"><div class="lvbig" style="font-size:32px">${c.names[s0-1]} evolueert tot ${c.names[s1-1]}!</div>
    <p style="margin:0">Level ${mLvl(m)}. Jij bent slimmer geworden, dus je monster is sterker geworden.</p>
    <button class="btn sun" id="lvok">Wauw!</button></div></div>`);
  setTimeout(confetti, 2600);
}

