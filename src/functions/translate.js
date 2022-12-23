const path = require("path");

function translate(ISO639_1, key, ...values) {
	const lang = require(path.join(__dirname, "../lang", ISO639_1 + ".json"));
	let str = lang[key];

	for (const value of values) {
		str = str.replace("%s", value);
	}

	return str;
}

module.exports = translate;
