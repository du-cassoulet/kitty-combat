const Discord = require("discord.js");

/**
 * @param {keyof import("../lang/en.json")} key
 * @param  {...string} values
 */
function TranslateFunction(key, ...values) {}

/**
 * @param {Discord.ChatInputCommandInteraction} slash
 * @param {TranslateFunction} translate
 */
function ExecuteFunction(slash, translate) {}

/**
 * @param {Discord.AutocompleteInteraction} slash
 * @param {TranslateFunction} translate
 */
function AutocompleteFunction(slash, translate) {}

class Command {
	static Categories = {
		Info: {
			name: "INFO_CATEGORY_NAME",
			description: "INFO_CATEGORY_DESCRIPTION",
		},
		Game: {
			name: "GAME_CATEGORY_NAME",
			description: "GAME_CATEGORY_DESCRIPTION",
		},
		Economy: {
			name: "ECONOMY_CATEGORY_NAME",
			description: "ECONOMY_CATEGORY_DESCRIPTION",
		},
		Hidden: {
			name: "HIDDEN_CATEGORY_NAME",
			description: "HIDDEN_CATEGORY_DESCRIPTION",
		},
	};

	/**
	 * @param {{
	 * options:Discord.ApplicationCommandResolvable,
	 * category:{name:string,description:string},
	 * execute:ExecuteFunction,
	 * autocomplete:AutocompleteFunction
	 * }} data
	 */
	constructor(data) {
		this.options = data.options;
		this.category = data.category;
		this.execute = data.execute || (() => {});
		this.autocomplete = data.autocomplete || (() => {});
	}
}

module.exports = Command;
