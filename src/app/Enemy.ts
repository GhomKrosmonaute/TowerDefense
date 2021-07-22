import p5 = require("p5")
import Game from "../Game"
import Grid from "./Grid"
import * as pf from "pathfinding"
import * as types from "./types"

export interface EnemyOptions {
  position: p5.Vector
  updateInterval: number
  onUpdate?: types.UpdateFunction
  onDraw: types.DrawFunction
}

export default class Enemy implements types.GridItem, types.UpdatedItem {
  position: p5.Vector
  updateInterval: number
  draw: types.DrawFunction
  path: p5.Vector[] = []

  constructor(public game: Game, private options: EnemyOptions) {
    this.position = options.position.copy()
    this.updateInterval = options.updateInterval
    this.draw = options.onDraw
    this.refreshPath()
    Grid.items.add(this)
  }

  refreshPath() {
    const matrix: number[][] = []
    for (let row = 0; row < this.game.grid.rows; row++)
      matrix.push(new Array(this.game.grid.columns).fill(0))

    for (const wall of Grid.walls) matrix[wall.position.y][wall.position.x] = 1

    const grid = new pf.Grid(matrix)
    const finder = new pf.AStarFinder()

    this.path = finder
      .findPath(
        this.position.x,
        this.position.y,
        this.game.grid.exit.x,
        this.game.grid.exit.y,
        grid
      )
      .map((position) => createVector(...position))
  }

  /**
   *
   * @param game
   */
  update(game: Game) {
    this.options.onUpdate(game)

    const targetCell = this.path.shift()

    if (!targetCell) return

    const lastCell = this.position.copy()

    let i = 0
    const fpi = 10

    const animation = setInterval(() => {
      this.position.x = map(i, 0, fpi, lastCell.x, targetCell.x)
      this.position.y = map(i, 0, fpi, lastCell.y, targetCell.y)
      i++
    }, this.updateInterval / fpi)

    setTimeout(() => {
      clearInterval(animation)
      this.position.set(targetCell)
    }, this.updateInterval)
  }
}
