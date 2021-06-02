/// @ts-check
/// <reference path="../node_modules/@types/p5/global.d.ts" />

import Game from "./app/game"

document.addEventListener("contextmenu", (event) => event.preventDefault())

let game: Game

export function setup() {
  createCanvas(
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  )

  game = new Game()
}

export function draw() {
  game.draw()
}

export function keyPressed() {}
export function keyReleased() {}
