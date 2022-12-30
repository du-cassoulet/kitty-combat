class Logger {
	static Markup = {
		Reset: "\x1b[0m",
		Bright: "\x1b[1m",
		Dim: "\x1b[2m",
		Underscore: "\x1b[4m",
		Blink: "\x1b[5m",
		Reverse: "\x1b[7m",
		Hidden: "\x1b[8m",
		FgBlack: "\x1b[30m",
		FgRed: "\x1b[31m",
		FgGreen: "\x1b[32m",
		FgYellow: "\x1b[33m",
		FgBlue: "\x1b[34m",
		FgMagenta: "\x1b[35m",
		FgCyan: "\x1b[36m",
		FgWhite: "\x1b[37m",
		FgGray: "\x1b[90m",
		BgBlack: "\x1b[40m",
		BgRed: "\x1b[41m",
		BgGreen: "\x1b[42m",
		BgYellow: "\x1b[43m",
		BgBlue: "\x1b[44m",
		BgMagenta: "\x1b[45m",
		BgCyan: "\x1b[46m",
		BgWhite: "\x1b[47m",
		BgGray: "\x1b[100m",
	};

	constructor() {}

	/**
	 * @param  {...string|number} args
	 */
	log(...args) {
		for (const arg of args) {
			if (["number", "string"].includes(typeof arg)) {
				console.log(
					(dev
						? Logger.Markup.BgYellow +
						  Logger.Markup.FgBlack +
						  "[DEV]" +
						  Logger.Markup.Reset +
						  " "
						: "") +
						Logger.Markup.BgMagenta +
						Logger.Markup.FgBlack +
						"[INFO]" +
						Logger.Markup.Reset +
						Logger.Markup.FgMagenta +
						" " +
						arg.toString() +
						Logger.Markup.Reset
				);
			} else {
				console.log(arg);
			}
		}
	}

	/**
	 * @param  {...string|number} args
	 */
	db(...args) {
		for (const arg of args) {
			if (["number", "string"].includes(typeof arg)) {
				console.log(
					(dev
						? Logger.Markup.BgYellow +
						  Logger.Markup.FgBlack +
						  "[DEV]" +
						  Logger.Markup.Reset +
						  " "
						: "") +
						Logger.Markup.BgCyan +
						Logger.Markup.FgBlack +
						"[DATABASE]" +
						Logger.Markup.Reset +
						Logger.Markup.FgCyan +
						" " +
						arg +
						Logger.Markup.Reset
				);
			} else {
				console.log(arg);
			}
		}
	}

	/**
	 * @param  {...string|number} args
	 */
	event(...args) {
		for (const arg of args) {
			if (["number", "string"].includes(typeof arg)) {
				console.log(
					(dev
						? Logger.Markup.BgYellow +
						  Logger.Markup.FgBlack +
						  "[DEV]" +
						  Logger.Markup.Reset +
						  " "
						: "") +
						Logger.Markup.BgGreen +
						Logger.Markup.FgBlack +
						"[EVENT]" +
						Logger.Markup.Reset +
						Logger.Markup.FgGreen +
						" " +
						arg +
						Logger.Markup.Reset
				);
			} else {
				console.log(arg);
			}
		}
	}

	/**
	 * @param  {...string|number} args
	 */
	feed(...args) {
		for (const arg of args) {
			if (["number", "string"].includes(typeof arg)) {
				console.log(
					(dev
						? Logger.Markup.BgYellow +
						  Logger.Markup.FgBlack +
						  "[DEV]" +
						  Logger.Markup.Reset +
						  " "
						: "") +
						Logger.Markup.BgBlue +
						Logger.Markup.FgBlack +
						"[FEED]" +
						Logger.Markup.Reset +
						Logger.Markup.FgBlue +
						" " +
						arg +
						Logger.Markup.Reset
				);
			} else {
				console.log(arg);
			}
		}
	}

	/**
	 * @param  {...string|number} args
	 */
	ws(...args) {
		for (const arg of args) {
			if (["number", "string"].includes(typeof arg)) {
				console.log(
					(dev
						? Logger.Markup.BgYellow +
						  Logger.Markup.FgBlack +
						  "[DEV]" +
						  Logger.Markup.Reset +
						  " "
						: "") +
						Logger.Markup.BgGray +
						Logger.Markup.FgBlack +
						"[WEBSOCKET]" +
						Logger.Markup.Reset +
						Logger.Markup.FgGray +
						" " +
						arg +
						Logger.Markup.Reset
				);
			} else {
				console.log(arg);
			}
		}
	}
}

module.exports = Logger;
