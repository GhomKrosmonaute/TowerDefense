export const board = new Set<Positionable>()
export const boxSize: Vector = [48, 48]
export const boardBoxes: Vector = [20, 20]
export const boardSize: Vector = [
  boxSize[0] * boardBoxes[0],
  boxSize[1] * boardBoxes[1],
]

export function arrayBoard() {
  return [...board]
}

export type Vector = [x: number, y: number]

export function sticky(position: Vector): Vector {
  return [
    Math.floor(position[0] / boxSize[0]) * boxSize[0],
    Math.floor(position[1] / boxSize[1]) * boxSize[1],
  ]
}

export function mouse(): Vector {
  return [mouseX, mouseY]
}

export function clone(position: Vector): Vector {
  return [position[0], position[1]]
}

export interface Positionable {
  position: Vector
}

export function getAt(at: Vector): Positionable | undefined {
  return arrayBoard().find((item) => item.position.toString() === at.toString())
}

export function setAt(item: Positionable) {
  arrayBoard().forEach((boardItem) => {
    if (boardItem.position.toString() === item.position.toString()) {
      board.delete(boardItem)
    }
  })
  board.add(item)
}

export interface Displayable {
  zIndex: number
  draw(): unknown
}

export function isDisplayable(item: object): item is Displayable {
  return "zIndex" in item && "draw" in item
}
