import * as weapon from "./app/weapon"
import * as power from "./app/power"
import * as bonus from "./app/bonus"
import * as space from "./app/space"
import * as clock from "./app/clock"

export default class Game {
  life = 20
  money = 100
  time = 0
  bonuses = []

  private lastTimeGiven = Date.now()

  get damageMultiplier(): number {
    return 1
  }

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

  update(info: clock.TimeInfo) {}

  draw() {
    drawSelectionRect()
    
    space
      .arrayBoard()
      .filter((item): item is space.Positionable & space.Displayable =>
        space.isDisplayable(item)
      )
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach((item) => item.draw())
  }
}

function drawSelectionRect() {
  background(0)
  fill(20)
  rect(...space.sticky(space.mouse()), ...space.boxSize)
}
