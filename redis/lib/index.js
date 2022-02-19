const redis = require("redis");

/**
 * this class contains all methods needed to connect with a redis server
 * the constructor demands a host and port. If no port is given, the default port 6379 will be used
 */
class Redis
{
    /**
     * @param {string} host 
     * @param {number} port 
     */
    constructor(host, port=6379)
    {
        this.client = redis.createClient(port, host);
    }

    /**
     * @returns {Promise<void>}
     */
    connect()
    {
        return this.client.connect();
    }

    /**
     * @returns {Promise<void>}
     */
    disconnect()
    {
        return this.client.disconnect();
    }

    /**
     * @param {string} Id 
     * @param {any} Value JSON-object that gets parsed to a string
     * @returns {Promise<number>}
     */
    insert(Id, Value)
    {
        //inserts Id with value at the bottom => FIFO
        return this.client.RPUSH(Id, JSON.stringify(Value));
    }

    /**
     * @param {string} Id 
     * @returns {Promise<string>}
     */
    pop(Id)
    {
        //delete and return Oldest Id
        return this.client.LPOP(Id);
    }

    /**
     * @param {string} Id 
     * @returns {Promise<string[]>}
     */
    async popEmpty(Id)
    {
        //delete and return entire Id list
        const amount= await this.client.LLEN(Id);
        return this.client.LPOP_COUNT(Id, amount);
    }

    /**
     * @param {(...args: any[])=> void} callback
     */
    onError(callback)
    {
        this.client.on("error", callback)
    }

    /**
     * @param {(...args: any[])=> void} callback
     */

    onConnect(callback)
    {
        this.client.on("connect", callback)
    }

    /**
     * @param {(...args: any[])=> void} callback
     */
    onReady()
    {
        this.client.on("ready", callback)
    }

    /**
     * @param {(...args: any[])=> void} callback
     */
    onDisconnect()
    {
        this.client.on("end", callback)
    }

    /**
     * @param {(...args: any[])=> void} callback
     */
    onReconnect()
    {
        this.client.on("reconnect", callback)
    }
}

module.exports = Redis;