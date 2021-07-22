import * as space from "./space"
import * as sprite from "./sprite"

import Game from "../game"
import * as buff from "./buff"

export const defaultOnKill: EnemyHook = (enemy) => {
  enemy.game.money += enemy.options.gain
  enemy.game.score += enemy.options.life
}

export const enemies: EnemyOptions[] = [
  {
    name: "normal",
    life: 1,
    gain: 1,
    speed: 5,
    onKill: defaultOnKill,
    sprite: sprite.defaultEnemySprite,
  },
]

export interface EnemyOptions {
  name: string
  life: number
  speed: number
  gain: number
  onUpdate?: EnemyHook
  onKill?: EnemyHook
  sprite: sprite.Sprite
}

export type EnemyHook = (enemy: Enemy) => unknown

export class Enemy implements space.Positionable, space.Displayable {
  private _life: buff.BuffAbleNumber

  zIndex = 1
  gridSlave = false

  constructor(
    public game: Game,
    public position: space.Vector,
    public readonly options: EnemyOptions
  ) {
    this._life = new buff.BuffAbleNumber(options.life)
  }

  get life(): number {
    return this._life.value
  }
  set life(value: number) {
    this._life.value = value
    if (this._life.value <= 0) this.kill()
  }

  kill() {
    this.options.onKill?.(this)
    space.board.delete(this)
  }

  update() {
    this.options.onUpdate?.(this)
  }

  draw() {}
}

export function isEnemy(item: space.Positionable): item is Enemy {
  return item instanceof Enemy
}
