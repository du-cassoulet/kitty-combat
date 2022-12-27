class Cat {
	static Leveling = {
		Range: 300,
	};

	constructor() {
		this.name = null;
		this.catId = null;
		this.souls = 0;
		this.addedAt = Date.now();
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
			.setDefence(data.defence.xp, data.defence.level)
			.setAddedAt(data.addedAt);
	}

	/**
	 * @param {string} name
	 * @returns {Cat}
	 */
	setName(name) {
		this.name = name ?? this.name;
		return this;
	}

	/**
	 * @param {string} catId
	 * @returns {Cat}
	 */
	setCatId(catId) {
		this.catId = catId ?? this.catId;
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
		this.souls = souls ?? this.souls;
		return this;
	}

	/** @type {number} */
	setAddedAt(addedAt) {
		this.addedAt = addedAt ?? this.addedAt;
		return this;
	}
}

class Inventory {
	/**
	 * @param {Inventory} data
	 * @returns {Inventory}
	 */
	static form(data) {
		return new Inventory()
			.setCoins(data.coins.current, data.coins.highest)
			.setCats(data.cats)
			.setEggs(data.eggs)
			.setEggsOpened(data.eggsOpened)
			.setSelectedCat(data.selectedCat);
	}

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
			? { current, highest: highest ?? current }
			: this.coins;

		return this;
	}

	/**
	 * @param {number} eggsOpened
	 * @returns {Inventory}
	 */
	setEggsOpened(eggsOpened) {
		this.eggsOpened = eggsOpened ?? this.eggsOpened;
		return this;
	}

	/**
	 * @param {string[]} eggs
	 * @returns {Inventory}
	 */
	setEggs(eggs) {
		this.eggs = eggs ?? this.eggs;
		return this;
	}

	/**
	 * @param {Cat[]} cats
	 * @returns {Inventory}
	 */
	setCats(cats) {
		this.cats = cats ?? this.cats;
		return this;
	}

	/**
	 * @param {string} selectedCat
	 * @returns {Inventory}
	 */
	setSelectedCat(selectedCat) {
		this.selectedCat = selectedCat ?? this.selectedCat;
		return this;
	}
}

class Stats {
	static Progressions = {
		Down: 0,
		Static: 1,
		Up: 2,
	};

	/**
	 * @param {Stats} data
	 * @returns {Stats}
	 */
	static form(data) {
		return new Stats()
			.setWins(data.wins)
			.setLosses(data.losses)
			.setWinstreak(data.winstreak.current, data.winstreak.highest)
			.setTime(data.time)
			.setRank(data.rank)
			.setProg(data.prog);
	}

	constructor() {
		this.winstreak = { current: 0, highest: 0 };
		this.wins = 0;
		this.losses = 0;
		this.rank = 0;
		this.time = 0;
		this.prog = Stats.Progressions.Static;
	}

	/**
	 * @param {number} winstreak
	 * @returns {Stats}
	 */
	setWinstreak(current, highest) {
		this.winstreak =
			current !== undefined
				? { current, highest: highest ?? current }
				: this.winstreak;

		return this;
	}

	/**
	 * @param {number} wins
	 * @returns {Stats}
	 */
	setWins(wins) {
		this.wins = wins ?? this.wins;
		return this;
	}

	/**
	 * @param {number} losses
	 * @returns {Stats}
	 */
	setLosses(losses) {
		this.losses = losses ?? this.losses;
		return this;
	}

	/**
	 * @param {number} rank
	 * @returns {Stats}
	 */
	setRank(rank) {
		this.rank = rank ?? this.rank;
		return this;
	}

	setProg(prog) {
		this.prog = prog ?? this.prog;
		return this;
	}

	/**
	 * @param {number} time
	 * @returns {Stats}
	 */
	setTime(time) {
		this.time = time ?? this.time;
		return this;
	}
}

class Leveling {
	static Range = 500;

	/**
	 *
	 * @param {Leveling} data
	 * @returns {Leveling}
	 */
	static form(data) {
		return new Leveling().setXp(data.xp).setLevel(data.level);
	}

	constructor() {
		this.xp = 0;
		this.level = 1;
	}

	/**
	 * @param {number} xp
	 * @returns {Leveling}
	 */
	setXp(xp) {
		this.xp = xp ?? this.xp;
		return this;
	}

	/**
	 * @param {number} level
	 * @returns {Leveling}
	 */
	setLevel(level) {
		this.level = level ?? this.level;
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
			.setHist(data.hist)
			.setInv(Inventory.form(data.inv))
			.setStats(Stats.form(data.stats))
			.setLeveling(Leveling.form(data.leveling));
	}

	constructor() {
		/** @type {string|null} */
		this.tag = null;

		/** @type {string|null} */
		this.avatarURL = null;

		this.joinedAt = Date.now();
		this.usages = 0;
		this.elo = 1000;
		this.inv = new User.Inventory();
		this.stats = new User.Stats();
		this.leveling = new User.Leveling();

		/** @type {number[]} */
		this.hist = [this.elo];
	}

	/**
	 * @param {string} tag
	 * @returns {User}
	 */
	setTag(tag) {
		this.tag = tag ?? this.tag;
		return this;
	}

	/**
	 * @param {string} avatarURL
	 * @returns {User}
	 */
	setAvatarURL(avatarURL) {
		this.avatarURL = avatarURL ?? this.avatarURL;
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
			this.joinedAt = date ?? this.joinedAt;
		}

		return this;
	}

	/**
	 * @param {number} elo
	 * @returns {User}
	 */
	setElo(elo) {
		this.elo = elo ?? this.elo;
		return this;
	}

	/**
	 * @param {number[]} hist
	 * @returns {User}
	 */
	setHist(hist) {
		this.hist = hist ?? this.hist;
		return this;
	}

	/**
	 * @param {Inventory} inv
	 * @returns {User}
	 */
	setInv(inv) {
		this.inv = inv ?? this.inv;
		return this;
	}

	/**
	 * @param {Stats} stats
	 * @returns {User}
	 */
	setStats(stats) {
		this.stats = stats ?? this.stats;
		return this;
	}

	/**
	 * @param {Leveling} leveling
	 * @returns {User}
	 */
	setLeveling(leveling) {
		this.leveling = leveling ?? this.leveling;
		return this;
	}

	/**
	 * @param {number} usages
	 * @returns {User}
	 */
	setUsages(usages) {
		this.usages = usages ?? this.usages;
		return this;
	}
}

module.exports = User;
module.exports.Inventory = Inventory;
module.exports.Stats = Stats;
module.exports.Leveling = Leveling;
module.exports.Cat = Cat;
