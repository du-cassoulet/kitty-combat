const Command = require("../../classes/Command");
const Discord = require("discord.js");
const helpCommand = require("../info/help");
const getCommand = require("../../functions/getCommand");
const User = require("../../classes/User");

module.exports = new Command({
	options: {
		name: "START",
		description: "START_DESCRIPTION",
		type: [Discord.ApplicationCommandType.ChatInput],
	},
	category: Command.Categories.Game,
	execute: async function (slash, translate) {
		if (!dev) {
			if (await users.has(slash.user.id)) {
				return slash.reply({
					content: icons.error + translate("ALREADY_REGISTERED"),
					ephemeral: true,
				});
			}
		}

		const user = new User()
			.setTag(slash.user.tag)
			.setAvatarURL(
				slash.user.displayAvatarURL({ extension: "png", size: 512 })
			)
			.setInv(
				new User.Inventory()
					.setCoins(dev ? 999999999 : 5000)
					.setEggs(["unknown_egg"])
			);

		await users.set(slash.user.id, user);
		logger.db(`${slash.user.tag} registered to the database.`);

		const allUsers = await users.all();
		await users.set(
			`${slash.user.id}.stats.rank`,
			allUsers
				.sort((a, b) => b.value.elo - a.value.elo)
				.findIndex((u) => u.id === slash.user.id)
		);

		function components(disabled) {
			return [
				new Discord.ActionRowBuilder().setComponents(
					new Discord.ButtonBuilder()
						.setCustomId("get-help")
						.setLabel(translate("GET_HELP"))
						.setStyle(Discord.ButtonStyle.Secondary)
						.setEmoji("1053602021808283709")
						.setDisabled(disabled)
				),
			];
		}

		const botMessage = await slash.reply({
			ephemeral: true,
			embeds: [
				new Discord.EmbedBuilder()
					.setColor(client.embedColor)
					.setTitle(translate("WELCOME", slash.user.username))
					.setThumbnail(client.user.displayAvatarURL({ size: 256 }))
					.setDescription(
						"<:catpaw:1053011873093664839> " +
							translate(
								"SUCCESSFULLY_STARTED",
								slash.user.toString(),
								getCommand("open")
							) +
							"\n\n" +
							translate(
								"STARTING_MONEY",
								`**${user.inv.coins.current.toLocaleString(slash.locale)}** ${
									icons.coin
								}`
							)
					),
			],
			components: components(false),
		});

		const collector = botMessage.createMessageComponentCollector({
			time: 6e4,
			filter: (b) => b.isButton(),
		});

		collector.on("collect", (button) => {
			helpCommand.execute(button, translate);
			collector.resetTimer();
		});

		collector.on("end", () => {
			slash.editReply({ components: components(true) });
		});
	},
});
