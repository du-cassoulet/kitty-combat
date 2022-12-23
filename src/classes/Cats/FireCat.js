const Cat = require("../Cat");

class FireCat extends Cat {
  static id = "FireCat";
  static name = "FIRE_CAT";
  static image = "cat_8.png";
  static rarity = Cat.Rarities.Rare;

  constructor() {
    super({
      id: FireCat.id,
      name: FireCat.name,
      image: FireCat.image,
      rarity: FireCat.rarity,
    });
  }
}

module.exports = FireCat;