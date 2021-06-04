import * as tower from "./tower"
import * as space from "./space"
import * as bonus from "./bonus"
import * as power from "./power"

export const shopWidth = 100

export function getSelection(): tower.BaseTower | undefined {
  // | bonus.Bonus | power.Power
  if (mouseX < width - shopWidth) return undefined
  return tower.towers[Math.floor(mouseY / shopWidth)] ?? undefined
}

export function draw(selected?: tower.BaseTower) {
  drawTowers(selected)
  drawPowers()
  drawBonuses()
}

export function drawTowers(selected?: tower.BaseTower) {
  noStroke()
  fill(20)
  rect(
    width - shopWidth,
    0,
    shopWidth,
    shopWidth * tower.towers.length,
    shopWidth / 4
  )

  tower.towers.forEach((base, i) => {
    base[0].sprite(
      0,
      [
        width - shopWidth / 2 - space.boxSize[0] / 2,
        shopWidth / 2 - space.boxSize[1] / 2 + i * shopWidth,
      ],
      selected === base
    )
  })
}

export function drawBonuses() {}

export function drawPowers() {}
