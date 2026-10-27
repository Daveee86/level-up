/* =========================================================
   MONSTERS: hulpfuncties
   De monsterlijst zelf staat in data/monsters.js.
   ========================================================= */
const TIER = {starter:{naam:'Starter'}, common:{naam:'Gewoon'}, rare:{naam:'Zeldzaam'}, epic:{naam:'Episch'}, legend:{naam:'Legendarisch'}};
const MON = Object.fromEntries(MONSTERS.map(m => [m.id, m]));
const STARTERS = MONSTERS.filter(m => m.tier==='starter').map(m => m.id);
const ITEM = Object.fromEntries(ITEMS.map(i => [i.id, i]));

const evoLevels = id => MON[id].evo || ({3:[5,10], 2:[7], 1:[]})[MON[id].spr.length];
function mLvl(m){ return levelInfo(m.xp).lvl; }
function stageAt(id, lvl){ const e = evoLevels(id); let s = 1; e.forEach(l => { if(lvl >= l) s++; }); return s; }
function mStage(m){ return stageAt(m.id, mLvl(m)); }
function mName(m){ return MON[m.id].names[mStage(m)-1]; }
function sprite(slug, side='f', cls=''){ return `<img class="px ${cls}" src="${asset(`assets/monsters/${slug}${side==='b'?'-back':''}.png`)}" alt="">`; }
function monImg(m, side='f', cls=''){ return sprite(MON[m.id].spr[mStage(m)-1], side, cls); }
function trImg(key, cls=''){ return `<img class="px ${cls}" src="${asset(`assets/trainers/${key}.png`)}" alt="">`; }
function itImg(key){ return `<img class="px" src="${asset(`assets/items/${key}.png`)}" alt="">`; }
function isle(k, w){ const ww = WORLDS[w].isles[k]; return ww ? Object.assign({}, VAKKEN[k], ww) : null; }
function slugStage(slug){ for(const m of MONSTERS){ const i = m.spr.indexOf(slug); if(i >= 0) return {id:m.id, stage:i+1}; } return {id:slug, stage:1}; }
