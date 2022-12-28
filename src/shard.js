require("dotenv").config();
const Discord = require("discord.js");
const Logger = require("./classes/Logger");
const path = require("path");

globalThis.dev = process.argv.includes("--dev");
const logger = new Logger();

const manager = new Discord.ShardingManager(path.join(__dirname, "index.js"), {
	token: dev ? process.env.DEV_TOKEN : process.env.TOKEN,
	totalShards: "auto",
	respawn: true,
	shardArgs: dev ? ["--dev"] : [],
});

manager.spawn().catch(console.error);
manager.on("shardCreate", (shard) => {
	logger.event(`Started shard #${shard.id + 1}.`);
});

process.on("unhandledRejection", console.log);
process.on("uncaughtException", console.log);
process.on("uncaughtExceptionMonitor", console.log);
