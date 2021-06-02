import * as weapon from "./weapon"
import * as space from "./space"

export default class Game {
  life = 20
  money = 100

  constructor() {
    space.board.clear()
  }

  buyWeapon() {}

  upgradeWeapon(item: weapon.Weapon): boolean {
    const nextLevel = item.base[item.level + 1]
    if (!nextLevel) return false
    this.money -= nextLevel.cost
    item.level++
    return true
  }

  draw() {}
}
