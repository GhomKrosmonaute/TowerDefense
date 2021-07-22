import Game from "../Game"
import * as types from "./types"
import Wall from "./Wall"
import p5 = require("p5")
import Enemy from "./Enemy"

export interface GridOptions {
  width: number
  height: number
  columns: number
  rows: number
}

export default class Grid {
  static items = new Set<types.GridItem>()

  static get walls(): Wall[] {
    return Array.from(this.items).filter((item): item is Wall => {
      return item instanceof Wall
    })
  }

  static get enemies(): Enemy[] {
    return Array.from(this.items).filter((item): item is Enemy => {
      return item instanceof Enemy
    })
  }

  public width: number
  public height: number
  public columns: number
  public rows: number
  public start: p5.Vector
  public exit: p5.Vector

  get cellWidth(): number {
    return this.width / this.columns
  }

  get cellHeight(): number {
    return this.height / this.rows
  }

  constructor(public game: Game, options: GridOptions) {
    this.width = options.width
    this.height = options.height
    this.columns = options.columns
    this.rows = options.rows
    this.start = createVector(0, Math.round((this.rows - 1) / 2))
    this.exit = createVector(this.columns - 1, Math.round((this.rows - 1) / 2))
  }

  draw(options: types.DrawOptions) {
    this.drawItems(Array.from(Grid.items), options)
  }

  drawItem(item: types.GridItem, options: types.DrawOptions) {
    const screen = this.getGridPositionOf(item)
    translate(screen.x, screen.y)
    item.draw(options)
    translate(-screen.x, -screen.y)
  }

  drawItems(items: types.GridItem[], options: types.DrawOptions) {
    items
      .sort((a, b) => a.position.z - b.position.z)
      .forEach((item) => {
        this.drawItem(item, options)
      })
  }

  getGridPositionOf(item: types.GridItem) {
    return createVector(
      item.position.x * this.cellWidth,
      item.position.y * this.cellHeight
    )
  }

  onUpdated() {
    Grid.enemies.forEach((enemy) => enemy.refreshPath())
  }
}
