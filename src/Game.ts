import * as clock from "./system/clock"
import Grid, { GridOptions } from "./app/Grid"
import Enemy from "./app/Enemy"

interface GameOptions {
  gridOptions: GridOptions
}

export default class Game {
  public grid: Grid
  public enemy: Enemy

  constructor(options: GameOptions) {
    this.grid = new Grid(this, options.gridOptions)

    this.enemy = new Enemy(this, {
      position: this.grid.start,
      updateInterval: 500,
      onDraw: () => {
        fill("red")
        noStroke()
        ellipse(0, 0, this.grid.cellWidth, this.grid.cellHeight)
      },
    })
  }

  update(info: clock.TimeInfo) {}

  draw() {
    background(0)
  }

  keyPressed() {}

  keyReleased() {}

  mousePressed() {}

  mouseReleased() {}
}
