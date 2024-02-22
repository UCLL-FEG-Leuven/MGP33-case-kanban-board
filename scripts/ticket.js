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

        // Omdat we gebruik maken van innerHTML (en niet van createElement)
        // is het koppelen van event listeners iets omslachtiger.
        // Maar de code is wel leesbaarder...
        liHtmlElement.innerHTML = `
            <h3 class="ticket-title">${this.title}</h3>
            <form class="ticket-title" style="display: none">
                <input type="text" value="${this.title}" />
                <input type="submit" value="Ok" />
            </form>
            <p class="ticket-description">${this.description}</p>
            <form class="ticket-description" style="display: none">
                <textarea rows="2" cols="50">${this.description}</textarea>
                <input type="submit" value="Ok" />
            </form>        
            <span class="ticket-person">
                ${this.person ? this.person.firstName : 'unassigned'}
            </span>
            <form class="ticket-person" style="display: none">
                <select>
                    <option value="" selected>Selecteer een persoon...</option>
                    ${(await getAllPersons()).reduce((accumulator, currentPerson) => accumulator + `<option value="${currentPerson.id}">${currentPerson.firstName}</option>`,"")}
                </select>
            </form>`;

        // Bij het appenden zal de browser de innerHTML parsen en zijn de nieuwe DOM elementen 
        // beschikbaar. Het is pas ook op dit moment dat event listeners kunnen gekoppeld worden
        // (als er dus gebruik wordt gemaakt van innerHTML).
        columnTicketsContainerHtmlElement.appendChild(liHtmlElement);

        this.#wireTitleEventHandlers();
        this.#wireDescriptionEventHandlers();       
        this.#wirePersonEventHandlers();
    }

    #wireDragAndDropEventHandlers(liHtmlElement) {
        liHtmlElement.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("ticketId", this.id);
        });
    }

    #wireTitleEventHandlers() {
        const titleHeading = document.querySelector(`#ticket-${this.id} h3.ticket-title`);
        const titleForm = document.querySelector(`#ticket-${this.id} form.ticket-title`);
        const titleInput = document.querySelector(`#ticket-${this.id} form.ticket-title input[type='text']`);

        // Bij het klikken op de titel moet een form met een input field getoond worden.
        // Voor het gebruiksgemak krijgt die input ook al direct de focus.
        titleHeading.addEventListener("click", (e) => {
            titleHeading.style.display = "none";
            titleForm.style.display = "block";
            titleInput.value = this.title;
            titleInput.focus();
        });

        // Form om de titel aan te passen
        titleForm.addEventListener("submit", (e) => {
            // Dit zorgt ervoor dat er geen postback van de form gebeurt (anders ben je alles kwijt!)
            e.preventDefault();

            // nieuwe titel uitlezen en onthouden + tonen in de header.
            this.#title = titleInput.value;
            titleHeading.innerText = this.#title;

            // En de form weer verbergen en de header tonen.
            titleHeading.style.display = "block";
            titleForm.style.display = "none";
        });        
    }

    #wireDescriptionEventHandlers() {
        const descriptionParagraph = document.querySelector(`#ticket-${this.id} p.ticket-description`);
        const descriptionForm = document.querySelector(`#ticket-${this.id} form.ticket-description`);
        const descriptionTextarea = document.querySelector(`#ticket-${this.id} form.ticket-description textarea`);

        // Bij het klikken op de description moet een form met een textarea field getoond worden.
        // Voor het gebruiksgemak krijgt die textarea ook al direct de focus.
        descriptionParagraph.addEventListener("click", (e) => {
            descriptionParagraph.style.display = "none";
            descriptionForm.style.display = "block";
            descriptionTextarea.focus();
        });

        // Form om de description aan te passen
        descriptionForm.addEventListener("submit", (e) => {
            // Dit zorgt ervoor dat er geen postback van de form gebeurt (anders ben je alles kwijt!)
            e.preventDefault();

            // nieuwe description uitlezen en onthouden + tonen in de header.
            this.#description = descriptionTextarea.value;
            descriptionParagraph.innerText = this.#description;

            // En de form weer verbergen en de header tonen.
            descriptionParagraph.style.display = "block";
            descriptionForm.style.display = "none";
        });        
    }

    #wirePersonEventHandlers() {
        const personSpan = document.querySelector(`#ticket-${this.id} span.ticket-person`);
        const personForm = document.querySelector(`#ticket-${this.id} form.ticket-person`);
        const personSelect = document.querySelector(`#ticket-${this.id} form.ticket-person select`);

        // Bij het klikken op de person moet een form met een select field getoond worden.
        // Voor het gebruiksgemak krijgt die select ook al direct de focus.
        personSpan.addEventListener("click", (e) => {
            personSpan.style.display = "none";
            personForm.style.display = "block";
            personSelect.focus();
        });

        // Van zodra de gebruiker een nieuwe persoon heeft geselecteerd submitten we de form 
        // direct...
        personSelect.addEventListener("change", (e) => {
            personForm.requestSubmit();
        });

        // Form om de person aan te passen
        personForm.addEventListener("submit", async (e) => {
            // Dit zorgt ervoor dat er geen postback van de form gebeurt (anders ben je alles kwijt!)
            e.preventDefault();

            // nieuwe person uitlezen en onthouden + tonen in de header.
            let persons = await getAllPersons();
            let selectedPersonId = parseInt(personSelect.value);
            this.#person = persons.filter(p => p.id === selectedPersonId)[0];
            personSpan.innerText = this.#person.firstName;

            // En de form weer verbergen en de header tonen.
            personSpan.style.display = "block";
            personForm.style.display = "none";
        });
    }    
}