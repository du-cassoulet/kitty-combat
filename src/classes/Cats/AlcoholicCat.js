const Cat = require("../Cat");

class AirCat extends Cat {
	static id = "AlcoholicCat";
	static name = "ALCOHOLIC_CAT";
	static image = "cat_24.png";
	static rarity = Cat.Rarities.Common;

	constructor() {
		super({
			id: AirCat.id,
			name: AirCat.name,
			image: AirCat.image,
			rarity: AirCat.rarity,
		});

		this.atk2 = new Cat.Attack()
			.setName("BOTTLE_HIT")
			.setDescription("BOTTLE_HIT_DESCRIPTION")
			.setIcon("🍾")
			.setDmg(15, 20)
			.setDescription(35, 1.5)
			.setUsages(1)
			.setStamina(12);
	}
}

module.exports = AirCat;
