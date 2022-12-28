class Stats {
	/**
	 * @param {Stats} data
	 * @returns {Stats}
	 */
	static form(data) {
		return new Stats()
			.setCommands(data.commands)
			.setTime(data.time)
			.setImages(data.images?.number, data.images?.size)
			.setUptime(data.uptime);
	}

	constructor() {
		this.commands = {};
		this.time = 0;
		this.images = { number: 0, size: 0 };

		this.uptime = { lastHour: -1, lastMin: -1 };
		for (let i = 0; i < 24; i++) this.uptime[i] = 0;
	}

	setCommands(commands) {
		this.commands = commands ?? this.commands;
		return this;
	}

	setTime(time) {
		this.time = time ?? this.time;
		return this;
	}

	setImages(number, size) {
		this.images = number !== undefined ? { number, size } : this.images;
		return this;
	}

	setUptime(uptime) {
		this.uptime = uptime ?? this.uptime;
		return this;
	}
}

module.exports = Stats;
