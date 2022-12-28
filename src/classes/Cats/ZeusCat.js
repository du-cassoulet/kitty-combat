const Cat = require("../Cat");

class ZeusCat extends Cat {
	static id = "ZeusCat";
	static name = "ZEUS_CAT";
	static image = "cat_13.png";
	static rarity = Cat.Rarities.Legendary;

	constructor() {
		super({
			id: ZeusCat.id,
			name: ZeusCat.name,
			image: ZeusCat.image,
			rarity: ZeusCat.rarity,
		});

		this.atk1 = new Cat.Attack()
			.setName("CLAW_STRIKE")
			.setDescription("CLAW_STRIKE_DESCRIPTION")
			.setIcon("1053011873093664839")
			.setDmg(10, 20)
			.setCrit(10, 1.5)
			.setStamina(0);

		this.atk2 = new Cat.Attack()
			.setName("DRAIN")
			.setDescription("DRAIN_DESCRIPTION")
			.setIcon("🥀")
			.setDmg(
				() => (this.opponent?.health || 100) * 0.1,
				() => (this.opponent?.health || 100) * 0.1
			)
			.setHeal(
				() => (this.opponent?.health || 100) * 0.1,
				() => (this.opponent?.health || 100) * 0.1
			)
			.setTurns(2, [{ value: Cat.Attack.Features.Damages, dim: 0 }])
			.setStamina(40);

		this.def = new Cat.Defence()
			.setName("TAKE_HEAL")
			.setDescription("TAKE_HEAL_DESCRIPTION")
			.setHeal(
				(this.user?.health || 100) - (this.opponent?.health || 100),
				(this.user?.health || 100) - (this.opponent?.health || 100)
			)
			.setStamina(() => 50 - (this.user?.stamina || 100))
			.setUsages(1);
	}
}

module.exports = ZeusCat;
