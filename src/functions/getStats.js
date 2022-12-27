const Stats = require("../classes/Stats");

async function getStats() {
	const obj = {};
	const allStats = await stats.all();

	for (const stat of allStats) {
		obj[stat.id] = stat.value;
	}

	return Stats.form(obj);
}

module.exports = getStats;
