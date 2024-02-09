import { Column } from "./column.js";
import { updatePieChart } from "./pie-chart.js";

export class Board {
    #columns;

    // ...columnNames is een zogenaamde 'rest' parameter.
    // Dat laat toe om een onbeperkt aantal argumenten mee te geven bij aanroep van een function.
    // Meer info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
    constructor(...columnNames) {
        this.#columns = [];
        columnNames.forEach(columnName => {
           // Het board geeft zichzelf mee aan de column.
           // Zo heeft de column ook toegang tot de properties en methods van zijn board (o.a. om een moveTicket aan te roepen bij drag en drop).
           this.#columns.push(new Column(this, columnName)); 
        });
    }

    // Voegt het ticket toe aan de eerste column.
    addTicket(ticket) {
        this.#columns[0].addTicket(ticket);
        return ticket;
    }

    // Verplaats een ticket (op basis van zijn id) naar een andere kolom.
    moveTicket(ticketId, columnName) {
        let ticket;
        let oldColumn;
        let newColumn;
        for (let i = 0; i < this.#columns.length; i++) {            
            let tickets = this.#columns[i].tickets.filter(t => t.id === ticketId);
            if (tickets.length > 0) {
                ticket = tickets[0];
                oldColumn = this.#columns[i];
                break;
            };
        }

        if (!ticket) throw `Ticket met id ${ticketId} werd niet gevonden in dit board.`;

        let foundColumns = this.#columns.filter(c => c.columnName === columnName);
        if (foundColumns.length > 0) {
            newColumn = foundColumns[0];
        }
        if (!newColumn) throw `Column met name ${columnName} werd niet gevonden in dit board.`;

        // Kan de newColumn nog een nieuw ticket accepteren (Work In Progress Limit)?
        if (newColumn.canAddTicket()) {
            oldColumn.removeTicket(ticket.id);
            newColumn.addTicket(ticket);

            // De pie chart bijwerken
            updatePieChart(oldColumn.columnName, oldColumn.tickets.length);
            updatePieChart(newColumn.columnName, newColumn.tickets.length);

            return true;
        } else {
            // Work In Progress Limit is bereikt: de newColumn kan geen tickets meer accepteren.
            return false;
        }
    }

    // 1e eenvoudige manier van renderen: het board toont zichzelf op de console.
    renderOnConsole() {
        console.log(`Board with ${this.#columns.length} columns:`);
        this.#columns.forEach(c => {
            c.renderOnConsole();
        });
    }

    // 2e meer realistische manier van renderen: het board toont zichzelf op de pagina.
    async renderOnPage(boardHtmlElement) {
        this.#columns.forEach(async c => {
            await c.renderOnPage(boardHtmlElement);
        });
    }
}