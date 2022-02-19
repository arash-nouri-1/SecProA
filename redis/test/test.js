const RedisClient = require('../lib/index.js');
const client = new RedisClient(6379, "localhost");

(async () => {
    await client.connect();
    await client.insert("test", {domain: "www"});
    const output = await client.pop("test");
    await client.insert("test", {domain: "www1"});
    await client.insert("test", {domain: "www2"});
    await client.insert("test", {domain: "www3"});
    await client.insert("test", {domain: "www4"});
    await client.insert("test", {domain: "www5"});
    const output2 = await client.popEmpty("test");

    console.log("Pop");
    console.log(output);
    console.log("PopEmpty");
    console.log(output2);
    
    await client.disconnect();
})();