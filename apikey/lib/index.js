const fs = require("fs");
const express = require("express");

const router = express.Router();
let keys = [];

startWatching();

/**
 * Start waching every 5sec if the api.json is present.
 */
function startWatching()
{
    try
    {
        fs.watch("./api.json", loadKeys);
        loadKeys();
    }
    catch(e)
    {
        setTimeout(startWatching, 5000);
    }
}

/**
 * Load keys from file into the allowed keys array.
 */
function loadKeys()
{
    try
    {
        let rawdata = fs.readFileSync("./api.json").toString();
        keys = JSON.parse(rawdata);
    }
    catch(err)
    {
        keys = [];
    }
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
