/*Server_Build*/
const express = require("express");
const app = express();
app.get("/", (req, res) => {
    res.sendStatus(200);
});
app.listen(3000);

/*ShardingManager*/
const { ShardingManager } = require('discord.js');
const moment = require("moment");
const mainFile = "./src/MunariBase.js";

process.on("unhandledRejection", e => {
    console.error(`Error handler caught an error: \n${e.stack}`);
});

process.on("uncaughtException", e => {
    console.error(`Error handler caught an error: \n${e.stack}`);
    console.info("Fatal error has been detected. Exiting processing...");

    process.exit(1);
});

const shards = new ShardingManager(`${mainFile}`, {
    totalShards: 'auto',
    mode: 'process',
    respawn: true,
    token: "NzQwMTEyMzUzNDgzNTU0ODU4.XykRVw.tSkdflj2vTo5eOYWgAW4Hm6RltQ"
    // token: 'NzkxMjcxMjIzMDc3MTA5ODIw.X-MuwA.XTpdWsnWaAt3Qm7qGqkQr7zL3cM'
});

shards.spawn(shards.totalShards, undefined, -1).catch(e => console.log("SHARD_SPAWN_ERR: ", e));

shards.on('shardCreate', shard => {
    shard.on("spawn", () => {
        console.log(`[ShardManager] [${moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}] Shard #${shard.id} has spawned`)
    });
    shard.on("ready", () => {
        console.log(`[ShardManager] [${moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}] Shard #${shard.id} ready`)
    });
    shard.on("death", () => {
        console.log(`[ShardManager] [${moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}] Shard #${shard.id} has death`)
    });
    shard.on("disconnect", () => {
        console.log(`[ShardManager] [${moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}] Shard #${shard.id} has disconnected`);
    });
    shard.on("reconnecting", () => {
        console.log(`[ShardManager] [${moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}] Shard #${shard.id} has reconnected.`);
    });
});