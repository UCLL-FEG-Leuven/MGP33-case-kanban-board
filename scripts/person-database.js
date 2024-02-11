import { Person } from "./person.js";

// Onze 'database' met alle persooneelsleden.
// Normaal gezien is dat een echte database (SQL Server, Oracle, ...) maar vooralsnog
// gaan we het niet te complex maken :)
let persons = null;

// Met deze 'truuk' kan je de oude setTimeout callback API's omzetten naar een Promise API.
const setTimeoutAsync = msec =>
    new Promise(resolve => setTimeout(resolve, msec));


// Deze function simuleert de asynchrone aanroep naar de database met alle
// personeelsleden. Bemerk dat deze function gemarkeerd werd met 'async', dat betekent dat een 
// caller 'await' moet gebruiken (of de Promise then() function) om te 'wachten' op het resultaat.
export async function getAllPersons() {
    if (!persons) {
        return setTimeoutAsync(500).then(() => {
            persons = [
                new Person("Rudy", ""),
                new Person("Suzy", ""),
                new Person("Franky", ""),
                new Person("Vicky", "")
            ];
            return persons;
        });
    } else {
        return new Promise((resolve) => {
            resolve(persons);
        })
    }
}