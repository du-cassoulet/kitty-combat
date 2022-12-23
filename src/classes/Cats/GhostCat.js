const Cat = require("../Cat");

class GhostCat extends Cat {
  static id = "GhostCat";
  static name = "GHOST_CAT";
  static image = "cat_12.png";
  static rarity = Cat.Rarities.Common;

  constructor() {
    super({
      id: GhostCat.id,
      name: GhostCat.name,
      image: GhostCat.image,
      rarity: GhostCat.rarity,
    });
  }
}

module.exports = GhostCat;