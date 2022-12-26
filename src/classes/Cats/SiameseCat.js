const Cat = require("../Cat");

class SiameseCat extends Cat {
	static id = "SiameseCat";
	static name = "SIAMESE";
	static image = "cat_4.png";
	static rarity = Cat.Rarities.Common;

	constructor() {
		super({
			id: SiameseCat.id,
			name: SiameseCat.name,
			image: SiameseCat.image,
			rarity: SiameseCat.rarity,
		});

		this.atk2 = new Cat.Attack()
			.setName("POUNCE")
			.setDescription("POUNCE_DESCRIPTION")
			.setIcon("💨")
			.setDmg(10, 25)
			.setTurns(2, [{ value: Cat.Attack.Features.Crit }])
			.setStamina(10)
			.setUsages(2);
	}
}

module.exports = SiameseCat;
