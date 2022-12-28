const Cat = require("../Cat");

class AirCat extends Cat {
	static id = "AirCat";
	static name = "AIR_CAT";
	static image = "cat_9.png";
	static rarity = Cat.Rarities.Rare;

	constructor() {
		super({
			id: AirCat.id,
			name: AirCat.name,
			image: AirCat.image,
			rarity: AirCat.rarity,
		});

		this.atk1 = new Cat.Attack()
			.setName("WING_HIT")
			.setDescription("WING_HIT_DESCRIPTION")
			.setIcon("1055821684650807356")
			.setDmg(15, 20)
			.setCrit(10, 2)
			.setStamina(8);

		this.atk2 = new Cat.Attack()
			.setName("AIR_PURRST")
			.setDescription("AIR_PURRST_DESCRIPTION")
			.setIcon("🌪️")
			.setDmg(10, 30)
			.setHeal(5, 5)
			.setCrit(10, 1.5)
			.setUsages(3)
			.setStamina(12);
	}
}

module.exports = AirCat;
