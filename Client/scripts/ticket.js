import { Person } from "./person.js";
import { getAllPersons } from "./person-database.js";

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

    async renderOnPage(columnTicketsContainerHtmlElement) {
        let liHtmlElement = document.createElement("li");
        liHtmlElement.setAttribute("id", `ticket-${this.id}`);
        liHtmlElement.setAttribute("draggable", "true"); // Dit is belangrijk om een ticket 'draggable' te maken.
        liHtmlElement.classList.add("ticket");

        // Koppelen van drag event handlers.
        this.#wireDragAndDropEventHandlers(liHtmlElement);

        const titleHeadingId = `ticket-title-heading-${this.id}`;
        const titleFormId = `ticket-title-form-${this.id}`;
        const titleInputId = `ticket-title-input-${this.id}`;

        const descriptionParagraphId = `ticket-description-paragraph-${this.id}`;
        const descriptionFormId = `ticket-description-form-${this.id}`;
        const descriptionTextareaId = `ticket-description-textarea-${this.id}`;

        const personSpanId = `ticket-person-span-${this.id}`;
        const personFormId = `ticket-person-form-${this.id}`;
        const personSelectId = `ticket-person-select-${this.id}`;

        // Omdat we gebruik maken van innerHTML (en niet van createElement)
        // is het koppelen van event listeners iets omslachtiger.
        // Maar de code is wel leesbaarder...
        liHtmlElement.innerHTML = `
        <h3 id="${titleHeadingId}" class="ticket-title">
            <span>${this.title}</span>
        </h3>
        <form id="${titleFormId}" class="ticket-title" style="display: none">
            <input id="${titleInputId}" type="text" value="${this.title}" />
            <input type="submit" value="Ok" />
        </form>
        <p id="${descriptionParagraphId}" class="ticket-description">${this.description}</p>
        <form id="${descriptionFormId}" class="ticket-description" style="display: none">
            <textarea id="${descriptionTextareaId}" rows="2" cols="50">${this.description}</textarea>
            <input type="submit" value="Ok" />
        </form>        
        <span id="${personSpanId}" class="ticket-person">
            ${this.person ? this.person.firstName : 'unassigned'}
        </span>
        <form id="${personFormId}" class="ticket-person" style="display: none">
            <select id="${personSelectId}">
                <option value="" selected>Selecteer een persoon...</option>
                ${(await getAllPersons()).reduce((accumulator, currentPerson) => accumulator + `<option value="${currentPerson.id}">${currentPerson.firstName}</option>`,"")}
            </select>
        </form>`;

        // Bij het appenden zal de browser de innerHTML parsen en zijn de nieuwe DOM elementen 
        // beschikbaar. Het is pas ook op dit moment dat event listeners kunnen gekoppeld worden
        // (als er dus gebruik wordt gemaakt van innerHTML).
        columnTicketsContainerHtmlElement.appendChild(liHtmlElement);

        this.#wireTitleEventHandlers(titleHeadingId, titleFormId, titleInputId);
        this.#wireDescriptionEventHandlers(descriptionParagraphId, descriptionFormId, descriptionTextareaId);       
        this.#wirePersonEventHandlers(personSpanId, personFormId, personSelectId);
    }

    #wireDragAndDropEventHandlers(liHtmlElement) {
        liHtmlElement.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("ticketId", this.id);
        });
    }

    #wireTitleEventHandlers(titleHeadingId, titleFormId, titleInputId) {
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

            // direct bewaren
            this.#column.requestSave();
        });        
    }

    #wireDescriptionEventHandlers(descriptionParagraphId, descriptionFormId, descriptionTextareaId) {
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

            // direct bewaren
            this.#column.requestSave();
        });        
    }

    #wirePersonEventHandlers(personSpanId, personFormId, personSelectId) {
        // Bij het klikken op de person moet een form met een select field getoond worden.
        // Voor het gebruiksgemak krijgt die select ook al direct de focus.
        document.getElementById(personSpanId).addEventListener("click", (e) => {
            document.getElementById(personSpanId).style.display = "none";
            document.getElementById(personFormId).style.display = "block";
            document.getElementById(personSelectId).focus();
        });

        // Van zodra de gebruiker een nieuwe persoon heeft geselecteerd submitten we de form 
        // direct...
        document.getElementById(personSelectId).addEventListener("change", (e) => {
            document.getElementById(personFormId).requestSubmit();
        });

        // Form om de person aan te passen
        document.getElementById(personFormId).addEventListener("submit", async (e) => {
            // Dit zorgt ervoor dat er geen postback van de form gebeurt (anders ben je alles kwijt!)
            e.preventDefault();

            // nieuwe person uitlezen en onthouden + tonen in de header.
            let persons = await getAllPersons();
            let selectedPersonId = parseInt(document.getElementById(personSelectId).value);
            this.#person = persons.filter(p => p.id === selectedPersonId)[0];
            document.querySelector(`#${personSpanId}`).innerText = this.#person.firstName;

            // En de form weer verbergen en de header tonen.
            document.getElementById(personSpanId).style.display = "block";
            document.getElementById(personFormId).style.display = "none";

            // direct bewaren
            this.#column.requestSave();
        });
    }    

    toJSON() {
        return {
            title: this.#title,
            description: this.#description,
            personId: this.#person ? this.#person.id : null
        };
    }
    
    static async fromJSON(ticketAsObjectLiteral) {
        let persons = await getAllPersons();
        let ticket = new Ticket(ticketAsObjectLiteral.title);
        ticket.description = ticketAsObjectLiteral.description;
        ticket.person = ticketAsObjectLiteral.personId != null ? persons.filter(p => p.id === ticketAsObjectLiteral.personId)[0] : null;
        return ticket;
    }
}