import * as tower from "./app/tower"
import * as power from "./app/power"
import * as bonus from "./app/bonus"
import * as space from "./app/space"
import * as clock from "./app/clock"
import * as shop from "./app/shop"

export default class Game {
  life = 20
  money = 100
  score = 0
  time = 0
  bonuses = []

  selectedTower?: tower.BaseTower
  pressedAt?: space.Vector

  private lastTimeGiven = Date.now()

  get damageMultiplier(): number {
    return 1
  }

  constructor() {
    space.board.clear()
  }

  update(info: clock.TimeInfo) {}

  draw() {
    background(0)

    drawBoard()
    //drawSpawn()
    drawSelectionRect()
    drawPositionableItems()

    shop.draw(this.selectedTower)
  }

  keyPressed() {}

  keyReleased() {}

  mousePressed() {
    this.pressedAt = space.boardStickyMouse()
  }

  mouseReleased() {
    const selection = shop.getSelection()

    if (selection) {
      this.selectedTower = selection
    } else {
      const releasedAt = space.boardStickyMouse()

      if (
        this.pressedAt?.toString() === releasedAt.toString() &&
        this.selectedTower
      ) {
        if (
          !space
            .arrayBoard()
            .some((item) =>
              space.isSuperimposed(
                space.surface(releasedAt),
                space.surface(item.position)
              )
            )
        ) {
          space.board.add(
            new tower.Tower(this, space.boardStickyMouse(), this.selectedTower)
          )
          //delete this.selectedTower
        }
      }
    }
  }
}

function drawBoard() {
  stroke(50)
  strokeWeight(2)
  fill(20)
  rect(...space.boardPosition(), ...space.boardSize)
}

// function drawSpawn() {
//   noStroke()
//   fill(50)
//   rect(...space.spawnZone())
// }

function drawSelectionRect() {
  noStroke()
  fill(40)
  rect(...space.boardStickyMouse(), ...space.boxSize)
}

function drawPositionableItems() {
  space
    .arrayBoard()
    .filter((item): item is space.Positionable & space.Displayable =>
      space.isDisplayable(item)
    )
    .sort((a, b) => a.zIndex - b.zIndex)
    .forEach((item) => item.draw())
}
