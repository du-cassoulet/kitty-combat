const Cat = require("../Cat");

class FrenchCat extends Cat {
	static id = "FrenchCat";
	static name = "FRENCH_CAT";
	static image = "cat_16.png";
	static rarity = Cat.Rarities.Common;

	constructor() {
		super({
			id: FrenchCat.id,
			name: FrenchCat.name,
			image: FrenchCat.image,
			rarity: FrenchCat.rarity,
		});

		this.atk2 = new Cat.Attack()
			.setName("BAGUETTE_HIT")
			.setDescription("BAGUETTE_HIT_DESCRIPTION")
			.setIcon("🥖")
			.setDmg(1, 1)
			.setCrit(1, 100)
			.setUsages(5)
			.setStamina(8);
	}
}

module.exports = FrenchCat;
