/* =========================================================
   MONSTERS
   Een monster toevoegen:
   1. Zet de plaatjes in assets/monsters/: <sprite>.png (voorkant) en <sprite>-back.png (achterkant).
      Met tools/sprites.py haal je ze uit Tuxemon.
   2. Voeg hieronder één regel toe.

   Velden:
   id        unieke naam (gebruik de sprite van de eerste vorm)
   names     naam per vorm, in volgorde van evolutie
   spr       sprite-bestandsnaam per vorm (zonder .png)
   el        element(en), alleen tekst
   tier      starter | common | rare | epic | legend
             starter = kiesbaar bij een nieuwe speler, legend = alleen via bazen (tenzij in SHOP_LEG)
   price     prijs in munten in de winkel
   req       trainer-level dat nodig is om hem te kopen
   evo       (optioneel) levels waarop hij evolueert, bijv. [4, 9].
             Standaard: 3 vormen -> [5, 10], 2 vormen -> [7].
   ========================================================= */
const MONSTERS = [
  /* ---- starter ---- */
  {id:'agnite', names:['Agnite', 'Agnidon', 'Agnigon'], spr:['agnite', 'agnidon', 'agnigon'], el:'Vuur / Schaduw', tier:'starter', price:120, req:1},
  {id:'anoleaf', names:['Anoleaf', 'Gectile', 'Velocitile'], spr:['anoleaf', 'gectile', 'velocitile'], el:'Plant', tier:'starter', price:160, req:3},
  {id:'cardiling', names:['Cardiling', 'Cardiwing', 'Cardinale'], spr:['cardiling', 'cardiwing', 'cardinale'], el:'Vuur / Lucht', tier:'starter', price:200, req:2},
  {id:'kroki', names:['Kroki', 'Krokivip', 'Leviadile'], spr:['kroki', 'krokivip', 'leviadile'], el:'Water', tier:'starter', price:160, req:3},
  {id:'rockitten', names:['Rockitten', 'Rockat', 'Jemuar'], spr:['rockitten', 'rockat', 'jemuar'], el:'Aarde', tier:'starter', price:140, req:2},
  {id:'medipup', names:['Medipup', 'Doctsky', 'Askylpaws'], spr:['medipup', 'doctsky', 'askylpaws'], el:'Normaal', tier:'starter', price:140, req:1},
  /* ---- common ---- */
  {id:'aardorn', names:['Aardorn', 'Aardart'], spr:['aardorn', 'aardart'], el:'Normaal', tier:'common', price:160, req:3},
  {id:'axolightl', names:['Axolightl', 'Ampystoma'], spr:['axolightl', 'ampystoma'], el:'Bliksem / Water', tier:'common', price:100, req:4},
  {id:'babysnitch', names:['Babysnitch', 'Baddrscratch'], spr:['babysnitch', 'baddrscratch'], el:'Schaduw / Normaal', tier:'common', price:140, req:1},
  {id:'baoby', names:['Baoby', 'Baobaraffe'], spr:['baoby', 'baobaraffe'], el:'Plant', tier:'common', price:80, req:2},
  {id:'bumbulus', names:['Bumbulus', 'Nimbulex'], spr:['bumbulus', 'nimbulex'], el:'Lucht', tier:'common', price:120, req:3},
  {id:'bursa', names:['Bursa', 'Flambear'], spr:['bursa', 'flambear'], el:'Vuur / Kosmos', tier:'common', price:160, req:4},
  {id:'caper', names:['Caper', 'Crankus'], spr:['caper', 'crankus'], el:'IJs / Normaal', tier:'common', price:100, req:1},
  {id:'capiti', names:['Capiti', 'Capinyah'], spr:['capiti', 'capinyah'], el:'Heroic', tier:'common', price:140, req:2},
  {id:'chickadee', names:['Chickadee', 'Birdee'], spr:['chickadee', 'birdee'], el:'Normaal / Lucht', tier:'common', price:80, req:3},
  {id:'chillimp', names:['Chillimp', 'Snowrilla'], spr:['chillimp', 'snowrilla'], el:'IJs / Heroic', tier:'common', price:120, req:4},
  {id:'dollfin', names:['Dollfin', 'Bigfin'], spr:['dollfin', 'bigfin'], el:'Water', tier:'common', price:160, req:1},
  {id:'embra', names:['Embra', 'Ruption'], spr:['embra', 'ruption'], el:'Vuur', tier:'common', price:100, req:2},
  {id:'eskipup', names:['Eskipup', 'Houndice'], spr:['eskipup', 'houndice'], el:'IJs', tier:'common', price:140, req:3},
  {id:'fuzzlet', names:['Fuzzlet', 'Fuzzina'], spr:['fuzzlet', 'fuzzina'], el:'Kosmos / Normaal', tier:'common', price:80, req:4},
  {id:'hatchling', names:['Hatchling', 'Birdling'], spr:['hatchling', 'birdling'], el:'Lucht', tier:'common', price:120, req:1},
  {id:'metesaur', names:['Metesaur', 'Qetzlrokilus'], spr:['metesaur', 'qetzlrokilus'], el:'Aarde / Vuur', tier:'common', price:160, req:2},
  {id:'noctula', names:['Noctula', 'Noctalo'], spr:['noctula', 'noctalo'], el:'Lucht / Schaduw', tier:'common', price:100, req:3},
  {id:'pantherafira', names:['Pantherafira', 'Criniotherme'], spr:['pantherafira', 'criniotherme'], el:'Vuur / Normaal', tier:'common', price:140, req:4},
  {id:'pharfan', names:['Pharfan', 'Pharavion'], spr:['pharfan', 'pharavion'], el:'Water / Heroic', tier:'common', price:80, req:1},
  {id:'pickoon', names:['Pickoon', 'Raccscal'], spr:['pickoon', 'raccscal'], el:'Normaal', tier:'common', price:120, req:2},
  {id:'poinchin', names:['Poinchin', 'Saurchin'], spr:['poinchin', 'saurchin'], el:'Venom', tier:'common', price:160, req:3},
  {id:'snaki', names:['Snaki', 'Snokari'], spr:['snaki', 'snokari'], el:'Normaal', tier:'common', price:100, req:4},
  {id:'snock', names:['Snock', 'Pythock'], spr:['snock', 'pythock'], el:'Normaal', tier:'common', price:140, req:1},
  {id:'squabbit', names:['Squabbit', 'Rabbitosaur'], spr:['squabbit', 'rabbitosaur'], el:'Heroic', tier:'common', price:80, req:2},
  {id:'tarpeur', names:['Tarpeur', 'Vigueur'], spr:['tarpeur', 'vigueur'], el:'Plant / Heroic', tier:'common', price:120, req:3},
  {id:'thumpurn', names:['Thumpurn', 'Volconey'], spr:['thumpurn', 'volconey'], el:'Vuur / Normaal', tier:'common', price:160, req:4},
  {id:'toucanary', names:['Toucanary', 'Raptoucan'], spr:['toucanary', 'raptoucan'], el:'Lucht', tier:'common', price:100, req:1},
  {id:'tumblequill', names:['Tumblequill', 'Tumbledillo'], spr:['tumblequill', 'tumbledillo'], el:'Aarde / Normaal', tier:'common', price:140, req:2},
  {id:'tumbleworm', names:['Tumbleworm', 'Tumblebee'], spr:['tumbleworm', 'tumblebee'], el:'Venom', tier:'common', price:80, req:3},
  {id:'budaye', names:['Budaye', 'Bamboon'], spr:['budaye', 'bamboon'], el:'Plant', tier:'common', price:80, req:1},
  {id:'dandicub', names:['Dandicub', 'Dandylion'], spr:['dandicub', 'dandylion'], el:'Plant', tier:'common', price:100, req:2},
  {id:'memnomnom', names:['Memnomnom', 'Miaownolith'], spr:['memnomnom', 'miaownolith'], el:'Normaal', tier:'common', price:120, req:3},
  {id:'burrlock', names:['Burrlock', 'Cacaburr'], spr:['burrlock', 'cacaburr'], el:'Plant', tier:'common', price:140, req:4},
  {id:'sprightly', names:['Sprightly', 'Uprout'], spr:['sprightly', 'uprout'], el:'Plant', tier:'common', price:160, req:1},
  {id:'sheye', names:['Sheye', 'Shrab'], spr:['sheye', 'shrab'], el:'Water', tier:'common', price:80, req:2},
  {id:'nostray', names:['Nostray', 'Shnark'], spr:['nostray', 'shnark'], el:'Water', tier:'common', price:100, req:3},
  {id:'cairfrey', names:['Cairfrey', 'Possessun'], spr:['cairfrey', 'possessun'], el:'Normaal', tier:'common', price:120, req:4},
  {id:'skwib', names:['Skwib', 'Octabode'], spr:['skwib', 'octabode'], el:'Normaal', tier:'common', price:140, req:1},
  {id:'shybulb', names:['Shybulb', 'Narcileaf'], spr:['shybulb', 'narcileaf'], el:'Plant', tier:'common', price:160, req:2},
  {id:'tadcool', names:['Tadcool', 'Fribbit'], spr:['tadcool', 'fribbit'], el:'Water / IJs', tier:'common', price:80, req:3},
  {id:'pawsand', names:['Pawsand', 'Knightsand'], spr:['pawsand', 'knightsand'], el:'Aarde', tier:'common', price:100, req:4},
  {id:'jelillow', names:['Jelillow', 'Bedoo'], spr:['jelillow', 'bedoo'], el:'Water', tier:'common', price:120, req:1},
  {id:'duggot', names:['Duggot', 'Breem'], spr:['duggot', 'breem'], el:'Plant / Venom', tier:'common', price:140, req:2},
  /* ---- rare ---- */
  {id:'chloragon', names:['Chloragon', 'Sapragon', 'Dragarbor'], spr:['chloragon', 'sapragon', 'dragarbor'], el:'Plant', tier:'rare', price:200, req:4},
  {id:'cohldrabi', names:['Cohldrabi', 'Lettice', 'Frostuce'], spr:['cohldrabi', 'lettice', 'frostuce'], el:'Plant / IJs', tier:'rare', price:240, req:3},
  {id:'elofly', names:['Elofly', 'Elowind', 'Elostorm'], spr:['elofly', 'elowind', 'elostorm'], el:'Normaal / Lucht', tier:'rare', price:220, req:5},
  {id:'flacono', names:['Flacono', 'Corvix', 'Gryfix'], spr:['flacono', 'corvix', 'gryfix'], el:'Lucht', tier:'rare', price:260, req:4},
  {id:'fordin', names:['Fordin', 'Stegofor', 'Brachifor'], spr:['fordin', 'stegofor', 'brachifor'], el:'Plant', tier:'rare', price:240, req:3},
  {id:'fruitera', names:['Fruitera', 'Megafruitera', 'Spectera'], spr:['fruitera', 'megafruitera', 'spectera'], el:'Plant / Lucht', tier:'rare', price:180, req:3},
  {id:'gupphish', names:['Gupphish', 'Gupphire', 'Golnagi'], spr:['gupphish', 'gupphire', 'golnagi'], el:'Water / Vuur', tier:'rare', price:260, req:4},
  {id:'helipi', names:['Helipi', 'Coppi', 'Parappi'], spr:['helipi', 'coppi', 'parappi'], el:'Plant / Lucht', tier:'rare', price:200, req:4},
  {id:'slichen', names:['Slichen', 'Glombroc', 'Conglolem'], spr:['slichen', 'glombroc', 'conglolem'], el:'Aarde / Plant', tier:'rare', price:240, req:3},
  {id:'tweesher', names:['Tweesher', 'Heronquak', 'Eaglace'], spr:['tweesher', 'heronquak', 'eaglace'], el:'IJs / Lucht', tier:'rare', price:180, req:3},
  {id:'flummby', names:['Flummby', 'Flummack'], spr:['flummby', 'flummack'], el:'Kosmos', tier:'rare', price:200, req:3},
  {id:'squink', names:['Squink', 'Hectapod'], spr:['squink', 'hectapod'], el:'Water', tier:'rare', price:220, req:4},
  {id:'selket', names:['Selket', 'Selmatek'], spr:['selket', 'selmatek'], el:'Aarde / Venom', tier:'rare', price:240, req:4},
  {id:'lesmagu', names:['Lesmagu', 'Shelagu', 'Crustagu'], spr:['lesmagu', 'shelagu', 'crustagu'], el:'Aarde / Venom', tier:'rare', price:260, req:5},
  /* ---- epic ---- */
  {id:'devidin', names:['Devidin', 'Devidra', 'Deviraptor'], spr:['devidin', 'devidra', 'deviraptor'], el:'Aarde / Vuur', tier:'epic', price:360, req:7},
  {id:'fluoresfin', names:['Fluoresfin', 'Incandesfin', 'Lightmare'], spr:['fluoresfin', 'incandesfin', 'lightmare'], el:'Bliksem / Water', tier:'epic', price:380, req:8},
  {id:'grintot', names:['Grintot', 'Grinflare', 'Grintrock'], spr:['grintot', 'grinflare', 'grintrock'], el:'Aarde', tier:'epic', price:400, req:9},
  {id:'hissiorite', names:['Hissiorite', 'Cobarett', 'Pythonova'], spr:['hissiorite', 'cobarett', 'pythonova'], el:'Vuur', tier:'epic', price:420, req:7},
  {id:'ignibus', names:['Ignibus', 'Embazook', 'Eruptibus'], spr:['ignibus', 'embazook', 'eruptibus'], el:'Vuur', tier:'epic', price:360, req:7},
  {id:'mk01_proto', names:['Mk01 Proto', 'Mk01 Beta', 'Mk01 Omega'], spr:['mk01_proto', 'mk01_beta', 'mk01_omega'], el:'Metaal', tier:'epic', price:440, req:8},
  {id:'wrougon', names:['Wrougon', 'Allagon', 'Ferricran'], spr:['wrougon', 'allagon', 'ferricran'], el:'Metaal', tier:'epic', price:400, req:9},
  {id:'lambert', names:['Lambert', 'Legko', 'Moloch'], spr:['lambert', 'legko', 'moloch'], el:'Plant', tier:'epic', price:380, req:7},
  {id:'nebufin', names:['Nebufin', 'Galasces', 'Novaquarius'], spr:['nebufin', 'galasces', 'novaquarius'], el:'Water / Venom', tier:'epic', price:400, req:8},
  {id:'furnursus', names:['Furnursus', 'Statursus', 'Coaldiak'], spr:['furnursus', 'statursus', 'coaldiak'], el:'Vuur', tier:'epic', price:420, req:8},
  {id:'stonifly', names:['Stonifly', 'Cocrune', 'Runesquito'], spr:['stonifly', 'cocrune', 'runesquito'], el:'Aarde', tier:'epic', price:400, req:9},
  {id:'banling', names:['Banling', 'Bansaken', 'Banvengeance'], spr:['banling', 'bansaken', 'banvengeance'], el:'Plant', tier:'epic', price:440, req:9},
  /* ---- legend ---- */
  {id:'drokoro', names:['Drokoro'], spr:['drokoro'], el:'Vuur', tier:'legend', price:1540, req:17},
  {id:'mingdyn', names:['Mingdyn'], spr:['mingdyn'], el:'Vuur / Lucht', tier:'legend', price:1580, req:16},
  {id:'wolffsky', names:['Wolffsky'], spr:['wolffsky'], el:'Plant / IJs', tier:'legend', price:1520, req:16},
  {id:'f7u1t3ra', names:['Frostvlinder'], spr:['f7u1t3ra'], el:'Plant', tier:'legend', price:1560, req:15},
  {id:'xeon_2', names:['Xeon'], spr:['xeon_2'], el:'Metaal', tier:'legend', price:1500, req:15},
  {id:'primordia', names:['Primordia'], spr:['primordia'], el:'Vuur / IJs', tier:'legend', price:1540, req:17},
  {id:'yamada', names:['Yamada'], spr:['yamada'], el:'Schaduw / Held', tier:'legend', price:1580, req:16},
  {id:'altie', names:['Altie'], spr:['altie'], el:'Kosmos', tier:'legend', price:1520, req:16},
];

/* Legendarische monsters die je ook in de winkel kunt kopen (de rest win je van bazen). */
const SHOP_LEG = ['primordia'];

