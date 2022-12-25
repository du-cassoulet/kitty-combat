const Command = require("../../classes/Command");
const Discord = require("discord.js");

module.exports = new Command({
	options: {
		name: "LEAVE_COMMAND",
		description: "LEAVE_DESCRIPTION",
		type: [Discord.ApplicationCommandType.ChatInput],
	},
	category: Command.Categories.Game,
	execute: async function (slash, translate) {
		const inGame = client.inGame.get(slash.user.id);
		if (!inGame) {
			return slash.reply({
				content: icons.error + translate("CANT_STOP_NOT_INGAME"),
				ephemeral: true,
			});
		}

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

		const game = client.games.get(inGame);
		const botMessage = await slash.reply({
			content:
				"<:kittypaw:1054419983075115028> " +
				translate("WANT_STOP") +
				(game.starting
					? ""
					: "\n<:Reply:893527626201841744> " + translate("RECIEVE_DEFEAT")),
			components: components(false),
			ephemeral: true,
		});

		const collector = botMessage.createMessageComponentCollector({
			time: 6e4,
			max: 1,
			filter: (b) => b.isButton(),
		});

		collector.on("collect", (button) => {
			button.deferUpdate();
			if (button.customId === "yes") {
				return client.emit("stopGame", game.hostId, slash.user);
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
