/* =========================================================
   TRAINERS (spelers en bazen)
   Plaatje: assets/trainers/<key>.png (64x64, voorkant).
   Een nieuwe look voor spelers: zet het plaatje erbij en voeg de key toe aan SPELER_LOOKS.
   Let op: verander bestaande keys niet, ze staan opgeslagen in de voortgang van kinderen.
   ========================================================= */
const SPELER_LOOKS = {
  b: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10'],   // jongen
  g: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'],   // meisje
};

/* Overige trainers, alleen als naslag (de bazen zelf staan in data/werelden.js):
   prof  = Professor Pixel (bij een nieuwe speler)
   champ = De Gouden Kampioen
   w2r w2t w2e w2o = eilandmeesters Avonturen-eilanden (rekenen, taal, engels, topo)
   w3r w3t w3e w3o = eilandmeesters Neon Nexus
   gesA gesB = geschiedenis-meesters, ruiA ruiB = ruimte-meesters */
