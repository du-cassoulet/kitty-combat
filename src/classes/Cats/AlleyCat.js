const Cat = require("../Cat");

class AlleyCat extends Cat {
	static id = "AlleyCat";
	static name = "ALLEY_CAT";
	static image = "cat_3.png";
	static rarity = Cat.Rarities.Common;

	constructor() {
		super({
			id: AlleyCat.id,
			name: AlleyCat.name,
			image: AlleyCat.image,
			rarity: AlleyCat.rarity,
		});

		this.atk2 = new Cat.Attack()
			.setName("TAIL_HIT")
			.setDescription("TAIL_HIT_DESCRIPTION")
			.setIcon("1055432306233462784")
			.setDmg(15, 25)
			.setAbsPer(10)
			.setCrit(50, 1.5)
			.setUsages(4)
			.setStamina(15);
	}
}

module.exports = AlleyCat;
