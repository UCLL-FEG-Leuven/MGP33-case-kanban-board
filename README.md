# UCLL FEG case: Kanban board
Deze case vormt een rode draad doorheen de hele FEG cursus.  
Elk hoofdstuk dat we behandelen zal toegepast worden op deze case.  
Lees zeker de informatie die in deze README.md staat, aangevuld met de code commentaar die we in elke iteratie/versie voorzien.

> De eerste iteraties/versies draai je best nog met de LiveServer extension in VSCode.  
> Later gaan we zien hoe we zelf een server kunnen starten.  
> En van zodra we Angular gebruiken zal dat platform het van ons overnemen.

## Iteratie/versie 0.1: classes (hoofdstuk 01)
In deze eerste versie van het Kanban board voorzien we een 4-tal classes, die elk in een apart JavaScript bestand zijn geplaatst.

Wat de naamgeving betreft:
1. class names: Pascal case (vb. AutomaticCar)
2. file names: kebab-case (vb. automatic-car.js)

Het Kanban board toont (rendert) zichzelf op twee manieren:
1. op de JavaScript console via de renderOnConsole() methods
2. op de html pagina via de renderOnPage() methods

Bemerk dat elke class zijn eigen render verantwoordelijkheid heeft:
het Board rendert zijn deel, maar delegeert het renderen van de kolommen naar de Column objecten. De Column objecten renderen zichzelf maar delegeren op hun beurt ook weer het renderen van de tickets naar de eigenlijke Ticket objecten.

## Iteratie/versie 0.2: modules (hoofdstuk 02)
Deze iteratie vereist niet veel code aanpassingen.

Elke class wordt ge-export-eerd en waar nodig ge-import-eerd.
Verder werd de index.html aangepast: er werd nu enkel één script toegevoegd met het 'defer' attribuut. De browser zorgt zelf voor het laden van de andere scripts door de import statements uit te lezen. Meer informatie staat als commentaar in het index.html bestand.

## Iteratie/versie 0.3: async (hoofdstuk 03)
Deze iteratie voegt interactiviteit met de gebruiker toe. De gebruiker kan:
1. de titel van een ticket aanpassen in een ```<input>```.
2. de beschrijving van een ticket aanpassen in een ```<textarea>```.
3. een andere persoon toewijzen aan een ticket door middel van een ```<select>```.

Wat 1 en 2 betreft: de code demonstreert hier het gebruik van callbacks. Door te klikken op respectievelijk een titel of beschrijving wordt er een form getoond door middel van een 'click' callback. Het submitten van die form resulteert vervolgens in de aanroep van een 'submit' callback die de gegevens en het scherm aanpast.

Wat puntje 3 betreft (toewijzen van een andere persoon): wij hebben een person-database.js voorzien die een array van personen aanbiedt op basis van een Promise API. Hier kan je dus gebruik maken van async await. De lijst van personen wordt o.a. gebruikt om de ```<select>``` op te vullen. Die lijst wordt verder ook gebruik in index.js om random personen toe te wijzen aan de tickets.

En last but not least: je kan tickets verslepen van de ene kolom naar de andere kolom door gebruik te maken van drag and drop API.