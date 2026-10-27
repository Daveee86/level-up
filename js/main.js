/* =========================================================
   HOOFDPROGRAMMA: scherm tekenen en knoppen afhandelen
   Elke knop heeft data-act="..."; die komt hieronder in de switch terecht.
   ========================================================= */
function render(){
  if((view.s==='ouders'||view.s==='editor') && !view.ok) view = {s:'ouderpw'};
  if(!['login','pw','create','ouders','ouderpw','editor'].includes(view.s) && !P()) view = {s:'login'};
  let w = 2;
  if(P() && !['login','ouders'].includes(view.s)) w = W();
  else if(view.s==='pw'){ const p=S.profiles.find(x=>x.id===view.id); if(p) w = worldOf(p.groep); }
  else if(view.s==='create' && view.c && view.c.groep) w = worldOf(view.c.groep);
  const ev = evActief(); document.body.className = 'w'+w + (ev ? ' '+ev.klasse : '');
  setTimeout(()=>{ const sc=document.querySelector('.pxscroll'); if(sc && sc.scrollWidth>sc.clientWidth){ const wk=document.getElementById('walker'); sc.scrollLeft = wk ? wk.offsetLeft - sc.clientWidth/2 : (sc.scrollWidth-sc.clientWidth)/2; } },0);
  app.innerHTML = ({login:vLogin, pw:vPw, create:vCreate, map:vMap, isle:vIsle, les:vLes, battle:vBattle, result:vResult, bossintro:vBossIntro, shop:vShop, team:vTeam, ouders:vOuders, ouderpw:vOuderPw, editor:vEditor}[view.s] || vLogin)();
}

/* ---------------- Acties ---------------- */
document.addEventListener('input', e => { if(e.target.id==='cname' && view.c) view.c.name = e.target.value; });
document.addEventListener('change', e => { const t=e.target; const p=S.profiles.find(x=>x.id===t.dataset.id);
  if(t.dataset.geb){ const f=t.dataset.geb, v=t.value?+t.value:null;
    if(t.dataset.cgeb && view.c){ view.c.geb = view.c.geb || {}; view.c.geb[f] = v; return; }
    if(p){ p.geb = Object.assign({}, p.geb||{}, {[f]:v}); if(!p.geb.d && !p.geb.m && !p.geb.j) delete p.geb; save(); render(); return; } }
  if(t.dataset.chg==='groep' && p){ p.groep=+t.value; save(); render(); }
  if(t.dataset.chg==='coins' && p){ const v=Math.floor(Number(t.value)); if(Number.isFinite(v) && v>=0){ p.coins=v; save(); } render(); } });
document.addEventListener('keydown', e => { if(e.key==='Enter' && e.target.id==='opw'){ e.preventDefault(); checkOuderPw(); } });
function lesAnswer(o){
  if(view.picked!==null) return;
  const q=view.oef[view.i]; view.picked=o; view.fb=null;
  noteer(P(), view.id, q, o===q.ans); save();
  if(q.sayAns && o===q.ans) speak(q.sayAns,'en-GB');
  render(); }
function checkOuderPw(){ const v=(document.getElementById('opw')?.value||''); if(v===OUDER_PW) go({s:'ouders', ok:true}); else { view={s:'ouderpw', err:true}; render(); document.getElementById('opw')?.focus(); } }
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if(!t || t.disabled) return;
  const a = t.dataset.act, d = t.dataset; const p = P();
  if(edAction(a, d)) return;
  if(evAction(a, d)) return;
  switch(a){
    case 'home0': go({s:'login'}); break;
    case 'pick': go({s:'pw', id:d.id, sel:[]}); break;
    case 'pw': {
      const sel = (view.sel||[]).concat(+d.i); view.err=false;
      const prof = S.profiles.find(x=>x.id===view.id);
      if(sel.length<3){ view.sel=sel; render(); break; }
      if(sel.join()===prof.pw.join()){ me = prof.id; go({s:'map'}); }
      else { view.sel=[]; view.err=true; render(); }
      break; }
    case 'create': go({s:'create'}); break;
    case 'cgen': view.c.gender=d.g; view.c.tr=SPELER_LOOKS[d.g][0]; render(); break;
    case 'ctr': view.c.tr=d.k; render(); break;
    case 'cg': view.c.groep=+d.g; render(); break;
    case 'cst': view.c.starter=d.id; render(); break;
    case 'cpw': if(view.c.pw.length<3 && !view.c.pw.includes(+d.i)){ view.c.pw.push(+d.i); render(); } break;
    case 'cpwreset': view.c.pw=[]; render(); break;
    case 'csave': {
      const c=view.c; c.name=(document.getElementById('cname')?.value||'').trim();
      if(!c.name){ view.msg='Vul eerst je naam in.'; render(); break; }
      if(!c.gender){ view.msg='Kies jongen of meisje.'; render(); break; }
      if(!c.geb || !c.geb.d || !c.geb.m || !c.geb.j){ view.msg='Kies wanneer je jarig bent: dag, maand en jaar.'; render(); break; }
      if(!c.groep){ view.msg='Kies je groep.'; render(); break; }
      if(c.pw.length<3){ view.msg='Kies 3 geheime plaatjes.'; render(); break; }
      const np = {id:'p'+Date.now(), v:4, name:c.name, gender:c.gender, tr:c.tr, groep:c.groep, pw:c.pw.slice(), geb:{d:c.geb.d, m:c.geb.m, j:c.geb.j}, coins:30, txp:0,
        mons:[{u:'m'+Date.now(), id:c.starter, xp:0}], act:null, items:{heal:1,hint:1}, badges:{}, seen:[c.starter], luck:0, lessons:{}, log:[]};
      np.act = np.mons[0].u; S.profiles.push(np); save(); me=np.id; go({s:'map'}); break; }
    case 'logout': me=null; go({s:'login'}); break;
    case 'map': go({s:'map'}); break;
    case 'isle': go({s:'isle', v:d.v}); break;
    case 'goto': walkTo(d.k); break;
    case 'les': startLesson(d.id); break;
    case 'sayuitleg': { const l=L.find(x=>x.id===view.id); const tmp=document.createElement('div'); tmp.innerHTML=l.uitleg; speak(tmp.textContent); break; }
    case 'startoef': view.phase='oef'; view.i=0; view.picked=null; view.fb=null; render(); break;
    case 'sayq': { const q = view.s==='battle' ? curQ(view) : view.oef[view.i]; const tmp=document.createElement('div'); tmp.innerHTML=q.say||q.q; speak(tmp.textContent); break; }
    case 'ans': if(view.s==='battle') battleAnswer(d.o); else lesAnswer(d.o); break;
    case 'pad': padDruk(d.k); break;
    case 'typok': { const bat = view.s==='battle'; const q = bat ? curQ(view) : view.oef[view.i]; const inv = invoerVan(q, bat ? q.lid : view.id);
      if(!inv || view.picked!==null) break;
      if(!(view.typed||'').replace(',','')){ const v=document.querySelector('.invoer .display'); if(v){ v.classList.remove('leeg'); void v.offsetWidth; v.classList.add('leeg'); } break; }
      const o = invoerAntwoord(q, inv, view.typed); if(bat) battleAnswer(o); else lesAnswer(o); break; }
    case 'next': {
      view.fb=null;
      if(view.i+1<view.oef.length){ view.i++; view.picked=null; view.typed=''; render(); window.scrollTo(0,0); }
      else startBattle('wild', view.id);
      break; }
    case 'bnext': battleNext(); break;
    case 'bend': battleEnd(); break;
    case 'use': useItem(d.id); break;
    case 'boss': go({s:'bossintro', ref:d.v}); break;
    case 'champ': if(champOpen(p)) go({s:'bossintro', ref:'champ'}); else go({s:'map'}); break;
    case 'bossgo': startBattle('boss', view.ref); break;
    case 'shop': go({s:'shop', tab:'mon'}); break;
    case 'tab': view.tab=d.t; view.msg=''; render(); break;
    case 'selmon': view.sel=d.id; view.msg=''; render(); break;
    case 'buymon': { const x=MON[d.id]; if(!owns(p,x.id) && p.coins>=x.price && x.req<=levelInfo(p.txp).lvl && (x.tier!=='legend'||SHOP_LEG.includes(x.id))){ p.coins-=x.price; addMon(p,x.id); save(); view.msg=`${x.names[0]} zit nu in je team! Ga naar ${WORLDS[W()].huis} om hem mee te nemen.`; render(); } break; }
    case 'buyit': { const it=ITEM[d.id]; if(p.coins>=it.prijs){ p.coins-=it.prijs; p.items[it.id]=(p.items[it.id]||0)+1; save(); view.msg=`Gekocht: ${it.naam}.`; render(); } break; }
    case 'team': go({s:'team'}); break;
    case 'selteam': view.sel=d.u; view.msg=''; render(); break;
    case 'setact': p.act=d.u; save(); view.msg='Dit monster vecht nu met je mee!'; render(); break;
    case 'potion': { const m=p.mons.find(x=>x.u===d.u); if(!m || !(p.items[d.id]>0)) break; const mb=mLvl(m), sb=mStage(m);
      p.items[d.id]--; m.xp += d.id==='xp2'?200:60; save(); view.msg=`+${d.id==='xp2'?200:60} XP voor ${mName(m)}!`; render();
      runQueue(mStage(m)>sb ? [()=>evolve(m,sb,mStage(m))] : mLvl(m)>mb ? [()=>levelUpMon(m)] : []); break; }
    case 'useluck': if(p.items.luck>0 && !p.luck){ p.items.luck--; p.luck=1; save(); view.msg='Geluksbamboe is actief: je volgende overwinning geeft dubbele munten.'; render(); } break;
    case 'ouders': go({s:'ouderpw'}); setTimeout(()=>document.getElementById('opw')?.focus(),0); break;
    case 'opwok': checkOuderPw(); break;
    case 'coinadd': { const q=S.profiles.find(x=>x.id===d.id); if(q){ q.coins=Math.max(0,q.coins+(+d.n)); save(); render(); } break; }
    case 'rescue': startRescue(); break;
    case 'pwshow': view.pw = view.pw===d.id ? null : d.id; render(); break;
    case 'del': view.del=d.id; render(); break;
    case 'delno': view.del=null; render(); break;
    case 'delok': S.profiles=S.profiles.filter(x=>x.id!==d.id); save(); view.del=null; render(); break;
  }
});
render();
