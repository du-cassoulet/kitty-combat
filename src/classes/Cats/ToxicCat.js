const Cat = require("../Cat");

class ToxicCat extends Cat {
	static id = "ToxicCat";
	static name = "TOXIC_CAT";
	static image = "cat_20.png";
	static rarity = Cat.Rarities.Rare;

	constructor() {
		super({
			id: ToxicCat.id,
			name: ToxicCat.name,
			image: ToxicCat.image,
			rarity: ToxicCat.rarity,
		});

		this.atk1 = new Cat.Attack()
			.setName("VENOMOUS_BITE")
			.setDescription("VENOMOUS_BITE_DESCRIPTION")
			.setIcon("1056982214077853798")
			.setDmg(10, 15)
			.setTurns(2, [{ value: Cat.Attack.Features.Damages, dim: 50 }])
			.setStamina(8);

		this.atk2 = new Cat.Attack()
			.setName("POISON")
			.setDescription("POISON_DESCRIPTION")
			.setIcon("☣️")
			.setDmg(10, 10)
			.setTurns(5, [{ value: Cat.Attack.Features.Damages, dim: 0 }])
			.setUsages(1)
			.setStamina(15);
	}
}

module.exports = ToxicCat;
