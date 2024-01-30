class Ticket {
    static #lastId = 0;

    #id;
    #title;
    #column;
    #person;

    constructor(title) {
        this.#id = Ticket.#lastId++;
        this.#title = title;
    }

    get id() {
        return this.#id;
    }

    get title() {
        return this.#title;
    }

    set title(value) {
        this.#title = value;
    }

    get column() {
        return this.#column;
    }

    set column(value) {
        this.#column = value;
    }

    get person() {
        return this.#person;
    }

    set person(value) {
        this.#person = value;
    }

    renderOnConsole() {
        console.log(`    id=${this.id}, title=${this.#title}`);
        if (this.person) {
            this.person.renderOnConsole();
        } else {
            console.log(`      (no one assigned)`);
        }
    }
}