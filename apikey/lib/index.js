const fs = require("fs")
const express = require("express")

const router = express.Router();
let keys = [];

fs.watch("./api.json", loadKeys);
loadKeys();

function loadKeys()
{
    let rawdata = fs.readFileSync("./api.json").toString();
    keys = JSON.parse(rawdata);
}

router.use((req, res, next) => {

    const apiKey = req.headers["x-api-key"];

    // Is the given key present in the valid api key list
    if(keys.indexOf(apiKey) !== -1)
    {
        next();
    }
    else
    {
        res.status(401).send({status: 401, message: "No or invalid API-key provided."});
    }
});

module.exports = router;
