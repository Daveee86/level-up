/* =========================================================
   LESSEN TAAL
   Twee soorten lessen:
   1. Met een recept: L.push({ id, vak, g:[vanGroep, totGroep], titel, uitleg, vb, gen(groep){...} })
      gen() maakt elke keer een nieuwe vraag: { q, opts, ans, uitleg, vis?, big?, say?, sayAns?, tik? }
   2. Met een vaste lijst vragen: lesBank({ id, vak, g, titel, uitleg, vb, vragen:[ [vraag, goed, [fout, fout], uitleg], ... ] })
   Verander het id van een bestaande les niet: sterren van kinderen hangen eraan.
   ========================================================= */
const RIJM = [['huis','muis','luis'],['kat','mat','rat'],['boom','room','droom'],['bal','stal','wal'],['pan','kan','man'],['zon','ton','bon'],['roos','doos','poos'],['maan','baan','kraan'],['beer','veer','peer'],['neus','reus','keus'],['bed','net','pet']];
function suffix(a,b){ let i=0; while(i<a.length&&i<b.length&&a[a.length-1-i]===b[b.length-1-i]) i++; return a.slice(a.length-i); }
L.push({id:'t-rijm', vak:'taal', g:[3,3], titel:'Rijmen',
  uitleg:`Woorden rijmen als ze aan het eind hetzelfde klinken. Huis en muis rijmen: ze eindigen allebei op -uis.`,
  vb:`Wat rijmt op <b>kat</b>? Mat! (k-at, m-at)`,
  gen(){ let grp=pick(RIJM.filter(g=>g[0]!=='bed')); const [w,r]=shuffle(grp); const pool=RIJM.filter(g=>g!==grp).map(g=>g[0]);
    return {q:`Wat rijmt op "${w}"?`, say:`Wat rijmt op ${w}?`, opts:txtOpts(r,[r,...pool],3), ans:r, uitleg:`${w} en ${r} rijmen. Ze eindigen allebei op -${suffix(w,r)}.`}; }});
const LEESW = [['🐟','vis',['vos','vas']],['🐱','kat',['kam','mat']],['⚽','bal',['bel','bak']],['🌙','maan',['man','mos']],['🌳','boom',['room','bom']],['🐭','muis',['mus','huis']],['☀️','zon',['zin','ton']],['🧥','jas',['gas','jam']],['👃','neus',['reus','nek']],['🚪','deur',['duur','dier']],['🔥','vuur',['muur','vaar']],['🐻','beer',['boer','peer']],['🌹','roos',['doos','ros']]];
L.push({id:'t-woordlezen', vak:'taal', g:[3,3], titel:'Welk woord past bij het plaatje?',
  uitleg:`Lees elk woord letter voor letter en plak de klanken aan elkaar. Welk woord hoort bij het plaatje?`,
  vb:`🐟 → v-i-s → <b>vis</b>.`,
  gen(){ const [e,w,d]=pick(LEESW); return {q:'Welk woord hoort bij het plaatje?', vis:e, opts:shuffle([w,...d]), ans:w, big:true, uitleg:`Je ziet ${e}: dat is "${w}". Lees maar: ${w.split('').join(' - ')}.`}; }});
const EIIJ = [['trein','ei','🚆'],['klein','ei',''],['meisje','ei','👧'],['geit','ei','🐐'],['plein','ei',''],['zeil','ei','⛵'],['ijs','ij','🍦'],['lijm','ij',''],['prijs','ij','🏆'],['tijd','ij','⏰'],['vijf','ij','5️⃣'],['pijl','ij','🏹'],['bijl','ij','🪓'],['rijst','ij','🍚']];
L.push({id:'t-eiij', vak:'taal', g:[4,5], titel:'Ei of ij?',
  uitleg:`Ei en ij klinken precies hetzelfde. Welke je schrijft, moet je onthouden: het zijn <b>weetwoorden</b>. Kijk goed hoe het woord eruitziet en schrijf het een paar keer op.`,
  vb:`tr<b>ei</b>n met <b>ei</b>, <b>ij</b>s met <b>ij</b>.`,
  gen(){ const [w,x,e]=pick(EIIJ); const blank=w.replace(x,'<span class="gap">__</span>'); return {q:'Ei of ij?', vis:`${e?e+' ':''}<span class="sum">${blank}</span>`, opts:['ei','ij'], ans:x, big:true, uitleg:`Het is "${w}" met ${x}. Dit is een weetwoord: kijk er nog even goed naar.`}; }});
const AUOU = [['blauw','au','🔵'],['auto','au','🚗'],['saus','au','🥫'],['pauw','au','🦚'],['klauw','au',''],['kous','ou','🧦'],['goud','ou','🥇'],['hout','ou','🪵'],['touw','ou','🪢'],['oud','ou','👴'],['zout','ou','🧂'],['koud','ou','🥶']];
L.push({id:'t-auou', vak:'taal', g:[5,6], titel:'Au of ou?',
  uitleg:`Ook au en ou klinken hetzelfde. Het zijn weetwoorden. Een handig weetje: woorden die eindigen op -houd, -oud of -out schrijf je vaak met ou.`,
  vb:`bl<b>au</b>w, maar g<b>ou</b>d.`,
  gen(){ const [w,x,e]=pick(AUOU); const blank=w.replace(x,'<span class="gap">__</span>'); return {q:'Au of ou?', vis:`${e?e+' ':''}<span class="sum">${blank}</span>`, opts:['au','ou'], ans:x, big:true, uitleg:`Het is "${w}" met ${x}. Onthoud het als weetwoord.`}; }});
const WW = [['worden','word','boos'],['vinden','vind','een munt'],['rijden','rijd','naar school'],['houden','houd','van pizza'],['antwoorden','antwoord','snel'],['lopen','loop','naar huis'],['spelen','speel','buiten'],['werken','werk','hard'],['fietsen','fiets','naar oma']];
L.push({id:'t-dt', vak:'taal', g:[6,8], titel:'D, t of dt?',
  uitleg:`Zoek eerst de <b>stam</b>: het hele werkwoord min -en (worden → word). Bij <b>ik</b> schrijf je de stam. Bij <b>hij, zij</b> en <b>jij</b> komt er een t achter. Staat jij áchter het werkwoord? Dan geen t.`,
  vb:`ik <b>word</b> · hij <b>wordt</b> · jij <b>wordt</b> · <b>word</b> jij?`,
  gen(){ const [inf,stam,rest]=pick(WW); const p=pick(['ik','hij','zij','jij','vraag']); const met=stam+'t';
    const ans = (p==='ik'||p==='vraag') ? stam : met;
    const zin = p==='vraag' ? `<span class="gap">___</span> jij ${rest}?` : `${p[0].toUpperCase()+p.slice(1)} <span class="gap">___</span> ${rest}.`;
    const opts = stam.endsWith('d') ? [stam, stam.slice(0,-1)+'t', met] : [stam, met, stam+'d'];
    const u = {ik:`Bij "ik" schrijf je alleen de stam: ${stam}.`, hij:`Bij "hij": stam + t = ${met}.`, zij:`Bij "zij": stam + t = ${met}.`, jij:`"Jij" staat vóór het werkwoord: stam + t = ${met}.`, vraag:`"Jij" staat áchter het werkwoord, dus geen t: ${stam}.`}[p];
    return {q:`Vul in (${inf}):`, vis:`<span style="font-size:.6em;font-family:var(--f-display)">${zin}</span>`, opts:shuffle(opts), ans, big:true, uitleg:`De stam van ${inf} is ${stam}. ${u}`}; }});
const VT = [['werken','werk'],['spelen','speel'],['fietsen','fiets'],['bouwen','bouw'],['dansen','dans'],['maken','maak'],['horen','hoor'],['pakken','pak'],['koken','kook'],['huilen','huil'],['lachen','lach'],['stoppen','stop'],['wonen','woon'],['tekenen','teken'],['poetsen','poets'],['zagen','zaag']];
L.push({id:'t-vtt', vak:'taal', g:[7,8], titel:"Verleden tijd: 't kofschip",
  uitleg:`Zoek de stam (spelen → speel). Is de laatste letter een letter uit <b>'t kofschip</b> (t, k, f, s, ch, p)? Dan komt er <b>-te</b> achter. Anders <b>-de</b>.`,
  vb:`werk → k zit in 't kofschip → <b>werkte</b>. speel → l niet → <b>speelde</b>.`,
  gen(){ const [inf,stam]=pick(VT); const last = stam.endsWith('ch') ? 'ch' : stam.slice(-1); const kof = ['t','k','f','s','ch','p'].includes(last);
    const ans = stam+(kof?'te':'de'); const opts=[stam+'te', stam+'de', stam+'t'];
    return {q:`Gisteren ___ ik. (${inf})`, opts:shuffle(opts), ans, uitleg:`De stam is "${stam}". De laatste letter is ${last}. ${kof?"Die zit in 't kofschip, dus -te":"Die zit niet in 't kofschip, dus -de"}: ${ans}.`}; }});
const WS = [['De *hond* blaft hard.','zelfstandig naamwoord'],['Mijn zus *zwemt* elke week.','werkwoord'],['Wat een *mooie* tekening!','bijvoeglijk naamwoord'],['Het *boek* ligt op tafel.','zelfstandig naamwoord'],['Wij *eten* pannenkoeken.','werkwoord'],['De *grote* olifant drinkt water.','bijvoeglijk naamwoord'],['Opa *leest* de krant.','werkwoord'],['Ik heb een *rode* fiets.','bijvoeglijk naamwoord'],['De *juf* lacht.','zelfstandig naamwoord'],['Het water is *koud*.','bijvoeglijk naamwoord'],['Ze *rennen* naar het plein.','werkwoord'],['De *vogel* zingt.','zelfstandig naamwoord']];
L.push({id:'t-woordsoort', vak:'taal', g:[6,8], titel:'Woordsoorten',
  uitleg:`<b>Zelfstandig naamwoord</b>: je kunt er de, het of een voor zetten (de hond). <b>Werkwoord</b>: wat iemand doet of is (zwemt). <b>Bijvoeglijk naamwoord</b>: zegt hoe iets is (mooie, koud).`,
  vb:`De <b>rode</b> bal → "rode" zegt hoe de bal is: bijvoeglijk naamwoord.`,
  gen(){ const [s,a]=pick(WS); const w=s.match(/\*(.+?)\*/)[1]; const u={'zelfstandig naamwoord':`Je kunt "de" of "het" voor "${w}" zetten. Het is een zelfstandig naamwoord.`, 'werkwoord':`"${w}" is wat iemand doet. Het is een werkwoord.`, 'bijvoeglijk naamwoord':`"${w}" zegt hoe iets is. Het is een bijvoeglijk naamwoord.`}[a];
    return {q:'Wat voor woord is het dikgedrukte woord?', vis:`<span style="font-size:.55em;font-family:var(--f-display)">${s.replace(/\*(.+?)\*/,'<u>$1</u>')}</span>`, opts:['zelfstandig naamwoord','werkwoord','bijvoeglijk naamwoord'], ans:a, uitleg:u}; }});


/* ---- Extra taallessen ---- */
lesBank({id:"t-zinnetjes-3", vak:"taal", g:[3, 3], titel:"Korte zinnen begrijpen",
  uitleg:"Lees de zin rustig. Zoek wie iets doet, wat er gebeurt of waar iets is. Je mag de voorleesknop gebruiken.",
  vb:"De kat zit op de mat. Waar zit de kat? Op de mat.",
  vragen:[
    ["De hond rent in het park. Wie rent?", "De hond", ["Het park", "De kat"], "In de zin staat dat de hond rent."],
    ["Lina eet een appel. Wat eet Lina?", "Een appel", ["Een peer", "Een koek"], "Lina eet een appel."],
    ["De bal ligt onder de stoel. Waar ligt de bal?", "Onder de stoel", ["Op de stoel", "In de kast"], "Het woord onder vertelt waar de bal ligt."],
    ["Sam leest een boek. Wat doet Sam?", "Lezen", ["Tekenen", "Slapen"], "Sam leest, dus hij is aan het lezen."],
    ["De vis zwemt in de kom. Wie zwemt?", "De vis", ["De kom", "De hond"], "De vis is het dier dat zwemt."],
    ["Noor pakt haar jas. Wat pakt Noor?", "Haar jas", ["Haar fiets", "Haar tas"], "Noor pakt haar jas."],
    ["De poes slaapt op de bank. Waar slaapt de poes?", "Op de bank", ["Onder de tafel", "In de boom"], "Op de bank vertelt waar de poes slaapt."],
    ["Ties geeft de plant water. Wat krijgt water?", "De plant", ["Het boek", "De stoel"], "Ties geeft water aan de plant."],
  ]});
lesBank({id:"t-meervoud-4", vak:"taal", g:[4, 4], titel:"Eén en meer: meervouden",
  uitleg:"Een meervoud vertelt dat het om meer dan één gaat. Veel woorden krijgen en. Soms verandert de spelling: kat wordt katten en boom wordt bomen. Een korte klank krijgt vaak een dubbele medeklinker; een lange klank schrijf je in een open lettergreep met één klinker.",
  vb:"Eén kat, twee katten. Eén boom, twee bomen.",
  vragen:[
    ["Wat is het meervoud van kat?", "katten", ["katen", "katens"], "Eén kat, twee katten. Luister naar de klanken en kijk naar de spelling."],
    ["Wat is het meervoud van boom?", "bomen", ["boomen", "bomem"], "Eén boom, twee bomen. Luister naar de klanken en kijk naar de spelling."],
    ["Wat is het meervoud van vis?", "vissen", ["visen", "visens"], "Eén vis, twee vissen. Luister naar de klanken en kijk naar de spelling."],
    ["Wat is het meervoud van huis?", "huizen", ["huisen", "huizzen"], "Eén huis, twee huizen. Luister naar de klanken en kijk naar de spelling."],
    ["Wat is het meervoud van raam?", "ramen", ["raamen", "rammen"], "Eén raam, twee ramen. Luister naar de klanken en kijk naar de spelling."],
    ["Wat is het meervoud van boek?", "boeken", ["boekken", "boeke"], "Eén boek, twee boeken. Luister naar de klanken en kijk naar de spelling."],
    ["Wat is het meervoud van kip?", "kippen", ["kipen", "kippens"], "Eén kip, twee kippen. Luister naar de klanken en kijk naar de spelling."],
    ["Wat is het meervoud van deur?", "deuren", ["deurren", "deure"], "Eén deur, twee deuren. Luister naar de klanken en kijk naar de spelling."],
    ["Wat is het meervoud van tas?", "tassen", ["tasen", "tassens"], "Eén tas, twee tassen. Luister naar de klanken en kijk naar de spelling."],
    ["Wat is het meervoud van stoel?", "stoelen", ["stoellen", "stoele"], "Eén stoel, twee stoelen. Luister naar de klanken en kijk naar de spelling."],
  ]});
lesBank({id:"t-samenstelling-5", vak:"taal", g:[5, 5], titel:"Woorden aan elkaar",
  uitleg:"Een samenstelling bestaat uit twee of meer woorden. Je schrijft het nieuwe woord aan elkaar. Soms komen er tussenletters bij: zon en bril worden zonnebril. Leer de voorbeelden ook als hele woorden.",
  vb:"Regen + jas = regenjas. Hand + doek = handdoek.",
  vragen:[
    ["Welk samengesteld woord past bij voet en bal?", "voetbal", ["voet bal", "voedbal"], "Je schrijft voetbal aan elkaar. Kijk ook goed naar eventuele tussenletters."],
    ["Welk samengesteld woord past bij regen en jas?", "regenjas", ["regen jas", "reegenjas"], "Je schrijft regenjas aan elkaar. Kijk ook goed naar eventuele tussenletters."],
    ["Welk samengesteld woord past bij school en plein?", "schoolplein", ["school plein", "schoolplijn"], "Je schrijft schoolplein aan elkaar. Kijk ook goed naar eventuele tussenletters."],
    ["Welk samengesteld woord past bij tand en arts?", "tandarts", ["tand arts", "tantarts"], "Je schrijft tandarts aan elkaar. Kijk ook goed naar eventuele tussenletters."],
    ["Welk samengesteld woord past bij fiets en bel?", "fietsbel", ["fiets bel", "fietzbel"], "Je schrijft fietsbel aan elkaar. Kijk ook goed naar eventuele tussenletters."],
    ["Welk samengesteld woord past bij boek en kast?", "boekenkast", ["boek kast", "boekekast"], "Je schrijft boekenkast aan elkaar. Kijk ook goed naar eventuele tussenletters."],
    ["Welk samengesteld woord past bij zon en bril?", "zonnebril", ["zon bril", "zonnenbril"], "Je schrijft zonnebril aan elkaar. Kijk ook goed naar eventuele tussenletters."],
    ["Welk samengesteld woord past bij pannen en koek?", "pannenkoek", ["pannen koek", "pannekoek"], "Je schrijft pannenkoek aan elkaar. Kijk ook goed naar eventuele tussenletters."],
    ["Welk samengesteld woord past bij slaap en kamer?", "slaapkamer", ["slaap kamer", "slapkamer"], "Je schrijft slaapkamer aan elkaar. Kijk ook goed naar eventuele tussenletters."],
    ["Welk samengesteld woord past bij hand en doek?", "handdoek", ["hand doek", "handoek"], "Je schrijft handdoek aan elkaar. Kijk ook goed naar eventuele tussenletters."],
    ["Welk samengesteld woord past bij speel en tuin?", "speeltuin", ["speel tuin", "speeltuyn"], "Je schrijft speeltuin aan elkaar. Kijk ook goed naar eventuele tussenletters."],
    ["Welk samengesteld woord past bij water en fles?", "waterfles", ["water fles", "waaterfles"], "Je schrijft waterfles aan elkaar. Kijk ook goed naar eventuele tussenletters."],
  ]});
lesBank({id:"t-onderwerp-6", vak:"taal", g:[6, 6], titel:"Het onderwerp van een zin",
  uitleg:"Het onderwerp vertelt wie of wat iets doet of is. Zoek eerst de persoonsvorm. Vraag dan wie of wat plus die persoonsvorm. Het onderwerp staat niet altijd aan het begin.",
  vb:"In de tuin speelt Noor. Wie speelt? Noor: dat is het onderwerp.",
  vragen:[
    ["Wat is het onderwerp in: De hond blaft hard.", "De hond", ["blaft", "hard"], "Vraag wie of wat de handeling doet. Het onderwerp is: De hond."],
    ["Wat is het onderwerp in: Mijn zus leest een boek.", "Mijn zus", ["leest", "een boek"], "Vraag wie of wat de handeling doet. Het onderwerp is: Mijn zus."],
    ["Wat is het onderwerp in: De kinderen spelen buiten.", "De kinderen", ["spelen", "buiten"], "Vraag wie of wat de handeling doet. Het onderwerp is: De kinderen."],
    ["Wat is het onderwerp in: In de tuin groeit een boom.", "een boom", ["In de tuin", "groeit"], "Vraag wie of wat de handeling doet. Het onderwerp is: een boom."],
    ["Wat is het onderwerp in: Morgen komt onze buurman.", "onze buurman", ["Morgen", "komt"], "Vraag wie of wat de handeling doet. Het onderwerp is: onze buurman."],
    ["Wat is het onderwerp in: Op het plein fietst Noor.", "Noor", ["Op het plein", "fietst"], "Vraag wie of wat de handeling doet. Het onderwerp is: Noor."],
    ["Wat is het onderwerp in: Wij bakken brood.", "Wij", ["bakken", "brood"], "Vraag wie of wat de handeling doet. Het onderwerp is: Wij."],
    ["Wat is het onderwerp in: De rode bus stopt hier.", "De rode bus", ["stopt", "hier"], "Vraag wie of wat de handeling doet. Het onderwerp is: De rode bus."],
    ["Wat is het onderwerp in: Achter het huis slapen twee katten.", "twee katten", ["Achter het huis", "slapen"], "Vraag wie of wat de handeling doet. Het onderwerp is: twee katten."],
    ["Wat is het onderwerp in: Oma en opa wandelen samen.", "Oma en opa", ["wandelen", "samen"], "Vraag wie of wat de handeling doet. Het onderwerp is: Oma en opa."],
    ["Wat is het onderwerp in: Ik schrijf een brief.", "Ik", ["schrijf", "een brief"], "Vraag wie of wat de handeling doet. Het onderwerp is: Ik."],
    ["Wat is het onderwerp in: Een kleine vogel bouwt een nest.", "Een kleine vogel", ["bouwt", "een nest"], "Vraag wie of wat de handeling doet. Het onderwerp is: Een kleine vogel."],
  ]});
lesBank({id:"t-hoofdgedachte-7", vak:"taal", g:[7, 7], titel:"De hoofdgedachte vinden",
  uitleg:"De hoofdgedachte is het belangrijkste dat een tekst over het onderwerp zegt. Lees de hele tekst. Kies de zin die de kern samenvat; een los detail is meestal niet genoeg.",
  vb:"Een tekst over schoon drinkwater voor vogels heeft als kern: zo help je vogels aan water.",
  vragen:[
    ["Welke hoofdgedachte past bij deze tekst? Bij warm weer drinken vogels uit een ondiep schaaltje. Ververs het water elke dag en maak het schaaltje schoon.", "Zo geef je vogels schoon drinkwater.", ["Vogels drinken nooit water.", "Schaaltjes zijn altijd diep."], "De hoofdgedachte vat het belangrijkste van de hele tekst samen: Zo geef je vogels schoon drinkwater."],
    ["Welke hoofdgedachte past bij deze tekst? De bibliotheek heeft boeken, luisterboeken en activiteiten. Je kunt er lezen, leren en andere mensen ontmoeten.", "De bibliotheek biedt meer dan alleen boeken.", ["De bibliotheek verkoopt alleen fietsen.", "Alle boeken zijn hetzelfde."], "De hoofdgedachte vat het belangrijkste van de hele tekst samen: De bibliotheek biedt meer dan alleen boeken."],
    ["Welke hoofdgedachte past bij deze tekst? Een egel zoekt in de herfst een beschutte plek. Daar kan hij in winterslaap gaan.", "Een egel bereidt zich voor op de winter.", ["Egels houden altijd een zomerslaap.", "Alle dieren slapen de hele herfst."], "De hoofdgedachte vat het belangrijkste van de hele tekst samen: Een egel bereidt zich voor op de winter."],
    ["Welke hoofdgedachte past bij deze tekst? Op veel daken liggen zonnepanelen. Die zetten zonlicht om in elektrische energie.", "Zonnepanelen maken elektriciteit uit zonlicht.", ["Zonnepanelen maken regen.", "Daken bestaan alleen uit glas."], "De hoofdgedachte vat het belangrijkste van de hele tekst samen: Zonnepanelen maken elektriciteit uit zonlicht."],
    ["Welke hoofdgedachte past bij deze tekst? Op het schoolplein kwamen meer bomen. Ze geven schaduw en bieden dieren een plek.", "Bomen verbeteren het schoolplein op meerdere manieren.", ["Bomen geven geen schaduw.", "Elk schoolplein is een bos."], "De hoofdgedachte vat het belangrijkste van de hele tekst samen: Bomen verbeteren het schoolplein op meerdere manieren."],
    ["Welke hoofdgedachte past bij deze tekst? Fiets je in het donker? Met licht voor en achter ben je beter zichtbaar voor anderen.", "Fietsverlichting helpt je zichtbaar te zijn.", ["Zonder licht zie je er altijd beter uit.", "Fietsen kan alleen overdag."], "De hoofdgedachte vat het belangrijkste van de hele tekst samen: Fietsverlichting helpt je zichtbaar te zijn."],
    ["Welke hoofdgedachte past bij deze tekst? Plastic afval kan in rivieren terechtkomen. Dieren kunnen erin verstrikt raken. Ruim afval daarom op.", "Plastic afval kan dieren schaden.", ["Rivieren bestaan uit plastic.", "Dieren hebben plastic nodig om te zwemmen."], "De hoofdgedachte vat het belangrijkste van de hele tekst samen: Plastic afval kan dieren schaden."],
    ["Welke hoofdgedachte past bij deze tekst? In een museum worden oude voorwerpen bewaard. Onderzoekers bestuderen ze om over vroeger te leren.", "Museumvoorwerpen helpen ons het verleden te onderzoeken.", ["Alle museumvoorwerpen zijn nieuw.", "Onderzoekers mogen nooit iets bekijken."], "De hoofdgedachte vat het belangrijkste van de hele tekst samen: Museumvoorwerpen helpen ons het verleden te onderzoeken."],
    ["Welke hoofdgedachte past bij deze tekst? Planten groeien naar het licht. Met hun bladeren gebruiken ze licht om voedingsstoffen te maken.", "Licht is belangrijk voor planten.", ["Planten hebben alleen stenen nodig.", "Bladeren zijn altijd blauw."], "De hoofdgedachte vat het belangrijkste van de hele tekst samen: Licht is belangrijk voor planten."],
    ["Welke hoofdgedachte past bij deze tekst? Een trein kan veel reizigers tegelijk vervoeren. Stations verbinden steden en dorpen.", "Treinen verbinden plaatsen en vervoeren veel mensen.", ["Treinen rijden zonder route overal heen.", "Stations zijn alleen winkels."], "De hoofdgedachte vat het belangrijkste van de hele tekst samen: Treinen verbinden plaatsen en vervoeren veel mensen."],
    ["Welke hoofdgedachte past bij deze tekst? Bij een proefje verander je liefst één ding tegelijk. Dan kun je beter onderzoeken waardoor een verschil ontstaat.", "Eén verandering tegelijk helpt een proefje eerlijk te vergelijken.", ["Verander altijd alles tegelijk.", "Bij proefjes hoef je nooit te kijken."], "De hoofdgedachte vat het belangrijkste van de hele tekst samen: Eén verandering tegelijk helpt een proefje eerlijk te vergelijken."],
    ["Welke hoofdgedachte past bij deze tekst? Een verhaal kan vanuit verschillende personen verteld worden. Daardoor lees je verschillende gedachten en ervaringen.", "Het vertelperspectief beïnvloedt wat je te weten komt.", ["Elke verteller weet altijd alles.", "Alle verhalen hebben precies dezelfde verteller."], "De hoofdgedachte vat het belangrijkste van de hele tekst samen: Het vertelperspectief beïnvloedt wat je te weten komt."],
  ]});
lesBank({id:"t-verbanden-8", vak:"taal", g:[8, 8], titel:"Verbindingswoorden en tekstverbanden",
  uitleg:"Verbindingswoorden leggen een verband tussen zinnen. Want en omdat geven een reden; dus een gevolg; maar en hoewel een tegenstelling; zodat een doel. Voordat en nadat geven volgorde aan. Kijk ook of de woordvolgorde klopt.",
  vb:"Het regent, maar we gaan toch wandelen: een tegenstelling.",
  vragen:[
    ["Welk verbindingswoord past? Ik neem een jas mee, ... het wordt koud.", "want", ["maar", "of"], "Want geeft een reden."],
    ["Welk verbindingswoord past? Het regent, ... we spelen toch buiten.", "maar", ["want", "omdat"], "Maar geeft een tegenstelling."],
    ["Welk verbindingswoord past? Je kunt tekenen ... een boek lezen.", "of", ["omdat", "dus"], "Of geeft een keuze."],
    ["Welk verbindingswoord past? De brug is dicht, ... we nemen een andere route.", "dus", ["want", "hoewel"], "Dus leidt hier een gevolg in."],
    ["Welk verbindingswoord past? ... ik moe ben, ga ik slapen.", "Omdat", ["Maar", "Dus"], "Omdat leidt een reden in; let op de woordvolgorde."],
    ["Welk verbindingswoord past? ... het koud is, draagt hij geen jas.", "Hoewel", ["Dus", "Of"], "Hoewel geeft een tegenstelling met wat je verwacht."],
    ["Welk verbindingswoord past? Was je handen ... je gaat eten.", "voordat", ["omdat", "want"], "Voordat geeft aan wat eerder gebeurt."],
    ["Welk verbindingswoord past? ... je klaar bent, mag je naar buiten.", "Als", ["Want", "Maar"], "Als geeft hier een voorwaarde."],
    ["Welk verbindingswoord past? Ik lees ... mijn broer tekent.", "terwijl", ["dus", "want"], "Terwijl verbindt dingen die tegelijk gebeuren."],
    ["Welk verbindingswoord past? We vertrekken ... iedereen klaar is.", "zodra", ["want", "maar"], "Zodra betekent meteen op het moment dat."],
    ["Welk verbindingswoord past? Ik zet een wekker, ... ik op tijd wakker word.", "zodat", ["hoewel", "of"], "Zodat geeft een doel aan."],
    ["Welk verbindingswoord past? ... we hadden gegeten, ruimden we op.", "Nadat", ["Voordat", "Terwijl"], "Nadat geeft aan dat het eten al voorbij was."],
  ]});
