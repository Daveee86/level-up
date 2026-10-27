/* ---- ouders ---- */
function vOuders(){
  return `<div class="wrap"><button class="back" data-act="home0">← Terug</button>
    <h1 style="font-size:36px;margin-bottom:6px">Admin</h1><details class="learnnotes"><summary>Over de nieuwe lessen en bronnen</summary><p>De nieuwe oefeningen zijn een aanvulling op school, geen complete lesmethode. De groepsindeling is een niveau-inschatting: pas zo nodig de groep aan op wat het kind al kan. Geschiedenis loopt van tijdsbesef naar bronnenonderzoek; ruimte van waarnemen naar verklaren. De VOC-lessen voor groep 6–8 behandelen ook koloniale dwang en slavernij.</p><ul><li><a href="https://www.slo.nl/thema/meer/tule/orientatie-jezelf-wereld/kerndoel-52-53" target="_blank" rel="noopener">SLO: geschiedenis en tijdvakken</a></li><li><a href="https://www.slo.nl/thema/meer/tule/orientatie-jezelf-wereld/kerndoel-46/" target="_blank" rel="noopener">SLO: zon, aarde en maan</a></li><li><a href="https://www.canonvannederland.nl/nl/vocenwic" target="_blank" rel="noopener">Canon van Nederland: VOC en WIC</a></li><li><a href="https://www.nationaalarchief.nl/onderzoeken/zoekhulpen/voc-1602-1800" target="_blank" rel="noopener">Nationaal Archief: VOC</a></li><li><a href="https://science.nasa.gov/solar-system/planets/" target="_blank" rel="noopener">NASA: planeten</a></li><li><a href="https://science.nasa.gov/moon/moon-phases/" target="_blank" rel="noopener">NASA: maanfasen</a></li><li><a href="https://science.nasa.gov/kids/earth/eo-kids/all-about-that-tilt-sun-and-seasons/" target="_blank" rel="noopener">NASA: seizoenen</a></li></ul></details>
    ${evOuderHtml()}
    <p class="muted" style="margin-top:0;max-width:62ch">Hier zie je wat elk kind heeft gedaan. In dit prototype wordt alles bewaard in deze browser op dit apparaat. Level-UP is voor groep 3 t/m 8. De wereld hangt af van de groep: groep 3–5 Avonturen-eilanden, 6–8 Neon Nexus.</p>
    <div style="display:grid;gap:16px">
    ${S.profiles.map(p=>{ const li=levelInfo(p.txp); const w=worldOf(p.groep);
      const perVak = Object.keys(VAKKEN).map(k=>{ const ls=L.filter(l=>l.vak===k && p.groep>=l.g[0] && p.groep<=l.g[1]); const st=ls.reduce((s,l)=>s+(p.lessons[l.id]?.best||0),0); return `<td class="num">${ls.length?`${st} / ${ls.length*3} ★`:'–'}</td>`; }).join('');
      const nb = Object.values(p.badges).filter(Boolean).length;
      return `<div class="panel kid"><div class="kidhead"><div style="width:64px">${trImg(p.tr)}</div><div><h2 style="font-size:24px">${esc(p.name)}${p.demo?'<span class="badge">voorbeeld</span>':''}</h2><span class="muted">Groep ${p.groep} · trainer level ${li.lvl} · 🪙 ${p.coins} · ${p.mons.length} monsters · ${nb} badge${nb===1?'':'s'}</span></div></div>
        <div class="scroll"><table class="ptable"><tr>${Object.values(VAKKEN).map(v=>`<th>${v.vak}</th>`).join('')}</tr><tr>${perVak}</tr></table></div>
        <div class="label">Laatste gevechten</div>
        ${p.log.length?`<div class="scroll"><table class="ptable"><tr><th>Datum</th><th>Les</th><th>Score</th><th>Uitslag</th></tr>${p.log.slice(0,8).map(x=>{ const isB=String(x.l).startsWith('boss:'); const l=isB?null:L.find(y=>y.id===x.l); const bn=isB?(x.l==='boss:champ'?'Kampioen':'Eilandmeester '+(VAKKEN[x.l.slice(5)]?.vak||'')):(l?l.titel:x.l); return `<tr><td class="num">${new Date(x.d).toLocaleDateString('nl-NL',{day:'numeric',month:'short'})} ${new Date(x.d).toLocaleTimeString('nl-NL',{hour:'2-digit',minute:'2-digit'})}</td><td>${bn}</td><td class="num">${x.s}/${x.t} goed${x.h?` · ${x.h} met hint`:''}${x.cs?' · combo-schild':''}</td><td>${x.win?(x.r==='ok'?`gewonnen met herstel-drankje (redding ${x.rc}/${x.rn} goed)`:'gewonnen'):(x.r==='mis'?`verloren (redding ${x.rc}/${x.rn} goed)`:'verloren')}</td></tr>`; }).join('')}</table></div>`:'<p class="muted" style="margin:0">Nog geen gevechten.</p>'}
        <div class="row"><label class="muted" for="c-${p.id}">Munten:</label><input id="c-${p.id}" type="number" min="0" step="1" inputmode="numeric" value="${p.coins}" data-chg="coins" data-id="${p.id}" style="width:100px;font:inherit;padding:6px 8px;border-radius:10px;border:2px solid var(--line);background:var(--card);color:var(--ink)">
          ${[10,50,-10].map(n=>`<button class="chip" data-act="coinadd" data-id="${p.id}" data-n="${n}">${n>0?'+':'−'}${Math.abs(n)}</button>`).join('')}</div>
        <div class="row gebrij"><span class="muted">Verjaardag:</span>${gebKiezers(p.geb, `data-id="${p.id}"`)}${p.geb&&p.geb.j?`<span class="muted">(${leeftijd(p)} jaar)</span>`:''}</div>
        <div class="row"><label class="muted" for="g-${p.id}">Groep:</label><select id="g-${p.id}" data-chg="groep" data-id="${p.id}">${GROEPEN.map(g=>`<option ${g===p.groep?'selected':''}>${g}</option>`).join('')}</select>
          <button class="btn ghost" data-act="pwshow" data-id="${p.id}">Toon plaatjes</button><button class="btn ghost" data-act="del" data-id="${p.id}">Verwijderen</button></div>
        ${view.pw===p.id?`<p class="tip" style="margin:0">Geheime plaatjes van ${esc(p.name)}: ${p.pw.map(i=>PW_PICS[i]).join(' ')}</p>`:''}
        ${view.del===p.id?`<div class="confirm">Weet je zeker dat je ${esc(p.name)} wilt verwijderen? Alle munten, monsters en badges zijn dan weg. <div class="row" style="margin-top:8px"><button class="btn danger" data-act="delok" data-id="${p.id}">Ja, verwijderen</button><button class="btn ghost" data-act="delno">Nee</button></div></div>`:''}
      </div>`; }).join('')}
    </div>
    ${backupHtml()}
    ${customListHtml()}
  </div>`;
}

function vOuderPw(){
  return `<div class="wrap"><button class="back" data-act="home0">← Terug</button>
    <div class="panel" style="max-width:420px;display:grid;gap:12px"><h1 style="font-size:30px">Admin</h1>
      <label class="muted" for="opw">Vul het adminwachtwoord in</label>
      <input id="opw" type="password" autocomplete="off" style="font:inherit;font-size:18px;padding:10px 12px;border-radius:12px;border:2px solid var(--line);background:var(--card);color:var(--ink)">
      ${view.err?`<p style="color:var(--bad);font-weight:600;margin:0">Dat wachtwoord klopt niet. Probeer het opnieuw.</p>`:''}
      <div><button class="btn" data-act="opwok">Openen</button></div></div></div>`;
}
const OUDER_PW = 'admin';   // voorlopig: alleen een drempel voor kinderen, geen echte beveiliging
