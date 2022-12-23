const Command = require("../../classes/Command");
const Discord = require("discord.js");
const eggs = require("../../storage/json/eggs.json");
const rarities = require("../../storage/json/rarities.json");
const path = require("path");
const User = require("../../classes/User");
const getCommand = require("../../functions/getCommand");
const getUser = require("../../functions/getUser");
const Cats = require("../../classes/Cats");

function clean(s) {
	return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

module.exports = new Command({
	options: {
		name: "OPEN",
		description: "OPEN_DESCRIPTION",
		type: [Discord.ApplicationCommandType.ChatInput],
		options: [
			{
				name: "EGG",
				description: "EGG_NAME",
				type: Discord.ApplicationCommandOptionType.String,
				required: true,
				autocomplete: true,
			},
		],
	},
	category: Command.Categories.Game,
	autocomplete: async function (slash, translate) {
		const query = slash.options.getFocused();
		const data = await getUser(slash.user.id);
		if (!data) return slash.respond([]);

		const userEggs = data.inv.eggs.map((id) =>
			eggs.find((egg) => egg.id === id)
		);
		const filtered = userEggs.filter((egg) =>
			clean(translate(egg.name)).startsWith(clean(query))
		);

		return slash.respond(
			filtered
				.map((egg) => ({ name: translate(egg.name), value: egg.id }))
				.slice(0, 25)
		);
	},
	execute: async function (slash, translate) {
		const data = await getUser(slash.user.id);
		const userEggIDs = data.inv.eggs;
		const eggId = slash.options.getString("egg");

		if (!userEggIDs.includes(eggId)) {
			return slash.reply({
				content: icons.error + translate("NO_OWN_EGG"),
				ephemeral: true,
			});
		}

		const egg = eggs.find((e) => e.id === eggId);
		const openTime = dev ? 1000 : egg.openTime;

		await slash.reply({
			content:
				icons.loading +
				translate(
					"OPENED_IN",
					`**${translate(egg.name)}**`,
					`<t:${Math.floor((Date.now() + openTime) / 1000)}:R>`
				),
		});

		const eggRarities = [...egg.rarities];
		eggRarities.forEach((_, i) => {
			eggRarities[i] = egg.rarities.slice(0, i + 1).reduce((a, b) => a + b, 0);
		});

		const random = Math.floor(Math.random() * 100) + 1;
		let rarity = 0;

		eggRarities.forEach((r, i) => {
			if (r < random) {
				rarity = i + 1;
			}
		});

		const rarityCats = Object.values(Cats).filter((c) => c.rarity === rarity);
		const cat = rarityCats[Math.floor(Math.random() * rarityCats.length)];

		return setTimeout(async () => {
			const embed = new Discord.EmbedBuilder()
				.setColor(client.embedColor)
				.setThumbnail(`attachment://${cat.id}.png`)
				.setTitle(translate("EGG_HATCHED"));

			userEggIDs.splice(userEggIDs.indexOf(eggId), 1);
			await users.set(`${slash.user.id}.inv.eggs`, userEggIDs);
			await users.add(`${slash.user.id}.inv.eggsOpened`, 1);

			const userCats = data.inv.cats;
			const userCat = User.Cat.form(userCats.find((c) => c.catId === cat.id));

			if (userCat) {
				userCats.find((c) => c.catId === cat.id).souls++;
				await users.set(`${slash.user.id}.inv.cats`, userCats);

				embed.setDescription(
					"<a:fabulouscat:1053043411634094230> " +
						translate(
							"USER_GOT_SOUL",
							`${icons.medaillon} **${translate("CAT_SOUL")}**`,
							`**${userCat.name || translate("UNNAMED_CAT")}**`,
							`${translate(cat.name)}, ${
								rarities[cat.rarity].emoji
							} ${translate(rarities[cat.rarity].name)}`
						) +
						"\n\n" +
						translate("ACTION_CAT", getCommand("cat see"))
				);
			} else {
				await users.set(`${slash.user.id}.inv.selectedCat`, cat.id);
				await users.push(
					`${slash.user.id}.inv.cats`,
					new User.Cat()
						.setCatId(cat.id)
						.setName(null)
						.setSouls(1)
						.setDamages(0, 1)
						.setDefence(0, 1)
				);

				embed.setDescription(
					"<a:fabulouscat:1053043411634094230> " +
						translate(
							"USER_GOT",
							slash.user.toString(),
							`**${translate(cat.name)}** (${
								rarities[cat.rarity].emoji
							} ${translate(rarities[cat.rarity].name)})`
						) +
						"\n\n" +
						translate("ACTION_CAT", getCommand("cat see")) +
						"\n\n" +
						translate("DO_RENAME", getCommand("cat rename"))
				);
			}

			if (slash.isRepliable()) {
				return slash.editReply({
					content: null,
					embeds: [embed],
					files: [
						new Discord.AttachmentBuilder(
							path.join(__dirname, "../../assets/images/cats", cat.image),
							{ name: `${cat.id}.png` }
						),
					],
				});
			}
		}, openTime - client.ws.ping * 2);
	},
});
