const Cat = require("../Cat");

class CowboyCat extends Cat {
	static id = "CowboyCat";
	static name = "COWBOY_CAT";
	static image = "cat_23.png";
	static rarity = Cat.Rarities.Common;

	constructor() {
		super({
			id: CowboyCat.id,
			name: CowboyCat.name,
			image: CowboyCat.image,
			rarity: CowboyCat.rarity,
		});

		this.atk2 = new Cat.Attack()
			.setName("BANG")
			.setDescription("BANG_DESCRIPTION")
			.setIcon("🔫")
			.setDmg(1, 5)
			.setCrit(50, 10)
			.setUsages(1)
			.setStamina(25);
	}
}

module.exports = CowboyCat;
