import * as space from "./space"

export class Enemy implements space.Positionable, space.Displayable {
  constructor(
    private _life: number,
    public position: space.Vector,
    public zIndex: number
  ) {}

  get life(): number {
    return this._life
  }
  set life(value: number) {
    this._life = value
    if (this._life <= 0) this.kill()
  }

  kill() {
    space.board.delete(this)
  }

  draw() {}
}

export function isEnemy(item: space.Positionable): item is Enemy {
  return item instanceof Enemy
}
