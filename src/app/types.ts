import p5 = require("p5")
import Game from "../Game"

export interface UpdatedItem {
  updateInterval: number
  update: UpdateFunction
}

export interface GridItem {
  position: p5.Vector
  draw: DrawFunction
}

export interface DrawOptions {
  focused: boolean
  themeColor: p5.Color
}

export type DrawFunction = (options: DrawOptions) => void

export type UpdateFunction = (game: Game) => void
