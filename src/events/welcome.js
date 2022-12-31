const Event = require("../classes/Event");
const Discord = require("discord.js");

module.exports = new Event("guildMemberAdd", (member) => {
	if (member.guild.id === process.env.SUPPORT_GUILD_ID) {
		/** @type {Discord.TextChannel} */
		const channel = member.guild.channels.cache.get(
			process.env.WELCOME_CHANNEL_ID
		);

		const welcomeMessages = [
			`Oh, a lost traveler... Welcome ${member.user} to **${member.guild.name}**.`,
			`I can see someone entering, welcome ${member.user} to **${member.guild.name}**.`,
			`Wooh, welcome ${member.user} to **${member.guild.name}**.`,
			`Glad to see you ${member.user}, and welcome to **${member.guild.name}**.`,
			`Oh no... ${member.user} arrived... Welcome to **${member.guild.name}**, i guess ?`,
		];

		if (!channel) return;
		return channel.send({
			allowedMentions: { parse: ["users"] },
			content:
				"<a:vibecat:1058730958100107324> " +
				welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
		});
	}
});
