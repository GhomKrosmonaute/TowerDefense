export const board = new Set<Positionable>()
export const boxSize: Vector = [48, 48]
export const boardBoxes: Vector = [15, 10]
export const boardSize: Vector = [
  boxSize[0] * boardBoxes[0],
  boxSize[1] * boardBoxes[1],
]

export function boardPosition(): Vector {
  return sticky([width / 2 - boardSize[0] / 2, height / 2 - boardSize[1] / 2])
}

export function arrayBoard() {
  return [...board]
}

export type Vector = [x: number, y: number]

export function sticky(v: Vector): Vector {
  return mult(
    floor(div(sub(v, div(boxSize, [3, 3])), div(boxSize, [2, 2]))),
    div(boxSize, [2, 2])
  )
}

export function mouse(): Vector {
  return [mouseX, mouseY]
}

export function stickyMouse(): Vector {
  return sticky(
    max(
      min(mouse(), sub(add(boardPosition(), boardSize), div(boxSize, [3, 3]))),
      add(boardPosition(), div(boxSize, [3, 3]))
    )
  )
}

export function min(v1: Vector, v2: Vector): Vector {
  return [Math.min(v1[0], v2[0]), Math.min(v1[1], v2[1])]
}

export function max(v1: Vector, v2: Vector): Vector {
  return [Math.max(v1[0], v2[0]), Math.max(v1[1], v2[1])]
}

export function add(v1: Vector, v2: Vector): Vector {
  return [v1[0] + v2[0], v1[1] + v2[1]]
}

export function sub(v1: Vector, v2: Vector): Vector {
  return [v1[0] - v2[0], v1[1] - v2[1]]
}

export function div(v1: Vector, v2: Vector): Vector {
  return [v1[0] / v2[0], v1[1] / v2[1]]
}

export function mult(v1: Vector, v2: Vector): Vector {
  return [v1[0] * v2[0], v1[1] * v2[1]]
}

export function floor(v: Vector): Vector {
  return [Math.floor(v[0]), Math.floor(v[1])]
}

export function clone(v: Vector): Vector {
  return add(v, [0, 0])
}

export function center(v: Vector): Vector {
  return add(v, div(boxSize, [2, 2]))
}

export function surface(v: Vector): Surface {
  const shift = div(boxSize, [3, 3])
  return [
    sticky(clone(v)), // middle
    sticky(add(v, shift)), // bottom right
    sticky(sub(v, shift)), // top left
    sticky([v[0], v[1] - shift[1]]), // top
    sticky([v[0], v[1] + shift[1]]), // bottom
    sticky([v[0] - shift[0], v[1]]), // left
    sticky([v[0] + shift[0], v[1]]), // right
    sticky([v[0] - shift[0], v[1] + shift[0]]), // bottom left
    sticky([v[0] + shift[0], v[1] - shift[0]]), // top right
  ]
}

export function isSuperimposed(s1: Surface, s2: Surface): boolean {
  return s1.some((v1) => s2.some((v2) => v1.toString() === v2.toString()))
}

export interface Positionable {
  gridSlave: boolean
  position: Vector
}

// prettier-ignore
export type Surface = [
  Vector, Vector, Vector,
  Vector, Vector, Vector,
  Vector, Vector, Vector
]

export function getGridSlaveAt(at: Vector): Positionable | undefined {
  return arrayBoard().find(
    (item) =>
      item.gridSlave &&
      sticky(item.position).toString() === sticky(at).toString()
  )
}

export function getItemsAt(at: Vector): Positionable[] {
  return arrayBoard().filter(
    (item) => sticky(item.position).toString() === sticky(at).toString()
  )
}

export interface Displayable {
  zIndex: number
  draw(): unknown
}

export function isDisplayable(item: object): item is Displayable {
  return "zIndex" in item && "draw" in item
}
