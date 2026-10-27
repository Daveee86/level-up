/* =========================================================
   STATUS EN SPELREGELS
   Wie speelt er, welk scherm is open, welke bazen zijn open.
   ========================================================= */
let me = null;
let view = {s:'login'};
function P(){ return S.profiles.find(p => p.id === me); }
function W(){ const p = P(); return p ? worldOf(p.groep) : 2; }
function go(v){ view = v; render(); window.scrollTo(0,0); }
function act(p){ return p.mons.find(m => m.u === p.act) || p.mons[0]; }
function owns(p, id){ return p.mons.some(m => m.id === id); }
function bossKey(w, vak){ return `w${w}-${vak}`; }
function islesOf(w){ return Object.keys(VAKKEN).filter(k => isle(k,w)); }
function bossesOpen(p, w){ return islesOf(w).filter(k => WORLDS[w].boss[k] && !(VAKKEN[k].vanaf && p.groep < VAKKEN[k].vanaf)); }
function champBosses(p, w){ return bossesOpen(p,w).filter(k => VAKKEN[k].kampioen !== false); }
function champOpen(p){ const w = worldOf(p.groep); return champBosses(p,w).every(k => p.badges[bossKey(w,k)]); }
function addMon(p, id){ if(owns(p,id)) return null; const m = {u:'m'+Date.now()+R(0,999), id, xp:0}; p.mons.push(m); if(!p.seen.includes(id)) p.seen.push(id); return m; }


/* Oude voortgang: groep 1 en 2 bestaan niet meer. */
S.profiles.forEach(p => { if(p.groep < 3) p.groep = 3; });
