class Cat {
	static Leveling = {
		Range: 300,
	};

	constructor() {
		this.name = null;
		this.catId = null;
		this.souls = 0;
		this.damages = { xp: 0, level: 0 };
		this.defence = { xp: 0, level: 0 };
	}

	/**
	 * @param {Cat|undefined} data
	 */
	static form(data) {
		if (!data) return null;

		return new Cat()
			.setName(data.name)
			.setCatId(data.catId)
			.setSouls(data.souls)
			.setDamages(data.damages.xp, data.damages.level)
			.setDefence(data.defence.xp, data.defence.level);
	}

	/**
	 * @param {string} name
	 * @returns {Cat}
	 */
	setName(name) {
		this.name = name;
		return this;
	}

	/**
	 * @param {string} catId
	 * @returns {Cat}
	 */
	setCatId(catId) {
		this.catId = catId;
		return this;
	}

	/**
	 * @param {number} xp
	 * @param {number} level
	 * @returns {Cat}
	 */
	setDamages(xp, level) {
		this.damages = { xp, level };
		return this;
	}

	/**
	 * @param {number} xp
	 * @param {number} level
	 * @returns {Cat}
	 */
	setDefence(xp, level) {
		this.defence = { xp, level };
		return this;
	}

	/**
	 * @param {number} souls
	 * @returns {Cat}
	 */
	setSouls(souls) {
		this.souls = souls;
		return this;
	}
}

class Inventory {
	constructor() {
		this.coins = { current: 0, highest: 0 };
		this.eggsOpened = 0;
		this.selectedCat = null;

		/** @type {string[]} */
		this.eggs = [];

		/** @type {Cat[]} */
		this.cats = [];
	}

	/**
	 * @param {number} current
	 * @param {number} highest
	 * @returns {Inventory}
	 */
	setCoins(current, highest) {
		this.coins = current
			? { current, highest: highest || current }
			: this.coins;

		return this;
	}

	/**
	 * @param {number} eggsOpened
	 * @returns {Inventory}
	 */
	setEggsOpened(eggsOpened) {
		this.eggsOpened = eggsOpened || this.eggsOpened;
		return this;
	}

	/**
	 * @param {string[]} eggs
	 * @returns {Inventory}
	 */
	setEggs(eggs) {
		this.eggs = eggs || this.eggs;
		return this;
	}

	/**
	 * @param {Cat[]} cats
	 * @returns {Inventory}
	 */
	setCats(cats) {
		this.cats = cats || this.cats;
		return this;
	}

	/**
	 * @param {string} selectedCat
	 * @returns {Inventory}
	 */
	setSelectedCat(selectedCat) {
		this.selectedCat = selectedCat || this.selectedCat;
		return this;
	}
}

class Stats {
	constructor() {
		this.winstreak = { current: 0, highest: 0 };
		this.wins = 0;
		this.losses = 0;
		this.rank = 0;
		this.time = 0;
	}

	/**
	 * @param {number} winstreak
	 * @returns {Stats}
	 */
	setWinstreak(current, highest) {
		this.winstreak = current
			? { current, highest: highest || current }
			: this.winstreak;

		return this;
	}

	/**
	 * @param {number} wins
	 * @returns {Stats}
	 */
	setWins(wins) {
		this.wins = wins || this.wins;
		return this;
	}

	/**
	 * @param {number} losses
	 * @returns {Stats}
	 */
	setLosses(losses) {
		this.losses = losses || this.losses;
		return this;
	}

	/**
	 * @param {number} rank
	 * @returns {Stats}
	 */
	setRank(rank) {
		this.rank = rank;
		return this;
	}

	/**
	 * @param {number} time
	 * @returns {Stats}
	 */
	setTime(time) {
		this.time = time;
		return this;
	}
}

class Leveling {
	static Range = 500;

	constructor() {
		this.xp = 0;
		this.level = 1;
	}

	/**
	 * @param {number} xp
	 * @returns {Leveling}
	 */
	setXp(xp) {
		this.xp = xp || this.xp;
		return this;
	}

	/**
	 * @param {number} level
	 * @returns {Leveling}
	 */
	setLevel(level) {
		this.level = level || this.level;
		return this;
	}
}

class User {
	static Inventory = Inventory;
	static Stats = Stats;
	static Leveling = Leveling;
	static Cat = Cat;

	/**
	 * @param {User} data
	 * @returns {User}
	 */
	static form(data) {
		if (!data) return undefined;

		return new User()
			.setTag(data.tag)
			.setAvatarURL(data.avatarURL)
			.setJoinedAt(data.joinedAt)
			.setElo(data.elo)
			.setInv(data.inv)
			.setStats(data.stats)
			.setLeveling(data.leveling);
	}

	constructor() {
		/** @type {string|null} */
		this.tag = null;

		/** @type {string|null} */
		this.avatarURL = null;

		this.joinedAt = Date.now();
		this.elo = 1000;
		this.inv = new User.Inventory();
		this.stats = new User.Stats();
		this.leveling = new User.Leveling();
	}

	/**
	 * @param {string} tag
	 * @returns {User}
	 */
	setTag(tag) {
		this.tag = tag || this.tag;
		return this;
	}

	/**
	 * @param {string} avatarURL
	 * @returns {User}
	 */
	setAvatarURL(avatarURL) {
		this.avatarURL = avatarURL || this.avatarURL;
		return this;
	}

	/**
	 * @param {Date|number} date
	 * @returns {User}
	 */
	setJoinedAt(date) {
		if (date instanceof Date) {
			this.joinedAt = date.getTime();
		} else {
			this.joinedAt = date || this.joinedAt;
		}

		return this;
	}

	/**
	 * @param {number} elo
	 * @returns {User}
	 */
	setElo(elo) {
		this.elo = elo || this.elo;
		return this;
	}

	/**
	 * @param {Inventory} inv
	 * @returns {User}
	 */
	setInv(inv) {
		this.inv = inv || this.inv;
		return this;
	}

	/**
	 * @param {Stats} stats
	 * @returns {User}
	 */
	setStats(stats) {
		this.stats = stats || this.stats;
		return this;
	}

	/**
	 * @param {Leveling} leveling
	 * @returns {User}
	 */
	setLeveling(leveling) {
		this.leveling = leveling || this.leveling;
		return this;
	}
}

module.exports = User;
module.exports.Inventory = Inventory;
module.exports.Stats = Stats;
module.exports.Leveling = Leveling;
module.exports.Cat = Cat;
