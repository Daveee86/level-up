/* =========================================================
   EVENTS EN HAPPY HOUR
   De events zelf staan in data/events.js. Instellingen gelden voor alle kinderen
   op dit apparaat en staan in S.ev = {actief:'sint'|'kerst'|null, happy:{id,max}|null}.
   Per kind: p.happy = {id, n} (gebruikte happy-hour-gevechten), p.evDag = {ev, dag} (laatste dagcadeau).
   ========================================================= */
function evState(){ if(!S.ev) S.ev = {actief:null, happy:null}; return S.ev; }
function evActief(){ const k = evState().actief; return k && EVENTS[k] ? EVENTS[k] : null; }
function kaartImg(w){ const e = evActief(); return (e && e.kaart && e.kaart[w]) || KAART_IMG[w]; }
function vandaag(){ const d = new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }

/* ---- happy hour ---- */
function happyAan(){ return !!evState().happy; }
function happyGebruikt(p){ const h = evState().happy; return h && p.happy && p.happy.id===h.id ? p.happy.n : 0; }
function happyOver(p){ const h = evState().happy; return h ? Math.max(0, h.max - happyGebruikt(p)) : 0; }
function happyGebruik(p){ const h = evState().happy; if(!h || happyOver(p)<=0) return false;
  if(!p.happy || p.happy.id!==h.id) p.happy = {id:h.id, n:0}; p.happy.n++; return true; }

/* ---- dagcadeau ---- */
function cadeauKlaar(p){ const e = evActief(); if(!e || !e.cadeau) return false;
  return !(p.evDag && p.evDag.ev===evState().actief && p.evDag.dag===vandaag()); }
function openCadeau(p){
  if(!cadeauKlaar(p)) return;
  const e = evActief(); const c = pick(EVENT_CADEAUS);
  p.evDag = {ev:evState().actief, dag:vandaag()};
  if(c.munten) p.coins += c.munten; else p.items[c.item] = (p.items[c.item]||0) + 1;
  save();
  const it = c.item ? ITEM[c.item] : null;
  overlay(`<div class="lvbox" role="dialog" aria-label="Cadeau"><div class="label">${e.naam}</div><div class="lvbig" style="font-size:30px">${e.cadeau.open}</div>
    <div class="evprijs">${it ? itImg(it.icon) : `<img class="px" src="${asset('assets/events/pakje.png')}" alt="">`}</div>
    <p style="margin:0;font-weight:700;font-size:20px">${it ? it.naam : `🪙 ${c.munten} munten`}</p><button class="btn sun" id="lvok">Joepie!</button></div>`);
  confetti();
}

/* ---- wat het kind ziet ---- */
function evBanners(p){
  const e = evActief(); let h = '';
  if(e) h += `<div class="evbanner"><img class="px" src="${asset(e.icoon)}" alt=""><b>${e.banner}</b>
    ${e.cadeau ? (cadeauKlaar(p) ? `<button class="btn sun" data-act="evcadeau">${e.cadeau.knop}</button>` : `<span class="muted">${e.cadeau.morgen}</span>`) : ''}</div>`;
  if(happyAan()){ const o = happyOver(p);
    h += `<div class="evbanner hh"><b>⚡ Happy hour!</b><span>${o ? `Dubbele munten voor je volgende ${o===1?'gevecht':o+' gevechten'}.` : 'Je hebt al je happy-hour-gevechten gebruikt.'}</span></div>`; }
  return h;
}
function evVallen(){
  const e = evActief(); if(!e || !e.vallen) return '';
  let h = ''; for(let i=0;i<16;i++){ const x = (i*6.3 + (i%3)*2.1) % 98, dur = 7 + (i*37 % 50)/10, del = -((i*53) % 90)/10, sz = 1.6 + (i%4)*0.4;
    h += `<img src="${asset(e.vallen)}" alt="" style="left:${x}%;width:${sz}%;animation-duration:${dur}s;animation-delay:${del}s">`; }
  return `<div class="valt" aria-hidden="true">${h}</div>`;
}

/* ---- ouderscherm ---- */
function evOuderHtml(){
  const ev = evState(); const h = ev.happy;
  return `<div class="panel" style="display:grid;gap:12px;margin-bottom:16px">
    <h2 style="font-size:24px">Evenementen</h2>
    <p class="muted" style="margin:0;max-width:62ch">Met één knop krijgt de wereld een ander uiterlijk, voor alle kinderen op dit apparaat. Er staat er één tegelijk aan. Kinderen kunnen dan elke dag één klein cadeautje openen.</p>
    <div class="row">${Object.entries(EVENTS).map(([k,e])=> ev.actief===k
      ? `<button class="btn" data-act="evset" data-k=""><img class="px evico" src="${asset(e.icoon)}" alt=""> ${e.naam} staat aan · uitzetten</button>`
      : `<button class="btn ghost" data-act="evset" data-k="${k}"><img class="px evico" src="${asset(e.icoon)}" alt=""> ${e.naam} aanzetten</button>`).join('')}</div>
    <h3 style="font-size:20px;margin-top:6px">Happy hour</h3>
    <p class="muted" style="margin:0;max-width:62ch">Dubbele munten voor de eerstvolgende gevechten van elk kind. Daarna stopt het vanzelf.</p>
    <div class="row"><label class="muted" for="hhmax">Aantal gevechten per kind:</label>
      <input id="hhmax" type="number" min="1" max="50" step="1" inputmode="numeric" value="${h ? h.max : HAPPY_STANDAARD}" style="width:80px;font:inherit;padding:6px 8px;border-radius:10px;border:2px solid var(--line);background:var(--card);color:var(--ink)">
      <button class="btn ${h?'ghost':''}" data-act="hhon">${h ? 'Opnieuw starten' : 'Happy hour starten'}</button>
      ${h ? `<button class="btn ghost" data-act="hhoff">Stoppen</button>` : ''}</div>
    ${h ? `<p class="tip" style="margin:0">Happy hour staat aan: ${S.profiles.map(p=>`${esc(p.name)} ${happyGebruikt(p)}/${h.max}`).join(' · ')}</p>` : ''}
  </div>`;
}
function evAction(a, d){
  const ev = evState();
  if(a==='evset'){ ev.actief = d.k || null; save(); render(); return true; }
  if(a==='hhon'){ const n = Math.floor(Number(document.getElementById('hhmax')?.value)); ev.happy = {id:Date.now(), max: Number.isFinite(n) && n>0 ? Math.min(n,50) : HAPPY_STANDAARD}; save(); render(); return true; }
  if(a==='hhoff'){ ev.happy = null; save(); render(); return true; }
  if(a==='evcadeau'){ const p = P(); if(p) openCadeau(p); return true; }
  return false;
}
