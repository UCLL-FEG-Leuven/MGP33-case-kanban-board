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
           this.#columns.push(new Column(this, columnName)); 
        });
    }

    // Voegt het ticket toe aan de eerste column.
    addTicket(ticket) {
        this.#columns[0].addTicket(ticket);
        this.save();
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

            updatePieChart(oldColumn.columnName, oldColumn.tickets.length);
            updatePieChart(newColumn.columnName, newColumn.tickets.length);

            this.save();

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
    renderOnPage(boardHtmlElement) {
        this.#columns.forEach(c => {
            c.renderOnPage(boardHtmlElement);
        });        
    }

    toJSON() {
        return {
            columns: this.#columns.map(c => c.toJSON())
        };
    }

    static async fromJSON(boardAsObjectLiteral) {
        let board = new Board();
        for (let i = 0; i < boardAsObjectLiteral.columns.length; i++) {
            let column = await Column.fromJSON(board, boardAsObjectLiteral.columns[i]);
            board.#columns.push(column);
        };
        return board;
    }

    save() {
        let boardStringToStore =  JSON.stringify(this);
        localStorage.setItem("board", boardStringToStore);
    }

    static async load() {
        let boardStringFromStore = localStorage.getItem("board");
        if (boardStringFromStore) {
            let boardAsObjectLiteral = JSON.parse(boardStringFromStore);
            return await this.fromJSON(boardAsObjectLiteral);
        } else return null;
    }
}