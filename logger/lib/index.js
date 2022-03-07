const express = require("express");
const winston = require("winston");
const morgan = require("morgan");

/**
 * A rolling log file with pre configured loggers.
 */
class LogFile
{
    /**
     * @param {string} logfile The file where logs are written to.
     * @param {string} [level=info] The minimum loglevel.
     */
    constructor(logFile, level)
    {
        this.logFile = logFile;
        this.level = level;

        this.logger = winston.createLogger({
            level: this.level,
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        logFileFormat(this.logFile),
                        winston.format.timestamp(),
                        winston.format.json(),
                        //winston.format.errors()
                    ),
                    handleExceptions: true
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
     * Log access logs in common log format.
     *
     * @param {string} [logLevel] The log level of the access logs.
     * @param {string} [format=combined] A morgan logging format.
     *
     * @return {express.Router} An express middleware router.
     */
    createMiddleware(logLevel = "http", format = "combined")
    {
        const router = express.Router();

        router.use(morgan(format, {
            stream: new LogStream(this.logger, logLevel)
        }));

        return router;
    }

    /**
     * Creates a single LogFile and its associated loggers.:
     *
     * @param {string} filename The filename where logs are written to.
     * @param {string} [level=http] The minimum loglevel of this logfile.
     *
     * @return {LogFile} A singleton logger instance
     */
    static createLogFile(filename, level = "http")
    {
        if(!LogFile.loggers)
        {
            LogFile.loggers = {};
        }

        if(Object.keys(LogFile.loggers).indexOf(filename) === -1)
        {
            LogFile.loggers[filename] = new LogFile(filename, level);
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
        this.logger.log(this.level, msg.trim());
    }
}

/**
 * Custom winston format to attach the logFile name to the logging output.
 */
const logFileFormat = winston.format((info, opts) => {
    info.logFile = opts;
    return info;
});

// Export the LogFile class
module.exports = LogFile;
