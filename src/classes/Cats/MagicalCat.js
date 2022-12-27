const Cat = require("../Cat");

class MagicalCat extends Cat {
	static id = "MagicalCat";
	static name = "MAGIC_CAT";
	static image = "cat_6.png";
	static rarity = Cat.Rarities.Common;

	constructor() {
		super({
			id: MagicalCat.id,
			name: MagicalCat.name,
			image: MagicalCat.image,
			rarity: MagicalCat.rarity,
		});

		this.atk2 = new Cat.Attack()
			.setName("ARCANE_STRIKE")
			.setDescription("ARCANE_STRIKE_DESCRIPTION")
			.setIcon("✨")
			.setDmg(
				() => (this.opponent?.health || 100) * 0.3,
				() => (this.opponent?.health || 100) * 0.3
			)
			.setUsages(2)
			.setStamina(15);
	}
}

module.exports = MagicalCat;
