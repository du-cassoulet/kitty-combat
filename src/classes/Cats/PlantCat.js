const Cat = require("../Cat");

class PlantCat extends Cat {
  static id = "PlantCat";
  static name = "PLANT_CAT";
  static image = "cat_10.png";
  static rarity = Cat.Rarities.Rare;

  constructor() {
    super({
      id: PlantCat.id,
      name: PlantCat.name,
      image: PlantCat.image,
      rarity: PlantCat.rarity,
    });
  }
}

module.exports = PlantCat;