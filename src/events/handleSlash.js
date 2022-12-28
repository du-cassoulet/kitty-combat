const Event = require("../classes/Event");
const battleCommand = require("../commands/game/battle");
const getCommand = require("../functions/getCommand");
const translateBase = require("../functions/translate");

module.exports = new Event("interactionCreate", async (interaction) => {
	const lang = interaction.locale.split("-")[0];

	/**
	 * @param {import("../lang/en.json")} key
	 * @param  {...string} values
	 * @returns {string}
	 */
	function translate(key, ...values) {
		return translateBase(langs.includes(lang) ? lang : "en", key, ...values);
	}

	if (
		interaction.isChatInputCommand() ||
		interaction.isMessageContextMenuCommand() ||
		interaction.isUserContextMenuCommand()
	) {
		if (
			!(await users.has(interaction.user.id)) &&
			interaction.commandName !== "start"
		) {
			return interaction.reply({
				content:
					"<:catpaw:1053011873093664839> " +
					translate("START_TO_START", getCommand("start")),
				ephemeral: true,
			});
		}

		if (
			!((await guilds.get(`${interaction.guildId}.players`)) || []).includes(
				interaction.user.id
			)
		) {
			await guilds.push(`${interaction.guildId}.players`, interaction.user.id);
		}

		client.commands
			.get(interaction.commandName)
			.execute(interaction, translate);

		await stats.add(`commands.${interaction.commandName}`, 1);
		await users.add(`${interaction.user.id}.usages`, 1);
		logger.feed(
			`${interaction.user.tag} did the command ${interaction.commandName}`
		);
	} else if (interaction.isAutocomplete()) {
		client.commands
			.get(interaction.commandName)
			.autocomplete(interaction, translate);
	} else if (interaction.isButton()) {
		if (interaction.customId === "replay") {
			battleCommand.execute(interaction, translate);
			await stats.add("commands.battle", 1);
			await users.add(`${interaction.user.id}.usages`, 1);
			logger.feed(`${interaction.user.tag} restarted a battle`);
		}
	}
});
