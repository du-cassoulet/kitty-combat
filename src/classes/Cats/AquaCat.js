const Cat = require("../Cat");

class AquaCat extends Cat {
	static id = "AquaCat";
	static name = "AQUA_CAT";
	static image = "cat_7.png";
	static rarity = Cat.Rarities.Rare;

	constructor() {
		super({
			id: AquaCat.id,
			name: AquaCat.name,
			image: AquaCat.image,
			rarity: AquaCat.rarity,
		});

		this.atk1 = new Cat.Attack()
			.setName("SPLASH")
			.setDescription("SPLASH_DESCRIPTION")
			.setIcon("💧")
			.setDmg(18, 22)
			.setHeal(0, 5)
			.setStamina(8)
			.setCrit(33, 1.25);

		this.atk2 = new Cat.Attack()
			.setName("TSUNAMI")
			.setDescription("TSUNAMI_DESCRIPTION")
			.setIcon("🌊")
			.setDmg(10, 15)
			.setTurns(3, [{ value: Cat.Attack.Features.Damages, dim: 0 }])
			.setUsages(1)
			.setStamina(16);
	}
}

module.exports = AquaCat;
