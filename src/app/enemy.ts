import Game from "../game"
import * as space from "./space"

export interface BaseEnemy {
  life: number
  speed: number
  gain: number
  onUpdate?: (this: Enemy) => unknown
  onKill?: (this: Enemy) => unknown
}

export class Enemy implements space.Positionable, space.Displayable {
  private _life = 0

  zIndex = 1
  gridSlave = false

  constructor(public position: space.Vector, public readonly base: BaseEnemy) {}

  get life(): number {
    return this._life
  }
  set life(value: number) {
    this._life = value
    if (this._life <= 0) this.kill()
  }

  kill() {
    this.base.onKill?.bind(this)()
    space.board.delete(this)
  }

  update() {
    this.base.onUpdate?.bind(this)()
  }

  draw() {}
}

export function isEnemy(item: space.Positionable): item is Enemy {
  return item instanceof Enemy
}
