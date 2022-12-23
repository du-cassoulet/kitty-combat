const Cat = require("../Cat");

class CyberCat extends Cat {
  static id = "CyberCat";
  static name = "CYBER_CAT";
  static image = "cat_21.png";
  static rarity = Cat.Rarities.Legendary;

  constructor() {
    super({
      id: CyberCat.id,
      name: CyberCat.name,
      image: CyberCat.image,
      rarity: CyberCat.rarity,
    });
  }
}

module.exports = CyberCat;