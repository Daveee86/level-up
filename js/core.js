/* =========================================================
   KERN: opslag en hulpfuncties
   Voortgang staat in de browser (localStorage). Verander KEY niet, anders raken kinderen hun voortgang kwijt.
   ========================================================= */
const KEY = 'levelup-v4';
const PW_PICS = ['🐶','🍎','⭐','🚗','🌈','🐟','⚽','🍦','🌙'];
let mem = null;
function load(){
  try{ const s = localStorage.getItem(KEY); if(s) return JSON.parse(s); }catch(e){}
  return mem;
}
function save(){
  mem = S;
  try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){}
}
function demoProfile(){
  return {id:'demo',name:'Demo',demo:true,v:4,gender:'b',tr:'b3',groep:6,pw:[0,1,2],coins:260,txp:300,
    mons:[{u:'m1',id:'agnite',xp:400},{u:'m2',id:'kroki',xp:60}],act:'m1',
    items:{xp:1,heal:1,hint:1},badges:{},seen:['agnite','kroki','cardiling'],luck:0,
    lessons:{'r-keer-groot':{best:2,times:1}},log:[{d:Date.now()-86400000,l:'r-keer-groot',s:4,t:5,win:true}]};
}
let S = load() || {profiles:[demoProfile()]};
if(!S.profiles) S = {profiles:[demoProfile()]};

/* Pad naar een plaatje. In de bundel (tools/bundle.py) zitten de plaatjes ingebakken in window.ASSETS. */
const asset = p => (window.ASSETS && window.ASSETS[p]) || p;
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const R = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const pick = a => a[Math.floor(Math.random()*a.length)];
const shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const nl = x => String(x).replace('.', ',');
function numOpts(ans, n, spread, min=0){
  const s = new Set([ans]); let t = 0;
  while(s.size < n && t < 200){ t++; const d = ans + R(-spread, spread); if(d >= min && d !== ans) s.add(d); }
  let k = 1; while(s.size < n){ s.add(ans + k++); }
  return shuffle([...s]).map(String);
}
function txtOpts(ans, pool, n){
  const others = shuffle(pool.filter(x => x !== ans)).slice(0, n-1);
  return shuffle([ans, ...others]);
}
function speak(text, lang='nl-NL'){
  try{ speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = .9; speechSynthesis.speak(u); }catch(e){}
}
function levelInfo(xp){
  let lvl = 1, need = 80, rest = xp;
  while(rest >= need){ rest -= need; lvl++; need = 80 + 20*(lvl-1); }
  return {lvl, cur:rest, need};
}

