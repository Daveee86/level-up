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
/* ---- lastige onderdelen ---- */
function noteer(p, lid, q, ok){
  if(!p || !lid) return;
  const sk = q.skill || '_les'; p.fouten = p.fouten || {}; const per = p.fouten[lid] = p.fouten[lid] || {};
  const x = per[sk] = per[sk] || {g:0, f:0, r:''};
  if(ok) x.g++; else x.f++; x.r = (x.r + (ok?'1':'0')).slice(-10); x.t = Date.now();
}
/* Lastig = minstens 3 keer geoefend en de laatste keren minder dan 70% goed. Slechtste eerst. */
function lastig(p, max=6){
  const out = [];
  for(const [lid, per] of Object.entries(p.fouten||{})) for(const [sk, x] of Object.entries(per)){
    const n = x.r.length, goed = [...x.r].filter(c=>c==='1').length;
    if(n >= 3 && goed/n < .7){ const l = L.find(y=>y.id===lid); out.push({lid, sk, naam: sk==='_les' ? (l?l.titel:lid) : sk, les: l?l.titel:lid, vak: l?l.vak:'', goed, n}); }
  }
  return out.sort((a,b)=>a.goed/a.n - b.goed/b.n || b.n - a.n).slice(0, max);
}
function lastigHtml(p){
  const ls = lastig(p);
  return `<div class="label">Lastige onderdelen</div>${ls.length
    ? `<ul class="lastig">${ls.map(x=>`<li><b>${esc(x.naam)}</b> <span class="muted">${x.sk==='_les'?(VAKKEN[x.vak]?.vak||''):esc(x.les)} · laatste ${x.n} keer ${x.goed} goed</span></li>`).join('')}</ul>`
    : '<p class="muted" style="margin:0">Nog niets opvallends. Een onderdeel komt hier als het kind het minstens 3 keer deed en minder dan 70% goed had.</p>'}`;
}
document.addEventListener('keydown', e => {
  if(e.target.closest && e.target.closest('input,select,textarea')) return;
  if(!document.querySelector('.invoer .pad') || document.querySelector('.overlay')) return;
  if(/^[0-9]$/.test(e.key)) { padDruk(e.key); e.preventDefault(); }
  else if(e.key===',' || e.key==='.') { if(document.querySelector('.pk[data-k=","]')) padDruk(','); e.preventDefault(); }
  else if(e.key==='Backspace') { padDruk('del'); e.preventDefault(); }
  else if(e.key==='Enter') { document.querySelector('[data-act="typok"]')?.click(); e.preventDefault(); }
});
