/* =========================================================
   LES-EDITOR EN RESERVEKOPIE (ouderscherm)
   
   ========================================================= */
/* ---------------- Eigen lessen (les-editor voor ouders) ----------------
   Opgeslagen in S.custom. Elke eigen les wordt een gewone les in L, met custom:true.
   Eigen lessen tellen niet mee voor het openen van de eilandmeester. */
const VAK_NAAM = {rekenen:'Rekenen', taal:'Taal', engels:'Engels', topo:'Topografie', geschiedenis:'Geschiedenis', ruimte:'Ruimte'};
if(!S.custom) S.custom = [];
function customToLesson(c){
  const qs = c.vragen.filter(v=>v.q.trim() && v.a.trim());
  const allAns = [...new Set(qs.map(v=>v.a.trim()))];
  return {id:c.id, vak:c.vak, g:[c.g0, c.g1], titel:c.titel, custom:true,
    uitleg: esc(c.uitleg||'Lees de vraag goed en kies het juiste antwoord.').replace(/\n/g,'<br>'),
    vb: c.vb ? esc(c.vb) : (qs[0] ? `${esc(qs[0].q)} → <b>${esc(qs[0].a)}</b>` : ''),
    gen(groep){
      const v = pick(qs); const ans = v.a.trim(); const n = 4;
      let wrong = (v.f||'').split(',').map(s=>s.trim()).filter(s=>s && s!==ans);
      const pool = allAns.filter(a=>a!==ans && !wrong.includes(a));
      wrong = wrong.concat(shuffle(pool)).slice(0, n-1);
      if(wrong.length < n-1 && /^-?\d+$/.test(ans)) wrong = wrong.concat(numOpts(+ans, n+2, 5).filter(o=>o!==ans && !wrong.includes(o))).slice(0, n-1);
      return {q:esc(v.q.trim()), opts:shuffle([ans, ...wrong]).map(String), ans, say:v.q.trim(),
        big: ans.length<=4 && wrong.every(w=>String(w).length<=4),
        uitleg: v.u ? esc(v.u) : `Het goede antwoord is: ${esc(ans)}.`};
    }};
}
function registerCustom(){
  for(let i=L.length-1;i>=0;i--) if(L[i].custom) L.splice(i,1);
  S.custom.forEach(c => { try{ if(c.g0<3) c.g0=3; if(c.g1<3) c.g1=3; L.push(customToLesson(c)); }catch(e){} });
}
registerCustom();
function blankLesson(){ return {id:'', titel:'', vak:'taal', g0:4, g1:4, uitleg:'', vb:'', vragen:[{q:'',a:'',f:'',u:''},{q:'',a:'',f:'',u:''},{q:'',a:'',f:'',u:''}]}; }

function vEditor(){
  const e = view.ed; const ok = e.vragen.filter(v=>v.q.trim()&&v.a.trim()).length;
  const fld = 'font:inherit;padding:8px 10px;border-radius:10px;border:2px solid var(--line);background:var(--card);color:var(--ink);width:100%';
  return `<div class="wrap"><button class="back" data-act="edback">← Terug naar ouders</button>
    <h1 style="font-size:34px;margin-bottom:12px">${e.id?'Les aanpassen':'Nieuwe les'}</h1>
    <div class="steps" style="max-width:760px">
      <div class="panel" style="display:grid;gap:10px">
        <label class="label" for="ed-titel">Titel van de les</label><input id="ed-titel" data-ed="titel" value="${esc(e.titel)}" placeholder="Bijv. Woordjes Engels hoofdstuk 3" style="${fld}">
        <div class="row">
          <div style="display:grid;gap:4px"><label class="label" for="ed-vak">Vak (eiland)</label><select id="ed-vak" data-ed="vak">${Object.entries(VAK_NAAM).map(([k,n])=>`<option value="${k}" ${e.vak===k?'selected':''}>${n}</option>`).join('')}</select></div>
          <div style="display:grid;gap:4px"><label class="label" for="ed-g0">Vanaf groep</label><select id="ed-g0" data-ed="g0">${GROEPEN.map(g=>`<option ${g===e.g0?'selected':''}>${g}</option>`).join('')}</select></div>
          <div style="display:grid;gap:4px"><label class="label" for="ed-g1">Tot en met groep</label><select id="ed-g1" data-ed="g1">${GROEPEN.map(g=>`<option ${g===e.g1?'selected':''}>${g}</option>`).join('')}</select></div>
        </div>
        ${(e.vak==='engels'||e.vak==='topo')&&e.g0<5?`<p class="muted" style="margin:0;font-size:14px">Let op: ${VAK_NAAM[e.vak]} gaat pas open vanaf groep 5. Kies Taal of Rekenen voor jongere kinderen.</p>`:''}
        <label class="label" for="ed-uitleg">Uitleg (wat het kind eerst leest)</label><textarea id="ed-uitleg" data-ed="uitleg" rows="3" style="${fld}" placeholder="Bijv. Leer deze woordjes. Zeg ze hardop als je ze oefent.">${esc(e.uitleg)}</textarea>
        <label class="label" for="ed-vb">Voorbeeld (mag leeg, dan pakken we de eerste vraag)</label><input id="ed-vb" data-ed="vb" value="${esc(e.vb)}" style="${fld}">
      </div>
      <div class="panel" style="display:grid;gap:10px">
        <div class="label">Snel invoeren</div>
        <p class="muted" style="margin:0;font-size:14px">Plak een lijstje, één vraag per regel: <b>vraag = antwoord</b>. Bijvoorbeeld <i>de hond = dog</i> of <i>7 × 8 = 56</i>.</p>
        <textarea id="ed-bulk" rows="4" style="${fld}" placeholder="de hond = dog&#10;de kat = cat&#10;het huis = house"></textarea>
        <div><button class="btn ghost" data-act="edbulk">Toevoegen aan de vragen</button></div>
      </div>
      <div class="panel" style="display:grid;gap:12px">
        <div class="label">Vragen (${ok} ingevuld, minimaal 3)</div>
        <p class="muted" style="margin:0;font-size:14px">Foute antwoorden mag je leeg laten: dan kiezen we ze uit de andere antwoorden van deze les.</p>
        ${e.vragen.map((v,i)=>`<div style="display:grid;gap:6px;padding:10px;border:2px solid var(--line);border-radius:14px">
          <div class="row" style="justify-content:space-between"><b>Vraag ${i+1}</b><button class="speak" data-act="edrow-del" data-i="${i}">Verwijderen</button></div>
          <input data-row="${i}" data-col="q" value="${esc(v.q)}" placeholder="Vraag, bijv. Hoe zeg je 'de hond' in het Engels?" aria-label="Vraag ${i+1}" style="${fld}">
          <div class="row" style="flex-wrap:wrap"><input data-row="${i}" data-col="a" value="${esc(v.a)}" placeholder="Goed antwoord" aria-label="Goed antwoord ${i+1}" style="${fld};flex:1 1 160px;width:auto">
            <input data-row="${i}" data-col="f" value="${esc(v.f)}" placeholder="Foute antwoorden, met komma's (mag leeg)" aria-label="Foute antwoorden ${i+1}" style="${fld};flex:2 1 220px;width:auto"></div>
          <input data-row="${i}" data-col="u" value="${esc(v.u)}" placeholder="Uitleg na het antwoord (mag leeg)" aria-label="Uitleg ${i+1}" style="${fld}">
        </div>`).join('')}
        <div><button class="btn ghost" data-act="edrow-add">+ Vraag toevoegen</button></div>
      </div>
      <div>${view.msg?`<p style="color:var(--bad);font-weight:600">${view.msg}</p>`:''}<div class="row"><button class="btn sun" data-act="edsave">Les opslaan</button><button class="btn ghost" data-act="edback">Annuleren</button></div></div>
    </div></div>`;
}
function customListHtml(){
  return `<div class="panel" style="display:grid;gap:10px;margin-top:18px">
    <div class="row" style="justify-content:space-between"><h2 style="font-size:24px">Eigen lessen</h2><button class="btn" data-act="ednew">+ Nieuwe les</button></div>
    <p class="muted" style="margin:0;font-size:14px">Maak zelf een les, bijvoorbeeld voor huiswerk. De les verschijnt op het gekozen eiland voor de gekozen groepen, met een gevecht erbij. Eigen lessen worden bewaard op dit apparaat.</p>
    ${S.custom.length ? S.custom.map(c=>`<div class="irow" style="grid-template-columns:minmax(0,1fr) auto"><div><b>${esc(c.titel)}</b><span class="muted" style="font-size:14px">${VAK_NAAM[c.vak]} · groep ${c.g0===c.g1?c.g0:c.g0+'–'+c.g1} · ${c.vragen.length} vragen</span></div>
      <div class="row"><button class="chip" data-act="ededit" data-id="${c.id}">Aanpassen</button><button class="chip" data-act="eddel" data-id="${c.id}">Verwijderen</button></div></div>
      ${view.cdel===c.id?`<div class="confirm">Les "${esc(c.titel)}" verwijderen? <div class="row" style="margin-top:8px"><button class="btn danger" data-act="eddelok" data-id="${c.id}">Ja, verwijderen</button><button class="btn ghost" data-act="eddelno">Nee</button></div></div>`:''}`).join('') : '<p class="muted" style="margin:0">Nog geen eigen lessen.</p>'}
    <details><summary class="muted" style="cursor:pointer">Lessen naar een ander apparaat overzetten</summary>
      <div style="display:grid;gap:8px;margin-top:10px">
        <p class="muted" style="margin:0;font-size:14px">Kopieer deze code op dit apparaat en plak hem op het andere apparaat in het vak hieronder. Je kunt de code ook naar Claude sturen om de lessen vast in de site te zetten.</p>
        <textarea id="ex-code" rows="3" readonly style="font:13px monospace;padding:8px;border-radius:10px;border:2px solid var(--line);background:var(--soft);color:var(--ink);width:100%">${esc(JSON.stringify(S.custom))}</textarea>
        <div class="row"><button class="chip" data-act="excopy">Kopiëren</button>${view.cmsg?`<span class="muted" style="font-size:14px">${view.cmsg}</span>`:''}</div>
        <textarea id="im-code" rows="3" placeholder="Plak hier een code van een ander apparaat" style="font:13px monospace;padding:8px;border-radius:10px;border:2px solid var(--line);background:var(--card);color:var(--ink);width:100%"></textarea>
        <div><button class="chip" data-act="import">Lessen toevoegen</button></div>
      </div></details>
  </div>`;
}
function edCollect(){
  const e = view.ed; if(!e) return;
  document.querySelectorAll('[data-ed]').forEach(x=>{ const k=x.dataset.ed; e[k] = (k==='g0'||k==='g1') ? +x.value : x.value; });
  document.querySelectorAll('[data-row]').forEach(x=>{ const r=e.vragen[+x.dataset.row]; if(r) r[x.dataset.col]=x.value; });
}
function edAction(a, d){
  if(bkAction(a)) return true;
  if(a==='ednew'){ go({s:'editor', ok:true, ed:blankLesson()}); return true; }
  if(a==='ededit'){ const c=S.custom.find(x=>x.id===d.id); if(c) go({s:'editor', ok:true, ed:JSON.parse(JSON.stringify(c))}); return true; }
  if(a==='eddel'){ view.cdel=d.id; render(); return true; }
  if(a==='eddelno'){ view.cdel=null; render(); return true; }
  if(a==='eddelok'){ S.custom=S.custom.filter(x=>x.id!==d.id); save(); registerCustom(); view.cdel=null; render(); return true; }
  if(a==='excopy'){ const t=document.getElementById('ex-code'); const txt=t?t.value:''; const done=m=>{ view.cmsg=m; render(); };
    try{ navigator.clipboard.writeText(txt).then(()=>done('Gekopieerd!'), ()=>{ t.select(); done('Selecteer en kopieer de code met Ctrl+C.'); }); }catch(e){ t&&t.select(); done('Selecteer en kopieer de code met Ctrl+C.'); } return true; }
  if(a==='import'){ const raw=(document.getElementById('im-code')||{}).value||''; let n=0;
    try{ const arr=JSON.parse(raw); (Array.isArray(arr)?arr:[]).forEach(c=>{ if(c&&c.titel&&Array.isArray(c.vragen)&&VAK_NAAM[c.vak]){ c.id='c'+Date.now()+R(0,9999); S.custom.push(c); n++; } }); }catch(e){}
    if(n){ save(); registerCustom(); } view.cmsg = n ? `${n} les${n===1?'':'sen'} toegevoegd.` : 'Die code klopt niet. Kopieer hem nog eens helemaal.'; render(); return true; }
  if(view.s!=='editor') return false;
  edCollect(); const e = view.ed;
  if(a==='edback'){ go({s:'ouders', ok:true}); return true; }
  if(a==='edrow-add'){ e.vragen.push({q:'',a:'',f:'',u:''}); render(); return true; }
  if(a==='edrow-del'){ e.vragen.splice(+d.i,1); if(!e.vragen.length) e.vragen.push({q:'',a:'',f:'',u:''}); render(); return true; }
  if(a==='edbulk'){ const raw=(document.getElementById('ed-bulk')||{}).value||''; const rows=raw.split('\n').map(l=>l.split('=')).filter(p=>p.length>=2 && p[0].trim() && p.slice(1).join('=').trim()).map(p=>({q:p[0].trim(), a:p.slice(1).join('=').trim(), f:'', u:''}));
    e.vragen = e.vragen.filter(v=>v.q.trim()||v.a.trim()).concat(rows); if(!e.vragen.length) e.vragen=[{q:'',a:'',f:'',u:''}]; view.msg = rows.length?'':'Geen regels gevonden met "vraag = antwoord".'; render(); return true; }
  if(a==='edsave'){
    if(!e.titel.trim()){ view.msg='Geef de les een titel.'; render(); return true; }
    if(e.g1 < e.g0){ const t=e.g0; e.g0=e.g1; e.g1=t; }
    e.vragen = e.vragen.filter(v=>v.q.trim()&&v.a.trim());
    if(e.vragen.length<3){ view.msg='Vul minstens 3 vragen in, met een goed antwoord.'; if(!e.vragen.length) e.vragen=[{q:'',a:'',f:'',u:''}]; render(); return true; }
    if(!e.id){ e.id='c'+Date.now(); S.custom.push(e); } else { const i=S.custom.findIndex(x=>x.id===e.id); if(i>=0) S.custom[i]=e; else S.custom.push(e); }
    save(); registerCustom(); go({s:'ouders', ok:true}); return true; }
  return false;
}

/* ---------------- Reservekopie (back-up) ---------------- */
function backupHtml(){
  return `<div class="panel" style="display:grid;gap:10px;margin-top:18px">
    <h2 style="font-size:24px">Reservekopie</h2>
    <p class="muted" style="margin:0;font-size:14px">Bewaar alle spelers, monsters, munten, badges en eigen lessen van dit apparaat. Maak af en toe een kopie, bijvoorbeeld voordat je de browsergeschiedenis wist of een ander apparaat gaat gebruiken.</p>
    <div class="row"><button class="btn" data-act="bkdown">Back-up downloaden</button><button class="btn ghost" data-act="bkcopy">Back-up als code kopiëren</button></div>
    <label class="label" for="bk-file">Back-up terugzetten</label>
    <div class="row"><input id="bk-file" type="file" accept=".json,application/json,text/plain" style="font:inherit;max-width:100%"></div>
    <textarea id="bk-code" rows="3" placeholder="…of plak hier een back-up-code" style="font:13px monospace;padding:8px;border-radius:10px;border:2px solid var(--line);background:var(--card);color:var(--ink);width:100%"></textarea>
    <div><button class="btn ghost" data-act="bkload">Back-up controleren</button></div>
    ${view.bk?`<div class="confirm">Deze back-up bevat ${view.bk.profiles.length} speler(s) en ${(view.bk.custom||[]).length} eigen les(sen). Terugzetten vervangt alles wat nu op dit apparaat staat. <div class="row" style="margin-top:8px"><button class="btn danger" data-act="bkok">Ja, terugzetten</button><button class="btn ghost" data-act="bkno">Annuleren</button></div></div>`:''}
    ${view.bkmsg?`<p style="margin:0;font-weight:600">${view.bkmsg}</p>`:''}
  </div>`;
}
function backupJson(){ return JSON.stringify({app:'level-up', versie:4, gemaakt:new Date().toISOString(), data:S}); }
function parseBackup(txt){ try{ const o=JSON.parse(txt); const data = o && o.data ? o.data : o; if(data && Array.isArray(data.profiles)) return data; }catch(e){} return null; }
function bkAction(a){
  if(a==='bkdown'){ try{ const blob=new Blob([backupJson()],{type:'application/json'}); const u=URL.createObjectURL(blob); const x=document.createElement('a'); x.href=u; x.download=`level-up-backup-${new Date().toISOString().slice(0,10)}.json`; document.body.appendChild(x); x.click(); x.remove(); setTimeout(()=>URL.revokeObjectURL(u),2000); view.bkmsg='Back-up gedownload. Werkt dat hier niet? Gebruik dan "als code kopiëren".'; }catch(e){ view.bkmsg='Downloaden lukt hier niet. Gebruik "als code kopiëren".'; } render(); return true; }
  if(a==='bkcopy'){ const txt=backupJson(); const done=m=>{ view.bkmsg=m; render(); }; try{ navigator.clipboard.writeText(txt).then(()=>done('Back-up-code gekopieerd. Plak hem in een notitie of mail aan jezelf.'), ()=>{ const t=document.getElementById('bk-code'); if(t){ t.value=txt; t.select(); } view.bkmsg='Kopieer de geselecteerde code met Ctrl+C.'; }); }catch(e){ const t=document.getElementById('bk-code'); if(t){ t.value=txt; t.select(); } view.bkmsg='Kopieer de geselecteerde code met Ctrl+C.'; } return true; }
  if(a==='bkload'){ const f=document.getElementById('bk-file'); const txt=(document.getElementById('bk-code')||{}).value||'';
    const use = t => { const d=parseBackup(t); view.bk=d; view.bkmsg = d ? '' : 'Dit is geen geldige Level-UP back-up.'; render(); };
    if(f && f.files && f.files[0]){ const r=new FileReader(); r.onload=()=>use(String(r.result)); r.readAsText(f.files[0]); } else use(txt); return true; }
  if(a==='bkno'){ view.bk=null; render(); return true; }
  if(a==='bkok'){ if(view.bk){ S=view.bk; if(!S.custom) S.custom=[]; save(); registerCustom(); me=null; view.bk=null; view.bkmsg='Back-up teruggezet.'; } render(); return true; }
  return false;
}
