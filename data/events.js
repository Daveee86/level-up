/* =========================================================
   EVENTS (Sinterklaas, Kerst, ...)
   Ouders zetten een event aan in het ouderscherm. Er staat er hoogstens één tegelijk aan.
   Een event verandert vooral het uiterlijk:
     kaart:     eigen wereldkaart per wereld (maak ze met tools/kaart.py, THEMAS)
     klasse:    css-klasse op <body> (kleuren staan in css/style.css bij "EVENTS")
     vallen:    plaatje dat over de kaart naar beneden dwarrelt (assets/events/)
     icoon:     plaatje in de banner
     banner:    korte tekst bovenaan de kaart
     cadeau:    één keer per dag een klein cadeautje (munten of een drankje)
   Nieuw event? Kopieer een blok, maak de kaarten en voeg kleuren toe in de css.
   ========================================================= */
const EVENTS = {
  sint: {
    naam: 'Sinterklaas', klasse: 'ev-sint',
    kaart: {2:'assets/maps/wereld2-sint.png', 3:'assets/maps/wereld3-sint.png'},
    vallen: 'assets/events/pepernoot.png', icoon: 'assets/events/mijter.png',
    banner: 'Sinterklaas is in het land!',
    cadeau: {knop: 'Zet je schoen', open: 'Er zit iets in je schoen!', morgen: 'Je schoen staat al. Morgen mag je hem weer zetten.'},
  },
  kerst: {
    naam: 'Winterwonderland', klasse: 'ev-kerst',
    kaart: {2:'assets/maps/wereld2-kerst.png', 3:'assets/maps/wereld3-kerst.png'},
    vallen: 'assets/events/sneeuw.png', icoon: 'assets/events/kerstboom.png',
    banner: 'Het sneeuwt in de wereld!',
    cadeau: {knop: 'Pak een cadeau onder de boom', open: 'Je pakt een cadeautje uit!', morgen: 'Je hebt vandaag al een cadeau. Morgen ligt er weer een.'},
  },
};
/* Wat er in een dagcadeau kan zitten. Munten of een drankje (id uit data/items.js). */
const EVENT_CADEAUS = [{munten:10},{munten:15},{munten:20},{munten:25},{item:'hint'},{item:'heal'},{item:'xp'}];

/* Happy hour: dubbele munten voor de eerste gevechten na het aanzetten. Ouders kiezen het aantal. */
const HAPPY_STANDAARD = 5;
