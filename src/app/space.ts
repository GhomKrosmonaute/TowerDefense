export const board = new Set<Positionable>()

export const boxSize: Vector = [48, 48]

export function arrayBoard() {
  return [...board]
}

export type Vector = [x: number, y: number]

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
