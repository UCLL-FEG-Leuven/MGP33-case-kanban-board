const express = require("express");
const app = express();
const port = 2024;

app.use(express.static("../client"));

app.listen(port, () => {
    console.log("server started ...");
});