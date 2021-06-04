/// @ts-check
/// <reference path="../node_modules/@types/p5/global.d.ts" />

import * as clock from "./app/clock"

import Game from "./game"

document.addEventListener("contextmenu", (event) => event.preventDefault())

let game: Game

export function setup() {
  createCanvas(
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  )

  game = new Game()

  clock.tick.bind(game.update.bind(game))()
}

export function draw() {
  game.draw()
}

export function keyPressed() {
  game.keyPressed()
}
export function keyReleased() {
  game.keyReleased()
}

export function mousePressed() {
  game.mousePressed()
}
export function mouseReleased() {
  game.mouseReleased()
}

export function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}
