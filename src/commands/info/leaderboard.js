const Command = require("../../classes/Command");
const Discord = require("discord.js");
const getGuild = require("../../functions/getGuild");
const Canvas = require("canvas");
const getRank = require("../../functions/getRank");
const path = require("path");
const getColor = require("../../functions/getColor");

const itemPerPage = 5;
const ih = 75;
const iw = 400;
const ig = 15;
const gap = 15;
const hs = 80;

let woodIcon = null;
let bronzeIcon = null;
let silverIcon = null;
let goldIcon = null;
let diamondIcon = null;
let coinIcon = null;
let swordIcon = null;

Canvas.loadImage(
	path.join(__dirname, "../../assets/images/ranks/wood.png")
).then((img) => (woodIcon = img));

Canvas.loadImage(
	path.join(__dirname, "../../assets/images/ranks/bronze.png")
).then((img) => (bronzeIcon = img));

Canvas.loadImage(
	path.join(__dirname, "../../assets/images/ranks/silver.png")
).then((img) => (silverIcon = img));

Canvas.loadImage(
	path.join(__dirname, "../../assets/images/ranks/gold.png")
).then((img) => (goldIcon = img));

Canvas.loadImage(
	path.join(__dirname, "../../assets/images/ranks/diamond.png")
).then((img) => (diamondIcon = img));

Canvas.loadImage(path.join(__dirname, "../../assets/images/sword.png")).then(
	(img) => (swordIcon = img)
);

Canvas.loadImage(path.join(__dirname, "../../assets/images/coin.png")).then(
	(img) => (coinIcon = img)
);

module.exports = new Command({
	options: {
		name: "LEADERBOARD",
		description: "LEADERBOARD_DESCRIPTION",
		type: [Discord.ApplicationCommandType.ChatInput],
		options: [
			{
				name: "ELO_SUB",
				description: "ELO_DESCRIPTION",
				type: Discord.ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "MODE",
						description: "MODE_DESCRIPTION",
						type: Discord.ApplicationCommandOptionType.String,
						required: true,
						choices: [
							{
								name: "GLOBAL",
								value: "global",
							},
							{
								name: "SERVER_ONLY",
								value: "server",
							},
						],
					},
				],
			},
			{
				name: "COINS",
				description: "COINS_DESCRIPTION",
				type: Discord.ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "MODE",
						description: "MODE_DESCRIPTION",
						type: Discord.ApplicationCommandOptionType.String,
						required: true,
						choices: [
							{
								name: "GLOBAL",
								value: "global",
							},
							{
								name: "SERVER_ONLY",
								value: "server",
							},
						],
					},
				],
			},
			{
				name: "WINS",
				description: "WINS_DESCRIPTION",
				type: Discord.ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "MODE",
						description: "MODE_DESCRIPTION",
						type: Discord.ApplicationCommandOptionType.String,
						required: true,
						choices: [
							{
								name: "GLOBAL",
								value: "global",
							},
							{
								name: "SERVER_ONLY",
								value: "server",
							},
						],
					},
				],
			},
			{
				name: "LOSSES",
				description: "LOSSES_DESCRIPTION",
				type: Discord.ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "MODE",
						description: "MODE_DESCRIPTION",
						type: Discord.ApplicationCommandOptionType.String,
						required: true,
						choices: [
							{
								name: "GLOBAL",
								value: "global",
							},
							{
								name: "SERVER_ONLY",
								value: "server",
							},
						],
					},
				],
			},
		],
	},
	category: Command.Categories.Info,
	execute: async function (slash, translate) {
		function numUnit(num) {
			if (num > 999999999) {
				return `${(Math.floor(num / 1e8) / 10).toLocaleString(slash.locale)}Md`;
			}

			if (num > 999999) {
				return `${(Math.floor(num / 1e5) / 10).toLocaleString(slash.locale)}M`;
			}

			if (num > 999) {
				return `${(Math.floor(num / 1e2) / 10).toLocaleString(slash.locale)}K`;
			}
			return num.toLocaleString();
		}

		const filter = slash.options.getSubcommand();
		const mode = slash.options.getString("mode");

		let players = await users.all();
		players = [...players, ...players];
		let page = 0;

		if (mode === "server") {
			const guild = await getGuild(slash.guildId);
			players = players.filter((p) => guild.players.includes(p.id));
		}

		switch (filter) {
			case "elo": {
				players = players.sort((a, b) => b.value.elo - a.value.elo);
				break;
			}

			case "coins": {
				players = players.sort(
					(a, b) => b.value.inv.coins.current - a.value.inv.coins.current
				);
				break;
			}

			case "wins": {
				players = players.sort(
					(a, b) => b.value.stats.wins - a.value.stats.wins
				);
				break;
			}

			case "losses": {
				players = players.sort(
					(a, b) => b.value.stats.losses - a.value.stats.losses
				);
				break;
			}
		}

		const maxPage = Math.ceil(players.length / itemPerPage);
		const myPage = Math.floor(
			players.findIndex((p) => p.id === slash.user.id) / itemPerPage
		);

		function makeLead() {
			const canvas = Canvas.createCanvas(
				iw + gap * 2,
				ih * itemPerPage + ig * (itemPerPage - 1) + gap * 2 + hs
			);
			const ctx = canvas.getContext("2d");

			/**
			 * @param {number} x
			 * @param {number} y
			 * @param {number} width
			 * @param {number} height
			 * @param {number} radius
			 */
			ctx.fillRoundRect = function (x, y, width, height, radius) {
				this.beginPath();
				this.moveTo(x + radius, y);
				this.lineTo(x + width - radius, y);
				this.quadraticCurveTo(x + width, y, x + width, y + radius);
				this.lineTo(x + width, y + height - radius);
				this.quadraticCurveTo(
					x + width,
					y + height,
					x + width - radius,
					y + height
				);
				this.lineTo(x + radius, y + height);
				this.quadraticCurveTo(x, y + height, x, y + height - radius);
				this.lineTo(x, y + radius);
				this.quadraticCurveTo(x, y, x + radius, y);
				this.closePath();
				this.fill();
			};

			/**
			 * @param {number} x
			 * @param {number} y
			 * @param {number} width
			 * @param {number} height
			 * @param {number} radius
			 */
			ctx.strokeRoundRect = function (x, y, width, height, radius) {
				this.beginPath();
				this.moveTo(x + radius, y);
				this.lineTo(x + width - radius, y);
				this.quadraticCurveTo(x + width, y, x + width, y + radius);
				this.lineTo(x + width, y + height - radius);
				this.quadraticCurveTo(
					x + width,
					y + height,
					x + width - radius,
					y + height
				);
				this.lineTo(x + radius, y + height);
				this.quadraticCurveTo(x, y + height, x, y + height - radius);
				this.lineTo(x, y + radius);
				this.quadraticCurveTo(x, y, x + radius, y);
				this.closePath();
				this.stroke();
			};

			ctx.fillStyle = "#141517";
			ctx.fillRoundRect(0, 0, canvas.width, canvas.height, 15);

			ctx.fillStyle = "#fff1";
			ctx.fillRoundRect(gap, gap, canvas.width - gap * 2, hs - gap * 2, 10);

			ctx.font = "23px SecularOne";
			ctx.fillStyle = "#fff";
			ctx.textBaseline = "middle";

			switch (filter) {
				case "elo": {
					ctx.fillText(translate("ELO_RANKING"), hs - gap + 8, hs / 2);
					ctx.drawImage(
						diamondIcon,
						gap + 12,
						gap + 8,
						hs - gap * 2 - 16,
						hs - gap * 2 - 16
					);
					break;
				}

				case "coins": {
					ctx.fillText(translate("COINS_RANKING"), hs - gap + 8, hs / 2);
					ctx.drawImage(
						coinIcon,
						gap + 12,
						gap + 8,
						hs - gap * 2 - 16,
						hs - gap * 2 - 16
					);
					break;
				}

				case "wins": {
					ctx.fillText(translate("WINS_RANKING"), hs - gap + 8, hs / 2);
					ctx.drawImage(
						swordIcon,
						gap + 12,
						gap + 8,
						hs - gap * 2 - 16,
						hs - gap * 2 - 16
					);
					break;
				}

				case "losses": {
					ctx.fillText(translate("LOSSES_RANKING"), hs - gap + 8, hs / 2);
					ctx.drawImage(
						swordIcon,
						gap + 12,
						gap + 8,
						hs - gap * 2 - 16,
						hs - gap * 2 - 16
					);
					break;
				}
			}

			ctx.lineWidth = 2;
			ctx.strokeStyle = "#fff1";
			ctx.beginPath();
			ctx.moveTo(gap, hs);
			ctx.lineTo(canvas.width - gap, hs);
			ctx.stroke();

			ctx.lineWidth = 6;
			ctx.textBaseline = "alphabetic";
			for (let i = 0; i < itemPerPage; i++) {
				const user = players[i + page * itemPerPage];
				if (!user) {
					ctx.fillStyle = "#0004";
					ctx.fillRoundRect(gap, hs + gap + i * (ih + ig), iw, ih, 10);
					continue;
				}

				ctx.fillStyle = "#2a2b33";
				ctx.strokeStyle = "#191a1f";
				ctx.save();
				ctx.fillRoundRect(gap, hs + gap + i * (ih + ig), iw, ih, 10);
				ctx.clip();

				if (user.value.inv.selectedCat) {
					const color = getColor(
						client.catImages.get(user.value.inv.selectedCat)
					).hex;

					const fillGradient = ctx.createLinearGradient(
						gap,
						hs + gap + i * (ih + ig) + ih / 2,
						gap + iw,
						hs + gap + i * (ih + ig) + ih / 2
					);

					const strokeGradient = ctx.createLinearGradient(
						gap,
						hs + gap + i * (ih + ig) + ih / 2,
						gap + iw,
						hs + gap + i * (ih + ig) + ih / 2
					);

					fillGradient.addColorStop(0, color + "88");
					fillGradient.addColorStop(1, color + "00");

					strokeGradient.addColorStop(0, "#191a1f");
					strokeGradient.addColorStop(1, color);

					ctx.fillStyle = fillGradient;
					ctx.fillRect(gap, hs + gap + i * (ih + ig), iw, ih);

					ctx.strokeStyle = strokeGradient;
				}

				switch (getRank(user.value.elo).name) {
					case "WOOD": {
						ctx.drawImage(
							woodIcon,
							gap + 10,
							hs + gap + 10 + i * (ih + ig) + 2,
							ih - 20,
							ih - 20
						);
						break;
					}

					case "BRONZE": {
						ctx.drawImage(
							bronzeIcon,
							gap + 10,
							hs + gap + 10 + i * (ih + ig) + 2,
							ih - 20,
							ih - 20
						);
						break;
					}

					case "SILVER": {
						ctx.drawImage(
							silverIcon,
							gap + 10,
							hs + gap + 10 + i * (ih + ig) + 2,
							ih - 20,
							ih - 20
						);
						break;
					}

					case "GOLD": {
						ctx.drawImage(
							goldIcon,
							gap + 10,
							hs + gap + 10 + i * (ih + ig) + 2,
							ih - 20,
							ih - 20
						);
						break;
					}

					case "DIAMOND": {
						ctx.drawImage(
							diamondIcon,
							gap + 10,
							hs + gap + 10 + i * (ih + ig) + 2,
							ih - 20,
							ih - 20
						);
						break;
					}
				}

				ctx.font = "20px SecularOne";
				ctx.fillStyle = "#fff";
				ctx.fillText(
					(i + page * itemPerPage + 1).toLocaleString(slash.locale) +
						". " +
						user.value.tag.split("#")[0],
					gap + ih,
					hs + gap + 37 + i * (ih + ig)
				);

				ctx.font = "15px SecularOne";
				ctx.fillStyle = "#fff8";
				ctx.fillText(
					"#" + user.value.tag.split("#")[1],
					gap + ih,
					hs + gap + 55 + i * (ih + ig)
				);

				ctx.font = "20px SecularOne";
				ctx.fillStyle = "#fffa";
				ctx.textAlign = "right";
				ctx.textBaseline = "middle";

				switch (filter) {
					case "elo": {
						ctx.fillText(
							user.value.elo.toLocaleString(slash.locale),
							iw - gap,
							hs + gap + i * (ih + ig) + ih / 2
						);
						break;
					}

					case "coins": {
						ctx.fillText(
							numUnit(user.value.inv.coins.current),
							iw - gap,
							hs + gap + i * (ih + ig) + ih / 2
						);
						break;
					}

					case "wins": {
						ctx.fillText(
							"x" + user.value.stats.wins.toLocaleString(slash.locale),
							iw - gap,
							hs + gap + i * (ih + ig) + ih / 2
						);
						break;
					}

					case "losses": {
						ctx.fillText(
							"x" + user.value.stats.losses.toLocaleString(slash.locale),
							iw - gap,
							hs + gap + i * (ih + ig) + ih / 2
						);
						break;
					}
				}

				ctx.strokeRoundRect(gap, hs + gap + i * (ih + ig), iw, ih, 10);
				ctx.restore();
			}

			return canvas.toBuffer();
		}

		function components(page = 0, end = false) {
			return [
				new Discord.ActionRowBuilder().setComponents(
					new Discord.ButtonBuilder()
						.setCustomId("previous")
						.setEmoji("1054004556067000350")
						.setStyle(Discord.ButtonStyle.Primary)
						.setDisabled(end || page <= 0),
					new Discord.ButtonBuilder()
						.setCustomId("page")
						.setLabel(`${page + 1}/${maxPage}`)
						.setStyle(Discord.ButtonStyle.Secondary)
						.setDisabled(end),
					new Discord.ButtonBuilder()
						.setCustomId("next")
						.setEmoji("1054004554464768012")
						.setStyle(Discord.ButtonStyle.Primary)
						.setDisabled(end || page >= maxPage - 1),
					new Discord.ButtonBuilder()
						.setCustomId("me")
						.setLabel(translate("ME"))
						.setStyle(Discord.ButtonStyle.Success)
						.setDisabled(end || page === myPage)
				),
			];
		}

		const botMessage = await slash.reply({
			files: [
				new Discord.AttachmentBuilder()
					.setFile(makeLead())
					.setName("leaderboard.png"),
			],
			components: components(page, false),
		});

		const collector = botMessage.createMessageComponentCollector({ time: 6e4 });
		collector.on("collect", async (button) => {
			const oldPage = page;
			if (button.user.id !== slash.user.id) {
				return button.reply({
					content: icons.error + translate("NOT_AUTHOR_COMMAND"),
					ephemeral: true,
				});
			}

			if (button.customId === "previous") {
				if (page > 0) page--;
			} else if (button.customId === "next") {
				if (page < maxPage - 1) page++;
			} else if (button.customId === "me") {
				page = myPage;
			} else {
				return button.reply({
					content:
						"<a:fabulouscat:1053043411634094230> " +
						translate("PAGE_INDICATOR"),
					ephemeral: true,
				});
			}

			collector.resetTimer();
			button.deferUpdate();

			if (oldPage !== page) {
				return await slash.editReply({
					files: [
						new Discord.AttachmentBuilder()
							.setFile(makeLead(page))
							.setName("leaderboard.png"),
					],
					components: components(page, false),
				});
			}
		});

		collector.on("end", async () => {
			await slash.editReply({
				components: components(page, true),
			});
		});
	},
});
