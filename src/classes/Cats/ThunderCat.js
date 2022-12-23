const Cat = require("../Cat");

class ThunderCat extends Cat {
  static id = "ThunderCat";
  static name = "THUNDER_CAT";
  static image = "cat_11.png";
  static rarity = Cat.Rarities.Rare;

  constructor() {
    super({
      id: ThunderCat.id,
      name: ThunderCat.name,
      image: ThunderCat.image,
      rarity: ThunderCat.rarity,
    });
  }
}

module.exports = ThunderCat;