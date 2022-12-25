const Cat = require("../Cat");

class BlackCat extends Cat {
	static id = "BlackCat";
	static name = "BLACK_CAT";
	static image = "cat_2.png";
	static rarity = Cat.Rarities.Common;

	constructor() {
		super({
			id: BlackCat.id,
			name: BlackCat.name,
			image: BlackCat.image,
			rarity: BlackCat.rarity,
		});

		this.atk2 = new Cat.Attack()
			.setName("SCRATCH")
			.setDescription("SCRATCH_DESCRIPTION")
			.setIcon("1053011873093664839")
			.setDmg(5, 30)
			.setCrit(5, 1.75)
			.setStamina(15)
			.setUsages(2);
	}
}

module.exports = BlackCat;
