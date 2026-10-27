/* =========================================================
   DRANKJES EN ITEMS (winkel)
   icon  = assets/items/<icon>.png
   lvl   = trainer-level dat nodig is om het te kopen
   waar  = 'gevecht' (te gebruiken tijdens een gevecht) of 'team' (in je team-scherm)
   De werking zelf staat in js/gevecht.js en js/team.js.
   ========================================================= */
const ITEMS = [
  {id:'xp', naam:'XP-drankje', icon:'xp', prijs:40, lvl:1, uit:'Geeft je monster 60 XP.', waar:'team'},
  {id:'xp2', naam:'Super XP-drankje', icon:'xp2', prijs:120, lvl:5, uit:'Geeft je monster 200 XP.', waar:'team'},
  {id:'heal', naam:'Herstel-drankje', icon:'heal', prijs:25, lvl:1, uit:'Kom je na de toets 1 of 2 goede antwoorden tekort? Dan krijg je 2 reddingsvragen. Je sterren blijven gebaseerd op de toets zelf.', waar:'gevecht'},
  {id:'shield', naam:'Combo-schild', icon:'shield', prijs:30, lvl:2, uit:'In een gevecht: één fout verbreekt je combo (bonusmunten) niet. De fout telt wel mee voor je toets.', waar:'gevecht'},
  {id:'hint', naam:'Hint-dobbelsteen', icon:'hint', prijs:20, lvl:1, uit:'In een gevecht: haalt foute antwoorden weg. Je antwoord telt als goed, maar ouders zien dat je een hint gebruikte.', waar:'gevecht'},
  {id:'luck', naam:'Geluksbamboe', icon:'luck', prijs:50, lvl:3, uit:'Dubbele munten bij je volgende gewonnen gevecht.', waar:'team'},
];
