const Cat = require("../Cat");

class ExplosiveCat extends Cat {
	static id = "ExplosiveCat";
	static name = "EXPLOSIVE_CAT";
	static image = "cat_18.png";
	static rarity = Cat.Rarities.Common;

	constructor() {
		super({
			id: ExplosiveCat.id,
			name: ExplosiveCat.name,
			image: ExplosiveCat.image,
			rarity: ExplosiveCat.rarity,
		});

		this.atk2 = new Cat.Attack()
			.setName("BOOM")
			.setDescription("BOOM_DESCRIPTION")
			.setIcon("💥")
			.setDmg(40, 50)
			.setHeal(-10, -10)
			.setStamina(20)
			.setUsages(1);
	}
}

module.exports = ExplosiveCat;
