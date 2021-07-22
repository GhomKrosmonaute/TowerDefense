import p5 = require("p5")
import Game from "../Game"
import * as types from "./types"
import Grid from "./Grid"

export interface WallOptions {
  position: p5.Vector
}

export default class Wall implements types.GridItem {
  position: p5.Vector

  constructor(public game: Game, options: WallOptions) {
    this.position = options.position.copy()
    Grid.items.add(this)
  }

  draw(options: types.DrawOptions) {
    noStroke()
    fill("orange")
    rect(0, 0, this.game.grid.cellWidth, this.game.grid.cellHeight)
  }
}
