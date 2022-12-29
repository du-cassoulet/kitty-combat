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
const rarities = require("../../storage/json/rarities.json");

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
		function ns(n) {
			return n >= 0
				? "+" + Math.floor(n + 0).toLocaleString(slash.locale)
				: Math.floor(n + 0).toLocaleString(slash.locale);
		}

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
			.setStyle(Discord.ButtonStyle.Primary)
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
					translate("DO_CAT_SELECT", getCommand("cat select")) +
					"\n\n⚠️ " +
					translate("TIME_TO_PLAY")
			)
			.setTitle(translate("BATTLE_TITLE"))
			.setThumbnail("attachment://battle-icon.png")
			.setFields({
				name: translate("PLAYERS"),
				value: players(),
			});

		let leaveMode = false;
		let botMode = false;
		function components(disabled) {
			return leaveMode
				? [
						new Discord.ActionRowBuilder().setComponents(
							new Discord.ButtonBuilder()
								.setCustomId("leave")
								.setLabel(translate("LEAVE"))
								.setStyle(Discord.ButtonStyle.Danger)
								.setEmoji("1054701587970400366")
								.setDisabled(disabled),
							new Discord.ButtonBuilder()
								.setCustomId("add-bot")
								.setLabel(translate("PLAY_BOT"))
								.setStyle(Discord.ButtonStyle.Secondary)
								.setEmoji("1057752385751089242")
								.setDisabled(true)
						),
				  ]
				: [
						new Discord.ActionRowBuilder().setComponents(
							new Discord.ButtonBuilder()
								.setCustomId("join")
								.setLabel(translate("JOIN"))
								.setStyle(Discord.ButtonStyle.Primary)
								.setEmoji("1054360032524906576")
								.setDisabled(disabled || botMode),
							new Discord.ButtonBuilder()
								.setCustomId("add-bot")
								.setLabel(translate("PLAY_BOT"))
								.setStyle(Discord.ButtonStyle.Secondary)
								.setEmoji("1057752385751089242")
								.setDisabled(disabled || botMode)
						),
				  ];
		}

		const player1 = game.players.at(0);
		player1.data = await getUser(player1.user);
		const Cat1 = Cats[player1.data.inv.selectedCat];

		/** @type {Cat} */
		let cat1 = new Cat1();

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
			ctx.drawImage(versusIcon, side - 160, side / 2 - 150, 320, 300);

			const buffer = canvas.toBuffer();
			stats.add("images.number", 1);
			stats.add("images.size", buffer.byteLength);
			return buffer;
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
		 * @param {Discord.User} user
		 * @param {User} data
		 */
		async function updateCats(user, data) {
			if (player1.user.id === user.id) {
				player1.data = data;
				const Cat = Cats[player1.data.inv.selectedCat];
				cat1 = new Cat();
			} else if (player2?.user?.id === user.id) {
				player2.data = data;
				const Cat = Cats[player1.data.inv.selectedCat];
				cat2 = new Cat();
			} else return;

			await slash.editReply({
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
		}

		/**
		 * @param {string} hostId
		 * @param {Discord.User} user
		 */
		async function stopLobby(hostId, user) {
			if (game.hostId !== hostId) return;
			client.removeListener("stopGame", stopLobby);
			client.removeListener("newSelectedCat", updateCats);

			if (timeout) clearTimeout(timeout);
			collector.stop();

			embed.data.description =
				icons.loading +
				"*" +
				translate("GAME_CANCELLED") +
				"*" +
				"\n\n" +
				translate("DO_CAT_SELECT", getCommand("cat select")) +
				"\n\n" +
				translate("TIME_TO_PLAY");

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
		client.addListener("newSelectedCat", updateCats);

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

			switch (button.customId) {
				case "join": {
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
						translate("DO_CAT_SELECT", getCommand("cat select")) +
						"\n\n⚠️ " +
						translate("TIME_TO_PLAY");

					leaveMode = true;
					timeout = setTimeout(async () => {
						game.start();
						collector.stop();
						playGame({ player1, cat1 }, { player2, cat2 });
					}, START_TIME);

					break;
				}

				case "add-bot": {
					if (game.players.size >= 2) {
						return button.reply({
							content: icons.error + translate("ALREADY_TWO"),
							ephemeral: true,
						});
					}

					await game.addPlayer(client.user);
					player2 = game.players.at(1);
					const cats = Object.values(Cats);
					const Cat2 = cats[Math.floor(Math.random() * cats.length)];
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
						translate("DO_CAT_SELECT", getCommand("cat select")) +
						"\n\n⚠️ " +
						translate("TIME_TO_PLAY");

					botMode = true;
					timeout = setTimeout(async () => {
						game.start();
						collector.stop();
						playGame({ player1, cat1 }, { player2, cat2 });
					}, START_TIME);

					break;
				}

				case "leave": {
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
						translate("DO_CAT_SELECT", getCommand("cat select")) +
						"\n\n⚠️ " +
						translate("TIME_TO_PLAY");

					leaveMode = false;
					if (!leaves[button.user.id]) {
						leaves[button.user.id] = 1;
					} else {
						leaves[button.user.id]++;
					}

					break;
				}

				default: {
					return;
				}
			}

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
			client.removeListener("newSelectedCat", updateCats);
			if (!game.starting) return;

			embed.data.description =
				icons.loading +
				"*" +
				translate("GAME_CANCELLED") +
				"*" +
				"\n\n" +
				translate("DO_CAT_SELECT", getCommand("cat select")) +
				"\n\n" +
				translate("TIME_TO_PLAY");
			game.delete();

			if (slash.isRepliable()) {
				slash.editReply({
					embeds: [embed],
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
			const steps = [];
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
									!userCat.atk1.isAvailable() ||
									userCat.user.stamina < userCat.atk1.stamina
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
									!userCat.atk2.isAvailable() ||
									userCat.user.stamina < userCat.atk2.stamina
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

			/**
			 * @param {boolean} showTurn
			 * @param {{
			 * dmg:number,
			 * protDmg:number,
			 * heal:number,
			 * stamina:number,
			 * absPer:number,
			 * boost:boolean,
			 * dodged:boolean,
			 * critical:boolean,
			 * cat1:Cat,
			 * cat2:Cat,
			 * turn:number,
			 * hostTurn:boolean
			 * }} act
			 * @param {boolean} replayMode
			 */
			async function embed(showTurn, act = {}, replayMode = false) {
				const currentCat = !showTurn
					? cat()
					: act.hostTurn
					? act.cat1
					: act.cat2;

				const curCat1 = showTurn ? act.cat1 : cat1;
				const curCat2 = showTurn ? act.cat2 : cat2;
				const curTurn = showTurn ? act.turn : turn;

				const userCat1 = player1.data.inv.cats.find((c) => c.catId === cat1.id);
				const userCat2 =
					player2.data?.inv?.cats?.find((c) => c.catId === cat2.id) ||
					new User.Cat().setName(null);

				return new Discord.EmbedBuilder()
					.setColor(getColor(currentCat.imageData).hex)
					.setThumbnail(`attachment://${currentCat.id}.png`)
					.setTitle(
						(replayMode ? "🎥 " : "") +
							translate("VS", player1.user.username, player2.user.username) +
							(replayMode ? " " + `(${translate("REPLAY_GAME")})` : "")
					)
					.setFooter({
						text: translate("TURN", (curTurn + 1).toLocaleString(slash.locale)),
					})
					.setFields(
						{
							name:
								(hostTurn ? "<:arrowwhiteright:1054004554464768012> " : "") +
								player1.user.tag,
							value:
								rarities[cat1.rarity].emoji +
								" " +
								(userCat1.name
									? `**${userCat1.name}** (${translate(cat1.name)})`
									: `**${translate(cat1.name)}**`) +
								"\n" +
								"<:line:930824483474915339>".repeat(3) +
								"\n" +
								"❤️ " +
								translate(
									"HEALTH",
									curCat1.user.health.toLocaleString(slash.locale)
								) +
								(!showTurn
									? ""
									: hostTurn
									? act.heal !== 0
										? " *" +
										  ns(act.heal) +
										  "*" +
										  (act.boost ? " " + translate("BOOST") : "")
										: ""
									: act.dmg !== 0
									? " *" +
									  ns(act.dmg) +
									  "*" +
									  (act.critical ? " " + translate("CRITICAL") : "")
									: "") +
								"\n☄️ " +
								translate(
									"STAMINA",
									curCat1.user.stamina.toLocaleString(slash.locale)
								) +
								(!showTurn ? "" : hostTurn ? " *" + ns(act.stamina) + "*" : ""),
							inline: true,
						},
						{
							name:
								(hostTurn
									? "<:N_:718506491660992735>"
									: "<:N_:718506491660992735><:arrowwhiteright:1054004554464768012> ") +
								player2.user.tag,
							value:
								"> " +
								rarities[cat2.rarity].emoji +
								" " +
								(userCat2.name
									? `**${userCat2.name}** (${translate(cat2.name)})`
									: `**${translate(cat2.name)}**`) +
								"\n> " +
								"<:line:930824483474915339>".repeat(3) +
								"\n> " +
								"❤️ " +
								translate(
									"HEALTH",
									curCat2.user.health.toLocaleString(slash.locale)
								) +
								(!showTurn
									? ""
									: hostTurn
									? act.dmg !== 0
										? " *" +
										  ns(act.dmg) +
										  "*" +
										  (act.critical ? " " + translate("CRITICAL") : "")
										: ""
									: act.heal !== 0
									? " *" +
									  ns(act.heal) +
									  "*" +
									  (act.boost ? " " + translate("BOOST") : "")
									: "") +
								"\n> ☄️ " +
								translate(
									"STAMINA",
									curCat2.user.stamina.toLocaleString(slash.locale)
								) +
								(!showTurn ? "" : hostTurn ? "" : " *" + ns(act.stamina) + "*"),
							inline: true,
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
				embeds: [await embed(false)],
				components: components(false),
				files: files(),
			});

			const collector = botMessage.createMessageComponentCollector({
				time: 1.2e5,
				filter: (i) => i.isButton(),
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
			async function endGame(winner, loser, reason = null) {
				end = true;
				collector.stop();

				const endTime = Date.now();
				const allUsers = (await users.all()).sort(
					(a, b) => b.value.elo - a.value.elo
				);

				if (winner.user.id !== client.user.id) {
					var winExp = addExp(winner.data.leveling, true, User.Leveling.Range);
					winner.data.leveling = winExp.leveling;

					const winnerCat = winner.data.inv.cats.find(
						(c) => c.catId === winner.data.inv.selectedCat
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

					var winCoins = Math.floor(Math.random() * 501) + 500;
					winner.data.inv.coins.current += winCoins;

					if (winner.data.inv.coins.current > winner.data.inv.coins.highest) {
						winner.data.inv.coins.highest = winner.data.inv.coins.current;
					}

					winner.data.stats.wins++;
					winner.data.stats.winstreak.current++;
					winner.data.stats.time += endTime - start;

					if (
						winner.data.stats.winstreak.current >
						winner.data.stats.winstreak.highest
					) {
						winner.data.stats.winstreak.highest =
							winner.data.stats.winstreak.current;
					}

					var oldWinElo = winner.data.elo;
					const expectedW = elo.getExpected(
						winner.data.elo,
						loser.data?.elo || 1000
					);
					winner.data.elo = elo.updateRating(expectedW, 1, winner.data.elo);
					winner.data.hist.push(winner.data.elo);
					await users.set(winner.user.id, winner.data);

					var winnerRank = allUsers.findIndex((u) => u.id === winner.user.id);
					await users.set(`${winner.user.id}.stats.rank`, winnerRank);
				}

				if (loser.user.id !== client.user.id) {
					var losExp = addExp(loser.data.leveling, false, User.Leveling.Range);
					loser.data.leveling = losExp.leveling;

					const loserCat = loser.data.inv.cats.find(
						(c) => c.catId === loser.data.inv.selectedCat
					);

					loserCat.damages = addExp(
						loserCat.damages,
						false,
						User.Cat.Leveling.Range
					).leveling;

					loserCat.defence = addExp(
						loserCat.defence,
						false,
						User.Cat.Leveling.Range
					).leveling;

					var losCoins = Math.floor(Math.random() * 251) + 250;
					loser.data.inv.coins.current += losCoins;
					if (loser.data.inv.coins.current > loser.data.inv.coins.highest) {
						loser.data.inv.coins.highest = loser.data.inv.coins.current;
					}

					loser.data.stats.losses++;
					loser.data.stats.winstreak.current = 0;
					loser.data.stats.time += endTime - start;

					var oldLosElo = loser.data.elo;
					const expectedL = elo.getExpected(
						loser.data.elo,
						winner.data?.elo || 1000
					);
					loser.data.elo = elo.updateRating(expectedL, 0, loser.data.elo);
					loser.data.hist.push(loser.data.elo);
					await users.set(loser.user.id, loser.data);

					var loserRank = allUsers.findIndex((u) => u.id === loser.user.id);
					await users.set(`${loser.user.id}.stats.rank`, loserRank);
				}

				if (slash.isRepliable()) {
					function components(disabled) {
						return [
							new Discord.ActionRowBuilder().setComponents(
								replayButton,
								new Discord.ButtonBuilder()
									.setCustomId("replay-game")
									.setLabel(translate("REPLAY_GAME"))
									.setEmoji("🎥")
									.setStyle(Discord.ButtonStyle.Secondary)
									.setDisabled(disabled)
							),
						];
					}

					const botMessage = await slash.editReply({
						components: components(false),
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
									(reason
										? "<:pinkarrow:1053997226759827507> **" + reason + "**\n"
										: "") +
										translate(
											"GAME_TURNS_TIME",
											`**${(turn + 1).toLocaleString(slash.locale)}**`,
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
											(winner.user.id === client.user.id
												? translate("NO_STATS")
												: translate(
														"RANK",
														`${
															winnerRank - winner.data.stats.rank === 0
																? "-"
																: "↑"
														} **#${(winnerRank + 1).toLocaleString(
															slash.locale
														)}** / ${allUsers.length.toLocaleString(
															slash.locale
														)} *(${ns(winner.data.stats.rank - winnerRank)})*`
												  ) +
												  "\n" +
												  `${
														getRank(winner.data.elo).emoji
												  } ${winner.data.elo.toLocaleString(
														slash.locale
												  )} Elo *(${ns(winner.data.elo - oldWinElo)})*` +
												  "\n" +
												  `${icons.coin} +${winCoins.toLocaleString(
														slash.locale
												  )}` +
												  "\n" +
												  `${icons.exp} +${winExp.xp.toLocaleString(
														slash.locale
												  )}xp${
														winExp.newLevel
															? ` *(${translate("ONE_LEVEL")})*`
															: ""
												  }`),
										inline: true,
									},
									{
										name:
											"<:N_:718506491660992735><:red:989300421602476063> " +
											translate("LOSER"),
										value:
											`<:N_:718506491660992735>[${loser.user.tag}](https://discord.com/users/${loser.user.id})` +
											"\n\n> " +
											(loser.user.id === client.user.id
												? translate("NO_STATS")
												: translate(
														"RANK",
														`${
															loserRank - loser.data.stats.rank === 0
																? "-"
																: "↓"
														} **#${(loserRank + 1).toLocaleString(
															slash.locale
														)}** / ${allUsers.length.toLocaleString(
															slash.locale
														)} *(${ns(loserRank - loser.data.stats.rank)}*)`
												  ) +
												  "\n> " +
												  `${
														getRank(loser.data.elo).emoji
												  } ${loser.data.elo.toLocaleString(
														slash.locale
												  )} Elo *(${ns(oldLosElo - loser.data.elo)})*` +
												  "\n> " +
												  `${icons.coin} +${losCoins.toLocaleString(
														slash.locale
												  )}` +
												  "\n> " +
												  `${icons.exp} +${losExp.xp.toLocaleString(
														slash.locale
												  )}xp${
														losExp.newLevel
															? ` *(${translate("ONE_LEVEL")})*`
															: ""
												  }`),
										inline: true,
									}
								),
						],
						files: [],
					});

					const collector = botMessage.createMessageComponentCollector({
						time: 6e4,
						filter: (i) => i.isButton(),
					});

					let page = 0;
					function turnSelect(disabled) {
						return [
							new Discord.ActionRowBuilder().setComponents(
								new Discord.ButtonBuilder()
									.setCustomId("previous")
									.setEmoji("1054004556067000350")
									.setStyle(Discord.ButtonStyle.Primary)
									.setDisabled(disabled || page <= 0),
								new Discord.ButtonBuilder()
									.setCustomId("page")
									.setLabel(`${page + 1}/${steps.length}`)
									.setStyle(Discord.ButtonStyle.Secondary)
									.setDisabled(disabled),
								new Discord.ButtonBuilder()
									.setCustomId("next")
									.setEmoji("1054004554464768012")
									.setStyle(Discord.ButtonStyle.Primary)
									.setDisabled(disabled || page >= steps.length - 1)
							),
						];
					}

					collector.on("collect", async (button1) => {
						collector.resetTimer();
						switch (button1.customId) {
							case "replay-game": {
								const curCat = steps[page].hostTurn
									? steps[page].cat1
									: steps[page].cat2;

								const botMessage = await button1.reply({
									embeds: [await embed(true, steps[page], true)],
									components: turnSelect(false),
									files: [
										new Discord.AttachmentBuilder()
											.setFile(
												path.join(
													__dirname,
													"../../assets/images/cats",
													curCat.image
												)
											)
											.setName(curCat.id + ".png"),
									],
								});

								const collector = botMessage.createMessageComponentCollector({
									time: 6e4,
									filter: (i) => i.isButton(),
								});

								collector.on("collect", async (button2) => {
									switch (button2.customId) {
										case "previous": {
											if (page > 0) page--;
											break;
										}

										case "next": {
											if (page < steps.length - 1) page++;
											break;
										}

										case "page": {
											return button2.reply({
												content:
													"<a:fabulouscat:1053043411634094230> " +
													translate("PAGE_INDICATOR"),
												ephemeral: true,
											});
										}
									}

									collector.resetTimer();
									button2.deferUpdate();

									const curCat = steps[page].hostTurn
										? steps[page].cat1
										: steps[page].cat2;

									button1.editReply({
										embeds: [await embed(true, steps[page], true)],
										components: turnSelect(false),
										files: [
											new Discord.AttachmentBuilder()
												.setFile(
													path.join(
														__dirname,
														"../../assets/images/cats",
														curCat.image
													)
												)
												.setName(curCat.id + ".png"),
										],
									});
								});

								collector.on("end", () => {
									if (button1.isRepliable()) {
										button1.editReply({
											components: turnSelect(true),
										});
									}
								});

								break;
							}
						}
					});

					collector.on("end", () => {
						if (slash.isRepliable()) {
							slash.editReply({
								components: components(true),
							});
						}
					});
				}

				await stats.add("time", endTime - start);
			}

			collector.on("collect", async (button) => {
				if (
					button.customId !== "info" &&
					button.user.id !== (hostTurn ? player1.user.id : player2.user.id)
				) {
					return button.reply({
						content: icons.error + translate("NOT_TURN"),
						ephemeral: true,
					});
				}

				let dmg = 0,
					protDmg = 0,
					heal = 0,
					stamina = 0,
					absPer = 0,
					boost = false,
					dodged = false,
					critical = false;

				const userCat = cat();
				switch (button.customId) {
					case "attack-1": {
						const attack = userCat.doAttack1(turn);
						dmg = -attack.atk.dmg;
						critical = attack.atk.critical;
						heal = attack.atk.heal;
						protDmg = attack.prot.dmg;
						dodged = attack.prot.dodged;
						absPer = attack.prot.absPer;
						stamina = -attack.stamina;
						break;
					}

					case "attack-2": {
						const attack = userCat.doAttack2(turn);
						dmg = -attack.atk.dmg;
						critical = attack.atk.critical;
						heal = attack.atk.heal;
						protDmg = attack.prot.dmg;
						dodged = attack.prot.dodged;
						absPer = attack.prot.absPer;
						stamina = -attack.stamina;
						break;
					}

					case "defence": {
						const defence = userCat.doDefence(turn);
						heal = defence.def.heal;
						boost = defence.def.boost;
						stamina = defence.def.stamina;
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

				const playerOrder = [
					hostTurn ? player1 : player2,
					hostTurn ? player2 : player1,
				];

				steps.push({
					absPer,
					boost,
					critical,
					dmg,
					dodged,
					heal,
					protDmg,
					stamina,
					cat1: structuredClone(cat1),
					cat2: structuredClone(cat2),
					hostTurn,
					turn,
				});

				await slash.editReply({
					components: components(true),
					embeds: [
						await embed(true, {
							absPer,
							boost,
							critical,
							dmg,
							dodged,
							heal,
							protDmg,
							stamina,
							cat1,
							cat2,
							hostTurn,
							turn,
						}),
					],
				});

				hostTurn = !hostTurn;
				if (hostTurn) turn++;

				return setTimeout(async () => {
					if (end) return;
					const loser = playerOrder.find((p) => p.game.health < 1);
					if (loser) {
						const winner = playerOrder.find((p) => loser.user.id !== p.user.id);
						return await endGame(winner, loser);
					} else {
						await slash.editReply({
							components: components(false),
							embeds: [await embed(false)],
							files: files(),
						});

						if (!hostTurn && player2.user.id === client.user.id) {
							return setTimeout(async () => {
								if (end) return;

								let dmg = 0,
									protDmg = 0,
									heal = 0,
									stamina = 0,
									absPer = 0,
									boost = false,
									dodged = false,
									critical = false;

								const act = Math.floor(Math.random() * 6);
								if (act < 2 && cat2.def.usages !== 0) {
									const defence = cat2.doDefence(turn);
									heal = defence.def.heal;
									boost = defence.def.boost;
									stamina = defence.def.stamina;
								} else if (
									act === 2 &&
									cat2.atk2.usages !== 0 &&
									cat2.atk2.stamina <= player2.game.stamina
								) {
									const attack = cat2.doAttack2(turn);
									dmg = -attack.atk.dmg;
									critical = attack.atk.critical;
									heal = attack.atk.heal;
									protDmg = attack.prot.dmg;
									dodged = attack.prot.dodged;
									absPer = attack.prot.absPer;
									stamina = -attack.stamina;
								} else if (
									cat2.atk1.usages !== 0 &&
									cat2.atk1.stamina <= player2.game.stamina
								) {
									const attack = cat2.doAttack1(turn);
									dmg = -attack.atk.dmg;
									critical = attack.atk.critical;
									heal = attack.atk.heal;
									protDmg = attack.prot.dmg;
									dodged = attack.prot.dodged;
									absPer = attack.prot.absPer;
									stamina = -attack.stamina;
								} else {
									const defence = cat2.doDefence(turn);
									heal = defence.def.heal;
									boost = defence.def.boost;
									stamina = defence.def.stamina;
								}

								steps.push({
									absPer,
									boost,
									critical,
									dmg,
									dodged,
									heal,
									protDmg,
									stamina,
									cat1: structuredClone(cat1),
									cat2: structuredClone(cat2),
									hostTurn,
									turn,
								});

								await slash.editReply({
									components: components(true),
									embeds: [
										await embed(true, {
											absPer,
											boost,
											critical,
											dmg,
											dodged,
											heal,
											protDmg,
											stamina,
											cat1,
											cat2,
											hostTurn,
											turn,
										}),
									],
								});

								return setTimeout(async () => {
									if (end) return;
									const loser = playerOrder.find((p) => p.game.health < 1);
									if (loser) {
										const winner = playerOrder.find(
											(p) => loser.user.id !== p.user.id
										);
										return await endGame(winner, loser);
									} else {
										hostTurn = !hostTurn;
										if (hostTurn) turn++;

										return await slash.editReply({
											components: components(false),
											embeds: [await embed(false)],
											files: files(),
										});
									}
								}, 2000);
							}, Math.floor(Math.random() * 2000) + 2000);
						}
					}
				}, 2000);
			});

			collector.on("end", async () => {
				game.delete();
				client.removeListener("stopGame", stopGame);

				if (!end) {
					end = true;
					if (hostTurn) {
						return await endGame(
							player2,
							player1,
							translate("ENDED_TIME", player1.user.toString())
						);
					} else {
						return await endGame(
							player1,
							player2,
							translate("ENDED_TIME", player2.user.toString())
						);
					}
				}
			});
		}
	},
});
