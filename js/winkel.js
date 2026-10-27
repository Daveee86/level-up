/* ---- winkel ---- */
function vShop(){
  const p = P(); const li = levelInfo(p.txp); const tab = view.tab || 'mon'; const WD = WORLDS[W()];
  const tabs = `<div class="slots"><button class="chip ${tab==='mon'?'on':''}" data-act="tab" data-t="mon">Monsters</button><button class="chip ${tab==='items'?'on':''}" data-act="tab" data-t="items">Drankjes & items</button></div>`;
  if(tab==='items') return bar()+`<div class="wrap"><button class="back" data-act="map">← Kaart</button><h1 style="font-size:36px;margin-bottom:12px">🛒 ${WD.markt}</h1>${tabs}
    <div style="display:grid;gap:10px;max-width:720px">${ITEMS.map(it=>{ const lock=it.lvl>li.lvl; return `<div class="irow">${itImg(it.icon)}<div><b>${it.naam}</b><span class="muted" style="font-size:14px">${it.uit} Je hebt er ${p.items[it.id]||0}.</span></div>
      ${lock?`<span class="muted" style="font-size:13px">🔒 Level ${it.lvl}</span>`:`<button class="btn sun" data-act="buyit" data-id="${it.id}" ${p.coins<it.prijs?'disabled':''}>🪙 ${it.prijs}</button>`}</div>`; }).join('')}</div>
    ${view.msg?`<p style="color:var(--good);font-weight:600">${view.msg}</p>`:''}</div>`;
  const list = MONSTERS.slice().sort((a,b)=> (a.tier==='legend')-(b.tier==='legend') || a.price-b.price);
  const sel = view.sel ? MON[view.sel] : null;
  const state = x => { if(owns(p,x.id)) return `<span class="state ok">In je team ✓</span>`;
    if(x.tier==='legend' && !SHOP_LEG.includes(x.id)) return `<span class="state">🏆 Versla een meester</span>`;
    if(x.req>li.lvl) return `<span class="state">🔒 Level ${x.req}</span>`;
    return `<span class="price">🪙 ${x.price}</span>`; };
  let detail = `<p class="muted" style="margin:0">Tik op een monster om het te bekijken.</p>`;
  if(sel){ const own = owns(p,sel.id); const om = p.mons.find(x=>x.id===sel.id);
    let action = '';
    if(own) action = `<span class="state ok" style="font-weight:600;color:var(--good)">Dit monster zit al in je team.</span>`;
    else if(sel.tier==='legend' && !SHOP_LEG.includes(sel.id)) action = `<p class="muted" style="margin:0">Dit legendarische monster krijg je alleen door een eilandmeester of de Kampioen te verslaan.</p>`;
    else if(sel.req>li.lvl) action = `<p class="muted" style="margin:0">Word eerst trainer level ${sel.req}.</p>`;
    else action = `<button class="btn sun" data-act="buymon" data-id="${sel.id}" ${p.coins<sel.price?'disabled':''}>Kopen voor 🪙 ${sel.price}</button>${p.coins<sel.price?`<p class="muted" style="margin:0">Je hebt nog ${sel.price-p.coins} munten nodig.</p>`:''}`;
    detail = `<div class="detail" style="display:grid;gap:8px;justify-items:center"><div class="big">${sprite(sel.spr[0])}</div><b style="font-family:var(--f-display);font-size:24px">${sel.names[0]}</b><span class="tier ${sel.tier}">${TIER[sel.tier].naam}</span><span class="muted">${sel.el}</span>
      ${sel.spr.length>1?evoRow(sel.id, om?mStage(om):1):'<span class="muted" style="font-size:13px">Dit monster evolueert niet, maar is supersterk.</span>'}${action}</div>`; }
  return bar()+`<div class="wrap"><button class="back" data-act="map">← Kaart</button><h1 style="font-size:36px;margin-bottom:12px">🛒 ${WD.markt}</h1>${tabs}
    <div class="shop"><div class="panel preview">${detail}${view.msg?`<p style="color:var(--good);font-weight:600;margin:10px 0 0">${view.msg}</p>`:''}</div>
      <div><div class="mgrid">${list.map(x=>`<button class="mcard ${view.sel===x.id?'sel':''}" data-act="selmon" data-id="${x.id}">${sprite(x.spr[0],'f', (x.tier==='legend'&&!owns(p,x.id))?'sil':'')}<b>${x.tier==='legend'&&!owns(p,x.id)?'???':x.names[0]}</b><small>${x.el}</small><span class="tier ${x.tier}">${TIER[x.tier].naam}</span>${state(x)}</button>`).join('')}</div></div></div></div>`;
}

