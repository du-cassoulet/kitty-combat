const Cat = require("../Cat");

class FatCat extends Cat {
	static id = "FatCat";
	static name = "FAT_CAT";
	static image = "cat_1.png";
	static rarity = Cat.Rarities.Common;

	constructor() {
		super({
			id: FatCat.id,
			name: FatCat.name,
			image: FatCat.image,
			rarity: FatCat.rarity,
		});

		this.atk2 = new Cat.Attack()
			.setName("SQUEEZE")
			.setDescription("SQUEEZE_DESCRIPTION")
			.setIcon("🔨")
			.setDmg(30, 45)
			.setCrit(30, 0)
			.setUsages(2)
			.setStamina(12);
	}
}

module.exports = FatCat;
