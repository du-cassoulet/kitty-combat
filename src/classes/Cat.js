const Game = require("./Game");

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

class Ultimate {
	constructor() {
		/** @type {keyof import("../lang/en.json")} */
		this.name = null;
	}

	/**
	 * @param {keyof import("../lang/en.json")} name
	 */
	setName(name) {
		this.name = name;
		return this;
	}

	isAvailable() {
		return false;
	}
}

class Defence {
	static Features = {
		Heal: 0,
		Absorbtion: 1,
		Boost: 2,
		Dodge: 3,
		Stamina: 4,
	};

	constructor() {
		/** @type {keyof import("../lang/en.json")} */
		this.name = null;

		/** @type {keyof import("../lang/en.json")} */
		this.description = null;

		this.icon = "🛡️";

		this.heal = { min: 0, max: 0 };
		this.boost = { per: 0, mul: 0 };
		this.dodgePer = 0;
		this.absPer = 0;
		this.usages = -1;
		this.stamina = 0;

		/** @type {{amt:number,fts:{value:number,inc:number}[]}} */
		this.turns = { amt: 1, fts: [] };
	}

	/**
	 * @param {keyof import("../lang/en.json")} name
	 */
	setName(name) {
		this.name = name;
		return this;
	}

	/**
	 * @param {keyof import("../lang/en.json")} description
	 */
	setDescription(description) {
		this.description = description;
		return this;
	}

	setIcon(icon) {
		this.icon = icon;
		return this;
	}

	setHeal(min, max) {
		this.heal.min = min;
		this.heal.max = max;

		return this;
	}

	setBoost(per, mul) {
		this.boost.per = per;
		this.boost.mul = mul;

		return this;
	}

	/**
	 * @param {number} amt
	 * @param {{value:number,inc:number}[]} fts
	 */
	setTurns(amt, fts) {
		this.turns = { amt, fts };
		return this;
	}

	setUsages(usages) {
		this.usages = usages;
		return this;
	}

	setStamina(stamina) {
		this.stamina = stamina;
		return this;
	}

	setAbsPer(absPer) {
		this.absPer = absPer;
		return this;
	}

	setDodgePer(dodgePer) {
		this.dodgePer = dodgePer;
		return this;
	}

	use() {
		this.usages--;
		return this.usages;
	}

	isAvailable() {
		return this.usages !== 0;
	}
}

class Attack {
	static Features = {
		Damages: 0,
		Heal: 1,
		Crit: 2,
		Absorbtion: 3,
	};

	constructor() {
		/** @type {keyof import("../lang/en.json")} */
		this.name = null;

		/** @type {keyof import("../lang/en.json")} */
		this.description = null;

		this.icon = "💢";

		this.dmg = { min: 0, max: 0 };
		this.heal = { min: 0, max: 0 };
		this.crit = { per: 0, mul: 0 };
		this.absPer = 0;
		this.usages = -1;
		this.stamina = 0;

		/** @type {{amt:number,fts:{dim:number,value:number}[]}} */
		this.turns = { amt: 1, fts: [] };
	}

	/**
	 * @param {keyof import("../lang/en.json")} name
	 */
	setName(name) {
		this.name = name;
		return this;
	}

	/**
	 * @param {keyof import("../lang/en.json")} description
	 */
	setDescription(description) {
		this.description = description;
		return this;
	}

	setIcon(icon) {
		this.icon = icon;
		return this;
	}

	setDmg(min, max) {
		this.dmg = { min, max };
		return this;
	}

	setHeal(min, max) {
		this.heal = { min, max };
		return this;
	}

	setAbsPer(absPer) {
		this.absPer = absPer;
		return this;
	}

	setCrit(per, mul) {
		this.crit = { per, mul };
		return this;
	}

	/**
	 * @param {number} amt
	 * @param {{dim:number,value:number}[]} fts
	 */
	setTurns(amt, fts) {
		this.turns = { amt, fts };
		return this;
	}

	setUsages(usages) {
		this.usages = usages;
		return this;
	}

	setStamina(stamina) {
		this.stamina = stamina;
		return this;
	}

	use() {
		this.usages--;
		return this.usages;
	}

	isAvailable() {
		return this.usages !== 0;
	}
}

class Turn {
	constructor() {
		this.dmg = { val: 0, muls: [] };
		this.heal = 0;
		this.stamina = 0;
		this.absPer = 0;
		this.dodge = false;
		this.critBoost = false;
	}

	setDmg(dmg) {
		this.dmg.val = dmg;
		return this;
	}

	setMults(...mults) {
		this.dmg.muls = mults;
		return this;
	}

	setHeal(heal) {
		this.heal = heal;
		return this;
	}

	setStamina(stamina) {
		this.stamina = stamina;
		return this;
	}

	setAbsPer(absPer) {
		this.absPer = absPer;
		return this;
	}

	setDodge(dodge) {
		this.dodge = dodge;
		return this;
	}

	setCritBoost(critBoost) {
		this.critBoost = critBoost;
		return this;
	}
}

class Cat {
	static Turn = Turn;
	static Attack = Attack;
	static Defence = Defence;
	static Ultimate = Ultimate;

	static Rarities = {
		Common: 0,
		Rare: 1,
		Legendary: 2,
	};

	constructor({ id, name, image, rarity }) {
		this.id = id;
		this.name = name;
		this.image = image;
		this.rarity = rarity;
		this.imageData = client.catImages.get(this.id);

		this.atk1 = new Attack()
			.setName("PAW_HIT")
			.setDescription("PAW_HIT_DESCRIPTION")
			.setDmg(dev ? 100 : 10, dev ? 100 : 20)
			.setCrit(5, 1.5)
			.setStamina(5);

		this.atk2 = new Attack()
			.setName("PAW_HIT")
			.setDescription("PAW_HIT_DESCRIPTION")
			.setDmg(dev ? 100 : 10, dev ? 100 : 20)
			.setCrit(5, 1.5)
			.setStamina(5);

		this.def = new Defence()
			.setName("REPURR")
			.setDescription("REPURR_DESCRIPTION")
			.setHeal(5, 15)
			.setStamina(20)
			.setBoost(5, 1.5);

		/** @type {Game.User} */
		this.user = null;

		/** @type {Game.User} */
		this.opponent = null;
	}

	setUser(user) {
		this.user = user;
		return this;
	}

	setOpponent(opponent) {
		this.opponent = opponent;
		return this;
	}

	/**
	 * @param {number} num
	 * @param {Turn} data
	 */
	_setTurn(num, data) {
		const turn = this.user.turns.get(num) || new Turn();

		if (turn) {
			turn.dmg.muls = [...turn.dmg.muls, ...data.dmg.muls];
			turn.dmg.val += data.dmg.val;
			turn.heal += data.heal;
			turn.absPer += turn.absPer / (100 / data.absPer);

			if (data.dodge) turn.dodge = true;
			if (data.critBoost) turn.critBoost = true;

			return this.user.turns.set(num, turn);
		} else {
			return this.user.turns.set(num, data);
		}
	}

	/**
	 * @param {Attack} atk
	 * @param {Turn} turn
	 */
	_doDmg(atk, turn) {
		atk.use();
		const critical = turn.critBoost || randInt(1, 100) <= atk.crit.per;

		let dmg = randInt(
			typeof atk.dmg.min === "function" ? atk.dmg.min() : atk.dmg.min,
			typeof atk.dmg.max === "function" ? atk.dmg.max() : atk.dmg.max
		);

		const heal = randInt(
			typeof atk.heal.min === "function" ? atk.heal.min() : atk.heal.min,
			typeof atk.heal.max === "function" ? atk.heal.min() : atk.heal.max
		);

		if (critical) dmg *= atk.crit.mul;
		for (const mul of turn.dmg.muls) dmg *= mul;
		dmg += turn.dmg.val;

		return { dmg, critical, heal };
	}

	/**
	 * @param {number} baseDmg
	 * @param {Turn} turn
	 */
	_doProt(baseDmg, turn) {
		let dmg = baseDmg - baseDmg * (turn.absPer / 100);
		if (turn.dodge) dmg = 0;

		return { dodged: turn.dodge, absPer: turn.absPer, dmg };
	}

	/**
	 * @param {Defence} def
	 * @param {Turn} turn
	 */
	_doDef(def, turn) {
		def.use();

		const boost = turn.critBoost || randInt(1, 100) <= def.boost.per;
		let heal = randInt(def.heal.min, def.heal.max);
		if (boost) heal *= def.boost.mul;

		return { heal, boost, stamina: def.stamina };
	}

	/**
	 * @param {Attack} atkContent
	 * @param {number} turn
	 */
	_doAttack(atkContent, turn) {
		const { turns, dmg, stamina, absPer, heal } = atkContent;
		const userTurn = this.user.turns.get(turn) || new Turn();
		const opponentTurn = this.opponent.turns.get(turn) || new Turn();

		const atk = this._doDmg(atkContent, userTurn);
		const prot = this._doProt(atk.dmg, opponentTurn);

		this.user.addHealth(atk.heal);
		this.user.modStamina(-stamina);
		this.opponent.remHealth(prot.dmg);

		const getFeature = (feature) => turns.fts.find((f) => f.value === feature);
		this._setTurn(turn + 1, new Turn().setAbsPer(absPer));
		for (let i = 1; i < turns.amt; i++) {
			const nextTurn = new Turn();

			const dmgFt = getFeature(Attack.Features.Damages);
			const healFt = getFeature(Attack.Features.Heal);
			const critFt = getFeature(Attack.Features.Crit);
			const absFt = getFeature(Attack.Features.Absorbtion);

			if (dmgFt) {
				const min =
					(dmgFt.dim / 100) ** i *
					(typeof dmg.min === "function" ? dmg.min() : dmg.min);

				const max =
					(dmgFt.dim / 100) ** i *
					(typeof dmg.max === "function" ? dmg.max() : dmg.max);

				nextTurn.setDmg(randInt(min, max));
			}

			if (healFt) {
				const min =
					(healFt.dim / 100) ** i *
					(typeof heal.min === "function" ? heal.min() : heal.min);

				const max =
					(healFt.dim / 100) ** i *
					(typeof heal.max === "function" ? heal.max() : heal.max);

				nextTurn.setHeal(randInt(min, max));
			}

			if (critFt) {
				nextTurn.setCritBoost(true);
			}

			if (absFt) {
				nextTurn.setAbsPer(absPer - absFt.value * i);
			}

			this._setTurn(turn + i, nextTurn);
		}

		return { atk, prot, stamina };
	}

	/**
	 * @param {number} turn
	 */
	doAttack1(turn) {
		return this._doAttack(this.atk1, turn);
	}

	/**
	 * @param {number} turn
	 */
	doAttack2(turn) {
		return this._doAttack(this.atk2, turn);
	}

	/**
	 * @param {number} turn
	 */
	doDefence(turn) {
		const userTurn = this.user.turns.get(turn) || new Turn();

		const def = this._doDef(this.def, userTurn);
		this.user.addHealth(def.heal);
		this.user.modStamina(
			typeof def.stamina === "function" ? def.stamina() : def.stamina
		);
		this.opponent.remHealth(userTurn.dmg.val);

		this._setTurn(
			turn + 1,
			new Turn()
				.setAbsPer(this.def.absPer)
				.setDodge(randInt(1, 100) <= this.def.dodgePer)
		);

		return { def };
	}

	/**
	 * @param {number} turn
	 */
	doUltimate(turn) {}
}

module.exports = Cat;
