const Cat = require("../Cat");

class SiameseCat extends Cat {
  static id = "SiameseCat";
  static name = "SIAMESE";
  static image = "cat_4.png";
  static rarity = Cat.Rarities.Common;

  constructor() {
    super({
      id: SiameseCat.id,
      name: SiameseCat.name,
      image: SiameseCat.image,
      rarity: SiameseCat.rarity,
    });
  }
}

module.exports = SiameseCat;