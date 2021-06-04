import * as enemy from "./enemy"
import * as space from "./space"
import * as sprite from "./sprite"

import Game from "../game"

export const defaultEffect: TowerEffect = (game, weapon, enemy) => {
  enemy.life -= weapon.damage * game.damageMultiplier
}

export const towers: BaseTower[] = [
  [
    {
      name: "Pellet",
      cost: 5,
      rate: 0.5 / 60, // un tir toutes les deux secondes
      damage: 10,
      range: 10,
      sellCost: 10,
      sprite: sprite.defaultTowerSprite,
      critical: 0.1, // une chance sur dix de faire un critique
      effect: defaultEffect,
    },
  ],
]

export type BaseTower = TowerLevel[]

export interface TowerLevel {
  name: string
  rate: number
  damage: number
  cost: number
  sellCost: number
  sprite: sprite.Sprite
  range: number
  critical: number
  effect: TowerEffect
}

export class Tower implements space.Positionable, space.Displayable {
  private _level = 0

  zIndex = 1
  angle = 0
  gridSlave = false

  get level(): TowerLevel {
    return this.base[this._level]
  }

  constructor(
    public game: Game,
    public position: space.Vector,
    public readonly base: BaseTower
  ) {}

  upgrade() {
    const nextLevel = this.base[this._level + 1]
    if (!nextLevel) return false
    this.game.money -= nextLevel.cost
    this._level++
    return true
  }

  update() {}

  draw() {
    this.level.sprite(this.angle, this.position)
  }
}

export function isTower(item: space.Positionable): item is Tower {
  return "base" in item && "level" in item
}

export type TowerEffect = (
  game: Game,
  tower: TowerLevel,
  enemy: enemy.Enemy
) => unknown
