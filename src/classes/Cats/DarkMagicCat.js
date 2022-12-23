const Cat = require("../Cat");

class DarkMagicCat extends Cat {
  static id = "DarkMagicCat";
  static name = "DARK_MAGIC_CAT";
  static image = "cat_17.png";
  static rarity = Cat.Rarities.Rare;

  constructor() {
    super({
      id: DarkMagicCat.id,
      name: DarkMagicCat.name,
      image: DarkMagicCat.image,
      rarity: DarkMagicCat.rarity,
    });
  }
}

module.exports = DarkMagicCat;