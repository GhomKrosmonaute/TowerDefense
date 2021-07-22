// god powers: meteorites, god rays, seismes

import Game from "../game"
import * as sprite from "./sprite"

export interface PowerConfig {
  sprite: sprite.Sprite
  use: (game: Game) => unknown
}

export class Power {
  constructor(public config: PowerConfig) {}
}

export const powers = {
  meteorites: new Power({
    sprite(angle, [x, y], focus) {
      fill("purple")
      if (!focus) noStroke()
      else {
        strokeWeight(3)
        stroke("yellow")
      }
      ellipse(x, y, 20)
    },
    use(game) {
      // drop meteorites randomly on the map for 5s
    },
  }),
}
