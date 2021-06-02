export const weapons: Weapon[] = [
  [
    {
      name: "Bruh",
      cost: 10,
      rate: 10,
      damage: 10,
      range: 10,
      sellCost: 10,
      sprite: "",
    },
  ],
]

export type Weapon = WeaponLevel[]

export interface WeaponLevel {
  name: string
  rate: number
  damage: number
  cost: number
  sellCost: number
  sprite: string
  range: number
}
