const Command = require("../../classes/Command");
const Discord = require("discord.js");

function clean(s) {
	return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

module.exports = new Command({
	options: {
		name: "EMOJI",
		description: "GET_EMOJI",
		guildId: process.env.DEV_GUILD_ID,
		type: [Discord.ApplicationCommandType.ChatInput],
		options: [
			{
				name: "EMOJI",
				description: "EMOJI_GET",
				type: Discord.ApplicationCommandOptionType.String,
				required: true,
				autocomplete: true,
			},
		],
	},
	category: Command.Categories.Hidden,
	autocomplete: async function (slash) {
		const query = slash.options.getFocused();
		const filtered = slash.guild.emojis.cache.filter((e) =>
			clean(e.name).startsWith(clean(query))
		);

		return slash.respond(
			filtered.map((e) => ({ name: e.name, value: e.id })).slice(0, 25)
		);
	},
	execute: async function (slash) {
		const emojiId = slash.options.getString("emoji");

		return slash.reply({
			content: `\\${slash.guild.emojis.cache.get(emojiId).toString()}`,
			ephemeral: true,
		});
	},
});
