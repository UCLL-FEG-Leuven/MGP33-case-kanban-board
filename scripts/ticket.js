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
        this.#description = "Voeg een omschrijving toe";
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

        const titleHeadingId = `ticket-title-heading-${this.id}`;
        const titleFormId = `ticket-title-form-${this.id}`;
        const titleInputId = `ticket-title-input-${this.id}`;

        const descriptionParagraphId = `ticket-description-paragraph-${this.id}`;
        const descriptionFormId = `ticket-description-form-${this.id}`;
        const descriptionTextareaId = `ticket-description-textarea-${this.id}`;

        // Omdat we gebruik maken van innerHTML (en niet van createElement)
        // is het koppelen van event listeners iets omslachtiger.
        // Maar de code is wel leesbaarder...
        liHtmlElement.innerHTML = `
        <h3 id="${titleHeadingId}" class="ticket-title">
            <span>${this.title}</span>
        </h3>
        <form id="${titleFormId}" style="display: none">
            <input id="${titleInputId}" type="text" value="${this.title}" />
            <input type="submit" value="Ok" />
        </form>
        <p id="${descriptionParagraphId}">${this.description}</p>
        <form id="${descriptionFormId}" style="display: none">
            <textarea id="${descriptionTextareaId}" rows="4" cols="20"></textarea>
            <input type="submit" value="Ok" />
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
            document.getElementById(titleFormId).style.display = "block";
            document.getElementById(titleInputId).focus();
        });

        // Form om de titel aan te passen
        document.getElementById(titleFormId).addEventListener("submit", (e) => {
            // Dit zorgt ervoor dat er geen postback van de form gebeurt (anders ben je alles kwijt!)
            e.preventDefault();

            // nieuwe titel uitlezen en onthouden + tonen in de header.
            this.#title = document.getElementById(titleInputId).value;
            document.querySelector(`#${titleHeadingId} span`).innerText = this.#title;

            // En de form weer verbergen en de header tonen.
            document.getElementById(titleHeadingId).style.display = "block";
            document.getElementById(titleFormId).style.display = "none";
        });

        // Bij het klikken op de description moet een form met een textarea field getoond worden.
        // Voor het gebruiksgemak krijgt die textarea ook al direct de focus.
        document.getElementById(descriptionParagraphId).addEventListener("click", (e) => {
            document.getElementById(descriptionParagraphId).style.display = "none";
            document.getElementById(descriptionFormId).style.display = "block";
            document.getElementById(descriptionTextareaId).focus();
        });

        // Form om de description aan te passen
        document.getElementById(descriptionFormId).addEventListener("submit", (e) => {
            // Dit zorgt ervoor dat er geen postback van de form gebeurt (anders ben je alles kwijt!)
            e.preventDefault();

            // nieuwe description uitlezen en onthouden + tonen in de header.
            this.#description = document.getElementById(descriptionTextareaId).value;
            document.querySelector(`#${descriptionParagraphId}`).innerText = this.#description;

            // En de form weer verbergen en de header tonen.
            document.getElementById(descriptionParagraphId).style.display = "block";
            document.getElementById(descriptionFormId).style.display = "none";
        });        
    }
}