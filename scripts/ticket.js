export class Ticket {
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
            console.log(`      (unassigned)`);
        }
    }

    renderOnPage(columnTicketsContainerHtmlElement) {
        let liHtmlElement = document.createElement("li");
        liHtmlElement.classList.add("ticket");

        const titleHeadingId = `ticket-title-heading-${this.id}`;
        const titleFormId = `ticket-title-form-${this.id}`;
        const titleInputId = `ticket-title-input-${this.id}`;
        const personSpanId = `ticket-person-span-${this.id}`;
        const personSelectId = `ticket-person-select-${this.id}`;

        // Omdat we gebruik maken van innerHTML (en niet van createElement)
        // is het koppelen van event listeners iets omslachtiger.
        // Maar de code is wel leesbaarder...
        // Belangrijk is wel dat het element al in de DOM gekoppeld is vooraleer je events
        // kan koppelen. 
        // Vandaar dat we in de class Column ook een kleine refactor hebben gedaan
        // (= boardHtmlElement.appendChild(columnHtmlElement); werd geplaatst voor de render 
        // van de tickets wordt aangeroepen).
        liHtmlElement.innerHTML = `
        <h3 id="${titleHeadingId}" class="ticket-title">
            <span>${this.title}</span>
        </h3>
        <form id="${titleFormId}" style="display: none">
            <input id="${titleInputId}" type="text" value="${this.title}" />
        </form>        
        <span class="ticket-person">
            ${this.person ? this.person.firstName : 'unassigned'}
        </span>`;

        // Bij het appenden zal de browser de innerHTML parsen en zijn de nieuwe DOM elementen 
        // beschikbaar. Het is pas ook op dit moment dat event listeners kunnen gekoppeld worden
        // (als er dus gebruik wordt gemaakt van innerHTML).
        columnTicketsContainerHtmlElement.appendChild(liHtmlElement);

        // Bij het klikken op de titel moet een form met een input field getoond worden.
        // Voor het gebruiksgemak krijgt die input ook al direct de focus.
        document.getElementById(titleHeadingId).addEventListener("click", (e) => {
            document.getElementById(titleHeadingId).style.display = "none";            
            document.getElementById(titleFormId).style.display = "unset";
            document.getElementById(titleInputId).focus();
        });

        // Er werd een kleine form voorzien zonder submit button ... maar een Enter
        // zal ook de form submitten. 
        // TODO: kan je ook submitten als je ergens buiten de form klikt?
        document.getElementById(titleFormId).addEventListener("submit", (e) => {
            // Dit zorgt ervoor dat er geen postback van de form gebeurt (anders ben je alles kwijt!)
            e.preventDefault();

            // nieuwe titel uitlezen en onthouden + tonen in de header.
            this.#title = document.getElementById(titleInputId).value;
            document.querySelector(`#${titleHeadingId} span`).innerText = this.#title;

            // En de form weer verbergen en de header tonen.
            document.getElementById(titleHeadingId).style.display = "unset";
            document.getElementById(titleFormId).style.display = "none";
        });        
    }
}