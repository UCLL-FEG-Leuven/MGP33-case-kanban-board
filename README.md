# UCLL FEG case: Kanban board
Deze case vormt een rode draad doorheen (het niet-Angular deel van) de FEG cursus.  
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

PS: het toevoegen en verwijderen van tickets zullen we nog niet in deze iteratie voorzien, dat zal gebeuren in iteratie/versie 0.5: JSON.

## Iteratie/versie 0.4: node, npm & express (hoofdstuk 04)
In deze iteratie maken we geen gebruik meer van de LiveServer extension: we gaan nu onze eigen web server gebruiken.
Verder gaan we ook het gebruik van de chart.js library demonstreren. Deze library zal geïnstalleerd worden via npm.

Om een onderscheid te maken tussen de frontend en de backend passen we de folder structuur aan:
* ```\Client``` bevat al de frontend bestanden (html, js, css)
* ```\Server``` bevat de backend code: dat is code die uitvoert op de server. In dit hoofdstuk maken we gebruik van Node en Express, maar je zou hier evengoed een ASP.NET Core project kunnen plaatsen.

Bemerk dat beide folders een **package.json** bestand hebben.
Deze werden telkens aangemaakt met ```npm init```. 
Door deze package.json bestanden te voorzien kunnen we nu ook npm packages installeren.

Om vrij makkelijk, zonder al teveel code, een web server op te zetten hebben we de **express** npm package geïnstalleerd in /Server. Met deze package kunnen we snel een web server opzetten die de bestanden uit /Client aanbiedt. 

Als je de package.json van /Server bekijkt zal je ook zien dat we een viertal ```devDependencies``` hebben geïnstalleerd:
1. **cross-env**: laat toe om environment variabelen door te geven aan een script ongeacht het onderliggende systeem (Windows, Linux, Mac). Zo kunnen we bijvoorbeeld de poort doorgeven en moeten we dat niet hardcoden in server.js.
2. **nodemon**: monitort je bestanden in /Server. Van zodra je iets wijzigt aan server.js zal nodemon de server stoppen en weer starten. Superhandig als je veel aan het sleutelen bent aan je backend.
3. **livereload** en **connect-livereload**: met deze extension zal je browser automatisch refreshen als er iets wijzigt aan de /Client of /Server bestanden. Dat was functionaliteit die je ook al gewoon was in de LiveServer extension.

Verder demonstreert deze versie ook de ```chart.js``` library. Via chart.js kan je grafieken tonen op je webpagina's.
Bemerk dat deze npm package werd geïnstalleerd in de /Client folder aangezien het een library is die je in de frontend moet gebruiken (deze library wordt dus uitgevoerd in de browser).

Om alles te starten voer je het ```npm run start``` script uit in de root directory (dus de parent directory van /Client en /Server).
Dat script zal eerst een ```npm ci``` doen in de /Client folder en vervolgens een ```npm run start``` doen in de /Server folder.
Dat start script zal op zijn beurt ook weer een ```npm ci``` doen in de /Server folder en uiteindelijk de server starten via ```cross-env PORT=2024 nodemon server.js```.
Dat laatste commando lees je als volgt: 
"maak een environment variabele 'PORT' aan met de waarde 2024 en geef dat door aan nodemon. Nodemon zal vervolgens een 'node server.js' uitvoeren maar zal ook de bestanden 'watchen'. Van zodra een bestand wijzigt zal nodemon het 'node server.js' proces stoppen en weer starten".

## Iteratie/versie 0.5: JSON (hoofdstuk 05)
In deze versie gaan we de 'state' van het Kanban Board bijhouden in localStorage.
Dat houdt in dat we de 'state' moeten omzetten naar een JavaScript object dat kan geserialiseerd worden naar een JSON string.
Deze string wordt vervolgens opgeslagen in localStorage.
Het laden van het Kanban Board komt dan neer op het uitlezen van die JSON string uit de localStorage, waarna deze weer omgezet wordt naar een Board object bestaande uit Column, Ticket en Person objecten.

Aangezien we objectgeoriënteerd werken werd de betrokken load() en save() functionaliteit verdeeld over de Board, Column en Ticket classes.
Elke klasse is dus verantwoordelijk voor haar deel van het laden en bewaren.

Verder werd ook het random aanmaken van de taken weggewerkt en kreeg elke kolom een '+' (add ticket) button.
Via deze button kan de gebruiker zelf tickets toevoegen.