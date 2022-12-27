class Guild {
	constructor() {
		this.name = null;

		/** @type {string[]} */
		this.players = [];
	}

	/**
	 * @param {Guild} data
	 * @returns {Guild}
	 */
	static form(data) {
		return new Guild().setPlayers(data.players);
	}

	setPlayers(players) {
		this.players = players ?? this.players;
		return this;
	}

	setName(name) {
		this.name = name ?? this.name;
		return this;
	}
}

module.exports = Guild;
