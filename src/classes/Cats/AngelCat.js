const Cat = require("../Cat");

class AngelCat extends Cat {
	static id = "AngelCat";
	static name = "ANGEL_CAT";
	static image = "cat_15.png";
	static rarity = Cat.Rarities.Legendary;

	constructor() {
		super({
			id: AngelCat.id,
			name: AngelCat.name,
			image: AngelCat.image,
			rarity: AngelCat.rarity,
		});

		this.atk1 = new Cat.Attack()
			.setName("ENLIGHTENMENT")
			.setDescription("ENLIGHTENMENT_DESCRIPTION")
			.setIcon("☀️")
			.setDmg(15, 15)
			.setTurns(3, [{ value: Cat.Attack.Features.Damages, dim: 50 }])
			.setStamina(10);

		this.atk2 = new Cat.Attack()
			.setName("DEEP_MOON")
			.setDescription("DEEP_MOON_DESCRIPTION")
			.setIcon("🌙")
			.setDmg(30, 35)
			.setStamina(15)
			.setUsages(2);

		this.def = new Cat.Defence()
			.setName("DODGE")
			.setDescription("DODGE_DESCRIPTION")
			.setIcon("💨")
			.setDodgePer(50);
	}
}

module.exports = AngelCat;
