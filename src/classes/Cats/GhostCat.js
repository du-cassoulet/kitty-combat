const Cat = require("../Cat");

class GhostCat extends Cat {
	static id = "GhostCat";
	static name = "GHOST_CAT";
	static image = "cat_12.png";
	static rarity = Cat.Rarities.Common;

	constructor() {
		super({
			id: GhostCat.id,
			name: GhostCat.name,
			image: GhostCat.image,
			rarity: GhostCat.rarity,
		});

		this.atk2 = new Cat.Attack()
			.setName("HAUNT")
			.setDescription("HAUNT_DESCRIPTION")
			.setIcon("👻")
			.setDmg(
				() => (this.opponent?.health || 100) * 0.1,
				() => (this.opponent?.health || 100) * 0.1
			)
			.setHeal(
				() => (this.opponent?.health || 100) * 0.1,
				() => (this.opponent?.health || 100) * 0.1
			)
			.setStamina(15)
			.setUsages(2);
	}
}

module.exports = GhostCat;
