const process = require("process");
const express = require("express");
const LogFile = require("logfile");
const RedisClient = require("redis");

// Get the logger instance
const logFile = LogFile.createLogFile("sequencer.log");
const logger = logFile.getLogger();

// Create redis client
const redisClient = new RedisClient(process.env.REDIS_HOST || "localhost", process.env.REDIS_PORT || 6379);

// Register redis events
redisClient.onError((err) => {
    logger.error(err.message);
});

redisClient.onConnect(() => {
    logger.debug("Connecting to the redis database.");
});

redisClient.onReconnect(() => {
    logger.debug("Reconnecting to the redis database.");
});

redisClient.onReady(() => {
    logger.info("Connected to the redis database.");
});

redisClient.onDisconnect(() => {
    logger.info("Disconnected from the redis database.");
});

// Connect to the redis client
logger.debug(`Connecting to the redis database at ${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || 6379}`);
redisClient.connect();

// Create an express router
const router = express.Router();

// Get job from specified queue
router.get("/job/:id", async (req, res) => {

    const queueId = req.params.id;
    logger.debug(`Finding jobs in ${queueId} queue.`);

    const job = await redisClient.pop("jobs:" + queueId);

    if(!job || job === "")
    {
        res.status(404).send({status: 404, message: "No jobs are ready for execution"});
        return;
    }

    res.status(200).contentType("application/json").send(job);

});

// Post results
router.post("/results", async (req, res) => {

    const results = req.body;
    logger.debug(JSON.stringify(req.body));

    await redisClient.insert("results", results);

    res.status(201).send({status: 201, message: "Results successfully registered."});
});


// Create graceful shutdown method
router.close = async () => {
    await redisClient.disconnect();
};

// Export the router
module.exports = router;
