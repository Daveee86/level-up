/* =========================================================
   LESSEN: basis
   Alle lessen komen in de lijst L. De lesbestanden staan in de map lessen/.
   ========================================================= */
const L = [];

/* Een les met een vaste lijst vragen. Elke vraag: [vraag, goed antwoord, [foute antwoorden], uitleg]. */
function lesBank(b){
  // Alleen de korte uitleg. De uitleg per vraag krijgt het kind na elk antwoord te zien.
  L.push({id:b.id, vak:b.vak, g:b.g, titel:b.titel, nieuw:true,
    uitleg:`<p>${esc(b.uitleg)}</p>${b.extra==='planeten'?planetOverview():''}`,
    vb:esc(b.vb),
    gen(){ const r = pick(b.vragen); const opts = shuffle([r[1], ...r[2]]);
      return {q:r[0], opts, ans:r[1], uitleg:r[3], say:r[0]+(b.g[1]<=3?' Kies uit: '+opts.join('. '):''), big:false}; }
  });
}
function planetOverview(){const ps=[['Mercurius','#aaa49a'],['Venus','#d9ad64'],['Aarde','#298ac6'],['Mars','#c6603b'],['Jupiter','#d2ae88'],['Saturnus','#d7c17e'],['Uranus','#79cbd2'],['Neptunus','#4267cf']];return `<div class="planet-grid" aria-label="Planeten op volgorde vanaf de zon">${ps.map(([name,color],i)=>`<div><span style="background:${color}" aria-hidden="true"></span><small>${i+1}. ${name}</small></div>`).join('')}</div><p class="muted" style="font-size:13px">Vanaf de zon op volgorde. Groottes en afstanden zijn niet op schaal.</p>`;}
