/* =========================================================
   LESSEN REKENEN
   Twee soorten lessen:
   1. Met een recept: L.push({ id, vak, g:[vanGroep, totGroep], titel, uitleg, vb, gen(groep){...} })
      gen() maakt elke keer een nieuwe vraag: { q, opts, ans, uitleg, vis?, big?, say?, sayAns?, tik? }
   2. Met een vaste lijst vragen: lesBank({ id, vak, g, titel, uitleg, vb, vragen:[ [vraag, goed, [fout, fout], uitleg], ... ] })
   Verander het id van een bestaande les niet: sterren van kinderen hangen eraan.
   ========================================================= */
const NAMEN = {'🍎':'appels','🐞':'lieveheersbeestjes','⭐':'sterren','🐟':'vissen','🎈':'ballonnen','🦆':'eendjes'};
function countSeq(n){ return Array.from({length:n},(_,i)=>i+1).join(', '); }
function grouped(emo, n){ let s=''; for(let i=0;i<n;i+=5){ s += `<span class="grp">${emo.repeat(Math.min(5,n-i))}</span>`; } return s; }


L.push({id:'r-tellen10', vak:'rekenen', g:[3,3], titel:'Tellen tot 10 met groepjes',
  uitleg:`Grote groepjes tel je slim: zie je een groepje van 5? Dan hoef je dat niet te tellen. Je zegt "vijf" en telt verder: zes, zeven, acht…`,
  vb:`⭐⭐⭐⭐⭐ ⭐⭐ → vijf… zes, zeven. Het zijn er <b>7</b>.`,
  gen(){ const n=R(5,10), e=pick(Object.keys(NAMEN)); return {q:`Hoeveel ${NAMEN[e]} zie je?`, say:`Hoeveel ${NAMEN[e]} zie je?`, vis:grouped(e,n), opts:numOpts(n,3,2,1), ans:String(n), big:true, uitleg:`Eerst een groepje van 5. Dan tel je verder: ${Array.from({length:n-5},(_,i)=>i+6).join(', ') || 'klaar'}. Het zijn er ${n}.`}; }});
L.push({id:'r-plus10', vak:'rekenen', g:[3,3], titel:'Plussommen tot 10',
  uitleg:`Bij een plussom komt er iets bij. Begin bij het grootste getal en tel de rest erbij op.`,
  vb:`2 + 6: begin bij 6 en tel 2 verder: 7, 8. Dus 2 + 6 = <b>8</b>.`,
  gen(){ const a=R(1,9), b=R(1,10-a); const hi=Math.max(a,b), lo=Math.min(a,b); return {q:`Hoeveel is dit?`, vis:`<span class="sum">${a} + ${b} = <span class="gap">?</span></span>`, say:`${a} plus ${b}`, opts:numOpts(a+b,4,2,0), ans:String(a+b), big:true, uitleg:`Begin bij ${hi} en tel ${lo} verder: ${Array.from({length:lo},(_,i)=>hi+i+1).join(', ')}. Dus ${a} + ${b} = ${a+b}.`}; }});
L.push({id:'r-tot20', vak:'rekenen', g:[3,4], titel:'Plus en min tot 20',
  uitleg:`Gaat je som over de 10 heen? Spring dan eerst naar 10, en daarna de rest.`,
  vb:`8 + 5: eerst 2 erbij → 10, dan nog 3 → <b>13</b>.<br>13 − 5: eerst 3 eraf → 10, dan nog 2 → <b>8</b>.`,
  gen(){ if(Math.random()<.5){ const a=R(3,9), b=R(11-a,10); const s=a+b; const step=10-a;
      return {q:'Hoeveel is dit?', vis:`<span class="sum">${a} + ${b} = <span class="gap">?</span></span>`, say:`${a} plus ${b}`, opts:numOpts(s,4,2), ans:String(s), big:true, uitleg:`${a} + ${b}: eerst ${step} erbij om bij 10 te komen, dan nog ${b-step}. Dat is ${s}.`}; }
    const a=R(11,18), b=R(a-9,9); const d=a-b; const step=a-10;
    return {q:'Hoeveel is dit?', vis:`<span class="sum">${a} − ${b} = <span class="gap">?</span></span>`, say:`${a} min ${b}`, opts:numOpts(d,4,2), ans:String(d), big:true, uitleg: b>step ? `${a} − ${b}: eerst ${step} eraf naar 10, dan nog ${b-step} eraf. Dat is ${d}.` : `${a} − ${b} = ${d}. Je blijft boven de 10: ${a-10+0} eenheden min ${b}.`}; }});
L.push({id:'r-tot100', vak:'rekenen', g:[4,5], titel:'Sommen tot 100',
  uitleg:`Splits het tweede getal in tientallen en eenheden. Doe eerst de tientallen, dan de eenheden. Dit heet <b>rijgen</b>.`,
  vb:`34 + 28: 34 + 20 = 54, dan 54 + 8 = <b>62</b>.`,
  gen(){ if(Math.random()<.5){ const a=R(11,69), b=R(11,99-a); const t=Math.floor(b/10)*10, e=b%10, s=a+b;
      return {q:'Hoeveel is dit?', vis:`<span class="sum">${a} + ${b} = <span class="gap">?</span></span>`, opts:numOpts(s,4,11), ans:String(s), big:true, uitleg:`${a} + ${t} = ${a+t}, dan ${a+t} + ${e} = ${s}.`}; }
    const a=R(30,99), b=R(11,a-5); const t=Math.floor(b/10)*10, e=b%10, d=a-b;
    return {q:'Hoeveel is dit?', vis:`<span class="sum">${a} − ${b} = <span class="gap">?</span></span>`, opts:numOpts(d,4,11), ans:String(d), big:true, uitleg:`${a} − ${t} = ${a-t}, dan ${a-t} − ${e} = ${d}.`}; }});
L.push({id:'r-tafels-klein', vak:'rekenen', g:[4,4], titel:'Tafels van 1, 2, 5 en 10',
  uitleg:`De tafel van 10: zet er een 0 achter. De tafel van 5 is de helft van de tafel van 10. De tafel van 2 is het dubbele.`,
  vb:`6 × 10 = 60. Dus 6 × 5 = de helft van 60 = <b>30</b>.`,
  gen(){ const t=pick([1,2,5,10]), x=R(1,10), p=x*t; const tips={1:`Keer 1 blijft hetzelfde: ${x} × 1 = ${p}.`, 2:`Keer 2 is het dubbele: ${x} + ${x} = ${p}.`, 5:`${x} × 10 = ${x*10}. De helft daarvan is ${p}.`, 10:`Keer 10: zet een 0 achter ${x}. Dat is ${p}.`};
    return {q:'Hoeveel is dit?', vis:`<span class="sum">${x} × ${t} = <span class="gap">?</span></span>`, opts:numOpts(p,4,t>2?t:3,0), ans:String(p), big:true, uitleg:tips[t]}; }});
L.push({id:'r-tafels', vak:'rekenen', g:[5,6], titel:'Alle tafels',
  uitleg:`Weet je een som niet uit je hoofd? Gebruik een som die je wel weet. 5 × en 10 × zijn makkelijk, daar kun je vanaf.`,
  vb:`7 × 6: 5 × 6 = 30, en 2 × 6 = 12. Samen <b>42</b>.`,
  gen(){ const t=R(2,10), x=R(2,10), p=x*t; let u;
    if(x===9) u=`10 × ${t} = ${10*t}, min één keer ${t}: ${10*t} − ${t} = ${p}.`;
    else if(x>5) u=`5 × ${t} = ${5*t}, plus ${x-5} × ${t} = ${(x-5)*t}. Samen ${p}.`;
    else u=`${x} keer ${t}: ${Array.from({length:x},(_,i)=>(i+1)*t).join(', ')}. Dus ${p}.`;
    return {q:'Hoeveel is dit?', vis:`<span class="sum">${x} × ${t} = <span class="gap">?</span></span>`, opts:shuffle([...new Set([p,p+t,p-t,p+x,(x+1)*(t-1)].filter(v=>v>0))].slice(0,4)).map(String), ans:String(p), big:true, uitleg:u}; }});
L.push({id:'r-delen', vak:'rekenen', g:[5,6], titel:'Deelsommen',
  uitleg:`Delen is het omgekeerde van keer. Vraag jezelf: hoe vaak past het kleine getal in het grote getal? Denk aan de tafel.`,
  vb:`24 : 6 = ? Denk: ? × 6 = 24. Dat is 4 × 6. Dus 24 : 6 = <b>4</b>.`,
  gen(){ const t=R(2,10), x=R(2,10), p=x*t; return {q:'Hoeveel is dit?', vis:`<span class="sum">${p} : ${t} = <span class="gap">?</span></span>`, opts:numOpts(x,4,2,1), ans:String(x), big:true, uitleg:`Denk aan de tafel van ${t}: ${x} × ${t} = ${p}, dus ${p} : ${t} = ${x}.`}; }});
L.push({id:'r-keer-groot', vak:'rekenen', g:[6,7], titel:'Keersommen met grote getallen',
  uitleg:`Splits het grote getal in tientallen en eenheden. Doe ze allebei keer, en tel de uitkomsten op.`,
  vb:`23 × 4 = 20 × 4 + 3 × 4 = 80 + 12 = <b>92</b>.`,
  gen(){ let a=R(12,49); if(a%10===0) a++; const b=R(3,9), t=Math.floor(a/10)*10, e=a%10, p=a*b;
    return {q:'Hoeveel is dit?', vis:`<span class="sum">${a} × ${b} = <span class="gap">?</span></span>`, opts:shuffle([...new Set([p, t*b+e, p+b, p-10, p+10])].slice(0,4)).map(String), ans:String(p), big:true, uitleg:`${a} × ${b} = ${t} × ${b} + ${e} × ${b} = ${t*b} + ${e*b} = ${p}.`}; }});
L.push({id:'r-breuk', vak:'rekenen', g:[6,7], titel:'Breuken van een getal',
  uitleg:`1/4 van 20 betekent: verdeel 20 in 4 gelijke stukken en neem er één. Bij 3/4 neem je er drie.`,
  vb:`3/4 van 20: 20 : 4 = 5, en 3 × 5 = <b>15</b>.`,
  gen(groep){ const d=pick([2,3,4,5,10]), m=R(2,10), n=d*m; const k = (groep>=7 || Math.random()<.4) && d>2 ? R(1,d-1) : 1; const ans=k*m;
    return {q:`Wat is ${k}/${d} van ${n}?`, opts:numOpts(ans,4,Math.max(3,m),1), ans:String(ans), big:true,
      uitleg: k===1 ? `Verdeel ${n} in ${d} gelijke stukken: ${n} : ${d} = ${m}.` : `Eén stuk: ${n} : ${d} = ${m}. Je neemt er ${k}: ${k} × ${m} = ${ans}.`}; }});
L.push({id:'r-komma', vak:'rekenen', g:[7,8], titel:'Kommagetallen optellen',
  uitleg:`Zet de komma's onder elkaar. Tel de hele getallen bij elkaar en de tienden bij elkaar. Tien tienden is weer 1 heel.`,
  vb:`2,7 + 1,5: 2 + 1 = 3 en 0,7 + 0,5 = 1,2. Samen <b>4,2</b>.`,
  gen(){ const A=R(11,95), B=R(11,95), S=A+B; const f=v=>nl((v/10).toFixed(1)); const opts=[...new Set([S,S+1,S-1,S+10,S-9].filter(v=>v>0))].slice(0,4);
    return {q:'Hoeveel is dit?', vis:`<span class="sum">${f(A)} + ${f(B)} = <span class="gap">?</span></span>`, opts:shuffle(opts).map(f), ans:f(S), big:true,
      uitleg:`Hele getallen: ${Math.floor(A/10)} + ${Math.floor(B/10)} = ${Math.floor(A/10)+Math.floor(B/10)}. Tienden: 0,${A%10} + 0,${B%10} = ${f(A%10+B%10)}. Samen ${f(S)}.`}; }});
L.push({id:'r-procent', vak:'rekenen', g:[7,8], titel:'Procenten',
  uitleg:`Procent betekent "van de honderd". Handige weetjes: 50% is de helft, 25% is een kwart, 10% is delen door 10.`,
  vb:`25% van 80: een kwart van 80 = 80 : 4 = <b>20</b>.`,
  gen(){ const p=pick([10,20,25,50,75]); let n; if(p===10||p===20) n=10*R(2,30); else if(p===50) n=2*R(5,50); else n=4*R(3,25); const ans=n*p/100;
    const tip={10:`10% is delen door 10: ${n} : 10 = ${ans}.`, 20:`10% van ${n} is ${n/10}. 20% is twee keer zoveel: ${ans}.`, 25:`25% is een kwart: ${n} : 4 = ${ans}.`, 50:`50% is de helft: ${n} : 2 = ${ans}.`, 75:`25% is ${n/4}. 75% is drie keer zoveel: ${ans}.`};
    return {q:`Wat is ${p}% van ${n}?`, opts:numOpts(ans,4,Math.max(4,Math.round(ans/3)),0), ans:String(ans), big:true, uitleg:tip[p]}; }});
L.push({id:'r-verhouding', vak:'rekenen', g:[8,8], titel:'Verhoudingen',
  uitleg:`Bij een verhouding horen twee getallen bij elkaar. Maak je het ene getal 3 keer zo groot, dan wordt het andere ook 3 keer zo groot.`,
  vb:`4 pannenkoeken → 2 eieren. 12 pannenkoeken is 3 × zoveel, dus 3 × 2 = <b>6</b> eieren.`,
  gen(){ const f=R(2,5); const T=[
      ()=>{const a=pick([4,6,8]), b=pick([1,2,3]); return {q:`Voor ${a} pannenkoeken heb je ${b} eieren nodig. Hoeveel eieren heb je nodig voor ${a*f} pannenkoeken?`, ans:b*f, u:`${a*f} is ${f} keer ${a}. Dus ook ${f} × ${b} eieren = ${b*f}.`};},
      ()=>{const w=pick([4,5,6]); return {q:`Limonade maak je met 1 deel siroop op ${w} delen water. Je gebruikt ${f} delen siroop. Hoeveel delen water?`, ans:w*f, u:`${f} keer zoveel siroop, dus ${f} × ${w} = ${w*f} delen water.`};},
      ()=>{const k=pick([2,5,10]); return {q:`Op de kaart is 1 cm in het echt ${k} km. Twee dorpen liggen ${f+3} cm uit elkaar. Hoe ver is dat echt?`, ans:k*(f+3), u:`${f+3} × ${k} km = ${k*(f+3)} km.`, unit:' km'};},
    ]; const t=pick(T)(); return {q:t.q, opts:numOpts(t.ans,4,Math.max(3,Math.round(t.ans/3)),1).map(v=>v+(t.unit||'')), ans:t.ans+(t.unit||''), uitleg:t.u}; }});


/* ---- Extra rekenlessen (één per groep) ---- */
function rekenLes(g,id,titel,uitleg,vb,gen){ L.push({id, vak:'rekenen', g:[g,g], titel, uitleg, vb, gen, nieuw:true}); }
rekenLes(3,'r-min10-3','Er gaat iets af: min tot 10','Bij een minsom haal je iets weg. Begin bij het eerste getal en tel terug.','8 − 3: tel terug 7, 6, 5. Het antwoord is 5.',()=>{
  const a=R(2,10),b=R(1,a),ans=a-b;return {q:'Hoeveel blijven er over?',vis:`${a} − ${b} = ?`,opts:numOpts(ans,3,3,0),ans:String(ans),uitleg:`Van ${a} haal je ${b} weg. Er blijven ${ans} over.`,big:true,say:`Je hebt ${a}. Je haalt er ${b} af. Hoeveel blijven er over?`};
});
rekenLes(4,'r-tientallen-4','Tientallen en eenheden','Een tiental is 10. In 47 zitten 4 tientallen en 7 eenheden. Het cijfer op de linkerplek telt dus voor tientallen.','3 tientallen en 6 eenheden vormen 36.',()=>{
  const t=R(1,9),e=R(0,9),ans=t*10+e;return {q:`Welk getal heeft ${t} tientallen en ${e} eenheden?`,opts:numOpts(ans,4,15,10),ans:String(ans),uitleg:`${t} × 10 + ${e} = ${ans}.`,say:`Welk getal heeft ${t} tientallen en ${e} eenheden?`};
});
rekenLes(5,'r-kwartieren-5','Klokkijken: kwartieren','Een uur heeft 60 minuten. Een kwartier is 15 minuten, een halfuur 30 minuten en drie kwartier 45 minuten. Tel minuten erbij; bij 60 begint een nieuw uur.','14:45 plus een kwartier is 15:00.',()=>{
  const h=R(8,19),m=pick([0,15,30,45]),d=pick([15,30,45]),total=h*60+m+d;
  const fmt=n=>`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
  const ans=fmt(total),opts=shuffle([ans,fmt(total+15),fmt(total-15),fmt(total+60)]);
  return {q:`Het is ${fmt(h*60+m)}. Hoe laat is het ${d} minuten later?`,opts,ans,uitleg:`Tel ${d} minuten op. Na 60 minuten begint een nieuw uur. Het wordt ${ans}.`,say:`Het is ${h} uur en ${m} minuten. Hoe laat is het ${d} minuten later?`};
});
rekenLes(6,'r-maten-6','Meters en centimeters','1 meter is 100 centimeter. Van meters naar centimeters vermenigvuldig je met 100. Omgekeerd deel je door 100. Gebruik een komma voor delen van een meter.','2,5 meter = 250 centimeter.',()=>{
  const cm=R(1,60)*10, toCm=Math.random()<.5,ans=toCm?String(cm):nl(cm/100),pool=toCm?numOpts(cm,4,30,0):shuffle([ans,nl((cm+10)/100),nl((cm+100)/100),nl(cm/10)]);
  return {q:toCm?`Hoeveel centimeter is ${nl(cm/100)} meter?`:`Hoeveel meter is ${cm} centimeter?`,opts:pool,ans,uitleg:toCm?`${nl(cm/100)} × 100 = ${cm} cm.`:`${cm} ÷ 100 = ${nl(cm/100)} meter.`,say:toCm?`Hoeveel centimeter is ${nl(cm/100)} meter?`:`Hoeveel meter is ${cm} centimeter?`};
});
rekenLes(7,'r-gelijkebreuk-7','Gelijkwaardige breuken','Breuken blijven even groot als je teller en noemer met hetzelfde getal vermenigvuldigt. Je kunt ook beide delen door hetzelfde getal. Alleen de teller veranderen maakt de breuk meestal anders.','1/2 = 2/4 = 3/6.',()=>{
  const d=R(2,10),n=R(1,d-1),k=R(2,6),ans=`${n*k}/${d*k}`;
  return {q:`Welke breuk is even groot als ${n}/${d}?`,opts:shuffle([ans,`${n*k+1}/${d*k}`,`${n*k}/${d*k+1}`,`${n}/${d*k}`]),ans,uitleg:`Vermenigvuldig teller en noemer met ${k}: ${n}/${d} = ${ans}.`,say:`Welke breuk is even groot als ${n} gedeeld door ${d}?`};
});
rekenLes(8,'r-korting-8','Rekenen met korting','Korting gaat van de oude prijs af. Bereken eerst het kortingsbedrag. Trek dat daarna van de prijs af. Bij 25% korting betaal je nog 75% van de oude prijs.','€ 80 met 25% korting: € 20 eraf, dus je betaalt € 60.',()=>{
  const price=R(2,20)*20,pct=pick([10,20,25,50]),discount=price*pct/100,ans=price-discount;
  return {q:`Een jas kost € ${price}. Je krijgt ${pct}% korting. Wat betaal je?`,opts:numOpts(ans,4,15,0).map(x=>'€ '+x),ans:'€ '+ans,uitleg:`${pct}% van € ${price} is € ${discount}. € ${price} − € ${discount} = € ${ans}.`,say:`Een jas kost ${price} euro. Je krijgt ${pct} procent korting. Wat betaal je?`};
});
