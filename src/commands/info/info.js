const Command = require("../../classes/Command");
const Discord = require("discord.js");
const getStats = require("../../functions/getStats");
const humanizeDuration = require("humanize-duration");
const byteSize = require("byte-size");

module.exports = new Command({
	options: {
		name: "INFO",
		description: "INFO_DESCRIPTION",
		type: [Discord.ApplicationCommandType.ChatInput],
	},
	category: Command.Categories.Info,
	execute: async function (slash, translate) {
		let channels = 0,
			guilds = 0,
			users = 0;

		if (client.shard) {
			const shards = await client.shard.fetchClientValues("guilds.cache");
			for (const shard of shards) {
				guilds = shard.guilds.cache.size;
				shard.guilds.cache.forEach((guild) => (users += guild.memberCount));
				shard.guilds.cache.forEach(
					(guild) => (channels += guild.channels.cache.size)
				);
			}
		} else {
			guilds = client.guilds.cache.size;
			client.guilds.cache.forEach((guild) => (users += guild.memberCount));
			client.guilds.cache.forEach(
				(guild) => (channels += guild.channels.cache.size)
			);
		}

		const allUsers = await globalThis.users.all();
		const botStats = await getStats();

		const owner = client.users.cache.get(process.env.OWNER_ID);
		const memo = process.memoryUsage();
		const used = memo.heapUsed / 1048576;
		const total = memo.heapTotal / 1048576;

		const embed = new Discord.EmbedBuilder()
			.setColor(client.embedColor)
			.setThumbnail(client.user.displayAvatarURL({ size: 512 }))
			.setTitle("🛈 " + translate("BOT_INFO", client.user.username))
			.setURL("https://discord.com/users/" + client.user.id)
			.setDescription(
				translate(
					"BOT_STATS",
					`**${guilds.toLocaleString(slash.locale)}**`,
					`**${users.toLocaleString(slash.locale)}**`,
					`**${channels.toLocaleString(slash.locale)}**`
				) +
					"\n" +
					translate(
						"CREATED_BY",
						slash.guild.members.cache.get(owner.id)?.user?.toString() ||
							(owner
								? `[${owner.tag}](https://discord.com/users/${owner.id})`
								: "DU CASSOULET")
					) +
					"\n" +
					translate(
						"MEMORY",
						`**${Math.round(used * 100) / 100}MB / ${
							Math.round(total * 100) / 100
						}MB**`
					) +
					"\n" +
					translate(
						"UPTIME",
						`**${humanizeDuration(client.uptime, {
							language: slash.locale.split("-")[0],
							round: true,
						})}**`
					) +
					"\n" +
					translate(
						"TIME_PLAYED",
						`**${humanizeDuration(botStats.time, {
							language: slash.locale.split("-")[0],
							round: true,
						})}**`
					) +
					"\n\n" +
					translate(
						"IMAGES_GENERATED",
						`**${botStats.images.number.toLocaleString(slash.locale)}**`
					) +
					"\n" +
					translate("IMAGES_UPLOADED", `**${byteSize(botStats.images.size)}**`)
			)
			.setFields(
				{
					name:
						"<:pinkarrow:1053997226759827507> " + translate("MOST_COMMANDS"),
					value: Object.entries(botStats.commands)
						.sort((a, b) => b[1] - a[1])
						.slice(0, 5)
						.map(
							(c, i) =>
								`${i + 1}. **${
									c[0].charAt(0).toUpperCase() +
									c[0].slice(1).replace(/-/g, " ")
								}** (${c[1].toLocaleString(slash.locale)})`
						)
						.join("\n"),
					inline: true,
				},
				{
					name:
						"<:N_:718506491660992735><:pinkarrow:1053997226759827507> " +
						translate("MOST_COMMANDS_USER"),
					value: allUsers
						.filter((u) => u.value.usages)
						.sort((a, b) => b.value.usages - a.value.usages)
						.map(
							({ value: v }, i) =>
								`> ${i + 1}. **${v.tag}** (${v.usages.toLocaleString(
									slash.locale
								)})`
						)
						.join("\n"),
					inline: true,
				}
			);

		return await slash.reply({
			embeds: [embed],
		});
	},
});
