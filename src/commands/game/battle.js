const Command = require("../../classes/Command");
const Discord = require("discord.js");
const Game = require("../../classes/Game");
const path = require("path");
const Canvas = require("canvas");
const getColor = require("../../functions/getColor");
const getCommand = require("../../functions/getCommand");
const getUser = require("../../functions/getUser");
const Cats = require("../../classes/Cats");
const Cat = require("../../classes/Cat");
const User = require("../../classes/User");
const addExp = require("../../functions/addExp");
const EloRank = require("elo-rank");
const getRank = require("../../functions/getRank");
const humanizeDuration = require("humanize-duration");

const elo = new EloRank(15);
const START_TIME = dev ? 1000 : 10000;

let speedIcon = null;
let battleIcon = null;
let versusIcon = null;
let lightning = null;

Canvas.loadImage(path.join(__dirname, "../../assets/images/speed.png")).then(
	(img) => (speedIcon = img)
);

Canvas.loadImage(path.join(__dirname, "../../assets/images/versus.png")).then(
	(img) => (versusIcon = img)
);

Canvas.loadImage(
	path.join(__dirname, "../../assets/images/lightning.png")
).then((img) => (lightning = img));

Canvas.loadImage(
	path.join(__dirname, "../../assets/images/battle-icon.png")
).then((img) => (battleIcon = img));

function loadImageURL(imageURL) {
	return new Promise(function (resolve, reject) {
		const image = new Canvas.Image();

		image.src = imageURL;
		image.onerror = reject;
		image.onload = () => resolve(image);
	});
}

module.exports = new Command({
	options: {
		name: "BATTLE",
		description: "BATTLE_DESCRIPTION",
		dmPermission: false,
		type: [Discord.ApplicationCommandType.ChatInput],
	},
	category: Command.Categories.Game,
	execute: async function (slash, translate) {
		const inGame = client.inGame.get(slash.user.id);
		const data = await getUser(slash.user);

		if (inGame) {
			const hostGame = client.games.get(inGame);
			let content = null;

			if (hostGame.slash.guildId !== slash.guildId) {
				content =
					icons.error +
					translate(
						"ALREADY_STARTED_GAME_SERVER",
						`#${hostGame.slash.channel.name}`,
						hostGame.slash.guild.name
					);
			} else {
				content =
					icons.error +
					translate("ALREADY_STARTED_GAME", hostGame.slash.channel.toString());
			}

			const message = await hostGame.slash.fetchReply();
			return slash.reply({
				content: content,
				components: [
					new Discord.ActionRowBuilder().setComponents(
						new Discord.ButtonBuilder()
							.setStyle(Discord.ButtonStyle.Link)
							.setLabel(translate("GO_TO_CHANNEL"))
							.setURL(
								`https://discord.com/channels/${hostGame.slash.guildId}/${hostGame.slash.channelId}/${message.id}`
							)
					),
				],
				ephemeral: true,
			});
		}

		if (!data.inv.selectedCat) {
			return slash.reply({
				content:
					icons.error +
					translate("NEED_CAT_START") +
					"\n<:Reply:893527626201841744> " +
					translate("DO_OPEN", getCommand("open")),
				ephemeral: true,
			});
		}

		const replayButton = new Discord.ButtonBuilder()
			.setCustomId("replay")
			.setEmoji("🔄")
			.setStyle(Discord.ButtonStyle.Secondary)
			.setLabel(translate("PLAY_AGAIN"));

		const game = new Game();
		await game.create(slash);

		function players() {
			return game.players
				.toJSON()
				.map(
					(player, index) =>
						`${icons.players[index]} [${player.user.tag}](https://discord.com/users/${player.user.id})`
				)
				.join("\n");
		}

		const embed = new Discord.EmbedBuilder()
			.setColor(getColor(battleIcon).hex)
			.setImage("attachment://vs_screen.png")
			.setDescription(
				icons.loading +
					"*" +
					translate("QUEUED") +
					"*" +
					"\n\n" +
					translate("DO_CAT_SELECT", getCommand("cat select"))
			)
			.setTitle(translate("BATTLE_TITLE"))
			.setThumbnail("attachment://battle-icon.png")
			.setFields({
				name: translate("PLAYERS"),
				value: players(),
			});

		let leaveMode = false;
		function components(disabled) {
			return leaveMode
				? [
						new Discord.ActionRowBuilder().setComponents(
							new Discord.ButtonBuilder()
								.setCustomId("leave")
								.setLabel(translate("LEAVE"))
								.setStyle(Discord.ButtonStyle.Danger)
								.setEmoji("1054701587970400366")
								.setDisabled(disabled)
						),
				  ]
				: [
						new Discord.ActionRowBuilder().setComponents(
							new Discord.ButtonBuilder()
								.setCustomId("join")
								.setLabel(translate("JOIN"))
								.setStyle(Discord.ButtonStyle.Primary)
								.setEmoji("1054360032524906576")
								.setDisabled(disabled)
						),
				  ];
		}

		const player1 = game.players.at(0);
		player1.data = await getUser(player1.user);
		const Cat1 = Cats[player1.data.inv.selectedCat];

		/** @type {Cat} */
		const cat1 = new Cat1();

		/** @type {{game:Game.User,data:User,user:Discord.User}} */
		let player2 = null;

		/** @type {Cat|null} */
		let cat2 = null;

		/**
		 * @param {Cat} cat1
		 * @param {Cat} cat2
		 */
		function vsScreen(cat1, cat2) {
			const side = 500;
			const canvas = Canvas.createCanvas(side * 2, side);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(cat1.imageData, 0, 0, side, side);

			if (cat2) {
				ctx.drawImage(cat2.imageData, side, 0, side, side);
			} else {
				ctx.fillStyle = "#1d1e24";
				ctx.fillRect(side, 0, side, side);

				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.font = "250px Anton";
				ctx.fillStyle = "#3b3c45";
				ctx.fillText("?", side + side / 2, side / 2);
			}

			ctx.globalAlpha = 0.5;
			ctx.drawImage(speedIcon, 0, 0, side * 2, side);

			ctx.globalAlpha = 1;
			ctx.drawImage(lightning, side - 40, 0, 80, side + 100);
			ctx.drawImage(versusIcon, side / 2, side - 190, side, 190);

			return canvas.toBuffer();
		}

		const botMessage = await slash.reply({
			embeds: [embed],
			components: components(false),
			files: [
				new Discord.AttachmentBuilder()
					.setFile(path.join(__dirname, "../../assets/images/battle-icon.png"))
					.setName("battle-icon.png"),
				new Discord.AttachmentBuilder()
					.setFile(vsScreen(cat1, cat2))
					.setName("vs_screen.png"),
			],
		});

		let leaves = {};
		let timeout = null;
		const collector = botMessage.createMessageComponentCollector({
			time: 1.8e5,
			filter: (b) => b.isButton(),
		});

		/**
		 * @param {string} hostId
		 * @param {Discord.User} user
		 */
		async function stopLobby(hostId, user) {
			if (game.hostId !== hostId) return;
			client.removeListener("stopGame", stopLobby);

			if (timeout) clearTimeout(timeout);
			collector.stop();

			embed.data.description =
				icons.loading +
				"*" +
				translate("GAME_CANCELLED") +
				"*" +
				"\n\n" +
				translate("DO_CAT_SELECT", getCommand("cat select"));

			await slash.editReply({ embeds: [embed] });
			const message = await game.slash.fetchReply();

			game.delete();
			return slash.channel.send({
				embeds: [
					new Discord.EmbedBuilder()
						.setTitle(translate("GAME_STOPPED"))
						.setColor(getColor(battleIcon).hex)
						.setThumbnail("attachment://battle-icon.png")
						.setDescription(
							"<:discord_joined_new:891064564060401694> " +
								translate(
									"GAME_STOPPED_DESCRIPTION",
									`[${translate("THIS_GAME")}](https://discord.com/channels/${
										game.slash.guildId
									}/${game.slash.channelId}/${message.id})`,
									user.toString()
								)
						),
				],
				components: [
					new Discord.ActionRowBuilder().setComponents(replayButton),
				],
				files: [
					new Discord.AttachmentBuilder()
						.setFile(
							path.join(__dirname, "../../assets/images/battle-icon.png")
						)
						.setName("battle-icon.png"),
				],
			});
		}

		client.addListener("stopGame", stopLobby);
		collector.on("collect", async (button) => {
			const opponentData = await getUser(button.user);
			if (!opponentData) {
				return button.reply({
					content:
						"<:catpaw:1053011873093664839> " +
						translate("START_TO_START", getCommand("start")),
					ephemeral: true,
				});
			}

			if (button.customId === "join") {
				if (!opponentData.inv.selectedCat) {
					return button.reply({
						content: icons.error + translate("NEED_CAT_JOIN"),
						ephemeral: true,
					});
				}

				if (game.hostId === button.user.id) {
					return button.reply({
						content: icons.error + translate("ALREADY_HOST"),
						ephemeral: true,
					});
				}

				if (game.players.has(button.user.id)) {
					return button.reply({
						content: icons.error + translate("ALREADY_IN_THIS_GAME"),
						ephemeral: true,
					});
				}

				if (client.inGame.has(button.user.id)) {
					return button.reply({
						content: icons.error + translate("ALREADY_IN_GAME"),
						ephemeral: true,
					});
				}

				if (game.players.size >= 2) {
					return button.reply({
						content: icons.error + translate("ALREADY_TWO"),
						ephemeral: true,
					});
				}

				if (leaves[button.user.id] >= 3) {
					return button.reply({
						content: ":dotted_line_face: " + translate("LEFT_3_TIMES"),
						ephemeral: true,
					});
				}

				await game.addPlayer(button.user);
				player2 = game.players.at(1);
				player2.data = await getUser(button.user);
				const Cat2 = Cats[player2.data.inv.selectedCat];
				cat2 = new Cat2();

				embed.data.fields[0].value = players();
				embed.data.description =
					"*" +
					translate(
						"STARTING_IN",
						`<t:${Math.round((Date.now() + START_TIME) / 1000)}:R>`
					) +
					"*" +
					"\n\n" +
					translate("DO_CAT_SELECT", getCommand("cat select"));

				leaveMode = true;
				timeout = setTimeout(async () => {
					game.start();
					collector.stop();
					playGame({ player1, cat1 }, { player2, cat2 });
				}, START_TIME);
			} else if (button.customId === "leave") {
				if (game.hostId === button.user.id) {
					await button.deferUpdate();
					return await stopLobby(game.hostId, button.user);
				}

				if (!game.players.has(button.user.id)) {
					return button.reply({
						content: icons.error + translate("NOT_IN_THIS_GAME"),
						ephemeral: true,
					});
				}

				player2 = null;
				cat2 = null;

				game.removePlayer(button.user.id);
				if (timeout) clearTimeout(timeout);
				embed.data.fields[0].value = players();
				embed.data.description =
					icons.loading +
					"*" +
					translate("QUEUED") +
					"*" +
					"\n\n" +
					translate("DO_CAT_SELECT", getCommand("cat select"));

				leaveMode = false;
				if (!leaves[button.user.id]) {
					leaves[button.user.id] = 1;
				} else {
					leaves[button.user.id]++;
				}
			} else return;

			button.deferUpdate();
			slash.editReply({
				embeds: [embed],
				components: components(false),
				files: [
					new Discord.AttachmentBuilder()
						.setFile(
							path.join(__dirname, "../../assets/images/battle-icon.png")
						)
						.setName("battle-icon.png"),
					new Discord.AttachmentBuilder()
						.setFile(vsScreen(cat1, cat2))
						.setName("vs_screen.png"),
				],
			});
		});

		collector.on("end", () => {
			client.removeListener("stopGame", stopLobby);
			if (!game.starting) return;

			game.delete();
			if (slash.isRepliable()) {
				slash.editReply({
					components: components(true),
				});
			}
		});

		/**
		 * @param {{player1:{game:Game.User,data:User,user:Discord.User},cat1:Cat}} param0
		 * @param {{player2:{game:Game.User,data:User,user:Discord.User},cat2:Cat}} param1
		 */
		async function playGame({ player1, cat1 }, { player2, cat2 }) {
			let start = Date.now();
			let turn = 0;
			let end = false;
			let hostTurn = true;
			const cat = () => (hostTurn ? cat1 : cat2);

			cat1.setUser(player1.game).setOpponent(player2.game);
			cat2.setUser(player2.game).setOpponent(player1.game);

			function components(disabled) {
				const userCat = cat();
				return [
					new Discord.ActionRowBuilder().setComponents(
						new Discord.ButtonBuilder()
							.setCustomId("attack-1")
							.setLabel(
								translate(userCat.atk1.name) +
									(userCat.atk1.usages >= 0 ? ` (${userCat.atk1.usages})` : "")
							)
							.setStyle(Discord.ButtonStyle.Danger)
							.setEmoji(userCat.atk1.icon)
							.setDisabled(
								disabled ||
									(!userCat.atk1.isAvailable() &&
										userCat.user.stamina >= userCat.atk1.stamina)
							),
						new Discord.ButtonBuilder()
							.setCustomId("attack-2")
							.setLabel(
								translate(userCat.atk2.name) +
									(userCat.atk2.usages >= 0 ? ` (${userCat.atk2.usages})` : "")
							)
							.setStyle(Discord.ButtonStyle.Danger)
							.setEmoji(userCat.atk2.icon)
							.setDisabled(
								disabled ||
									(!userCat.atk2.isAvailable() &&
										userCat.user.stamina >= userCat.atk2.stamina)
							),
						new Discord.ButtonBuilder()
							.setCustomId("defence")
							.setLabel(
								translate(userCat.def.name) +
									(userCat.def.usages >= 0 ? ` (${userCat.def.usages})` : "")
							)
							.setStyle(Discord.ButtonStyle.Success)
							.setEmoji(userCat.def.icon)
							.setDisabled(disabled || !userCat.def.isAvailable())
					),
					new Discord.ActionRowBuilder().setComponents(
						new Discord.ButtonBuilder()
							.setCustomId("info")
							.setStyle(Discord.ButtonStyle.Secondary)
							.setEmoji("1053602021808283709")
							.setLabel(translate("ACT_INFO"))
							.setDisabled(disabled)
					),
				];
			}

			async function embed() {
				return new Discord.EmbedBuilder()
					.setColor(getColor(cat().imageData).hex)
					.setThumbnail(`attachment://${cat().id}.png`)
					.setTitle(
						translate("VS", player1.user.username, player2.user.username)
					)
					.setFooter({
						text: translate("TURN", (turn + 1).toLocaleString(slash.locale)),
					})
					.setFields(
						{
							name:
								(hostTurn ? "<:arrowwhiteright:1054004554464768012> " : "") +
								player1.user.tag,
							value:
								translate(
									"HEALTH",
									cat1.user.health.toLocaleString(slash.locale)
								) +
								"\n" +
								translate(
									"STAMINA",
									cat1.user.stamina.toLocaleString(slash.locale)
								),
						},
						{
							name:
								(hostTurn ? "" : "<:arrowwhiteright:1054004554464768012> ") +
								player2.user.tag,
							value:
								translate(
									"HEALTH",
									cat2.user.health.toLocaleString(slash.locale)
								) +
								"\n" +
								translate(
									"STAMINA",
									cat2.user.stamina.toLocaleString(slash.locale)
								),
						}
					);
			}

			function files() {
				return [
					new Discord.AttachmentBuilder()
						.setFile(
							path.join(__dirname, "../../assets/images/cats", cat().image)
						)
						.setName(`${cat().id}.png`),
				];
			}

			const botMessage = await slash.editReply({
				embeds: [await embed()],
				components: components(false),
				files: files(),
			});

			const collector = botMessage.createMessageComponentCollector({
				time: 1.2e5,
			});

			/**
			 * @param {string} hostId
			 * @param {Discord.User} user
			 */
			async function stopGame(hostId, user) {
				if (game.hostId !== hostId) return;
				client.removeListener("stopGame", stopGame);

				const message = await game.slash.fetchReply();
				await slash.channel.send({
					embeds: [
						new Discord.EmbedBuilder()
							.setTitle(translate("GAME_STOPPED"))
							.setColor(getColor(battleIcon).hex)
							.setThumbnail("attachment://battle-icon.png")
							.setDescription(
								"<:discord_joined_new:891064564060401694> " +
									translate(
										"GAME_STOPPED_DESCRIPTION_PLAYER",
										`[${translate("THIS_GAME")}](https://discord.com/channels/${
											game.slash.guildId
										}/${game.slash.channelId}/${message.id})`,
										user.toString()
									)
							),
					],
					files: [
						new Discord.AttachmentBuilder()
							.setFile(
								path.join(__dirname, "../../assets/images/battle-icon.png")
							)
							.setName("battle-icon.png"),
					],
				});

				if (user.id === game.hostId) {
					return await endGame(player2, player1);
				} else {
					return await endGame(player1, player2);
				}
			}

			client.addListener("stopGame", stopGame);

			/**
			 * @param {{game:Game.User,data:User,user:Discord.User}} winner
			 * @param {{game:Game.User,data:User,user:Discord.User}} loser
			 */
			async function endGame(winner, loser) {
				end = true;
				game.delete();
				collector.stop();

				const endTime = Date.now();
				const winExp = addExp(winner.data.leveling, true, User.Leveling.Range);
				const losExp = addExp(loser.data.leveling, false, User.Leveling.Range);

				winner.data.leveling = winExp.leveling;
				loser.data.leveling = losExp.leveling;

				const winnerCat = winner.data.inv.cats.find(
					(c) => c.catId === winner.data.inv.selectedCat
				);
				const loserCat = loser.data.inv.cats.find(
					(c) => c.catId === loser.data.inv.selectedCat
				);

				winnerCat.damages = addExp(
					winnerCat.damages,
					true,
					User.Cat.Leveling.Range
				).leveling;

				winnerCat.defence = addExp(
					winnerCat.defence,
					true,
					User.Cat.Leveling.Range
				).leveling;

				loserCat.damages = addExp(
					loserCat.damages,
					false,
					User.Cat.Leveling.Range
				);

				loserCat.defence = addExp(
					loserCat.defence,
					false,
					User.Cat.Leveling.Range
				).leveling;

				const winCoins = Math.floor(Math.random() * 501) + 500;
				const losCoins = Math.floor(Math.random() * 251) + 250;
				winner.data.inv.coins.current += winCoins;
				loser.data.inv.coins.current += losCoins;

				if (winner.data.inv.coins.current > winner.data.inv.coins.highest) {
					winner.data.inv.coins.highest = winner.data.inv.coins.current;
				}
				if (loser.data.inv.coins.current > loser.data.inv.coins.highest) {
					loser.data.inv.coins.highest = loser.data.inv.coins.current;
				}

				winner.data.stats.wins++;
				winner.data.stats.winstreak.current++;
				winner.data.stats.time += endTime - start;
				loser.data.stats.losses++;
				loser.data.stats.winstreak.current = 0;
				loser.data.stats.time += endTime - start;

				if (
					winner.data.stats.winstreak.current >
					winner.data.stats.winstreak.highest
				) {
					winner.data.stats.winstreak.highest =
						winner.data.stats.winstreak.current;
				}

				const oldWinElo = winner.data.elo;
				const oldLosElo = loser.data.elo;
				const expectedW = elo.getExpected(winner.data.elo, loser.data.elo);
				const expectedL = elo.getExpected(loser.data.elo, winner.data.elo);
				winner.data.elo = elo.updateRating(expectedW, 1, winner.data.elo);
				loser.data.elo = elo.updateRating(expectedL, 0, loser.data.elo);

				await users.set(winner.user.id, winner.data);
				await users.set(loser.user.id, loser.data);

				const allUsers = (await users.all()).sort(
					(a, b) => b.value.elo - a.value.elo
				);

				const winnerRank = allUsers.findIndex((u) => u.id === winner.user.id);
				const loserRank = allUsers.findIndex((u) => u.id === loser.user.id);
				await users.set(`${winner.user.id}.stats.rank`, winnerRank);
				await users.set(`${loser.user.id}.stats.rank`, loserRank);

				if (slash.isRepliable()) {
					await slash.editReply({
						components: [
							new Discord.ActionRowBuilder().setComponents(replayButton),
						],
						embeds: [
							new Discord.EmbedBuilder()
								.setColor(
									getColor(
										await loadImageURL(
											winner.user.displayAvatarURL({
												extension: "png",
												size: 512,
											})
										)
									).hex
								)
								.setTitle(translate("WON_GAME", winner.user.username))
								.setThumbnail(
									winner.user.displayAvatarURL({
										extension: "png",
										size: 512,
									})
								)
								.setDescription(
									translate(
										"GAME_TURNS_TIME",
										`**${turn.toLocaleString(slash.locale)}**`,
										`**${humanizeDuration(endTime - start, {
											language: slash.locale.split("-")[0],
											round: true,
										})}**`
									)
								)
								.setFields(
									{
										name: "<:green:989300419140399166> " + translate("WINNER"),
										value:
											`[${winner.user.tag}](https://discord.com/users/${winner.user.id})` +
											"\n\n" +
											translate(
												"RANK",
												`${
													winnerRank - winner.data.stats.rank === 0 ? "-" : "↑"
												} **#${(winnerRank + 1).toLocaleString(
													slash.locale
												)}** / ${allUsers.length.toLocaleString(
													slash.locale
												)} *(+${(
													winner.data.stats.rank - winnerRank
												).toLocaleString(slash.locale)})*`
											) +
											"\n" +
											`${
												getRank(winner.data.elo).emoji
											} ${winner.data.elo.toLocaleString(
												slash.locale
											)} Elo *(+${(winner.data.elo - oldWinElo).toLocaleString(
												slash.locale
											)})*` +
											"\n" +
											`${icons.coin} +${winCoins.toLocaleString(
												slash.locale
											)}` +
											"\n" +
											`${icons.exp} +${winExp.xp.toLocaleString(
												slash.locale
											)}xp${
												winExp.newLevel ? ` *(${translate("ONE_LEVEL")})*` : ""
											}`,
										inline: true,
									},
									{
										name:
											"<:N_:718506491660992735><:red:989300421602476063> " +
											translate("LOSER"),
										value:
											`<:N_:718506491660992735>[${loser.user.tag}](https://discord.com/users/${loser.user.id})` +
											"\n\n> " +
											translate(
												"RANK",
												`${
													loserRank - loser.data.stats.rank === 0 ? "-" : "↓"
												} **#${(loserRank + 1).toLocaleString(
													slash.locale
												)}** / ${allUsers.length.toLocaleString(
													slash.locale
												)} *(-${(
													loserRank - loser.data.stats.rank
												).toLocaleString(slash.locale)}*)`
											) +
											"\n> " +
											`${
												getRank(loser.data.elo).emoji
											} ${loser.data.elo.toLocaleString(
												slash.locale
											)} Elo *(-${(oldLosElo - loser.data.elo).toLocaleString(
												slash.locale
											)})*` +
											"\n> " +
											`${icons.coin} +${losCoins.toLocaleString(
												slash.locale
											)}` +
											"\n> " +
											`${icons.exp} +${losExp.xp.toLocaleString(
												slash.locale
											)}xp${
												losExp.newLevel ? ` *(${translate("ONE_LEVEL")})*` : ""
											}`,
										inline: true,
									}
								),
						],
						files: [],
					});
				}

				await stats.add("time", endTime - start);
			}

			collector.on("collect", async (button) => {
				if (button.user.id !== (hostTurn ? player1.user.id : player2.user.id)) {
					return button.reply({
						content: icons.error + translate("NOT_TURN"),
						ephemeral: true,
					});
				}

				const userCat = cat();
				switch (button.customId) {
					case "attack-1": {
						userCat.doAttack1(turn);
						break;
					}

					case "attack-2": {
						userCat.doAttack2(turn);
						break;
					}

					case "defence": {
						userCat.doDefence(turn);
						break;
					}

					case "info": {
						return button.reply({
							embeds: [
								new Discord.EmbedBuilder()
									.setColor(getColor(userCat.imageData).hex)
									.setTitle(translate("INFO_ABOUT", translate(userCat.name)))
									.setThumbnail(`attachment://${userCat.id}.png`)
									.setFields(
										{
											name:
												"<:pinkarrow:1053997226759827507> " +
												translate("ATTACK_1") +
												" - " +
												translate(userCat.atk1.name),
											value: translate(userCat.atk1.description),
											inline: true,
										},
										{
											name:
												"<:pinkarrow:1053997226759827507> " +
												translate("ATTACK_2") +
												" - " +
												translate(userCat.atk2.name),
											value: translate(userCat.atk2.description),
											inline: true,
										},
										{
											name:
												"<:pinkarrow:1053997226759827507> " +
												translate("DEFENCE") +
												" - " +
												translate(userCat.def.name),
											value: translate(userCat.def.description),
											inline: false,
										}
									),
							],
							ephemeral: true,
							files: files(),
						});
					}
				}

				button.deferUpdate();
				collector.resetTimer();
				hostTurn = !hostTurn;
				if (hostTurn) turn++;

				const playerOrder = [
					hostTurn ? player1 : player2,
					hostTurn ? player2 : player1,
				];

				const loser = playerOrder.find((p) => p.game.health <= 0);
				if (loser) {
					const winner = playerOrder.find((p) => loser.user.id !== p.user.id);
					return await endGame(winner, loser);
				} else {
					return await slash.editReply({
						components: components(false),
						embeds: [await embed()],
						files: files(),
					});
				}
			});

			collector.on("end", async () => {
				client.removeListener("stopGame", stopGame);

				if (!end) {
					end = true;
					if (hostTurn) {
						return await endGame(player2, player1);
					} else {
						return await endGame(player1, player2);
					}
				}
			});
		}
	},
});
