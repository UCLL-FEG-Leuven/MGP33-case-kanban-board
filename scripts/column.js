class Column {
    #columnName;
    #tickets;

    constructor(columnName) {
        this.#columnName = columnName;
        this.#tickets = [];
    }

    get columnName() {
        return this.#columnName;
    }

    get tickets() {
        return this.#tickets;
    }

    canAddTicket() {
        // TODO: Work In Progress Limit ondersteuning.
        return true;
    }

    // Voegt een ticket toe aan de kolom.
    // De column property van het ticket wordt ook opgevuld.
    addTicket(ticket) {
        if (!this.canAddTicket()) throw `Deze column zit vol: er kunnen geen tickets meer toegevoegd worden.`;
        if (ticket.column) throw `Dit ticket is gekoppeld aan de ${ticket.column.columnName} column. Gelieve daar eerst removeTicket() aan te roepen.`;

        this.#tickets.push(ticket);
        ticket.column = this;

        return ticket;
    }

    // Verwijdert een ticket op basis van zijn ID.
    // De column property van het ticket wordt op null gezet.
    removeTicket(ticketId) {
        let removedTickets = this.#tickets.filter(t => t.id === ticketId);
        if (removedTickets.length === 0) throw `Deze column ${this.columnName} bevat geen ticket met ID ${ticketId}`;

        this.#tickets = this.#tickets.filter(t => t.id !== ticketId);
        removedTickets[0].column = null;
        return removedTickets[0];
    }

    renderOnConsole() {
        console.log(`  ${this.columnName} with ${this.tickets.length} tickets:`);
        this.#tickets.forEach(t => {
            t.renderOnConsole();
        });
    }

    renderOnPage(boardHtmlElement) {
        let columnHtmlElement = document.createElement("div");
        columnHtmlElement.className = "grid-column";
        columnHtmlElement.innerHTML = `<h2>${this.columnName}</h2>`;
        boardHtmlElement.appendChild(columnHtmlElement);     

        let columnTicketsContainerHtmlElement = document.createElement("ol");
        columnHtmlElement.appendChild(columnTicketsContainerHtmlElement);        
        this.#tickets.forEach(t => {
            t.renderOnPage(columnTicketsContainerHtmlElement);
        });
    }
}