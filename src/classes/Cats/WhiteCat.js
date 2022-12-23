const Cat = require("../Cat");

class WhiteCat extends Cat {
  static id = "WhiteCat";
  static name = "WHITE_CAT";
  static image = "cat_5.png";
  static rarity = Cat.Rarities.Common;

  constructor() {
    super({
      id: WhiteCat.id,
      name: WhiteCat.name,
      image: WhiteCat.image,
      rarity: WhiteCat.rarity,
    });
  }
}

module.exports = WhiteCat;