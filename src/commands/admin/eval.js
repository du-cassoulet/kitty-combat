const Command = require("../../classes/Command");
const Discord = require("discord.js");
const { Type } = require("@extreme_hero/deeptype");
const { inspect } = require("util");

module.exports = new Command({
	options: {
		name: "EVAL",
		description: "EVAL_COMMAND",
		guildId: process.env.DEV_GUILD_ID,
		type: [Discord.ApplicationCommandType.ChatInput],
		options: [
			{
				name: "CODE",
				description: "CODE_DESCRIPTION",
				type: Discord.ApplicationCommandOptionType.String,
				required: true,
			},
		],
	},
	category: Command.Categories.Hidden,
	execute: async function (slash) {
		const code = slash.options.getString("code");
		let evaled;

		try {
			const start = process.hrtime();
			evaled = eval(code);
			if (evaled instanceof Promise) {
				evaled = await evaled;
			}

			const stop = process.hrtime(start);
			const response = [
				`**Code:** \`\`\`js\n${code}\n\`\`\``,
				`**Output:** \`\`\`js\n${clean(inspect(evaled, { depth: 0 }))}\n\`\`\``,
				`**Type:** \`\`\`ts\n${new Type(evaled).is}\n\`\`\``,
				`**Time Taken:** \`\`\`${(stop[0] * 1e9 + stop[1]) / 1e6}ms\`\`\``,
			];

			const res = response.join("\n");

			if (res.length < 4e3) {
				await slash.reply({
					embeds: [
						new Discord.EmbedBuilder().setDescription(res).setTitle("Eval"),
					],
				});
			} else {
				const output = new Discord.AttachmentBuilder(Buffer.from(res), {
					name: "output.txt",
				});

				await slash.reply({ files: [output] });
			}
		} catch (error) {
			return slash.reply({
				content: `Error: \`\`\`xl\n${clean(error)}\n\`\`\``,
			});
		}
	},
});

function clean(txt) {
	if (typeof txt === "string") {
		txt = txt.replace(/`|@/g, `\`${String.fromCharCode(8203)}\``);
	}

	return txt;
}
