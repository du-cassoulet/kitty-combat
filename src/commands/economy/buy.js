const Command = require("../../classes/Command");
const Discord = require("discord.js");
const eggs = require("../../storage/json/eggs.json");
const getUser = require("../../functions/getUser");

function clean(s) {
	return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

module.exports = new Command({
	options: {
		name: "BUY",
		description: "BUY_ITEM",
		type: [Discord.ApplicationCommandType.ChatInput],
		options: [
			{
				name: "EGG",
				description: "EGGS_DESCRIPTION",
				type: Discord.ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "EGG",
						description: "EGG_BUY",
						type: Discord.ApplicationCommandOptionType.String,
						autocomplete: true,
						required: true,
					},
					{
						name: "AMOUNT",
						description: "AMOUNT_BUY",
						type: Discord.ApplicationCommandOptionType.Integer,
						required: false,
						minValue: 1,
						maxValue: 10,
					},
				],
			},
		],
	},
	category: Command.Categories.Economy,
	autocomplete: async function (slash, translate) {
		const query = slash.options.getFocused();
		const filtered = eggs.filter((egg) =>
			clean(translate(egg.name)).startsWith(clean(query))
		);

		return slash.respond(
			filtered
				.map((egg) => ({ name: translate(egg.name), value: egg.id }))
				.slice(0, 25)
		);
	},
	execute: async function (slash, translate) {
		const option = slash.options.getSubcommand();

		switch (option) {
			case "egg": {
				const eggId = slash.options.getString("egg");
				const amount = slash.options.getInteger("amount") || 1;
				const egg = eggs.find((e) => e.id === eggId);
				const data = await getUser(slash.user.id);

				if (!egg) {
					return slash.reply({
						content: icons.error + translate("INVALID_EGG"),
						ephemeral: true,
					});
				}

				if (data.inv.coins.current < egg.price * amount) {
					return slash.reply({
						content: icons.error + translate("NOT_ENOUGH_COINS"),
						ephemeral: true,
					});
				}

				const userEggs = data.inv.eggs;
				for (let i = 0; i < amount; i++) {
					userEggs.push(eggId);
				}

				await users.set(`${slash.user.id}.inv.eggs`, userEggs);
				await users.sub(
					`${slash.user.id}.inv.coins.current`,
					egg.price * amount
				);

				return slash.reply({
					content:
						icons.new +
						translate(
							"BOUGHT_ITEM",
							`**${amount.toLocaleString(slash.locale)}**`,
							`**${translate(egg.name)}**`,
							`**${(egg.price * amount).toLocaleString(slash.locale)}** ${
								icons.coin
							}`
						),
				});
			}
		}
	},
});
