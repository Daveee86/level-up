/* =========================================================
   LESSEN ENGELS
   Twee soorten lessen:
   1. Met een recept: L.push({ id, vak, g:[vanGroep, totGroep], titel, uitleg, vb, gen(groep){...} })
      gen() maakt elke keer een nieuwe vraag: { q, opts, ans, uitleg, vis?, big?, say?, sayAns?, tik? }
   2. Met een vaste lijst vragen: lesBank({ id, vak, g, titel, uitleg, vb, vragen:[ [vraag, goed, [fout, fout], uitleg], ... ] })
   Verander het id van een bestaande les niet: sterren van kinderen hangen eraan.
   ========================================================= */
const DIER_EN = [['🐶','dog','hond'],['🐱','cat','kat'],['🐴','horse','paard'],['🐦','bird','vogel'],['🐟','fish','vis'],['🐮','cow','koe'],['🐷','pig','varken'],['🐰','rabbit','konijn'],['🐭','mouse','muis'],['🐻','bear','beer'],['🐸','frog','kikker'],['🦆','duck','eend'],['🐘','elephant','olifant'],['🦁','lion','leeuw'],['🐵','monkey','aap'],['🐑','sheep','schaap'],['🐔','chicken','kip'],['🐍','snake','slang'],['🐯','tiger','tijger'],['🐢','turtle','schildpad'],['🐝','bee','bij'],['🕷️','spider','spin'],['🦉','owl','uil'],['🐐','goat','geit'],['🦊','fox','vos']];
L.push({id:'e-dieren', vak:'engels', g:[5,6], titel:'Animals: dieren',
  uitleg:`Veel Engelse woorden lijken een beetje op Nederlandse: fish lijkt op vis, mouse op muis. Andere moet je leren, zoals dog (hond).`,
  vb:`🐶 = <b>dog</b> · 🐱 = <b>cat</b>`,
  gen(){ const [e,en,n]=pick(DIER_EN); return {q:'Hoe zeg je dit in het Engels?', vis:e, opts:txtOpts(en,DIER_EN.map(x=>x[1]),4), ans:en, sayAns:en, uitleg:`${e} is "${en}" in het Engels (in het Nederlands: ${n}).`}; }});
const KLEUR_EN = [['#e53935','red','rood'],['#1e63d6','blue','blauw'],['#2e9e4f','green','groen'],['#ffd23f','yellow','geel'],['#222','black','zwart'],['#ffffff','white','wit'],['#ff8a1f','orange','oranje'],['#7d3cc8','purple','paars'],['#ff7fb4','pink','roze'],['#8a5a2b','brown','bruin'],['#9aa3ab','grey','grijs']];
L.push({id:'e-kleuren', vak:'engels', g:[5,6], titel:'Colours: kleuren',
  uitleg:`Leer de kleuren door ze om je heen te zoeken. Wat is red in jouw kamer? En blue?`,
  vb:`rood = <b>red</b> · geel = <b>yellow</b>`,
  gen(){ const [c,en,n]=pick(KLEUR_EN); return {q:'Welke kleur is dit in het Engels?', vis:`<svg width="90" height="90" viewBox="0 0 90 90"><circle cx="45" cy="45" r="40" fill="${c}" stroke="#cbe0ec" stroke-width="4"/></svg>`, opts:txtOpts(en,KLEUR_EN.map(x=>x[1]),4), ans:en, sayAns:en, uitleg:`Dit is ${n}. In het Engels: "${en}".`}; }});
const NUM_EN = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
L.push({id:'e-getallen', vak:'engels', g:[5,7], titel:'Numbers 1 tot 20',
  uitleg:`Van 13 tot en met 19 eindigen de getallen op <b>-teen</b>: thirteen, fourteen, fifteen… Let op: 11 en 12 zijn anders (eleven, twelve).`,
  vb:`15 = <b>fifteen</b> · 12 = <b>twelve</b>`,
  gen(){ const n=R(1,20); const near=[...new Set([n-1,n+1,n+10,n-10,n+2].filter(v=>v>0&&v<=20))]; const opts=shuffle([n,...shuffle(near).slice(0,3)]).map(v=>NUM_EN[v]);
    return {q:`Hoe schrijf je ${n} in het Engels?`, opts, ans:NUM_EN[n], sayAns:NUM_EN[n], uitleg:`${n} = "${NUM_EN[n]}".${n>=13&&n<=19?' Het eindigt op -teen.':''}`}; }});
const ZIN_EN = [['Ik heet Sam.','My name is Sam.'],['Hoe gaat het?','How are you?'],['Ik ben tien jaar.','I am ten years old.'],['Waar woon je?','Where do you live?'],['Ik hou van voetbal.','I like football.'],['Dank je wel!','Thank you!'],['Tot ziens!','Goodbye!'],['Ik heb een hond.','I have a dog.'],['Wat is je lievelingskleur?','What is your favourite colour?'],['Het regent.','It is raining.'],['Hoe oud ben je?','How old are you?'],['Ik woon in Nederland.','I live in the Netherlands.'],['Mag ik een glas water?','Can I have a glass of water?'],['Ik heb honger.','I am hungry.'],['Ik ben moe.','I am tired.'],['Goedemorgen!','Good morning!'],['Hoe laat is het?','What time is it?'],['Ik begrijp het niet.','I don\'t understand.'],['Kun je me helpen?','Can you help me?'],['Ik heb een broer.','I have a brother.'],['Het is koud vandaag.','It is cold today.'],['Waar is de wc?','Where is the toilet?'],['Ik speel graag buiten.','I like playing outside.'],['Sorry, ik ben te laat.','Sorry, I am late.'],['Welkom!','Welcome!'],['Wat is jouw naam?','What is your name?'],['Ik ga naar school.','I go to school.'],['Fijn weekend!','Have a nice weekend!']];
L.push({id:'e-zinnen', vak:'engels', g:[7,8], titel:'Hoe zeg je…?',
  uitleg:`Je vertaalt een zin niet woord voor woord. Kijk wat de zin betekent en kies wat een Engelsman zou zeggen.`,
  vb:`"Ik heet Sam." = <b>My name is Sam.</b> (letterlijk: mijn naam is Sam)`,
  gen(){ const [n,en]=pick(ZIN_EN); return {q:`Hoe zeg je "${n}" in het Engels?`, opts:txtOpts(en,ZIN_EN.map(x=>x[1]),3), ans:en, sayAns:en, uitleg:`"${n}" is in het Engels: "${en}".`}; }});


/* Twee extra Engelse woordenschatlessen, alleen vanaf groep 5. */
for(const [id,g,titel,rows] of [
 ['e-school-extra',[5,6],'At school: in de klas',[['book','boek'],['chair','stoel'],['table','tafel'],['pencil','potlood'],['pen','pen'],['teacher','leerkracht'],['school','school'],['door','deur'],['window','raam'],['bag','tas'],['ruler','liniaal'],['paper','papier'],['eraser','gum'],['scissors','schaar'],['glue','lijm'],['classroom','klaslokaal'],['board','schoolbord'],['notebook','schrift'],['lesson','les'],['homework','huiswerk'],['pupil','leerling'],['break','pauze'],['clock','klok'],['desk','bureau']]],
 ['e-tegenstellingen-extra',[7,8],'Opposites: tegenstellingen',[['big','small'],['hot','cold'],['old','new'],['fast','slow'],['happy','sad'],['open','closed'],['day','night'],['up','down'],['long','short'],['early','late'],['clean','dirty'],['near','far'],['rich','poor'],['heavy','light'],['full','empty'],['strong','weak'],['loud','quiet'],['wet','dry'],['young','old'],['easy','difficult'],['cheap','expensive'],['inside','outside'],['thick','thin'],['first','last']]]
]){L.push({id,vak:'engels',g,titel,nieuw:true,uitleg:id==='e-school-extra'?'Leer Engelse woorden voor spullen en mensen in de klas. '+rows.map(([a,b])=>`${a} = ${b}`).join('; '):'Leer woorden met een tegengestelde betekenis. '+rows.map(([a,b])=>`${a} ↔ ${b}`).join('; '),vb:rows[0].join(' → '),gen(){const [a,b]=pick(rows),opts=txtOpts(b,rows.map(r=>r[1]),4);return {q:id==='e-school-extra'?`Wat betekent ${a}?`:`Wat is het tegenovergestelde van ${a}?`,opts,ans:b,uitleg:`${a} → ${b}.`,say:a,sayAns:id==='e-school-extra'?a:b};}});}
