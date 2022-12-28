require("dotenv").config();
const Client = require("./classes/Client");
const { QuickDB } = require("quick.db");
const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");
const Logger = require("./classes/Logger");

globalThis.logger = new Logger();
globalThis.client = new Client();
globalThis.dev = process.argv.includes("--dev");
globalThis.db = new QuickDB({
	filePath: dev
		? "./src/storage/db/dev.sqlite"
		: "./src/storage/db/prod.sqlite",
});

globalThis.icons = {
	coin: "<:coin:1053355084408430723>",
	exp: "<:exp:1055888214646325258>",
	error: "<:failure:1056328628234895466> ",
	success: "<:success:1056328626628460635> ",
	medaillon: "<:medaillon:1053752728536494120>",
	loading: "<a:loading:1054352045483753552> ",
	new: "<:new1:1053347241705885776><:new2:1053347240535670854> ",
	players: [
		"<:reduser:1054364061162274826>",
		"<:yellowuser:1054364059367116874>",
	],
};

globalThis.users = db.table("users");
globalThis.guilds = db.table("guilds");
globalThis.stats = db.table("stats");

globalThis.langs = [];
const files = fs.readdirSync(path.join(__dirname, "./lang"));
for (const file of files) {
	globalThis.langs = [
		...globalThis.langs,
		...require(path.join(__dirname, "./lang", file)).config.langs,
	];
}

Canvas.registerFont(path.join(__dirname, "./assets/fonts/SecularOne.ttf"), {
	family: "SecularOne",
});

Canvas.registerFont(path.join(__dirname, "./assets/fonts/Anton.ttf"), {
	family: "Anton",
});

client.start(dev ? process.env.DEV_TOKEN : process.env.TOKEN);

process.on("unhandledRejection", console.log);
process.on("uncaughtException", console.log);
process.on("uncaughtExceptionMonitor", console.log);
