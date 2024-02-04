import { Board } from "./board.js";
import { getAllPersons } from "./person-database.js";
import { Ticket } from "./ticket.js";

// Aanmaken van een board met 3 kolommen.
let board = new Board("To do", "Doing", "Done");

// Aanmaken van de 4 personen. De familienaam laten we leeg.
let persons = await getAllPersons();

// Aanmaken van 20 taken die we random in kolommen plaatsen en aan personen toekennen.
for (let i = 0; i < 20; i++) {

    // Eerst een nieuw ticket aanmaken.
    let ticket = new Ticket(`Ticket #${i}`);

    // Dan het ticket op het board plaatsen.
    // Deze komt automatisch in de eerste kolom terecht.
    board.addTicket(ticket);

    // Verplaatsen naar een random kolom.
    // Elk ticket komt standaard in de eerste kolom terecht, dus een move naar die eerste kolom is niet nodig.
    let randomColumnIndex = Math.floor(Math.random() * 3);
    switch (randomColumnIndex) {
        // case 0:
        //     board.moveTicket(ticket.id, "To do");
        //     break;
        case 1:
            board.moveTicket(ticket.id, "Doing");
            break;
        case 2:
            board.moveTicket(ticket.id, "Done");
            break;                        
    }

    // En vervolgens een random persoon toekennen.
    let randomPersonIndex = Math.floor(Math.random() * persons.length);
    ticket.person = persons[randomPersonIndex];
};

// Nu dat alles aangemaakt werd ... het resultaat tonen.
board.renderOnConsole();
board.renderOnPage(document.getElementById("board"));