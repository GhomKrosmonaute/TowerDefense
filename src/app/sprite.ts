import * as space from "./space"

export const defaultTowerSprite: Sprite = (angle, position) => {
  fill("blue")
  noStroke()
  ellipse(...position, ...space.boxSize)
}

export const defaultEnemySprite: Sprite = (angle, position) => {
  fill("red")
  noStroke()
  ellipse(...position, ...space.boxSize)
}

export type Sprite = (angle: number, position: space.Vector) => unknown
