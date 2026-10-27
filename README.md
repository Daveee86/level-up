# Level-UP

Een leerspel voor groep 3 t/m 8. Kinderen leren rekenen, taal, Engels, topografie, geschiedenis en ruimte. Elke les eindigt met een gevecht: elk goed antwoord is een aanval. Met munten koop je monsters en drankjes, en je monsters evolueren als ze sterker worden.

## Spelen

- **Online:** de site staat op Cloudflare Pages. Elke wijziging op de `main`-branch komt daar automatisch online.
- **Op je eigen computer:** dubbelklik op `index.html`. Er is geen server of installatie nodig.
- **Ouderscherm:** knop "Voor ouders" op het startscherm. Wachtwoord: `admin` (alleen een drempel voor kinderen, geen echte beveiliging).

De voortgang staat in de browser van het apparaat. Maak af en toe een reservekopie via het ouderscherm.

## Mappen

```
index.html        startbestand: laadt alle onderdelen in de goede volgorde
css/style.css     opmaak; .w2 = groep 3-5 (licht), .w3 = groep 6-8 (Neon Nexus)
data/             gegevens: hier voeg je dingen toe
  monsters.js     alle monsters, prijzen, evoluties
  trainers.js     uiterlijken van spelers
  items.js        drankjes en items in de winkel
  werelden.js     vakken, eilandmeesters, aantal vragen per gevecht, wereldkaart
  nl-kaart.js     kaart van Nederland voor topografie
lessen/           alle lessen, één bestand per vak
js/               de spelcode (meestal hoef je hier niet in)
assets/           plaatjes: monsters, trainers, items, kaarten
tools/            hulpscripts (plaatjes ophalen, kaart maken, bundel maken)
```

## Iets toevoegen

### Een les met vaste vragen
Open het bestand van het vak in `lessen/` en voeg een blok toe:

```js
lesBank({id:"g-voc-9", vak:"geschiedenis", g:[7,8], titel:"Mijn nieuwe les",
  uitleg:"Wat het kind eerst leest.",
  vb:"Een voorbeeld.",
  vragen:[
    ["Vraag?", "Goed antwoord", ["Fout 1", "Fout 2"], "Uitleg na het antwoord."],
  ]});
```

- `g:[7,8]` = voor groep 7 t/m 8.
- Zorg voor minstens 20 vragen per les: er zijn 10 oefenvragen en 7 tot 10 gevechtsvragen.
- Verander het `id` van een bestaande les niet. De sterren van kinderen hangen eraan.

Ouders kunnen ook zelf lessen maken in het ouderscherm (les-editor). Die staan alleen op dat apparaat.

### Een les met een recept (rekenen)
Zie `lessen/rekenen.js`: `gen()` maakt elke keer een nieuwe som. Een vraag is `{q, opts, ans, uitleg}`.

### Zelf intypen en lastige onderdelen
Rekenvragen met een getal als antwoord typt het kind in met een cijferpaneel (`js/invoer.js`). Zet `keuze:true` in een les om dat uit te zetten.
Geef in een recept `skill:'tafel van 7'` mee: dan houdt Level-UP per onderdeel bij hoe het gaat, en ziet Admin welke onderdelen lastig zijn.
Gericht herhalen staat in `js/herhalen.js` (instellingen bovenaan in `HERHAAL`): na een paar gevechten een trainingsronde met de lastigste rekenonderdelen, daarna komen die af en toe terug in gevechten.

### Een monster
1. Plaatjes ophalen: `python3 tools/sprites.py <map-met-tuxemon> agnite agnidon agnigon`
2. Plak de regel die het script geeft in `data/monsters.js` en pas `tier`, `price` en `req` aan.
3. Zet de bron in `CREDITS.md` als het monster niet uit Tuxemon komt.

### Een eilandmeester
In `data/werelden.js`, onder `WORLDS[2].boss` of `WORLDS[3].boss`: naam, trainer-plaatje en monster. Het legendarische monster dat je wint staat in `BOSS_LEG`.

### Een uiterlijk voor spelers
Zet een plaatje van 64x64 in `assets/trainers/` en voeg de naam toe aan `SPELER_LOOKS` in `data/trainers.js`.

### De wereldkaart
`python3 tools/kaart.py` maakt `assets/maps/wereld2.png` en `wereld3.png` opnieuw. Verplaats je gebouwen, plak dan de uitvoer in `KAART_PLEKKEN` in `data/werelden.js`.

### Een event (Sinterklaas, Kerst, ...)
Events staan in `data/events.js`. Ouders zetten ze aan in het ouderscherm (één tegelijk), net als happy hour.
Een nieuw event: kopieer een blok in `EVENTS`, voeg de naam toe aan `THEMAS` in `tools/kaart.py` en teken de versiering in `versier()`,
draai `python3 tools/kaart.py` en zet de kleuren in `css/style.css` bij "EVENTS".

## Online zetten (Cloudflare)

Het project `level-up2` in Cloudflare (Workers & Pages) is gekoppeld aan deze repository.
Elke push naar `main` komt na ongeveer een minuut online.
- Build command: geen. Deploy command: `npx wrangler deploy`.
- Instellingen staan in `wrangler.jsonc`. Wat niet online hoeft, staat in `.assetsignore`.
- De Cloudflare GitHub-app moet toegang hebben tot deze (privé) repository.

Werk je aan iets groots, gebruik dan een aparte branch. Cloudflare maakt daar een eigen test-adres van. Pas als het goed is, voeg je het samen met `main`.

## Eén bestand maken

`python3 tools/bundle.py` maakt `dist/level-up.html` met alles erin. Handig om snel te delen.
