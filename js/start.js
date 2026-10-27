/* =========================================================
   SCHERMEN: balk, inloggen, nieuwe speler
   
   ========================================================= */
const app = document.getElementById('app');
function bar(){
  const p = P(); const li = levelInfo(p.txp);
  return `<div class="bar"><div class="bar-in">
    <div class="mini">${trImg(p.tr)}</div>
    <div class="who"><div class="nm">${esc(p.name)}<small>Trainer</small></div>
      <div class="xp"><span class="lvl">Level ${li.lvl}</span><span class="track"><span class="fill" style="width:${Math.round(li.cur/li.need*100)}%"></span></span><span>${li.cur}/${li.need} XP</span></div></div>
    <span class="coins">🪙 ${p.coins}</span>
    <button class="navb" data-act="map">Kaart</button>
    <button class="navb" data-act="logout">Stoppen</button>
  </div></div>`;
}

function vLogin(){
  return `<div class="wrap">
    <div class="hero"><div class="logo">Level<span>UP</span></div>
      <p class="muted" style="font-size:18px;margin:6px 0 0;max-width:54ch">Leer, vecht en verzamel. Elk goed antwoord is een aanval. Hoe slimmer jij wordt, hoe sterker je monsters worden.</p></div>
    <h2 style="font-size:26px;margin-bottom:12px">Wie gaat er spelen?</h2>
    <div class="tiles">
      ${S.profiles.map(p=>{ const m=act(p); return `<button class="ptile" data-act="pick" data-id="${p.id}"><div class="duo">${trImg(p.tr,'tr')}${m?monImg(m,'f','').replace('<img','<img style="width:70px"'):''}</div><b>${esc(p.name)}</b><span class="muted">Level ${levelInfo(p.txp).lvl} · ${p.mons.length} monster${p.mons.length===1?'':'s'}</span><span class="muted" style="font-size:13px">Groep ${p.groep}</span>${p.demo?'<span class="badge">voorbeeld</span>':''}</button>`; }).join('')}
      <button class="ptile add" data-act="create"><span class="plus">+</span>Nieuwe speler</button>
    </div>
    <p style="margin-top:24px"><button class="btn ghost" data-act="ouders">Voor ouders</button></p>
    <p class="muted" style="font-size:13px;margin-top:20px;max-width:62ch">Monsters, trainers en icoontjes: <a href="https://wiki.tuxemon.org" target="_blank" rel="noopener" style="color:var(--link)">Tuxemon</a>-project, CC BY-SA 4.0. Met dank aan alle makers.</p>
  </div>`;
}

function vPw(){
  const p = S.profiles.find(x=>x.id===view.id); const sel = view.sel || [];
  return `<div class="wrap">
    <button class="back" data-act="home0">← Terug</button>
    <div class="panel" style="max-width:420px">
      <div class="row"><div style="width:80px">${trImg(p.tr)}</div><div><h2 style="font-size:28px">Hoi ${esc(p.name)}!</h2><p class="muted" style="margin:0">Tik je 3 geheime plaatjes.</p></div></div>
      <div class="dots">${[0,1,2].map(i=>`<i class="${i<sel.length?'on':''}"></i>`).join('')}</div>
      <div class="pwgrid ${view.err?'shake':''}">${PW_PICS.map((e,i)=>`<button data-act="pw" data-i="${i}" aria-label="plaatje ${i+1}">${e}</button>`).join('')}</div>
      ${view.err?`<p style="color:var(--bad);font-weight:600">Dat waren niet de goede plaatjes. Probeer het nog eens.</p>`:''}
      ${p.demo?`<p class="tip" style="margin-top:14px">Voorbeeldspeler: de plaatjes zijn ${p.pw.map(i=>PW_PICS[i]).join(' ')}. Win één gevecht en Agnite evolueert!</p>`:''}
    </div></div>`;
}

function evoRow(id, reached){
  const m = MON[id];
  return `<div class="evorow">${m.spr.map((s,i)=>`${i?'<span class="arr">→</span>':''}<div class="st">${sprite(s,'f',i+1>reached?'sil':'')}${i+1<=reached?m.names[i]:'???'}<span>${i===0?'start':'level '+evoLevels(id)[i-1]}</span></div>`).join('')}</div>`;
}

function vCreate(){
  const c = view.c || (view.c = {name:'', gender:null, tr:null, groep:null, starter:STARTERS[0], pw:[]});
  return `<div class="wrap">
    <button class="back" data-act="home0">← Terug</button>
    <div class="panel intro" style="margin-bottom:18px">${trImg('prof','big-tr')}<div><div class="label">Professor Pixel</div><h1 style="font-size:30px;margin:4px 0 6px">Welkom, nieuwe trainer!</h1><p class="muted" style="margin:0">Vertel me wie je bent en kies je eerste monster. Andere monsters kun je later kopen met munten die je verdient door te leren.</p></div></div>
    <div class="steps">
      <div class="panel field"><div class="label">1 · Naam</div><input id="cname" maxlength="16" placeholder="Hoe heet je?" value="${esc(c.name)}" autocomplete="off"></div>
      <div class="panel"><div class="label" style="margin-bottom:8px">2 · Ben je een jongen of een meisje?</div>
        <div class="chips">${[['b','Jongen'],['g','Meisje']].map(([g,n])=>`<button class="chip ${c.gender===g?'on':''}" data-act="cgen" data-g="${g}">${n}</button>`).join('')}</div>
        ${c.gender?`<div class="label" style="margin:14px 0 8px">Kies hoe je eruitziet</div><div class="animals">${SPELER_LOOKS[c.gender].map(k=>`<button class="${c.tr===k?'on':''}" data-act="ctr" data-k="${k}">${trImg(k)}</button>`).join('')}</div>`:''}</div>
      <div class="panel"><div class="label" style="margin-bottom:8px">3 · In welke groep zit je?</div>
        <div class="chips">${GROEPEN.map(g=>`<button class="chip ${c.groep===g?'on':''}" data-act="cg" data-g="${g}">Groep ${g}</button>`).join('')}</div>
        ${c.groep?`<p class="muted" style="margin:10px 0 0">Jij speelt in de wereld <b>${WORLDS[worldOf(c.groep)].naam}</b>.</p>`:''}</div>
      <div class="panel"><div class="label" style="margin-bottom:8px">4 · Kies je eerste monster</div>
        <div class="animals">${STARTERS.map(id=>`<button class="${c.starter===id?'on':''}" data-act="cst" data-id="${id}">${sprite(MON[id].spr[0])}${MON[id].names[0]}<small>${MON[id].el}</small></button>`).join('')}</div>
        <div style="margin-top:14px"><div class="muted" style="font-size:14px;margin-bottom:6px">Zo evolueert <b>${MON[c.starter].names[0]}</b>:</div>${evoRow(c.starter,1)}</div></div>
      <div class="panel"><div class="label" style="margin-bottom:8px">5 · Kies 3 geheime plaatjes (onthoud ze goed!)</div>
        <div class="dots">${[0,1,2].map(i=>`<i class="${i<c.pw.length?'on':''}"></i>`).join('')}</div>
        <div class="pwgrid">${PW_PICS.map((e,i)=>`<button class="${c.pw.includes(i)?'on':''}" data-act="cpw" data-i="${i}">${e}</button>`).join('')}</div>
        ${c.pw.length?`<p class="muted" style="margin-bottom:0">Jouw plaatjes: ${c.pw.map(i=>PW_PICS[i]).join(' ')} <button class="speak" data-act="cpwreset">Opnieuw kiezen</button></p>`:''}</div>
      <div>${view.msg?`<p style="color:var(--bad);font-weight:600">${view.msg}</p>`:''}<button class="btn sun" data-act="csave">Klaar, op avontuur!</button></div>
    </div></div>`;
}

function badgesHtml(p, w){
  const list = bossesOpen(p,w).map(k=>({k, ok:p.badges[bossKey(w,k)], ic:'b_'+k}));
  list.push({k:'champ', ok:p.badges['champ-'+w], ic:'b_champ'});
  return `<div class="badges">${list.map(b=>`<img class="px ${b.ok?'':'sil'}" src="${asset(`assets/items/${b.ic}.png`)}" alt="${b.ok?'badge':'nog te winnen'}" title="${b.k}">`).join('')}</div>`;
}

