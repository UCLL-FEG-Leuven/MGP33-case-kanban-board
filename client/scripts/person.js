export class Person {
    static #lastId = 0;

    #id;
    #firstName;
    #lastName;

    constructor(firstName, lastName) {
        this.#id = Person.#lastId++;
        this.#firstName = firstName;
        this.#lastName = lastName;
    }

    get id() {
        return this.#id;
    }

    get firstName() {
        return this.#firstName;
    }

    get lastName() {
        return this.#lastName;
    }

    renderOnConsole() {
        console.log(`      Person[id=${this.id}, first name=${this.firstName}, last name=${this.lastName}]`);
    }
}