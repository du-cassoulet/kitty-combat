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

class Option {
	/**
	 * @param {{
	 * name:keyof import("../lang/en.json"),
	 * description:keyof import("../lang/en.json"),
	 * required:boolean|undefined,
	 * autocomplete:boolean|undefined,
	 * type:number,
	 * maxLength:number|undefined,
	 * minLength:number|undefined,
	 * maxValue:number|undefined,
	 * minValue:number|undefined,
	 * channelTypes:number[]|undefined,,
	 * choices:{name:keyof import("../lang/en.json"),value:string}[]|undefined,
	 * options:Option[]|undefined
	 * }} data
	 */
	constructor(data) {
		this.name = data.name;
		this.description = data.description;
		this.required = data.required;
		this.autocomplete = data.autocomplete;
		this.type = data.type;
		this.maxLength = data.maxLength;
		this.minLength = data.minLength;
		this.maxValue = data.maxValue;
		this.minValue = data.minValue;
		this.channelTypes = data.channelTypes;
		this.choices = data.choices;
		this.options = data.options;
	}
}

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
	 * options:{name:keyof import("../lang/en.json"),description:keyof import("../lang/en.json"),type:number[],guildId:string|undefined,options:Option[]|undefined},
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
