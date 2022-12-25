const Command = require("../../classes/Command");
const Discord = require("discord.js");
const Canvas = require("canvas");
const catCommand = require("../game/cat");
const getUser = require("../../functions/getUser");
const { Leveling } = require("../../classes/User");
const getRank = require("../../functions/getRank");
const path = require("path");

function loadImageURL(imageURL) {
	return new Promise(function (resolve, reject) {
		const image = new Canvas.Image();

		image.src = imageURL;
		image.onerror = reject;
		image.onload = () => resolve(image);
	});
}

const pad = 40;

module.exports = new Command({
	options: {
		name: "PROFILE",
		description: "PROFILE_DESCRIPTION",
		type: [
			Discord.ApplicationCommandType.ChatInput,
			Discord.ApplicationCommandType.User,
		],
		options: [
			{
				name: "USER",
				description: "PROFILE_USER",
				type: Discord.ApplicationCommandOptionType.User,
			},
		],
	},
	category: Command.Categories.Info,
	execute: async function (slash, translate) {
		/** @type {Discord.User} */
		const user = slash.options?.getUser("user") || slash.target || slash.user;
		const data = await getUser(user);
		const rank = getRank(data.elo);

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

		if (!data) {
			return slash.reply({
				content: emoji + " " + translate("USER_NOT_REGISTERED"),
				ephemeral: true,
			});
		}

		await slash.deferReply({ ephemeral: slash.isContextMenuCommand() });
		const canvas = Canvas.createCanvas(500, 500);
		const ctx = canvas.getContext("2d");
		const accentColot = ctx.createLinearGradient(
			0,
			0,
			canvas.width,
			canvas.height
		);
		accentColot.addColorStop(0, "#44e37233");
		accentColot.addColorStop(0, "#43e0be33");

		const highAccent = ctx.createLinearGradient(
			pad,
			canvas.height / 2,
			canvas.width - pad * 2,
			canvas.height / 2
		);
		highAccent.addColorStop(0, "#43e0be");
		highAccent.addColorStop(1, "#44e372");

		const semiAccent = ctx.createLinearGradient(
			pad,
			canvas.height / 2,
			canvas.width - pad * 2,
			canvas.height / 2
		);
		semiAccent.addColorStop(0, "#43e0be88");
		semiAccent.addColorStop(1, "#44e37288");

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

		const background = await loadImageURL(
			client.user.displayAvatarURL({ extension: "png", size: 1024 })
		);
		const avatar = await loadImageURL(data.avatarURL);
		const rankIcon = await Canvas.loadImage(
			path.join(__dirname, "../../assets/images/ranks", rank.image)
		);
		const coinIcon = await Canvas.loadImage(
			path.join(__dirname, "../../assets/images/coin.png")
		);
		const soulIcon = await Canvas.loadImage(
			path.join(__dirname, "../../assets/images/soul.png")
		);

		ctx.drawRoundImage(background, 0, 0, canvas.width, canvas.height, 50);

		ctx.strokeStyle = "#44e37266";
		ctx.fillStyle = "#0007";
		ctx.fillRoundRect(0, 0, canvas.width, canvas.height, 50);

		ctx.fillStyle = accentColot;
		ctx.fillRoundRect(pad, pad, canvas.width - pad * 3 - 130, 130, 40);
		ctx.strokeRoundRect(pad, pad, canvas.width - pad * 3 - 130, 130, 40);

		ctx.fillStyle = "#fff";
		ctx.font = "25px 'SecularOne'";
		ctx.drawImage(coinIcon, pad + 20, pad + 20, 40, 40);
		ctx.drawImage(soulIcon, pad + 20, pad + 70, 40, 40);

		ctx.fillText(
			data.inv.coins.current.toLocaleString(slash.locale),
			pad + 70,
			pad + 47
		);

		ctx.fillText(
			"x" +
				data.inv.cats
					.reduce((a, b) => (a.souls || 0) + (b.souls || 0), 0)
					.toLocaleString(slash.locale),
			pad + 70,
			pad + 97
		);

		ctx.drawRoundImage(avatar, canvas.width - pad - 130, pad, 130, 130, 40);

		ctx.fillStyle = accentColot;
		ctx.fillRoundRect(pad, pad * 2 + 130, canvas.width - pad * 2, 130, 40);
		ctx.strokeRoundRect(pad, pad * 2 + 130, canvas.width - pad * 2, 130, 40);
		ctx.drawImage(rankIcon, pad + 20, pad * 2 + 153, 90, 90);

		ctx.fillStyle = "#fff";
		ctx.font = "35px 'SecularOne'";
		ctx.fillText(translate(rank.name), pad + 135, pad * 2 + 185);

		ctx.fillStyle = "#fffa";
		ctx.font = "25px 'SecularOne'";
		ctx.fillText(
			translate("ELO", data.elo.toLocaleString(slash.locale)),
			pad + 135,
			pad * 2 + 220
		);

		ctx.fillStyle = accentColot;
		ctx.fillRoundRect(pad, pad * 3 + 260, canvas.width - pad * 2, 80, 40);
		ctx.strokeRoundRect(pad, pad * 3 + 260, canvas.width - pad * 2, 80, 40);

		const r = 40;
		const y = pad * 3 + 260;
		const x = pad;
		const w = canvas.width - pad * 2;
		const h = 80;
		const s =
			(data.leveling.xp / (data.leveling.level * Leveling.Range)) *
			(canvas.width - pad * 2);
		const v1 = 20;

		ctx.save();
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.lineTo(x + w - r, y);
		ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		ctx.lineTo(x + w, y + h - r);
		ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		ctx.lineTo(x + r, y + h);
		ctx.quadraticCurveTo(x, y + h, x, y + h - r);
		ctx.lineTo(x, y + r);
		ctx.quadraticCurveTo(x, y, x + r, y);
		ctx.closePath();
		ctx.clip();

		ctx.fillStyle = highAccent;

		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + s, y);
		ctx.quadraticCurveTo(x + s, y + v1, x + s + v1, y + v1);
		ctx.quadraticCurveTo(x + s + v1 + 30, y + v1, x + s + v1 + 30, y + v1 + 30);
		ctx.quadraticCurveTo(x + s + v1 + 30, y + v1 + 60, x + s + v1, y + v1 + 60);
		ctx.lineTo(x + s, y + h);
		ctx.lineTo(x, y + h);
		ctx.fill();

		ctx.beginPath();
		ctx.arc(x + s + v1 * 3.5, y + v1, 10, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();

		ctx.fillStyle = "#fff";
		ctx.font = "30px 'SecularOne'";
		ctx.fillText(
			`Lv.${data.leveling.level.toLocaleString(
				slash.locale
			)} - ${data.leveling.xp.toLocaleString(slash.locale)} / ${(
				data.leveling.level * Leveling.Range
			).toLocaleString(slash.locale)}xp`,
			pad + 30,
			pad * 3 + 310
		);

		function components(disabled) {
			return [
				new Discord.ActionRowBuilder().setComponents(
					new Discord.ButtonBuilder()
						.setCustomId("see-cats")
						.setStyle(Discord.ButtonStyle.Success)
						.setLabel(translate("SEE_CATS"))
						.setEmoji("1054419983075115028")
						.setDisabled(disabled)
				),
			];
		}

		const botMessage = await slash.editReply({
			ephemeral: slash.isContextMenuCommand(),
			files: [
				new Discord.AttachmentBuilder()
					.setFile(canvas.toBuffer())
					.setName("profile.png")
					.setDescription(translate("USER_PROFILE", user.tag)),
			],
			components: components(false),
		});

		const collector = botMessage.createMessageComponentCollector({
			time: 6e4,
			filter: (b) => b.isButton(),
		});

		collector.on("collect", (button) => {
			if (button.customId === "see-cats") {
				collector.resetTimer();

				button.target = user;
				button.action = "list";
				catCommand.execute(button, translate);
			}
		});

		collector.on("end", () => {
			if (slash.isRepliable()) {
				slash.editReply({
					components: components(true),
					ephemeral: slash.isContextMenuCommand(),
				});
			}
		});
	},
});
