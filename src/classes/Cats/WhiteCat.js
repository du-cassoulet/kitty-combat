const Cat = require("../Cat");

class WhiteCat extends Cat {
	static id = "WhiteCat";
	static name = "WHITE_CAT";
	static image = "cat_5.png";
	static rarity = Cat.Rarities.Common;

	constructor() {
		super({
			id: WhiteCat.id,
			name: WhiteCat.name,
			image: WhiteCat.image,
			rarity: WhiteCat.rarity,
		});

		this.atk2 = new Cat.Attack()
			.setName("CLAW_STRIKE")
			.setDescription("CLAW_STRIKE_DESCRIPTION")
			.setIcon("1053011873093664839")
			.setDmg(5, 30)
			.setCrit(5, 1.75)
			.setStamina(15)
			.setUsages(2);
	}
}

module.exports = WhiteCat;
