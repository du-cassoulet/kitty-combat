const Cat = require("../Cat");

class PlantCat extends Cat {
	static id = "PlantCat";
	static name = "PLANT_CAT";
	static image = "cat_10.png";
	static rarity = Cat.Rarities.Rare;

	constructor() {
		super({
			id: PlantCat.id,
			name: PlantCat.name,
			image: PlantCat.image,
			rarity: PlantCat.rarity,
		});

		this.atk1 = new Cat.Attack()
			.setName("LEAF_STRIKE")
			.setDescription("LEAF_STRIKE_DESCRIPTION")
			.setIcon("🍃")
			.setDmg(10, 10)
			.setHeal(10, 10)
			.setCrit(20, 2)
			.setStamina(5);

		this.atk2 = new Cat.Attack()
			.setName("ROOT_SMASH")
			.setDescription("ROOT_SMASH_DESCRIPTION")
			.setIcon("🪵")
			.setDmg(30, 30)
			.setUsages(2)
			.setStamina(15);
	}
}

module.exports = PlantCat;
