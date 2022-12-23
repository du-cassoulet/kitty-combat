const ranks = require("../storage/json/ranks.json");

function getRank(elo) {
	return ranks.find(
		(r) =>
			(r.range.min ? r.range.min <= elo : true) &&
			(r.range.max ? r.range.max >= elo : true)
	);
}

module.exports = getRank;
