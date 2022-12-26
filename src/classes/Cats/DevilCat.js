const Cat = require("../Cat");

class DevilCat extends Cat {
	static id = "DevilCat";
	static name = "DEVIL_CAT";
	static image = "cat_14.png";
	static rarity = Cat.Rarities.Legendary;

	constructor() {
		super({
			id: DevilCat.id,
			name: DevilCat.name,
			image: DevilCat.image,
			rarity: DevilCat.rarity,
		});

		this.atk1 = new Cat.Attack()
			.setName("DEMONIC_CLAWS")
			.setDescription("DEMONIC_CLAWS_DESCRIPTION")
			.setIcon("1053011873093664839")
			.setDmg(15, 25)
			.setCrit(20, 1.5)
			.setStamina(8);

		this.atk2 = new Cat.Attack()
			.setName("HELLFIRE_BREATH")
			.setDescription("HELLFIRE_BREATH_DESCRIPTION")
			.setIcon("🔥")
			.setDmg(5, 5)
			.setTurns(10, [{ value: Cat.Attack.Features.Damages, dim: 0 }])
			.setUsages(1)
			.setStamina(15);

		this.def = new Cat.Defence()
			.setName("DODGE")
			.setDescription("DODGE_DESCRIPTION")
			.setIcon("💨")
			.setDodgePer(50)
			.setStamina(10);
	}
}

module.exports = DevilCat;
