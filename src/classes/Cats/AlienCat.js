const Cat = require("../Cat");

class AlienCat extends Cat {
	static id = "AlienCat";
	static name = "ALIEN_CAT";
	static image = "cat_22.png";
	static rarity = Cat.Rarities.Common;

	constructor() {
		super({
			id: AlienCat.id,
			name: AlienCat.name,
			image: AlienCat.image,
			rarity: AlienCat.rarity,
		});

		this.atk2 = new Cat.Attack()
			.setName("LASER_EYES")
			.setDescription("LASER_EYES_DESCRIPTION")
			.setIcon("👀")
			.setDmg(30, 40)
			.setUsages(2)
			.setStamina(20);
	}
}

module.exports = AlienCat;
