import * as space from "./space"
import Game from "../game"

export const defaultOnKill: EnemyHook = (enemy) => {
  enemy.game.money += enemy.base.gain
  enemy.game.score += enemy.base.life
}

export const enemies: BaseEnemy[] = [
  {
    name: "normal",
    life: 1,
    gain: 1,
    speed: 5,
    onKill: defaultOnKill,
  },
]

export interface BaseEnemy {
  name: string
  life: number
  speed: number
  gain: number
  onUpdate?: EnemyHook
  onKill: EnemyHook
}

export type EnemyHook = (enemy: Enemy) => unknown

export class Enemy implements space.Positionable, space.Displayable {
  private _life = 0

  zIndex = 1
  gridSlave = false

  constructor(
    public game: Game,
    public position: space.Vector,
    public readonly base: BaseEnemy
  ) {
    this.life = base.life
  }

  get life(): number {
    return this._life
  }
  set life(value: number) {
    this._life = value
    if (this._life <= 0) this.kill()
  }

  kill() {
    this.base.onKill?.(this)
    space.board.delete(this)
  }

  update() {
    this.base.onUpdate?.(this)
  }

  draw() {}
}

export function isEnemy(item: space.Positionable): item is Enemy {
  return item instanceof Enemy
}
