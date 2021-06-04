import * as tower from "./app/tower"
import * as power from "./app/power"
import * as bonus from "./app/bonus"
import * as space from "./app/space"
import * as clock from "./app/clock"

export default class Game {
  life = 20
  money = 100
  score = 0
  time = 0
  bonuses = []

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
    drawSelectionRect()
    drawPositionableItems()
  }

  keyPressed() {
    space.place(new tower.Tower(this, space.stickyMouse(), tower.towers[0]))
  }

  keyReleased() {}
}

function drawSelectionRect() {
  noStroke()
  fill(40)
  rect(...space.stickyMouse(), ...space.boxSize)
}

function drawBoard() {
  stroke(50)
  strokeWeight(2)
  fill(20)
  rect(...space.boardPosition(), ...space.boardSize)
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
