const Cat = require("../Cat");

class BlackCat extends Cat {
  static id = "BlackCat";
  static name = "BLACK_CAT";
  static image = "cat_2.png";
  static rarity = Cat.Rarities.Common;

  constructor() {
    super({
      id: BlackCat.id,
      name: BlackCat.name,
      image: BlackCat.image,
      rarity: BlackCat.rarity,
    });
  }
}

module.exports = BlackCat;