const Cat = require("../Cat");

class CyberCat extends Cat {
	static id = "CyberCat";
	static name = "CYBER_CAT";
	static image = "cat_21.png";
	static rarity = Cat.Rarities.Legendary;

	constructor() {
		super({
			id: CyberCat.id,
			name: CyberCat.name,
			image: CyberCat.image,
			rarity: CyberCat.rarity,
		});

		this.atk1 = new Cat.Attack()
			.setName("ZAP")
			.setDescription("ZAP_DESCRIPTION")
			.setIcon("🔌")
			.setDmg(20, 20)
			.setHeal(0, 5)
			.setStamina(8)
			.setCrit(10, 1.5);

		this.atk2 = new Cat.Attack()
			.setName("RADIO_PULSES")
			.setDescription("RADIO_PULSES_DESCRIPTION")
			.setIcon("☢️")
			.setDmg(20, 25)
			.setCrit(5, 1.5)
			.setTurns(3, [{ value: Cat.Attack.Features.Damages, dim: 50 }])
			.setUsages(2)
			.setStamina(15);

		this.def = new Cat.Defence()
			.setName("NANOBOTS")
			.setDescription("NANOBOTS_DESCRIPTION")
			.setIcon("🔋")
			.setHeal(10, 10)
			.setAbsPer(50)
			.setStamina(5);
	}
}

module.exports = CyberCat;
