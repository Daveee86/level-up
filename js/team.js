/* ---- team & monsterdex ---- */
function vTeam(){
  const p = P(); const WD = WORLDS[W()]; const sel = p.mons.find(x=>x.u===view.sel) || act(p); const sl = levelInfo(sel.xp);
  const potion = id => `<button class="bitem" data-act="potion" data-id="${id}" data-u="${sel.u}" ${(p.items[id]||0)<1?'disabled':''}>${itImg(ITEM[id].icon)}${ITEM[id].naam} ×${p.items[id]||0}</button>`;
  const dexList = MONSTERS;
  return bar()+`<div class="wrap"><button class="back" data-act="map">← Kaart</button><h1 style="font-size:36px;margin-bottom:12px">⛺ ${WD.huis}</h1>
    <div class="shop"><div class="panel preview"><div class="detail" style="display:grid;gap:8px;justify-items:center">
      <div class="big">${monImg(sel)}</div><b style="font-family:var(--f-display);font-size:24px">${mName(sel)}</b><span class="tier ${MON[sel.id].tier}">${TIER[MON[sel.id].tier].naam}</span>
      <span class="muted">${MON[sel.id].el} · level ${sl.lvl} · ${sl.cur}/${sl.need} XP</span><div class="mbar"><i style="width:${Math.round(sl.cur/sl.need*100)}%"></i></div>
      ${MON[sel.id].spr.length>1?evoRow(sel.id, mStage(sel)):''}
      ${sel.u===p.act?`<span style="color:var(--good);font-weight:600">Vecht nu met jou mee</span>`:`<button class="btn" data-act="setact" data-u="${sel.u}">Neem mee in gevechten</button>`}
      <div class="bitems" style="justify-content:center">${potion('xp')}${potion('xp2')}</div>
      <button class="bitem" data-act="useluck" ${(p.items.luck||0)<1||p.luck?'disabled':''}>${itImg('luck')}${p.luck?'Geluksbamboe is actief':'Geluksbamboe gebruiken'} ×${p.items.luck||0}</button>
      ${view.msg?`<p style="color:var(--good);font-weight:600;margin:0">${view.msg}</p>`:''}</div></div>
      <div><div class="label" style="margin-bottom:8px">Jouw monsters (${p.mons.length})</div>
        <div class="mgrid">${p.mons.map(x=>{ const xl=levelInfo(x.xp); return `<button class="mcard ${x.u===sel.u?'sel':''}" data-act="selteam" data-u="${x.u}">${monImg(x)}<b>${mName(x)}</b><small>Level ${xl.lvl}${x.u===p.act?' · actief':''}</small><div class="mbar"><i style="width:${Math.round(xl.cur/xl.need*100)}%"></i></div></button>`; }).join('')}</div>
        <div class="label" style="margin:22px 0 8px">Monsterdex · ${p.mons.length} van ${dexList.length} verzameld · ${p.seen.length} gezien</div>
        <div class="dex">${dexList.map(x=>{ const own=owns(p,x.id), seen=p.seen.includes(x.id); return `<div title="${own||seen?x.names[0]:'???'}">${sprite(x.spr[0],'f',own?'':'sil')}${x.tier==='legend'?'<span>★</span>':''}</div>`; }).join('')}</div>
        <p class="muted" style="font-size:14px">Gekleurd = in je team. Silhouet = nog niet verzameld. Legendarische monsters (★) win je van eilandmeesters en de Kampioen.</p></div></div></div>`;
}

