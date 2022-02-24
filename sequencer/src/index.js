const process = require("process");
const express = require("express");
const LogFile = require("logfile");


// Create logger
const logFile = LogFile.createLogFile("sequencer.log", process.env.LOGLEVEL || "info");
const logger = logFile.getLogger();


// Create Webserver
const app = express();


// Register logging middleware
app.use(logFile.createMiddleware("info", "access.log"));

// Register body parser middleware
app.use(express.json());

// Register api routes
const apiRouter = require("./router");
app.use("/api/v1", apiRouter);

// Register 404 route
app.all("*", async (req, res) => {
    res.status(404).send({status: 404, message: "This route does not exist!"});
});


// Start server
const server = app.listen(process.env.PORT || 3000, () => {
    logger.info(`Server started on port ${process.env.PORT || 3000}.`);
});


// Graceful shutdown
process.on("SIGINT", shutdown)
    .on("SIGTERM", shutdown);

async function shutdown()
{
    logger.info("Shutting down service.");

    await apiRouter.close();
    server.close(() => {
        logger.info("Closed Web Server.");
        logger.info("Shutdown successful.");
    });
}
