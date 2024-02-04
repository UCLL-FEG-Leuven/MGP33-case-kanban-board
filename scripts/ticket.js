export class Ticket {
    static #lastId = 0;

    #id;
    #title;
    #description;
    #column;
    #person;

    constructor(title) {
        this.#id = Ticket.#lastId++;
        this.#title = title;
        this.#description = "";
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

    get description() {
        return this.#description;
    }

    set description(value) {
        this.#description = value;
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
            console.log(`      (unassigned)`);
        }
    }

    renderOnPage(columnTicketsContainerHtmlElement) {
        let liHtmlElement = document.createElement("li");
        liHtmlElement.classList.add("ticket");

        // Tot nu hebben we voornamelijk gebruik gemaakt van createElement() voor het aanmaken
        // van de DOM elementen, maar in sommige gevallen is handiger om innerHTML te 
        // gebruiken. Qua performantie is dat echter iets minder optimaal omdat de browser die
        // string moet parsen en zelf omzetten naar de nodige DOM elementen. Maar het is wel
        // leesbaarder.
        liHtmlElement.innerHTML = `
            <h3 class="ticket-title">${this.title}</h3>
            <p class="ticket-description">${this.description}</p>
            <span class="ticket-person">${this.person ? this.person.firstName : 'unassigned'}</span>`;
        columnTicketsContainerHtmlElement.appendChild(liHtmlElement);
    }
}