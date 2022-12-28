const Canvas = require("canvas");
const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const translate = require("../functions/translate");
const Command = require("./Command");
const Game = require("./Game");
const Cats = require("./Cats");

class Client extends Discord.Client {
	constructor() {
		const intents = [
			Discord.IntentsBitField.Flags.Guilds,
			Discord.IntentsBitField.Flags.GuildVoiceStates,
		];

		super({ intents });

		/** @type {Discord.Collection<string,Command>} */
		this.commands = new Discord.Collection();

		/** @type {Discord.Collection<string,Game>} */
		this.games = new Discord.Collection();

		/** @type {Discord.Collection<string,string>} */
		this.inGame = new Discord.Collection();

		/** @type {Discord.Collection<string,Canvas.Image>} */
		this.catImages = new Discord.Collection();

		/** @type {{channel:Discord.Channel,userId:Discord.User}[]} */
		this.voiceChannels = [];

		this.embedColor = "#181c25";
	}

	async #loadCatImages() {
		for (const [name, data] of Object.entries(Cats)) {
			this.catImages.set(
				name,
				await Canvas.loadImage(
					path.join(__dirname, "../assets/images/cats", data.image)
				)
			);
		}

		return this.catImages;
	}

	#eventHandler() {
		const files = fs.readdirSync(path.join(__dirname, "../events"));

		for (const file of files) {
			/** @type {import("./Event")} */
			const event = require(path.join(__dirname, "../events", file));
			this.on(event.name, event.execute);

			logger.log(`Event ${event.name} loaded.`);
		}
	}

	#commandHandler(mainPath = path.join(__dirname, "../commands")) {
		const dirs = fs.readdirSync(mainPath);

		for (const dir of dirs) {
			if (fs.statSync(path.join(mainPath, dir)).isDirectory()) {
				this.#commandHandler(path.join(mainPath, dir));
			} else {
				/** @type {import("./Command")} */
				const command = require(path.join(mainPath, dir));
				const commandName = translate("en", command.options.name);

				this.commands.set(commandName, command);
				logger.log(`Command ${commandName} loaded.`);
			}
		}
	}

	async start(token) {
		this.login(token);

		await this.#eventHandler();
		await this.#commandHandler();
		await this.#loadCatImages();

		this.once("ready", (client) => {
			logger.event(`The bot ${client.user.tag} successfully started.`);
		});
	}
}

module.exports = Client;
