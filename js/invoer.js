/* =========================================================
   ZELF INTYPEN (cijferpaneel) EN LASTIGE ONDERDELEN
   - Rekenvragen met een getal als antwoord ("42", "4,2", "€ 60", "15 km") typt het kind zelf in.
     Een les kan dat uitzetten met keuze:true.
   - Elk antwoord wordt per onderdeel bijgehouden in p.fouten[lesId][onderdeel] = {g, f, r, t}
     g = aantal goed, f = aantal fout, r = laatste 10 keer als '1'/'0', t = tijdstip.
   ========================================================= */
const INVOER_RE = /^(€ )?(\d+(?:,\d+)?)( km| cm| m)?$/;
function invoerVan(q, lid){
  if(q.tik || q.invoer===false) return null;
  const l = L.find(x=>x.id===lid); if(!l || l.vak!=='rekenen' || l.keuze) return null;
  const m = INVOER_RE.exec(String(q.ans)); if(!m) return null;
  return {pre:m[1]||'', kern:m[2], suf:m[3]||''};
}
const getal = s => Number(String(s).trim().replace(',', '.'));
/* Wat het kind typte omzetten naar een antwoord: klopt het getal, dan precies q.ans (zodat de rest gewoon werkt). */
function invoerAntwoord(q, inv, getypt){
  const t = String(getypt||'').replace(/,$/, '');
  if(t!=='' && Number.isFinite(getal(t)) && getal(t)===getal(inv.kern)) return q.ans;
  return inv.pre + (t||'–') + inv.suf;
}
function invoerHtml(q, inv, view, groep){
  const answered = view.picked !== null; const ok = answered && view.picked===q.ans;
  const waarde = answered ? (ok ? inv.kern : (view.typed||'–')) : (view.typed||'');
  const komma = groep >= 6 || inv.kern.includes(',');
  const knop = (k, lab, cls='') => `<button class="pk ${cls}" data-act="pad" data-k="${k}" ${answered?'disabled':''} aria-label="${lab}">${lab}</button>`;
  return `<div class="invoer">
    <div class="display ${answered?(ok?'right':'wrong'):''}" aria-live="polite">${inv.pre?`<span class="fix">${inv.pre}</span>`:''}<span class="val">${esc(waarde)}</span>${answered?'':'<span class="caret"></span>'}${inv.suf?`<span class="fix">${inv.suf}</span>`:''}</div>
    ${answered && !ok ? `<div class="juist">Het goede antwoord is <b>${esc(q.ans)}</b></div>` : ''}
    ${answered ? '' : `<div class="pad">${[1,2,3,4,5,6,7,8,9].map(n=>knop(n,n)).join('')}${komma?knop(',',','):'<span></span>'}${knop(0,0)}${knop('del','⌫','del')}</div>
    <button class="btn sun typok" data-act="typok">Klaar ✓</button>`}
  </div>`;
}
function padDruk(k){
  if(view.picked!==null) return;
  let t = view.typed || '';
  if(k==='del') t = t.slice(0,-1);
  else if(k===',' ){ if(!t.includes(',')) t = (t||'0') + ','; }
  else if(t.replace(',','').length < 7) t = (t==='0' ? '' : t) + k;
  view.typed = t;
  const v = document.querySelector('.invoer .val'); if(v) v.textContent = t; else render();
}
/* ---- lastige onderdelen ----
   Per onderdeel: r = laatste 10 keer: '1' zelf goed, 'h' goed met hint (geholpen), '0' fout.
   L = lastig (blijft staan tot het weer lukt), V = tijdstip waarop het verbeterde. */
const LASTIG = {min:4, fout:2, zelf:.7, beheerst:4};   // lastig na minstens 4 pogingen met 2+ fouten en < 70% zelf goed; weer goed na 4x achter elkaar zelf goed
const telR = r => ({n:r.length, zelf:[...r].filter(c=>c==='1').length, hint:[...r].filter(c=>c==='h').length, fout:[...r].filter(c=>c==='0').length});
function wordtLastig(x){ const t = telR(x.r); return t.n>=LASTIG.min && t.fout>=LASTIG.fout && t.zelf/t.n < LASTIG.zelf; }
function isLastig(x){ return x.L!==undefined ? !!x.L : wordtLastig(x); }
/* status: 'zelf' (zelfstandig goed), 'hint' (goed met hulp) of 'fout'. Geeft true terug als het onderdeel nu weer beheerst wordt. */
function noteer(p, lid, q, status){
  if(!p || !lid) return false;
  if(status===true) status='zelf'; if(status===false) status='fout';
  const sk = q.skill || '_les'; p.fouten = p.fouten || {}; const per = p.fouten[lid] = p.fouten[lid] || {};
  const x = per[sk] = per[sk] || {g:0, f:0, r:''};
  if(status==='fout') x.f++; else x.g++;
  x.r = (x.r + ({zelf:'1', hint:'h', fout:'0'})[status]).slice(-10); x.t = Date.now();
  const was = isLastig(x); let beter = false;
  if(!was && wordtLastig(x)) { x.L = true; x.Ls = Date.now(); }
  else if(was && x.r.slice(-LASTIG.beheerst)==='1'.repeat(LASTIG.beheerst)) { x.L = false; x.V = Date.now(); beter = true; p.beter = (p.beter||[]).concat({lid, sk}); }
  else x.L = was;
  save(); return beter;
}
function skillInfo(p, lid, sk, x){ const l = L.find(y=>y.id===lid); const t = telR(x.r);
  return {lid, sk, naam: sk==='_les' ? (l?l.titel:lid) : sk, les: l?l.titel:lid, vak: l?l.vak:'', ...t, x}; }
/* Lastig, slechtste eerst. */
function lastig(p, max=6){
  const out = [];
  for(const [lid, per] of Object.entries(p.fouten||{})) for(const [sk, x] of Object.entries(per)) if(isLastig(x)) out.push(skillInfo(p, lid, sk, x));
  return out.sort((a,b)=>a.zelf/a.n - b.zelf/b.n || b.n - a.n).slice(0, max);
}
function verbeterd(p, dagen=14){
  const out = [], grens = Date.now() - dagen*864e5;
  for(const [lid, per] of Object.entries(p.fouten||{})) for(const [sk, x] of Object.entries(per)) if(!isLastig(x) && x.V && x.V > grens) out.push(skillInfo(p, lid, sk, x));
  return out.sort((a,b)=>b.x.V - a.x.V);
}
function lastigHtml(p){
  const ls = lastig(p), vb = verbeterd(p);
  const regel = x => `${x.n} keer: ${x.zelf} zelf goed${x.hint?`, ${x.hint} met hint`:''}, ${x.fout} fout`;
  return `<div class="label">Lastige onderdelen</div>${ls.length
    ? `<ul class="lastig">${ls.map(x=>`<li><b>${esc(x.naam)}</b> <span class="muted">${x.sk==='_les'?(VAKKEN[x.vak]?.vak||''):esc(x.les)} · laatste ${regel(x)}</span></li>`).join('')}</ul>`
    : '<p class="muted" style="margin:0">Nog niets opvallends. Een onderdeel komt hier na minstens 4 pogingen met 2 of meer fouten.</p>'}
    ${vb.length ? `<div class="label" style="margin-top:6px">Onlangs verbeterd</div><ul class="lastig">${vb.map(x=>`<li><b>${esc(x.naam)}</b> ✓ <span class="muted">${new Date(x.x.V).toLocaleDateString('nl-NL',{day:'numeric',month:'short'})} · laatste ${regel(x)}</span></li>`).join('')}</ul>` : ''}`;
}
document.addEventListener('keydown', e => {
  if(e.target.closest && e.target.closest('input,select,textarea')) return;
  if(!document.querySelector('.invoer .pad') || document.querySelector('.overlay')) return;
  if(/^[0-9]$/.test(e.key)) { padDruk(e.key); e.preventDefault(); }
  else if(e.key===',' || e.key==='.') { if(document.querySelector('.pk[data-k=","]')) padDruk(','); e.preventDefault(); }
  else if(e.key==='Backspace') { padDruk('del'); e.preventDefault(); }
  else if(e.key==='Enter') { document.querySelector('[data-act="typok"]')?.click(); e.preventDefault(); }
});
