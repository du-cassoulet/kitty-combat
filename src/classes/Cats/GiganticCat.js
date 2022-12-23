const Cat = require("../Cat");

class GiganticCat extends Cat {
  static id = "GiganticCat";
  static name = "GIGANTIC_CAT";
  static image = "cat_19.png";
  static rarity = Cat.Rarities.Common;

  constructor() {
    super({
      id: GiganticCat.id,
      name: GiganticCat.name,
      image: GiganticCat.image,
      rarity: GiganticCat.rarity,
    });
  }
}

module.exports = GiganticCat;