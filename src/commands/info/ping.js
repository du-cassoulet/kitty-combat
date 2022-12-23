const Command = require("../../classes/Command");
const Discord = require("discord.js");

module.exports = new Command({
	options: {
		name: "PING",
		description: "BOT_PING",
		type: [Discord.ApplicationCommandType.ChatInput],
	},
	category: Command.Categories.Info,
	execute: async function (slash, translate) {
		const start = process.hrtime();
		await slash.deferReply({ ephemeral: true });
		const stop = process.hrtime(start);

		return slash.editReply({
			content:
				"<a:fabulouscat:1053043411634094230> " +
				translate(
					"BOTS_PING",
					((stop[0] * 1e9 + stop[1]) / 1e6).toLocaleString(slash.locale)
				),
			ephemeral: true,
		});
	},
});
