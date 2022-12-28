const Command = require("../../classes/Command");
const Discord = require("discord.js");

module.exports = new Command({
	options: {
		name: "DELETE",
		description: "DELETE_DESCRIPTION",
		guildId: process.env.SUPPORT_GUILD_ID,
		options: [
			{
				name: "ACCOUNT",
				description: "DELETE_DESCRIPTION",
				type: Discord.ApplicationCommandOptionType.Subcommand,
			},
		],
	},
	category: Command.Categories.Game,
	execute: async function (slash, translate) {
		function components(disabled) {
			return [
				new Discord.ActionRowBuilder().setComponents(
					new Discord.ButtonBuilder()
						.setStyle(Discord.ButtonStyle.Success)
						.setLabel(translate("YES"))
						.setCustomId("yes")
						.setEmoji("1054712306518458368")
						.setDisabled(disabled),
					new Discord.ButtonBuilder()
						.setStyle(Discord.ButtonStyle.Danger)
						.setLabel(translate("NO"))
						.setCustomId("no")
						.setEmoji("1054713221883363399")
						.setDisabled(disabled)
				),
			];
		}

		const botMessage = await slash.reply({
			content: "<:kittypaw:1054419983075115028> " + translate("WANT_DELETE"),
			components: components(false),
			ephemeral: true,
		});

		const collector = botMessage.createMessageComponentCollector({
			time: 6e4,
			max: 1,
			filter: (b) => b.isButton(),
		});

		collector.on("collect", async (button) => {
			if (button.customId === "yes") {
				await users.delete(slash.user.id);
				return button.reply({
					content: icons.success + translate("DELETED_ACCOUNT"),
					ephemeral: true,
				});
			} else {
				return button.deferUpdate();
			}
		});

		collector.on("end", () => {
			if (slash.isRepliable()) {
				return slash.editReply({
					components: components(true),
				});
			}
		});
	},
});
