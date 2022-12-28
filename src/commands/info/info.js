const Command = require("../../classes/Command");
const Discord = require("discord.js");
const getStats = require("../../functions/getStats");
const humanizeDuration = require("humanize-duration");
const byteSize = require("byte-size");
const Stats = require("../../classes/Stats");

/**
 * @param {Stats} botStats
 */
function getUptime(botStats) {
	const emojis = [
		[
			"<:ll:1057633808700149770>",
			"<:lg:1057633807093747795>",
			"<:lo:1057633715783737404>",
			"<:lr:1057633805776732220>",
			"<:lv:1057641620276781166>",
		],
		[
			"<:gl:1057633804489076817>",
			"<:gg:1057634128142549072>",
			"<:go:1057633712151470120>",
			"<:gr:1057633803490832465>",
			"<:gv:1057641618875887666>",
		],
		[
			"<:ol:1057633709932687481>",
			"<:og:1057633701401460796>",
			"<:oo:1057633708309495878>",
			"<:or:1057633707042803783>",
			"<:ov:1057641617462411335>",
		],
		[
			"<:rl:1057633705734180966>",
			"<:rg:1057633704664645652>",
			"<:ro:1057633703460872282>",
			"<:rr:1057633702420693062>",
			"<:rv:1057641615679836222>",
		],
		[
			"<:vl:1057638191059968031>",
			"<:vg:1057638189445165066>",
			"<:vo:1057638187721314345>",
			"<:vr:1057638186483982457>",
			"<:vv:1057638192280506398>",
		],
	];

	function getVal(n) {
		if (n > 75) return { i: 0, n };
		if (n > 50) return { i: 1, n };
		if (n > 25) return { i: 2, n };
		if (n > 0) return { i: 3, n };
		return { i: 4, n };
	}

	let str = "";
	let sum = 0;
	for (let i = 0; i < 12; i++) {
		let [a, b] = [
			{ i: 0, n: botStats.uptime[(i * 2) % 24] },
			{ i: 0, n: botStats.uptime[(i * 2 + 1) % 24] },
		];

		if (botStats.uptime.lastHour !== i * 2) {
			a = getVal(botStats.uptime[(i * 2) % 24] || 0);
		}

		if (botStats.uptime.lastHour !== i * 2 + 1) {
			b = getVal(botStats.uptime[(i * 2 + 1) % 24] || 0);
		}

		sum += a.n;
		sum += b.n;
		if (botStats.uptime.lastHour > i * 2) {
			str += emojis[a.i][b.i];
		} else {
			str = emojis[a.i][b.i] + str;
		}
	}

	return { prog: str, per: Math.round(sum / 8.64e3) / 100 };
}

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
		const uptime = getUptime(botStats);

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
					translate(
						"IMAGES_UPLOADED",
						`**${byteSize(botStats.images.size)}**`
					) +
					"\n\n" +
					translate(
						"UPTIME",
						`**${humanizeDuration(client.uptime, {
							language: slash.locale.split("-")[0],
							round: true,
						})}**`
					) +
					"\n" +
					uptime.prog +
					" " +
					uptime.per.toLocaleString(slash.locale) +
					"%"
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
