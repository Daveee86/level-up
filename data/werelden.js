/* =========================================================
   WERELDEN, VAKKEN EN BAZEN
   Wereld 2 = groep 3 t/m 5 (Avonturen-eilanden), wereld 3 = groep 6 t/m 8 (Neon Nexus).

   VAKKEN: elk vak heeft een gebouw op de kaart en een eilandmeester.
     vanaf      = vanaf welke groep het vak open is
     kampioen   = false: telt niet mee om de Kampioen te openen
   WORLDS[w].isles = naam en icoon van het vak in die wereld
   WORLDS[w].boss  = eilandmeester: naam, trainer-plaatje (assets/trainers) en monster-sprite
   BOSS_LEG        = welk legendarisch monster je krijgt als je die meester voor het eerst verslaat
   ========================================================= */
const GROEPEN = [3, 4, 5, 6, 7, 8];
const worldOf = groep => groep <= 5 ? 2 : 3;

const VAKKEN = {
  rekenen:      {vak:'Rekenen'},
  taal:         {vak:'Taal'},
  engels:       {vak:'Engels', vanaf:5},
  topo:         {vak:'Topografie', vanaf:5},
  geschiedenis: {vak:'Geschiedenis', kampioen:false},
  ruimte:       {vak:'Ruimte', kampioen:false},
};

const WORLDS = {
  2: {naam:'Avonturen-eilanden', ok:['Goed zo!','Top!','Knap gedaan!','Yes!'], no:'Bijna! Zo zit het:', markt:'Monsterwinkel', huis:'Mijn team',
      isles:{
        rekenen:{naam:'Rekenrots', ico:'🔢'}, taal:{naam:'Letterbos', ico:'🌲'}, engels:{naam:'Hello Haven', ico:'⛵'},
        topo:{naam:'Kaartkaap', ico:'🗺️'}, geschiedenis:{naam:'Tijdreis', ico:'🏛️'}, ruimte:{naam:'Ruimtereis', ico:'🪐'},
      },
      boss:{
        rekenen:{naam:'Mijnwerker Max', tr:'w2r', mon:'grintrock'},
        taal:{naam:'Piraat Pim', tr:'w2t', mon:'leviadile'},
        engels:{naam:'Kapitein Koos', tr:'w2e', mon:'gryfix'},
        topo:{naam:'Ontdekkingsreiziger Erik', tr:'w2o', mon:'eaglace'},
        geschiedenis:{naam:'Tijdtovenaar Tobias', tr:'gesA', mon:'jemuar'},
        ruimte:{naam:'Zorp uit de ruimte', tr:'ruiA', mon:'lightmare'},
      }},
  3: {naam:'Neon Nexus', ok:['Nice!','Strak!','Raak!','Combo!'], no:'Net mis. Zo zit het:', markt:'Monster Shop', huis:'Team-basis',
      isles:{
        rekenen:{naam:'Reken-Core', ico:'⚙️'}, taal:{naam:'Taal-Arena', ico:'🏟️'}, engels:{naam:'English District', ico:'🌃'},
        topo:{naam:'Geo-Grid', ico:'🛰️'}, geschiedenis:{naam:'Tijdlab', ico:'🏛️'}, ruimte:{naam:'Ruimtestation', ico:'🪐'},
      },
      boss:{
        rekenen:{naam:'RoboRekenaar X-9', tr:'w3r', mon:'mk01_omega'},
        taal:{naam:'Ninja Nova', tr:'w3t', mon:'deviraptor'},
        engels:{naam:'De Zwarte Ridder', tr:'w3e', mon:'ferricran'},
        topo:{naam:'Kapitein Kompas', tr:'w3o', mon:'dragarbor'},
        geschiedenis:{naam:'De Ridder van de Tijd', tr:'gesB', mon:'conglolem'},
        ruimte:{naam:'Commandant Nova', tr:'ruiB', mon:'mk01_beta'},
      }},
};
const CHAMP = {naam:'De Gouden Kampioen', tr:'champ', mon:'agnigon'};

const BOSS_LEG = {rekenen:'mingdyn', taal:'drokoro', engels:'wolffsky', topo:'f7u1t3ra', geschiedenis:'yamada', ruimte:'altie', champ:'xeon_2'};

/* Aantal vragen in een gevecht en hoeveel goed nodig is, per wereld. */
const GEVECHT = {
  wild:  {2:{n:7,  need:5}, 3:{n:10, need:7}},
  boss:  {2:{n:10, need:7}, 3:{n:12, need:9}},
  champ: {2:{n:12, need:9}, 3:{n:14, need:10}},
};
const OEFEN_VRAGEN = 10;

/* Wereldkaart: plaatje per wereld in assets/maps/, klikbare gebouwen (in procenten van het plaatje).
   x = midden, by = onderkant, w/h = breedte/hoogte. Gemaakt met tools/kaart.py. */
const KAART_IMG = {2:'assets/maps/wereld2.png', 3:'assets/maps/wereld3.png'};
const KAART_PLEKKEN = {
  rekenen: {x:16.2, by:32.7, w:9.5, h:17.3},
  taal: {x:81.2, by:34.6, w:9.5, h:23.5},
  kampioen: {x:50.0, by:31.9, w:14.0, h:23.5},
  geschiedenis: {x:15.0, by:67.7, w:9.5, h:23.5},
  team: {x:50.0, by:69.6, w:13.4, h:36.5},
  engels: {x:70.0, by:64.4, w:9.5, h:17.3},
  shop: {x:21.2, by:97.1, w:15.5, h:22.7},
  ruimte: {x:52.5, by:96.2, w:13.8, h:15.4},
  topo: {x:89.0, by:98.5, w:17.2, h:38.8},
};
const KAART_PLEIN = {x:44, y:88};
