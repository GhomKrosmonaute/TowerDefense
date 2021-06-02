import * as space from "./space"

export const defaultSprite: Sprite = (angle, position) => {
  ellipse(...position, ...space.boxSize)
}

export type Sprite = (angle: number, position: space.Vector) => unknown
