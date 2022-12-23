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
  }
}

module.exports = ToxicCat;