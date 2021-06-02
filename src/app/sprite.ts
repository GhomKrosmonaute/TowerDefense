import * as space from "./space"

export const defaultSprite: Sprite = (angle, position) => {
  ellipse(...position, 40)
}

export type Sprite = (angle: number, position: space.Vector) => unknown
