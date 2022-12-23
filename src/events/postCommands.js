const Discord = require("discord.js");
const Event = require("../classes/Event");
const translate = require("../functions/translate");

module.exports = new Event("ready", () => {
	if (dev) {
		var target = client.guilds.cache.get(process.env.DEV_GUILD_ID);
	} else {
		var target = client.application;
	}

	const commands = [];

	client.commands.toJSON().forEach((c) => {
		function translateOptions(options) {
			for (const option of options) {
				option.nameLocalizations = {};
				option.descriptionLocalizations = {};

				langs.forEach((lang) => {
					option.nameLocalizations[lang] = translate(
						lang.split("-")[0],
						option.name
					);

					option.descriptionLocalizations[lang] = translate(
						lang.split("-")[0],
						option.description
					);
				});

				option.name = translate("en", option.name);
				option.description = translate("en", option.description);

				translateOptions(option.options || []);
			}
		}

		translateOptions([c.options || []]);
		if (c.options.type) {
			for (let i = 0; i < c.options.type.length; i++) {
				commands.push({
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
				});
			}
		} else {
			commands.push(c.options);
		}
	});

	target?.commands.set(commands);
});
