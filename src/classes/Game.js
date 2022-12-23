const Discord = require("discord.js");
const getUser = require("../functions/getUser");
const User = require("./User");
const Cat = require("./Cat");

class GameUser {
	constructor() {
		this.health = 100;
		this.stamina = 100;

		/** @type {Discord.Collection<number,Cat.Turn>} */
		this.turns = new Discord.Collection();
	}

	/**
	 * @param {number} health
	 * @returns {GameUser}
	 */
	setHealth(health) {
		this.health = Math.round(health);
		if (this.health < 0) this.health = 0;

		return this;
	}

	/**
	 * @param {number} health
	 * @returns {GameUser}
	 */
	addHealth(health) {
		this.health += Math.round(health);
		if (this.health < 0) this.health = 0;

		return this;
	}

	/**
	 * @param {number} health
	 * @returns {GameUser}
	 */
	remHealth(health) {
		this.health -= Math.round(health);
		if (this.health < 0) this.health = 0;

		return this;
	}

	/**
	 * @param {number} stamina
	 * @returns {GameUser}
	 */
	setStamina(stamina) {
		this.stamina = Math.round(stamina);
		return this;
	}

	/**
	 * @param {number} stamina
	 * @returns {GameUser}
	 */
	modStamina(stamina) {
		this.stamina += Math.round(stamina);
		if (this.stamina > 100) this.stamina = 100;

		return this;
	}
}

class Game {
	static User = GameUser;

	constructor() {
		this.hostId = null;
		this.slash = null;
		this.starting = true;

		/** @type {Discord.Collection<string,{user:Discord.User,data:User,game:GameUser}>} */
		this.players = new Discord.Collection();
	}

	/**
	 * @param {Discord.ChatInputCommandInteraction} slash
	 */
	async create(slash) {
		this.hostId = slash.user.id;
		this.starting = true;
		this.slash = slash;

		await this.addPlayer(slash.user);
		client.games.set(slash.user.id, this);

		return this;
	}

	/**
	 * @param {Discord.User} player
	 */
	async addPlayer(player) {
		client.inGame.set(player.id, this.hostId);
		this.players.set(player.id, {
			user: player,
			data: await getUser(player.id),
			game: new GameUser(),
		});

		return this.players;
	}

	/**
	 * @param {string} playerId
	 */
	removePlayer(playerId) {
		this.players.delete(playerId);
		client.inGame.delete(playerId);

		return this.players;
	}

	/**
	 * @param {string} hostId
	 */
	delete() {
		this.players.forEach((player) => {
			client.inGame.delete(player.user.id);
		});

		return client.games.delete(this.hostId);
	}

	start() {
		this.starting = false;
		return true;
	}
}

module.exports = Game;
module.exports.User = GameUser;
