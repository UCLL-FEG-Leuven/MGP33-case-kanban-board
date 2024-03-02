import { Board } from "./board.js";

// Aanmaken van een board met 3 kolommen (indien er nog geen board bestaat)
let board = await Board.load();
if (!board) board = new Board("To do", "Doing", "Done");

// Nu dat alles aangemaakt werd ... het resultaat tonen.
await board.renderOnPage(document.getElementById("board"));