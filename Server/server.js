// in package.json wordt via type="module" aangegeven dat we ES6 module syntax gebruiken
import express from "express";
import { join } from "path";

const app = express();

if (process.env.NODE_ENV !== 'production') {
  const { livereload } = await import("livereload");
  const { connectLiveReload } = await import("connect-livereload");

  // Met livereload zal de browser automatisch refreshen van zodra er een wijziging is aan de backend of frontend.
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(join(__dirname, '..','client')); // Deze is nodig om bij frontend changes ook een refresh te doen.
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  // De livereload middleware registreren.
  app.use(connectLiveReload());
}

import __dirname from "./__dirname.js";

// De poort is niet meer hardgecodeerd: de de host van deze server kan zelf bepalen op welke poort het moet draaien.
// Als er geen poort wordt doorgegeven dan zal de server standaard op poort 3000 draaien.
const port = process.env.PORT ? process.env.PORT : 3000;

// De static files middleware registreren
if (process.env.NODE_ENV !== 'production') {
  app.use("/", express.static(join(__dirname, '..', 'Client')));
} else {
  app.use("/", express.static(join(__dirname, 'public')));
}

// JSON middleware enablen
app.use(express.json());

let board = null;

app.get('/api/board', (req, res) => {
  res.json(board);
});

app.post('/api/board', (req, res) => {
  board = req.body;
  res.status(200).send();
});

app.listen(port, () => {
    console.log(`Node-Express server listening on port ${port}`);
});