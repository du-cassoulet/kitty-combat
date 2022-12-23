const Cat = require("../Cat");

class FrenchCat extends Cat {
  static id = "FrenchCat";
  static name = "FRENCH_CAT";
  static image = "cat_16.png";
  static rarity = Cat.Rarities.Common;

  constructor() {
    super({
      id: FrenchCat.id,
      name: FrenchCat.name,
      image: FrenchCat.image,
      rarity: FrenchCat.rarity,
    });
  }
}

module.exports = FrenchCat;