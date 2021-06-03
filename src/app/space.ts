export const board = new Set<Positionable>()
export const boxSize: Vector = [48, 48]
export const boardPosition: Vector = [0, 0]
export const boardBoxes: Vector = [20, 20]
export const boardSize: Vector = [
  boxSize[0] * boardBoxes[0],
  boxSize[1] * boardBoxes[1],
]

export function arrayBoard() {
  return [...board]
}

export type Vector = [x: number, y: number]

export function sticky(v: Vector): Vector {
  return sub(floor(div(v, boxSize)), boxSize)
}

export function mouse(): Vector {
  return [mouseX, mouseY]
}

export function boardMouse(): Vector {
  return add(mouse(), boardPosition)
}

export function add(v1: Vector, v2: Vector): Vector {
  return [v1[0] + v2[0], v1[1] + v2[1]]
}

export function sub(v1: Vector, v2: Vector): Vector {
  return [v1[0] * v2[0], v1[1] * v2[1]]
}

export function div(v1: Vector, v2: Vector): Vector {
  return [v1[0] / v2[0], v1[1] / v2[1]]
}

export function floor(v: Vector): Vector {
  return [Math.floor(v[0]), Math.floor(v[1])]
}

export function clone(position: Vector): Vector {
  return add(position, [0, 0])
}

export interface Positionable {
  gridSlave: boolean
  position: Vector
}

export function getAt(
  at: Vector,
  gridSlave?: boolean
): Positionable | undefined {
  return arrayBoard().find(
    (item) =>
      (gridSlave === undefined || item.gridSlave === gridSlave) &&
      item.position.toString() === at.toString()
  )
}

export function setAt(item: Positionable) {
  if (item.gridSlave)
    arrayBoard().forEach((boardItem) => {
      if (
        boardItem.gridSlave &&
        boardItem.position.toString() === item.position.toString()
      ) {
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
