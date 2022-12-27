const Cat = require("../Cat");

class FireCat extends Cat {
	static id = "FireCat";
	static name = "FIRE_CAT";
	static image = "cat_8.png";
	static rarity = Cat.Rarities.Rare;

	constructor() {
		super({
			id: FireCat.id,
			name: FireCat.name,
			image: FireCat.image,
			rarity: FireCat.rarity,
		});

		this.atk1 = new Cat.Attack()
			.setName("LAVA_LASH")
			.setDescription("LAVA_LASH_DESCRIPTION")
			.setIcon("🌋")
			.setDmg(5, 15)
			.setTurns(2, [{ value: Cat.Attack.Features.Damages, dim: 50 }])
			.setStamina(5);

		this.atk2 = new Cat.Attack()
			.setName("FLAMING_FURY")
			.setDescription("FLAMING_FURY_DESCRIPTION")
			.setIcon("🔥")
			.setDmg(20, 20)
			.setCrit(50, 1.5)
			.setStamina(12)
			.setUsages(1);
	}
}

module.exports = FireCat;
