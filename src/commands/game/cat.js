const Command = require("../../classes/Command");
const Discord = require("discord.js");
const rarities = require("../../storage/json/rarities.json");
const path = require("path");
const getColor = require("../../functions/getColor");
const Canvas = require("canvas");
const User = require("../../classes/User");
const getUser = require("../../functions/getUser");
const Cats = require("../../classes/Cats");
const Cat = require("../../classes/Cat");
const getCommand = require("../../functions/getCommand");

function clean(s) {
	return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

module.exports = new Command({
	options: {
		name: "CAT",
		description: "CAT_DESCRIPTION",
		type: [Discord.ApplicationCommandType.ChatInput],
		options: [
			{
				name: "SEE",
				description: "TO_SEE",
				type: Discord.ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "CAT",
						description: "CHOOSEN_CAT",
						type: Discord.ApplicationCommandOptionType.String,
						required: true,
						autocomplete: true,
					},
				],
			},
			{
				name: "RENAME",
				description: "TO_RENAME",
				type: Discord.ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "CAT",
						description: "RENAME_CAT",
						type: Discord.ApplicationCommandOptionType.String,
						required: true,
						autocomplete: true,
					},
					{
						name: "CAT_NAME",
						description: "NEW_NAME",
						type: Discord.ApplicationCommandOptionType.String,
						required: true,
						autocomplete: false,
						maxLength: 20,
						minLength: 3,
					},
				],
			},
			{
				name: "LIST",
				description: "LIST_DESCRIPTION",
				type: Discord.ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "USER",
						description: "USER_CAT_LIST",
						type: Discord.ApplicationCommandOptionType.User,
						required: false,
					},
				],
			},
			{
				name: "SELECT",
				description: "SELECT_DESCRIPTION",
				type: Discord.ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "CAT",
						description: "SELECT_CAT",
						type: Discord.ApplicationCommandOptionType.String,
						required: true,
						autocomplete: true,
					},
				],
			},
			{
				name: "TRADE",
				description: "TRADE_DESCRIPTION",
				type: Discord.ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "CAT",
						description: "TRADE_CAT",
						type: Discord.ApplicationCommandOptionType.String,
						required: true,
						autocomplete: true,
					},
					{
						name: "CAT_WANT",
						description: "CAT_WANT_DESCRIPTION",
						type: Discord.ApplicationCommandOptionType.String,
						required: true,
						autocomplete: true,
					},
				],
			},
		],
	},
	category: Command.Categories.Game,
	autocomplete: async function (slash, translate) {
		const query = slash.options.getFocused(true);

		if (query.name === "cat") {
			const data = await getUser(slash.user);
			const userCats = data.inv.cats;

			let unnamedAmount = 0;
			const allCats = userCats.map((c) => {
				if (!c.name) unnamedAmount++;
				const Cat = Cats[c.catId];
				const type = translate(Cat.name);

				return {
					name:
						c.name ||
						translate("UNNAMED_CAT") +
							" " +
							unnamedAmount.toLocaleString(slash.locale) +
							` - (${type})`,
					catId: c.catId,
					type: type,
				};
			});

			const filtered = allCats.filter(
				(c) =>
					clean(c.name).startsWith(clean(query.value)) ||
					clean(c.type).startsWith(clean(query.value))
			);

			return slash.respond(
				filtered.map((c) => ({ name: c.name, value: c.catId })).slice(0, 25)
			);
		} else if (query.name === "wanted-cat") {
			const filtered = Object.values(Cats).filter((c) =>
				clean(translate(c.name)).startsWith(clean(query.value))
			);

			return slash.respond(
				filtered
					.map((c) => ({ name: translate(c.name), value: c.id }))
					.slice(0, 25)
			);
		}
	},
	execute: async function (slash, translate) {
		const action = slash.action || slash.options.getSubcommand();

		switch (action) {
			case "see": {
				let data = await getUser(slash.user);
				const catId = slash.options.getString("cat");
				const userCats = data.inv.cats;

				const Cat = Cats[catId];
				if (!Cat) {
					return slash.reply({
						content: icons.error + translate("CAT_DONT_EXIST", `**${catId}**`),
						ephemeral: true,
					});
				}

				const catInfo = User.Cat.form(userCats.find((c) => c.catId === catId));
				if (!catInfo) {
					return slash.reply({
						content:
							icons.error +
							translate("DONT_OWN_CAT", `**${translate(Cat.name)}**`),
						ephemeral: true,
					});
				}

				/** @type {Cat} */
				const cat = new Cat();

				function components(disabled) {
					return [
						new Discord.ActionRowBuilder().setComponents(
							new Discord.ButtonBuilder()
								.setCustomId("select")
								.setStyle(Discord.ButtonStyle.Secondary)
								.setEmoji("1054419983075115028")
								.setLabel(translate("SELECT_THIS_CAT"))
								.setDisabled(disabled),
							new Discord.ButtonBuilder()
								.setCustomId("info")
								.setStyle(Discord.ButtonStyle.Secondary)
								.setEmoji("1053602021808283709")
								.setLabel(translate("ACT_INFO"))
								.setDisabled(disabled)
						),
					];
				}

				const botMessage = await slash.reply({
					embeds: [
						new Discord.EmbedBuilder()
							.setColor(getColor(cat.imageData).hex)
							.setTitle("💭 " + (catInfo.name || translate("UNNAMED_CAT")))
							.setThumbnail(`attachment://${Cat.id}_thumbnail.png`)
							.setFields(
								{
									name: translate("CAT_TYPE"),
									value: translate(Cat.name),
									inline: true,
								},
								{
									name: translate("SOUL_AMOUNT"),
									value: `${icons.medaillon} x${catInfo.souls.toLocaleString(
										slash.locale
									)}`,
									inline: true,
								},
								{
									name: translate("RARITY"),
									value: `${rarities[Cat.rarity].emoji} ${translate(
										rarities[Cat.rarity].name
									)}`,
									inline: true,
								},
								{
									name: translate("DAMAGES"),
									value:
										translate(
											"LEVEL",
											"**" +
												catInfo.damages.level.toLocaleString(slash.locale) +
												"**"
										) +
										"\n" +
										makeProgress(
											catInfo.damages.xp,
											catInfo.damages.level * 500
										) +
										` (${catInfo.damages.xp.toLocaleString(slash.locale)}/**${(
											catInfo.damages.level * 500
										).toLocaleString(slash.locale)}xp**)`,
								},
								{
									name: translate("DEFENCE"),
									value:
										translate(
											"LEVEL",
											"**" +
												catInfo.defence.level.toLocaleString(slash.locale) +
												"**"
										) +
										"\n" +
										makeProgress(
											catInfo.defence.xp,
											catInfo.defence.level * 500
										) +
										` (${catInfo.defence.xp.toLocaleString(slash.locale)}/**${(
											catInfo.defence.level * 500
										).toLocaleString(slash.locale)}xp**)`,
								}
							),
					],
					components: components(false),
					files: [
						new Discord.AttachmentBuilder(
							path.join(__dirname, "../../assets/images/cats", Cat.image),
							{ name: `${Cat.id}_thumbnail.png` }
						),
					],
				});

				const collector = botMessage.createMessageComponentCollector({
					time: 6e4,
					filter: (i) => i.isButton(),
				});

				collector.on("collect", async (button) => {
					collector.resetTimer();

					switch (button.customId) {
						case "info": {
							return await button.reply({
								embeds: [
									new Discord.EmbedBuilder()
										.setColor(getColor(cat.imageData).hex)
										.setTitle(translate("INFO_ABOUT", translate(cat.name)))
										.setThumbnail(`attachment://${cat.id}.png`)
										.setFields(
											{
												name:
													"<:pinkarrow:1053997226759827507> " +
													translate("ATTACK_1") +
													" - " +
													translate(cat.atk1.name),
												value: translate(cat.atk1.description),
												inline: true,
											},
											{
												name:
													"<:pinkarrow:1053997226759827507> " +
													translate("ATTACK_2") +
													" - " +
													translate(cat.atk2.name),
												value: translate(cat.atk2.description),
												inline: true,
											},
											{
												name:
													"<:pinkarrow:1053997226759827507> " +
													translate("DEFENCE") +
													" - " +
													translate(cat.def.name),
												value: translate(cat.def.description),
												inline: false,
											}
										),
								],
								ephemeral: true,
								files: [
									new Discord.AttachmentBuilder()
										.setFile(
											path.join(
												__dirname,
												"../../assets/images/cats",
												cat.image
											)
										)
										.setName(`${cat.id}.png`),
								],
							});
						}

						case "select": {
							if (button.user.id !== slash.user.id) {
								return button.reply({
									content: icons.error + translate("NOT_AUTHOR_COMMAND"),
									ephemeral: true,
								});
							}

							const inGame = client.inGame.get(slash.user.id);
							if (inGame) {
								const game = client.games.get(inGame);
								if (!game.starting) {
									return button.reply({
										content:
											icons.error + translate("CANT_SELECT_WHILE_PLAYING"),
										ephemeral: true,
									});
								}
							}

							if (data.inv.selectedCat === catId) {
								return button.reply({
									content: icons.error + translate("ALREADY_SELECTED"),
									ephemeral: true,
								});
							}

							data = await users.set(`${slash.user.id}.inv.selectedCat`, catId);
							client.emit("newSelectedCat", slash.user, data);

							await slash.editReply({
								components: components(false),
							});

							return await button.reply({
								ephemeral: true,
								content:
									icons.success +
									(catInfo.name
										? translate(
												"SELECTED_CAT_NAME",
												`**${catInfo.name}**`,
												translate(Cat.name)
										  )
										: translate("SELECTED_CAT", `**${translate(Cat.name)}**`)),
							});
						}
					}
				});

				collector.on("end", async () => {
					return await slash.editReply({
						components: components(true),
					});
				});

				break;
			}

			case "rename": {
				const catId = slash.options.getString("cat");
				const data = await getUser(slash.user);
				const userCats = data.inv.cats;

				const Cat = Cats[catId];
				if (!Cat) {
					return slash.reply({
						content: icons.error + translate("CAT_DONT_EXIST", `**${catId}**`),
						ephemeral: true,
					});
				}

				const cat = userCats.find((c) => c.catId === catId);
				if (!cat) {
					return slash.reply({
						content:
							icons.error +
							translate("DONT_OWN_CAT", `**${translate(Cat.name)}**`),
						ephemeral: true,
					});
				}

				const oldName = cat.name;
				cat.name = slash.options.getString("new-name");
				await users.set(`${slash.user.id}.inv.cats`, userCats);

				return slash.reply({
					content:
						icons.success +
						translate(
							"RENAMED_CAT",
							`**${oldName || translate("UNNAMED_CAT")}**`,
							`**${cat.name}**`
						),
				});
			}

			case "list": {
				const user =
					slash.options?.getUser("user") || slash.target || slash.user;

				const emojis = [
					":pensive:",
					":face_holding_back_tears: ",
					":smiling_face_with_tear:",
					":grimacing:",
				];
				const emoji = emojis[Math.floor(Math.random() * emojis.length)];

				if (user.bot) {
					return slash.reply({
						content: emoji + " " + translate("BOTS_CANT_PLAY"),
						ephemeral: true,
					});
				}

				const data = await getUser(user);
				if (!data) {
					return slash.reply({
						content: emoji + " " + translate("USER_NOT_REGISTERED"),
						ephemeral: true,
					});
				}

				const userCats = data.inv.cats;
				const dataCats = Object.values(Cats).map((cat) => ({
					name: cat.name,
					id: cat.id,
					rarity: cat.rarity,
					image: cat.image,
					data: userCats.find((c) => c.catId === cat.id),
				}));

				const allCats = [
					...dataCats
						.filter((cat) => cat.data)
						.sort((a, b) => b.rarity - a.rarity),
					...dataCats
						.filter((cat) => !cat.data)
						.sort((a, b) => a.rarity - b.rarity),
				];

				let page = 0;
				const itemHeight = 100;
				const itemWidth = 500;
				const itemPerPage = 5;
				const gap = 15;
				const maxPage = Math.ceil(allCats.length / itemPerPage);
				const radius = 25;
				const pad = 10;

				async function list(page = 0) {
					const canvas = Canvas.createCanvas(
						itemWidth,
						itemPerPage * itemHeight + gap * (itemPerPage - 1) + pad * 2
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
					 * @param {Canvas.Image} image
					 * @param {number} x
					 * @param {number} y
					 * @param {number} width
					 * @param {number} height
					 * @param {number} radius
					 */
					ctx.drawRoundImage = function (image, x, y, width, height, radius) {
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
						this.save();
						this.clip();
						this.drawImage(image, x, y, width, height);
						this.restore();
					};

					for (let i = 0; i < itemPerPage; i++) {
						const cat = allCats[page * itemPerPage + i];
						if (!cat) continue;

						const image = await Canvas.loadImage(
							path.join(__dirname, "../../assets/images/cats", cat.image)
						);

						const imageColor = getColor(image);
						ctx.fillStyle = imageColor.hex;
						ctx.save();

						const { r, g, b } = imageColor.rgb;
						const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);
						const bright = brightness > 125;

						ctx.shadowColor = rarities[cat.rarity].color;
						ctx.shadowBlur = 5;
						ctx.shadowOffsetX = 0;
						ctx.shadowOffsetY = 0;

						ctx.fillRoundRect(
							pad,
							i * (itemHeight + gap) + pad,
							itemWidth - pad * 2,
							itemHeight,
							radius
						);

						ctx.clip();
						ctx.shadowColor = "#0000";

						const gradient = ctx.createLinearGradient(
							pad,
							i * (itemHeight + gap) + itemHeight / 2 + pad,
							itemWidth - pad * 2,
							i * (itemHeight + gap) + itemHeight / 2 + pad
						);
						gradient.addColorStop(0, "#0008");
						gradient.addColorStop(1, "#0000");

						ctx.fillStyle = gradient;
						ctx.fillRect(
							pad,
							i * (itemHeight + gap) + pad,
							itemWidth - pad * 2,
							itemHeight
						);

						ctx.drawRoundImage(
							image,
							pad,
							i * (itemHeight + gap) + pad,
							itemHeight,
							itemHeight,
							radius
						);

						ctx.textBaseline = "middle";

						if (!cat.data) {
							const imageData = ctx.getImageData(
								0,
								i * (itemHeight + gap),
								itemWidth,
								itemHeight + gap
							);

							const grayImageData = ctx.createImageData(imageData);
							for (let i = 0; i < imageData.data.length; i += 4) {
								const r = imageData.data[i];
								const g = imageData.data[i + 1];
								const b = imageData.data[i + 2];
								const a = imageData.data[i + 3];

								const gray = 0.21 * r + 0.72 * g + 0.07 * b;

								grayImageData.data[i] = gray;
								grayImageData.data[i + 1] = gray;
								grayImageData.data[i + 2] = gray;
								grayImageData.data[i + 3] = a > 125 ? 125 : a;
							}

							ctx.putImageData(grayImageData, 0, i * (itemHeight + gap));

							ctx.textAlign = "center";
							ctx.fillStyle = "#2f3136";
							ctx.font = "60px SecularOne";

							ctx.fillText(
								translate("UNKNOWN").toUpperCase(),
								itemWidth / 2 + itemHeight / 2,
								i * (itemHeight + gap) + itemHeight / 2 + 3 + pad
							);
						} else {
							ctx.textAlign = "left";
							ctx.fillStyle = bright ? "#0008" : "#fff8";
							ctx.font = "30px 'SecularOne'";

							ctx.fillText(
								cat.data.name || translate("UNNAMED_CAT"),
								20 + itemHeight + pad,
								i * (itemHeight + gap) + 35 + pad
							);

							ctx.fillStyle = bright ? "#0004" : "#fff4";
							ctx.font = "25px 'SecularOne'";

							ctx.fillText(
								translate(cat.name),
								20 + itemHeight + pad,
								i * (itemHeight + gap) + 70 + pad
							);
						}

						ctx.restore();
					}

					const buffer = canvas.toBuffer();
					stats.add("images.number", 1);
					stats.add("images.size", buffer.byteLength);
					return buffer;
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
								.setDisabled(end || page >= maxPage - 1)
						),
					];
				}

				const botMessage = await slash.reply({
					files: [
						new Discord.AttachmentBuilder()
							.setFile(await list(page))
							.setName(`cat_list.png`)
							.setDescription(translate("CATS_LIST", user.tag)),
					],
					components: components(page, false),
					ephemeral: !!slash.target,
				});

				const collector = botMessage.createMessageComponentCollector({
					time: 6e4,
					filter: (b) => b.isButton(),
				});

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
						return slash.editReply({
							files: [
								new Discord.AttachmentBuilder()
									.setFile(await list(page))
									.setName(`cat_list.png`)
									.setDescription(translate("CATS_LIST", user.tag)),
							],
							components: components(page, false),
						});
					}
				});

				collector.on("end", () => {
					if (slash.isRepliable()) {
						slash.editReply({ components: components(page, true) });
					}
				});

				break;
			}

			case "select": {
				const catId = slash.options.getString("cat");
				const data = await getUser(slash.user);
				const inGame = client.inGame.get(slash.user.id);

				if (inGame) {
					const game = client.games.get(inGame);
					if (!game.starting) {
						return slash.reply({
							content: icons.error + translate("CANT_SELECT_WHILE_PLAYING"),
							ephemeral: true,
						});
					}
				}

				if (data.inv.selectedCat === catId) {
					return slash.reply({
						content: icons.error + translate("ALREADY_SELECTED"),
						ephemeral: true,
					});
				}

				const Cat = Cats[catId];
				if (!Cat) {
					return slash.reply({
						content: icons.error + translate("CAT_DONT_EXIST", `**${catId}**`),
						ephemeral: true,
					});
				}

				const cat = data.inv.cats.find((c) => c.catId === catId);
				if (!cat) {
					return slash.reply({
						content:
							icons.error +
							translate("DONT_OWN_CAT", `**${translate(Cat.name)}**`),
						ephemeral: true,
					});
				}

				const userData = await users.set(
					`${slash.user.id}.inv.selectedCat`,
					catId
				);
				client.emit("newSelectedCat", slash.user, userData);

				return slash.reply({
					content:
						icons.success +
						(cat.name
							? translate(
									"SELECTED_CAT_NAME",
									`**${cat.name}**`,
									translate(Cat.name)
							  )
							: translate("SELECTED_CAT", `**${translate(Cat.name)}**`)),
				});
			}

			case "trade": {
				const userCatId = slash.options.getString("cat");
				const wantCatId = slash.options.getString("wanted-cat");
				const data = await getUser(slash.user);

				const userCat = Cats[userCatId];
				const wantCat = Cats[wantCatId];

				if (!userCat) {
					return slash.reply({
						content:
							icons.error + translate("CAT_DONT_EXIST", `**${userCatId}**`),
						ephemeral: true,
					});
				}

				if (!wantCat) {
					return slash.reply({
						content:
							icons.error + translate("CAT_DONT_EXIST", `**${wantCatId}**`),
						ephemeral: true,
					});
				}

				if (userCatId === wantCatId) {
					return slash.reply({
						content:
							icons.error +
							translate(
								"SAME_CAT",
								`**${translate(userCat.name)}**`,
								`**${translate(wantCat.name)}**`
							),
						ephemeral: true,
					});
				}

				if (data.inv.cats.find((c) => c.catId === wantCatId)) {
					return slash.reply({
						content: icons.error + translate("ALREADY_OWN_CAT"),
						ephemeral: true,
					});
				}

				const catIdx = data.inv.cats.findIndex((c) => c.catId === userCatId);
				if (catIdx === -1) {
					return slash.reply({
						content:
							icons.error +
							translate("DONT_OWN_CAT", `**${translate(userCat.name)}**`),
						ephemeral: true,
					});
				}

				function tradeRow(disabled) {
					return [
						new Discord.ActionRowBuilder().setComponents(
							new Discord.ButtonBuilder()
								.setCustomId("make-trade")
								.setLabel(translate("MAKE_TRADE"))
								.setStyle(Discord.ButtonStyle.Primary)
								.setEmoji("🔀")
								.setDisabled(disabled),
							new Discord.ButtonBuilder()
								.setCustomId("cancel")
								.setLabel(translate("CANCEL"))
								.setStyle(Discord.ButtonStyle.Danger)
								.setEmoji("1054713221883363399")
								.setDisabled(disabled)
						),
					];
				}

				const botMessage = await slash.reply({
					embeds: [
						new Discord.EmbedBuilder()
							.setColor(
								getColor(
									await Canvas.loadImage(
										path.join(
											__dirname,
											"../../assets/images/cats",
											userCat.image
										)
									)
								).hex
							)
							.setThumbnail("attachment://" + userCatId + ".png")
							.setDescription(
								translate(
									"WANT_TRADE",
									slash.user.toString(),
									data.inv.cats[catIdx].name
										? `**${data.inv.cats[catIdx].name}** (${translate(
												userCat.name
										  )})`
										: `**${translate(userCat.name)}**`,
									`**${translate(wantCat.name)}**`
								) +
									"\n\n" +
									translate("CLICK_BUTTON", slash.user.username) +
									"\n\n" +
									translate("LVL_1_TRADE")
							)
							.setFooter({ text: translate("NEED_CAT_TRADE") })
							.setTitle("🤝 " + translate("TRADE_OFFER")),
					],
					files: [
						new Discord.AttachmentBuilder()
							.setFile(
								path.join(__dirname, "../../assets/images/cats", userCat.image)
							)
							.setName(userCatId + ".png"),
					],
					components: tradeRow(false),
				});

				const collector = botMessage.createMessageComponentCollector({
					time: 1.8e5,
					filter: (i) => i.isButton(),
				});

				collector.on("collect", async (button) => {
					switch (button.customId) {
						case "make-trade": {
							if (button.user.id === slash.user.id) {
								return button.reply({
									content: icons.error + translate("YOU_MADE_TRADE"),
									ephemeral: true,
								});
							}

							const tradeData = await getUser(button.user);
							if (!tradeData) {
								return button.reply({
									content:
										"<:catpaw:1053011873093664839> " +
										translate("START_TO_START", getCommand("start")),
									ephemeral: true,
								});
							}

							const tradeCatIdx = tradeData.inv.cats.findIndex(
								(c) => c.catId === wantCatId
							);

							if (tradeCatIdx === -1) {
								return button.reply({
									content:
										icons.error +
										translate("DONT_OWN_CAT", `**${translate(wantCat.name)}**`),
									ephemeral: true,
								});
							}

							if (tradeData.inv.cats.find((c) => c.catId === userCatId)) {
								return button.reply({
									content: icons.error + translate("ALREADY_OWN_CAT"),
									ephemeral: true,
								});
							}

							tradeData.inv.cats.splice(tradeCatIdx, 1);
							data.inv.cats.splice(catIdx, 1);

							tradeData.inv.cats.push(
								new User.Cat()
									.setName(null)
									.setCatId(userCatId)
									.setSouls(1)
									.setDamages(0, 0)
									.setDefence(0, 0)
							);

							data.inv.cats.push(
								new User.Cat()
									.setName(null)
									.setCatId(wantCatId)
									.setSouls(1)
									.setDamages(0, 0)
									.setDefence(0, 0)
							);

							await users.set(`${slash.user.id}.inv.cats`, data.inv.cats);
							await users.set(`${button.user.id}.inv.cats`, tradeData.inv.cats);

							return button.reply({
								content: icons.success + translate("TRADE_SUCCESS"),
							});
						}

						case "cancel": {
							if (button.user.id !== slash.user.id) {
								return button.reply({
									content: icons.error + translate("NOT_TRADE_AUTHOR"),
									ephemeral: true,
								});
							}

							collector.stop();
							button.deferUpdate();
						}
					}
				});

				collector.on("end", () => {
					slash.editReply({ components: tradeRow(true) });
				});

				break;
			}
		}
	},
});

const LENGTH = 10;

/**
 * @param {number} val
 * @param {number} max
 */
function makeProgress(val, max) {
	let s = "";
	const ratio = (val / max) * LENGTH;

	for (let i = 0; i < LENGTH; i++) {
		if (i === 0) {
			var emojis = ["<:lr:1053414000928489502>", "<:lg:1053413995954044939>"];
		} else if (i === LENGTH - 1) {
			var emojis = ["<:rr:1053414001863827547>", "<:rg:1053413996839051376>"];
		} else {
			var emojis = ["<:mr:1053413999867347144>", "<:mg:1053413998491607110>"];
		}

		if (i < ratio) {
			s += emojis[1];
		} else {
			s += emojis[0];
		}
	}

	return s;
}
