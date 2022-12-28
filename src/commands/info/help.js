const Command = require("../../classes/Command");
const Discord = require("discord.js");
const getCommand = require("../../functions/getCommand");

function getName(command, locale) {
	if (command.nameLocalizations[locale]) {
		return command.nameLocalizations[locale];
	} else {
		return command.nameLocalizations["en-US"];
	}
}

function getDescription(command, locale) {
	if (command.descriptionLocalizations[locale]) {
		return command.descriptionLocalizations[locale];
	} else {
		return command.descriptionLocalizations["en-US"];
	}
}

module.exports = new Command({
	options: {
		name: "COMMAND_HELP",
		description: "DESCRIPTION_HELP",
		dmPermission: false,
		type: [Discord.ApplicationCommandType.ChatInput],
		options: [
			{
				name: "COMMAND_NAME",
				description: "HELP_COMMAND_OPTION",
				type: Discord.ApplicationCommandOptionType.String,
				required: false,
				autocomplete: true,
			},
		],
	},
	category: Command.Categories.Info,
	autocomplete: async function (slash, translate) {
		const query = slash.options.getFocused();
		const filtered = client.commands.filter(
			(c) =>
				c.category.name !== "HIDDEN_CATEGORY_NAME" &&
				getName(c.options, slash.locale).startsWith(query)
		);

		return slash.respond(
			filtered
				.map((c) => ({
					name: getName(c.options, slash.locale),
					value: c.options.name,
				}))
				.slice(0, 25)
		);
	},
	execute: async function (slash, translate) {
		const commandName = slash.options?.getString("command");

		if (commandName) {
			const command = client.commands.get(commandName);

			if (!command) {
				return slash.reply({
					content: icons.error + translate("INVALID_COMMAND"),
					ephemeral: true,
				});
			}

			slash.reply({
				embeds: [
					new Discord.EmbedBuilder()
						.setTitle(
							"🔍 " +
								translate("HELP_FOR", getName(command.options, slash.locale))
						)
						.setColor(client.embedColor)
						.setFields(
							{
								name: translate("NAME"),
								value: getName(command.options, slash.locale),
								inline: true,
							},
							{
								name: translate("USAGES"),
								value: (
									(await stats.get(`commands.${command.options.name}`)) || 0
								).toLocaleString(slash.locale),
								inline: true,
							},
							{
								name: translate("PATTERN"),
								value: readOptions(
									command.options.options || [],
									"/" + getName(command.options, slash.locale)
								).join("\n"),
							},
							{
								name: translate("DESCRIPTION"),
								value: getDescription(command.options, slash.locale),
							}
						),
				],
			});
		} else {
			const categories = {};
			const descriptions = {};

			function addCommand(command) {
				if (categories[command.category.name]) {
					categories[command.category.name].push(command);
				} else {
					categories[command.category.name] = [command];
				}
			}

			client.commands.forEach((command) => {
				if (
					command.options.guildId &&
					command.options.guildId !== slash.guildId
				) {
					return;
				}

				if (!descriptions[command.category.name]) {
					descriptions[command.category.name] = translate(
						command.category.description
					);
				}

				const options = command.options.options || [];
				if (
					options.every(
						(o) => o.type === Discord.ApplicationCommandOptionType.Subcommand
					) &&
					options.length > 0
				) {
					for (const option of options) {
						const commandName = command.options.name + " " + option.name;

						addCommand({
							...command,
							options: { ...command.options, name: commandName },
						});
					}
				} else {
					addCommand(command);
				}
			});

			const embed = new Discord.EmbedBuilder()
				.setTitle("🔍 " + translate("HELP_COMMAND"))
				.setColor(client.embedColor)
				.setThumbnail(client.user.displayAvatarURL());

			Object.entries(categories).forEach(([catName, catContent]) => {
				embed.addFields({
					name: "<:pinkarrow:1053997226759827507> " + translate(catName),
					value:
						"*" +
						descriptions[catName] +
						"*" +
						"\n\n" +
						catContent.map((c) => `${getCommand(c.options.name)}`).join(" "),
				});
			});

			return slash.reply({
				embeds: [embed],
				ephemeral: !slash.options,
				components: [
					new Discord.ActionRowBuilder().setComponents(
						new Discord.ButtonBuilder()
							.setStyle(Discord.ButtonStyle.Link)
							.setLabel(translate("SUPPORT_SERVER"))
							.setURL(process.env.SUPPORT_INVITE_URL)
							.setEmoji("🪩")
					),
				],
			});
		}
	},
});

/**
 * @param {Discord.ApplicationCommandOption[]} options
 * @param {string} prefix
 * @returns {string[]}
 */
function readOptions(options, prefix) {
	let usages = [];

	const types = [
		"sub-command",
		"sub-command-group",
		"string",
		"integer",
		"boolean",
		"user",
		"channel",
		"role",
		"mentionable",
		"number",
		"attachment",
	];

	let cstr = prefix;

	for (const option of options) {
		if (option.type < 3) {
			if ((option.options || []).length === 0) {
				usages.push(`${prefix} ${getName(option)}`);
			} else {
				usages = [
					...readOptions(option.options || [], `${prefix} ${getName(option)}`),
					...usages,
				];
			}
		} else {
			cstr += ` ${option.required ? "<" : "["}${getName(option)}: ${
				types[option.type - 1]
			}${option.required ? ">" : "]"}`;
		}
	}

	if (cstr !== prefix) {
		usages.push(cstr);
	}

	if (usages.length > 0) {
		return usages;
	} else {
		return [prefix];
	}
}
