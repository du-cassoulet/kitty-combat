class Guild {
	constructor() {
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
		this.players = players;
		return this;
	}
}

module.exports = Guild;
