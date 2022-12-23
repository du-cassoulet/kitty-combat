const Cat = require("../Cat");

class AquaCat extends Cat {
	static id = "AquaCat";
	static name = "AQUA_CAT";
	static image = "cat_7.png";
	static rarity = Cat.Rarities.Rare;

	constructor() {
		super({
			id: AquaCat.id,
			name: AquaCat.name,
			image: AquaCat.image,
			rarity: AquaCat.rarity,
		});

		this.atk1 = new Cat.Attack()
			.setName("SPLASH")
			.setDescription("SPLASH_DESCRIPTION");
	}
}

module.exports = AquaCat;
