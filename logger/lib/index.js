const express = require("express");
const winston = require("winston");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");

/**
 * A rolling log file with pre configured loggers.
 */
class LogFile
{
    /**
     * @param {string} logfile The file where logs are written to.
     * @param {string} [level=info] The minimum loglevel.
     * @param {rfs.Options} rfsOptions Options to configure a rolling file.
     */
    constructor(logFile, level, rfsOptions)
    {
        this.logFile = logFile;
        this.level = level;
        this.rfsOptions = rfsOptions;

        this.logger = winston.createLogger({
            level: this.level,
            transports: [
                new winston.transports.Console({
                    json: false,
                    format: winston.format.cli(),
                    handleExceptions: true
                }),
                new winston.transports.Stream({
                    stream: rfs.createStream(this.logFile, this.rfsOptions),
                    format: winston.format.json()
                })
            ]
        });
    }

    /**
     * Get a logger instance for this logfile.
     *
     *  @returns {winston.Logger}
     */
    getLogger()
    {
        return this.logger;
    }

    /**
     * Log access logs to the internal logger and also optionally to a seperate file.
     *
     * @param {string} [logLevel] The log level of the access logs.
     * @param {string?} [filename] Additional filename of a logfile for the pure access logs. Disabled when left blank.
     *
     * @return {express.Router} An express middleware router.
     */
    createMiddleware(logLevel = "info", filename = "")
    {
        const router = express.Router();
        router.use(morgan("common", {stream: new LogStream(this.logger, logLevel)}));

        if(!filename || filename !== "")
        {
            router.use(morgan("combined", {
                stream: rfs.createStream(filename, this.rfsOptions)
            }));
        }

        return router;
    }

    /**
     * Creates a single LogFile and its associated loggers.:
     *
     * @param {string} filename The filename where logs are written to.
     * @param {string} [level=info] The minimum loglevel of this logfile.
     * @param {rfs.Options} rfsOptions Options to configure this rolling file.
     *
     * @return {LogFile} A singleton logger instance
     */
    static createLogFile(filename, level = "info", rfsOptions = {size: "10M",
        interval: "1d", compress: "gzip", path: "logs"})
    {
        if(!LogFile.loggers)
        {
            LogFile.loggers = {};
        }

        if(Object.keys(LogFile.loggers).indexOf(filename) === -1)
        {
            LogFile.loggers[filename] = new LogFile(filename, level, rfsOptions);
        }

        return LogFile.loggers[filename];
    }
}

/**
 * Pseudo Stream object to write messages to a logger.
 */
class LogStream
{
    /**
     * @param {winston.Logger} logger The logger.
     * @param {string} level The loglevel of this stream.
     */
    constructor(logger, level = "info")
    {
        this.logger = logger;
        this.level = level;
    }

    /**
     * Write a message to a logger.
     */
    write(msg)
    {
        this.logger[this.level](msg.trim());
    }
}

// Export the LogFile class
module.exports = LogFile;
