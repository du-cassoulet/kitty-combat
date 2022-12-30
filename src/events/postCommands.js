const Discord = require("discord.js");
const Event = require("../classes/Event");
const translate = require("../functions/translate");

module.exports = new Event("ready", async () => {
	if (dev) {
		var target = client.guilds.cache.get(process.env.DEV_GUILD_ID);
	} else {
		var target = client.application;
	}

	const commands = [];
	const guilds = {};
	client.commands.toJSON().forEach((c) => {
		function translateOptions(options) {
			for (const option of options) {
				option.nameLocalizations = {};
				option.descriptionLocalizations = {};

				for (const choice of option.choices || []) {
					choice.nameLocalizations = {};
				}

				langs.forEach((lang) => {
					option.nameLocalizations[lang] = translate(
						lang.split("-")[0],
						option.name
					);

					option.descriptionLocalizations[lang] = translate(
						lang.split("-")[0],
						option.description
					);

					for (const choice of option.choices || []) {
						choice.nameLocalizations[lang] = translate(
							lang.split("-")[0],
							choice.name
						);
					}
				});

				option.name = translate("en", option.name);
				option.description = translate("en", option.description);

				for (const choice of option.choices || []) {
					choice.name = translate("en", choice.name);
				}

				translateOptions(option.options || []);
			}
		}

		translateOptions([c.options || []]);
		if (c.options.type) {
			for (let i = 0; i < c.options.type.length; i++) {
				const commandData = {
					...c.options,
					type: c.options.type[i],
					options:
						c.options.type[i] === Discord.ApplicationCommandType.ChatInput
							? c.options.options
							: undefined,
					description:
						c.options.type[i] === Discord.ApplicationCommandType.ChatInput
							? c.options.description
							: undefined,
					descriptionLocalizations:
						c.options.type[i] === Discord.ApplicationCommandType.ChatInput
							? c.options.descriptionLocalizations
							: undefined,
				};

				if (c.options.guildId && !dev) {
					if (guilds[c.options.guildId]) {
						guilds[c.options.guildId].push(commandData);
					} else {
						guilds[c.options.guildId] = [commandData];
					}
				} else {
					commands.push(commandData);
				}
			}
		} else {
			if (c.options.guildId && !dev) {
				if (guilds[c.options.guildId]) {
					guilds[c.options.guildId].push(c.options);
				} else {
					guilds[c.options.guildId] = [c.options];
				}
			} else {
				commands.push(c.options);
			}
		}
	});

	target?.commands?.set(commands);
	Object.entries(guilds).map(([guildId, commands]) => {
		const guild = client.guilds.cache.get(guildId);
		if (!guild) return;

		guild.commands.set(commands);
	});
});
