/* =========================================================
   LESSEN TOPOGRAFIE
   Twee soorten lessen:
   1. Met een recept: L.push({ id, vak, g:[vanGroep, totGroep], titel, uitleg, vb, gen(groep){...} })
      gen() maakt elke keer een nieuwe vraag: { q, opts, ans, uitleg, vis?, big?, say?, sayAns?, tik? }
   2. Met een vaste lijst vragen: lesBank({ id, vak, g, titel, uitleg, vb, vragen:[ [vraag, goed, [fout, fout], uitleg], ... ] })
   Verander het id van een bestaande les niet: sterren van kinderen hangen eraan.
   ========================================================= */
/* ---- Topografie: provincies van Nederland ----
   Kaart: Natural Earth (publiek domein), vereenvoudigd. */
const PROV = Object.keys(NL.p);
const HOOFDSTAD = {'Groningen':'Groningen','Friesland':'Leeuwarden','Drenthe':'Assen','Overijssel':'Zwolle','Flevoland':'Lelystad','Gelderland':'Arnhem','Utrecht':'Utrecht','Noord-Holland':'Haarlem','Zuid-Holland':'Den Haag','Zeeland':'Middelburg','Noord-Brabant':"'s-Hertogenbosch",'Limburg':'Maastricht'};
const WAAR = {'Groningen':'helemaal in het noordoosten','Friesland':'in het noorden, met de meeste Waddeneilanden','Drenthe':'in het noordoosten, onder Groningen','Overijssel':'in het oosten, tegen Duitsland aan','Flevoland':'midden in het water: het is drooggemaakt land in het IJsselmeer','Gelderland':'in het midden-oosten, de grootste provincie','Utrecht':'precies in het midden van het land','Noord-Holland':'in het westen, boven Zuid-Holland, met Amsterdam','Zuid-Holland':'in het westen aan zee, met Rotterdam en Den Haag','Zeeland':'in het zuidwesten: eilanden en schiereilanden','Noord-Brabant':'in het zuiden, tegen België aan','Limburg':'het lange, smalle stuk in het zuidoosten'};
function topoMap(o={}){
  const fill = n => o.res ? (n===o.res.ans?'ok':n===o.res.picked?'no':'') : (o.hl===n?'hl':'');
  const paths = PROV.map(n=>`<path class="pv ${fill(n)} ${o.click?'click':''}" d="${NL.p[n]}" ${o.click?`data-act="ans" data-o="${n}" role="button" aria-label="${n}"`:''}><title>${o.labels||o.res?n:''}</title></path>`).join('');
  const lbl = o.labels ? PROV.map(n=>`<text x="${NL.lbl[n][0]}" y="${NL.lbl[n][1]}">${n}</text>`).join('') : '';
  const dots = (o.dots||[]).map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" class="dot"/><circle cx="${x}" cy="${y}" r="10" class="ring"/>`).join('');
  return `<svg class="nlmap" viewBox="0 0 ${NL.w} ${Math.ceil(NL.h)}" xmlns="http://www.w3.org/2000/svg"><rect class="sea" width="${NL.w}" height="${Math.ceil(NL.h)}"/>${paths}<path class="lake" d="${NL.lake}"/>${lbl}${dots}</svg>`;
}
const otherProv = (ans, n) => shuffle(PROV.filter(x=>x!==ans)).slice(0, n-1);
const TOPO_UITLEG = `<div style="max-width:340px;margin:12px 0">${topoMap({labels:true})}</div>`;
L.push({id:'topo-naam', vak:'topo', g:[5,8], titel:'De 12 provincies',
  uitleg:`Nederland heeft <b>12 provincies</b>. Leer ze per stukje: eerst de drie in het noorden (Groningen, Friesland, Drenthe), dan het westen (Noord-Holland, Zuid-Holland, Zeeland), het midden (Utrecht, Flevoland, Gelderland, Overijssel) en het zuiden (Noord-Brabant, Limburg).${TOPO_UITLEG}`,
  vb:`Het lange, smalle stuk helemaal onderaan is <b>Limburg</b>.`,
  gen(){ const a=pick(PROV); return {q:'Welke provincie is gekleurd?', vis:`<div style="max-width:320px">${topoMap({hl:a})}</div>`, opts:shuffle([a,...otherProv(a,4)]), ans:a, uitleg:`Dat is ${a}. Die ligt ${WAAR[a]}.`}; }});
L.push({id:'topo-tik', vak:'topo', g:[5,8], titel:'Tik op de provincie',
  uitleg:`Nu draaien we het om: jij krijgt een naam en tikt de provincie aan op de kaart. Kijk eerst nog even goed naar de kaart hieronder.${TOPO_UITLEG}`,
  vb:`"Tik op Utrecht" → je tikt op de kleine provincie precies in het midden.`,
  gen(){ const a=pick(PROV); return {q:`Tik op ${a}`, say:`Tik op ${a}`, tik:true, opts:PROV.slice(), ans:a, uitleg:`${a} ligt ${WAAR[a]}. Op de kaart is hij nu groen.`}; }});
L.push({id:'topo-hoofdstad', vak:'topo', g:[6,8], titel:'Hoofdsteden van de provincies',
  uitleg:`Elke provincie heeft een hoofdstad. Daar zit het provinciehuis. Let op: de hoofdstad is niet altijd de grootste stad! Amsterdam ligt in Noord-Holland, maar de hoofdstad is Haarlem. Rotterdam ligt in Zuid-Holland, maar de hoofdstad is Den Haag.<div class="vb" style="margin-top:12px">${PROV.map(p=>`${p}: <b>${HOOFDSTAD[p]}</b>`).join(' · ')}</div>`,
  vb:`De hoofdstad van Gelderland is <b>Arnhem</b>.`,
  gen(){ const a=pick(PROV); const c=HOOFDSTAD[a]; const others=shuffle(PROV.filter(x=>x!==a).map(x=>HOOFDSTAD[x])).slice(0,3);
    return {q:`Wat is de hoofdstad van ${a}?`, vis:`<div style="max-width:280px">${topoMap({hl:a})}</div>`, opts:shuffle([c,...others]), ans:c, uitleg:`De hoofdstad van ${a} is ${c}.${a==='Noord-Holland'?' Amsterdam is groter, maar Haarlem is de hoofdstad van de provincie.':a==='Zuid-Holland'?' Rotterdam is groter, maar Den Haag is de hoofdstad van de provincie.':''}`}; }});
L.push({id:'topo-stad', vak:'topo', g:[7,8], titel:'In welke provincie ligt deze stad?',
  uitleg:`Op de kaart zie je een stip. Kijk in welke provincie die stip valt. Weet je het niet? Denk aan de richting: noord, oost, zuid of west.${TOPO_UITLEG}`,
  vb:`Eindhoven ligt in het zuiden, in <b>Noord-Brabant</b>.`,
  gen(){ const [s,[x,y,pv]] = pick(Object.entries(NL.city)); return {q:`In welke provincie ligt ${s}?`, vis:`<div style="max-width:300px">${topoMap({dots:[[x,y]]})}</div>`, opts:shuffle([pv,...otherProv(pv,4)]), ans:pv, uitleg:`${s} ligt in ${pv}. Die provincie ligt ${WAAR[pv]}.`}; }});
