/* =========================================================
   LESSEN RUIMTE
   Twee soorten lessen:
   1. Met een recept: L.push({ id, vak, g:[vanGroep, totGroep], titel, uitleg, vb, gen(groep){...} })
      gen() maakt elke keer een nieuwe vraag: { q, opts, ans, uitleg, vis?, big?, say?, sayAns?, tik? }
   2. Met een vaste lijst vragen: lesBank({ id, vak, g, titel, uitleg, vb, vragen:[ [vraag, goed, [fout, fout], uitleg], ... ] })
   Verander het id van een bestaande les niet: sterren van kinderen hangen eraan.
   ========================================================= */
lesBank({id:"s-aardemaan-3", vak:"ruimte", g:[3, 3], titel:"Onze aarde en de maan",
  uitleg:"De aarde is een planeet. De maan draait om de aarde. De zon is een ster en geeft zelf licht. De maan maakt geen eigen licht: we zien zonlicht dat op de maan terugkaatst.",
  vb:"Zon → licht op de maan → wij zien de maan.",
  vragen:[
    ["Wat is de aarde?", "Een planeet", ["Een ster", "Een raket"], "De aarde is een planeet die om de zon beweegt."],
    ["Waar draait de maan omheen?", "De aarde", ["Een boom", "Alleen Mars"], "De maan beweegt in een baan om de aarde."],
    ["Wat is de zon?", "Een ster", ["Een planeet", "Een maan"], "De zon is een ster en geeft zelf licht."],
    ["Waar komt het licht van de maan vandaan?", "Van de zon", ["Van lampen op de maan", "Van een maanbatterij"], "De maan kaatst zonlicht terug."],
    ["Waarmee reizen astronauten de ruimte in?", "Een raket", ["Een fiets", "Een zeilboot"], "Een raket kan een ruimtevaartuig omhoog brengen."],
    ["Waarvoor draagt een astronaut buiten een ruimtevaartuig een ruimtepak?", "Om beschermd te zijn en te kunnen ademen", ["Alleen om mooi te zijn", "Om regen op te vangen"], "Een ruimtepak beschermt en zorgt voor ademlucht."],
    ["Waar draait de aarde omheen?", "De zon", ["De maan", "Een wolk"], "De aarde maakt een baan om de zon."],
    ["Kan de maan ook overdag zichtbaar zijn?", "Ja", ["Nee, nooit", "Alleen bij sneeuw"], "Of je de maan ziet hangt af van haar plek en het licht."],
  ]});
lesBank({id:"s-planeten-4", vak:"ruimte", g:[4, 4], titel:"Een eerste reis langs de planeten",
  extra:'planeten',
  uitleg:"Ons zonnestelsel heeft acht planeten. Ze bewegen om de zon. Mercurius staat het dichtst bij de zon. Wij wonen op de aarde. Mars wordt de rode planeet genoemd. Jupiter is het grootst en Saturnus heeft opvallende ringen.",
  vb:"Vanaf de zon: Mercurius, Venus, Aarde, Mars, Jupiter, Saturnus, Uranus, Neptunus.",
  vragen:[
    ["Hoeveel planeten heeft ons zonnestelsel?", "8", ["6", "10"], "Er zijn acht planeten in ons zonnestelsel."],
    ["Welke planeet staat het dichtst bij de zon?", "Mercurius", ["Aarde", "Neptunus"], "Mercurius heeft de baan het dichtst bij de zon."],
    ["Op welke planeet wonen wij?", "Aarde", ["Mars", "Saturnus"], "Mensen wonen op aarde."],
    ["Welke planeet wordt de rode planeet genoemd?", "Mars", ["Venus", "Uranus"], "Mars ziet er roodachtig uit door ijzerhoudend stof."],
    ["Welke planeet is het grootst?", "Jupiter", ["Mercurius", "Aarde"], "Jupiter is de grootste planeet in ons zonnestelsel."],
    ["Welke planeet is bekend om zijn opvallende ringen?", "Saturnus", ["Mars", "Venus"], "Saturnus heeft grote, goed zichtbare ringen."],
    ["Waar bewegen de planeten omheen?", "De zon", ["De aarde", "Allemaal om de maan"], "De planeten bewegen in banen om de zon."],
    ["Welke planeet ligt het verst van de zon?", "Neptunus", ["Mercurius", "Venus"], "Van de acht planeten heeft Neptunus de verste baan."],
    ["Is de zon zelf een planeet?", "Nee, een ster", ["Ja, een kleine planeet", "Ja, een maan"], "De zon geeft zelf licht en is een ster."],
  ]});
lesBank({id:"s-draaiing-5", vak:"ruimte", g:[5, 5], titel:"Dag, nacht en een jaar",
  uitleg:"De aarde draait in ongeveer 24 uur om haar as: één dag. De kant naar de zon heeft dag; de andere kant heeft nacht. De aarde beweegt ook om de zon. Eén omloop duurt ongeveer een jaar. Je schaduw ontstaat doordat je lichaam licht tegenhoudt.",
  vb:"Een rondje om de eigen as duurt ongeveer een dag. Een rondje om de zon duurt ongeveer een jaar.",
  vragen:[
    ["Waardoor ontstaan dag en nacht?", "De aarde draait om haar as", ["De zon gaat elke avond uit", "De maan bedekt elke nacht de aarde"], "Door de draaiing komt jouw plek afwisselend naar de zon toe en ervan af."],
    ["Hoe lang duurt één draaiing van de aarde ongeveer?", "24 uur", ["24 minuten", "24 jaar"], "Een volledige draaiing duurt ongeveer een dag."],
    ["Hoe lang duurt één omloop van de aarde om de zon ongeveer?", "Een jaar", ["Een dag", "Een uur"], "Een jaar is ongeveer de tijd voor één baan om de zon."],
    ["Welke kant van de aarde heeft dag?", "De kant die naar de zon is gericht", ["De kant die van de zon af is gericht", "Altijd de noordkant"], "Zonlicht verlicht de kant die naar de zon is gericht."],
    ["Wat veroorzaakt een schaduw?", "Een voorwerp houdt licht tegen", ["Een voorwerp maakt extra licht", "De lucht wordt zwaarder"], "Achter een ondoorzichtig voorwerp komt minder rechtstreeks licht."],
    ["Waar komt de zon op?", "In het oosten", ["In het westen", "Altijd in het noorden"], "De zon komt ongeveer in het oosten op."],
    ["Waar gaat de zon ongeveer onder?", "In het westen", ["In het oosten", "Altijd in het zuiden"], "De zon gaat ongeveer in het westen onder."],
    ["Waar staat je schaduw ten opzichte van de zon?", "Aan de kant die van de zon af wijst", ["Altijd naar de zon toe", "Altijd recht onder de zon"], "Je lichaam blokkeert licht, waardoor de schaduw van de zon af wijst."],
    ["Is het overal op aarde tegelijk dag?", "Nee", ["Ja, altijd", "Alleen op maandag"], "De aarde heeft tegelijk een verlichte kant en een donkere kant."],
    ["Wat is het verschil tussen draaien en een omloop maken?", "Draaien is om de eigen as; een omloop is rond een ander hemellichaam", ["Dat is altijd precies hetzelfde", "Een omloop kan alleen een maan maken"], "De aarde doet beide bewegingen tegelijk."],
  ]});
lesBank({id:"s-zonnestelsel-6", vak:"ruimte", g:[6, 6], titel:"Acht planeten en hun eigenschappen",
  extra:'planeten',
  uitleg:"Van binnen naar buiten liggen Mercurius, Venus, Aarde, Mars, Jupiter, Saturnus, Uranus en Neptunus. De vier binnenste planeten zijn rotsachtig. Jupiter en Saturnus zijn gasreuzen; Uranus en Neptunus noemen we ijsreuzen. Venus is de heetste planeet door haar sterke broeikaseffect. Pluto is een dwergplaneet.",
  vb:"De aarde is de derde planeet vanaf de zon.",
  vragen:[
    ["Welke planeet is de derde vanaf de zon?", "Aarde", ["Venus", "Mars"], "Mercurius is eerste, Venus tweede en Aarde derde."],
    ["Welke planeet volgt op Mars als je van de zon af reist?", "Jupiter", ["Venus", "Mercurius"], "Na Mars volgt Jupiter."],
    ["Welke groep bestaat uit rotsplaneten?", "Mercurius, Venus, Aarde en Mars", ["Jupiter, Saturnus, Uranus en Neptunus", "Zon, Maan en Pluto"], "De vier binnenste planeten hebben een rotsachtige opbouw."],
    ["Welke planeet is het heetst aan het oppervlak?", "Venus", ["Mercurius", "Neptunus"], "De dikke atmosfeer van Venus houdt heel veel warmte vast."],
    ["Hoe noemen we Pluto?", "Een dwergplaneet", ["Een van de acht planeten", "Een ster"], "Pluto wordt ingedeeld als dwergplaneet."],
    ["Welke twee planeten noemen we gasreuzen?", "Jupiter en Saturnus", ["Aarde en Mars", "Mercurius en Venus"], "Jupiter en Saturnus zijn gasreuzen."],
    ["Welke twee planeten noemen we ijsreuzen?", "Uranus en Neptunus", ["Mars en Aarde", "Venus en Mercurius"], "Uranus en Neptunus worden ijsreuzen genoemd."],
    ["Welke planeet staat tussen Saturnus en Neptunus?", "Uranus", ["Jupiter", "Aarde"], "De buitenste volgorde is Jupiter, Saturnus, Uranus, Neptunus."],
    ["Waar ligt de belangrijkste planetoïdengordel?", "Tussen Mars en Jupiter", ["Tussen de aarde en de maan", "In het midden van de zon"], "Veel planetoïden bewegen tussen Mars en Jupiter."],
    ["Wat is een natuurlijke maan?", "Een hemellichaam dat om een planeet of dwergplaneet beweegt", ["Altijd een kunstmatige satelliet", "Een kleine ster"], "Een maan draait om een planeet of dwergplaneet."],
    ["Heeft alleen Saturnus ringen?", "Nee, de andere reuzenplaneten ook", ["Ja, als enige", "Nee, alleen de aarde heeft ze ook"], "Ook Jupiter, Uranus en Neptunus hebben ringen."],
    ["Wat houdt planeten in een baan rond de zon?", "Zwaartekracht samen met hun beweging", ["Wind uit de zon als enige oorzaak", "Een onzichtbaar touw"], "Zwaartekracht buigt hun beweging af tot een baan."],
  ]});
lesBank({id:"s-maan-7", vak:"ruimte", g:[7, 7], titel:"Maanfasen en zwaartekracht",
  uitleg:"De maan kaatst zonlicht terug. Tijdens haar omloop zien wij verschillende delen van de verlichte helft. Dat veroorzaakt maanfasen. Van nieuwe maan tot de volgende nieuwe maan duurt ongeveer 29,5 dagen. Maanfasen zijn iets anders dan een maansverduistering. Zwaartekracht trekt hemellichamen naar elkaar toe.",
  vb:"Bij volle maan zien we de naar ons gerichte kant bijna helemaal verlicht.",
  vragen:[
    ["Waardoor zien we maanfasen?", "We zien verschillende delen van de verlichte helft", ["De maan verandert echt van vorm", "De aarde werpt elke week dezelfde schaduw"], "De stand van zon, aarde en maan verandert tijdens de omloop."],
    ["Hoe lang duurt een cyclus van nieuwe maan tot nieuwe maan ongeveer?", "29,5 dagen", ["24 uur", "365 dagen"], "De maanfasencyclus duurt ongeveer 29,5 dagen."],
    ["Wat zien we bij volle maan?", "De naar ons gerichte kant is vrijwel helemaal verlicht", ["De maan maakt ineens eigen licht", "De maan is twee keer zo groot"], "Bij volle maan zien we bijna de hele verlichte helft."],
    ["Wat is nieuwe maan?", "De verlichte kant is vrijwel van ons af gericht", ["De maan is verdwenen", "Er is een nieuwe maan gebouwd"], "De maan is er nog, maar de verlichte kant zien we vrijwel niet."],
    ["Zijn maanfasen meestal de schaduw van de aarde op de maan?", "Nee", ["Ja, elke nacht", "Ja, bij elke halve maan"], "De schaduw van de aarde speelt een rol bij een maansverduistering."],
    ["Wat gebeurt bij een maansverduistering?", "De maan beweegt door de schaduw van de aarde", ["De maan verdwijnt voor altijd", "De zon gaat uit"], "De aarde houdt dan zonlicht tegen dat anders de maan bereikt."],
    ["Welke kracht trekt de maan naar de aarde?", "Zwaartekracht", ["Windkracht", "Spierkracht"], "Zwaartekracht werkt ook in de ruimte."],
    ["Is er op de maan zwaartekracht?", "Ja, minder dan op aarde", ["Nee, helemaal niet", "Alleen op maandag"], "De maan trekt voorwerpen aan, maar minder sterk dan de aarde."],
    ["Waarom zweven astronauten in een baan om de aarde?", "Ze zijn samen met hun ruimtevaartuig voortdurend in vrije val", ["Er is daar helemaal geen zwaartekracht", "Hun pakken duwen ze altijd omhoog"], "Ze vallen als het ware voortdurend om de aarde heen."],
    ["Wat volgt in de vereenvoudigde volgorde op nieuwe maan?", "Eerste kwartier", ["Laatste kwartier", "Direct weer nieuwe maan"], "De hoofdfasen zijn nieuw, eerste kwartier, vol en laatste kwartier."],
    ["Wat volgt in de hoofdfasen op volle maan?", "Laatste kwartier", ["Eerste kwartier", "Nogmaals volle maan zonder tussenfase"], "Na volle maan neemt het zichtbare verlichte deel af."],
    ["Geeft de maan zelf zichtbaar licht zoals de zon?", "Nee, ze weerkaatst zonlicht", ["Ja, door vuur op het oppervlak", "Ja, door een grote lamp"], "Maanlicht is teruggekaatst zonlicht."],
  ]});
lesBank({id:"s-seizoenen-8", vak:"ruimte", g:[8, 8], titel:"Seizoenen en de schaal van de ruimte",
  uitleg:"De aardas staat schuin. Tijdens de baan om de zon krijgt een halfrond daardoor afwisselend meer en minder direct zonlicht en langere of kortere dagen. Dat veroorzaakt de seizoenen. Seizoenen ontstaan niet doordat we in de zomer veel dichter bij de zon staan. Een lichtjaar is een afstand: de afstand die licht in één jaar aflegt.",
  vb:"Zomer in Nederland valt samen met winter in Australië.",
  vragen:[
    ["Wat veroorzaakt de seizoenen?", "De schuine aardas tijdens de omloop om de zon", ["De zon gaat in de winter bijna uit", "De maan houdt elke winter al het licht tegen"], "Door de schuine aardas veranderen zonnestand en daglengte per halfrond."],
    ["Welk seizoen is het in Australië als het in Nederland zomer is?", "Winter", ["Zomer", "Overal lente"], "De halfronden hebben tegengestelde seizoenen."],
    ["Waarom zijn zomerdagen in Nederland langer?", "Het noordelijk halfrond is meer naar de zon gericht", ["De aarde stopt met draaien", "De maan maakt extra daglicht"], "Door de stand van de aardas blijft de zon langer boven de horizon."],
    ["Wat is een lichtjaar?", "Een afstand", ["Een tijd van twaalf maanden extra", "Een snelheid"], "Een lichtjaar is de afstand die licht in één jaar aflegt."],
    ["Wat is een sterrenstelsel?", "Een grote verzameling sterren, gas en stof, gebonden door zwaartekracht", ["Alleen een planeet met ringen", "Een wolk in de aardse lucht"], "De Melkweg is ons sterrenstelsel."],
    ["Hoe heet ons sterrenstelsel?", "De Melkweg", ["Het zonnestelsel", "De Noordzee"], "Ons zonnestelsel is onderdeel van de Melkweg."],
    ["Wat is het zonnestelsel?", "De zon en hemellichamen die door haar zwaartekracht bij haar horen", ["Alle sterren van het heelal", "Alleen de aarde en de maan"], "Het zonnestelsel is veel kleiner dan de Melkweg."],
    ["Waarom zie je een verre ster zoals die vroeger was?", "Het licht heeft tijd nodig om ons te bereiken", ["Sterren staan altijd uit", "Je ogen reizen naar de ster"], "Hoe verder het licht reist, hoe langer het onderweg is."],
    ["Wat is een exoplaneet?", "Een planeet buiten ons zonnestelsel", ["Een maan van de aarde", "Een nieuwe naam voor de zon"], "Exoplaneten horen niet bij ons zonnestelsel."],
    ["Wat betekent een model op schaal?", "Afmetingen of afstanden zijn in een vaste verhouding verkleind", ["Alles is even groot gemaakt", "Afstanden zijn zomaar gekozen"], "Bij een schaalmodel blijft een gekozen verhouding gelijk."],
    ["Waarom passen echte planeetgroottes én afstanden lastig op één blad?", "De afstanden zijn enorm vergeleken met de planeetgroottes", ["Alle planeten raken elkaar", "Planeten hebben geen grootte"], "Een leesbare tekening gebruikt daarom vaak verschillende schalen."],
    ["Wat hoort bij de zomer op het noordelijk halfrond?", "Gemiddeld langere dagen en een hogere zonnestand", ["Altijd overal op aarde zomer", "Een aarde die niet meer draait"], "De zonnestand en daglengte bepalen hoeveel zonne-energie een plek ontvangt."],
  ]});
