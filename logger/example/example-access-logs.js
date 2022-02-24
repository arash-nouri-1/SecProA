const express = require("express");
const LogFile = require("../lib/index");

const logFile = LogFile.createLogFile("example.log");
const logger = logFile.getLogger();

logger.info("Info Log");
logger.error("Error Log");
logger.debug("Debug Log");


const app = express();
app.use(logFile.createMiddleware("info", "access.log"));

app.get("/", (req, res) => res.send("OK"));

app.listen(3000);
