const Cat = require("../Cat");

class DevilCat extends Cat {
	static id = "DevilCat";
	static name = "DEVIL_CAT";
	static image = "cat_14.png";
	static rarity = Cat.Rarities.Legendary;

	constructor() {
		super({
			id: DevilCat.id,
			name: DevilCat.name,
			image: DevilCat.image,
			rarity: DevilCat.rarity,
		});

		// this.atk1 = new Cat.Attack().setName("DEMONIC_CLAWS")
		// .setDescription("")
		// .setIcon("1053011873093664839")
		// .setDmg();
	}
}

module.exports = DevilCat;
