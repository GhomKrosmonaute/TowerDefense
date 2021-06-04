import * as space from "./space"

export const defaultTowerSprite: Sprite = (angle, position) => {
  noStroke()
  fill(50)
  ellipse(...position, ...space.boxSize)
}

export const defaultEnemySprite: Sprite = (angle, position) => {
  noStroke()
  fill("red")
  ellipse(...position, ...space.div(space.boxSize, [2, 2]))
}

export type Sprite = (angle: number, position: space.Vector) => unknown
