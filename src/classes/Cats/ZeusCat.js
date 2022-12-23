const Cat = require("../Cat");

class ZeusCat extends Cat {
  static id = "ZeusCat";
  static name = "ZEUS_CAT";
  static image = "cat_13.png";
  static rarity = Cat.Rarities.Legendary;

  constructor() {
    super({
      id: ZeusCat.id,
      name: ZeusCat.name,
      image: ZeusCat.image,
      rarity: ZeusCat.rarity,
    });
  }
}

module.exports = ZeusCat;