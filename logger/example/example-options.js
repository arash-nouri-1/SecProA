const express = require("express");
const LogFile = require("../lib/index");

const logFile = LogFile.createLogFile("Example With Options", "debug");
const logger = logFile.getLogger();

logger.info("Info Log");
logger.error("Error Log");
logger.debug("Debug Log");


const app = express();
app.use(logFile.createMiddleware("debug"));

app.get("/", (req, res) => res.send("OK"));

app.listen(3000);
