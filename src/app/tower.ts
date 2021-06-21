import * as enemy from "./enemy"
import * as space from "./space"
import * as sprite from "./sprite"

import Game from "../game"

export const defaultEffect: TowerEffect = (game, weapon, enemy) => {
  enemy.life -= weapon.damage * game.damageMultiplier
}

export const towerRates = {
  slow: 0.5 / 60, // un tir toutes les deux secondes
}

export const towerRanges = {
  60: space.boxSize[0] * 3,
  180: space.boxSize[0] * 7,
}

export const towers: BaseTower[] = [
  [
    {
      // 0
      name: "Pellet",
      cost: 5,
      rate: towerRates.slow,
      damage: 10,
      range: towerRanges["60"],
      sellCost: 3,
      sprite: sprite.defaultTowerSprite,
      critical: 0.1, // une chance sur dix de faire un critique
      effect: defaultEffect,
    },
    {
      // 1
      name: "Pellet",
      cost: 10,
      rate: towerRates.slow,
      damage: 20,
      range: towerRanges["60"],
      sellCost: 7,
      sprite: sprite.defaultTowerSprite,
      critical: 0.1, // une chance sur dix de faire un critique
      effect: defaultEffect,
    },
    {
      // 2
      name: "Pellet",
      cost: 20,
      rate: towerRates.slow,
      damage: 40,
      range: towerRanges["60"],
      sellCost: 15,
      sprite: sprite.defaultTowerSprite,
      critical: 0.1, // une chance sur dix de faire un critique
      effect: defaultEffect,
    },
    {
      // 3
      name: "Pellet",
      cost: 40,
      rate: towerRates.slow,
      damage: 80,
      range: towerRanges["60"],
      sellCost: 30,
      sprite: sprite.defaultTowerSprite,
      critical: 0.1, // une chance sur dix de faire un critique
      effect: defaultEffect,
    },
    {
      // 4
      name: "Pellet",
      cost: 80,
      rate: towerRates.slow,
      damage: 160,
      range: towerRanges["60"],
      sellCost: 60,
      sprite: sprite.defaultTowerSprite,
      critical: 0.1, // une chance sur dix de faire un critique
      effect: defaultEffect,
    },
    {
      // 5
      name: "Sniper",
      cost: 120,
      rate: towerRates.slow,
      damage: 400,
      range: towerRanges["180"],
      sellCost: 30,
      sprite: sprite.defaultTowerSprite,
      critical: 0.1, // une chance sur dix de faire un critique
      effect: defaultEffect,
    },
  ],
  [
    {
      name: "Squirt",
      cost: 15,
      rate: 2 / 60, // deux tirs par seconde
      damage: 5,
      range: space.boxSize[0] * 3,
      sellCost: 10,
      sprite: sprite.defaultTowerSprite,
      critical: 0.05,
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
  gridSlave = true

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

  update() {
    // shot enemies
  }

  draw() {
    if (this.position.toString() === space.boardStickyMouse().toString())
      this.drawRange()
    this.level.sprite(this.angle, this.position)
  }

  drawRange() {
    strokeWeight(2)
    stroke(255, 215, 0, 50)
    fill(255, 215, 0, 30)
    circle(...space.center(this.position), this.level.range * 2)
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
