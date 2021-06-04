import * as space from "./space"

export const defaultTowerSprite: Sprite = (angle, position, focus) => {
  if (focus) {
    stroke(200)
    strokeWeight(2)
  } else noStroke()
  fill(50)
  rect(...position, ...space.boxSize, 5)
}

export const defaultEnemySprite: Sprite = (angle, position, focus) => {
  if (focus) {
    stroke(200)
    strokeWeight(2)
  } else noStroke()
  fill("red")
  ellipse(...position, ...space.div(space.boxSize, [2, 2]))
}

export type Sprite = (
  angle: number,
  position: space.Vector,
  focus?: boolean
) => unknown
