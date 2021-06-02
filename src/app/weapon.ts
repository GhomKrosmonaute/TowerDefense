import * as enemy from "./enemy"
import * as space from "./space"
import * as sprite from "./sprite"

export const defaultEffect: WeaponEffect = (weapon, enemy) => {
  enemy.life -= weapon.damage
}

export const weapons: BaseWeapon[] = [
  [
    {
      name: "Sniper",
      cost: 5,
      rate: 0.5 / 60, // un tir toutes les deux secondes
      damage: 10,
      range: 10,
      sellCost: 10,
      sprite: sprite.defaultSprite,
      critical: 0.1, // une chance sur deux de faire un critique
      effect: defaultEffect,
    },
  ],
]

export type BaseWeapon = WeaponLevel[]

export interface WeaponLevel {
  name: string
  rate: number
  damage: number
  cost: number
  sellCost: number
  sprite: sprite.Sprite
  range: number
  critical: number
  effect: WeaponEffect
}

export function resolve(weapon: Weapon): WeaponLevel {
  return weapon.base[weapon.level]
}

export interface Weapon extends space.Positionable {
  base: BaseWeapon
  level: number
}

export function isWeapon(item: space.Positionable): item is Weapon {
  return "base" in item && "level" in item
}

export type WeaponEffect = (weapon: WeaponLevel, enemy: enemy.Enemy) => unknown