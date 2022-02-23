const express = require("express");
const verifyKey = require("../lib/index.js")

const app = express();
app.use(verifyKey);

app.all("*", (req, res) => {
    res.send("Valid API Key");
});

app.listen(3000);
