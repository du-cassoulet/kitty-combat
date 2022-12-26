const Cat = require("../Cat");

class ThunderCat extends Cat {
	static id = "ThunderCat";
	static name = "THUNDER_CAT";
	static image = "cat_11.png";
	static rarity = Cat.Rarities.Rare;

	constructor() {
		super({
			id: ThunderCat.id,
			name: ThunderCat.name,
			image: ThunderCat.image,
			rarity: ThunderCat.rarity,
		});

		this.atk1 = new Cat.Attack()
			.setName("LIGHTNING_STRIKE")
			.setDescription("LIGHTNING_STRIKE_DESCRIPTION")
			.setIcon("⚡")
			.setDmg(10, 25)
			.setAbsPer(10)
			.setStamina(6);

		this.atk2 = new Cat.Attack()
			.setName("PLASMA_BLAST")
			.setDescription("PLASMA_BLAST_DESCRIPTION")
			.setIcon("🌩️")
			.setDmg(10, 10)
			.setHeal(10, 10)
			.setAbsPer(100)
			.setStamina(18)
			.setUsages(1);
	}
}

module.exports = ThunderCat;
