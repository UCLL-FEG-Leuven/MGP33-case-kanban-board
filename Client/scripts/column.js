import { updatePieChart } from "./pie-chart.js";
import { Ticket } from "./ticket.js";

export class Column {
    #board;
    #columnName;
    #tickets;

    // De <ol> wordt bijgehouden in een private field omdat we bij een 'drop'
    // toegang moeten hebben tot die lijst (om de lijst aan te vullen).
    #columnTicketsContainerHtmlElement;

    constructor(board, columnName) {
        this.#board = board;
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

        updatePieChart(this.columnName, this.#tickets.length);

        return ticket;
    }

    // Verwijdert een ticket op basis van zijn ID.
    // De column property van het ticket wordt op null gezet.
    removeTicket(ticketId) {
        let removedTickets = this.#tickets.filter(t => t.id === ticketId);
        if (removedTickets.length === 0) throw `Deze column ${this.columnName} bevat geen ticket met ID ${ticketId}`;

        this.#tickets = this.#tickets.filter(t => t.id !== ticketId);
        removedTickets[0].column = null;

        updatePieChart(this.columnName, this.#tickets.length);

        return removedTickets[0];
    }

    renderOnConsole() {
        console.log(`  ${this.columnName} with ${this.tickets.length} tickets:`);
        this.#tickets.forEach(t => {
            t.renderOnConsole();
        });
    }

    async renderOnPage(boardHtmlElement) {
        let columnHtmlElement = document.createElement("div");
        columnHtmlElement.className = "grid-column";
        columnHtmlElement.innerHTML = `<h2>${this.columnName}</h2>`
        let addTicketButtonElement = document.createElement("button");
        addTicketButtonElement.setAttribute('class', 'add');
        addTicketButtonElement.innerText = '+';        
        columnHtmlElement.appendChild(addTicketButtonElement);
        boardHtmlElement.appendChild(columnHtmlElement);

        // Koppelen van de add ticket event handler.
        this.#wireAddTicketEventHandler(addTicketButtonElement);


        // Koppelen van drop event handlers.
        this.#wireDragAndDropEventHandlers(columnHtmlElement);

        this.#columnTicketsContainerHtmlElement = document.createElement("ol");
        columnHtmlElement.appendChild(this.#columnTicketsContainerHtmlElement);        
        this.#tickets.forEach(async t => {
            await t.renderOnPage(this.#columnTicketsContainerHtmlElement);
        });

        // De pie chart een eerste keer bijwerken. 
        // Het board zal ook telkens de pie chart bijwerken van zodra er een addTicket of moveTicket gebeurt (vb. door een drag en drop)
        updatePieChart(this.columnName, this.tickets.length); 
    }

    #wireAddTicketEventHandler(buttonElement) {
        buttonElement.addEventListener('click', async (e) => {
            let ticket = new Ticket('Pas de titel aan');
            ticket.description = 'Voeg een beschrijving toe';
            this.#board.addTicket(ticket);
            this.#board.moveTicket(ticket.id, this.columnName);

            let ol = e.currentTarget.parentElement.lastChild;
            await ticket.renderOnPage(ol);
        });
    }

    #wireDragAndDropEventHandlers(columnHtmlElement) {
        columnHtmlElement.addEventListener("dragover", (e) => {
            e.preventDefault();
        });
        columnHtmlElement.addEventListener("drop", (e) => {
            e.preventDefault();
            let ticketId = parseInt(e.dataTransfer.getData("ticketId"));
            if (this.#board.moveTicket(ticketId, this.columnName)) {
                // Nu nog 'visueel' verplaatsen
                let ticketHtmlElementToMove = document.getElementById(`ticket-${ticketId}`);
                this.#columnTicketsContainerHtmlElement.insertBefore(ticketHtmlElementToMove, this.#columnTicketsContainerHtmlElement.firstChild);
            }
        });  
    }

    requestSave() {
        this.#board.save();
    }

    toJSON() {
        return {
            columnName: this.#columnName,
            tickets: this.#tickets
        }
    }

    static async fromJSON(board, columnAsObjectLiteral) {
        let column = new Column(board, columnAsObjectLiteral.columnName);
        for (let i = 0; i < columnAsObjectLiteral.tickets.length; i++) {
            let ticket = await Ticket.fromJSON(columnAsObjectLiteral.tickets[i]);
            ticket.column = column;
            column.#tickets.push(ticket);
        };
        return column;
    }
}