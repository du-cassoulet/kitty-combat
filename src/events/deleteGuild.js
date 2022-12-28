const Discord = require("discord.js");
const Event = require("../classes/Event");

module.exports = new Event("guildDelete", async (guild) => {
	if (client.shard) {
		const numbers = await client.shard.fetchClientValues("guilds.cache.size");
		var guildNumber = numbers.reduce((a, b) => a + b, 0);
	} else {
		var guildNumber = client.guilds.cache.size;
	}

	const fields = [
		{
			name: "Guild ID",
			value: `\`\`\`${guild.id}\`\`\``,
			inline: false,
		},
		{
			name: "Created at",
			value: `<t:${Math.round(guild.createdAt / 1000)}>`,
			inline: false,
		},
		{
			name: "Member count",
			value:
				guild.memberCount.toLocaleString() +
				"/" +
				guild.maximumMembers.toLocaleString(),
			inline: true,
		},
		{
			name: "Verification level",
			value: ["No verification", "Low", "Medium", "High", "Very high"][
				guild.verificationLevel
			],
			inline: true,
		},
		{
			name: "Tags",
			value: `${
				guild.features
					.map((f) => {
						if (f === "PARTNERED") {
							return "<:partnered:1056305758700056646>";
						}

						if (f === "VERIFIED") {
							return "<:verified:1056305757571792966>";
						}

						if (f === "COMMUNITY") {
							return "<:community:1056307269651939369>";
						}

						if (f === "DISCOVERABLE") {
							return "<:discovery:1056307490280710175>";
						}

						if (f === "DISCOVERABLE") {
							return "<:discovery:1056307490280710175>";
						}

						if (f === "DEVELOPER_SUPPORT_SERVER") {
							return "<:support_server:1056309166634967050>";
						}

						return "";
					})
					.join(" ") || "No tags"
			}`,
			inline: true,
		},
	];

	const embed = new Discord.EmbedBuilder()
		.setColor("#e33030")
		.setThumbnail(guild.iconURL())
		.setTitle("Left " + guild.name)
		.addFields(fields)
		.setFooter({ text: "Server number #" + guildNumber.toLocaleString() });

	if (guild.vanityURLCode) {
		embed.setURL(`https://discord.gg/${guild.vanityURLCode}`);
	}

	if (guild.description) {
		embed.setDescription(guild.description);
	}

	const messagePayload = {
		embeds: [embed],
	};

	if (client.shard) {
		client.shard.broadcastEval(
			(client, context) => {
				const guild = client.guilds.cache.get(context.guildId);
				if (!guild) return;

				const channel = guild.channels.cache.get(context.channelId);
				if (!channel) return;

				channel.send(context.messagePayload);
			},
			{
				context: {
					guildId: process.env.SUPPORT_GUILD_ID,
					channelId: process.env.JOIN_CHANNEL_ID,
					messagePayload,
				},
			}
		);
	} else {
		const guild = client.guilds.cache.get(process.env.SUPPORT_GUILD_ID);
		if (!guild) return;

		const channel = guild.channels.cache.get(process.env.JOIN_CHANNEL_ID);
		if (!channel) return;

		channel.send(messagePayload);
	}
});
