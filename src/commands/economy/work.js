const Command = require("../../classes/Command");
const Discord = require("discord.js");
const getUser = require("../../functions/getUser");

const WORK_INTERVAL = 2.16e7;

module.exports = new Command({
	options: {
		name: "WORK",
		description: "WORK_MONEY",
		type: [Discord.ApplicationCommandType.ChatInput],
	},
	category: Command.Categories.Economy,
	execute: async function (slash, translate) {
		const data = await getUser(slash.user);
		if (data.cooldowns.work + WORK_INTERVAL > Date.now()) {
			return slash.reply({
				content:
					icons.error +
					translate(
						"ALREADY_WORKED",
						`<t:${Math.round((data.cooldowns.work + WORK_INTERVAL) / 1000)}:R>`
					),
				ephemeral: true,
			});
		}

		const coins = Math.floor(Math.random() * 751) + 750;

		await users.set(`${slash.user.id}.cooldowns.work`, Date.now());
		await users.add(`${slash.user.id}.inv.coins.current`, coins);

		if (data.inv.coins.highest < data.inv.coins.current + coins) {
			await users.set(
				`${slash.user.id}.inv.coins.highest`,
				data.inv.coins.current + coins
			);
		}

		return slash.reply({
			content:
				"<a:dollar:1058520807288090646> " +
				translate(
					"WORKED_HARD",
					slash.user.toString(),
					`**${coins.toLocaleString(slash.locale)}** ${icons.coin}`
				),
		});
	},
});
