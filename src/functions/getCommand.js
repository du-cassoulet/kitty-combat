function getCommand(commandName) {
	if (dev) {
		var target = client.guilds.cache.get(process.env.DEV_GUILD_ID);
	} else {
		var target = client.application;
	}

	const commandId = target.commands.cache.find(
		(c) => c.name === commandName.split(/\s+/)[0]
	)?.id;

	if (!commandId) return "`/" + commandName + "`";
	return `</${commandName}:${commandId}>`;
}

module.exports = getCommand;
