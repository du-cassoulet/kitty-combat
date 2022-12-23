const Cat = require("../Cat");

class MagicalCat extends Cat {
  static id = "MagicalCat";
  static name = "MAGIC_CAT";
  static image = "cat_6.png";
  static rarity = Cat.Rarities.Common;

  constructor() {
    super({
      id: MagicalCat.id,
      name: MagicalCat.name,
      image: MagicalCat.image,
      rarity: MagicalCat.rarity,
    });
  }
}

module.exports = MagicalCat;