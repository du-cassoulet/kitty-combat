const Cat = require("../Cat");

class FatCat extends Cat {
  static id = "FatCat";
  static name = "FAT_CAT";
  static image = "cat_1.png";
  static rarity = Cat.Rarities.Common;

  constructor() {
    super({
      id: FatCat.id,
      name: FatCat.name,
      image: FatCat.image,
      rarity: FatCat.rarity,
    });
  }
}

module.exports = FatCat;