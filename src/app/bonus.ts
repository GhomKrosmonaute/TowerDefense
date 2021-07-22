// accelerators about damages, gold gain, exp, tower resistances

import Game from "../game"
import * as sprite from "./sprite"

export interface BonusConfig {
  sprite: sprite.Sprite
  buff: (game: Game) => unknown
  down: (game: Game) => unknown
}

export class Bonus {
  constructor(public config: BonusConfig) {}
}

export const bonuses = {
  damageUp: new Bonus({
    sprite(angle, [x, y], focus) {
      fill("red")
      if (!focus) noStroke()
      else {
        strokeWeight(3)
        stroke("yellow")
      }
      ellipse(x, y, 20)
    },
    buff(game) {
      game.damage.value += 0.25
    },
    down(game) {
      game.damage.reset()
    },
  }),
}
