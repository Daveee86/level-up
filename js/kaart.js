/* =========================================================
   WERELDKAART
   Plekken en plaatjes staan in data/werelden.js.
   ========================================================= */
/* Pixel-wereldkaart: plaatjes gemaakt uit Tuxemon-gebouwen; klikbare plekken liggen erbovenop. */
function mapSpots(p, w){
  const WD = WORLDS[w]; const champ = champOpen(p);
  const vak = k => { const v = isle(k,w); const base = VAKKEN[k]; const locked = !v || (base.vanaf && p.groep < base.vanaf);
    return {k, act:'isle', v:k, naam: v ? v.naam : base.vak, sub: base.vak, locked, lockTxt: base.vanaf ? `vanaf groep ${base.vanaf}` : 'gesloten', done: !!p.badges[bossKey(w,k)]}; };
  return ['rekenen','taal','engels','topo','geschiedenis','ruimte'].map(vak).concat([
    {k:'shop', act:'shop', naam:WD.markt, sub:'Monsters en drankjes'},
    {k:'team', act:'team', naam:WD.huis, sub:'Je monsters'},
    {k:'kampioen', act:'champ', naam:'Kampioen', sub:'Eindbaas', locked:!champ, lockTxt:'win eerst alle badges', done:!!p.badges['champ-'+w]}]);
}
/* De trainer staat naast het gebouw (niet op het naambordje): rechts ervan, of links als er rechts geen plek is. */
function spotPos(k){ const h = KAART_PLEKKEN[k]; if(!h) return KAART_PLEIN;
  const opzij = h.w/2 + 4; const x = h.x + opzij <= 95 ? h.x + opzij : h.x - opzij;
  return {x, y:Math.min(98, h.by)}; }
function vMap(){
  const p = P(); const w = W(); const WD = WORLDS[w]; const m = act(p); const ml = levelInfo(m.xp); const st = mStage(m); const ev = evoLevels(m.id);
  const nextEvo = ev[st-1];
  const spots = mapSpots(p, w);
  const pos = p.pos && KAART_PLEKKEN[p.pos] ? spotPos(p.pos) : KAART_PLEIN;
  const hotspots = spots.map(s => { const h = KAART_PLEKKEN[s.k];
    return `<button class="hot ${s.locked?'locked':''}" style="left:${h.x-h.w/2}%;top:${h.by-h.h}%;width:${h.w}%;height:${h.h}%" data-act="goto" data-k="${s.k}" aria-label="${s.naam}: ${s.sub}${s.locked?' ('+s.lockTxt+')':''}"></button>
      <span class="plate ${s.locked?'locked':''} ${s.done?'done':''}" style="left:${h.x}%;top:${Math.min(h.by+0.5, 91)}%">${s.locked?'🔒 ':''}${s.naam}${s.done?' ✓':''}</span>`; }).join('');
  return bar()+`<div class="wrap"><div class="home">
    <div><div class="label">${WD.naam}</div><h1 style="font-size:32px;margin:2px 0 12px">Waar ga je heen?</h1>${evBanners(p)}
      <div class="pxscroll"><div class="pxmap" id="pxmap"><img class="px" src="${asset(kaartImg(w))}" alt="Wereldkaart ${WD.naam}">${hotspots}${evVallen()}
        <div class="walker" id="walker" style="left:${pos.x}%;top:${pos.y}%">${trImg(p.tr)}${monImg(m,'f','wmon')}</div></div></div>
      <p class="muted" style="margin-top:10px">Tik op een gebouw om erheen te lopen. In elk gebouw leer je een vak en vecht je tegen wilde monsters. Heb je alle lessen gedaan? Dan wacht de eilandmeester. Win alle badges en daag de Kampioen uit!</p></div>
    <div class="panel me">
      <div class="duo">${trImg(p.tr,'tr')}<div class="mon">${monImg(m)}</div></div>
      <div><h2 style="font-size:26px">${mName(m)}</h2><span class="muted">${MON[m.id].el} · level ${ml.lvl}</span><div class="mbar"><i style="width:${Math.round(ml.cur/ml.need*100)}%"></i></div></div>
      <div class="evo-prog">${evoRow(m.id, st)}<span class="muted" style="font-size:14px">${nextEvo?`Evolueert op level ${nextEvo}. Nog ${nextEvo-ml.lvl} level${nextEvo-ml.lvl===1?'':'s'}!`:'Volledig geëvolueerd!'}</span></div>
      <div style="width:100%"><div class="label" style="margin-bottom:4px">Badges</div>${badgesHtml(p,w)}</div>
      <div class="acts"><button class="btn" data-act="shop">${WD.markt}</button><button class="btn ghost" data-act="team">${WD.huis}</button></div>
    </div></div></div>`;
}
let walking = false;
function walkTo(k){
  const p = P(); if(!p || walking) return; const s = mapSpots(p, W()).find(x=>x.k===k); if(!s) return;
  const go2 = () => { walking = false; p.pos = k; save();
    if(s.act==='isle') go({s:'isle', v:s.v}); else if(s.act==='shop') go({s:'shop', tab:'mon'}); else if(s.act==='team') go({s:'team'}); else if(s.act==='champ'){ if(champOpen(p)) go({s:'bossintro', ref:'champ'}); else { const pl=document.querySelector('.plate.locked:last-of-type'); go({s:'map'}); } } };
  const el = document.getElementById('walker'); const to = spotPos(k);
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!el || reduce){ go2(); return; }
  walking = true; el.classList.add('walking'); el.style.left = to.x+'%'; el.style.top = to.y+'%';
  setTimeout(go2, 650);
}

