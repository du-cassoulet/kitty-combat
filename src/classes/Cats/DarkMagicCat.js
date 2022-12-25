const Cat = require("../Cat");

class DarkMagicCat extends Cat {
	static id = "DarkMagicCat";
	static name = "DARK_MAGIC_CAT";
	static image = "cat_17.png";
	static rarity = Cat.Rarities.Rare;

	constructor() {
		super({
			id: DarkMagicCat.id,
			name: DarkMagicCat.name,
			image: DarkMagicCat.image,
			rarity: DarkMagicCat.rarity,
		});

		this.atk1 = new Cat.Attack()
			.setName("FELINE_FURY")
			.setDescription("FELINE_FURY_DESCRIPTION")
			.setIcon("🪄")
			.setDmg(10, 15)
			.setAbsPer(25)
			.setCrit(0, 1.5)
			.setStamina(5);

		this.atk2 = new Cat.Attack()
			.setName("NINE_LIVES_STRIKE")
			.setDescription("NINE_LIVES_STRIKE_DESCRIPTION")
			.setIcon("☄️")
			.setDmg(25, 25)
			.setTurns(2, [{ value: Cat.Attack.Features.Crit }])
			.setStamina(15)
			.setUsages(2);
	}
}

module.exports = DarkMagicCat;
