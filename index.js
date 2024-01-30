let board = new Board("To do", "Doing", "Done");
let persons = [
    new Person("Rudy", ""),
    new Person("Suzy", ""),
    new Person("Franky", ""),
    new Person("Vicky", "")
];

for (let i = 0; i < 20; i++) {
    // Eerst een nieuw ticket aanmaken/
    let ticket = new Ticket(`Ticket #${i}`);

    // En het ticket op het board plaatsen.
    // Deze komt automatisch in de eerste kolom terecht.
    board.addTicket(ticket);

    // Verplaatsen naar een random kolom.
    // Elk ticket komt standaard in de eerste kolom terecht, dus een move naar die kolom is niet nodig.
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

    let randomPersonIndex = Math.floor(Math.random() * persons.length);
    ticket.person = persons[randomPersonIndex];
};


board.renderOnConsole();
board.renderOnPage(document.getElementById("board"));