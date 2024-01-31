# FEG case: Kanban board
Deze case vormt een rode draad doorheen de hele FEG cursus.  
Elk hoofdstuk dat we behandelen zal toegepast worden op deze case.  
Lees zeker de informatie die in deze README.md staat, aangevuld met de code commentaar die we in elke iteratie/versie voorzien.

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