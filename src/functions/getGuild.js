const Guild = require("../classes/Guild");

async function getGuild(id) {
	return Guild.form(await guilds.get(id));
}

module.exports = getGuild;
