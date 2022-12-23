const Cat = require("../Cat");

class ExplosiveCat extends Cat {
  static id = "ExplosiveCat";
  static name = "EXPLOSIVE_CAT";
  static image = "cat_18.png";
  static rarity = Cat.Rarities.Common;

  constructor() {
    super({
      id: ExplosiveCat.id,
      name: ExplosiveCat.name,
      image: ExplosiveCat.image,
      rarity: ExplosiveCat.rarity,
    });
  }
}

module.exports = ExplosiveCat;