import { updatePieChart } from "./pie-chart.js";

export class Column {
    #columnName;
    #tickets;

    // De <ol> wordt bijgehouden in een private field omdat we bij een 'drop'
    // toegang moeten hebben tot die lijst (om de lijst aan te vullen).
    #columnTicketsContainerHtmlElement;

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

        // Koppelen van drop event handlers.
        this.#wireDragAndDropEventHandlers(columnHtmlElement);

        this.#columnTicketsContainerHtmlElement = document.createElement("ol");
        columnHtmlElement.appendChild(this.#columnTicketsContainerHtmlElement);        
        this.#tickets.forEach(t => {
            t.renderOnPage(this.#columnTicketsContainerHtmlElement);
        });

        // En de pie chart bijwerken. 
        // We gaan deze ook telkens moeten bijwerken van zodra de lijst van tickets wijzigd.
        updatePieChart(this.columnName, this.tickets.length); 
    }

    #wireDragAndDropEventHandlers(columnHtmlElement) {
        columnHtmlElement.addEventListener("dragover", (e) => {
            e.preventDefault();
        });
        columnHtmlElement.addEventListener("drop", (e) => {
            e.preventDefault();
            let ticketId = e.dataTransfer.getData("ticket-id");
            let ticketToMove = document.getElementById(ticketId);
            this.#columnTicketsContainerHtmlElement.insertBefore(ticketToMove, this.#columnTicketsContainerHtmlElement.firstChild);

            // En de pie chart nogmaals bijwerken.
            updatePieChart(this.columnName, this.tickets.length);
        });  
    }
}