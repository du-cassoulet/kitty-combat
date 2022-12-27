const Command = require("../../classes/Command");
const Discord = require("discord.js");
const eggs = require("../../storage/json/eggs.json");
const getCommand = require("../../functions/getCommand");
const getUser = require("../../functions/getUser");

module.exports = new Command({
	options: {
		name: "SHOP",
		description: "SHOP_DESCRIPTION",
		type: [Discord.ApplicationCommandType.ChatInput],
		options: [
			{
				name: "EGGS",
				description: "EGGS_DESCRIPTION",
				type: Discord.ApplicationCommandOptionType.Subcommand,
			},
		],
	},
	category: Command.Categories.Economy,
	execute: async function (slash, translate) {
		const option = slash.options.getSubcommand();
		const data = await getUser(slash.user);
		const coins = data.inv.coins.current;

		switch (option) {
			case "eggs": {
				return slash.reply({
					embeds: [
						new Discord.EmbedBuilder()
							.setColor(client.embedColor)
							.setTitle(translate("EGG_SHOP"))
							.setDescription(
								"<:info:1053602021808283709> " +
									translate(
										"DO_BUY",
										getCommand("buy egg"),
										`**${coins.toLocaleString(slash.locale)}** ${icons.coin}`
									)
							)
							.setFields(
								...eggs.map((e) => ({
									name: translate(e.name),
									value:
										"<:Reply_Continued:893779129999192065> " +
										translate(e.description) +
										"\n<:Reply:893527626201841744> **" +
										e.price.toLocaleString(slash.locale) +
										"** " +
										icons.coin,
									inline: false,
								}))
							),
					],
				});
			}
		}
	},
});
