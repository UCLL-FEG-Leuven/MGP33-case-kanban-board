class Board {
    #columns;

    constructor(...columnNames) {
        this.#columns = [];
        columnNames.forEach(columnName => {
           this.#columns.push(new Column(columnName)); 
        });
    }

    addTicket(ticket) {
        let column = this.#columns[0];
        column.addTicket(ticket);
        return ticket;
    }

    moveTicket(ticketId, columnName) {
        let ticket;
        let oldColumn;
        for (let i = 0; i < this.#columns.length; i++) {            
            ticket = this.#columns[i].tickets.filter(t => t.id === ticketId)[0];
            if (ticket) {
                oldColumn = this.#columns[i];
                break;
            };
        }

        let newColumn = this.#columns.filter(c => c.columnName === columnName)[0];
        if (newColumn.canAddTicket()) {
            oldColumn.removeTicket(ticket.id);
            newColumn.addTicket(ticket);
        }  
    }

    renderOnConsole() {
        console.log(`Board with ${this.#columns.length} columns:`);
        this.#columns.forEach(c => {
            c.renderOnConsole();
        });
    }
}