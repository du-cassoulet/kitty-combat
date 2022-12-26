const Cat = require("../Cat");

class GiganticCat extends Cat {
	static id = "GiganticCat";
	static name = "GIGANTIC_CAT";
	static image = "cat_19.png";
	static rarity = Cat.Rarities.Common;

	constructor() {
		super({
			id: GiganticCat.id,
			name: GiganticCat.name,
			image: GiganticCat.image,
			rarity: GiganticCat.rarity,
		});

		this.atk2 = new Cat.Attack()
			.setName("SEISMIC_STRIKE")
			.setDescription("SEISMIC_STRIKE_DESCRIPTION")
			.setIcon("✴️")
			.setDmg(0, 50)
			.setHeal(0, 10)
			.setStamina(10)
			.setUsages(1);
	}
}

module.exports = GiganticCat;
