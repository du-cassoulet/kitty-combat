const Guild = require("../classes/Guild");
const Discord = require("discord.js");

/**
 * @param {Discord} guild
 */
async function getGuild(guild) {
	return Guild.form(await guilds.get(guild.id));
}

module.exports = getGuild;
