const User = require("../classes/User");

/**
 * @param {{xp:number,level:number}} leveling
 * @param {boolean} win
 * @param {number} lvRg
 */
function addExp(leveling, win, lvRg = User.Leveling.Range) {
	let newLevel = false;
	const xp = (Math.floor(Math.random() * 26) + 50) * (1 + win);

	leveling.xp += xp;
	if (leveling.xp >= leveling.level * lvRg) {
		leveling.xp -= leveling.level * lvRg;
		leveling.level++;
		newLevel = true;
	}

	return { leveling, newLevel, xp };
}

module.exports = addExp;
