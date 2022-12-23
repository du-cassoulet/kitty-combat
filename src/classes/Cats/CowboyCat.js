const Cat = require("../Cat");

class CowboyCat extends Cat {
  static id = "CowboyCat";
  static name = "COWBOY_CAT";
  static image = "cat_23.png";
  static rarity = Cat.Rarities.Common;

  constructor() {
    super({
      id: CowboyCat.id,
      name: CowboyCat.name,
      image: CowboyCat.image,
      rarity: CowboyCat.rarity,
    });
  }
}

module.exports = CowboyCat;