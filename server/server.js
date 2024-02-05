// in package.json wordt via type="module" aangegeven dat we ES6 module syntax gebruiken
import express from "express";
import { join } from "path";
import __dirname from "./__dirname.js";

const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

app.use("/", express.static(join(__dirname, '..', 'client')));

app.listen(port, () => {
    console.log(`Node-Express server listening on port ${port}`);
});